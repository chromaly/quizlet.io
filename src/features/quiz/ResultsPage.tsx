import { Link, useParams, useLocation, useNavigate } from "react-router"
import type { QuizResults } from "../../data_types/quizResults.ts"
import QuizQuestionResult from "./components/ui/QuizQuestionResult.tsx"
import { useState } from "react"

export function ResultsPage() {
    const { deckId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    const {
        questions,
        answers,
        questionResults: initialResults,
    } = location.state as QuizResults

    const [questionResults, setQuestionResults] =
        useState(initialResults)

    const correctCount = Object.values(questionResults).filter(
        (result) => result === true
    ).length

    const failedQuestions = questions.filter(
        (question) => questionResults[question.card.id] === false
    )

    const scorePercentage =
        questions.length > 0
            ? Math.round((correctCount / questions.length) * 100)
            : 0

    const handleMarkCorrect = (cardId: string) => {
        setQuestionResults((currentResults) => ({
            ...currentResults,
            [cardId]: true,
        }))
    }

    return (
        <section className="min-h-screen px-10 py-8">

            {/* Header */}
            <div className="mb-10 flex items-start justify-between">
                <div>
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
                        ← Exit Quiz
                    </Link>

                    <h1 className="mt-5 text-4xl font-bold text-text">
                        Quiz Results
                    </h1>

                    <p className="mt-2 text-sm text-text/50">
                        Here's how you did. Review your answers below.
                    </p>
                </div>
            </div>

            {/* Score Card */}
            <div
                className="
                    mb-8 w-full rounded-2xl
                    border border-accent-2/40
                    bg-surface p-7
                    shadow-[0_0_30px_-12px]
                    shadow-accent-2/40
                "
            >
                <div className="flex items-center justify-between gap-8">

                    <div>
                        <p className="
                            text-xs font-semibold uppercase
                            tracking-[0.2em] text-text/40
                        ">
                            Final Score
                        </p>

                        <div className="mt-2 flex items-baseline gap-3">
                            <span className="text-5xl font-bold text-text">
                                {correctCount}
                            </span>

                            <span className="text-xl text-text/30">
                                / {questions.length}
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-text/50">
                            Answers correct
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="
                            text-4xl font-bold text-accent-2
                        ">
                            {scorePercentage}%
                        </p>

                        <p className="mt-1 text-sm text-text/40">
                            {failedQuestions.length === 0
                                ? "Perfect score! 🎉"
                                : `${failedQuestions.length} question${
                                      failedQuestions.length === 1
                                          ? ""
                                          : "s"
                                  } to review`}
                        </p>
                    </div>
                </div>

                {/* Score Progress */}
                <div className="mt-7">
                    <div className="h-3 w-full overflow-hidden rounded-full bg-bg">
                        <div
                            className="
                                h-full rounded-full
                                bg-accent-2
                                transition-all duration-500
                            "
                            style={{
                                width: `${scorePercentage}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div>
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-text">
                            Question Review
                        </h2>

                        <p className="mt-1 text-sm text-text/40">
                            Review each answer and correct any mistakes.
                        </p>
                    </div>

                    <span className="
                        rounded-lg bg-surface
                        px-3 py-1.5
                        text-xs font-medium text-text/50
                    ">
                        {questions.length} question
                        {questions.length === 1 ? "" : "s"}
                    </span>
                </div>

                <div>
                    {questions.map((question, index) => (
                        <QuizQuestionResult
                            key={question.card.id}
                            question={question.card.term}
                            userAnswer={answers[question.card.id]}
                            correctAnswer={question.card.definition.trim()}
                            isCorrect={
                                questionResults[question.card.id]
                            }
                            index={index}
                            onMarkCorrect={() =>
                                handleMarkCorrect(question.card.id)
                            }
                        />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div
                className="
                    mt-10 flex flex-wrap justify-end gap-3
                    border-t border-divider pt-7
                "
            >
                <Link
                    to={`/decks/${deckId}/quiz`}
                    className="
                        rounded-lg bg-surface px-4 py-2
                        text-sm font-medium text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:-rotate-2
                        hover:bg-accent-2/10 hover:text-accent-2
                        active:scale-90
                        active:rotate-1 
                        
                    "
                >
                    Retake Quiz
                </Link>

                <button
                    type="button"
                    disabled={failedQuestions.length === 0}
                    onClick={() =>
                        navigate(`/decks/${deckId}/quizSetup`, {
                            state: {
                                questions: failedQuestions,
                            },
                        })
                    }
                    className="
                        rounded-lg bg-accent-2 px-4 py-2
                        text-sm font-medium text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:-rotate-2
                        active:scale-90
                        active:rotate-1
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        disabled:hover:scale-100
                        disabled:hover:rotate-0
                    "
                >
                    Retry Incorrect Questions Only
                </button>
            </div>
        </section>
    )
}