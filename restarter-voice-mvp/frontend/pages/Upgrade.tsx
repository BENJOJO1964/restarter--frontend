import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

// 收費標準配置
const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  monthly: {
    name: '基礎版訂閱',
    price: 'NT$ 199',
    period: '/月',
    features: [
      '每日10次配對、可主動加好友、私訊',
      '每日5次心情記錄、拼圖、基礎成就',
      '每日5次AI任務、基礎任務、基礎徽章',
      '每日10次發文、留言、收藏、互動',
      '每日5次農場互動、基礎作物/道具',
      '每日3次社會互動練習、基礎模擬',
      '每日3次參加、可發出/接受幫助、互動',
      '每日10次AI對話、基礎分析、基礎推薦'
    ],
    // 實際付款連結（需要後續設定）
    stripeLink: 'https://buy.stripe.com/your_monthly_basic_link',
    paypalLink: 'https://www.paypal.com/your_monthly_basic_link',
    ecpayLink: 'https://payment.ecpay.com.tw/your_monthly_basic_link',
    newebpayLink: 'https://ccore.newebpay.com/your_monthly_basic_link'
  },
  monthlyPro: {
    name: '進階版訂閱',
    price: 'NT$ 299',
    period: '/月',
    features: [
      '無限配對、主動加好友、私訊、群組',
      '無限心情記錄、拼圖、完整成就、進階分析',
      '無限AI任務、進階任務、專屬徽章、成就牆',
      '無限發文、留言、收藏、互動、高質量內容',
      '無限農場互動、高級作物/道具、專屬活動',
      '無限社會互動練習、進階模擬、成就牆',
      '無限參加、可發出/接受幫助、互動、專屬小組',
      '無限AI對話、深度分析、個人化推薦、高額度API'
    ],
    // 實際付款連結（需要後續設定）
    stripeLink: 'https://buy.stripe.com/your_monthly_pro_link',
    paypalLink: 'https://www.paypal.com/your_monthly_pro_link',
    ecpayLink: 'https://payment.ecpay.com.tw/your_monthly_pro_link',
    newebpayLink: 'https://ccore.newebpay.com/your_monthly_pro_link'
  },
  yearly: {
    name: '基礎版年費',
    price: 'NT$ 1,999',
    period: '/年',
    originalPrice: 'NT$ 2,388',
    discount: '省 NT$ 389',
    features: [
      '所有基礎版月費功能 + 年費專屬優惠',
      '每日15次配對（比月費多5次）',
      '每日8次心情記錄（比月費多3次）',
      '每日8次AI任務（比月費多3次）',
      '優先客服支援',
      '年費專屬徽章與成就'
    ],
    // 實際付款連結（需要後續設定）
    stripeLink: 'https://buy.stripe.com/your_yearly_basic_link',
    paypalLink: 'https://www.paypal.com/your_yearly_basic_link',
    ecpayLink: 'https://payment.ecpay.com.tw/your_yearly_basic_link',
    newebpayLink: 'https://ccore.newebpay.com/your_yearly_basic_link'
  },
  yearlyPro: {
    name: '進階版年費',
    price: 'NT$ 2,999',
    period: '/年',
    originalPrice: 'NT$ 3,588',
    discount: '省 NT$ 589',
    features: [
      '所有進階版月費功能 + 年費專屬優惠',
      '最高優先級客服支援',
      '專屬年費會員活動',
      '年費專屬徽章與成就',
      '高額度API（每月100萬tokens）、專屬AI模型'
    ],
    // 實際付款連結（需要後續設定）
    stripeLink: 'https://buy.stripe.com/your_yearly_pro_link',
    paypalLink: 'https://www.paypal.com/your_yearly_pro_link',
    ecpayLink: 'https://payment.ecpay.com.tw/your_yearly_pro_link',
    newebpayLink: 'https://ccore.newebpay.com/your_yearly_pro_link'
  }
};

type SubscriptionPlan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  stripeLink: string;
  paypalLink: string;
  ecpayLink: string;
  newebpayLink: string;
  originalPrice?: string;
  discount?: string;
};

