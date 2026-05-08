"use client"

import { useState } from "react"
import { Navbar } from "@/components/dashboard/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, User } from "lucide-react"

interface Message {
  id: number
  role: "user" | "assistant"
  content: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your GovFin AI assistant. I can help you discover government schemes you're eligible for, answer questions about your finances, and provide personalized financial advice. How can I help you today?",
  },
]

const suggestedQuestions = [
  "What schemes am I eligible for?",
  "How can I improve my savings?",
  "Explain PM Svanidhi scheme",
  "Tips to reduce expenses",
]

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }

    const assistantMessage: Message = {
      id: messages.length + 2,
      role: "assistant",
      content:
        "Based on your financial profile, I can see that you have a monthly income of ₹45,000 and expenses of ₹32,500. Your savings rate of 27.8% is good, but there's room for improvement. I'd recommend exploring the PM Svanidhi scheme if you're a street vendor, or the MUDRA loan scheme if you're looking to start a small business. Would you like me to explain any of these in detail?",
    }

    setMessages([...messages, userMessage, assistantMessage])
    setInput("")
  }

  return (
    <>
      <Navbar title="AI Chat" />
      <main className="flex flex-1 flex-col overflow-hidden p-6">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4">
          {/* Chat Messages */}
          <Card className="flex-1 overflow-hidden rounded-2xl">
            <CardContent className="flex h-full flex-col p-0">
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback
                        className={
                          message.role === "assistant"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {message.role === "assistant" ? (
                          <Sparkles className="size-4" />
                        ) : (
                          <User className="size-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                size="sm"
                className="rounded-full text-xs"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>

          {/* Input Area */}
          <Card className="rounded-2xl">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <Input
                  placeholder="Ask me anything about government schemes or finances..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 border-0 bg-transparent focus-visible:ring-0"
                />
                <Button
                  size="icon"
                  className="shrink-0 rounded-xl"
                  onClick={handleSend}
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
