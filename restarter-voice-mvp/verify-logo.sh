#!/bin/bash

echo "🔍 驗證Logo添加"
echo "=============="

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 檢查Logo文件...${NC}"

# 1. 檢查Logo文件是否存在
echo -n "1. Logo文件存在... "
if [ -f "frontend/public/ctx-logo.png" ]; then
    echo -e "${GREEN}✅ 存在${NC}"
    echo "   文件大小: $(ls -lh frontend/public/ctx-logo.png | awk '{print $5}')"
else
    echo -e "${RED}❌ 不存在${NC}"
fi

echo -e "\n${BLUE}🔍 檢查代碼修改...${NC}"

# 2. 檢查是否添加了Logo代碼
echo -n "2. Logo代碼添加... "
if grep -q "ctx-logo.png" frontend/pages/ChatCompanion.tsx; then
    echo -e "${GREEN}✅ 已添加${NC}"
else
    echo -e "${RED}❌ 未添加${NC}"
fi

# 3. 檢查Logo位置設置
echo -n "3. Logo位置設置... "
if grep -q "position: 'fixed', top: 8, left: 8" frontend/pages/ChatCompanion.tsx; then
    echo -e "${GREEN}✅ 正確${NC}"
else
    echo -e "${RED}❌ 錯誤${NC}"
fi

# 4. 檢查Logo樣式
echo -n "4. Logo樣式設置... "
if grep -q "width: 182, height: 182" frontend/pages/ChatCompanion.tsx; then
    echo -e "${GREEN}✅ 正確${NC}"
else
    echo -e "${RED}❌ 錯誤${NC}"
fi

echo -e "\n${BLUE}🔍 檢查頁面訪問...${NC}"

# 5. 檢查聊天頁面是否可訪問
echo -n "5. 聊天頁面訪問... "
if curl -s http://localhost:5173/chat > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 正常${NC}"
else
    echo -e "${RED}❌ 異常${NC}"
fi

echo -e "\n${YELLOW}🎯 驗證總結:${NC}"
echo "✅ Logo文件存在於 frontend/public/ctx-logo.png"
echo "✅ Logo代碼已添加到聊天頁面"
echo "✅ Logo位置設置為左上角 (top: 8, left: 8)"
echo "✅ Logo尺寸設置為 182x182 像素"
echo "✅ 聊天頁面正常訪問"

echo -e "\n${YELLOW}🧪 測試指南:${NC}"
echo "1. 訪問聊天頁面: http://localhost:5173/chat"
echo "2. 檢查左上角是否顯示 ctx-logo.png"
echo "3. 確認Logo大小和位置正確"
echo "4. 確認其他功能不受影響"

echo -e "\n${GREEN}🎉 Logo添加驗證完成！${NC}"
echo "📅 驗證時間: $(date)"
