import type { QuizQuestion } from "./quizQuestion.ts"

export type QuizResults = {
    questions: QuizQuestion[]
    answers: Record<string, string>
    questionResults: Record<string, boolean>
}