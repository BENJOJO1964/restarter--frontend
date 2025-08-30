#!/bin/bash

echo "🧪 真實職位API整合測試"
echo "======================"
echo "📱 本機IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""

# 測試後端API
echo "🔍 測試後端職位API..."

# 測試職位搜尋API
echo "📋 測試職位搜尋API..."
SEARCH_RESPONSE=$(curl -s "http://localhost:3001/api/jobs/search?keyword=前端&location=台北市&page=1&limit=5")

if echo "$SEARCH_RESPONSE" | grep -q "success.*true"; then
    echo "✅ 職位搜尋API - 正常工作"
    JOB_COUNT=$(echo "$SEARCH_RESPONSE" | grep -o '"jobs":\[[^]]*\]' | grep -o '\[.*\]' | jq 'length' 2>/dev/null || echo "未知")
    echo "   職位數量: $JOB_COUNT"
    
    # 檢查數據來源
    if echo "$SEARCH_RESPONSE" | grep -q "104人力銀行"; then
        echo "   📊 數據來源: 104人力銀行"
    elif echo "$SEARCH_RESPONSE" | grep -q "模擬數據"; then
        echo "   📊 數據來源: 模擬數據（API調用失敗）"
    else
        echo "   📊 數據來源: 未知"
    fi
else
    echo "❌ 職位搜尋API - 無法正常工作"
fi

echo ""

# 測試職位詳情API
echo "📋 測試職位詳情API..."
DETAIL_RESPONSE=$(curl -s "http://localhost:3001/api/jobs/1")

if echo "$DETAIL_RESPONSE" | grep -q "success.*true"; then
    echo "✅ 職位詳情API - 正常工作"
else
    echo "❌ 職位詳情API - 無法正常工作"
fi

echo ""

# 測試前端頁面
echo "🔍 測試前端頁面..."

# 測試JobFinder頁面
if curl -s http://localhost:5173/job-finder > /dev/null; then
    echo "✅ JobFinder頁面 - 可訪問"
else
    echo "❌ JobFinder頁面 - 無法訪問"
fi

echo ""
echo "🎯 測試總結:"
echo "📱 手機版訪問地址:"
echo "   - JobFinder: http://172.20.10.6:5173/job-finder"
echo ""
echo "💻 電腦版訪問地址:"
echo "   - JobFinder: http://localhost:5173/job-finder"
echo ""
echo "🔗 API端點:"
echo "   - 職位搜尋: http://localhost:3001/api/jobs/search"
echo "   - 職位詳情: http://localhost:3001/api/jobs/{jobId}"
echo ""
echo "✨ 真實職位API功能測試步驟:"
echo ""
echo "1. 職位數據來源測試:"
echo "   📊 優先順序："
echo "   1. 104人力銀行API（真實數據）"
echo "   2. 模擬數據（API失敗時的備用）"
echo ""
echo "2. 職位搜尋功能測試:"
echo "   🔍 搜尋條件："
echo "   - 關鍵字搜尋：輸入「前端」、「Python」等"
echo "   - 地點篩選：選擇「台北市」、「新北市」等"
echo "   - 工作類型：選擇「全職」、「兼職」、「實習」"
echo "   - 技能篩選：選擇「React」、「會計」等技能"
echo ""
echo "3. 職位來源顯示測試:"
echo "   📋 職位卡片顯示："
echo "   - 發布日期"
echo "   - 數據來源（104人力銀行 或 模擬數據）"
echo "   - 職位詳情和技能標籤"
echo ""
echo "4. 申請功能測試:"
echo "   📝 申請流程："
echo "   - 點擊【立即申請】按鈕"
echo "   - 登入狀態檢查"
echo "   - 申請確認對話框"
echo "   - 申請成功提示"
echo ""
echo "5. 錯誤處理測試:"
echo "   🛡️ 容錯機制："
echo "   - API調用失敗時自動使用模擬數據"
echo "   - 網路錯誤時的優雅降級"
echo "   - 用戶友好的錯誤提示"
echo ""
echo "6. 性能優化測試:"
echo "   ⚡ 效能表現："
echo "   - API響應時間（應在3秒內）"
echo "   - 前端載入速度"
echo "   - 篩選條件變更時的即時更新"
echo ""
echo "📱 手機版測試:"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://172.20.10.6:5173/job-finder"
echo "3. 測試職位搜尋和篩選功能"
echo "4. 測試申請流程"
echo "5. 測試響應式設計"
echo ""
echo "🎉 整合功能："
echo "✅ 104人力銀行API整合"
echo "✅ 職位搜尋和篩選"
echo "✅ 職位詳情獲取"
echo "✅ 數據來源顯示"
echo "✅ 錯誤處理和容錯"
echo "✅ 模擬數據備用"
echo "✅ 前端即時更新"
echo ""
echo "🚀 未來擴展："
echo "📋 LinkedIn API整合"
echo "📋 其他職位平台API"
echo "📋 職位爬蟲功能"
echo "📋 企業後台系統"
echo "📋 申請追蹤系統"
echo ""
echo "🎉 測試完成！"
