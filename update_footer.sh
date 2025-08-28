#!/bin/bash

# 更新所有頁面的footer為使用Footer組件
# 需要修改的頁面列表
PAGES=(
  "WhackAMole.tsx"
  "SkillBox.tsx"
  "MindGarden.tsx"
  "PairTalk.tsx"
  "Journal.tsx"
  "DataDeletion.tsx"
  "RestartMissions.tsx"
  "TermsPage.tsx"
  "ChatCompanion.tsx"
  "FriendMatch.tsx"
  "EmotionVisualLab.tsx"
  "PrivacyPolicy.tsx"
  "RestartFarm.tsx"
  "StoryWall.tsx"
  "HelpLab.tsx"
)

# 為每個頁面添加Footer import
for page in "${PAGES[@]}"; do
  if [ -f "pages/$page" ]; then
    echo "Processing $page..."
    
    # 添加Footer import
    sed -i '' '1s/^import React/import React/' "pages/$page"
    sed -i '' '/import React/a\
import Footer from '\''../components/Footer'\'';' "pages/$page"
    
    # 替換footer代碼為Footer組件
    # 這裡需要手動處理每個文件，因為footer代碼結構可能不同
    echo "Updated $page"
  fi
done

echo "Footer update script completed!" 