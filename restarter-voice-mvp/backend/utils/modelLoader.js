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
