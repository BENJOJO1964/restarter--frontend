import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: '更新通知政策',
    subtitle: '關於Restarter™法律文件更新通知的說明',
    back: '返回',
    sections: {
      overview: {
        title: '1. 政策概述',
        content: '本政策說明Restarter如何通知用戶關於法律文件的更新。我們致力於保持透明度，確保用戶能夠及時了解可能影響其權利和義務的重要變更。'
      },
      types: {
        title: '2. 更新類型',
        content: '我們可能會更新以下類型的法律文件：',
        items: [
          '服務條款',
          '隱私政策',
          'Cookie政策',
          '兒童隱私政策',
          '其他法律聲明'
        ]
      },
      methods: {
        title: '3. 通知方式',
        content: '我們將通過以下方式通知用戶重要更新：',
        items: [
          '應用內通知',
          '電子郵件通知',
          '網站公告',
          '推送通知（如適用）'
        ]
      },
      timing: {
        title: '4. 通知時機',
        content: '對於重大變更，我們將在生效前至少30天通知用戶。對於緊急安全更新，我們可能會立即通知。'
      },
      review: {
        title: '5. 審查權利',
        content: '用戶有權在更新生效前審查變更內容。如果您不同意更新，您可以在生效日期前停止使用我們的服務。'
      },
      contact: {
        title: '6. 聯繫我們',
        content: '如果您對本政策或任何法律文件更新有任何疑問，請通過以下方式聯繫我們：',
        email: '郵箱：legal@restarter.com'
      }
    }
  },
  'zh-CN': {
    title: '更新通知政策',
    subtitle: '关于Restarter™法律文件更新通知的说明',
    back: '返回',
    sections: {
      overview: {
        title: '1. 政策概述',
        content: '本政策说明Restarter如何通知用户关于法律文件的更新。我们致力于保持透明度，确保用户能够及时了解可能影响其权利和义务的重要变更。'
      },
      types: {
        title: '2. 更新类型',
        content: '我们可能会更新以下类型的法律文件：',
        items: [
          '服务条款',
          '隐私政策',
          'Cookie政策',
          '儿童隐私政策',
          '其他法律声明'
        ]
      },
      methods: {
        title: '3. 通知方式',
        content: '我们将通过以下方式通知用户重要更新：',
        items: [
          '应用内通知',
          '电子邮件通知',
          '网站公告',
          '推送通知（如适用）'
        ]
      },
      timing: {
        title: '4. 通知时机',
        content: '对于重大变更，我们将在生效前至少30天通知用户。对于紧急安全更新，我们可能会立即通知。'
      },
      review: {
        title: '5. 审查权利',
        content: '用户有权在更新生效前审查变更内容。如果您不同意更新，您可以在生效日期前停止使用我们的服务。'
      },
      contact: {
        title: '6. 联系我们',
        content: '如果您对本政策或任何法律文件更新有任何疑问，请通过以下方式联系我们：',
        email: '邮箱：legal@restarter.com'
      }
    }
  },
  'en': {
    title: 'Update Notification Policy',
    subtitle: 'Explanation regarding Restarter™ legal document update notifications',
    back: 'Back',
    sections: {
      overview: {
        title: '1. Policy Overview',
        content: 'This policy explains how Restarter notifies users about updates to legal documents. We are committed to maintaining transparency and ensuring users are promptly informed of important changes that may affect their rights and obligations.'
      },
      types: {
        title: '2. Update Types',
        content: 'We may update the following types of legal documents:',
        items: [
          'Terms of Service',
          'Privacy Policy',
          'Cookie Policy',
          'Children\'s Privacy Policy',
          'Other Legal Statements'
        ]
      },
      methods: {
        title: '3. Notification Methods',
        content: 'We will notify users of important updates through the following methods:',
        items: [
          'In-app notifications',
          'Email notifications',
          'Website announcements',
          'Push notifications (where applicable)'
        ]
      },
      timing: {
        title: '4. Notification Timing',
        content: 'For significant changes, we will notify users at least 30 days before the effective date. For urgent security updates, we may notify immediately.'
      },
      review: {
        title: '5. Review Rights',
        content: 'Users have the right to review changes before they take effect. If you do not agree to the updates, you may stop using our services before the effective date.'
      },
      contact: {
        title: '6. Contact Us',
        content: 'If you have any questions about this policy or any legal document updates, please contact us through:',
        email: 'Email: legal@restarter.com'
      }
    }
  },
  'ja': {
    title: '更新通知ポリシー',
    subtitle: 'Restarter™法的文書更新通知に関する説明',
    back: '戻る',
    sections: {
      overview: {
        title: '1. ポリシー概要',
        content: 'このポリシーは、Restarterが法的文書の更新についてユーザーに通知する方法を説明しています。透明性を維持し、ユーザーの権利と義務に影響を与える可能性のある重要な変更について、ユーザーが迅速に通知されることを確保することに取り組んでいます。'
      },
      types: {
        title: '2. 更新タイプ',
        content: '以下のタイプの法的文書を更新する場合があります：',
        items: [
          '利用規約',
          'プライバシーポリシー',
          'Cookieポリシー',
          '児童プライバシーポリシー',
          'その他の法的声明'
        ]
      },
      methods: {
        title: '3. 通知方法',
        content: '重要な更新について、以下の方法でユーザーに通知します：',
        items: [
          'アプリ内通知',
          'メール通知',
          'ウェブサイト公告',
          'プッシュ通知（該当する場合）'
        ]
      },
      timing: {
        title: '4. 通知タイミング',
        content: '重要な変更については、発効日の少なくとも30日前にユーザーに通知します。緊急のセキュリティ更新については、即座に通知する場合があります。'
      },
      review: {
        title: '5. レビュー権利',
        content: 'ユーザーは、変更が発効する前に変更内容をレビューする権利があります。更新に同意しない場合は、発効日前に当社のサービスの利用を停止できます。'
      },
      contact: {
        title: '6. お問い合わせ',
        content: 'このポリシーまたは法的文書の更新についてご質問がある場合は、以下を通じてお問い合わせください：',
        email: 'メール：legal@restarter.com'
      }
    }
  },
  'ko': {
    title: '업데이트 알림 정책',
    subtitle: 'Restarter™ 법적 문서 업데이트 알림에 대한 설명',
    back: '뒤로',
    sections: {
      overview: {
        title: '1. 정책 개요',
        content: '이 정책은 Restarter가 법적 문서 업데이트에 대해 사용자에게 알리는 방법을 설명합니다. 우리는 투명성을 유지하고 사용자의 권리와 의무에 영향을 미칠 수 있는 중요한 변경사항에 대해 사용자가 즉시 알림받을 수 있도록 보장하기 위해 노력합니다.'
      },
      types: {
        title: '2. 업데이트 유형',
        content: '다음 유형의 법적 문서를 업데이트할 수 있습니다:',
        items: [
          '서비스 약관',
          '개인정보 처리방침',
          '쿠키 정책',
          '아동 개인정보 처리방침',
          '기타 법적 성명'
        ]
      },
      methods: {
        title: '3. 알림 방법',
        content: '중요한 업데이트에 대해 다음 방법으로 사용자에게 알림합니다:',
        items: [
          '앱 내 알림',
          '이메일 알림',
          '웹사이트 공지',
          '푸시 알림(해당하는 경우)'
        ]
      },
      timing: {
        title: '4. 알림 시기',
        content: '중요한 변경사항의 경우, 발효일 최소 30일 전에 사용자에게 알림합니다. 긴급 보안 업데이트의 경우 즉시 알림할 수 있습니다.'
      },
      review: {
        title: '5. 검토 권리',
        content: '사용자는 변경사항이 발효되기 전에 변경 내용을 검토할 권리가 있습니다. 업데이트에 동의하지 않는 경우 발효일 전에 서비스 이용을 중단할 수 있습니다.'
      },
      contact: {
        title: '6. 문의하기',
        content: '이 정책이나 법적 문서 업데이트에 대한 질문이 있으시면 다음을 통해 연락해 주세요:',
        email: '이메일: legal@restarter.com'
      }
    }
  },
  'th': {
    title: 'นโยบายการแจ้งเตือนการอัปเดต',
    subtitle: 'คำอธิบายเกี่ยวกับการแจ้งเตือนการอัปเดตเอกสารทางกฎหมายของ Restarter™',
    back: 'กลับ',
    sections: {
      overview: {
        title: '1. ภาพรวมนโยบาย',
        content: 'นโยบายนี้อธิบายว่า Restarter แจ้งเตือนผู้ใช้เกี่ยวกับการอัปเดตเอกสารทางกฎหมายอย่างไร เราให้คำมั่นที่จะรักษาความโปร่งใสและให้แน่ใจว่าผู้ใช้ได้รับการแจ้งเตือนอย่างรวดเร็วเกี่ยวกับการเปลี่ยนแปลงที่สำคัญที่อาจส่งผลกระทบต่อสิทธิ์และหน้าที่ของพวกเขา'
      },
      types: {
        title: '2. ประเภทการอัปเดต',
        content: 'เราอาจอัปเดตเอกสารทางกฎหมายประเภทต่อไปนี้:',
        items: [
          'ข้อกำหนดการให้บริการ',
          'นโยบายความเป็นส่วนตัว',
          'นโยบายคุกกี้',
          'นโยบายความเป็นส่วนตัวของเด็ก',
          'คำแถลงทางกฎหมายอื่นๆ'
        ]
      },
      methods: {
        title: '3. วิธีการแจ้งเตือน',
        content: 'เราจะแจ้งเตือนผู้ใช้เกี่ยวกับการอัปเดตที่สำคัญผ่านวิธีการต่อไปนี้:',
        items: [
          'การแจ้งเตือนในแอป',
          'การแจ้งเตือนทางอีเมล',
          'ประกาศบนเว็บไซต์',
          'การแจ้งเตือนแบบพุช (ในกรณีที่เหมาะสม)'
        ]
      },
      timing: {
        title: '4. เวลาการแจ้งเตือน',
        content: 'สำหรับการเปลี่ยนแปลงที่สำคัญ เราจะแจ้งเตือนผู้ใช้อย่างน้อย 30 วันก่อนวันที่มีผลบังคับใช้ สำหรับการอัปเดตความปลอดภัยที่เร่งด่วน เราอาจแจ้งเตือนทันที'
      },
      review: {
        title: '5. สิทธิในการตรวจสอบ',
        content: 'ผู้ใช้มีสิทธิ์ตรวจสอบการเปลี่ยนแปลงก่อนที่จะมีผลบังคับใช้ หากคุณไม่เห็นด้วยกับการอัปเดต คุณสามารถหยุดใช้บริการของเราได้ก่อนวันที่มีผลบังคับใช้'
      },
      contact: {
        title: '6. ติดต่อเรา',
        content: 'หากคุณมีคำถามเกี่ยวกับนโยบายนี้หรือการอัปเดตเอกสารทางกฎหมายใดๆ กรุณาติดต่อเราผ่าน:',
        email: 'อีเมล: legal@restarter.com'
      }
    }
  },
  'vi': {
    title: 'Chính sách thông báo cập nhật',
    subtitle: 'Giải thích về thông báo cập nhật tài liệu pháp lý Restarter™',
    back: 'Quay lại',
    sections: {
      overview: {
        title: '1. Tổng quan chính sách',
        content: 'Chính sách này giải thích cách Restarter thông báo cho người dùng về các cập nhật tài liệu pháp lý. Chúng tôi cam kết duy trì tính minh bạch và đảm bảo người dùng được thông báo kịp thời về những thay đổi quan trọng có thể ảnh hưởng đến quyền và nghĩa vụ của họ.'
      },
      types: {
        title: '2. Loại cập nhật',
        content: 'Chúng tôi có thể cập nhật các loại tài liệu pháp lý sau:',
        items: [
          'Điều khoản dịch vụ',
          'Chính sách bảo mật',
          'Chính sách Cookie',
          'Chính sách bảo mật trẻ em',
          'Tuyên bố pháp lý khác'
        ]
      },
      methods: {
        title: '3. Phương thức thông báo',
        content: 'Chúng tôi sẽ thông báo cho người dùng về các cập nhật quan trọng thông qua các phương thức sau:',
        items: [
          'Thông báo trong ứng dụng',
          'Thông báo qua email',
          'Thông báo trên trang web',
          'Thông báo đẩy (nếu có)'
        ]
      },
      timing: {
        title: '4. Thời gian thông báo',
        content: 'Đối với những thay đổi quan trọng, chúng tôi sẽ thông báo cho người dùng ít nhất 30 ngày trước ngày có hiệu lực. Đối với các cập nhật bảo mật khẩn cấp, chúng tôi có thể thông báo ngay lập tức.'
      },
      review: {
        title: '5. Quyền xem xét',
        content: 'Người dùng có quyền xem xét các thay đổi trước khi chúng có hiệu lực. Nếu bạn không đồng ý với các cập nhật, bạn có thể ngừng sử dụng dịch vụ của chúng tôi trước ngày có hiệu lực.'
      },
      contact: {
        title: '6. Liên hệ chúng tôi',
        content: 'Nếu bạn có bất kỳ câu hỏi nào về chính sách này hoặc bất kỳ cập nhật tài liệu pháp lý nào, vui lòng liên hệ chúng tôi qua:',
        email: 'Email: legal@restarter.com'
      }
    }
  },
  'ms': {
    title: 'Dasar Pemberitahuan Kemas Kini',
    subtitle: 'Penjelasan mengenai pemberitahuan kemas kini dokumen undang-undang Restarter™',
    back: 'Kembali',
    sections: {
      overview: {
        title: '1. Gambaran Keseluruhan Dasar',
        content: 'Dasar ini menerangkan bagaimana Restarter memberitahu pengguna tentang kemas kini dokumen undang-undang. Kami komited untuk mengekalkan ketelusan dan memastikan pengguna diberitahu dengan segera tentang perubahan penting yang mungkin menjejaskan hak dan obligasi mereka.'
      },
      types: {
        title: '2. Jenis Kemas Kini',
        content: 'Kami mungkin mengemas kini jenis dokumen undang-undang berikut:',
        items: [
          'Terma Perkhidmatan',
          'Dasar Privasi',
          'Dasar Cookie',
          'Dasar Privasi Kanak-kanak',
          'Penyata Undang-undang Lain'
        ]
      },
      methods: {
        title: '3. Kaedah Pemberitahuan',
        content: 'Kami akan memberitahu pengguna tentang kemas kini penting melalui kaedah berikut:',
        items: [
          'Pemberitahuan dalam aplikasi',
          'Pemberitahuan e-mel',
          'Pengumuman laman web',
          'Pemberitahuan push (jika berkenaan)'
        ]
      },
      timing: {
        title: '4. Masa Pemberitahuan',
        content: 'Untuk perubahan penting, kami akan memberitahu pengguna sekurang-kurangnya 30 hari sebelum tarikh berkuat kuasa. Untuk kemas kini keselamatan yang mendesak, kami mungkin memberitahu dengan segera.'
      },
      review: {
        title: '5. Hak Semakan',
        content: 'Pengguna mempunyai hak untuk menyemak perubahan sebelum ia berkuat kuasa. Jika anda tidak bersetuju dengan kemas kini, anda boleh berhenti menggunakan perkhidmatan kami sebelum tarikh berkuat kuasa.'
      },
      contact: {
        title: '6. Hubungi Kami',
        content: 'Jika anda mempunyai sebarang soalan tentang dasar ini atau sebarang kemas kini dokumen undang-undang, sila hubungi kami melalui:',
        email: 'E-mel: legal@restarter.com'
      }
    }
  },
  'la': {
    title: 'Politica Notificationis Renovationis',
    subtitle: 'Explicatio de notificationibus renovationis documentorum iuridicorum Restarter™',
    back: 'Redire',
    sections: {
      overview: {
        title: '1. Conspectus Politicae',
        content: 'Haec politica explicat quomodo Restarter notificat usuarios de renovationibus documentorum iuridicorum. Nos promittimus transparenciam conservare et usuarios prompte notificatos esse de mutationibus importantibus quae possunt afficere iura et obligationes eorum.'
      },
      types: {
        title: '2. Typi Renovationis',
        content: 'Nos possumus renovare sequentes typos documentorum iuridicorum:',
        items: [
          'Termini Servitii',
          'Politica Privatae',
          'Politica Cookie',
          'Politica Privatae Puerorum',
          'Aliae Declarationes Iuridicae'
        ]
      },
      methods: {
        title: '3. Methodi Notificationis',
        content: 'Nos notificabimus usuarios de renovationibus importantibus per sequentes methodos:',
        items: [
          'Notificationes in app',
          'Notificationes epistulae',
          'Annunciationes situs',
          'Notificationes push (ubi applicabilia)'
        ]
      },
      timing: {
        title: '4. Tempus Notificationis',
        content: 'Pro mutationibus significantibus, nos notificabimus usuarios saltem 30 dies ante diem effectivum. Pro renovationibus securitatis urgentibus, nos possumus statim notificare.'
      },
      review: {
        title: '5. Iura Revisionis',
        content: 'Usuarii habent ius revisionis mutationum antequam effectivae fiant. Si non consentis renovationibus, potes desistere uti servitiis nostris ante diem effectivum.'
      },
      contact: {
        title: '6. Contacta Nos',
        content: 'Si quaestiones habes de hac politica vel quavis renovatione documentorum iuridicorum, quaeso nos contacta per:',
        email: 'Epistula: legal@restarter.com'
      }
    }
  }
};

