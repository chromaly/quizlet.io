import { Link, Route, Routes } from "react-router"
import { DecksPage } from "../src/features/decks/DecksPage.tsx"
import { DeckInfoPage } from "../src/features/decks/DeckInfoPage.tsx"
import { ProtectedRoute } from "../src/features/auth/ProtectedRoute"
import { DeckCardCreation } from "./features/decks/DeckCardCreation.tsx"
import { StudyPage } from "./features/study/StudyPage.tsx"
import { QuizPage } from "./features/quiz/QuizPage.tsx"
import { ResultsPage } from "./features/quiz/ResultsPage.tsx"
import QuizSetupPage from "./features/quiz/QuizSetupPage.tsx"
import { HomePage } from "./features/homepage/HomePage.tsx"
import { DeckAIGeneration } from "./features/decks/DeckAIGeneration.tsx"

import { Sidebar } from "./components/ui/Sidebar.tsx"
import { AuthMenu } from "./features/auth/AuthMenu.tsx"
import { useEffect, useState } from "react"
import { CreateDeckModal } from "./features/decks/CreateDeckModal.tsx"
import { AiAssistant } from "./features/ai/AiChatbot.tsx"
import { useAuth } from "./features/auth/AuthProvider.tsx"


export default function App() {

  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false)
  const { user } = useAuth()
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false)

  useEffect(() => {
          if (user) {
              setAiAssistantEnabled(true)
              console.log("im signed in")
          }else{
            setAiAssistantEnabled(false)
            console.log("im not signed in")
          }
      }, [user])
      
  return (
    <div className="min-h-screen">
      <Sidebar onCreateDeck={() => setIsCreateDeckOpen(true)} isCreateDeckOpen={isCreateDeckOpen}/>

      <CreateDeckModal
        isOpen={isCreateDeckOpen}
        onClose={() => setIsCreateDeckOpen(false)}
      />

      <AiAssistant
        isEnabled={aiAssistantEnabled}
      />
      <main className="ml-[330px] min-h-screen">
        <div className="flex justify-end">
          <AuthMenu />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/decks" element={<DecksPage onCreateDeck={() => setIsCreateDeckOpen(true)}/>} />
            <Route path="/decks/:deckId" element={<DeckInfoPage />} />
            <Route path="/decks/:deckId/aiGeneration" element={<DeckAIGeneration />} />
            <Route path="/decks/:deckId/edit" element={<DeckCardCreation />} />
            <Route path="/decks/:deckId/study" element={<StudyPage />} />
            <Route path="/decks/:deckId/quizSetup" element={<QuizSetupPage />} />
            <Route path="/decks/:deckId/quiz" element={<QuizPage />} />
            <Route path="/decks/:deckId/quiz/results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

// <Route path="/settings" element={<SettingsPage />} />