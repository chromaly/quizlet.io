import { useAuth } from "../auth/AuthProvider"
import { DeckCard } from "../../components/ui/DeckCard"
import { updateDeckFavorites, useDecks } from "./hooks/useDeckInfo"

export function HomePage(){
    const { user } = useAuth()

    const recentDecks = useDecks(user?.uid ?? null, "recent")
    const continueDecks = useDecks(user?.uid ?? null, "continue")
    const favoriteDecks = useDecks(user?.uid ?? null, "favorites")

    const hour = new Date().getHours()

    let greeting = "Good morning"

    if (hour > 18){
        greeting = "Good evening"
    } else if (hour > 12){
        greeting = "Good afternoon"
    }

    const handleToggleFavorite = async (deckId: string, isFavorite: boolean) => {
          if (!user || !deckId) return
          
          await updateDeckFavorites(user.uid, deckId, isFavorite)
        }
        
    return (
        <div className="space-y-8">
            <p className="flex text-4xl font-bold text-text"> Dashboard </p>
            {(!user && 
            <>
                <p>Sign in to create and save decks!</p>
              </>
            )
            }
            {(user && 
            <>
                <p className="text-text text-2xl font-semibold mb-2"> {greeting}, {user.displayName?.split(" ")[0]}.</p>
                <p className="text-text/80 text-base mt-1"> Here's what you've been working on.</p>

                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-text">
                        Continue Studying
                    </h2>

                    <div className="h-px flex-1 bg-divider" />
                </div>

                <div className="mx-auto grid grid-cols-3 gap-6 max-w-6xl justify-center">
                    {continueDecks.map((deck) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            mode={"continue"}
                            onToggleFavorite={handleToggleFavorite}
                            />
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-text">
                        Recents
                    </h2>
        
                    <div className="h-px flex-1 bg-divider" />

                </div>
                
                <div className="mx-auto grid grid-cols-3 gap-6 max-w-6xl justify-center">
                    {recentDecks.map((deck) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            mode={"recent"}
                            onToggleFavorite={handleToggleFavorite}
                            />
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-text">
                        Favorites
                    </h2>

                    <div className="h-px flex-1 bg-divider" />
                </div>

                <div className="mx-auto grid grid-cols-3 gap-6 max-w-6xl justify-center">
                    {favoriteDecks.map((deck) => (
                        <DeckCard
                            key={deck.id}
                            deck={deck}
                            mode={"favorites"}
                            onToggleFavorite={handleToggleFavorite}
                            />
                    ))}
                </div>
            </>
            )}
            
                
        </div>
    )
}

