import type { QuickButton } from '../types'

const QUICK_BUTTONS: QuickButton[] = [
  { label: '放鬆 Relax', tag: 'relax' },
  { label: '助眠 Sleep', tag: 'sleep' },
  { label: '專注 Focus', tag: 'focus' },
  { label: '森林感 Nature', tag: 'nature' },
  { label: '清新 Fresh', tag: 'fresh' },
  { label: '送禮 Gift', tag: 'gift' },
]

interface Props {
  onSelect: (tag: string, label: string) => void
  disabled: boolean
}

export default function QuickButtons({ onSelect, disabled }: Props) {
  return (
    <div className="bg-white border-t border-[#EDE8E0] px-4 py-3">
      <p className="text-[10px] text-[#B09880] font-light mb-2 uppercase tracking-widest">快速選擇情境</p>
      <div className="flex gap-2 overflow-x-auto pb-1 product-scroll">
        {QUICK_BUTTONS.map((btn) => (
          <button
            key={btn.tag}
            onClick={() => onSelect(btn.tag, btn.label)}
            disabled={disabled}
            className="flex-shrink-0 px-4 py-1.5 rounded-full border border-[#C9A87C] text-[#8B5E3C] text-xs font-medium
              hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C] transition-all duration-200
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  )
}
