import type { Message } from '../types'
import ProductCard from './ProductCard'

interface Props {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col message-enter ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Avatar + bubble row */}
      <div className={`flex items-end gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-7 h-7 rounded-full bg-[#8B5E3C] flex items-center justify-center flex-shrink-0 mb-0.5">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-4 4-4 8a4 4 0 008 0c0-4-8-8-4-8z" />
            </svg>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
            ${isUser
              ? 'bg-[#8B5E3C] text-white rounded-br-sm'
              : 'bg-white text-[#2D1B0E] border border-[#EDE8E0] rounded-bl-sm shadow-sm'
            }`}
        >
          {message.content}
        </div>
      </div>

      {/* Product cards */}
      {!isUser && message.products && message.products.length > 0 && (
        <div className="mt-3 ml-9 w-full">
          <p className="text-[10px] text-[#B09880] mb-2 uppercase tracking-widest font-medium">
            為您推薦
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 product-scroll">
            {message.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <p className={`text-[10px] text-[#C4B8AA] mt-1 ${isUser ? 'mr-1' : 'ml-9'}`}>
        {message.timestamp.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  )
}
