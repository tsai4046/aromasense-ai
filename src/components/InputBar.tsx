import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  onSend: (input: string) => void
  isLoading: boolean
  remaining: number
}

export default function InputBar({ onSend, isLoading, remaining }: Props) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="bg-white border-t border-[#EDE8E0] px-4 py-3">
      <div className="flex items-center gap-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E0D5] px-4 py-2.5
        focus-within:border-[#C9A87C] focus-within:ring-1 focus-within:ring-[#C9A87C]/30 transition-all duration-200">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="告訴我您的心情或需求..."
          className="flex-1 bg-transparent text-[#2D1B0E] text-sm placeholder:text-[#C4B8AA]
            outline-none disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          className="w-8 h-8 rounded-xl bg-[#8B5E3C] flex items-center justify-center flex-shrink-0
            hover:bg-[#7A5233] transition-colors duration-200
            disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
        >
          {isLoading ? (
            <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          )}
        </button>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-[10px] text-[#C4B8AA] font-light">按 Enter 送出 · 由 Claude AI 驅動</p>
        <p className={`text-[10px] font-medium ${remaining <= 3 ? 'text-[#C0694C]' : 'text-[#C4B8AA]'}`}>
          今日剩餘 {remaining} 次
        </p>
      </div>
    </div>
  )
}
