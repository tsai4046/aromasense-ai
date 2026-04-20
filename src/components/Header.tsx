export default function Header() {
  return (
    <header className="bg-white border-b border-[#EDE8E0] px-5 py-4 flex items-center gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-[#8B5E3C] flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6M9 17h6" />
        </svg>
      </div>
      <div>
        <h1 className="text-[#2D1B0E] font-semibold text-[15px] leading-tight tracking-wide">
          AromaSense AI
        </h1>
        <p className="text-[#9C866E] text-xs font-light">智慧香氛顧問</p>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        <span className="text-xs text-[#9C866E] font-light">線上服務中</span>
      </div>
    </header>
  )
}
