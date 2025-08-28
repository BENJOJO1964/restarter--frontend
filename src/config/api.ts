// API 配置
const API_CONFIG = {
  // 開發環境使用本地後端
  development: {
    baseURL: '/api', // 使用 Vite 代理
    wsURL: 'ws://localhost:3001'
  },
  // 生產環境使用雲端後端
  production: {
    baseURL: 'https://restarter-backend-6e9s.onrender.com/api',
    wsURL: 'wss://restarter-backend-6e9s.onrender.com'
  }
};

// 根據環境選擇配置
const isDevelopment = import.meta.env.DEV;
const config = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

export const API_BASE_URL = config.baseURL;
export const WS_URL = config.wsURL;

// 輔助函數
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};

export const getWsUrl = () => {
  return WS_URL;
};

console.log('🌍 環境:', isDevelopment ? '開發' : '生產');
console.log('🔗 API URL:', API_BASE_URL);
console.log('🔌 WebSocket URL:', WS_URL); 