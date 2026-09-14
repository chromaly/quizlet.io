import { useState, useEffect, useRef } from "react"

import { assistantModel } from "../../ai/gemini"

type Message = {
    role: "user" | "ai"
    content: string
}

type Chat = ReturnType<typeof assistantModel.startChat>


type AiAssistantProps = {
    isEnabled: boolean
}
export function AiAssistant({isEnabled}: AiAssistantProps) {

    const [isOpen, setIsOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [chat, setChat] = useState<Chat | null>(null)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    async function sendMessage(text: string) {
        if (!text.trim() || !chat) return

        const userMessage = text

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ])

        setMessage("")

        try {
            const result = await chat.sendMessage(userMessage)
            const aiMessage = result.response.text()

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: aiMessage,
                },
            ])
        } catch (error) {
            console.log("ERROR:", error)

            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    content: "Sorry, something went wrong. Try again.",
                },
            ])
        }
    }

    useEffect(() => {
        if (isOpen && !chat) {
            const newChat = assistantModel.startChat()
            setChat(newChat)
        }
    }, [isOpen, chat])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [messages])

     if (!isEnabled) return null

    return (
        <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent-2 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? "scale-0 opacity-0 pointer-events-none" : ""}`}>
        <span className="text-xl">✦</span>
      </button>

      <div
        className={`
          fixed top-0 right-0 z-50
          h-screen w-[350px]
          bg-surface
          border-l border-white/10
          shadow-2xl
          flex flex-col
          transition-transform duration-300 ease-out
          overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-divider/10">
          <div>
            <h2 className="text-text font-semibold">
              AI Assistant
            </h2>

            <p className="text-text/40 text-xs mt-1">
              Your Personal Assistant.
            </p>
             
             <p className="text-text/40 text-xs mt-1">
              So cute.
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="text-text/40 hover:text-text transition-colors text-xl"
            aria-label="Close AI assistant"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="text-3xl mb-3">✦</div>

                <h3 className="text-text font-medium">
                  How can I help?
                </h3>

                <p className="text-text/40 text-sm mt-2 max-w-[260px]">
                  Ask me anything! I know about a million things.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[80%]
                    px-4 py-3
                    rounded-2xl
                    text-sm
                    ${
                      msg.role === "user"
                        ? "bg-accent-2 text-white/90 rounded-br-md"
                        : "bg-accent-1 text-white/90 rounded-bl-md"
                    }
                  `}
                >
                  {msg.content}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 bg-bg/5 border border-divider/10 rounded-xl px-3 py-2 focus-within:border-accent-2/60 transition-colors">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(message);
                }
              }}
              placeholder="i'm waiting..."
              className="flex-1 bg-transparent border-0 focus:border-accent-2 outline-none focus:outline-none focus:ring-0 text-text text-sm placeholder:text-text/30 focus:outline-none focus:shadow-none"
            />

            <button
              onClick={() => sendMessage(message)}
              disabled={!message.trim()}
              className="text-accent-2 disabled:text-text/20 transition-colors"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
    )
}