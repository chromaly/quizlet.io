import type { Card } from "../../../../data_types/card"

type CardDisplayProps = {
    card: Card
    index: number
    onClick: () => void
}

export default function CardDisplay({
    card,
    index,
    onClick,
}: CardDisplayProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="
                w-full text-left
                rounded-xl border border-divider
                bg-surface
                p-5
                transition-transform duration-200
                [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]
                hover:scale-[1.02]
                hover:bg-white/5
                active:scale-[0.98]
            "
        >
            <div className="flex gap-5">
                <span className="w-8 shrink-0 text-sm font-medium text-text/40">
                    {index + 1}
                </span>

                <div className="grid flex-1 grid-cols-2 gap-8">
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text/40">
                            Term
                        </p>
                        <p className="text-base font-medium text-text">
                            {card.term}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text/40">
                            Definition
                        </p>
                        <p className="text-base text-text/80">
                            {card.definition}
                        </p>
                    </div>
                </div>
            </div>
        </button>
    )
}