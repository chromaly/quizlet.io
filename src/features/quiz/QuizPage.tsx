import { useEffect, useState } from "react"
import { useCards } from "../decks/hooks/useCards"
import {
    Link,
    useParams,
    useNavigate,
    Navigate,
    useLocation,
} from "react-router"
import { useAuth } from "../auth/AuthProvider"
import WrittenQuizQuestion from "./components/ui/WrittenQuizQuestion.tsx"
import type { QuizResults } from "../../data_types/quizResults.ts"
import type { Card } from "../../data_types/card.ts"
import MultipleChoiceQuizQuestion from "./components/ui/MultipleChoiceQuizQuestion.tsx"
import type { QuizConfig } from "../../data_types/quizConfig"
import type { QuizQuestion } from "../../data_types/quizQuestion.ts"

type QuizPageState = {
    config?: QuizConfig
    questions?: QuizQuestion[]
}

export function QuizPage() {
    const { deckId } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    if (!location.state) {
        return (
            <Navigate
                to={`/decks/${deckId}/quizSetup`}
                replace
            />
        )
    }

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string>>({})

    const {
        savedCards,
        isLoading,
        loadError,
    } = useCards(user?.uid ?? "", deckId ?? "")

    const pageState = location.state as QuizPageState

    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])

    const generateRandomChoices = (
        currentQuestion: Card,
        quizCards: Card[]
    ) => {
        const correctAnswer = currentQuestion.definition

        const otherAnswers = quizCards
            .filter((card) => card.id !== currentQuestion.id)
            .map((card) => card.definition)

        const distractors = [...otherAnswers]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)

        const choices = [correctAnswer, ...distractors]
            .sort(() => Math.random() - 0.5)

        return choices
    }

    const generateQuiz = (
        cards: Card[],
        config: QuizConfig
    ): QuizQuestion[] => {
        const tempCards = [...cards]
        const quizQuestions: QuizQuestion[] = []

        tempCards.sort(() => Math.random() - 0.5)

        for (let i = 0; i < config.totalQuestions; i++) {
            if (i < config.writtenQuestions) {
                quizQuestions.push({
                    card: tempCards[i],
                    mode: "written",
                })
            } else {
                quizQuestions.push({
                    card: tempCards[i],
                    mode: "multipleChoice",
                    choices: generateRandomChoices(
                        tempCards[i],
                        tempCards
                    ),
                })
            }
        }

        quizQuestions.sort(() => Math.random() - 0.5)

        return quizQuestions
    }

    useEffect(() => {
        if (isLoading || !location.state) return

        if (pageState.questions) {
            setQuizQuestions(pageState.questions)
        } else if (pageState.config) {
            const generatedQuiz = generateQuiz(
                savedCards,
                pageState.config
            )

            setQuizQuestions(generatedQuiz)
        }
    }, [isLoading, savedCards.length])

    const handleNextCard = () => {
        setCurrentQuestionIndex(
            (currentQuestionIndex + 1) %
                quizQuestions.length
        )
    }

    const handlePreviousCard = () => {
        setCurrentQuestionIndex(
            (currentQuestionIndex - 1 + quizQuestions.length) %
                quizQuestions.length
        )
    }

    const handleAnswerChange = (
        id: string,
        newAnswer: string
    ) => {
        setAnswers((currentAnswers) => ({
            ...currentAnswers,
            [id]: newAnswer,
        }))
    }

    const handleSubmitQuiz = () => {
        const unansweredQuestions = quizQuestions.filter(
            (question) =>
                !answers[question.card.id]?.trim()
        )

        if (unansweredQuestions.length > 0) {
            alert(
                "Please answer all questions before submitting!"
            )
            return
        }

        const results: Record<string, boolean> = {}

        quizQuestions.forEach((question) => {
            const userAnswer =
                answers[question.card.id]

            results[question.card.id] =
                userAnswer.trim().toLowerCase() ===
                question.card.definition.trim().toLowerCase()
        })

        const quizResults: QuizResults = {
            questions: quizQuestions,
            answers: answers,
            questionResults: results,
        }

        navigate(
            `/decks/${deckId}/quiz/results`,
            {
                state: quizResults,
            }
        )
    }

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

    if (quizQuestions.length === 0) {
        return (
            <section className="px-8 py-8">
                <div className="rounded-xl border border-divider bg-surface/50 px-6 py-10 text-center">
                    <p className="text-sm text-text/50">
                        Loading quiz…
                    </p>
                </div>
            </section>
        )
    }

    const currentQuestion =
        quizQuestions[currentQuestionIndex]

    const progress =
        ((currentQuestionIndex + 1) /
            quizQuestions.length) *
        100

    return (
        <section className="max-w-6xl px-8 py-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
                <div>
                    <Link
                        to={`/decks/${deckId}`}
                        className="
                            inline-block text-sm text-text/50
                            transition-transform duration-200
                            hover:scale-105 hover:text-text
                        "
                    >
                        ← Exit Quiz Mode
                    </Link>

                    <h1 className="mt-5 text-4xl font-bold text-text">
                        Quiz Time!
                    </h1>

                    <p className="mt-2 text-sm text-text/50">
                        Answer each question before submitting your quiz.
                    </p>
                </div>

                <div className="pt-8 text-sm font-medium text-text/40">
                    Question {currentQuestionIndex + 1} of{" "}
                    {quizQuestions.length}
                </div>
            </div>

            {/* Progress */}
            <div className="mt-8">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-text/30">
                        Progress
                    </span>

                    <span className="text-xs font-medium text-text/30">
                        {Math.round(progress)}%
                    </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                    <div
                        className="
                            h-full rounded-full bg-accent-2
                            transition-all duration-300
                        "
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            {/* Current Question */}
            <div className="mt-8">
                {currentQuestion.mode === "written" ? (
                    <WrittenQuizQuestion
                        question={currentQuestion.card.term}
                        userAnswer={
                            answers[currentQuestion.card.id] ?? ""
                        }
                        onAnswerChange={(newAnswer) =>
                            handleAnswerChange(
                                currentQuestion.card.id,
                                newAnswer
                            )
                        }
                        index={currentQuestionIndex}
                    />
                ) : (
                    <MultipleChoiceQuizQuestion
                        question={currentQuestion.card.term}
                        choices={currentQuestion.choices ?? []}
                        selectedAnswer={
                            answers[currentQuestion.card.id] ?? ""
                        }
                        onAnswerSelect={(selectedAnswer) =>
                            handleAnswerChange(
                                currentQuestion.card.id,
                                selectedAnswer
                            )
                        }
                        index={currentQuestionIndex}
                    />
                )}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-center gap-6">
                <button
                    type="button"
                    onClick={handlePreviousCard}
                    aria-label="Previous question"
                    className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full bg-surface text-xl text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        hover:bg-accent-2/10 hover:text-accent-2
                        active:scale-90 active:rotate-1
                    "
                >
                    ←
                </button>

                <span className="min-w-16 text-center text-sm font-medium text-text/50">
                    {currentQuestionIndex + 1} /{" "}
                    {quizQuestions.length}
                </span>

                <button
                    type="button"
                    onClick={handleNextCard}
                    aria-label="Next question"
                    className="
                        flex h-12 w-12 items-center justify-center
                        rounded-full bg-surface text-xl text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:rotate-2
                        hover:bg-accent-2/10 hover:text-accent-2
                        active:scale-90 active:rotate-1
                    "
                >
                    →
                </button>
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-center">
                <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="
                        rounded-lg bg-accent-2
                        px-7 py-3 text-sm font-semibold text-white
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1
                    "
                >
                    Submit Quiz!
                </button>
            </div>
        </section>
    )
}