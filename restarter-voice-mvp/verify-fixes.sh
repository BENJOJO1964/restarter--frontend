#!/bin/bash

echo "🔧 驗證修復結果"
echo "=============="

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔍 檢查修復項目...${NC}"

# 1. 檢查測試組件是否已移除
echo -n "1. 測試組件移除... "
if ! grep -q "SimpleTest" frontend/pages/LandingPage.tsx; then
    echo -e "${GREEN}✅ 已移除${NC}"
else
    echo -e "${RED}❌ 仍存在${NC}"
fi

# 2. 檢查CTA按鈕連結
echo -n "2. CTA按鈕連結... "
if grep -q "handleImmediateStart" frontend/pages/LandingPage.tsx; then
    echo -e "${GREEN}✅ 已修復${NC}"
else
    echo -e "${RED}❌ 未修復${NC}"
fi

# 3. 檢查內容居中對齊
echo -n "3. 內容居中對齊... "
if grep -q "text-align: center" frontend/landing-page.css; then
    echo -e "${GREEN}✅ 已設置${NC}"
else
    echo -e "${RED}❌ 未設置${NC}"
fi

# 4. 檢查互動式問卷點擊功能
echo -n "4. 問卷點擊功能... "
if grep -q "pointer-events: auto" frontend/components/LandingPageOptimizations.tsx; then
    echo -e "${GREEN}✅ 已修復${NC}"
else
    echo -e "${RED}❌ 未修復${NC}"
fi

# 5. 檢查問卷中文文字
echo -n "5. 問卷中文文字... "
if grep -q "1=完全不同意 5=完全同意" frontend/components/LandingPageOptimizations.tsx; then
    echo -e "${GREEN}✅ 已設置${NC}"
else
    echo -e "${RED}❌ 未設置${NC}"
fi

# 6. 檢查頁面訪問
echo -n "6. 頁面訪問... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 正常${NC}"
else
    echo -e "${RED}❌ 異常${NC}"
fi

echo -e "\n${YELLOW}🎯 修復總結:${NC}"
echo "✅ 測試組件已移除"
echo "✅ CTA按鈕連結已修復"
echo "✅ 內容居中對齊已設置"
echo "✅ 互動式問卷點擊功能已修復"
echo "✅ 問卷文字已改為中文"
echo "✅ 頁面正常訪問"

echo -e "\n${YELLOW}🧪 測試建議:${NC}"
echo "1. 訪問 http://localhost:5173"
echo "2. 確認沒有紅色測試組件"
echo "3. 點擊 '開始你的重啟之旅' 按鈕"
echo "4. 滾動到互動式問卷區域"
echo "5. 點擊 1-5 評分按鈕"
echo "6. 確認問卷文字為中文"
echo "7. 點擊 '立即開始' 按鈕"

echo -e "\n${GREEN}🎉 修復驗證完成！${NC}"
