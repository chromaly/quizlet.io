import { useRef, useState } from "react"
import { generateCardsFromPDF } from "../../ai/generateCards"
import type { GeneratedCard } from "../../data_types/generatedCard"
import { useCardEditor } from "./hooks/useCardEditor"
import CardEditor from "./components/ui/CardEditor"
import { Link, useNavigate, useParams } from "react-router"
import { useAuth } from "../auth/AuthProvider"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"

export function DeckAIGeneration() {
    const { deckId } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [error, setError] = useState<string | null>(null)
    const { cards, setCards, updateCard, deleteCard } =
        useCardEditor([])

    const [invalidCardIds, setInvalidCardIds] = useState<string[]>([])
    const [highlightedCard, setHighlightedCard] =
        useState<string | null>(null)

    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        const generatedCards = await generateCardsFromPDF(file)

        const newCards = generatedCards.map(
            (card, index: number) => ({
                id: crypto.randomUUID(),
                term: card.term,
                definition: card.definition,
                order: index,
                isNew: true,
            })
        )

        setCards(newCards)
    }

    const saveCards = async () => {
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
            const element = cardRefs.current.get(
                firstInvalidCard.id
            )

            element?.scrollIntoView({
                behavior: "smooth",
                block: "center",
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

                    await setDoc(cardReference, {
                        term: card.term,
                        definition: card.definition,
                        order: card.order,
                    })
                })
            )

            navigate(`/decks/${deckId}`)
        } catch {
            setError("Unable to save your cards.")
        }
    }

    return (
        <section className="min-h-screen px-10 py-8">

            {/* Header */}
            <div className="mb-10">
                <Link
                    to={`/decks/${deckId}`}
                    className="
                        inline-flex items-center gap-2
                        text-sm font-medium text-text/50
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-105
                        hover:-translate-x-1
                        hover:text-accent-2
                    "
                >
                    ← Exit AI Creation Mode
                </Link>

                <h1 className="mt-5 text-4xl font-bold text-text">
                    Generate Cards using AI
                </h1>

                <p className="mt-2 text-sm text-text/50">
                    Upload a PDF and let AI turn your notes into
                    study cards.
                </p>
            </div>

            {/* AI Upload Area */}
            <div
                className="
                    mb-8 rounded-2xl
                    border border-accent-2/40
                    bg-surface p-8
                    shadow-[0_0_30px_-12px]
                    shadow-accent-2/40
                "
            >
                <div className="flex items-center gap-5">

                    {/* Icon */}
                    <div
                        className="
                            flex h-14 w-14 shrink-0
                            items-center justify-center
                            rounded-2xl
                            bg-accent-2/10
                            text-2xl
                        "
                    >
                        ✨
                    </div>

                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-text">
                            Generate from a PDF
                        </h2>

                        <p className="mt-1 text-sm text-text/50">
                            Upload your notes, textbook pages, or
                            study material and AI will generate
                            cards for you.
                        </p>
                    </div>

                    {/* Upload Button */}
                    <label
                        className="
                            cursor-pointer rounded-lg
                            bg-accent-2 px-5 py-2.5
                            text-sm font-medium text-white
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            active:scale-90
                            active:rotate-1
                        "
                    >
                        Upload PDF

                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div
                    className="
                        mb-6 rounded-xl
                        border border-red-500/30
                        bg-red-500/10
                        px-5 py-4
                        text-sm text-red-300
                    "
                >
                    {error}
                </div>
            )}

            {/* Generated Cards */}
            {cards.length > 0 && (
                <div>
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text">
                                Generated Cards
                            </h2>

                            <p className="mt-1 text-sm text-text/40">
                                Review and edit your cards before
                                saving them.
                            </p>
                        </div>

                        <span
                            className="
                                rounded-lg bg-surface
                                px-3 py-1.5
                                text-xs font-medium text-text/50
                            "
                        >
                            {cards.length} card
                            {cards.length === 1 ? "" : "s"}
                        </span>
                    </div>

                    {cards.map((card, index) => (
                        <CardEditor
                            key={card.id}
                            card={card}
                            index={index}
                            onUpdate={updateCard}
                            onDelete={deleteCard}
                            isHighlighted={
                                card.id === highlightedCard
                            }
                            isInvalid={invalidCardIds.includes(
                                card.id
                            )}
                            ref={(element) => {
                                if (element) {
                                    cardRefs.current.set(
                                        card.id,
                                        element
                                    )
                                }
                            }}
                        />
                    ))}

                    {/* Save */}
                    <div
                        className="
                            mt-8 flex justify-end
                            border-t border-divider
                            pt-7
                        "
                    >
                        <button
                            type="button"
                            onClick={saveCards}
                            className="
                                rounded-lg
                                bg-accent-2
                                px-5 py-2.5
                                text-sm font-medium text-white
                                transition-transform duration-200
                                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                hover:scale-110
                                hover:-rotate-2
                                active:scale-90
                                active:rotate-1
                            "
                        >
                            Save Cards
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {cards.length === 0 && (
                <div
                    className="
                        rounded-2xl
                        border border-divider
                        bg-surface/50
                        px-8 py-16
                        text-center
                    "
                >
                    <div className="text-4xl">📄</div>

                    <h2 className="mt-4 text-lg font-semibold text-text">
                        No cards yet
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text/40">
                        Upload a PDF above to generate a
                        batch of study cards.
                    </p>
                </div>
            )}
        </section>
    )
}