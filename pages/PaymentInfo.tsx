import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentInfo() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      {/* 左上角返回按鈕 */}
      <button onClick={() => navigate('/upgrade')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回</button>
      
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 32px' }}>
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px 24px' }}>
          <h2 style={{ color: '#4B5BFF', fontWeight: 900, fontSize: 32, marginBottom: 8, letterSpacing: 2, textAlign: 'center' }}>付款設定說明</h2>
          <p style={{ color: '#666', fontSize: 18, textAlign: 'center', marginBottom: 32 }}>了解如何設定付款方式與完成訂閱</p>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#333', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>支援的付款方式</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ border: '1px solid #e0e7ff', borderRadius: 12, padding: 20 }}>
                <h4 style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>💳 Stripe</h4>
                <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>國際信用卡支付，支援 Visa、Mastercard、American Express 等主要信用卡。</p>
              </div>
              <div style={{ border: '1px solid #e0e7ff', borderRadius: 12, padding: 20 }}>
                <h4 style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🔵 PayPal</h4>
                <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>國際電子錢包，支援 PayPal 帳戶或信用卡付款。</p>
              </div>
              <div style={{ border: '1px solid #e0e7ff', borderRadius: 12, padding: 20 }}>
                <h4 style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🟢 綠界</h4>
                <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>台灣本地支付，支援信用卡、ATM 轉帳、超商付款等。</p>
              </div>
              <div style={{ border: '1px solid #e0e7ff', borderRadius: 12, padding: 20 }}>
                <h4 style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>🔵 藍新</h4>
                <p style={{ color: '#666', fontSize: 16, lineHeight: 1.6 }}>台灣本地支付，支援信用卡、ATM 轉帳、超商付款等。</p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#333', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>付款設定步驟</h3>
            <ol style={{ fontSize: 16, lineHeight: 1.8, paddingLeft: 24 }}>
              <li>選擇您想要的訂閱方案（月費或年費）</li>
              <li>選擇付款方式（Stripe、PayPal、綠界、藍新）</li>
              <li>點擊「立即升級」按鈕</li>
              <li>系統會導向對應的付款頁面</li>
              <li>完成付款後自動升級會員權益</li>
            </ol>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: '#333', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>注意事項</h3>
            <ul style={{ fontSize: 16, lineHeight: 1.8, paddingLeft: 24 }}>
              <li>付款成功後，會員權益會立即生效</li>
              <li>月費方案每月自動續費，年費方案每年自動續費</li>
              <li>可隨時在會員中心取消自動續費</li>
              <li>如有付款問題，請聯絡客服：support@restarter.com</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button onClick={() => navigate('/upgrade')} style={{ background: 'linear-gradient(90deg,#6B5BFF 60%,#23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 900, fontSize: 20, padding: '12px 48px', boxShadow: '0 2px 12px #6B5BFF33', letterSpacing: 2, cursor: 'pointer' }}>
              返回升級頁面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 