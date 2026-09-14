type MultipleChoiceQuizQuestion = {
    question: string
    choices: string[]
    selectedAnswer: string
    onAnswerSelect: (answer: string) => void
    index: number
}

export default function MultipleChoiceQuizQuestion({
    question,
    choices,
    selectedAnswer,
    onAnswerSelect,
    index,
}: MultipleChoiceQuizQuestion) {
    return (
        <div
            className="
                mb-6 w-full rounded-2xl border border-divider
                bg-surface p-6
                transition-transform duration-200
                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                hover:shadow-[0_0_25px_-12px]
                hover:shadow-accent-2/40
            "
        >
            {/* Question number */}
            <div className="mb-6 flex items-center justify-between">
                <span
                    className="
                        flex h-8 w-8 items-center justify-center
                        rounded-lg bg-bg
                        text-sm font-semibold text-text/50
                    "
                >
                    {index + 1}
                </span>

                <span className="text-xs font-medium uppercase tracking-wider text-text/30">
                    Multiple Choice
                </span>
            </div>

            <div className="grid grid-cols-2 gap-10">
                {/* Question */}
                <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text/40">
                        Question
                    </p>

                    <div className="rounded-xl border border-divider bg-bg/30 p-5">
                        <p className="text-lg font-medium leading-relaxed text-text">
                            {question}
                        </p>
                    </div>
                </div>

                {/* Choices */}
                <div>
                    <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text/40">
                        Choose an answer
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        {choices.map((choice, choiceIndex) => {
                            const isSelected = choice === selectedAnswer

                            return (
                                <button
                                    key={choice}
                                    type="button"
                                    onClick={() => onAnswerSelect(choice)}
                                    className={`
                                        min-h-16 rounded-xl border p-4
                                        text-left text-sm font-medium
                                        transition-transform duration-200
                                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                        active:scale-90 active:rotate-1
                                        ${
                                            isSelected
                                                ? `
                                                    border-accent-2
                                                    bg-accent-2/15
                                                    text-text
                                                    ring-2 ring-accent-2/30
                                                `
                                                : `
                                                    border-divider
                                                    bg-bg/30
                                                    text-text/70
                                                    hover:scale-[1.03]
                                                    hover:-rotate-1
                                                    hover:border-accent-2/50
                                                    hover:bg-accent-2/10
                                                    hover:text-text
                                                `
                                        }
                                    `}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`
                                                flex h-6 w-6 shrink-0 items-center
                                                justify-center rounded-md
                                                text-xs font-semibold
                                                ${
                                                    isSelected
                                                        ? "bg-accent-2 text-white"
                                                        : "bg-surface text-text/40"
                                                }
                                            `}
                                        >
                                            {String.fromCharCode(65 + choiceIndex)}
                                        </span>

                                        <span className="pt-0.5">
                                            {choice}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}