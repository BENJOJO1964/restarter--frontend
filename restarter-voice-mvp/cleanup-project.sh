#!/bin/bash

echo "🧹 Restarter™ 專案清理腳本"
echo "=========================="
echo "📅 開始時間: $(date)"
echo ""

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 記錄清理結果
CLEANUP_LOG="cleanup-report-$(date +%Y%m%d-%H%M%S).txt"
DELETED_FILES="deleted-files.txt"
COMPRESSED_FILES="compressed-files.txt"
MOVED_FILES="moved-files.txt"

echo "📊 清理報告" > $CLEANUP_LOG
echo "==========" >> $CLEANUP_LOG
echo "開始時間: $(date)" >> $CLEANUP_LOG
echo "" >> $CLEANUP_LOG

# 記錄函數
log_action() {
    echo "$1" >> $CLEANUP_LOG
    echo -e "${BLUE}$1${NC}"
}

log_deleted() {
    echo "🗑️  $1" >> $DELETED_FILES
    echo -e "${RED}🗑️  $1${NC}"
}

log_compressed() {
    echo "📦 $1" >> $COMPRESSED_FILES
    echo -e "${YELLOW}📦 $1${NC}"
}

log_moved() {
    echo "☁️  $1" >> $MOVED_FILES
    echo -e "${GREEN}☁️  $1${NC}"
}

# 1. 刪除 node_modules
echo -e "${BLUE}🔧 1. 刪除 node_modules...${NC}"
if [ -d "frontend/node_modules" ]; then
    log_action "刪除 frontend/node_modules"
    rm -rf frontend/node_modules
    log_deleted "frontend/node_modules"
fi

if [ -d "backend/node_modules" ]; then
    log_action "刪除 backend/node_modules"
    rm -rf backend/node_modules
    log_deleted "backend/node_modules"
fi

if [ -d "mobile_app/.dart_tool" ]; then
    log_action "刪除 mobile_app/.dart_tool"
    rm -rf mobile_app/.dart_tool
    log_deleted "mobile_app/.dart_tool"
fi

# 2. 刪除構建和快取檔案
echo -e "${BLUE}🔧 2. 刪除構建和快取檔案...${NC}"

# 刪除 dist, build, .cache 等目錄
find . -type d \( -name "dist" -o -name "build" -o -name ".cache" -o -name ".next" -o -name "out" \) 2>/dev/null | while read dir; do
    log_action "刪除目錄: $dir"
    rm -rf "$dir"
    log_deleted "$dir"
done

# 刪除系統檔案
find . -type f \( -name ".DS_Store" -o -name "Thumbs.db" -o -name "*.log" -o -name "*.tmp" \) 2>/dev/null | while read file; do
    log_action "刪除系統檔案: $file"
    rm -f "$file"
    log_deleted "$file"
done

# 3. 刪除大圖片檔案
echo -e "${BLUE}🔧 3. 處理大圖片檔案...${NC}"

# 檢查並刪除大於 500KB 的圖片
find . -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" \) -size +500k 2>/dev/null | while read file; do
    size=$(du -h "$file" | cut -f1)
    log_action "發現大圖片: $file ($size)"
    
    # 檢查是否被程式碼引用
    filename=$(basename "$file")
    if ! grep -r "$filename" frontend/src backend/src 2>/dev/null | grep -v node_modules > /dev/null; then
        log_action "刪除未引用的圖片: $file"
        rm -f "$file"
        log_deleted "$file"
    else
        log_action "保留被引用的圖片: $file"
    fi
done

# 4. 處理影片檔案
echo -e "${BLUE}🔧 4. 處理影片檔案...${NC}"

# 檢查影片檔案
find . -type f \( -name "*.mp4" -o -name "*.avi" -o -name "*.mov" \) 2>/dev/null | while read file; do
    size=$(du -h "$file" | cut -f1)
    log_action "發現影片: $file ($size)"
    
    # 檢查是否被程式碼引用
    filename=$(basename "$file")
    if ! grep -r "$filename" frontend/src backend/src 2>/dev/null | grep -v node_modules > /dev/null; then
        log_action "刪除未引用的影片: $file"
        rm -f "$file"
        log_deleted "$file"
    else
        log_action "保留被引用的影片: $file"
    fi
done

# 5. 刪除測試和範例檔案
echo -e "${BLUE}🔧 5. 刪除測試和範例檔案...${NC}"

# 刪除測試檔案
find . -type f \( -name "*test*" -o -name "*demo*" -o -name "*example*" -o -name "*sample*" \) 2>/dev/null | grep -v node_modules | while read file; do
    log_action "刪除測試檔案: $file"
    rm -f "$file"
    log_deleted "$file"
done

# 6. 刪除 AI 模型檔案（如果太大）
echo -e "${BLUE}🔧 6. 檢查 AI 模型檔案...${NC}"

if [ -d "backend/gfpgan/weights" ]; then
    total_size=$(du -sh backend/gfpgan/weights | cut -f1)
    log_action "AI 模型目錄大小: $total_size"
    
    # 檢查是否有大於 100MB 的模型檔案
    find backend/gfpgan/weights -type f -size +100M 2>/dev/null | while read file; do
        size=$(du -h "$file" | cut -f1)
        log_action "發現大模型檔案: $file ($size)"
        log_moved "建議將 $file 移到雲端 CDN"
    done
fi

# 7. 清理完成後檢查大小
echo -e "${BLUE}🔧 7. 檢查清理結果...${NC}"

echo "" >> $CLEANUP_LOG
echo "📊 清理後專案大小:" >> $CLEANUP_LOG
du -sh . >> $CLEANUP_LOG

echo "" >> $CLEANUP_LOG
echo "🗑️ 已刪除的檔案:" >> $CLEANUP_LOG
if [ -f "$DELETED_FILES" ]; then
    cat "$DELETED_FILES" >> $CLEANUP_LOG
fi

echo "" >> $CLEANUP_LOG
echo "📦 建議壓縮的檔案:" >> $CLEANUP_LOG
if [ -f "$COMPRESSED_FILES" ]; then
    cat "$COMPRESSED_FILES" >> $CLEANUP_LOG
fi

echo "" >> $CLEANUP_LOG
echo "☁️ 建議移到雲端的檔案:" >> $CLEANUP_LOG
if [ -f "$MOVED_FILES" ]; then
    cat "$MOVED_FILES" >> $CLEANUP_LOG
fi

echo -e "${GREEN}🎉 清理完成！${NC}"
echo "📄 詳細報告: $CLEANUP_LOG"
echo "📅 結束時間: $(date)"
