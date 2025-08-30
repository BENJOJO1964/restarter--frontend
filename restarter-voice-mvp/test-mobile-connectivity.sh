#!/bin/bash

echo "📱 Restarter 手機版連接測試"
echo "============================"

# 獲取本機IP
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
echo "📱 本機IP: $LOCAL_IP"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🔍 測試手機版連接性...${NC}"

# 測試後端API
echo -e "\n${YELLOW}1. 測試後端API連接...${NC}"
if curl -s -m 5 http://$LOCAL_IP:3001/health > /dev/null; then
    echo -e "${GREEN}✅ 後端API可訪問: http://$LOCAL_IP:3001${NC}"
    # 獲取健康檢查響應
    HEALTH_RESPONSE=$(curl -s http://$LOCAL_IP:3001/health)
    echo "   響應: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ 後端API無法訪問: http://$LOCAL_IP:3001${NC}"
fi

# 測試前端頁面
echo -e "\n${YELLOW}2. 測試前端頁面連接...${NC}"
if curl -s -m 5 http://$LOCAL_IP:5173 > /dev/null; then
    echo -e "${GREEN}✅ 前端頁面可訪問: http://$LOCAL_IP:5173${NC}"
    # 檢查頁面標題
    PAGE_TITLE=$(curl -s http://$LOCAL_IP:5173 | grep -o '<title>[^<]*</title>' | sed 's/<title>\(.*\)<\/title>/\1/')
    echo "   頁面標題: $PAGE_TITLE"
else
    echo -e "${RED}❌ 前端頁面無法訪問: http://$LOCAL_IP:5173${NC}"
fi

# 測試API端點
echo -e "\n${YELLOW}3. 測試API端點...${NC}"
if curl -s -m 5 http://$LOCAL_IP:3001/ > /dev/null; then
    echo -e "${GREEN}✅ API根端點可訪問${NC}"
    # 獲取API列表
    API_RESPONSE=$(curl -s http://$LOCAL_IP:3001/ | jq -r '.endpoints[]' 2>/dev/null | head -5)
    echo "   可用端點:"
    echo "$API_RESPONSE" | while read endpoint; do
        echo "   - $endpoint"
    done
else
    echo -e "${RED}❌ API根端點無法訪問${NC}"
fi

# 測試Flutter應用配置
echo -e "\n${YELLOW}4. 檢查Flutter應用配置...${NC}"
if [ -f "mobile_app/lib/services/api_service.dart" ]; then
    if grep -q "$LOCAL_IP:3001" mobile_app/lib/services/api_service.dart; then
        echo -e "${GREEN}✅ Flutter API配置正確${NC}"
        echo "   配置的API地址: $LOCAL_IP:3001"
    else
        echo -e "${YELLOW}⚠️  Flutter API配置需要更新${NC}"
        echo "   建議更新為: $LOCAL_IP:3001"
    fi
else
    echo -e "${YELLOW}⚠️  Flutter配置文件不存在${NC}"
fi

# 網絡連接測試
echo -e "\n${YELLOW}5. 網絡連接測試...${NC}"
if ping -c 1 $LOCAL_IP > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 網絡連接正常${NC}"
else
    echo -e "${RED}❌ 網絡連接異常${NC}"
fi

echo ""
echo -e "${GREEN}🎉 手機版連接測試完成！${NC}"
echo ""
echo -e "${YELLOW}📱 手機版訪問地址：${NC}"
echo -e "${BLUE}前端:${NC} http://$LOCAL_IP:5173"
echo -e "${BLUE}後端:${NC} http://$LOCAL_IP:3001"
echo ""
echo -e "${YELLOW}📋 手機版測試步驟：${NC}"
echo "1. 確保手機和電腦在同一WiFi網絡"
echo "2. 在手機瀏覽器中訪問: http://$LOCAL_IP:5173"
echo "3. 測試以下功能："
echo "   - 頁面加載"
echo "   - 語音錄製"
echo "   - AI對話"
echo "   - 所有主要功能"
echo ""
echo -e "${YELLOW}💡 如果無法訪問，請檢查：${NC}"
echo "- 防火牆設置"
echo "- 網絡連接"
echo "- 服務器是否正常運行"
