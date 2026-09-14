import { useState, useRef, useEffect } from "react"
import { useAuth, handleSignOut, handleSignIn } from "./AuthProvider.tsx"

export function SignInModal({ onClose }: {onClose: () => void}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-surface border border-accent-2/40 rounded-xl p-8 w-96 text-center">
            <h2 className="text-2xl font-bold mb-2">Sign in to access quizlet.io</h2>
            <p className="text-text/60 text-sm mb-2">You can create, edit, and manage your decks afterward. </p>
            <p className="text-text/60 text-sm mt-4 mb-6">Identification is everything, you know. </p>
            <button
              onClick={async () => {
                await handleSignIn()
                onClose()
              }}
              className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto hover:bg-white/90 transition-transform duration-200
                  [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-110
                  hover:-rotate-2
                  active:scale-90
                  active:rotate-1"
            >
              Continue with Google
            </button>
            <button onClick={onClose} className="mt-4 rounded-lg bg-bg px-4 py-2 text-text/40 text-sm hover:text-text/60 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-110
                  hover:-rotate-2
                  active:scale-90
                  active:rotate-1">
              Maybe later...
            </button>
          </div>
        </div>
  )
}

export function AuthMenu() {
    const { user, isLoading } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (isLoading) {
        return null
    }

    if (!user) {
        return (
          <>
          <button
              className="
                  w-20
                  h-9
                  px-3 py-2
                  rounded-lg
                  bg-accent-2
                  text-white
                  transition-transform duration-200
                  [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                  hover:scale-110
                  hover:-rotate-2
                  active:scale-90
                  active:rotate-1
              "
              onClick={() => setIsSignInModalOpen(true)}
            >
                Sign In
            </button>
              {isSignInModalOpen && (
              <SignInModal
                onClose={() => setIsSignInModalOpen(false)}
              />
            )}
          </>

        )
    }
    return (
        <div ref={menuRef} className="relative animate-[fadeIn_0.2s_ease-out,scaleIn_0.2s_ease-out]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-divider/20 hover:border-accent-2 transition-colors"
      >
        <img
          src={user.photoURL ?? undefined}
          alt={user.displayName ?? "User avatar"}
          className="w-full h-full object-cover"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-accent-2/40 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="px-4 py-3 border-b border-divider/10">
            <p className="text-sm font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-text/50 truncate">{user.email}</p>
          </div>
          <button
            onClick={() => { handleSignOut(), setIsOpen(false) }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-accent-1/20"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
    )
}
