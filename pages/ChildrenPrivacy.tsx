import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: '兒童隱私保護',
    subtitle: '關於Restarter™對兒童隱私的保護措施',
    back: '返回',
    sections: {
      intro: {
        title: '兒童隱私保護聲明',
        content: 'Restarter™重視兒童隱私保護，嚴格遵守相關法律法規。我們不會故意收集13歲以下兒童的個人信息，除非獲得家長或監護人的明確同意。'
      },
      ageLimit: {
        title: '年齡限制',
        content: '我們的服務主要面向13歲以上的用戶。13歲以下兒童如需使用服務，必須在家長或監護人的監督下進行。'
      },
      parentalConsent: {
        title: '家長同意',
        content: '如果我們發現收集了13歲以下兒童的信息，會立即刪除相關數據並通知家長。家長有權要求查看、修改或刪除子女的個人信息。'
      },
      dataProtection: {
        title: '數據保護',
        content: '我們對兒童數據實施額外的保護措施，包括加密存儲、訪問限制、定期審查等，確保兒童隱私安全。'
      },
      contact: {
        title: '聯繫我們',
        content: '如果您對兒童隱私保護有任何疑問，請通過應用程式內的意見箱與我們聯繫。我們會認真處理每一項相關請求。'
      }
    }
  },
  'zh-CN': {
    title: '儿童隐私保护',
    subtitle: '关于Restarter™对儿童隐私的保护措施',
    back: '返回',
    sections: {
      intro: {
        title: '儿童隐私保护声明',
        content: 'Restarter™重视儿童隐私保护，严格遵守相关法律法规。我们不会故意收集13岁以下儿童的个人信息，除非获得家长或监护人的明确同意。'
      },
      ageLimit: {
        title: '年龄限制',
        content: '我们的服务主要面向13岁以上的用户。13岁以下儿童如需使用服务，必须在家长或监护人的监督下进行。'
      },
      parentalConsent: {
        title: '家长同意',
        content: '如果我们发现收集了13岁以下儿童的信息，会立即删除相关数据并通知家长。家长有权要求查看、修改或删除子女的个人信息。'
      },
      dataProtection: {
        title: '数据保护',
        content: '我们对儿童数据实施额外的保护措施，包括加密存储、访问限制、定期审查等，确保儿童隐私安全。'
      },
      contact: {
        title: '联系我们',
        content: '如果您对儿童隐私保护有任何疑问，请通过应用程序内的意见箱与我们联系。我们会认真处理每一项相关请求。'
      }
    }
  },
  'en': {
    title: 'Children\'s Privacy',
    subtitle: 'Restarter™ protection measures for children\'s privacy',
    back: 'Back',
    sections: {
      intro: {
        title: 'Children\'s Privacy Statement',
        content: 'Restarter™ values children\'s privacy protection and strictly complies with relevant laws and regulations. We do not knowingly collect personal information from children under 13 unless we obtain explicit consent from parents or guardians.'
      },
      ageLimit: {
        title: 'Age Restrictions',
        content: 'Our services are primarily intended for users aged 13 and above. Children under 13 must use our services under parental or guardian supervision.'
      },
      parentalConsent: {
        title: 'Parental Consent',
        content: 'If we discover that we have collected information from children under 13, we will immediately delete the relevant data and notify parents. Parents have the right to request to view, modify, or delete their children\'s personal information.'
      },
      dataProtection: {
        title: 'Data Protection',
        content: 'We implement additional protection measures for children\'s data, including encrypted storage, access restrictions, regular reviews, etc., to ensure children\'s privacy security.'
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions about children\'s privacy protection, please contact us through the feedback box in the app. We will seriously handle every related request.'
      }
    }
  },
  'ja': {
    title: '児童プライバシー保護',
    subtitle: 'Restarter™の児童プライバシー保護措置について',
    back: '戻る',
    sections: {
      intro: {
        title: '児童プライバシー保護声明',
        content: 'Restarter™は児童のプライバシー保護を重視し、関連する法律・規制を厳格に遵守しています。保護者または後見人の明確な同意がない限り、13歳未満の児童の個人情報を故意に収集することはありません。'
      },
      ageLimit: {
        title: '年齢制限',
        content: '当社のサービスは主に13歳以上のユーザーを対象としています。13歳未満の児童がサービスを使用する場合は、保護者または後見人の監督下で行う必要があります。'
      },
      parentalConsent: {
        title: '保護者の同意',
        content: '13歳未満の児童からの情報収集を発見した場合、関連データを即座に削除し保護者に通知します。保護者は子供の個人情報の閲覧、修正、削除を要求する権利があります。'
      },
      dataProtection: {
        title: 'データ保護',
        content: '児童データに対して暗号化保存、アクセス制限、定期レビューなどの追加保護措置を実施し、児童のプライバシーセキュリティを確保します。'
      },
      contact: {
        title: 'お問い合わせ',
        content: '児童プライバシー保護についてご質問がございましたら、アプリ内のフィードバックボックスを通じてお問い合わせください。すべての関連リクエストを真摯に処理いたします。'
      }
    }
  },
  'ko': {
    title: '아동 개인정보 보호',
    subtitle: 'Restarter™의 아동 개인정보 보호 조치에 대해',
    back: '뒤로',
    sections: {
      intro: {
        title: '아동 개인정보 보호 성명',
        content: 'Restarter™는 아동 개인정보 보호를 중시하며 관련 법률 및 규정을 엄격히 준수합니다. 부모 또는 보호자의 명시적 동의가 없는 한 13세 미만 아동의 개인정보를 고의로 수집하지 않습니다.'
      },
      ageLimit: {
        title: '연령 제한',
        content: '당사의 서비스는 주로 13세 이상 사용자를 대상으로 합니다. 13세 미만 아동이 서비스를 사용하려면 부모 또는 보호자의 감독 하에 이루어져야 합니다.'
      },
      parentalConsent: {
        title: '부모 동의',
        content: '13세 미만 아동으로부터 정보 수집을 발견한 경우 관련 데이터를 즉시 삭제하고 부모에게 알립니다. 부모는 자녀의 개인정보 조회, 수정, 삭제를 요청할 권리가 있습니다.'
      },
      dataProtection: {
        title: '데이터 보호',
        content: '아동 데이터에 대해 암호화 저장, 접근 제한, 정기 검토 등의 추가 보호 조치를 시행하여 아동의 개인정보 보안을 보장합니다.'
      },
      contact: {
        title: '연락처',
        content: '아동 개인정보 보호에 대한 질문이 있으시면 앱 내 피드백 상자를 통해 문의해 주세요. 모든 관련 요청을 진지하게 처리하겠습니다.'
      }
    }
  },
  'th': {
    title: 'การคุ้มครองความเป็นส่วนตัวของเด็ก',
    subtitle: 'มาตรการคุ้มครองความเป็นส่วนตัวของเด็กของ Restarter™',
    back: 'กลับ',
    sections: {
      intro: {
        title: 'คำแถลงการคุ้มครองความเป็นส่วนตัวของเด็ก',
        content: 'Restarter™ ให้ความสำคัญกับการคุ้มครองความเป็นส่วนตัวของเด็กและปฏิบัติตามกฎหมายและระเบียบที่เกี่ยวข้องอย่างเคร่งครัด เราไม่เก็บรวบรวมข้อมูลส่วนบุคคลของเด็กอายุต่ำกว่า 13 ปีโดยเจตนา เว้นแต่จะได้รับความยินยอมอย่างชัดเจนจากผู้ปกครองหรือผู้ดูแล'
      },
      ageLimit: {
        title: 'ข้อจำกัดอายุ',
        content: 'บริการของเรามุ่งเน้นไปที่ผู้ใช้อายุ 13 ปีขึ้นไป เด็กอายุต่ำกว่า 13 ปีต้องใช้บริการภายใต้การดูแลของผู้ปกครองหรือผู้ดูแล'
      },
      parentalConsent: {
        title: 'ความยินยอมของผู้ปกครอง',
        content: 'หากเราพบว่าเราได้เก็บรวบรวมข้อมูลจากเด็กอายุต่ำกว่า 13 ปี เราจะลบข้อมูลที่เกี่ยวข้องทันทีและแจ้งให้ผู้ปกครองทราบ ผู้ปกครองมีสิทธิ์ขอดู แก้ไข หรือลบข้อมูลส่วนบุคคลของบุตรหลาน'
      },
      dataProtection: {
        title: 'การคุ้มครองข้อมูล',
        content: 'เราใช้มาตรการคุ้มครองเพิ่มเติมสำหรับข้อมูลของเด็ก รวมถึงการเข้ารหัสการจัดเก็บ การจำกัดการเข้าถึง การตรวจสอบเป็นประจำ เป็นต้น เพื่อรับประกันความปลอดภัยของความเป็นส่วนตัวของเด็ก'
      },
      contact: {
        title: 'ติดต่อเรา',
        content: 'หากคุณมีคำถามเกี่ยวกับการคุ้มครองความเป็นส่วนตัวของเด็ก กรุณาติดต่อเราผ่านกล่องข้อเสนอแนะในแอป เราจะจัดการทุกคำขอที่เกี่ยวข้องอย่างจริงจัง'
      }
    }
  },
  'vi': {
    title: 'Bảo vệ quyền riêng tư trẻ em',
    subtitle: 'Các biện pháp bảo vệ quyền riêng tư trẻ em của Restarter™',
    back: 'Quay lại',
    sections: {
      intro: {
        title: 'Tuyên bố bảo vệ quyền riêng tư trẻ em',
        content: 'Restarter™ coi trọng việc bảo vệ quyền riêng tư trẻ em và tuân thủ nghiêm ngặt các luật pháp và quy định liên quan. Chúng tôi không cố ý thu thập thông tin cá nhân của trẻ em dưới 13 tuổi trừ khi có sự đồng ý rõ ràng từ cha mẹ hoặc người giám hộ.'
      },
      ageLimit: {
        title: 'Hạn chế độ tuổi',
        content: 'Dịch vụ của chúng tôi chủ yếu dành cho người dùng từ 13 tuổi trở lên. Trẻ em dưới 13 tuổi phải sử dụng dịch vụ dưới sự giám sát của cha mẹ hoặc người giám hộ.'
      },
      parentalConsent: {
        title: 'Sự đồng ý của cha mẹ',
        content: 'Nếu chúng tôi phát hiện đã thu thập thông tin từ trẻ em dưới 13 tuổi, chúng tôi sẽ ngay lập tức xóa dữ liệu liên quan và thông báo cho cha mẹ. Cha mẹ có quyền yêu cầu xem, sửa đổi hoặc xóa thông tin cá nhân của con cái.'
      },
      dataProtection: {
        title: 'Bảo vệ dữ liệu',
        content: 'Chúng tôi thực hiện các biện pháp bảo vệ bổ sung cho dữ liệu trẻ em, bao gồm lưu trữ mã hóa, hạn chế truy cập, đánh giá định kỳ, v.v., để đảm bảo an toàn quyền riêng tư trẻ em.'
      },
      contact: {
        title: 'Liên hệ chúng tôi',
        content: 'Nếu bạn có bất kỳ câu hỏi nào về bảo vệ quyền riêng tư trẻ em, vui lòng liên hệ với chúng tôi thông qua hộp phản hồi trong ứng dụng. Chúng tôi sẽ xử lý nghiêm túc mọi yêu cầu liên quan.'
      }
    }
  },
  'ms': {
    title: 'Privasi Kanak-kanak',
    subtitle: 'Langkah-langkah perlindungan privasi kanak-kanak Restarter™',
    back: 'Kembali',
    sections: {
      intro: {
        title: 'Penyata Privasi Kanak-kanak',
        content: 'Restarter™ menghargai perlindungan privasi kanak-kanak dan mematuhi undang-undang dan peraturan yang berkaitan dengan ketat. Kami tidak sengaja mengumpul maklumat peribadi kanak-kanak di bawah umur 13 tahun melainkan kami memperoleh persetujuan yang jelas daripada ibu bapa atau penjaga.'
      },
      ageLimit: {
        title: 'Sekatan Umur',
        content: 'Perkhidmatan kami terutamanya bertujuan untuk pengguna berumur 13 tahun ke atas. Kanak-kanak di bawah umur 13 tahun mesti menggunakan perkhidmatan kami di bawah penyeliaan ibu bapa atau penjaga.'
      },
      parentalConsent: {
        title: 'Persetujuan Ibu Bapa',
        content: 'Jika kami mendapati bahawa kami telah mengumpul maklumat daripada kanak-kanak di bawah umur 13 tahun, kami akan segera memadamkan data yang berkaitan dan memberitahu ibu bapa. Ibu bapa mempunyai hak untuk meminta melihat, mengubah suai, atau memadamkan maklumat peribadi anak-anak mereka.'
      },
      dataProtection: {
        title: 'Perlindungan Data',
        content: 'Kami melaksanakan langkah-langkah perlindungan tambahan untuk data kanak-kanak, termasuk penyimpanan terenkripsi, sekatan akses, ulasan berkala, dll., untuk memastikan keselamatan privasi kanak-kanak.'
      },
      contact: {
        title: 'Hubungi Kami',
        content: 'Jika anda mempunyai sebarang soalan tentang perlindungan privasi kanak-kanak, sila hubungi kami melalui kotak maklum balas dalam aplikasi. Kami akan menangani setiap permintaan yang berkaitan dengan serius.'
      }
    }
  },
  'la': {
    title: 'Privata Puerorum',
    subtitle: 'Restarter™ mensurae protectionis privatae puerorum',
    back: 'Redire',
    sections: {
      intro: {
        title: 'Declaratio Privatae Puerorum',
        content: 'Restarter™ aestimat protectionem privatae puerorum et stricte observat leges et regulas pertinentes. Non scienter colligimus informationem personalem puerorum sub annis 13 nisi obtinemus consensum explicitum a parentibus vel tutoribus.'
      },
      ageLimit: {
        title: 'Limitationes Aetatis',
        content: 'Servitia nostra principaliter intenduntur pro usuariis annorum 13 et supra. Pueri sub annis 13 debent uti servitiis nostris sub supervisione parentum vel tutorum.'
      },
      parentalConsent: {
        title: 'Consensus Parentum',
        content: 'Si invenimus nos collegisse informationem a pueris sub annis 13, statim delere data relata et notificare parentes. Parentes habent ius petendi videre, mutare, vel delere informationem personalem filiorum suorum.'
      },
      dataProtection: {
        title: 'Protectio Datorum',
        content: 'Implementamus mensuras protectionis additas pro datis puerorum, includentes repositorium encryptatum, limitationes accessus, revisiones regulares, etc., ad praestandum securitatem privatae puerorum.'
      },
      contact: {
        title: 'Contacta Nos',
        content: 'Si habes quaestiones de protectione privatae puerorum, quaeso contacta nos per cistam feedback in app. Tractabimus omnem petitionem relatum serio.'
      }
    }
  }
};

export default function ChildrenPrivacy() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['zh-TW'];

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
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
