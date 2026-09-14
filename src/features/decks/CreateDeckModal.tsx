import { useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../auth/AuthProvider"
import { db } from "../../lib/firebase"

type CreateDeckModalProps = {
    isOpen: boolean
    onClose: () => void
}

export function CreateDeckModal({
    isOpen,
    onClose,
}: CreateDeckModalProps) {
    const { user } = useAuth()

    const [color, setColor] = useState("#ff2e88")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [subject, setSubject] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    if (!isOpen) {
        return null
    }

    const presetColors = [
        { name: "Pink", value: "#ff2e88" },
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Yellow", value: "#facc15" },
        { name: "Purple", value: "#a855f7" },
        { name: "Red", value: "#ef4444" },
    ]

    function handleClose() {
        setIsClosing(true)

        setTimeout(() => {
            setIsClosing(false)
            onClose()
        }, 150)
    }

    async function handleCreateDeck() {
        if (!user) {
            return
        }

        const trimmedTitle = title.trim()

        if (!trimmedTitle) {
            return
        }

        setIsCreating(true)

        try {
            const decksReference = collection(
                db,
                "users",
                user.uid,
                "decks"
            )

            await addDoc(decksReference, {
                title: trimmedTitle,
                description: description.trim(),
                subject: subject.trim(),
                color,
                isFavorite: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastAccessedAt: serverTimestamp(),
            })

            setTitle("")
            setDescription("")
            setSubject("")
            setColor("#ff2e88")

            onClose()
        } catch (error) {
            console.error("Unable to create deck: ", error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div
            className={`
                fixed inset-0 z-50 flex items-center justify-center
                bg-black/40 p-4 backdrop-blur-sm
                ${
                    isClosing
                        ? "animate-[fadeOut_0.15s_ease-in]"
                        : "animate-[fadeIn_0.2s_ease-out]"
                }
            `}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-deck-title"
                className={`
                    w-full max-w-lg rounded-2xl
                    border border-accent-2/40
                    bg-surface p-7
                    shadow-[0_0_25px_-5px]
                    shadow-accent-2/50
                    ${
                        isClosing
                            ? "animate-[modalOut_0.15s_ease-in]"
                            : "animate-[scaleIn_0.2s_ease-out]"
                    }
                `}
            >
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h2
                            id="create-deck-title"
                            className="text-2xl font-bold text-text"
                        >
                            Create a new deck
                        </h2>

                        <p className="mt-1 text-sm text-text/50">
                            Start building a new study set.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            rounded-lg p-2 text-text/50
                            transition
                            hover:bg-bg hover:text-text
                        "
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-7 space-y-5">

                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-text">
                            Deck title
                        </label>

                        <input
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            className="
                                mt-2 w-full rounded-xl
                                border border-divider
                                bg-bg/30 px-4 py-3
                                text-text outline-none
                                transition
                                placeholder:text-text/30
                                focus:outline-none
                                focus:border-accent-2
                                focus:shadow-none
                                focus:ring-0
                            "
                            placeholder="e.g. Biology — Cell Structure"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium text-text">
                            Description
                            <span className="ml-2 text-text/40">
                                (optional!)
                            </span>
                        </label>

                        <textarea
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                            className="
                                mt-2 min-h-24 w-full resize-none
                                rounded-xl border border-divider
                                bg-bg/30 px-4 py-3
                                text-text outline-none
                                transition
                                placeholder:text-text/30
                                focus:outline-none
                                focus:border-accent-2
                                focus:shadow-none
                                focus:ring-0
                            "
                            placeholder="What are you studying?"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm font-medium text-text">
                            Subject
                            <span className="ml-2 text-text/40">
                                (optional!)
                            </span>
                        </label>

                        <input
                            value={subject}
                            onChange={(event) =>
                                setSubject(event.target.value)
                            }
                            className="
                                mt-2 w-full rounded-xl
                                border border-divider
                                bg-bg/30 px-4 py-3
                                text-text outline-none
                                transition
                                placeholder:text-text/30
                                focus:outline-none
                                focus:border-accent-2
                                focus:shadow-none
                                focus:ring-0
                            "
                            placeholder="e.g. Biology"
                        />
                    </div>

                    {/* Color */}
                    <div>
                        <p className="text-sm font-medium text-text">
                            Deck color
                        </p>

                        <div className="mt-3 flex items-center gap-3">
                            {presetColors.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    onClick={() =>
                                        setColor(preset.value)
                                    }
                                    aria-label={`Choose ${preset.name}`}
                                    className={`
                                        h-8 w-8 rounded-full
                                        border-2
                                        transition-all duration-200
                                        hover:scale-110
                                        ${
                                            color === preset.value
                                                ? "border-divider ring-2 ring-accent-2 ring-offset-2 ring-offset-surface"
                                                : "border-transparent"
                                        }
                                    `}
                                    style={{
                                        backgroundColor: preset.value,
                                    }}
                                />
                            ))}

                            <div
                                className={`
                                    relative h-8 w-8 overflow-hidden
                                    rounded-full border-2
                                    border-divider/40
                                    transition-all duration-200
                                    hover:scale-110
                                    ${
                                        !presetColors.some(
                                            (preset) =>
                                                preset.value === color
                                        )
                                            ? "ring-2 ring-accent-2 ring-offset-2 ring-offset-surface"
                                            : ""
                                    }
                                `}
                                style={{
                                    backgroundColor: color,
                                }}
                            >
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(event) =>
                                        setColor(event.target.value)
                                    }
                                    className="
                                        absolute inset-0 h-full w-full
                                        cursor-pointer opacity-0
                                    "
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="
                            rounded-lg bg-surface px-4 py-2
                            text-sm text-text
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            hover:bg-bg
                            active:scale-90
                            active:rotate-1
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleCreateDeck}
                        disabled={isCreating || !title.trim()}
                        className="
                            rounded-lg bg-accent-2 px-4 py-2
                            text-sm text-text
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            active:scale-90
                            active:rotate-1
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            disabled:hover:scale-100
                            disabled:hover:rotate-0
                        "
                    >
                        {isCreating ? "Creating..." : "Create deck"}
                    </button>
                </div>
            </section>
        </div>
    )
}