const LIMIT = 10
const KEY = 'aromasense_usage'

interface Usage {
  date: string
  count: number
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function getUsage(): Usage {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed: Usage = JSON.parse(raw)
      if (parsed.date === today()) return parsed
    }
  } catch {}
  return { date: today(), count: 0 }
}

export function getRemainingQueries(): number {
  return Math.max(0, LIMIT - getUsage().count)
}

export function canQuery(): boolean {
  return getUsage().count < LIMIT
}

export function incrementQueryCount(): void {
  const usage = getUsage()
  localStorage.setItem(KEY, JSON.stringify({ date: today(), count: usage.count + 1 }))
}
