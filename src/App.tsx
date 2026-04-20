import { useState, useCallback } from 'react'
import Header from './components/Header'
import ChatWindow from './components/ChatWindow'
import QuickButtons from './components/QuickButtons'
import InputBar from './components/InputBar'
import type { Message } from './types'
import { detectIntent, getRecommendations } from './lib/recommendation'
import { canQuery, incrementQueryCount, getRemainingQueries } from './lib/rateLimit'

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '您好，我是 AromaSense AI 香氛顧問。\n\n請告訴我您的心情或需求，我將為您推薦最適合的香氛商品。您也可以點選下方的快速按鈕，立即探索各種情境的香氛推薦。',
  timestamp: new Date(),
}

const TAG_LABELS: Record<string, string> = {
  relax: '放鬆',
  sleep: '助眠',
  focus: '專注',
  nature: '森林感',
  fresh: '清新',
  gift: '送禮',
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [isLoading, setIsLoading] = useState(false)
  const [remaining, setRemaining] = useState(() => getRemainingQueries())

  const sendMessage = useCallback(
    async (input: string, quickTag?: string) => {
      const content = quickTag
        ? `我想找適合「${TAG_LABELS[quickTag]}」的香氛`
        : input

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      if (!canQuery()) {
        setMessages((prev) => [
          ...prev,
          userMsg,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '今日諮詢次數已達上限（10次），請明天再來探索更多香氛世界 🌿',
            timestamp: new Date(),
          },
        ])
        return
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      const tag = quickTag ?? detectIntent(input)
      const products = tag ? getRecommendations(tag) : []

      try {
        incrementQueryCount()
        setRemaining(getRemainingQueries())
        const history = [...messages, userMsg]
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        })

        if (!res.ok) throw new Error(`API error ${res.status}`)
        const data = await res.json()

        const assistantMsg: Message = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: data.message,
          products: products.length > 0 ? products : undefined,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMsg])
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '抱歉，暫時無法回應，請稍後再試。',
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages],
  )

  const handleQuickSelect = useCallback(
    (tag: string, _label: string) => {
      if (isLoading) return
      sendMessage('', tag)
    },
    [isLoading, sendMessage],
  )

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#FAF7F2] shadow-xl">
      <Header />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <QuickButtons onSelect={handleQuickSelect} disabled={isLoading} />
      <InputBar onSend={(v) => sendMessage(v)} isLoading={isLoading} remaining={remaining} />
    </div>
  )
}
