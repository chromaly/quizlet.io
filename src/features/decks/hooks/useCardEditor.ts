import { useState } from "react";
import type { Card } from "../../../data_types/card";

export function useCardEditor(initialCards: Card[]) {

    const [cards, setCards] = useState<Card[]>(initialCards);

    const updateCard = (
        id: string,
        field: "term" | "definition",
        value: string
    ) => {
        setCards(currentCards =>
            currentCards.map(card =>
                card.id === id
                    ? { ...card, [field]: value }
                    : card
            )
        );
    };

    const deleteCard = (id: string) => {
        setCards(currentCards =>
            currentCards.filter(card => card.id !== id)
        );
    };

    const addCard = () => {
        const newCard: Card = {
            id: crypto.randomUUID(),
                term: "",
                definition: "",
                order: cards.length,
                isNew: true
        }
        setCards((prev) => [...prev, newCard])

        return newCard.id
    };

    return {
        cards,
        setCards,
        updateCard,
        deleteCard,
        addCard
    };
}