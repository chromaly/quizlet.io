type QuizQuestionResultProps = {
    question: string
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
    index: number
    onMarkCorrect: () => void
}

export default function QuizQuestionResult({
    question,
    userAnswer,
    correctAnswer,
    isCorrect,
    index,
    onMarkCorrect,
}: QuizQuestionResultProps) {
    return (
        <div
            className={`
                mb-6 w-full rounded-2xl
                border bg-surface p-6
                transition-transform duration-200
                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                hover:shadow-[0_0_25px_-12px]
                ${
                    isCorrect
                        ? "border-green-500/30 hover:shadow-green-500/20"
                        : "border-red-500/30 hover:shadow-red-500/20"
                }
            `}
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span
                        className="
                            flex h-8 w-8 items-center justify-center
                            rounded-lg bg-bg
                            text-sm font-semibold text-text/50
                        "
                    >
                        {index + 1}
                    </span>

                    <span className="text-sm font-semibold text-text">
                        Question {index + 1}
                    </span>
                </div>

                <span
                    className={`
                        rounded-lg px-3 py-1.5
                        text-xs font-semibold
                        ${
                            isCorrect
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                        }
                    `}
                >
                    {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                </span>
            </div>

            {/* Question */}
            <div className="mb-5">
                <p className="
                    mb-2 text-xs font-medium uppercase
                    tracking-wide text-text/40
                ">
                    Question
                </p>

                <div className="
                    rounded-xl border border-divider
                    bg-bg/30 p-5
                ">
                    <p className="text-base font-medium leading-relaxed text-text">
                        {question}
                    </p>
                </div>
            </div>

            {/* Answers */}
            <div className="grid grid-cols-2 gap-5">

                {/* User Answer */}
                <div>
                    <p className="
                        mb-2 text-xs font-medium uppercase
                        tracking-wide text-text/40
                    ">
                        Your Answer
                    </p>

                    <div
                        className={`
                            min-h-20 rounded-xl border p-4
                            ${
                                isCorrect
                                    ? "border-green-500/20 bg-green-500/5"
                                    : "border-red-500/20 bg-red-500/5"
                            }
                        `}
                    >
                        <p
                            className={`
                                text-sm leading-relaxed
                                ${
                                    isCorrect
                                        ? "text-text/80"
                                        : "text-red-300"
                                }
                            `}
                        >
                            {userAnswer || (
                                <span className="italic text-text/30">
                                    No answer provided
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Correct Answer */}
                <div>
                    <p className="
                        mb-2 text-xs font-medium uppercase
                        tracking-wide text-text/40
                    ">
                        Correct Answer
                    </p>

                    <div className="
                        min-h-20 rounded-xl
                        border border-accent-2/20
                        bg-accent-2/5 p-4
                    ">
                        <p className="
                            text-sm leading-relaxed text-text/80
                        ">
                            {correctAnswer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mark as Correct */}
            {!isCorrect && (
                <div className="
                    mt-5 flex justify-end
                    border-t border-divider pt-5
                ">
                    <button
                        type="button"
                        onClick={onMarkCorrect}
                        className="
                            rounded-lg
                            border border-accent-2/30
                            bg-accent-2/10
                            px-4 py-2
                            text-sm font-medium
                            text-accent-2
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            hover:bg-accent-2/20
                            active:scale-90
                            active:rotate-1
                        "
                    >
                        ✓ Mark as Correct
                    </button>
                </div>
            )}
        </div>
    )
}