#!/bin/bash

echo "🧪 Profile整合測試"
echo "=================="
echo "📱 本機IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""

# 測試頁面訪問
echo "🔍 測試頁面訪問..."

# 測試首頁
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ 首頁 - 可訪問"
else
    echo "❌ 首頁 - 無法訪問"
fi

# 測試Profile頁面
if curl -s http://localhost:5173/profile > /dev/null; then
    echo "✅ Profile頁面 - 可訪問"
else
    echo "❌ Profile頁面 - 無法訪問"
fi

# 測試新功能頁面
echo ""
echo "🔍 測試新功能頁面..."
if curl -s http://localhost:5173/resume-builder > /dev/null; then
    echo "✅ ResumeBuilder - 可訪問"
else
    echo "❌ ResumeBuilder - 無法訪問"
fi

if curl -s http://localhost:5173/job-finder > /dev/null; then
    echo "✅ JobFinder - 可訪問"
else
    echo "❌ JobFinder - 無法訪問"
fi

if curl -s http://localhost:5173/resources > /dev/null; then
    echo "✅ Resources - 可訪問"
else
    echo "❌ Resources - 無法訪問"
fi

if curl -s http://localhost:5173/success-stories > /dev/null; then
    echo "✅ SuccessStories - 可訪問"
else
    echo "❌ SuccessStories - 無法訪問"
fi

echo ""
echo "🎯 測試總結:"
echo "📱 手機版訪問地址:"
echo "   - 首頁: http://172.20.10.6:5173"
echo "   - Profile: http://172.20.10.6:5173/profile"
echo ""
echo "💻 電腦版訪問地址:"
echo "   - 首頁: http://localhost:5173"
echo "   - Profile: http://localhost:5173/profile"
echo ""
echo "✨ 功能測試步驟:"
echo ""
echo "1. 未登入狀態測試:"
echo "   - 訪問首頁，應該看到「🚀 體驗新功能」按鈕"
echo "   - 點擊按鈕進入Profile頁面"
echo "   - 在Profile頁面底部看到4個新功能按鈕"
echo ""
echo "2. 登入狀態測試:"
echo "   - 註冊/登入後，首頁右上角應該顯示："
echo "     * 用戶頭像和名稱"
echo "     * 「🚀 體驗新功能」按鈕"
echo "     * 「登出」按鈕"
echo "   - 點擊「🚀 體驗新功能」進入Profile頁面"
echo "   - Profile頁面應該顯示用戶的註冊資料"
echo ""
echo "3. Profile資料整合測試:"
echo "   - Profile頁面頭像應該與註冊時的照片一致"
echo "   - 用戶名稱應該與註冊時的姓名一致"
echo "   - 郵箱應該與註冊時的郵箱一致"
echo "   - 可以編輯和保存個人資料"
echo ""
echo "4. 新功能測試:"
echo "   - 點擊「📄 生成簡歷」測試AI簡歷生成器"
echo "   - 點擊「🔍 尋找工作」測試職位推薦系統"
echo "   - 點擊「📚 探索資源」測試本地資源整合"
echo "   - 點擊「✨ 成功故事」測試成功故事分享"
echo ""
echo "📱 手機版測試:"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://172.20.10.6:5173"
echo "3. 測試所有功能是否正常"
echo ""
echo "🎉 測試完成！"
