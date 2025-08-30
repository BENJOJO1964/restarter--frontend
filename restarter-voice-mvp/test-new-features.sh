#!/bin/bash

echo "🧪 新功能測試腳本"
echo "=================="
echo "📱 本機IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""

# 測試前端頁面
echo "🔍 測試前端頁面..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 前端頁面 (localhost) - 正常"
else
    echo "❌ 前端頁面 (localhost) - 異常"
fi

if curl -s http://172.20.10.6:5173 > /dev/null; then
    echo "✅ 前端頁面 (手機版IP) - 正常"
else
    echo "❌ 前端頁面 (手機版IP) - 異常"
fi

# 測試後端API
echo ""
echo "🔍 測試後端API..."
if curl -s http://localhost:3001/ > /dev/null; then
    echo "✅ 後端API (localhost) - 正常"
else
    echo "❌ 後端API (localhost) - 異常"
fi

if curl -s http://172.20.10.6:3001/ > /dev/null; then
    echo "✅ 後端API (手機版IP) - 正常"
else
    echo "❌ 後端API (手機版IP) - 異常"
fi

# 測試新功能相關的API端點
echo ""
echo "🔍 測試新功能API端點..."

# 測試情境API
if curl -s http://localhost:3001/api/scenarios > /dev/null; then
    echo "✅ 情境API - 正常"
else
    echo "❌ 情境API - 異常"
fi

# 測試GPT API
if curl -s -X POST http://localhost:3001/api/gpt -H "Content-Type: application/json" -d '{"message":"test"}' > /dev/null 2>&1; then
    echo "✅ GPT API - 正常"
else
    echo "❌ GPT API - 異常"
fi

# 測試郵件驗證API
if curl -s http://localhost:3001/api/email-verification > /dev/null 2>&1; then
    echo "✅ 郵件驗證API - 正常"
else
    echo "❌ 郵件驗證API - 異常"
fi

echo ""
echo "🎯 測試總結:"
echo "📱 手機版訪問地址:"
echo "   - 前端: http://172.20.10.6:5173"
echo "   - 後端: http://172.20.10.6:3001"
echo ""
echo "💻 電腦版訪問地址:"
echo "   - 前端: http://localhost:5173"
echo "   - 後端: http://localhost:3001"
echo ""
echo "✨ 新功能測試建議:"
echo "1. 訪問 http://localhost:5173/profile 測試擴展的Profile系統"
echo "2. 訪問 http://localhost:5173/resume-builder 測試AI簡歷生成器"
echo "3. 訪問 http://localhost:5173/job-finder 測試職位推薦系統"
echo "4. 訪問 http://localhost:5173/resources 測試本地資源整合"
echo "5. 訪問 http://localhost:5173/success-stories 測試成功故事分享"
echo "6. 訪問 http://localhost:5173/chat 測試職業諮詢模式"
echo ""
echo "📱 手機版測試:"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://172.20.10.6:5173"
echo "3. 測試所有新功能是否正常"
echo ""
echo "🎉 測試完成！"
