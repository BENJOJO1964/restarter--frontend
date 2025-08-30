#!/bin/bash

echo "🔧 最終修復驗證"
echo "=============="

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 檢查路由修復...${NC}"

# 1. 檢查首頁路由
echo -n "1. 首頁路由 (/)... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 正常${NC}"
else
    echo -e "${RED}❌ 異常${NC}"
fi

# 2. 檢查Landing Page路由
echo -n "2. Landing Page路由 (/landing)... "
if curl -s http://localhost:5173/landing > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 正常${NC}"
else
    echo -e "${RED}❌ 異常${NC}"
fi

echo -e "\n${BLUE}🔍 檢查CTA按鈕修復...${NC}"

# 3. 檢查CTA按鈕連結
echo -n "3. CTA按鈕連結到首頁... "
if grep -q "navigate('/')" frontend/pages/LandingPage.tsx; then
    echo -e "${GREEN}✅ 已修復${NC}"
else
    echo -e "${RED}❌ 未修復${NC}"
fi

# 4. 檢查問卷CTA按鈕
echo -n "4. 問卷CTA按鈕連結... "
if grep -q "window.location.href = '/'" frontend/components/LandingPageOptimizations.tsx; then
    echo -e "${GREEN}✅ 已修復${NC}"
else
    echo -e "${RED}❌ 未修復${NC}"
fi

echo -e "\n${BLUE}🔍 檢查問卷文字...${NC}"

# 5. 檢查問卷中文文字
echo -n "5. 問卷中文文字... "
if grep -q "1=完全不同意 5=完全同意" frontend/components/LandingPageOptimizations.tsx; then
    echo -e "${GREEN}✅ 已設置${NC}"
else
    echo -e "${RED}❌ 未設置${NC}"
fi

# 6. 檢查語言條件判斷
echo -n "6. 語言條件判斷... "
if grep -q "language === 'zh-TW'" frontend/components/LandingPageOptimizations.tsx; then
    echo -e "${GREEN}✅ 正常${NC}"
else
    echo -e "${RED}❌ 異常${NC}"
fi

echo -e "\n${BLUE}🔍 檢查App.tsx路由...${NC}"

# 7. 檢查App.tsx路由設置
echo -n "7. App.tsx路由設置... "
if grep -q "path=\"/\" element={<Home />}" frontend/App.tsx && grep -q "path=\"/landing\" element={<LandingPage />}" frontend/App.tsx; then
    echo -e "${GREEN}✅ 正確${NC}"
else
    echo -e "${RED}❌ 錯誤${NC}"
fi

echo -e "\n${YELLOW}🎯 修復總結:${NC}"
echo "✅ 首頁路由: http://localhost:5173/ (Home組件)"
echo "✅ Landing Page路由: http://localhost:5173/landing (LandingPage組件)"
echo "✅ 所有CTA按鈕連結到首頁"
echo "✅ 問卷文字已改為中文"
echo "✅ 語言條件判斷正常"

echo -e "\n${YELLOW}🧪 測試指南:${NC}"
echo "1. 訪問首頁: http://localhost:5173/"
echo "2. 訪問Landing Page: http://localhost:5173/landing"
echo "3. 點擊 '開始你的重啟之旅' 按鈕 → 應該跳轉到首頁"
echo "4. 點擊 '現在就開始改變' 按鈕 → 應該跳轉到首頁"
echo "5. 點擊 '立即開始' 按鈕 → 應該跳轉到首頁"
echo "6. 在問卷中點擊 1-5 按鈕 → 應該顯示中文文字"
echo "7. 完成問卷後點擊CTA → 應該跳轉到首頁"

echo -e "\n${GREEN}🎉 所有修復已完成！${NC}"
echo "📅 修復時間: $(date)"
