import { Link, useParams, useSearchParams, useNavigate } from "react-router"
import { useAuth } from "../auth/AuthProvider"
import { useEffect, useRef, useState } from "react"

import CardEditor from "./components/ui/CardEditor"
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"

import { useCards } from "./hooks/useCards.ts"
import { useCardEditor } from "./hooks/useCardEditor.ts"

export function DeckCardCreation() {
    const { deckId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [error, setError] = useState<string | null>(null)

    const {
        savedCards,
        isLoading,
        loadError
    } = useCards(
        user?.uid ?? "",
        deckId ?? ""
    )

    const {
        cards,
        setCards,
        updateCard,
        addCard
    } = useCardEditor([])

    const [invalidCardIds, setInvalidCardIds] =
        useState<string[]>([])

    const [draggedCardId, setDraggedCardId] =
        useState<string | null>(null)

    const deleteCard = async (id: string) => {
        if (!user || !deckId) return

        try {
            const cardReference = doc(
                db,
                "users",
                user.uid,
                "decks",
                deckId,
                "cards",
                id
            )

            await deleteDoc(cardReference)
        } catch {
            setError("Unable to delete card.")
        }
    }

    const saveCardChanges = async () => {
        if (!user || !deckId) return

        setInvalidCardIds([])

        const invalidCards = cards.filter(
            (card) =>
                card.term.trim() === "" ||
                card.definition.trim() === ""
        )

        if (invalidCards.length !== 0) {
            setInvalidCardIds(
                invalidCards.map((card) => card.id)
            )

            const firstInvalidCard = invalidCards[0]

            const element =
                cardRefs.current.get(firstInvalidCard.id)

            element?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })

            return
        }

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

                    if (card.isNew) {
                        await setDoc(cardReference, {
                            term: card.term,
                            definition: card.definition,
                            order: card.order
                        })
                    } else {
                        await updateDoc(cardReference, {
                            term: card.term,
                            definition: card.definition,
                            order: card.order
                        })
                    }
                })
            )

            setCards((currentCards) =>
                currentCards.map((card) => ({
                    ...card,
                    isNew: false
                }))
            )

            navigate(`/decks/${deckId}`)
        } catch {
            setError("Unable to save your cards.")
        }
    }

    const handleDragStart = (
        event: React.DragEvent<HTMLDivElement>,
        cardId: string
    ) => {
        setDraggedCardId(cardId)

        const cardElement =
            event.currentTarget

        const dragPreview =
            cardElement.cloneNode(
                true
            ) as HTMLDivElement

        dragPreview.style.position = "absolute"
        dragPreview.style.top = "-1000px"
        dragPreview.style.left = "-1000px"
        dragPreview.style.width =
            `${cardElement.offsetWidth}px`
        dragPreview.style.opacity = "0.55"
        dragPreview.style.filter = "grayscale(0.7)"
        dragPreview.style.transform = "scale(0.98)"
        dragPreview.style.pointerEvents = "none"

        document.body.appendChild(
            dragPreview
        )

        event.dataTransfer.effectAllowed =
            "move"

        event.dataTransfer.setDragImage(
            dragPreview,
            cardElement.offsetWidth / 2,
            40
        )

       
        requestAnimationFrame(() => {
            dragPreview.remove()
        })
    }

    const handleDragEnd = () => {
        setDraggedCardId(null)
    }

    
    const handleDrop = (
        event: React.DragEvent<HTMLDivElement>,
        targetCardId: string
    ) => {
        event.preventDefault()

        if (
            !draggedCardId ||
            draggedCardId === targetCardId
        ) {
            return
        }

        const draggedIndex =
            cards.findIndex(
                (card) =>
                    card.id === draggedCardId
            )

        const targetIndex =
            cards.findIndex(
                (card) =>
                    card.id === targetCardId
            )

        if (
            draggedIndex === -1 ||
            targetIndex === -1
        ) {
            return
        }

        const newCards = [...cards]

        const [draggedCard] =
            newCards.splice(
                draggedIndex,
                1
            )

        newCards.splice(
            targetIndex,
            0,
            draggedCard
        )

        const reorderedCards =
            newCards.map(
                (card, index) => ({
                    ...card,
                    order: index
                })
            )

        setCards(reorderedCards)
    }

    const [searchParams] =
        useSearchParams()

    const [highlightAddButton, setHighlightAddButton] =
        useState(false)

    const shouldFocusOnAdd =
        searchParams.get("addCard")

    const [highlightedCard, setHighlightedCard] =
        useState<string | null>(null)

    const highlightedCardId =
        searchParams.get("cardId")

    const addButtonRef =
        useRef<HTMLButtonElement>(null)

    const cardRefs =
        useRef<Map<string, HTMLDivElement>>(
            new Map()
        )

    const handleAddCard = () => {
        const newCardId = addCard()
        setHighlightedCard(newCardId)

         setTimeout(() => {
            setHighlightedCard(null)
        }, 2000)
    }
    useEffect(() => {
        if (
            shouldFocusOnAdd &&
            !isLoading
        ) {
            setHighlightAddButton(true)

            addButtonRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })

            setTimeout(() => {
                setHighlightAddButton(false)
            }, 2000)
        }
    }, [
        shouldFocusOnAdd,
        isLoading
    ])

    useEffect(() => {
        if (
            !highlightedCardId ||
            isLoading
        ) {
            return
        }

        const cardElement =
            cardRefs.current.get(
                highlightedCardId
            )

        if (cardElement) {
            setHighlightedCard(
                highlightedCardId
            )

            cardElement.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })

            setTimeout(() => {
                setHighlightedCard(null)
            }, 2000)
        }
    }, [
        highlightedCardId,
        isLoading
    ])

    useEffect(() => {
        setCards(savedCards)
    }, [savedCards])

    return (
        <section className="max-w-6xl px-8 py-8">

            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <Link
                        to={`/decks/${deckId}`}
                        className="
                            inline-block
                            text-sm text-text/50
                            transition-transform duration-200
                            hover:scale-105
                            hover:text-text
                        "
                    >
                        ← Back to deck
                    </Link>

                    <h1 className="mt-5 text-4xl font-bold text-text">
                        Edit Cards
                    </h1>

                    <p className="mt-2 text-sm text-text/50">
                        Add, edit, or remove cards from your deck.
                    </p>
                </div>

                <div className="pt-8 text-sm text-text/40">
                    {cards.length}{" "}
                    {cards.length === 1
                        ? "card"
                        : "cards"}
                </div>
            </div>

            {/* Error */}
            {(error || loadError) && (
                <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
                    <p className="text-sm text-red-400">
                        {error ?? loadError}
                    </p>
                </div>
            )}

            {/* Loading */}
            {isLoading ? (
                <div className="mt-10 rounded-xl border border-dashed border-divider bg-surface/50 px-6 py-10 text-center">
                    <p className="text-text/50">
                        Loading cards…
                    </p>
                </div>
            ) : cards.length === 0 ? (
                <div className="mt-10 rounded-xl border border-dashed border-divider bg-surface/50 px-6 py-12 text-center">
                    <h2 className="text-lg font-semibold text-text">
                        No cards yet
                    </h2>

                    <p className="mt-2 text-sm text-text/50">
                        Add your first card to start building this deck.
                    </p>
                </div>
            ) : (
                <div className="mt-10 space-y-4">
                    {cards.map((card, index) => {
                        const isDragging =
                            draggedCardId === card.id

                        return (
                            <div
                                key={card.id}
                                draggable
                                onDragStart={(event) =>
                                    handleDragStart(
                                        event,
                                        card.id
                                    )
                                }
                                onDragEnd={
                                    handleDragEnd
                                }
                                onDragOver={(event) =>
                                    event.preventDefault()
                                }
                                onDrop={(event) =>
                                    handleDrop(
                                        event,
                                        card.id
                                    )
                                }
                                className={`
                                    cursor-grab
                                    transition-all
                                    duration-150
                                    active:cursor-grabbing
                                    ${
                                        isDragging
                                            ? "opacity-30"
                                            : "opacity-100"
                                    }
                                `}
                            >
                                <CardEditor
                                    card={card}
                                    index={index}
                                    onUpdate={updateCard}
                                    onDelete={deleteCard}
                                    isHighlighted={
                                        card.id ===
                                        highlightedCard
                                    }
                                    isInvalid={
                                        invalidCardIds.includes(
                                            card.id
                                        )
                                    }
                                    ref={(element) => {
                                        if (element) {
                                            cardRefs.current.set(
                                                card.id,
                                                element
                                            )
                                        }
                                    }}
                                />
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Actions */}
            <div className="mt-8 flex items-center justify-between">

                <button
                    ref={addButtonRef}
                    type="button"
                    onClick={handleAddCard}
                    className={`
                        rounded-lg
                        bg-surface
                        px-5 py-3
                        text-sm font-medium
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:-rotate-2
                        hover:bg-accent-2/10
                        hover:text-accent-2
                        active:scale-90
                        active:rotate-1
                        ${
                            highlightAddButton
                                ? "bg-accent-2 text-white ring-4 ring-accent-2/30"
                                : "bg-surface text-text hover:bg-surface"
                        }
                    `}
                >
                    ＋ Add Card
                </button>

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/decks/${deckId}`
                            )
                        }
                        className="
                            rounded-lg
                            bg-surface
                            px-5 py-3
                            text-sm font-medium text-text
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            hover:bg-red-500/10
                            hover:text-red-400
                            active:scale-90
                            active:rotate-1
                        "
                    >
                        Exit Editor
                    </button>

                    <button
                        type="button"
                        onClick={saveCardChanges}
                        className="
                            rounded-lg
                            bg-accent-2
                            px-5 py-3
                            text-sm font-medium text-white
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            active:scale-90
                            active:rotate-1
                        "
                    >
                        Save Changes
                    </button>

                </div>
            </div>
        </section>
    )
}