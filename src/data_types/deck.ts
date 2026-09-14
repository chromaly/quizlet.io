import type { Timestamp } from "firebase/firestore";

export type Deck = {
  id: string;
  title: string;
  color?: string;
  description?: string;
  subject?: string;
  isFavorite: boolean;
  lastAccessedAt?: Timestamp;
  lastStudiedAt?: Timestamp
};