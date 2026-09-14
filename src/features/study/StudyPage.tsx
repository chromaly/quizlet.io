import { useEffect, useState } from "react"
import { useCards } from "../decks/hooks/useCards"
import { Link, useParams } from "react-router"
import { useAuth } from "../auth/AuthProvider"
import Flashcard from "./components/ui/Flashcard"
import { updateDeckStudied } from "../homepage/hooks/useDeckInfo"

export function StudyPage() {
    const { deckId } = useParams()
    const { user } = useAuth()

    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const [showAnswer, setShowAnswer] = useState(false)

    const {
        savedCards,
        isLoading,
        loadError,
    } = useCards(user?.uid ?? "", deckId ?? "")

    const handleNextCard = () => {
        setCurrentCardIndex(
            (currentCardIndex + 1) % savedCards.length
        )
        setShowAnswer(false)
    }

    const handlePreviousCard = () => {
        setCurrentCardIndex(
            (currentCardIndex - 1 + savedCards.length) %
                savedCards.length
        )
        setShowAnswer(false)
    }

    useEffect(() => {
        if (!user || !deckId) return

        updateDeckStudied(user.uid, deckId)
    }, [user, deckId])

    if (isLoading) {
        return (
            <section className="px-8 py-8">
                <p className="text-text/50">
                    Loading…
                </p>
            </section>
        )
    }

    if (loadError) {
        return (
            <section className="px-8 py-8">
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4">
                    <p className="text-sm text-red-400">
                        Unable to load this deck's cards.
                    </p>
                </div>
            </section>
        )
    }

    if (savedCards.length === 0) {
        return (
            <section className="px-8 py-8">
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

                <div className="mt-10 rounded-xl border border-dashed border-divider bg-surface/50 px-6 py-12 text-center">
                    <h1 className="text-xl font-semibold text-text">
                        No cards yet
                    </h1>

                    <p className="mt-2 text-sm text-text/50">
                        Add some cards before starting study mode.
                    </p>

                    <Link
                        to={`/decks/${deckId}/edit`}
                        className="
                            mt-6 inline-block
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
                        ＋ Add Cards
                    </Link>
                </div>
            </section>
        )
    }

    const currentCard = savedCards[currentCardIndex]

    return (
        <section className="max-w-6xl px-8 py-8">

            {/* Header */}
            <div className="flex items-start justify-between">
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
                        ← Exit Study Mode
                    </Link>

                    <h1 className="mt-5 text-4xl font-bold text-text">
                        Flashcards
                    </h1>

                    <p className="mt-2 text-sm text-text/50">
                        Click a card to reveal the answer.
                    </p>
                </div>

                {/* Progress */}
                <div className="pt-8 text-sm font-medium text-text/40">
                    Card {currentCardIndex + 1} of {savedCards.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                    className="h-full rounded-full bg-accent-2 transition-all duration-300"
                    style={{
                        width: `${
                            ((currentCardIndex + 1) /
                                savedCards.length) *
                            100
                        }%`,
                    }}
                />
            </div>

            {/* Flashcard */}
            <div className="mt-8">
                <Flashcard
                    term={currentCard.term}
                    definition={currentCard.definition}
                    showAnswer={showAnswer}
                    onClick={() =>
                        setShowAnswer((previous) => !previous)
                    }
                />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-center gap-6">

                <button
                    type="button"
                    onClick={handlePreviousCard}
                    aria-label="Previous card"
                    className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full
                        bg-surface
                        text-xl text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:-rotate-2
                        hover:bg-accent-2/10
                        hover:text-accent-2
                        active:scale-90
                        active:rotate-1
                    "
                >
                    ←
                </button>

                <span className="min-w-16 text-center text-sm font-medium text-text/50">
                    {currentCardIndex + 1} / {savedCards.length}
                </span>

                <button
                    type="button"
                    onClick={handleNextCard}
                    aria-label="Next card"
                    className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full
                        bg-surface
                        text-xl text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:rotate-2
                        hover:bg-accent-2/10
                        hover:text-accent-2
                        active:scale-90
                        active:rotate-1
                    "
                >
                    →
                </button>

            </div>
        </section>
    )
}