export default function Upgrade() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [selectedPayment, setSelectedPayment] = useState('stripe');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const lang = localStorage.getItem('lang') || 'zh-TW';

  const handleUpgrade = () => {
    if (!user) {
      setShowModal(true);
      return;
    }

    // 根據選擇的付款方式導向對應連結
    const plan = SUBSCRIPTION_PLANS[selectedPlan];
    const paymentLink = plan[`${selectedPayment}Link` as keyof SubscriptionPlan] as string;
    
    // 檢查是否為實際付款連結
    if (paymentLink && !paymentLink.includes('your_')) {
      // 模擬付款成功（實際應用中會由付款平台回調）
      simulatePaymentSuccess();
    } else {
      // 顯示付款說明而不是錯誤
      alert(`請聯絡客服完成付款設定\n\n選擇方案：${plan.name}\n付款方式：${selectedPayment === 'stripe' ? 'Stripe' : selectedPayment === 'paypal' ? 'PayPal' : selectedPayment === 'ecpay' ? '綠界' : '藍新'}\n\n客服 Email：support@restarter.com`);
    }
  };

  // 模擬付款成功處理
  const simulatePaymentSuccess = async () => {
    if (!user) return;

    try {
      // 生成模擬交易 ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // 調用付款成功 API
      const response = await fetch('/api/subscription/payment-success', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          plan: selectedPlan,
          paymentMethod: selectedPayment,
          transactionId: transactionId,
          amount: getPlanPrice(selectedPlan),
          currency: 'TWD'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setPaymentResult(result);
        setShowSuccessModal(true);
        
        // 3秒後自動跳轉到首頁
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      } else {
        alert('付款處理失敗，請聯絡客服');
      }
    } catch (error) {
      console.error('付款處理錯誤:', error);
      alert('付款處理失敗，請聯絡客服');
    }
  };

  // 獲取方案價格
  const getPlanPrice = (plan: string): number => {
    const prices: { [key: string]: number } = {
      'monthly': 199,
      'monthlyPro': 299,
      'yearly': 1999,
      'yearlyPro': 2999
    };
    return prices[plan] || 0;
  };

  // 獲取方案名稱
  const getPlanName = (plan: string): string => {
    const names: { [key: string]: string } = {
      'monthly': '基礎版月費',
      'monthlyPro': '進階版月費',
      'yearly': '基礎版年費',
      'yearlyPro': '進階版年費'
    };
    return names[plan] || plan;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      {/* 左上角返回按鈕 */}
      <button onClick={() => navigate('/plans')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回</button>
      
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px 24px' }}>
          <h2 style={{ color: '#4B5BFF', fontWeight: 900, fontSize: 32, marginBottom: 8, letterSpacing: 2, textAlign: 'center' }}>升級訂閱</h2>
          <p style={{ color: '#666', fontSize: 18, textAlign: 'center', marginBottom: 32 }}>選擇最適合您的訂閱方案，立即享有完整功能</p>

          {/* 訂閱方案選擇 */}
          <div style={{ display: 'flex', gap: 24, marginBottom: 32, justifyContent: 'center' }}>
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
              <div
                key={key}
                onClick={() => setSelectedPlan(key)}
                style={{
                  background: selectedPlan === key ? '#6B5BFF' : '#fff',
                  color: selectedPlan === key ? '#fff' : '#333',
                  border: `2px solid ${selectedPlan === key ? '#6B5BFF' : '#ddd'}`,
                  borderRadius: 12,
                  padding: '24px',
                  cursor: 'pointer',
                  minWidth: 200,
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>
                  {plan.price}
                  <span style={{ fontSize: 16, fontWeight: 400 }}>{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div style={{ fontSize: 14, textDecoration: 'line-through', opacity: 0.7, marginBottom: 4 }}>
                    {plan.originalPrice}
                  </div>
                )}
                {plan.discount && (
                  <div style={{ fontSize: 14, color: '#ff6b6b', fontWeight: 700 }}>
                    {plan.discount}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 付款方式選擇 */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#333', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>選擇付款方式</h3>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { key: 'stripe', name: 'Stripe', icon: '💳' },
                { key: 'paypal', name: 'PayPal', icon: '🔵' },
                { key: 'ecpay', name: '綠界', icon: '🟢' },
                { key: 'newebpay', name: '藍新', icon: '🔵' }
              ].map(payment => (
                <button
                  key={payment.key}
                  onClick={() => setSelectedPayment(payment.key)}
                  style={{
                    background: selectedPayment === payment.key ? '#6B5BFF' : '#fff',
                    color: selectedPayment === payment.key ? '#fff' : '#333',
                    border: `2px solid ${selectedPayment === payment.key ? '#6B5BFF' : '#ddd'}`,
                    borderRadius: 8,
                    padding: '12px 20px',
                    cursor: 'pointer',
                    fontSize: 16,
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {payment.icon} {payment.name}
                </button>
              ))}
            </div>
          </div>

          {/* 功能列表 */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#333', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>訂閱權益</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {SUBSCRIPTION_PLANS[selectedPlan].features.map((feature, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#6B5BFF', fontSize: 18 }}>✓</span>
                  <span style={{ color: '#333', fontSize: 16 }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 立即升級按鈕 */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button 
              onClick={handleUpgrade}
              style={{ 
                background: 'linear-gradient(90deg,#6B5BFF 60%,#23c6e6 100%)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 12, 
                fontWeight: 900, 
                fontSize: 20, 
                padding: '12px 48px', 
                boxShadow: '0 2px 12px #6B5BFF33', 
                letterSpacing: 2, 
                cursor: 'pointer' 
              }}
            >
              立即升級
            </button>
          </div>

          {/* 付款說明與聯絡客服按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
            <button onClick={() => navigate('/payment-info')} style={{ background: '#fff', color: '#6B5BFF', border: '1.5px solid #6B5BFF', borderRadius: 8, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}>付款說明</button>
            <button onClick={() => navigate('/contact')} style={{ background: '#fff', color: '#6B5BFF', border: '1.5px solid #6B5BFF', borderRadius: 8, padding: '10px 32px', fontWeight: 600, cursor: 'pointer' }}>聯絡客服</button>
          </div>
        </div>
      </div>

      {/* 未登入提示跳窗 */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 32, maxWidth: 450, textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            {/* 圖標 */}
            <div style={{ fontSize: 48, marginBottom: 16, color: '#6B5BFF' }}>🎯</div>
            
            <h3 style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 22, marginBottom: 12 }}>歡迎加入 Restarter！</h3>
            <p style={{ color: '#666', marginBottom: 20, lineHeight: 1.5, fontSize: 16 }}>註冊後即可選擇適合您的訂閱方案，開始您的重啟之旅</p>
            
            {/* 友善提示 */}
            <div style={{ background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)', borderRadius: 12, padding: 16, marginBottom: 24, border: '1px solid #e0e8ff' }}>
              <div style={{ fontSize: 14, color: '#6B5BFF', fontWeight: 600, marginBottom: 8 }}>💡 註冊好處</div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.4 }}>
                • 免費體驗基礎功能<br/>
                • 個人化使用記錄<br/>
                • 安全可靠的服務
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => navigate('/register')} 
                style={{ 
                  background: 'linear-gradient(135deg, #6B5BFF 0%, #00CFFF 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 12, 
                  padding: '12px 28px', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  fontSize: 16,
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
                🚀 立即註冊
              </button>
              <button 
                onClick={() => setShowModal(false)} 
                style={{ 
                  background: '#f8f9ff', 
                  color: '#6B5BFF', 
                  border: '2px solid #6B5BFF', 
                  borderRadius: 12, 
                  padding: '12px 28px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: 16,
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
                💭 稍後再說
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 付款成功彈窗 */}
      {showSuccessModal && paymentResult && (
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
            {/* 成功圖標 */}
            <div style={{
              fontSize: 64,
              marginBottom: 16,
              color: '#52c41a'
            }}>
              ✅
            </div>

            {/* 標題 */}
            <h2 style={{
              fontSize: 24,
              fontWeight: 700,
              color: '#333',
              marginBottom: 12
            }}>
              付款成功！
            </h2>

            {/* 成功訊息 */}
            <p style={{
              fontSize: 16,
              color: '#666',
              marginBottom: 20,
              lineHeight: 1.6
            }}>
              {paymentResult.message}
            </p>

            {/* 訂閱詳情 */}
            <div style={{
              background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
              border: '1px solid #b7eb8f'
            }}>
              <div style={{
                fontSize: 14,
                color: '#52c41a',
                fontWeight: 600,
                marginBottom: 8
              }}>
                🎉 訂閱詳情
              </div>
              <div style={{
                fontSize: 13,
                color: '#666',
                lineHeight: 1.4
              }}>
                • 方案：{getPlanName(selectedPlan)}<br/>
                • 剩餘天數：{paymentResult.remainingDays} 天<br/>
                • AI Token：{paymentResult.plan.limits.aiCostLimit}K tokens<br/>
                • 立即生效，可開始使用所有 AI 功能
              </div>
            </div>

            {/* 按鈕 */}
            <div style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center'
            }}>
              <button
                onClick={() => navigate('/home')}
                style={{
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 28px',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flex: 1,
                  boxShadow: '0 4px 12px #52c41a33',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px #52c41a44';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px #52c41a33';
                }}
              >
                🚀 立即開始使用
              </button>
            </div>

            {/* 自動跳轉提示 */}
            <div style={{
              marginTop: 16,
              fontSize: 14,
              color: '#888'
            }}>
              3秒後自動跳轉到首頁...
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 