# Restarter 服務器設置指南

## 🚀 快速啟動

### 1. 啟動所有服務器
```bash
./start-servers.sh
```

### 2. 測試服務器狀態
```bash
./test-server-status.sh
```

### 3. 停止所有服務器
```bash
./stop-servers.sh
```

## 📋 訪問地址

### 💻 電腦版
- **前端**: http://localhost:5173
- **後端**: http://localhost:3001

### 📱 手機版
- **前端**: http://172.20.10.6:5173
- **後端**: http://172.20.10.6:3001

*注意：IP地址可能會變化，請運行 `./test-server-status.sh` 查看當前IP*

## 🔧 手動啟動

### 後端服務器
```bash
cd backend
npm install
PORT=3001 NODE_ENV=development TEST_MODE=true node server.js
```

### 前端服務器
```bash
cd frontend
npm install
npm run dev
```

## 📊 功能測試

### 1. 健康檢查
```bash
curl http://localhost:3001/health
```

### 2. 前端訪問
```bash
curl http://localhost:5173
```

### 3. 手機版測試
```bash
# 獲取本機IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "手機版訪問地址: http://$LOCAL_IP:5173"
```

## 🛠️ 故障排除

### 端口被佔用
```bash
# 檢查端口使用情況
lsof -i :3001
lsof -i :5173

# 停止佔用端口的進程
pkill -f "node server.js"
pkill -f "npm run dev"
```

### 依賴問題
```bash
# 重新安裝依賴
cd backend && npm install
cd ../frontend && npm install
```

### 環境變量
確保後端有正確的環境變量設置：
- `PORT=3001`
- `NODE_ENV=development`
- `TEST_MODE=true`

## 📱 手機版測試步驟

1. **確保手機和電腦在同一網絡**
2. **獲取電腦IP地址**：
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
3. **在手機瀏覽器中訪問**：
   ```
   http://[電腦IP]:5173
   ```
4. **測試功能**：
   - 登入/註冊
   - 聊天功能
   - 視訊通話
   - 語音功能

## 🔍 日誌查看

### 後端日誌
```bash
tail -f backend/logs/server.log
```

### 前端日誌
在瀏覽器開發者工具中查看 Console 標籤

## 📞 支持

如果遇到問題，請檢查：
1. 防火牆設置
2. 網絡連接
3. 端口是否被佔用
4. 依賴是否正確安裝

## 🎯 測試清單

- [ ] 後端服務器啟動
- [ ] 前端服務器啟動
- [ ] 電腦版訪問正常
- [ ] 手機版IP訪問正常
- [ ] API代理正常工作
- [ ] 聊天功能測試
- [ ] 視訊通話測試
- [ ] 語音功能測試 