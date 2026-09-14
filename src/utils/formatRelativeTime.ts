import type { Timestamp } from "firebase/firestore"

export function formatRelativeTime(timestamp: Timestamp) {
    const now = Date.now()
    const time = timestamp.toMillis()

    const difference = now - time

    const minutes = Math.floor(difference / (1000 * 60))
    const hours = Math.floor(difference / (1000 * 60 * 60))
    const days = Math.floor(difference / (1000 * 60 * 60 * 24))

    if (minutes < 1) {
        return "just now"
    }

    if (hours < 1) {
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    }

    if (days < 1) {
        return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    }

    if (days === 1) {
        return "yesterday"
    }

    if (days < 7) {
        return `${days} days ago`
    }

    return timestamp.toDate().toLocaleDateString()
}