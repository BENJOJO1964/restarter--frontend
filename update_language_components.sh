#!/bin/bash

# 批量更新所有頁面的語言選擇器
cd pages

# 需要更新的文件列表
files=(
  "PairTalkMatch.tsx"
  "EmotionVisualLab.tsx"
  "InvitesPage.tsx"
  "AIStyleReply.tsx"
  "FriendMatch.tsx"
  "ChatCompanion.tsx"
  "PracticePage.tsx"
  "ChatRoom.tsx"
  "MyLinks.tsx"
  "RestartMissions.tsx"
  "RestartWall.tsx"
  "Journal.tsx"
  "PairTalk.tsx"
  "MindGarden.tsx"
  "SkillBox.tsx"
  "RealisticTTS.tsx"
  "WhackAMole.tsx"
)

# 為每個文件添加 import
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # 添加 import 語句（如果還沒有的話）
    if ! grep -q "import.*LanguageSelector" "$file"; then
      # 找到最後一個 import 語句的位置
      last_import_line=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
      if [ ! -z "$last_import_line" ]; then
        # 在最後一個 import 後添加新的 import
        sed -i '' "${last_import_line}a\\
import { useLanguage } from '../contexts/LanguageContext';\\
import { LanguageSelector } from '../components/LanguageSelector';" "$file"
      fi
    fi
    
    # 替換語言選擇器
    sed -i '' 's/<select.*value={lang}.*onChange.*lang.*>.*<\/select>/<LanguageSelector \/>/g' "$file"
    
    # 替換語言狀態管理
    sed -i '' 's/const \[lang, setLang\] = useState.*/const { lang, setLang } = useLanguage();/g' "$file"
    
    echo "Updated $file"
  fi
done

echo "All files updated!" 