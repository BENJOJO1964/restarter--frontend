import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface PermissionResult {
  allowed: boolean;
  reason?: string;
  canRenew?: boolean;
  remainingDays?: number;
  usedTokens?: number;
  totalTokens?: number;
  currentPlan?: string;
  message?: string;
  isFreeUser?: boolean; // 新增：是否為免費用戶
  featureName?: string; // 新增：功能名稱
  isNewSubscription?: boolean; // 新增：是否為新訂閱用戶
  subscriptionData?: any; // 新增：訂閱詳情數據
  isTestMode?: boolean; // 新增：是否為測試模式
}

interface SubscriptionStatus {
  subscription: string;
  plan: any;
  usage: any;
  limits: any;
  isOverLimit: any;
}

export function usePermission() {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  // 獲取用戶訂閱狀態
  const fetchSubscriptionStatus = async () => {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      setLoading(true);
      const response = await fetch(`/api/subscription/status/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data);
        return data;
      }
    } catch (error) {
      console.error('獲取訂閱狀態失敗:', error);
    } finally {
      setLoading(false);
    }
    return null;
  };

  // 檢查特定功能權限
  const checkPermission = async (feature: string): Promise<PermissionResult> => {
    const user = auth.currentUser;
    let userId = user?.uid;
    
    // 如果沒有登入用戶，嘗試使用測試用戶
    if (!userId) {
      const testUser = localStorage.getItem('testUser');
      if (testUser) {
        const mockUser = JSON.parse(testUser);
        userId = mockUser.uid;
      } else {
        return { allowed: false, reason: '請先登入' };
      }
    }

    try {
      // 首先獲取最新的訂閱狀態
      const statusResponse = await fetch(`/api/subscription/details/${userId}`);
      let subscriptionData = null;
      
      if (statusResponse.ok) {
        subscriptionData = await statusResponse.json();
      }

      // 檢查測試模式
      const isTestMode = localStorage.getItem('testMode') === 'true';
      
      // 如果測試模式開啟，直接返回允許
      if (isTestMode) {
        const featureNames: { [key: string]: string } = {
          'aiChat': 'AI 聊天功能',
          'voiceInput': '語音輸入功能',
          'voiceOutput': '語音輸出功能',
          'videoChat': '視訊通話功能',
          'voiceRecording': '語音錄製功能'
        };
        
        return {
          allowed: true,
          reason: undefined,
          featureName: featureNames[feature] || feature,
          isFreeUser: true,
          isTestMode: true,
          currentPlan: 'test'
        };
      }
      
      const response = await fetch('/api/subscription/check-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-test-mode': isTestMode ? 'true' : 'false'
        },
        body: JSON.stringify({
          userId: userId,
          feature
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // 添加功能名稱和用戶類型判斷
        const featureNames: { [key: string]: string } = {
          'aiChat': 'AI 聊天功能',
          'voiceInput': '語音輸入功能',
          'voiceOutput': '語音輸出功能',
          'videoChat': '視訊通話功能',
          'voiceRecording': '語音錄製功能'
        };

        // 檢查是否為新訂閱用戶（付款成功後立即解鎖）
        const isNewSubscription = subscriptionData && 
          subscriptionData.isActive && 
          subscriptionData.startDate && 
          new Date(subscriptionData.startDate).getTime() > Date.now() - (24 * 60 * 60 * 1000); // 24小時內

        return {
          ...result,
          featureName: featureNames[feature] || feature,
          isFreeUser: result.currentPlan === 'free' || !result.currentPlan,
          isNewSubscription: isNewSubscription,
          subscriptionData: subscriptionData
        };
      } else {
        return { 
          allowed: false, 
          reason: '權限檢查失敗',
          featureName: feature,
          isFreeUser: true
        };
      }
    } catch (error) {
      console.error('權限檢查錯誤:', error);
      return { 
        allowed: false, 
        reason: '網路錯誤',
        featureName: feature,
        isFreeUser: true
      };
    }
  };

  // 記錄使用量
  const recordUsage = async (feature: string, cost: number = 0) => {
    const user = auth.currentUser;
    let userId = user?.uid;
    
    // 如果沒有登入用戶，嘗試使用測試用戶
    if (!userId) {
      const testUser = localStorage.getItem('testUser');
      if (testUser) {
        const mockUser = JSON.parse(testUser);
        userId = mockUser.uid;
      } else {
        return;
      }
    }

    // 檢查測試模式
    const isTestMode = localStorage.getItem('testMode') === 'true';

    try {
      await fetch('/api/subscription/record-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-test-mode': isTestMode ? 'true' : 'false'
        },
        body: JSON.stringify({
          userId: userId,
          feature,
          cost
        })
      });
    } catch (error) {
      console.error('記錄使用量失敗:', error);
    }
  };

  // 初始化時獲取訂閱狀態
  useEffect(() => {
    if (auth.currentUser) {
      fetchSubscriptionStatus();
    }
  }, [auth.currentUser]);

  return {
    subscriptionStatus,
    loading,
    checkPermission,
    recordUsage,
    fetchSubscriptionStatus
  };
} 