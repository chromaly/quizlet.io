import { useState } from "react"
import { useAuth } from "../auth/AuthProvider"
import { DeckCard } from "../../components/ui/DeckCard.js"
import { updateDeckFavorites, useDecks } from "../homepage/hooks/useDeckInfo.js"

type DecksPageProps = {
    onCreateDeck: () => void
}

export function DecksPage({ onCreateDeck }: DecksPageProps) {
    const { user } = useAuth()

    const [searchQuery, setSearchQuery] = useState("")

    const decks = useDecks(user?.uid ?? null, "recent")

    const filteredDecks = decks.filter((deck) => {
        const query = searchQuery.toLowerCase().trim()

        return (
            deck.title.toLowerCase().includes(query) ||
            deck.description?.toLowerCase().includes(query) ||
            deck.subject?.toLowerCase().includes(query)
        )
    })

    const handleToggleFavorite = async (deckId: string, isFavorite: boolean) => {
      if (!user || !deckId) return
      
      updateDeckFavorites(user.uid, deckId, isFavorite)
    }
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6">
                <p className="flex text-4xl font-bold text-text">
                    My Decks
                </p>

                <button
                    onClick={onCreateDeck}
                    type="button"
                    className="
                        rounded-lg
                        bg-accent-2
                        px-4 py-2
                        text-sm text-text
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110
                        hover:-rotate-2
                        active:scale-90
                        active:rotate-1
                    "
                >
                    Create deck
                </button>
            </div>

            {/* Search */}
            <div className="flex flex-col items-start gap-3">
                <div className="relative w-full max-w-3xl">

                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search your decks..."
                        className="
                            w-full rounded-xl
                            border border-divider
                            bg-surface
                            py-3 pl-4 pr-10
                            text-sm text-text
                            placeholder:text-text/30
                            transition-all duration-200
                            focus:border-accent-2
                            focus:outline-none
                            focus:ring-0
                            focus:shadow-[0_0_20px_-10px]
                            focus:shadow-accent-2/50
                        "
                    />

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="
                                absolute right-3 top-1/2
                                -translate-y-1/2
                                rounded-lg px-2 py-1
                                text-sm text-text/30
                                transition-transform duration-200
                                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                hover:scale-110
                                hover:text-text/70
                                active:scale-90
                            "
                        >
                            ✕
                        </button>
                    )}
                </div>

                <p className="text-sm text-text/40">
                    {filteredDecks.length}{" "}
                    {filteredDecks.length === 1 ? "deck" : "decks"}
                </p>
            </div>

            {/* Decks */}
            {decks.length === 0 ? (
                <p className="text-text/50">
                    You have no decks yet. Create one to begin studying.
                </p>
            ) : filteredDecks.length === 0 ? (
                <div
                    className="
                        flex min-h-64 flex-col items-center justify-center
                        rounded-2xl
                        border border-divider
                        bg-surface
                        text-center
                    "
                >
                    <div className="mb-4 text-4xl">
                        🔍
                    </div>

                    <h3 className="text-lg font-semibold text-text">
                        No decks found
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-text/40">
                        Nothing matched "{searchQuery}". Try searching for
                        another deck name, subject, or description.
                    </p>

                    <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="
                            mt-5 rounded-lg
                            border border-divider
                            bg-bg
                            px-4 py-2
                            text-sm text-text/60
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-105
                            hover:border-accent-2/50
                            hover:text-text
                            active:scale-95
                        "
                    >
                        Clear search
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-4 items-center gap-5">
                    {filteredDecks.map((deck) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            mode="all"
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}