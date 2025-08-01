# 🚀 部署指南

## 環境配置策略

### 開發環境 (Development)
- **前端**: `localhost:5173` → 代理到 `localhost:3001`
- **後端**: `localhost:3001`
- **API URL**: `/api/*` (使用 Vite 代理)
- **WebSocket**: `ws://localhost:3001`

### 生產環境 (Production)
- **前端**: 部署到雲端 (Vercel/Netlify)
- **後端**: 部署到雲端 (Render/Railway)
- **API URL**: `https://restarter-backend-6e9s.onrender.com/api/*`
- **WebSocket**: `wss://restarter-backend-6e9s.onrender.com`

## 自動環境切換

系統會根據 `import.meta.env.DEV` 自動選擇正確的配置：

```typescript
// 開發環境
if (import.meta.env.DEV) {
  // 使用本地後端
  API_BASE_URL = '/api'
  WS_URL = 'ws://localhost:3001'
} else {
  // 使用雲端後端
  API_BASE_URL = 'https://restarter-backend-6e9s.onrender.com/api'
  WS_URL = 'wss://restarter-backend-6e9s.onrender.com'
}
```

## 部署步驟

### 1. 後端部署 (Render)
```bash
# 在 Render 上部署後端
# 環境變數設定:
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=rbben521@gmail.com
```

### 2. 前端部署 (Vercel/Netlify)
```bash
# 前端會自動使用生產環境配置
# 不需要額外設定，會自動連接到雲端後端
```

## 測試檢查清單

### 開發環境測試
- [ ] 前端: `npm run dev` (localhost:5173)
- [ ] 後端: `node server.js` (localhost:3001)
- [ ] 意見箱郵件發送 ✅
- [ ] 註冊驗證碼郵件發送 ✅

### 生產環境測試
- [ ] 前端部署到雲端
- [ ] 後端部署到雲端
- [ ] 意見箱郵件發送 ✅
- [ ] 註冊驗證碼郵件發送 ✅
- [ ] WebSocket 連接正常 ✅

## 注意事項

1. **環境變數**: 確保生產環境的 `.env` 文件包含所有必要的 API Keys
2. **CORS**: 後端需要設定正確的 CORS 配置允許前端域名
3. **域名**: 生產環境使用 HTTPS，WebSocket 使用 WSS
4. **監控**: 部署後監控郵件發送和 WebSocket 連接狀態

## 故障排除

### 郵件發送失敗
- 檢查 Resend API Key 是否正確設定
- 確認後端環境變數已載入
- 檢查 Resend 帳戶狀態和額度

### WebSocket 連接失敗
- 確認後端 WebSocket 服務正常運行
- 檢查防火牆和網路設定
- 驗證 SSL 證書是否有效

### API 請求失敗
- 確認前後端 URL 配置正確
- 檢查 CORS 設定
- 驗證 API 端點是否正確 