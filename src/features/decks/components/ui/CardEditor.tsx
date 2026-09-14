import type { Card } from "../../../../data_types/card"
import { forwardRef } from "react"

type CardEditorProps = {
    card: Card
    index: number
    onUpdate: (
        id: string,
        field: "term" | "definition",
        value: string
    ) => void
    onDelete: (id: string) => void
    isHighlighted: boolean
    isInvalid: boolean
}

const CardEditor = forwardRef<HTMLDivElement, CardEditorProps>(
    (
        {
            card,
            index,
            onUpdate,
            onDelete,
            isHighlighted,
            isInvalid,
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={`
                    mb-4 w-full rounded-xl border
                    bg-surface p-5
                    transition-transform duration-200
                    [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                    ${
                        isHighlighted
                            ? "border-blue-400 ring-4 ring-blue-300/40"
                            : "border-divider"
                    }
                    ${
                        isInvalid
                            ? "border-red-500 ring-2 ring-red-300/40"
                            : ""
                    }
                `}
            >
                <div className="flex gap-5">
                    {/* Card Number */}
                    <span className="w-8 shrink-0 text-sm font-medium text-text/40">
                        {index + 1}
                    </span>

                    {/* Card Content */}
                    <div className="grid flex-1 grid-cols-2 gap-8">

                        {/* Term */}
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text/40">
                                Term
                            </p>

                            <input
                                type="text"
                                value={card.term}
                                onChange={(e) =>
                                    onUpdate(
                                        card.id,
                                        "term",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter term"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-divider
                                    bg-bg/30
                                    px-3 py-2
                                    text-base text-text
                                    placeholder:text-text/30
                                    outline-none
                                    focus:outline-none focus:border-divider focus:ring-0 focus:shadow-none
                                "
                            />
                        </div>

                        {/* Definition */}
                        <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text/40">
                                Definition
                            </p>

                            <input
                                type="text"
                                value={card.definition}
                                onChange={(e) =>
                                    onUpdate(
                                        card.id,
                                        "definition",
                                        e.target.value
                                    )
                                }
                                placeholder="Enter definition"
                                className="
                                    w-full
                                    rounded-lg
                                    border border-divider
                                    bg-bg/30
                                    px-3 py-2
                                    text-base text-text
                                    placeholder:text-text/30
                                    outline-none
                                    focus:outline-none focus:border-divider focus:ring-0 focus:shadow-none
                                "
                            />
                        </div>
                    </div>

                    {/* Delete */}
                    <button
                        type="button"
                        onClick={() => onDelete(card.id)}
                        className="
                            shrink-0 self-start
                            rounded-lg
                            px-2 py-1
                            text-sm text-text/40
                            transition-transform duration-200
                            [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                            hover:scale-110
                            hover:-rotate-2
                            hover:bg-red-500/10
                            hover:text-red-400
                            active:scale-90
                            active:rotate-1
        
                        "
                    >
                        Delete
                    </button>
                </div>
            </div>
        )
    }
)

CardEditor.displayName = "CardEditor"

export default CardEditor