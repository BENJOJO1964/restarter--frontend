#!/bin/bash

echo "🔄 開始更新所有語言的scenarios.json文件..."

# 複製中文版本到所有語言目錄
for lang in en ja ko th vi ms la zh-CN; do
    echo "📝 更新 $lang 語言..."
    cp locales/zh-TW/scenarios.json locales/$lang/scenarios.json
done

echo "✅ 所有語言更新完成！"

# 驗證結果
echo "🔍 驗證更新結果："
for lang in zh-TW en ja ko th vi ms la zh-CN; do
    count=$(grep -c '"id":' locales/$lang/scenarios.json)
    echo "  $lang: $count 個情境"
done
