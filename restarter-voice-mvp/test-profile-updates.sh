#!/bin/bash

echo "🧪 Profile頁面最新更新測試"
echo "=========================="
echo "📱 本機IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""

# 測試頁面訪問
echo "🔍 測試頁面訪問..."

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
echo "   - Profile: http://172.20.10.6:5173/profile"
echo ""
echo "💻 電腦版訪問地址:"
echo "   - Profile: http://localhost:5173/profile"
echo ""
echo "✨ 最新更新測試步驟:"
echo ""
echo "1. 頁面佈局檢查:"
echo "   - 左上角有「← 返回首頁」按鈕"
echo "   - 4個功能按鈕位於白色卡片區外上方："
echo "     * 📄 生成簡歷 (藍色)"
echo "     * 🔍 尋找工作 (紫色)"
echo "     * 📚 探索資源 (粉色)"
echo "     * ✨ 成功故事 (綠色)"
echo "   - 個人資料卡片顯示用戶頭像、名稱、郵箱"
echo ""
echo "2. 語言選項功能測試:"
echo "   - 點擊「編輯資料」按鈕"
echo "   - 在語言能力區域點擊「其他」按鈕"
echo "   - 應該出現下橫線的填寫區"
echo "   - 可以輸入多種語言，用逗號分隔"
echo "   - 例如：法語,德語,西班牙語"
echo ""
echo "3. 功能按鈕測試:"
echo "   - 點擊「📄 生成簡歷」→ 進入AI簡歷生成器"
echo "   - 點擊「🔍 尋找工作」→ 進入職位推薦系統"
echo "   - 點擊「📚 探索資源」→ 進入本地資源整合"
echo "   - 點擊「✨ 成功故事」→ 進入成功故事分享"
echo ""
echo "4. 編輯功能測試:"
echo "   - 點擊「編輯資料」按鈕"
echo "   - 可以編輯個人資訊、技能、興趣、語言等"
echo "   - 測試「其他」語言輸入功能"
echo "   - 點擊「儲存」保存更改"
echo ""
echo "📱 手機版測試:"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://172.20.10.6:5173/profile"
echo "3. 測試新佈局是否正常顯示"
echo "4. 測試4個功能按鈕是否正常工作"
echo "5. 測試「其他」語言輸入功能"
echo ""
echo "🎉 測試完成！"
