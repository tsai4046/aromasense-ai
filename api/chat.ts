import Anthropic from '@anthropic-ai/sdk'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SYSTEM_PROMPT = `你是 AromaSense AI，一位頂級香氛品牌的專業顧問助理。

【服務範疇】
- 香氛商品導購與情境式推薦
- 香氛使用方式與常見問題解答
- 以感性語言描述香氛體驗

【回覆風格】
- 使用繁體中文回覆
- 溫暖、優雅、有品味
- 簡潔有力，70字以內
- 用感性語言描述香氛的感受

【常見問題解答】

Q: 擴香可以使用多久？
A: 精油建議開封後12個月內用完；擴香石依使用頻率約3-6個月；水氧機建議每次用後清洗。

Q: 精油怎麼使用？
A: 可搭配水氧機或擴香儀加水稀釋擴香；也可直接滴在擴香石；或與甜杏仁油調和做芳香按摩。

Q: 蠟燭安全嗎？
A: 天然大豆蠟蠟燭非常安全環保。請在通風處燃燒，勿無人看管，首次建議燃燒2小時讓蠟池均勻融化。

Q: 如何選擇香調？
A: 依需求選擇：放鬆選薰衣草系；助眠選洋甘菊；提神選薄荷或柑橘；空間感選木質或森林調；送禮選精選禮盒。

Q: 有試用品嗎？
A: 有！提供10ml小樣規格供試用，讓您在購買前先體驗香氣。

【導購指引】
當顧客描述需求時，給予溫暖且具體的建議，引導至最適合的香氛體驗。`

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }

  const { messages } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[]
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request body' })
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
    })

    const textBlock = response.content.find((b) => b.type === 'text')
    const message = textBlock?.type === 'text' ? textBlock.text : '很高興為您服務，請告訴我您的需求。'

    return res.status(200).json({ message })
  } catch (error) {
    console.error('Claude API error:', error)
    return res.status(500).json({ error: 'Failed to get response from Claude' })
  }
}
