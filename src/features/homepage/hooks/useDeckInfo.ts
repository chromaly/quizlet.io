import { useEffect, useState } from "react"
import type { Deck } from "../../../data_types/deck"
import { collection, getCountFromServer, onSnapshot, orderBy, query, limit, where, Query, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../lib/firebase";

type DeckMode = "recent" | "favorites" | "continue" | "all"

export function useDecks(userId: string | null, mode: DeckMode
) {

    const [savedDecks, setSavedDecks] = useState<Deck[]>([])

    useEffect(() => {
        if (!userId) {
            setSavedDecks([])
            return
        }

        const decksReference = collection(db, "users", userId, "decks")
        
        let decksQuery: Query

        if (mode === "recent") {
            decksQuery = query(decksReference,
                orderBy("lastAccessedAt", "desc"),
                limit(5)
            )
        } else if (mode === "favorites") {
            decksQuery = query(decksReference,
                where("isFavorite", "==", true),
                orderBy("lastAccessedAt", "desc"),
                limit(5)
            )
        }else if (mode === "continue"){
            decksQuery = query(decksReference,
                orderBy("lastStudiedAt", "desc"),
                limit(3)
            )
        }else{
            decksQuery = query(decksReference,
                orderBy("lastAccessedAt", "desc")
            )
        }

        const unsubscribe = onSnapshot(decksQuery, 
            (snapshot) => {
                const nextDecks = snapshot.docs.map((document) => ({
                    id: document.id,
                    title: document.data().title,
                    color: document.data().color,
                    description: document.data().description,
                    subject: document.data().subject,
                    isFavorite: document.data().isFavorite,
                    lastAccessedAt: document.data().lastAccessedAt,
                    lastStudiedAt: document.data().lastStudiedAt
                }))
                setSavedDecks(nextDecks)
  
            }, 
        () => {
        })
        return unsubscribe
    }, [userId, mode])

    return savedDecks
}

async function getCardCount(userId: string, deckId: string){
    const cardsReference = collection(db, "users", userId, "decks", deckId, "cards")

    const snapshot = await getCountFromServer(cardsReference)

    return snapshot.data().count
}

export function useCardCount(userId: string | null, deckId: string){
    const [cardCount, setCardCount] = useState(0)

    useEffect(() => {
        if(!userId) {
            setCardCount(0)
            return
        }

        getCardCount(userId, deckId)
        .then((count) => {
            setCardCount(count)
        })
    }, [userId, deckId])
    return cardCount
}

export async function updateDeckAccess(
    userId: string,
    deckId: string
) {
    const deckReference = doc(
        db,
        "users",
        userId,
        "decks",
        deckId
    )

    await updateDoc(deckReference, {
        lastAccessedAt: serverTimestamp()
    })
}

export async function updateDeckStudied(
    userId: string,
    deckId: string
) {
    const deckReference = doc(
        db,
        "users",
        userId,
        "decks",
        deckId
    )

    await updateDoc(deckReference, {
        lastStudiedAt: serverTimestamp()
    })
}

export async function updateDeckFavorites(
    userId: string,
    deckId: string,
    isFavorite: boolean
) {
    const deckReference = doc(db, "users", userId, "decks", deckId)

    await updateDoc(deckReference, {
        isFavorite: isFavorite
    })
}