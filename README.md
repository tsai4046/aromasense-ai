# AromaSense AI — 智慧香氛顧問

一款以 AI 驅動的香氛品牌聊天機器人，結合情境推薦與商品導購，適合作為電商品牌網站的 POC 展示。

![AromaSense AI 截圖](https://placehold.co/600x400?text=AromaSense+AI)

---

## 功能特色

- **AI 對話顧問**：由 Claude Haiku 驅動，以繁體中文提供溫暖、優雅的香氛建議
- **情境快速選擇**：6 個快速按鈕（放鬆／助眠／專注／森林感／清新／送禮）
- **智慧商品推薦**：根據對話意圖自動推薦最適合的 3 款商品，附商品卡片
- **常見問題解答**：內建 FAQ（精油用法、擴香壽命、蠟燭安全、香調選擇等）
- **每日次數限制**：每位使用者每天最多 10 次查詢，控制 API 費用
- **響應式設計**：Mobile-first，適合手機瀏覽

---

## 技術架構

```
┌─────────────────────────────────┐
│         使用者瀏覽器             │
│   React + TypeScript + Vite     │
│   Tailwind CSS (暖色系主題)      │
└────────────┬────────────────────┘
             │ POST /api/chat
             ▼
┌─────────────────────────────────┐
│      Vercel Serverless Function  │
│         api/chat.ts             │
│   (API Key 保存在伺服器端)       │
└────────────┬────────────────────┘
             │ Anthropic SDK
             ▼
┌─────────────────────────────────┐
│       Claude Haiku 4.5          │
│   (Prompt Caching 降低費用)      │
└─────────────────────────────────┘
```

### 技術棧

| 層級 | 技術 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 建構工具 | Vite 5 |
| 樣式 | Tailwind CSS 3 |
| AI 模型 | Claude Haiku 4.5（`@anthropic-ai/sdk`） |
| 後端 | Vercel Serverless Function |
| 部署 | Vercel |
| 字體 | Noto Sans TC（Google Fonts） |

---

## 專案結構

```
aromasense-ai/
├── api/
│   └── chat.ts              # Vercel Serverless Function（呼叫 Claude API）
├── src/
│   ├── components/
│   │   ├── Header.tsx        # 品牌標題列
│   │   ├── ChatWindow.tsx    # 聊天視窗（含打字動畫）
│   │   ├── MessageBubble.tsx # 訊息泡泡 + 商品卡片
│   │   ├── ProductCard.tsx   # 商品卡片元件
│   │   ├── QuickButtons.tsx  # 情境快速按鈕
│   │   └── InputBar.tsx      # 輸入列 + 剩餘次數顯示
│   ├── lib/
│   │   ├── recommendation.ts # 本地意圖偵測 + 商品推薦邏輯
│   │   └── rateLimit.ts      # 每日 10 次限制（localStorage）
│   ├── data/
│   │   └── products.json     # 12 款香氛商品資料
│   ├── types/
│   │   └── index.ts          # TypeScript 型別定義
│   ├── App.tsx               # 主元件（狀態管理）
│   ├── main.tsx              # 進入點
│   └── index.css             # 全域樣式 + 動畫
├── dev-server.mjs            # 本地開發用 API Server（port 3001）
├── vercel.json               # Vercel 部署設定
├── vite.config.ts            # Vite 設定（含 /api proxy）
└── .env.example              # 環境變數範例
```

---

## 本地開發環境設定

### 前置需求

- Node.js 18+
- Anthropic API Key（從 [console.anthropic.com](https://console.anthropic.com) 取得）

### 安裝步驟

```bash
# 1. Clone 專案
git clone https://github.com/tsai4046/aromasense-ai.git
cd aromasense-ai

# 2. 安裝依賴
npm install

# 3. 建立環境變數檔案
cp .env.example .env
# 編輯 .env，填入你的 ANTHROPIC_API_KEY

# 4. 啟動前端（Vite dev server，port 5173）
npm run dev

# 5. 另開一個終端，啟動本地 API Server（port 3001）
node --env-file=.env dev-server.mjs
```

開啟瀏覽器前往 `http://localhost:5173`

> **為什麼需要兩個 server？**
> Vite 負責服務前端靜態檔案，`dev-server.mjs` 負責處理 `/api/chat` 的 AI 呼叫。
> Vite 的 proxy 設定會將 `/api` 的請求自動轉發到 port 3001。
> 部署到 Vercel 後，`api/chat.ts` 會自動變成 Serverless Function，不再需要 `dev-server.mjs`。

---

## 部署到 Vercel

### 步驟

1. 將專案推送到 GitHub
2. 前往 [vercel.com](https://vercel.com)，用 GitHub 帳號登入
3. 點選 **Add New Project** → Import `aromasense-ai`
4. 在 **Environment Variables** 新增：
   ```
   ANTHROPIC_API_KEY = sk-ant-xxxxxxxxxxxx
   ```
5. 點選 **Deploy**

Vercel 會自動讀取 `vercel.json` 的設定，將 `api/chat.ts` 部署為 Serverless Function，其餘路由由 React SPA 接管。

---

## 核心實作說明

### 1. AI 對話（`api/chat.ts`）

使用 `@anthropic-ai/sdk` 呼叫 Claude Haiku，System Prompt 設定了品牌人設、回覆風格、FAQ 內容與導購指引。

**Prompt Caching** — System Prompt 加上 `cache_control: { type: 'ephemeral' }`，相同 prefix 的請求直接命中快取，大幅降低 API Token 費用。

```typescript
const response = await client.messages.create({
  model: 'claude-haiku-4-5',
  max_tokens: 300,
  system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
  messages,
})
```

### 2. 本地意圖偵測 + 商品推薦（`src/lib/recommendation.ts`）

商品推薦**不呼叫 AI API**，完全在前端本地執行，節省費用與延遲：

- `detectIntent(input)` — 關鍵字比對，將使用者輸入對應到情境 tag（relax / sleep / focus / nature / fresh / gift）
- `getRecommendations(tag)` — 從 `products.json` 篩選符合 tag 的商品，依 `popularity × 8 + inStock ? 10 : 0` 評分，回傳前 3 名

### 3. 每日查詢限制（`src/lib/rateLimit.ts`）

使用 `localStorage` 儲存當日使用次數，以日期為 key 自動重置：

```typescript
// 格式：{ date: "2026-04-21", count: 3 }
localStorage.setItem('aromasense_usage', JSON.stringify({ date, count }))
```

- 每天上限 10 次
- 剩餘次數即時顯示在輸入列右下角
- 剩餘 3 次以下變橘紅色警示
- 達到上限後封鎖 API 呼叫，顯示提示訊息

### 4. 商品資料（`src/data/products.json`）

12 款香氛商品，涵蓋所有 6 種情境 tag，欄位包含：

| 欄位 | 說明 |
|------|------|
| `id` | 商品唯一識別碼 |
| `name` | 商品名稱 |
| `price` | 價格（NT$） |
| `description` | 商品描述 |
| `notes` | 香調 |
| `scenario` | 使用情境 |
| `tags` | 情境標籤（可多個） |
| `category` | 商品分類（精油／蠟燭／擴香石等） |
| `inStock` | 庫存狀態 |
| `popularity` | 熱門程度（用於排序） |

---

## 環境變數

| 變數名稱 | 說明 | 必填 |
|---------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 金鑰 | ✅ |

---

## 費用估算

以 POC 面試展示為例（每天 ~50 次對話）：

| 項目 | 費用 |
|------|------|
| Claude Haiku 4.5 Input（含快取）| ~$0.001 / 次 |
| Claude Haiku 4.5 Output | ~$0.0005 / 次 |
| Vercel 免費方案 | $0 |
| **每月估計** | **< $3 USD** |

> 每日 10 次查詢限制可進一步控制費用，確保展示期間不會超支。

---

## 開發過程紀錄

本專案從零開始，由 Claude Code 協助完成以下所有工作：

1. **專案初始化** — 建立 Vite + React + TypeScript 專案結構
2. **UI 元件開發** — Header、ChatWindow、MessageBubble、ProductCard、QuickButtons、InputBar
3. **AI 整合** — Vercel Serverless Function + Anthropic SDK + Prompt Caching
4. **商品推薦系統** — 本地關鍵字意圖偵測 + 評分演算法
5. **本地開發環境** — dev-server.mjs + Vite proxy 設定
6. **每日限制功能** — localStorage 計數器 + 前端剩餘次數顯示
7. **部署設定** — vercel.json + .gitignore + GitHub 推送
8. **Vercel 部署** — Serverless Function + 環境變數設定

---

## License

MIT
