import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';

const plans = [
  {
    name: '免費版',
    price: 'NT$0',
    period: '永久免費',
    features: [
      '❌ 無語音功能權限',
      '❌ 無權限使用OpenAI API功能',
      '❌ 無法與其他使用者互動',
      '✅ 基礎功能使用15次/月',
      '💰 成本限制: NT$0/月',
    ],
    highlight: false,
    buttonText: '立即註冊',
    buttonAction: 'register',
  },
  {
    name: '基礎版',
    price: 'NT$149',
    period: '/月 或 NT$1490/年',
    features: [
      '🤖 AI Token 限制: 50K tokens/月',
      '👥 用戶互動: 100次/月',
      '💬 留言/里程碑/AI聊天: 各30次/月',
      '🎯 基礎功能: 300次/月',
      '⚡ Token 用完僅暫停語音功能',
    ],
    highlight: true,
    buttonText: '選擇基礎版',
    buttonAction: 'basic',
  },
  {
    name: '進階版',
    price: 'NT$249',
    period: '/月 或 NT$2490/年',
    features: [
      '🤖 AI Token 限制: 100K tokens/月',
      '👥 用戶互動: 300次/月',
      '💬 留言/里程碑/AI聊天: 各80次/月',
      '🎯 基礎功能: 600次/月',
      '⚡ Token 用完僅暫停語音功能',
    ],
    highlight: false,
    buttonText: '選擇進階版',
    buttonAction: 'advanced',
  },
  {
    name: '專業版',
    price: 'NT$349',
    period: '/月 或 NT$3490/年',
    features: [
      '🤖 AI Token 限制: 200K tokens/月',
      '👥 用戶互動: 800次/月',
      '💬 留言/里程碑/AI聊天: 各150次/月',
      '🎯 基礎功能: 1000次/月',
      '⚡ Token 用完僅暫停語音功能',
    ],
    highlight: false,
    buttonText: '選擇專業版',
    buttonAction: 'professional',
  },
  {
    name: '無限版',
    price: 'NT$499',
    period: '/月 或 NT$4990/年',
    features: [
      '🤖 AI Token 限制: 500K tokens/月',
      '♾️ 用戶互動: 無限制',
      '♾️ 留言/里程碑/AI聊天: 無限制',
      '♾️ 基礎功能: 無限制',
      '⚡ 僅受 Token 上限限制',
    ],
    highlight: false,
    buttonText: '選擇無限版',
    buttonAction: 'unlimited',
  },
];

const upgradeSteps = [
  '選擇適合您的訂閱方案',
  '完成付款（支援信用卡/Apple Pay/Google Pay）',
  '付款成功後自動升級，立即享有所有訂閱權益',
];

const faqs = [
  { q: '升級後可以隨時取消嗎？', a: '可以，訂閱會員可隨時取消，權益將保留至本期結束。' },
  { q: '付款方式有哪些？', a: '支援信用卡、Apple Pay、Google Pay 等多種方式。' },
  { q: '各版本的AI功能限制是什麼？', a: 'Token 用完僅暫停語音功能，文字功能可繼續使用至各自限制。各功能獨立檢查使用次數。' },
  { q: 'Token 用完可以續購嗎？', a: '可以！Token 用完但未滿一個月時，可以續購並從今天重新計算使用期，更划算。' },
  { q: '無限版真的無限制嗎？', a: '無限版除了AI Token上限外，其他功能都無限制使用。' },
  { q: '可以中途升級或降級嗎？', a: '可以，升級立即生效，降級將在當前週期結束後生效。' },
];

