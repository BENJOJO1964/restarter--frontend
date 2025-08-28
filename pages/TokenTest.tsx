import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { usePermission } from '../hooks/usePermission';

export default function TokenTest() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { checkPermission, recordUsage, subscriptionStatus } = usePermission();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [testUserId, setTestUserId] = useState('test-user-123'); // 固定測試用戶ID

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // 模擬登入測試用戶
  const simulateLogin = async () => {
    addResult('模擬登入測試用戶...');
    try {
      // 創建一個模擬的用戶對象
      const mockUser = {
        uid: testUserId,
        email: 'test@example.com',
        displayName: 'Test User'
      };
      
      // 將模擬用戶存儲到 localStorage
      localStorage.setItem('testUser', JSON.stringify(mockUser));
      addResult('測試用戶已登入');
      return mockUser;
    } catch (error) {
      addResult(`登入失敗: ${error}`);
      return null;
    }
  };

  const testTokenConsumption = async () => {
    setLoading(true);
    addResult('開始測試 Token 消耗功能...');

    try {
      // 確保有測試用戶
      await simulateLogin();

      // 1. 檢查當前權限狀態
      const permission = await checkPermission('aiChat');
      addResult(`權限檢查結果: ${permission.allowed ? '允許' : '拒絕'} - ${permission.reason || '無原因'}`);

      if (permission.allowed) {
        // 2. 記錄使用量
        await recordUsage('aiChat', 5); // 消耗 5 tokens
        addResult('已記錄 5 tokens 使用量');

        // 3. 再次檢查權限
        const newPermission = await checkPermission('aiChat');
        addResult(`使用後權限檢查: ${newPermission.allowed ? '允許' : '拒絕'}`);

        if (newPermission.subscriptionData) {
          const { usage, limits } = newPermission.subscriptionData;
          addResult(`當前使用量: ${usage.aiCost}/${limits.aiCostLimit} tokens`);
          addResult(`剩餘 tokens: ${Math.max(0, limits.aiCostLimit - usage.aiCost)}`);
        }
      } else {
        addResult('權限被拒絕，無法測試 token 消耗');
      }
    } catch (error) {
      addResult(`測試失敗: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLimitReached = async () => {
    setLoading(true);
    addResult('開始測試達到限制功能...');

    try {
      // 確保有測試用戶
      await simulateLogin();

      // 模擬大量使用直到達到限制
      let count = 0;
      const maxAttempts = 50; // 防止無限循環

      while (count < maxAttempts) {
        const permission = await checkPermission('aiChat');
        
        if (!permission.allowed) {
          addResult(`達到限制！在第 ${count} 次嘗試後被拒絕`);
          addResult(`拒絕原因: ${permission.reason}`);
          break;
        }

        await recordUsage('aiChat', 1);
        count++;
        
        if (count % 10 === 0) {
          addResult(`已記錄 ${count} 次使用`);
        }
      }

      if (count >= maxAttempts) {
        addResult('達到最大測試次數，可能沒有設置限制');
      }
    } catch (error) {
      addResult(`測試失敗: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const resetUsage = async () => {
    setLoading(true);
    addResult('重置使用量...');

    try {
      // 確保有測試用戶
      await simulateLogin();

      const response = await fetch('/api/subscription/reset-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testUserId
        })
      });

      if (response.ok) {
        const result = await response.json();
        addResult(`使用量已重置: ${result.message}`);
      } else {
        const error = await response.json();
        addResult(`重置失敗: ${error.error}`);
      }
    } catch (error) {
      addResult(`重置失敗: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const showCurrentStatus = async () => {
    addResult('獲取當前訂閱狀態...');
    
    try {
      // 確保有測試用戶
      await simulateLogin();

      const response = await fetch(`/api/subscription/details/${testUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult('=== 當前訂閱狀態 ===');
        addResult(`方案: ${data.subscription}`);
        addResult(`AI Token 使用: ${data.usage.aiCost}/${data.limits.aiCostLimit}`);
        addResult(`AI 聊天次數: ${data.usage.aiChats}/${data.limits.aiChats}`);
        addResult(`剩餘天數: ${data.remainingDays} 天`);
        addResult(`是否激活: ${data.isActive ? '是' : '否'}`);
      } else {
        const error = await response.json();
        addResult(`無法獲取訂閱狀態: ${error.error}`);
      }
    } catch (error) {
      addResult(`獲取狀態失敗: ${error}`);
    }
  };

  // 頁面加載時自動創建測試用戶
  useEffect(() => {
    simulateLogin();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f7faff', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 返回按鈕 */}
      <button 
        onClick={() => navigate('/home')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: '#6B5BFF',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: 16
        }}
      >
        ← 返回首頁
      </button>

      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        paddingTop: 60 
      }}>
        <h1 style={{ 
          color: '#333', 
          textAlign: 'center', 
          marginBottom: 30 
        }}>
          🧪 Token 消耗測試工具
        </h1>

        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: 16 }}>測試功能</h3>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
            <button
              onClick={testTokenConsumption}
              disabled={loading}
              style={{
                background: '#6B5BFF',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14
              }}
            >
              🔄 測試 Token 消耗
            </button>

            <button
              onClick={testLimitReached}
              disabled={loading}
              style={{
                background: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14
              }}
            >
              ⚠️ 測試達到限制
            </button>

            <button
              onClick={resetUsage}
              disabled={loading}
              style={{
                background: '#51cf66',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14
              }}
            >
              🔄 重置使用量
            </button>

            <button
              onClick={showCurrentStatus}
              disabled={loading}
              style={{
                background: '#339af0',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14
              }}
            >
              📊 顯示當前狀態
            </button>
          </div>

          {loading && (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              marginBottom: 16 
            }}>
              ⏳ 測試中...
            </div>
          )}
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: 16 }}>測試結果</h3>
          
          <div style={{
            background: '#f8f9fa',
            borderRadius: 8,
            padding: 16,
            maxHeight: 400,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: 14,
            lineHeight: 1.5
          }}>
            {testResults.length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                點擊上方按鈕開始測試...
              </div>
            ) : (
              testResults.map((result, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  {result}
                </div>
              ))
            )}
          </div>

          {testResults.length > 0 && (
            <button
              onClick={() => setTestResults([])}
              style={{
                background: '#868e96',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: 12,
                marginTop: 12
              }}
            >
              清空結果
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 