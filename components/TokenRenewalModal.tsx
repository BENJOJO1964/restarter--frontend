import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TokenRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  remainingDays: number;
  usedTokens: number;
  totalTokens: number;
}

export const TokenRenewalModal: React.FC<TokenRenewalModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  remainingDays,
  usedTokens,
  totalTokens
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const planNames = {
    basic: '基礎版',
    advanced: '進階版',
    professional: '專業版',
    unlimited: '無限版'
  };

  const planTokens = {
    basic: '50K',
    advanced: '100K',
    professional: '200K',
    unlimited: '500K'
  };

  const planPrices = {
    basic: 'NT$ 149',
    advanced: 'NT$ 249',
    professional: 'NT$ 349',
    unlimited: 'NT$ 499'
  };

  const handleRenewal = () => {
    onClose();
    navigate('/plans');
  };



  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        padding: 32,
        maxWidth: 480,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>


        {/* 標題 */}
        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: '#333',
          marginBottom: 12
        }}>
          Token 已用完，需要續購嗎？
        </h2>

        {/* 友善說明 */}
        <p style={{
          fontSize: 16,
          color: '#666',
          marginBottom: 20,
          lineHeight: 1.6
        }}>
          您的 {planNames[currentPlan as keyof typeof planNames]} 方案 Token 已用完，但還有 {remainingDays} 天到期。
        </p>

        {/* 使用狀況 */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: '1px solid #e0e8ff'
        }}>
          <div style={{
            fontSize: 14,
            color: '#6B5BFF',
            fontWeight: 600,
            marginBottom: 8
          }}>
            📊 本月使用狀況
          </div>
          <div style={{
            fontSize: 13,
            color: '#666',
            lineHeight: 1.4
          }}>
            • 已使用：{Math.round(usedTokens/1000)}K / {Math.round(totalTokens/1000)}K tokens<br/>
            • 剩餘天數：{remainingDays} 天<br/>
            • 當前方案：{planNames[currentPlan as keyof typeof planNames]}
          </div>
        </div>

        {/* 續購選項 */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          border: '2px solid #6B5BFF',
          boxShadow: '0 2px 8px #6B5BFF22'
        }}>
          <div style={{
            fontSize: 16,
            color: '#6B5BFF',
            fontWeight: 700,
            marginBottom: 12
          }}>
            💡 續購方案
          </div>
          <div style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 1.5,
            marginBottom: 16
          }}>
            <strong>立即續購：</strong>重新獲得 {planTokens[currentPlan as keyof typeof planTokens]} tokens，<br/>
            並從今天開始重新計算 {remainingDays} 天使用期
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#6B5BFF'
          }}>
            {planPrices[currentPlan as keyof typeof planPrices]}
          </div>
        </div>

        {/* 友善提示 */}
        <div style={{
          background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: '1px solid #ffeaa7'
        }}>
          <div style={{
            fontSize: 14,
            color: '#856404',
            fontWeight: 600,
            marginBottom: 8
          }}>
            ✨ 續購好處
          </div>
          <div style={{
            fontSize: 13,
            color: '#856404',
            lineHeight: 1.4
          }}>
            • 立即恢復語音功能使用<br/>
            • 時間從今天重新計算，更划算<br/>
            • 文字功能不受影響，可繼續使用
          </div>
        </div>

        {/* 按鈕組 */}
        <div style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={handleRenewal}
            style={{
              background: 'linear-gradient(135deg, #6B5BFF 0%, #00CFFF 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              flex: 1,
              boxShadow: '0 4px 12px #6B5BFF33',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px #6B5BFF44';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px #6B5BFF33';
            }}
          >
            ⚡ 立即續購
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: '#f8f9ff',
              color: '#6B5BFF',
              border: '2px solid #6B5BFF',
              borderRadius: 12,
              padding: '14px 28px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              flex: 1,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6B5BFF';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f8f9ff';
              e.currentTarget.style.color = '#6B5BFF';
            }}
          >
            💫 稍後再說
          </button>
        </div>

        {/* 取消按鈕 */}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              fontSize: 14,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            稍後再說
          </button>
        </div>
      </div>
    </div>
  );
}; 