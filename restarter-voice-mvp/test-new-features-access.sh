#!/bin/bash

echo "🧪 新功能訪問測試"
echo "=================="
echo "📱 本機IP: $(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)"
echo ""

# 測試新功能頁面
echo "🔍 測試新功能頁面訪問..."

# 測試Profile頁面
if curl -s http://localhost:5173/profile > /dev/null; then
    echo "✅ Profile頁面 - 可訪問"
else
    echo "❌ Profile頁面 - 無法訪問"
fi

# 測試ResumeBuilder頁面
if curl -s http://localhost:5173/resume-builder > /dev/null; then
    echo "✅ ResumeBuilder頁面 - 可訪問"
else
    echo "❌ ResumeBuilder頁面 - 無法訪問"
fi

# 測試JobFinder頁面
if curl -s http://localhost:5173/job-finder > /dev/null; then
    echo "✅ JobFinder頁面 - 可訪問"
else
    echo "❌ JobFinder頁面 - 無法訪問"
fi

# 測試Resources頁面
if curl -s http://localhost:5173/resources > /dev/null; then
    echo "✅ Resources頁面 - 可訪問"
else
    echo "❌ Resources頁面 - 無法訪問"
fi

# 測試SuccessStories頁面
if curl -s http://localhost:5173/success-stories > /dev/null; then
    echo "✅ SuccessStories頁面 - 可訪問"
else
    echo "❌ SuccessStories頁面 - 無法訪問"
fi

echo ""
echo "🎯 測試總結:"
echo "📱 手機版訪問地址:"
echo "   - 首頁: http://172.20.10.6:5173"
echo "   - Profile: http://172.20.10.6:5173/profile"
echo "   - ResumeBuilder: http://172.20.10.6:5173/resume-builder"
echo "   - JobFinder: http://172.20.10.6:5173/job-finder"
echo "   - Resources: http://172.20.10.6:5173/resources"
echo "   - SuccessStories: http://172.20.10.6:5173/success-stories"
echo ""
echo "💻 電腦版訪問地址:"
echo "   - 首頁: http://localhost:5173"
echo "   - Profile: http://localhost:5173/profile"
echo "   - ResumeBuilder: http://localhost:5173/resume-builder"
echo "   - JobFinder: http://localhost:5173/job-finder"
echo "   - Resources: http://localhost:5173/resources"
echo "   - SuccessStories: http://localhost:5173/success-stories"
echo ""
echo "✨ 測試步驟:"
echo "1. 訪問首頁 http://localhost:5173"
echo "2. 點擊右上角的「🚀 體驗新功能」按鈕"
echo "3. 在Profile頁面底部可以看到4個新功能按鈕"
echo "4. 點擊各個按鈕測試功能"
echo ""
echo "📱 手機版測試:"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://172.20.10.6:5173"
echo "3. 點擊「🚀 體驗新功能」按鈕"
echo "4. 測試所有新功能是否正常"
echo ""
echo "🎉 測試完成！"
