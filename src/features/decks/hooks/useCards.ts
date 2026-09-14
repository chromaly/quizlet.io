import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import type { Card } from "../../../data_types/card";

export function useCards(userId: string, deckId: string){

    const [savedCards, setSavedCards] = useState<Card[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState<string | null>(null)

    useEffect(() => {
        if (!userId || !deckId) {
            setIsLoading(false)
            return
        }

        const cardReference = collection(db, "users", userId, "decks", deckId, "cards")
        const cardQuery = query(cardReference, orderBy("order"))
        const unsubscribe = onSnapshot(
            cardQuery,
            (snapshot) => {
                const nextCards = snapshot.docs.map((document) => ({
                    id: document.id,
                    term: document.data().term,
                    definition: document.data().definition,
                    order: document.data().order,
                    isNew: false
                }))
                setSavedCards(nextCards)
                setIsLoading(false)
            },
            () => {
                setLoadError("Unable to load your decks.")
                setIsLoading(false)
            }
        )

        return unsubscribe
    }, [userId, deckId])

    return { savedCards, isLoading, loadError }
}