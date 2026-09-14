import { useEffect, useState, useRef } from "react"
import { useCards } from "../decks/hooks/useCards"
import { useParams, useNavigate } from "react-router"
import { useAuth } from "../auth/AuthProvider"
import type { QuizConfig } from "../../data_types/quizConfig"

export default function QuizSetupPage() {
    const { deckId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const {
        savedCards,
        isLoading,
        loadError,
    } = useCards(user?.uid ?? "", deckId ?? "")

    const hasInitialized = useRef(false)

    const [totalQuestions, setTotalQuestions] = useState(0)
    const [writtenQuestions, setWrittenQuestions] = useState("0")
    const [multipleChoiceQuestions, setMultipleChoiceQuestions] =
        useState("0")

    const [showInvalidCountModal, setShowInvalidCountModal] =
        useState(false)
    

    const [isClosingInvalidCountModal, setIsClosingInvalidCountModal] =
        useState(false)

    const handleStartingQuiz = () => {
        const writtenCount = Number(writtenQuestions)
        const multipleChoiceCount = Number(multipleChoiceQuestions)

        if (
            writtenCount + multipleChoiceCount !==
            totalQuestions
        ) {
            setShowInvalidCountModal(true)
            return
        }

        const quizConfig: QuizConfig = {
            totalQuestions,
            writtenQuestions: writtenCount,
            multipleChoiceQuestions: multipleChoiceCount,
        }

        navigate(`/decks/${deckId}/quiz`, {
            state: {
                config: quizConfig,
            },
        })
    }

  

    const closeInvalidCountModal = () => {
        setIsClosingInvalidCountModal(true)

        setTimeout(() => {
            setShowInvalidCountModal(false)
            setIsClosingInvalidCountModal(false)
        }, 150)
    }

    

    const handleMultipleChoiceQuestionsAllowed =
        savedCards.length >= 4

    useEffect(() => {
        if (isLoading || hasInitialized.current) return

        setTotalQuestions(savedCards.length)

        if (savedCards.length < 4) {
            setWrittenQuestions(String(savedCards.length))
            setMultipleChoiceQuestions("0")
        } else {
            setWrittenQuestions(
                String(Math.ceil(savedCards.length / 2))
            )
            setMultipleChoiceQuestions(
                String(Math.floor(savedCards.length / 2))
            )
        }

        hasInitialized.current = true
    }, [isLoading, savedCards.length])

    if (isLoading) {
        return (
            <section className="px-8 py-8">
                <div className="rounded-xl border border-divider bg-surface/50 px-6 py-10 text-center">
                    <p className="text-sm text-text/50">
                        Loading cards…
                    </p>
                </div>
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

    return (
        <section className="max-w-4xl px-8 py-8">
            {/* Header */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate(`/decks/${deckId}`)}
                    className="
                        text-sm text-text/50
                        transition-transform duration-200
                        hover:scale-105 hover:text-text
                    "
                >
                    ← Back to deck
                </button>

                <h1 className="mt-5 text-4xl font-bold text-text">
                    Quiz Setup
                </h1>

                <p className="mt-2 text-sm text-text/50">
                    Choose how you want to be quizzed on this deck.
                </p>
            </div>

            {/* Setup Card */}
            <div className="mt-8 rounded-2xl border border-divider bg-surface p-7">
                <div className="space-y-7">
                    {/* Total Questions */}
                    <div>
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/40  focus:outline-none focus:border-divider focus:ring-0 focus:shadow-none">
                            Total Questions
                        </label>

                        <div className="rounded-xl border border-divider bg-bg/30 px-4 py-3">
                            <p className="text-base font-medium text-text">
                                {totalQuestions}
                            </p>
                        </div>
                    </div>

                    {/* Written Questions */}
                    <div>
                        <label
                            htmlFor="written-questions"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/40"
                        >
                            Written Questions
                        </label>

                        <input
                            id="written-questions"
                            type="number"
                            min="0"
                            max={totalQuestions}
                            value={writtenQuestions}
                            onChange={(event) =>
                                setWrittenQuestions(
                                    event.target.value
                                )
                            }
                            className="
                                w-full rounded-xl
                                border border-divider
                                bg-bg/30 px-4 py-3
                                text-text
                                focus:outline-none
                                focus:border-accent-2
                                focus:ring-0
                                focus:outline-none focus:border-divider focus:ring-0 focus:shadow-none
                            "
                        />
                    </div>

                    {/* Multiple Choice Questions */}
                    <div>
                        <label
                            htmlFor="multiple-choice-questions"
                            className="mb-2 block text-xs font-medium uppercase tracking-wide text-text/40  focus:outline-none focus:border-divider focus:ring-0 focus:shadow-none"
                        >
                            Multiple Choice Questions
                        </label>

                        <div
                            className={
                                !handleMultipleChoiceQuestionsAllowed
                                    ? "cursor-not-allowed"
                                    : ""
                            }
                        >
                            <input
                                id="multiple-choice-questions"
                                type="number"
                                min="0"
                                max={totalQuestions}
                                value={multipleChoiceQuestions}
                                onChange={(event) =>
                                    setMultipleChoiceQuestions(
                                        event.target.value
                                    )
                                }
                                disabled={
                                    !handleMultipleChoiceQuestionsAllowed
                                }
                                className={`
                                    w-full rounded-xl
                                    border border-divider
                                    bg-bg/30 px-4 py-3
                                    text-text
                                    focus:outline-none
                                    focus:border-accent-2
                                    focus:ring-0
                                    ${
                                        !handleMultipleChoiceQuestionsAllowed
                                            ? "cursor-not-allowed opacity-40"
                                            : ""
                                    }
                                `}
                            />
                        </div>

                        {!handleMultipleChoiceQuestionsAllowed && (
                            <p className="mt-2 text-xs text-text/40">
                                Multiple choice requires at least 4 cards.
                            </p>
                        )}
                    </div>

                    {/* Start Quiz */}
                    <button
                        type="button"
                        onClick={handleStartingQuiz}
                        className="
                            w-full rounded-xl bg-accent-2
                            px-5 py-3 font-semibold text-white
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-[1.03] hover:-rotate-1
                            active:scale-90 active:rotate-1
                        "
                    >
                        Start Quiz
                    </button>
                </div>
            </div>

            {/* Invalid Count Modal */}
            {showInvalidCountModal && (
                <div
                    className={`
                        fixed inset-0 z-50 flex items-center justify-center
                        bg-black/60 p-4 backdrop-blur-sm
                        ${
                            isClosingInvalidCountModal
                                ? "animate-[fadeOut_0.15s_ease-in]"
                                : "animate-[fadeIn_0.2s_ease-out]"
                        }
                    `}
                >
                    <div
                        className={`
                            w-full max-w-md rounded-2xl
                            border border-accent-2/40
                            bg-surface p-8 text-center
                            shadow-[0_0_25px_-5px]
                            shadow-accent-2/50
                            ${
                                isClosingInvalidCountModal
                                    ? "animate-[modalOut_0.15s_ease-in]"
                                    : "animate-[scaleIn_0.2s_ease-out]"
                            }
                        `}
                    >
                        <h2 className="text-2xl font-bold text-text">
                            Dude... Learn to count...
                        </h2>

                        <p className="mt-3 text-sm leading-relaxed text-text/60">
                            Your written and multiple choice questions
                            don't add up to the total number of questions!
                        </p>

                        <p className="mt-3 text-sm font-medium text-text/70">
                            {Number(writtenQuestions)} written +{" "}
                            {Number(multipleChoiceQuestions)} multiple choice ={" "}
                            {Number(writtenQuestions) +
                                Number(multipleChoiceQuestions)}
                        </p>

                        <p className="mt-1 text-sm text-text/40">
                            Total questions: {totalQuestions}
                        </p>

                        <p className="mt-1 text-sm text-text/40">
                            {Number(writtenQuestions) +
                                Number(multipleChoiceQuestions)}{" "}
                            ≠ {totalQuestions}, bro.
                        </p>

                        <button
                            type="button"
                            onClick={closeInvalidCountModal}
                            className="
                                mt-7 rounded-lg bg-accent-2
                                px-6 py-3 text-sm font-semibold text-white
                                transition-transform duration-200
                                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                hover:scale-110 hover:-rotate-2
                                active:scale-90 active:rotate-1
                            "
                        >
                            sorry master...
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}