import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { onAuthStateChanged, signInWithPopup, signOut, type User, GoogleAuthProvider } from "firebase/auth"

import { auth } from "../../lib/firebase"

type AuthContextValue = {
    user: User | null;
    isLoading: boolean;
}
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
export async function handleSignOut() {
    await signOut(auth)
}

export async function handleSignIn() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    } 
}