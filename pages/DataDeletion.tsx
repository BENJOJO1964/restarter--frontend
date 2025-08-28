import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const FOOTER_TEXT = {
  'zh-TW': { privacy: '隱私權政策', deletion: '資料刪除說明' },
  'zh-CN': { privacy: '隐私政策', deletion: '资料删除说明' },
  'en': { privacy: 'Privacy Policy', deletion: 'Data Deletion' },
  'ja': { privacy: 'プライバシーポリシー', deletion: 'データ削除について' },
  'ko': { privacy: '개인정보처리방침', deletion: '데이터 삭제 안내' },
  'th': { privacy: 'นโยบายความเป็นส่วนตัว', deletion: 'นโยบายการลบข้อมูล' },
  'vi': { privacy: 'Chính sách bảo mật', deletion: 'Chính sách xóa dữ liệu' },
  'ms': { privacy: 'Dasar Privasi', deletion: 'Dasar Pemadaman Data' },
  'la': { privacy: 'Consilium Privacy', deletion: 'Norma Deletionis Datae' },
};

const CONTENT = {
  'zh-TW': (
    <div>
      <h1>資料刪除說明</h1>
      <p>若您希望刪除在 Restarter App 中儲存的個人資料，請來信至：</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>我們會在 3-5 個工作天內完成資料刪除作業。</p>
    </div>
  ),
  'zh-CN': (
    <div>
      <h1>资料删除说明</h1>
      <p>如需删除在 Restarter App 中存储的个人资料，请发送邮件至：</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>我们将在 3-5 个工作日内完成资料删除。</p>
    </div>
  ),
  'en': (
    <div>
      <h1>Data Deletion Policy</h1>
      <p>If you wish to delete your personal data stored in the Restarter App, please contact:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>We will complete the deletion process within 3-5 business days.</p>
    </div>
  ),
  'ja': (
    <div>
      <h1>データ削除のご案内</h1>
      <p>Restarterアプリに保存されている個人データの削除をご希望の場合は、以下までご連絡ください：</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>3～5営業日以内に削除手続きを完了します。</p>
    </div>
  ),
  'ko': (
    <div>
      <h1>데이터 삭제 안내</h1>
      <p>Restarter 앱에 저장된 개인 데이터를 삭제하려면 다음으로 문의해 주세요:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>3~5 영업일 이내에 삭제를 완료해 드립니다.</p>
    </div>
  ),
  'th': (
    <div>
      <h1>นโยบายการลบข้อมูล</h1>
      <p>หากคุณต้องการลบข้อมูลส่วนบุคคลที่จัดเก็บในแอป Restarter กรุณาติดต่อ:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>เราจะดำเนินการลบข้อมูลภายใน 3-5 วันทำการ</p>
    </div>
  ),
  'vi': (
    <div>
      <h1>Chính sách xóa dữ liệu</h1>
      <p>Nếu bạn muốn xóa dữ liệu cá nhân được lưu trữ trong ứng dụng Restarter, vui lòng liên hệ:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>Chúng tôi sẽ hoàn tất việc xóa dữ liệu trong vòng 3-5 ngày làm việc.</p>
    </div>
  ),
  'ms': (
    <div>
      <h1>Dasar Pemadaman Data</h1>
      <p>Jika anda ingin memadam data peribadi yang disimpan dalam Aplikasi Restarter, sila hubungi:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>Kami akan menyelesaikan proses pemadaman dalam masa 3-5 hari bekerja.</p>
    </div>
  ),
  'la': (
    <div>
      <h1>Norma Deletionis Datae</h1>
      <p>Si vis delere data personalia in Restarter App reposita, quaeso contactum:</p>
      <p><strong>rbben521@gmail.com</strong></p>
      <p>Processum deletionis intra 3-5 dies negotiales perficimus.</p>
    </div>
  ),
};

const BACK_TEXT = {
  'zh-TW': '返回',
  'zh-CN': '返回',
  'en': 'Back',
  'ja': '戻る',
  'ko': '뒤로',
  'th': 'กลับ',
  'vi': 'Quay lại',
  'ms': 'Kembali',
  'la': 'Revertere',
};

export default function DataDeletion() {
  const lang = localStorage.getItem('lang') || 'zh-TW';
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      {/* 左上角返回按鈕（多語言） */}
      <button
        onClick={() => navigate('/', { replace: true })}
        style={{ position: 'absolute', top: 32, left: 36, zIndex: 10, backgroundColor: '#374151', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: 16 }}>
        &larr; {BACK_TEXT[lang] || '返回'}
      </button>
      <div style={{ flex: '1 0 auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', color: '#111', borderRadius: 16, padding: 32, position: 'relative' }}>
          {CONTENT[lang] || CONTENT['zh-TW']}
          <div style={{ textAlign: 'center', marginTop: 48, color: '#888', fontSize: 16 }}>
            CTX Goodlife Copyright 2025
          </div>
        </div>
      </div>
      {/* Footer 5個按鈕 - 一行排列 */}
      <div style={{ 
        width: '100%', 
        margin: '0 auto', 
        marginTop: 24,
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 2px 12px #6B5BFF22'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <span onClick={() => navigate('/privacy-policy')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>隱私權政策</span>
          <span onClick={() => navigate('/terms')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>條款/聲明</span>
          <span onClick={() => navigate('/data-deletion')} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>資料刪除說明</span>
          <span onClick={() => navigate('/about')} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>🧬 Restarter™｜我們是誰</span>
          <span onClick={() => navigate('/feedback')} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>💬 意見箱｜我們想聽你說</span>
        </div>
      </div>
    </div>
  );
} 