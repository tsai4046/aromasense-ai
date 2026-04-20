import type { Product } from '../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex-shrink-0 w-[200px] bg-white rounded-2xl border border-[#EDE8E0] p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-[#9C866E] bg-[#F5F0E8] px-2 py-0.5 rounded-full font-medium">
          {product.category}
        </span>
        {product.inStock ? (
          <span className="text-[10px] text-emerald-600 font-medium">有貨</span>
        ) : (
          <span className="text-[10px] text-red-400 font-medium">缺貨</span>
        )}
      </div>

      <h3 className="text-[#2D1B0E] font-semibold text-sm leading-snug mb-1">
        {product.name}
      </h3>

      <p className="text-[#8B5E3C] font-semibold text-base mb-2">
        NT$ {product.price.toLocaleString()}
      </p>

      <p className="text-[#7A6755] text-[11px] leading-relaxed mb-3 line-clamp-2">
        {product.description}
      </p>

      <div className="border-t border-[#F0EBE3] pt-2 mb-3">
        <p className="text-[10px] text-[#B09880] mb-0.5 font-medium uppercase tracking-wider">香調</p>
        <p className="text-[10px] text-[#7A6755] leading-relaxed line-clamp-2">{product.notes}</p>
      </div>

      <p className="text-[10px] text-[#9C866E] italic mb-3 line-clamp-1">
        適合：{product.scenario}
      </p>

      <button className="w-full py-1.5 rounded-xl bg-[#8B5E3C] text-white text-xs font-medium
        hover:bg-[#7A5233] transition-colors duration-200 active:scale-95">
        了解更多
      </button>
    </div>
  )
}
