type FlashcardProps = {
    term: string
    definition: string
    showAnswer: boolean
    onClick: () => void
}

export default function Flashcard({
    term,
    definition,
    showAnswer,
    onClick,
}: FlashcardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                w-full
                min-h-80
                rounded-2xl
                border border-divider
                bg-surface
                p-10
                text-left
                shadow-lg
                transition-transform duration-200
                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                hover:scale-[1.01]
                hover:border-accent-2/50
                hover:shadow-[0_0_25px_-10px]
                hover:shadow-accent-2/50
                active:scale-[0.99]
            "
        >
            <div className="flex min-h-60 flex-col items-center justify-center text-center">

                {/* Label */}
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-text/40">
                    {showAnswer ? "Definition" : "Term"}
                </p>

                {/* Content */}
                <p className="max-w-3xl text-3xl font-semibold leading-relaxed text-text">
                    {showAnswer ? definition : term}
                </p>

                {/* Hint */}
                <p className="mt-8 text-sm text-text/30">
                    Click to {showAnswer ? "see the term" : "reveal the definition"}
                </p>
            </div>
        </button>
    )
}