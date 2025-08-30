#!/bin/bash

echo "🚀 API KEY申請自動化腳本"
echo "================================"

# 創建申請文件夾
mkdir -p api_applications

echo "📝 正在生成申請文件..."

# 1. 勞動部勞動力發展署申請文件
cat > api_applications/wda_application.txt << 'EOF'
申請單位：Restarter職位平台
申請人：[請填入您的姓名]
申請日期：$(date +%Y-%m-%d)

申請項目：勞動部勞動力發展署職位資料API

申請用途：
我們是Restarter職位平台，專注於為求職者提供智能職位搜尋和匹配服務。
希望能申請貴單位的API服務，以便：
1. 獲取即時職位資料
2. 提供智能職位推薦
3. 改善求職者體驗
4. 促進就業市場資訊流通

技術規格：
- API格式：RESTful JSON
- 資料範圍：全台職位資料
- 更新頻率：即時或每日更新
- 調用限制：每日5000次
- 認證方式：API Key或OAuth
- 使用場景：職位搜尋、職位匹配、職位推薦

平台特色：
- 多語言支援（中文、英文、日文等）
- 智能職位匹配算法
- 個人化職位推薦
- 職位申請追蹤
- 職涯發展建議

聯絡方式：
Email：[請填入您的Email]
電話：[請填入您的電話]
網站：[請填入您的網站]

謝謝！
EOF

# 2. 台灣就業通申請文件
cat > api_applications/taiwan_jobs_application.txt << 'EOF'
主旨：申請台灣就業通API服務

內容：
您好，

我們是Restarter職位平台，專注於為求職者提供智能職位搜尋和匹配服務。

希望能申請貴單位的API服務，以便：
1. 獲取即時職位資料
2. 提供智能職位推薦
3. 改善求職者體驗
4. 促進就業市場資訊流通

技術需求：
- API端點：職位搜尋、職位詳情
- 資料格式：JSON
- 認證方式：API Key
- 調用頻率：每日1000-5000次
- 資料範圍：全台職位資料

平台特色：
- 多語言支援
- 智能職位匹配
- 個人化推薦
- 職涯發展建議

請提供申請流程和所需文件，謝謝！

聯絡方式：
Email：[請填入您的Email]
電話：[請填入您的電話]
網站：[請填入您的網站]
EOF

# 3. 104人力銀行申請文件
cat > api_applications/104_application.txt << 'EOF'
申請項目：104人力銀行API服務

申請單位：Restarter職位平台
申請人：[請填入您的姓名]

申請用途：
我們是Restarter職位平台，希望整合104人力銀行的職位資料，
為求職者提供更全面的職位搜尋和匹配服務。

技術需求：
- API端點：職位搜尋、職位詳情
- 資料格式：JSON
- 認證方式：API Key
- 調用限制：每日1000-5000次

平台特色：
- 多源職位資料整合
- 智能職位匹配
- 個人化推薦
- 職涯發展建議

請提供申請流程，謝謝！

聯絡方式：
Email：[請填入您的Email]
電話：[請填入您的電話]
網站：[請填入您的網站]
EOF

echo "✅ 申請文件已生成完成！"
echo ""
echo "📁 申請文件位置："
echo "  - 勞動部申請：api_applications/wda_application.txt"
echo "  - 台灣就業通申請：api_applications/taiwan_jobs_application.txt"
echo "  - 104人力銀行申請：api_applications/104_application.txt"
echo ""
echo "🔗 申請網址："
echo "  - 勞動部勞動力發展署：https://www.wda.gov.tw/"
echo "  - 台灣就業通：https://www.taiwanjobs.gov.tw/"
echo "  - 104人力銀行開發者平台：https://developer.104.com.tw/"
echo "  - 政府開放資料平台：https://data.gov.tw/"
echo ""
echo "📋 下一步行動："
echo "  1. 編輯申請文件，填入您的個人資訊"
echo "  2. 訪問各平台網站進行申請"
echo "  3. 等待審核結果"
echo "  4. 獲得API KEY後更新.env文件"
echo ""
echo "💡 提示："
echo "  - 申請時請說明平台的公益性質"
echo "  - 強調對求職者的幫助"
echo "  - 提供詳細的技術規格"
echo "  - 保持耐心等待審核結果"
