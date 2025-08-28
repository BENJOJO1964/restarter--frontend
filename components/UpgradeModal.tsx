import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string; // 功能名稱，如 "語音功能"、"AI 聊天" 等
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  featureName
}) => {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  if (!isOpen) return null;

  const planFeatures = {
    basic: {
      name: '基礎版',
      price: 'NT$ 149',
      tokens: '50K',
      features: ['語音功能', 'AI 聊天', '語音轉文字', '文字轉語音', '用戶互動: 100次/月']
    },
    advanced: {
      name: '進階版',
      price: 'NT$ 249',
      tokens: '100K',
      features: ['所有基礎版功能', '更多 Token', '用戶互動: 300次/月', '優先支援']
    },
    professional: {
      name: '專業版',
      price: 'NT$ 349',
      tokens: '200K',
      features: ['所有進階版功能', '用戶互動: 800次/月', '專屬客服']
    },
    unlimited: {
      name: '無限版',
      price: 'NT$ 499',
      tokens: '500K',
      features: ['所有專業版功能', '無限制用戶互動', '最高優先級支援']
    }
  };

  const handleUpgrade = () => {
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
        padding: isMobile ? 16 : 32,
        maxWidth: 480,
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }}>
        {/* 圖標 - 手機版隱藏 */}
        {!isMobile && (
          <div style={{
            fontSize: 48,
            marginBottom: 16,
            color: '#6B5BFF'
          }}>
            🚀
          </div>
        )}

        {/* 標題 */}
        <h2 style={{
          fontSize: isMobile ? 18 : 24,
          fontWeight: 700,
          color: '#333',
          marginBottom: isMobile ? 6 : 12
        }}>
          升級方案，解鎖 {featureName}
        </h2>

        {/* 友善說明 */}
        <p style={{
          fontSize: isMobile ? 12 : 16,
          color: '#666',
          marginBottom: isMobile ? 12 : 20,
          lineHeight: 1.4
        }}>
          您目前使用的是免費方案，{featureName} 需要升級才能使用。
        </p>

        {/* 功能對比 */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)',
          borderRadius: 12,
          padding: isMobile ? 12 : 16,
          marginBottom: isMobile ? 16 : 24,
          border: '1px solid #e0e8ff'
        }}>
          <div style={{
            fontSize: isMobile ? 12 : 14,
            color: '#6B5BFF',
            fontWeight: 600,
            marginBottom: isMobile ? 6 : 8
          }}>
            📊 方案對比
          </div>
          <div style={{
            fontSize: isMobile ? 11 : 13,
            color: '#666',
            lineHeight: 1.3
          }}>
            • 免費方案：僅限文字功能<br/>
            • 付費方案：解鎖語音、AI 聊天等進階功能<br/>
            • 立即升級：享受完整功能體驗
          </div>
        </div>

        {/* 推薦方案 */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: isMobile ? 14 : 20,
          marginBottom: isMobile ? 16 : 24,
          border: '2px solid #6B5BFF',
          boxShadow: '0 2px 8px #6B5BFF22'
        }}>
          <div style={{
            fontSize: isMobile ? 14 : 16,
            color: '#6B5BFF',
            fontWeight: 700,
            marginBottom: isMobile ? 8 : 12
          }}>
            💡 推薦方案
          </div>
          <div style={{
            fontSize: isMobile ? 12 : 14,
            color: '#666',
            lineHeight: 1.4,
            marginBottom: isMobile ? 12 : 16
          }}>
            <strong>基礎版：</strong>最受歡迎的入門方案<br/>
            包含 {planFeatures.basic.tokens} tokens，{planFeatures.basic.features.join('、')}
          </div>
          <div style={{
            fontSize: isMobile ? 16 : 18,
            fontWeight: 700,
            color: '#6B5BFF'
          }}>
            {planFeatures.basic.price}
          </div>
        </div>

        {/* 升級好處 */}
        <div style={{
          background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
          borderRadius: 12,
          padding: isMobile ? 12 : 16,
          marginBottom: isMobile ? 16 : 24,
          border: '1px solid #ffeaa7'
        }}>
          <div style={{
            fontSize: isMobile ? 12 : 14,
            color: '#856404',
            fontWeight: 600,
            marginBottom: isMobile ? 6 : 8
          }}>
            ✨ 升級好處
          </div>
          <div style={{
            fontSize: isMobile ? 11 : 13,
            color: '#856404',
            lineHeight: 1.3
          }}>
            • 立即解鎖 {featureName}<br/>
            • 享受完整的 AI 體驗<br/>
            • 無限制使用語音功能<br/>
            • 優先技術支援
          </div>
        </div>

        {/* 按鈕組 */}
        <div style={{
          display: 'flex',
          gap: isMobile ? 8 : 12,
          justifyContent: 'center'
        }}>
          <button
            onClick={handleUpgrade}
            style={{
              background: 'linear-gradient(135deg, #6B5BFF 0%, #00CFFF 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: isMobile ? '12px 20px' : '14px 28px',
              fontSize: isMobile ? 14 : 16,
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
            🚀 立即升級
          </button>
          
          <button
            onClick={onClose}
            style={{
              background: '#f8f9ff',
              color: '#6B5BFF',
              border: '2px solid #6B5BFF',
              borderRadius: 12,
              padding: isMobile ? '12px 20px' : '14px 28px',
              fontSize: isMobile ? 14 : 16,
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