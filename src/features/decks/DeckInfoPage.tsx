import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp,
    updateDoc,
    query,
    orderBy
} from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { db } from "../../lib/firebase"
import { useAuth } from "../auth/AuthProvider"

import { EditDeckModal } from "./EditDeckModal.tsx"
import CardDisplay from "./components/ui/CardDisplay.tsx"

import type { Deck } from "../../data_types/deck.js"
import type { Card } from "../../data_types/card.ts"
import { updateDeckAccess } from "../homepage/hooks/useDeckInfo.ts"

export function DeckInfoPage() {
    const { deckId } = useParams()
    const { user } = useAuth()

    const [deck, setDeck] = useState<Deck | null>(null)
    const [cards, setCards] = useState<Card[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        if (!user || !deckId) {
            setIsLoading(false)
            return
        }

        const deckReference = doc(
            db,
            "users",
            user.uid,
            "decks",
            deckId
        )

        const unsubscribeDeck = onSnapshot(
            deckReference,
            (snapshot) => {
                if (snapshot.exists()) {
                    setDeck({
                        id: snapshot.id,
                        title: snapshot.data().title,
                        description: snapshot.data().description,
                        color: snapshot.data().color,
                        subject: snapshot.data().subject,
                        isFavorite: snapshot.data().isFavorite,
                        lastAccessedAt: snapshot.data().lastAccessedAt,
                        lastStudiedAt: snapshot.data().lastStudiedAt
                    })
                } else {
                    setDeck(null)
                }

                setIsLoading(false)
            },
            () => {
                setError("Unable to load this deck.")
                setIsLoading(false)
            }
        )

        const cardsReference = query(
            collection(
                db,
                "users",
                user.uid,
                "decks",
                deckId,
                "cards"
            ),
            orderBy("order")
        )

        const unsubscribeCards = onSnapshot(
            cardsReference,
            (snapshot) => {
                const nextCards = snapshot.docs.map((document) => ({
                    id: document.id,
                    term: document.data().term,
                    definition: document.data().definition,
                    order: document.data().order,
                    isNew: false
                }))

                setCards(nextCards)
                setIsLoading(false)
            },
            () => {
                setError("Unable to load cards.")
                setIsLoading(false)
            }
        )

        return () => {
            unsubscribeDeck()
            unsubscribeCards()
        }
    }, [user, deckId])

    useEffect(() => {
        if (!user || !deckId) return

        updateDeckAccess(user.uid, deckId)
    }, [user, deckId])

    const filteredCards = cards.filter((card) => {
        const query = searchQuery.toLowerCase().trim()

        return (
            card.term.toLowerCase().includes(query) ||
            card.definition.toLowerCase().includes(query)
        )
    })

    if (isLoading) {
        return <p>Loading deck…</p>
    }

    if (error) {
        return <p role="alert">{error}</p>
    }

    if (!deck) {
        return (
            <section>
                <h1>Deck not found</h1>
                <Link to="/decks">Back to decks</Link>
            </section>
        )
    }

    async function saveDeck(edits: {
        title: string
        description: string
        subject: string
        color: string
    }) {
        if (!user || !deckId) return

        const deckReference = doc(
            db,
            "users",
            user.uid,
            "decks",
            deckId
        )

        await updateDoc(deckReference, {
            ...edits,
            updatedAt: serverTimestamp()
        })
    }

    const deleteDeck = async () => {
        if (!user || !deckId) return

        try {
            await Promise.all(
                cards.map(async (card) => {
                    const cardReference = doc(
                        db,
                        "users",
                        user.uid,
                        "decks",
                        deckId,
                        "cards",
                        card.id
                    )

                    await deleteDoc(cardReference)
                })
            )

            const deckReference = doc(
                db,
                "users",
                user.uid,
                "decks",
                deckId
            )

            await deleteDoc(deckReference)
        } catch {
            setError("Unable to delete deck.")
        }
    }

    return (
        <section className="max-w-6xl px-8 py-8">

            {/* Back */}
            <Link
                to="/decks"
                className="
                    inline-block text-sm text-text/50
                    transition-transform duration-200
                    hover:scale-105 hover:text-text
                "
            >
                ← Back to decks
            </Link>

            {/* Deck header */}
            <header className="mt-6 flex items-start justify-between gap-6">

                <div>
                    <div className="flex items-center gap-4">
                        <h1
                            className="text-4xl font-bold"
                            style={{ color: deck.color }}
                        >
                            {deck.title}
                        </h1>

                        {deck.isFavorite && (
                            <span className="text-lg">
                                ★
                            </span>
                        )}
                    </div>

                    {deck.subject && (
                        <p className="mt-2 text-sm font-medium text-text/50">
                            {deck.subject}
                        </p>
                    )}

                    {deck.description && (
                        <p className="mt-3 max-w-2xl text-text/70">
                            {deck.description}
                        </p>
                    )}
                </div>

                {/* Deck actions */}
                <div className="flex shrink-0 gap-3">

                    <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="
                            bg-surface text-text
                            px-4 py-2 rounded-lg text-sm
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110 hover:-rotate-2
                            hover:bg-accent-2/10 hover:text-accent-2
                            active:scale-90 active:rotate-1
                        "
                    >
                        Edit deck
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="
                            bg-surface text-text
                            px-4 py-2 rounded-lg text-sm
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110 hover:-rotate-2
                            hover:bg-red-500/10 hover:text-red-400
                            active:scale-90 active:rotate-1
                        "
                    >
                        Delete
                    </button>

                </div>
            </header>

            {/* Cards */}
            <div className="mt-10">

                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text">
                        Cards
                    </h2>

                    <span className="text-sm text-text/40">
                        {searchQuery
                            ? `${filteredCards.length} of ${cards.length} ${
                                cards.length === 1 ? "card" : "cards"
                            }`
                            : `${cards.length} ${
                                cards.length === 1 ? "card" : "cards"
                            }`
                        }
                    </span>
                </div>

                {/* Card search */}
                {cards.length > 0 && (
                    <div className="mb-6">
                        <div className="relative w-full max-w-[720px]">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(event) => setSearchQuery(event.target.value)}
                              placeholder="Search your decks..."
                              className="
                                  w-full rounded-xl
                                  border border-divider
                                  bg-surface
                                  py-3 pl-4 pr-10
                                  text-sm text-text
                                  placeholder:text-text/30
                                  transition-all duration-200
                                  focus:border-accent-2
                                  focus:outline-none
                                  focus:ring-0
                                  focus:shadow-[0_0_20px_-10px]
                                  focus:shadow-accent-2/50
                              "
                          />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="
                                        absolute right-3 top-1/2
                                        -translate-y-1/2
                                        rounded-lg px-2 py-1
                                        text-sm text-text/30
                                        transition-transform duration-200
                                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                        hover:scale-110
                                        hover:text-text/70
                                        active:scale-90
                                    "
                                >
                                    ✕
                                </button>
                            )}

                        </div>
                    </div>
                )}

                {cards.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-divider bg-surface/50 px-6 py-10 text-center">
                        <p className="text-text/50">
                            This deck doesn't have any cards yet. Go make some, you nerd.
                        </p>
                    </div>
                ) : filteredCards.length === 0 ? (
                    <div
                        className="
                            flex min-h-48 flex-col items-center justify-center
                            rounded-xl
                            border border-dashed border-divider
                            bg-surface/50
                            text-center
                        "
                    >
                        <div className="mb-3 text-3xl">
                            🔍
                        </div>

                        <h3 className="text-lg font-semibold text-text">
                            No cards found
                        </h3>

                        <p className="mt-2 text-sm text-text/40">
                            Nothing matched "{searchQuery}".
                        </p>

                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="
                                mt-4 rounded-lg
                                border border-divider
                                bg-bg
                                px-4 py-2
                                text-sm text-text/60
                                transition-transform duration-200
                                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                hover:scale-105
                                hover:border-accent-2/50
                                hover:text-text
                                active:scale-95
                            "
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {filteredCards.map((card, index) => (
                            <CardDisplay
                                key={card.id}
                                card={card}
                                index={index}
                                onClick={() =>
                                    navigate(
                                        `/decks/${deck.id}/edit?cardId=${card.id}`
                                    )
                                }
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* Card creation actions */}
            <div className="mt-6 flex gap-3">

                <Link
                    to={`/decks/${deck.id}/edit?addCard=true`}
                    className="
                        bg-surface text-text
                        px-4 py-2 rounded-lg text-sm
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1
                    "
                >
                    ＋ Add card
                </Link>

                <button
                    type="button"
                    onClick={() =>
                        navigate(`/decks/${deck.id}/aiGeneration`)
                    }
                    className="
                        bg-surface text-text
                        px-4 py-2 rounded-lg text-sm
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1
                    "
                >
                    ✦ Generate with AI
                </button>

            </div>

            {/* Study actions */}
            <div className="mt-10 grid grid-cols-2 gap-4">

                <button
                    type="button"
                    disabled={cards.length === 0}
                    onClick={() =>
                        navigate(`/decks/${deck.id}/study`)
                    }
                    className="
                        rounded-xl bg-accent-2
                        px-6 py-4
                        text-left text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-[1.03] hover:-rotate-1
                        active:scale-[0.98]
                        disabled:pointer-events-none
                        disabled:opacity-40
                    "
                >
                    <p className="text-lg font-bold">
                        Study with flashcards
                    </p>

                    <p className="mt-1 text-sm text-text/60">
                        Review your cards
                    </p>
                </button>

                <button
                    type="button"
                    disabled={cards.length === 0}
                    onClick={() =>
                        navigate(`/decks/${deck.id}/quizSetup`)
                    }
                    className="
                        rounded-xl bg-accent-1
                        px-6 py-4
                        text-left text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-[1.03] hover:rotate-1
                        active:scale-[0.98]
                        disabled:pointer-events-none
                        disabled:opacity-40
                    "
                >
                    <p className="text-lg font-bold">
                        Study with a quiz
                    </p>

                    <p className="mt-1 text-sm text-text/60">
                        Test your knowledge
                    </p>
                </button>

            </div>

            <EditDeckModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                deck={deck}
                onSave={saveDeck}
            />

            {/* Delete modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

                    <div className="bg-surface border border-accent-2/40 rounded-xl p-8 w-96 text-center">

                        <h2 className="text-2xl font-bold mb-2">
                            Delete this deck?
                        </h2>

                        <p className="text-text/60 text-sm mt-4">
                            Are you sure you want to delete{" "}
                            <span
                                className="font-medium"
                                style={{ color: deck.color }}
                            >
                                {deck.title}
                            </span>
                            ?
                        </p>

                        <p className="text-text/60 text-sm mt-4 mb-2">
                            This permanently deletes the deck and all of its cards.
                        </p>

                        <p className="text-text/60 text-sm mt-2 mb-4">
                            No backsies.
                        </p>

                        <div className="flex justify-center items-center gap-3">

                            <button
                                type="button"
                                onClick={async () => {
                                    await deleteDeck()
                                    setIsDeleteModalOpen(false)
                                    navigate("/decks")
                                }}
                                className="
                                    bg-red-500 text-white text-sm
                                    px-6 py-3 rounded-lg font-medium
                                    transition-transform duration-200
                                    [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                    hover:scale-110 hover:-rotate-2
                                    active:scale-90 active:rotate-1
                                "
                            >
                                YES! Delete it NOW
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="
                                    bg-bg text-text text-sm
                                    px-6 py-3 rounded-lg font-medium
                                    transition-transform duration-200
                                    [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                    hover:scale-110 hover:-rotate-2
                                    active:scale-90 active:rotate-1
                                "
                            >
                                um... never mind... {">.<"}
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </section>
    )
}