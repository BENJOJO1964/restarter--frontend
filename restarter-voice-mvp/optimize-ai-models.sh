#!/bin/bash

echo "🤖 AI 模型優化腳本"
echo "=================="
echo "📅 開始時間: $(date)"
echo ""

# 顏色定義
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 檢查AI模型檔案
echo -e "${BLUE}🔍 檢查 AI 模型檔案...${NC}"

if [ -d "backend/gfpgan/weights" ]; then
    echo "發現 AI 模型目錄: backend/gfpgan/weights"
    
    # 列出所有模型檔案
    echo -e "${YELLOW}📋 模型檔案清單:${NC}"
    find backend/gfpgan/weights -type f -name "*.pth" | while read file; do
        size=$(du -h "$file" | cut -f1)
        echo "  - $file ($size)"
    done
    
    echo ""
    echo -e "${YELLOW}💡 建議處理方案:${NC}"
    echo "1. 將大型模型檔案移到雲端 CDN (如 Cloudinary)"
    echo "2. 更新程式碼以從雲端載入模型"
    echo "3. 保留本地模型載入邏輯作為備用"
    
    echo ""
    echo -e "${BLUE}🔧 創建模型載入配置...${NC}"
    
    # 創建模型配置檔案
    cat > backend/config/ai-models.js << 'EOF'
// AI 模型配置
const AI_MODELS_CONFIG = {
  // 本地模型路徑 (備用)
  local: {
    alignment: './gfpgan/weights/alignment_WFLW_4HG.pth',
    detection: './gfpgan/weights/detection_Resnet50_Final.pth'
  },
  
  // 雲端模型 URL (主要)
  cloud: {
    alignment: 'https://res.cloudinary.com/your-cloud-name/raw/upload/v1/ai-models/alignment_WFLW_4HG.pth',
    detection: 'https://res.cloudinary.com/your-cloud-name/raw/upload/v1/ai-models/detection_Resnet50_Final.pth'
  },
  
  // 載入策略
  strategy: 'cloud-first', // 'cloud-first' | 'local-only' | 'hybrid'
  
  // 快取設定
  cache: {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000, // 24小時
    maxSize: 500 * 1024 * 1024   // 500MB
  }
};

module.exports = AI_MODELS_CONFIG;
EOF

    echo "✅ 已創建 AI 模型配置檔案: backend/config/ai-models.js"
    
    # 創建模型載入器
    cat > backend/utils/modelLoader.js << 'EOF'
const fs = require('fs');
const path = require('path');
const https = require('https');
const AI_MODELS_CONFIG = require('../config/ai-models');

class ModelLoader {
  constructor() {
    this.cache = new Map();
    this.modelCache = new Map();
  }

  // 檢查本地模型是否存在
  async checkLocalModel(modelName) {
    const localPath = AI_MODELS_CONFIG.local[modelName];
    if (!localPath) return false;
    
    try {
      await fs.promises.access(path.resolve(__dirname, '..', localPath));
      return true;
    } catch (error) {
      return false;
    }
  }

  // 從雲端下載模型
  async downloadFromCloud(modelName) {
    const cloudUrl = AI_MODELS_CONFIG.cloud[modelName];
    if (!cloudUrl) throw new Error(`No cloud URL for model: ${modelName}`);
    
    return new Promise((resolve, reject) => {
      https.get(cloudUrl, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download model: ${response.statusCode}`));
          return;
        }
        
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          this.cache.set(modelName, buffer);
          resolve(buffer);
        });
      }).on('error', reject);
    });
  }

  // 載入模型
  async loadModel(modelName) {
    // 檢查快取
    if (this.cache.has(modelName)) {
      return this.cache.get(modelName);
    }

    // 根據策略載入模型
    switch (AI_MODELS_CONFIG.strategy) {
      case 'cloud-first':
        try {
          console.log(`🌐 從雲端載入模型: ${modelName}`);
          return await this.downloadFromCloud(modelName);
        } catch (error) {
          console.log(`⚠️  雲端載入失敗，嘗試本地載入: ${modelName}`);
          return await this.loadLocalModel(modelName);
        }
        
      case 'local-only':
        return await this.loadLocalModel(modelName);
        
      case 'hybrid':
        const hasLocal = await this.checkLocalModel(modelName);
        if (hasLocal) {
          return await this.loadLocalModel(modelName);
        } else {
          return await this.downloadFromCloud(modelName);
        }
        
      default:
        throw new Error(`Unknown strategy: ${AI_MODELS_CONFIG.strategy}`);
    }
  }

  // 載入本地模型
  async loadLocalModel(modelName) {
    const localPath = AI_MODELS_CONFIG.local[modelName];
    if (!localPath) throw new Error(`No local path for model: ${modelName}`);
    
    const fullPath = path.resolve(__dirname, '..', localPath);
    const buffer = await fs.promises.readFile(fullPath);
    this.cache.set(modelName, buffer);
    return buffer;
  }

  // 清理快取
  clearCache() {
    this.cache.clear();
  }
}

module.exports = new ModelLoader();
EOF

    echo "✅ 已創建模型載入器: backend/utils/modelLoader.js"
    
    # 創建部署指南
    cat > AI_MODELS_DEPLOYMENT_GUIDE.md << 'EOF'
# AI 模型部署指南

## 概述
為了減少專案大小，建議將大型 AI 模型檔案移到雲端 CDN。

## 模型檔案
- `alignment_WFLW_4HG.pth` (185MB) - 臉部對齊模型
- `detection_Resnet50_Final.pth` (104MB) - 臉部檢測模型

## 部署步驟

### 1. 上傳到 Cloudinary
```bash
# 安裝 Cloudinary CLI
npm install -g cloudinary-cli

# 上傳模型檔案
cloudinary upload backend/gfpgan/weights/alignment_WFLW_4HG.pth --folder ai-models
cloudinary upload backend/gfpgan/weights/detection_Resnet50_Final.pth --folder ai-models
```

### 2. 更新配置
編輯 `backend/config/ai-models.js`，更新雲端 URL：
```javascript
cloud: {
  alignment: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/v1/ai-models/alignment_WFLW_4HG.pth',
  detection: 'https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/v1/ai-models/detection_Resnet50_Final.pth'
}
```

### 3. 更新程式碼
在需要使用模型的地方，使用新的載入器：
```javascript
const modelLoader = require('./utils/modelLoader');

// 載入模型
const alignmentModel = await modelLoader.loadModel('alignment');
const detectionModel = await modelLoader.loadModel('detection');
```

### 4. 測試
確保模型載入功能正常後，可以刪除本地模型檔案：
```bash
rm -rf backend/gfpgan/weights/*.pth
```

## 注意事項
- 確保雲端 CDN 有足夠的頻寬和穩定性
- 考慮實作模型快取機制
- 保留本地模型作為備用方案
EOF

    echo "✅ 已創建部署指南: AI_MODELS_DEPLOYMENT_GUIDE.md"
    
else
    echo "❌ 未找到 AI 模型目錄"
fi

echo ""
echo -e "${GREEN}🎉 AI 模型優化完成！${NC}"
echo "📅 結束時間: $(date)"
