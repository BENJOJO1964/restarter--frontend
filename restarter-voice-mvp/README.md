# Restarter Voice MVP

一個專為更生人設計的社交學習平台，結合AI技術提供情感支持、技能訓練和社交機會。

## 🚀 專案架構

### 前端 (React + TypeScript)
- **技術棧**: React 18 + TypeScript + Vite + Tailwind CSS
- **端口**: 5174 (開發) / 4173 (預覽)
- **主要功能**:
  - 🎨 打地鼠遊戲 (情緒發洩)
  - 🎯 任務挑戰 (AI生成日常任務)
  - 🤝 配對對聊 (AI引導安全對話)
  - 🛠️ 情境模擬室 (社會技能練習)
  - 💬 AI聊天伴侶 (虛擬人對話)
  - 👥 朋友配對 (尋找新朋友)
  - 🏠 重啟牆 (社群功能)
  - 📧 收件匣 (訊息管理)

### 後端 (Node.js + Express)
- **技術棧**: Node.js + Express + WebSocket
- **端口**: 3001
- **API服務**:
  - `/api/whisper` - 語音識別
  - `/api/gpt` - AI對話
  - `/api/tts` - 語音合成
  - `/api/quotes` - 名言引用
  - WebSocket - 即時通訊

### 移動端 (Flutter)
- **技術棧**: Flutter + Dart
- **功能**: 回音盒、重啟牆、我的故事
- **多語言**: 繁體中文、簡體中文、英文、日文、韓文、越南文

## 🛠️ 快速開始

### 前置需求
- Node.js 18+
- npm 或 yarn
- Flutter 3.x (可選，用於移動端)

### 1. 安裝依賴

```bash
# 安裝前端依賴
cd restarter-voice-mvp/frontend
npm install

# 安裝後端依賴
cd ../backend
npm install
```

### 2. 啟動服務

```bash
# 啟動後端服務 (終端 1)
cd restarter-voice-mvp/backend
npm start

# 啟動前端服務 (終端 2)
cd restarter-voice-mvp/frontend
npm run dev
```

### 3. 訪問應用

- **前端**: http://localhost:5174
- **後端健康檢查**: http://localhost:3001/health
- **測試頁面**: http://localhost:5174/test

## 🔧 開發指南

### 專案結構
```
restarter-voice-mvp/
├── frontend/                 # React 前端
│   ├── pages/               # 頁面組件
│   ├── components/          # 可重用組件
│   ├── hooks/              # 自定義 Hooks
│   ├── utils/              # 工具函數
│   └── public/             # 靜態資源
├── backend/                 # Node.js 後端
│   ├── routes/             # API 路由
│   ├── services/           # 業務邏輯
│   └── server.js           # 服務器入口
└── shared/                 # 共享資源
    ├── types.ts            # TypeScript 類型
    └── tones.json          # 語調配置
```

### 環境變數
創建 `.env` 文件在後端目錄：

```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key
```

### 開發腳本

```bash
# 前端開發
npm run dev          # 啟動開發服務器
npm run build        # 構建生產版本
npm run preview      # 預覽生產版本

# 後端開發
npm start            # 啟動服務器
npm run dev          # 開發模式 (nodemon)
```

## 🌟 核心功能

### 1. 情緒管理系統
- **打地鼠遊戲**: 分數計算、升降級機制、嘲諷系統
- **情緒日記**: 記錄和追蹤情緒變化
- **冥想引導**: 放鬆和減壓練習

### 2. AI 伴侶系統
- **個人化AI助手**: 根據用戶需求提供支持
- **多角色虛擬人**: 19個不同的AI角色
- **情境對話訓練**: 練習社交技能

### 3. 社交重建系統
- **匿名社群**: 安全的交流環境
- **朋友配對**: 智能匹配系統
- **群組活動**: 集體互動機會

### 4. 技能發展系統
- **情境模擬**: 真實場景練習
- **角色扮演**: 互動式學習
- **溝通技巧**: 專業訓練課程

## 🔌 API 文檔

### WebSocket 訊息格式

```typescript
// 聊天訊息
{
  type: 'chat',
  message: string,
  user: string,
  timestamp: string
}

// 遊戲訊息
{
  type: 'game',
  action: string,
  data: any,
  timestamp: string
}

// 信號訊息
{
  type: 'signal',
  from: string,
  signal: any,
  timestamp: string
}
```

### REST API 端點

```bash
GET  /health              # 健康檢查
GET  /                    # 服務器狀態
POST /api/upload          # 文件上傳
POST /api/whisper         # 語音識別
POST /api/gpt             # AI對話
POST /api/tts             # 語音合成
GET  /api/quotes          # 名言引用
```

## 🚀 部署

### 生產環境構建

```bash
# 前端構建
cd frontend
npm run build

# 後端部署
cd backend
npm start
```

### 環境配置
- 設置環境變數
- 配置數據庫連接
- 設置文件存儲
- 配置域名和SSL

## 🤝 貢獻

1. Fork 專案
2. 創建功能分支
3. 提交更改
4. 發起 Pull Request

## 📄 授權

本專案採用 MIT 授權條款。

## 🆘 支援

如有問題或建議，請提交 Issue 或聯繫開發團隊。

---

**Restarter** - 讓每個人都有重新開始的機會 🌟 # 觸發Vercel部署
# 確認職涯中心按鈕顯示
