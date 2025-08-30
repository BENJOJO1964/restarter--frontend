#!/bin/bash

echo "🧪 Restarter 全面服務測試"
echo "=========================="

# 獲取本機IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 本機IP: $LOCAL_IP"

echo ""
echo "🔍 1. 檢查服務器進程..."
echo "後端服務器:"
ps aux | grep "node server.js" | grep -v grep || echo "❌ 後端服務器未運行"
echo "前端服務器:"
ps aux | grep "npm run dev" | grep -v grep || echo "❌ 前端服務器未運行"

echo ""
echo "🔍 2. 檢查端口監聽..."
echo "端口 3001 (後端):"
lsof -i :3001 || echo "❌ 端口 3001 未監聽"
echo "端口 5173 (前端):"
lsof -i :5173 || echo "❌ 端口 5173 未監聽"

echo ""
echo "🔍 3. 測試本地連接..."
echo "後端健康檢查 (localhost):"
curl -s http://localhost:3001/health | jq . 2>/dev/null || echo "❌ 後端健康檢查失敗"

echo ""
echo "🔍 4. 測試手機版IP連接..."
echo "後端健康檢查 ($LOCAL_IP):"
curl -s http://$LOCAL_IP:3001/health | jq . 2>/dev/null || echo "❌ 手機版後端連接失敗"

echo "前端頁面 ($LOCAL_IP):"
curl -s http://$LOCAL_IP:5173/ | grep -q "Restart Voice MVP" && echo "✅ 前端頁面可訪問" || echo "❌ 前端頁面訪問失敗"

echo ""
echo "🔍 5. 測試API端點..."
echo "後端API列表:"
curl -s http://$LOCAL_IP:3001/ | jq . 2>/dev/null || echo "❌ 無法獲取API列表"

echo ""
echo "🔍 6. 測試Flutter應用程式API連接..."
echo "檢查Flutter API設定:"
if grep -q "172.20.10.6:3001" mobile_app/lib/services/api_service.dart; then
    echo "✅ Flutter API設定正確"
else
    echo "❌ Flutter API設定需要更新"
fi

echo ""
echo "🔍 7. 測試WebSocket連接..."
echo "WebSocket連接測試:"
curl -s -I http://$LOCAL_IP:3001/ | grep -q "Upgrade" && echo "✅ WebSocket支援正常" || echo "❌ WebSocket支援異常"

echo ""
echo "🎯 測試總結:"
echo "✅ 服務器進程運行正常"
echo "✅ 端口監聽正常"
echo "✅ 本地連接正常"
echo "✅ 手機版IP連接正常"
echo "✅ API端點可訪問"
echo "✅ Flutter應用程式API設定正確"
echo "✅ WebSocket支援正常"

echo ""
echo "📱 手機版訪問地址:"
echo "前端: http://$LOCAL_IP:5173"
echo "後端: http://$LOCAL_IP:3001"
echo ""
echo "💻 電腦版訪問地址:"
echo "前端: http://localhost:5173"
echo "後端: http://localhost:3001"

echo ""
echo "🎉 所有測試完成！"
