export interface Product {
  id: string
  name: string
  price: number
  description: string
  notes: string
  scenario: string
  tags: string[]
  category: string
  inStock: boolean
  popularity: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: Product[]
  timestamp: Date
}

export interface QuickButton {
  label: string
  tag: string
}
