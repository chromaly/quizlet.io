import { Link } from "react-router"
import type { Deck } from "../../data_types/deck"
import { useAuth } from "../../features/auth/AuthProvider"
import { useCardCount } from "../../features/homepage/hooks/useDeckInfo"
import { formatRelativeTime } from "../../utils/formatRelativeTime"

type DeckMode = "recent" | "favorites" | "continue" | "all"

type DeckCardProps = {
    deck: Deck
    mode: DeckMode
    onToggleFavorite: (deckId: string, isFavorite: boolean) => void
}

export function DeckCard({
    deck,
    mode,
    onToggleFavorite,
}: DeckCardProps) {
    const { user } = useAuth()

    const cardCount = useCardCount(user?.uid ?? null, deck.id)

    let timestamp
    let timestampLabel

    if (mode === "continue") {
        timestamp = deck.lastStudiedAt
        timestampLabel = "Studied"
    } else {
        timestamp = deck.lastAccessedAt
        timestampLabel = "Accessed"
    }

    return (
        <Link
            to={`/decks/${deck.id}`}
            className="
                group flex min-h-76 w-80 shrink-0 flex-col
                rounded-xl border border-divider
                bg-surface p-5
                transition-all duration-200
                hover:-translate-y-0.5
                hover:border-[var(--deck-color)]
                hover:shadow-lg
            "
            style={{
                "--deck-color": deck.color,
            } as React.CSSProperties}
        >
            <div className="min-w-0">
                <div className="flex items-center justify-between">
                    <h3 className="truncate text-lg font-semibold text-text">
                        {deck.title}
                    </h3>

                    <div className="ml-3 flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.preventDefault()
                                event.stopPropagation()

                                onToggleFavorite(
                                    deck.id,
                                    !deck.isFavorite
                                )
                            }}
                            aria-label={
                                deck.isFavorite
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                            }
                            className={`
                                rounded-lg px-1.5 py-1
                                text-lg leading-none
                                transition-transform duration-200
                                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                                hover:scale-125
                                hover:-rotate-6
                                active:scale-90
                                active:rotate-2
                                ${
                                    deck.isFavorite
                                        ? "text-yellow-400 hover:text-yellow-300"
                                        : "text-text/30 hover:text-yellow-400"
                                }
                            `}
                        >
                            {deck.isFavorite ? "★" : "☆"}
                        </button>

                        <div
                            className="h-3 w-3 rounded-full"
                            style={{
                                backgroundColor: deck.color ?? "#888",
                            }}
                        />
                    </div>
                </div>

                {deck.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-text/50">
                        {deck.description}
                    </p>
                )}

                {deck.subject && (
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-text/50">
                        {deck.subject}
                    </p>
                )}
            </div>

            <div className="mt-auto">
                {timestamp && (
                    <p className="text-xs font-medium tracking-wide text-text/50">
                        Last {timestampLabel}:{" "}
                        {formatRelativeTime(timestamp)}
                    </p>
                )}

                <div className="mt-2 flex items-end justify-between">
                    <p className="text-sm text-text/50">
                        {cardCount}{" "}
                        {cardCount === 1 ? "card" : "cards"}
                    </p>

                    <span
                        className="
                            text-sm font-medium text-text
                            transition-colors
                            group-hover:text-[var(--deck-color)]
                        "
                    >
                        Study →
                    </span>
                </div>
            </div>
        </Link>
    )
}