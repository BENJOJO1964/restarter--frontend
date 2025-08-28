import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

interface PlanDetails {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonAction: string;
}

const planDetails: { [key: string]: PlanDetails } = {
  basic: {
    name: '基礎版',
    price: 'NT$149',
    period: '/月',
    features: [
      '🤖 AI Token 限制: 50K tokens/月',
      '👥 用戶互動: 100次/月',
      '💬 留言/里程碑/AI聊天: 各30次/月',
      '🎯 基礎功能: 300次/月',
    ],
    buttonAction: 'basic'
  },
  advanced: {
    name: '進階版',
    price: 'NT$249',
    period: '/月',
    features: [
      '🤖 AI Token 限制: 100K tokens/月',
      '👥 用戶互動: 300次/月',
      '💬 留言/里程碑/AI聊天: 各80次/月',
      '🎯 基礎功能: 600次/月',
    ],
    buttonAction: 'advanced'
  },
  professional: {
    name: '專業版',
    price: 'NT$349',
    period: '/月',
    features: [
      '🤖 AI Token 限制: 200K tokens/月',
      '👥 用戶互動: 800次/月',
      '💬 留言/里程碑/AI聊天: 各150次/月',
      '🎯 基礎功能: 1000次/月',
    ],
    buttonAction: 'professional'
  },
  unlimited: {
    name: '無限版',
    price: 'NT$499',
    period: '/月',
    features: [
      '🤖 AI Token 限制: 500K tokens/月',
      '♾️ 用戶互動: 無限制',
      '♾️ 留言/里程碑/AI聊天: 無限制',
      '♾️ 基礎功能: 無限制',
    ],
    buttonAction: 'unlimited'
  }
};

export default function Payment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const auth = getAuth();
  const user = auth.currentUser;
  
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam && planDetails[planParam]) {
      setSelectedPlan(planDetails[planParam]);
    } else {
      navigate('/plans');
    }
  }, [searchParams, navigate]);

  const handlePayment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    
    try {
      // 調用後端支付API
      const response = await fetch('/api/subscription/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          plan: selectedPlan.buttonAction,
          paymentMethod: paymentMethod,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: parseInt(selectedPlan.price.replace('NT$', '')),
          currency: 'TWD'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setIsProcessing(false);
        setShowSuccess(true);
        
        // 3秒後跳轉到首頁
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        throw new Error(result.error || '支付失敗');
      }
    } catch (error) {
      console.error('支付錯誤:', error);
      setIsProcessing(false);
      alert('支付失敗，請重試');
    }
  };

  if (!selectedPlan) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>載入中...</div>
      </div>
    );
  }

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif',background:'#f7f8fc',minHeight:'100vh',padding:'32px 0'}}>
      {/* 左上角返回按鈕 */}
      <button onClick={() => navigate('/plans')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回</button>
      
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:18,boxShadow:'0 4px 24px #6B5BFF22',padding:32}}>
        <h1 style={{fontSize:32,fontWeight:900,letterSpacing:2,background:'linear-gradient(90deg,#6B5BFF,#00CFFF)',WebkitBackgroundClip:'text',color:'transparent',marginBottom:24,textAlign:'center'}}>完成訂閱</h1>
        
        {/* 選擇的方案 */}
        <div style={{background:'#f8f9ff',borderRadius:12,padding:24,marginBottom:32}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#6B5BFF',marginBottom:16}}>選擇的方案</h2>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <span style={{fontSize:18,fontWeight:600}}>{selectedPlan.name}</span>
            <span style={{fontSize:24,fontWeight:900,color:'#6B5BFF'}}>{selectedPlan.price}{selectedPlan.period}</span>
          </div>
          <ul style={{margin:0,padding:0,listStyle:'none'}}>
            {selectedPlan.features.map((feature, i) => (
              <li key={i} style={{marginBottom:8,fontSize:14,color:'#666'}}>• {feature}</li>
            ))}
          </ul>
        </div>

        {/* 付款方式 */}
        <div style={{marginBottom:32}}>
          <h2 style={{fontSize:20,fontWeight:700,color:'#6B5BFF',marginBottom:16}}>付款方式</h2>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
              <input 
                type="radio" 
                name="payment" 
                value="credit" 
                checked={paymentMethod === 'credit'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{width:18,height:18}}
              />
              <span style={{fontSize:16}}>💳 信用卡</span>
            </label>
            <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
              <input 
                type="radio" 
                name="payment" 
                value="apple" 
                checked={paymentMethod === 'apple'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{width:18,height:18}}
              />
              <span style={{fontSize:16}}>🍎 Apple Pay</span>
            </label>
            <label style={{display:'flex',alignItems:'center',gap:12,cursor:'pointer'}}>
              <input 
                type="radio" 
                name="payment" 
                value="google" 
                checked={paymentMethod === 'google'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{width:18,height:18}}
              />
              <span style={{fontSize:16}}>🤖 Google Pay</span>
            </label>
          </div>
        </div>

        {/* 付款按鈕 */}
        <button 
          onClick={handlePayment}
          disabled={isProcessing}
          style={{
            width:'100%',
            background: isProcessing ? '#ccc' : 'linear-gradient(90deg,#6B5BFF,#00CFFF)',
            color:'#fff',
            border:'none',
            borderRadius:12,
            padding:'16px 0',
            fontSize:18,
            fontWeight:700,
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            transition:'all 0.2s ease'
          }}
        >
          {isProcessing ? '處理中...' : `立即付款 ${selectedPlan.price}`}
        </button>

        {/* 成功提示 */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#0008',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: 32,
              boxShadow: '0 4px 24px #0002',
              minWidth: 320,
              textAlign: 'center'
            }}>
              <div style={{fontSize: 48, marginBottom: 16}}>✅</div>
              <div style={{fontSize: 20, fontWeight: 700, color: '#6B5BFF', marginBottom: 8}}>付款成功！</div>
              <div style={{fontSize: 16, color: '#666', marginBottom: 16}}>您的訂閱已生效，即將跳轉到首頁...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 