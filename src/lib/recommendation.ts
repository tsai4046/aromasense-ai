import productsData from '../data/products.json'
import type { Product } from '../types'

const products = productsData as Product[]

const KEYWORD_MAP: Record<string, string[]> = {
  relax: ['放鬆', '舒壓', '壓力', '緊張', '焦慮', '疲勞', '紓壓', '舒緩', '累了'],
  sleep: ['睡不好', '失眠', '助眠', '睡眠', '安眠', '入睡', '睡覺', '晚上', '好眠'],
  nature: ['森林', '自然', '木質', '大自然', '戶外', '植物', '樹木', '山林', '檜木'],
  focus: ['專注', '提神', '工作', '讀書', '學習', '集中', '清醒', '注意力', '效率', '考試'],
  fresh: ['清新', '清爽', '通透', '活力', '清涼', '海洋', '提振', '爽'],
  gift: ['禮物', '送禮', '禮盒', '生日', '紀念日', '節日', '送人', '周年', '母親節', '父親節', '情人節'],
}

export function detectIntent(input: string): string | undefined {
  const lower = input.toLowerCase()
  for (const [tag, keywords] of Object.entries(KEYWORD_MAP)) {
    if (keywords.some((k) => lower.includes(k))) {
      return tag
    }
  }
  return undefined
}

export function getRecommendations(tag: string): Product[] {
  return products
    .filter((p) => p.tags.includes(tag))
    .map((p) => ({
      ...p,
      score: p.popularity * 8 + (p.inStock ? 10 : 0),
    }))
    .sort((a, b) => (b as Product & { score: number }).score - (a as Product & { score: number }).score)
    .slice(0, 3)
}