const UpdateNotification: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  // 修复语言切换逻辑，确保所有语言都能正确回退
  const t = TEXTS[lang as keyof typeof TEXTS] || TEXTS['zh-TW'];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto', 
        background: 'rgba(255,255,255,0.95)', 
        borderRadius: 16, 
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: '#6B5BFF',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            {t.back}
          </button>
          <h1 style={{ margin: 0, color: '#6B5BFF', fontSize: 24, fontWeight: 700 }}>{t.title}</h1>
          <div style={{ width: 80 }}></div>
        </div>

        {/* Subtitle */}
        <p style={{ 
          color: '#666', 
          fontSize: 16, 
          marginBottom: 32, 
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          {t.subtitle}
        </p>

        {/* Content */}
        <div style={{ lineHeight: 1.6 }}>
          {Object.entries(t.sections).map(([key, section]) => (
            <div key={key} style={{ marginBottom: 32 }}>
              <h2 style={{ 
                color: '#6B5BFF', 
                fontSize: 20, 
                marginBottom: 12,
                borderBottom: '2px solid #6B5BFF',
                paddingBottom: 8
              }}>
                {section.title}
              </h2>
              <p style={{ 
                color: '#333', 
                fontSize: 16,
                textAlign: 'justify'
              }}>
                {section.content}
              </p>
              {section.items && (
                <ul style={{ 
                  color: '#333', 
                  fontSize: 16,
                  paddingLeft: 20,
                  marginTop: 8
                }}>
                  {section.items.map((item, index) => (
                    <li key={index} style={{ marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              )}
              {section.email && (
                <p style={{ 
                  color: '#6B5BFF', 
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 8
                }}>
                  {section.email}
                </p>
              )}
              {section.phone && (
                <p style={{ 
                  color: '#6B5BFF', 
                  fontSize: 16,
                  fontWeight: 600,
                  marginTop: 4
                }}>
                  {section.phone}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default UpdateNotification;
