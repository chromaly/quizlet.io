import type { Card } from "../data_types/card"

export type QuizMode = "written" | "multipleChoice"

export type QuizQuestion = {
    card: Card
    mode: QuizMode
    choices?: string[]
}
