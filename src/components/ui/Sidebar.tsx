import { Link, useLocation } from "react-router"

type SidebarProps = {
    onCreateDeck: () => void
}

export function Sidebar({
    onCreateDeck,
}: SidebarProps) {
    const location = useLocation()

    const isActive = (path: string) => {
        return location.pathname === path
    }

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-bg flex flex-col p-4">

            {/* Logo */}
            <div className="px-3 py-4 mb-4">
                <Link
                    to="/"
                    className="flex text-xl font-bold justify-center"
                >
                    quizlet.io
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">

                {/* Home */}
                <Link
                    to="/"
                    className={`
                        text-text px-4 py-2 rounded-lg text-m
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1
                        ${
                            isActive("/")
                                ? "bg-accent-2 text-white"
                                : "hover:bg-white/5"
                        }
                    `}
                >
                    <span className="flex items-center text-left">Home</span>
                </Link>

                {/* Your Decks */}
                <Link
                    to="/decks"
                    className={`
                        text-text px-4 py-2 rounded-lg text-m
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1
                        ${
                            isActive("/decks")
                                ? "bg-accent-2 text-white"
                                : "hover:bg-white/5"
                        }
                    `}
                >
                    <span>Your Decks</span>
                </Link>

                {/* Create Deck */}
                <button
                    type="button"
                    onClick={onCreateDeck}
                    className="
                        text-text px-4 py-2 rounded-lg text-m
                        transition-transform duration-200
                        [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                        hover:scale-110 hover:-rotate-2
                        active:scale-90 active:rotate-1"
                >
                    <span className="flex items-center text-left">＋ Create Deck</span>
                </button>

            </nav>
        </aside>
    )
}