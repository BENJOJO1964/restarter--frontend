import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

interface SubscriptionPlan {
  name: string;
  price: number;
  limits: {
    aiCostLimit: number;
    userInteractions: number;
    comments: number;
    milestones: number;
    aiChats: number;
    freeFeatures: number;
  };
}

interface Usage {
  aiCost: number;
  userInteractions: number;
  comments: number;
  milestones: number;
  aiChats: number;
  freeFeatures: number;
}

interface SubscriptionStatus {
  subscription: string;
  plan: SubscriptionPlan;
  usage: Usage;
  limits: SubscriptionPlan['limits'];
  isOverLimit: {
    aiCost: boolean;
    userInteractions: boolean;
    comments: boolean;
    milestones: boolean;
    aiChats: boolean;
    freeFeatures: boolean;
  };
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth();

  const fetchSubscriptionStatus = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setStatus(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/subscription/status/${user.uid}`);
      if (!response.ok) {
        throw new Error('無法獲取訂閱狀態');
      }

      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知錯誤');
    } finally {
      setLoading(false);
    }
  };

  const checkPermission = async (feature: string): Promise<{
    allowed: boolean;
    reason?: string;
    requiredPlan?: string;
    currentUsage?: Usage;
    limits?: SubscriptionPlan['limits'];
  }> => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { allowed: false, reason: '請先登入' };
      }

      const response = await fetch('/api/subscription/check-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          feature,
        }),
      });

      if (!response.ok) {
        throw new Error('權限檢查失敗');
      }

      return await response.json();
    } catch (err) {
      console.error('權限檢查錯誤:', err);
      return { allowed: false, reason: '權限檢查失敗' };
    }
  };

  const recordUsage = async (feature: string, cost: number = 0) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('請先登入');
      }

      const response = await fetch('/api/subscription/record-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          feature,
          cost,
        }),
      });

      if (!response.ok) {
        throw new Error('記錄使用量失敗');
      }

      // 更新本地狀態
      await fetchSubscriptionStatus();
      return await response.json();
    } catch (err) {
      console.error('記錄使用量錯誤:', err);
      throw err;
    }
  };

  const updateSubscription = async (plan: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('請先登入');
      }

      const response = await fetch('/api/subscription/update-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          plan,
        }),
      });

      if (!response.ok) {
        throw new Error('更新訂閱失敗');
      }

      // 更新本地狀態
      await fetchSubscriptionStatus();
      return await response.json();
    } catch (err) {
      console.error('更新訂閱錯誤:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  return {
    status,
    loading,
    error,
    checkPermission,
    recordUsage,
    updateSubscription,
    refreshStatus: fetchSubscriptionStatus,
  };
}; 