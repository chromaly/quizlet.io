import type { GeneratedCard } from "../data_types/generatedCard.ts"
import { extractPDFText, extractPDFImages } from "../pdf/extractPDF.ts"

import { cardModel } from "./gemini.ts"

export async function generateCards(text: string): Promise<GeneratedCard[]>{
    try {
        const result = await cardModel.generateContent(text)
        const data = JSON.parse(result.response.text())
        return data.cards
    } catch (error) {
        console.error("Failed to generate cards:", error)
        throw error
    }
}

export async function generateCardsFromPDF(file: File): Promise<GeneratedCard[]>{
    const text = await extractPDFText(file)
    const images = await extractPDFImages(file)

    try {
        const result = await cardModel.generateContent([
            text,
            ...images
        ])
        const data = JSON.parse(result.response.text())
        return data.cards
    } catch (error) {
        console.error("Failed to generate cards:", error)
        throw error
    }
}