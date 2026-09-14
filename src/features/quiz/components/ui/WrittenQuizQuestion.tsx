type WrittenQuizQuestionProps = {
    question: string
    userAnswer: string
    onAnswerChange: (newAnswer: string) => void
    index: number
}

export default function WrittenQuizQuestion({
    question,
    userAnswer,
    onAnswerChange,
    index,
}: WrittenQuizQuestionProps) {
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
                    Written Response
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

                {/* Answer */}
                <div>
                    <label
                        htmlFor={`written-answer-${index}`}
                        className="
                            mb-3 block text-xs font-medium
                            uppercase tracking-wide text-text/40
                        "
                    >
                        Your Answer
                    </label>

                    <textarea
                        id={`written-answer-${index}`}
                        value={userAnswer}
                        onChange={(event) =>
                            onAnswerChange(event.target.value)
                        }
                        placeholder="What could the answer be???"
                        rows={5}
                        className="
                            w-full resize-none rounded-xl
                            border border-divider
                            bg-bg/30 p-5
                            text-base leading-relaxed text-text
                            placeholder:text-text/30
                            focus:outline-none
                            focus:border-accent-2
                            focus:ring-0
                        "
                    />
                </div>
            </div>
        </div>
    )
}