import { useRef, useEffect } from 'react'
import type { Message } from '../types'
import MessageBubble from './MessageBubble'

interface Props {
  messages: Message[]
  isLoading: boolean
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-[#8B5E3C] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-4 4-4 8a4 4 0 008 0c0-4-8-8-4-8z" />
        </svg>
      </div>
      <div className="bg-white border border-[#EDE8E0] rounded-2xl rounded-bl-sm shadow-sm px-4 py-3 flex gap-1.5 items-center">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#C9A87C]"></span>
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#C9A87C]"></span>
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-[#C9A87C]"></span>
      </div>
    </div>
  )
}

export default function ChatWindow({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