export default function Plans() {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handlePlanSelect = (plan: any) => {
    if (!user) {
      setShowModal(true);
      return;
    }
    setSelectedPlan(plan);
    // 這裡可以導向支付頁面
    navigate(`/payment?plan=${plan.buttonAction}`);
  };

  return (
    <div style={{fontFamily:'-apple-system,BlinkMacSystemFont,sans-serif',background:'#f7f8fc',minHeight:'100vh',padding:'32px 0'}}>
      {/* 左上角返回按鈕 */}
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回</button>
      
      <div style={{maxWidth:1200,margin:'0 auto',background:'#fff',borderRadius:18,boxShadow:'0 4px 24px #6B5BFF22',padding:32}}>
        <h1 style={{fontSize:36,fontWeight:900,letterSpacing:2,background:'linear-gradient(90deg,#6B5BFF,#00CFFF)',WebkitBackgroundClip:'text',color:'transparent',marginBottom:24,textAlign:'center'}}>Restarter 訂閱方案</h1>
        
        {/* 訂閱方案卡片 */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:24,marginBottom:32}}>
          {plans.map((plan, i) => (
            <div key={plan.name} style={{
              background: plan.highlight ? 'linear-gradient(135deg, #f3f7ff 0%, #e8f4ff 100%)' : '#fff',
              border: plan.highlight ? '2px solid #6B5BFF' : '1px solid #e0e0e0',
              borderRadius: 16,
              padding: 24,
              position: 'relative',
              boxShadow: plan.highlight ? '0 8px 32px #6B5BFF22' : '0 4px 16px #0001',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }} onClick={() => handlePlanSelect(plan)}>
              
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#6B5BFF',
                  color: '#fff',
                  padding: '4px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                }}>推薦方案</div>
              )}
              
              <h3 style={{
                fontSize: 24,
                fontWeight: 800,
                color: plan.highlight ? '#6B5BFF' : '#333',
                marginBottom: 8,
                textAlign: 'center'
              }}>{plan.name}</h3>
              
              <div style={{textAlign: 'center', marginBottom: 20}}>
                <span style={{fontSize: 32, fontWeight: 900, color: plan.highlight ? '#6B5BFF' : '#333'}}>{plan.price}</span>
                <span style={{fontSize: 16, color: '#666'}}>{plan.period}</span>
              </div>
              
              <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{
                    marginBottom: 12,
                    fontSize: 14,
                    lineHeight: 1.5,
                    color: '#555',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8
                  }}>
                    <span style={{fontSize: 16, marginTop: 1}}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button style={{
                width: '100%',
                background: plan.highlight ? 'linear-gradient(90deg, #6B5BFF, #00CFFF)' : '#f0f0f0',
                color: plan.highlight ? '#fff' : '#666',
                border: 'none',
                borderRadius: 8,
                padding: '12px 0',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: 20,
                transition: 'all 0.2s ease'
              }}>
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* 升級流程 */}
        <h2 style={{fontSize:24,fontWeight:800,margin:'32px 0 12px',color:'#6B5BFF'}}>升級流程</h2>
        <ol style={{fontSize:18,lineHeight:1.8,marginBottom:32,paddingLeft:24}}>
          {upgradeSteps.map((step,i)=>(<li key={i}>{step}</li>))}
        </ol>
        
        {/* 常見問題 */}
        <h2 style={{fontSize:24,fontWeight:800,margin:'32px 0 12px',color:'#6B5BFF'}}>常見問題</h2>
        <div style={{marginBottom:32}}>
          {faqs.map((f,i)=>(
            <div key={i} style={{marginBottom:18}}>
              <div style={{fontWeight:700,fontSize:18,color:'#6B5BFF'}}>{f.q}</div>
              <div style={{fontSize:17,color:'#444',marginLeft:8,marginTop:2}}>{f.a}</div>
            </div>
          ))}
        </div>
        
        {/* 立即註冊按鈕 */}
        <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
          <button 
            onClick={() => navigate('/register')} 
            style={{
              background:'#00CFFF',
              color:'#fff',
              fontWeight:700,
              fontSize:20,
              padding:'14px 38px',
              borderRadius:10,
              boxShadow:'0 2px 8px #00CFFF33',
              border:'none',
              cursor:'pointer',
              transition:'0.2s',
              position:'relative',
              zIndex:1000,
              minHeight:'48px',
              minWidth:'200px',
              touchAction:'manipulation'
            }}
          >
            立即註冊免費版
          </button>
        </div>
        
        {/* 未登入跳窗提示 */}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: 380, textAlign: 'center' }}>
              {/* 圖標 */}
              <div style={{ fontSize: 48, marginBottom: 16, color: '#6B5BFF' }}>🎯</div>
              
              <div style={{ fontSize: 22, fontWeight: 700, color: '#6B5BFF', marginBottom: 12 }}>歡迎加入 Restarter！</div>
              <div style={{ fontSize: 16, color: '#666', marginBottom: 20, lineHeight: 1.5 }}>註冊後即可選擇適合您的訂閱方案，開始您的重啟之旅</div>
              
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
                  onClick={() => { setShowModal(false); navigate('/register'); }} 
                  style={{ 
                    background: 'linear-gradient(135deg, #6B5BFF 0%, #00CFFF 100%)', 
                    color: '#fff', 
                    border: 'none', 
                    borderRadius: 12, 
                    padding: '12px 28px', 
                    fontWeight: 700, 
                    fontSize: 16, 
                    cursor: 'pointer',
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
                    fontSize: 16, 
                    cursor: 'pointer',
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
      </div>
    </div>
  );
} 