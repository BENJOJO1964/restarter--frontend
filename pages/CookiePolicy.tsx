import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: 'Cookie政策',
    subtitle: '關於Restarter™使用Cookie的說明',
    back: '返回',
    sections: {
      intro: {
        title: '什麼是Cookie',
        content: 'Cookie是存儲在您設備上的小型文本文件，用於改善您的瀏覽體驗。當您訪問我們的網站時，我們可能會在您的設備上放置Cookie。'
      },
      purpose: {
        title: 'Cookie的用途',
        content: '我們使用Cookie來：記住您的偏好設置、分析網站使用情況、提供個性化內容、改善網站性能、確保安全性。'
      },
      types: {
        title: 'Cookie類型',
        content: '我們使用以下類型的Cookie：必要Cookie（網站基本功能）、性能Cookie（分析使用情況）、功能Cookie（記住偏好）、廣告Cookie（個性化內容）。'
      },
      control: {
        title: '控制Cookie',
        content: '您可以通過瀏覽器設置控制Cookie。大多數瀏覽器允許您阻止或刪除Cookie，但這可能影響網站功能。'
      },
      thirdParty: {
        title: '第三方Cookie',
        content: '我們可能使用第三方服務，如分析工具，這些服務可能會設置自己的Cookie。我們無法控制這些第三方Cookie。'
      },
      updates: {
        title: '政策更新',
        content: '我們可能會更新此Cookie政策。重要變更會通過網站通知或電子郵件告知用戶。'
      }
    }
  },
  'zh-CN': {
    title: 'Cookie政策',
    subtitle: '关于Restarter™使用Cookie的说明',
    back: '返回',
    sections: {
      intro: {
        title: '什么是Cookie',
        content: 'Cookie是存储在您设备上的小型文本文件，用于改善您的浏览体验。当您访问我们的网站时，我们可能会在您的设备上放置Cookie。'
      },
      purpose: {
        title: 'Cookie的用途',
        content: '我们使用Cookie来：记住您的偏好设置、分析网站使用情况、提供个性化内容、改善网站性能、确保安全性。'
      },
      types: {
        title: 'Cookie类型',
        content: '我们使用以下类型的Cookie：必要Cookie（网站基本功能）、性能Cookie（分析使用情况）、功能Cookie（记住偏好）、广告Cookie（个性化内容）。'
      },
      control: {
        title: '控制Cookie',
        content: '您可以通过浏览器设置控制Cookie。大多数浏览器允许您阻止或删除Cookie，但这可能影响网站功能。'
      },
      thirdParty: {
        title: '第三方Cookie',
        content: '我们可能使用第三方服务，如分析工具，这些服务可能会设置自己的Cookie。我们无法控制这些第三方Cookie。'
      },
      updates: {
        title: '政策更新',
        content: '我们可能会更新此Cookie政策。重要变更会通过网站通知或电子邮件告知用户。'
      }
    }
  },
  'en': {
    title: 'Cookie Policy',
    subtitle: 'Information about Cookie usage in Restarter™',
    back: 'Back',
    sections: {
      intro: {
        title: 'What are Cookies',
        content: 'Cookies are small text files stored on your device to improve your browsing experience. When you visit our website, we may place cookies on your device.'
      },
      purpose: {
        title: 'Purpose of Cookies',
        content: 'We use cookies to: remember your preferences, analyze website usage, provide personalized content, improve website performance, ensure security.'
      },
      types: {
        title: 'Types of Cookies',
        content: 'We use the following types of cookies: essential cookies (basic website functions), performance cookies (usage analytics), functional cookies (preference memory), advertising cookies (personalized content).'
      },
      control: {
        title: 'Controlling Cookies',
        content: 'You can control cookies through browser settings. Most browsers allow you to block or delete cookies, but this may affect website functionality.'
      },
      thirdParty: {
        title: 'Third-party Cookies',
        content: 'We may use third-party services such as analytics tools that may set their own cookies. We cannot control these third-party cookies.'
      },
      updates: {
        title: 'Policy Updates',
        content: 'We may update this Cookie Policy. Important changes will be notified to users through website notifications or email.'
      }
    }
  },
  'ja': {
    title: 'Cookieポリシー',
    subtitle: 'Restarter™でのCookie使用に関する説明',
    back: '戻る',
    sections: {
      intro: {
        title: 'Cookieとは',
        content: 'Cookieは、ブラウジング体験を向上させるためにデバイスに保存される小さなテキストファイルです。当サイトを訪問する際、デバイスにCookieを配置する場合があります。'
      },
      purpose: {
        title: 'Cookieの目的',
        content: 'Cookieは以下の目的で使用されます：設定の記憶、ウェブサイト使用状況の分析、パーソナライズされたコンテンツの提供、ウェブサイトパフォーマンスの向上、セキュリティの確保。'
      },
      types: {
        title: 'Cookieの種類',
        content: '以下の種類のCookieを使用します：必須Cookie（基本的なウェブサイト機能）、パフォーマンスCookie（使用状況分析）、機能Cookie（設定の記憶）、広告Cookie（パーソナライズされたコンテンツ）。'
      },
      control: {
        title: 'Cookieの制御',
        content: 'ブラウザ設定でCookieを制御できます。ほとんどのブラウザでCookieのブロックや削除が可能ですが、ウェブサイトの機能に影響する場合があります。'
      },
      thirdParty: {
        title: '第三者Cookie',
        content: '分析ツールなどの第三者サービスを使用する場合があり、それらが独自のCookieを設定する可能性があります。これらの第三者Cookieは制御できません。'
      },
      updates: {
        title: 'ポリシーの更新',
        content: 'このCookieポリシーを更新する場合があります。重要な変更はウェブサイト通知またはメールでユーザーに通知されます。'
      }
    }
  },
  'ko': {
    title: '쿠키 정책',
    subtitle: 'Restarter™에서 쿠키 사용에 대한 설명',
    back: '뒤로',
    sections: {
      intro: {
        title: '쿠키란',
        content: '쿠키는 브라우징 경험을 향상시키기 위해 기기에 저장되는 작은 텍스트 파일입니다. 당사 웹사이트를 방문할 때 기기에 쿠키를 배치할 수 있습니다.'
      },
      purpose: {
        title: '쿠키의 목적',
        content: '쿠키는 다음 목적으로 사용됩니다: 설정 기억, 웹사이트 사용 분석, 개인화된 콘텐츠 제공, 웹사이트 성능 향상, 보안 보장.'
      },
      types: {
        title: '쿠키 유형',
        content: '다음 유형의 쿠키를 사용합니다: 필수 쿠키(기본 웹사이트 기능), 성능 쿠키(사용 분석), 기능 쿠키(설정 기억), 광고 쿠키(개인화된 콘텐츠).'
      },
      control: {
        title: '쿠키 제어',
        content: '브라우저 설정을 통해 쿠키를 제어할 수 있습니다. 대부분의 브라우저에서 쿠키를 차단하거나 삭제할 수 있지만 웹사이트 기능에 영향을 줄 수 있습니다.'
      },
      thirdParty: {
        title: '제3자 쿠키',
        content: '분석 도구와 같은 제3자 서비스를 사용할 수 있으며, 이들이 자체 쿠키를 설정할 수 있습니다. 이러한 제3자 쿠키는 제어할 수 없습니다.'
      },
      updates: {
        title: '정책 업데이트',
        content: '이 쿠키 정책을 업데이트할 수 있습니다. 중요한 변경사항은 웹사이트 알림 또는 이메일로 사용자에게 알려집니다.'
      }
    }
  },
  'th': {
    title: 'นโยบายคุกกี้',
    subtitle: 'ข้อมูลเกี่ยวกับการใช้คุกกี้ใน Restarter™',
    back: 'กลับ',
    sections: {
      intro: {
        title: 'คุกกี้คืออะไร',
        content: 'คุกกี้เป็นไฟล์ข้อความขนาดเล็กที่เก็บไว้ในอุปกรณ์ของคุณเพื่อปรับปรุงประสบการณ์การท่องเว็บ เมื่อคุณเยี่ยมชมเว็บไซต์ของเรา เราอาจวางคุกกี้ในอุปกรณ์ของคุณ'
      },
      purpose: {
        title: 'วัตถุประสงค์ของคุกกี้',
        content: 'เราใช้คุกกี้เพื่อ: จำการตั้งค่าของคุณ วิเคราะห์การใช้เว็บไซต์ ให้เนื้อหาส่วนบุคคล ปรับปรุงประสิทธิภาพเว็บไซต์ รับประกันความปลอดภัย'
      },
      types: {
        title: 'ประเภทของคุกกี้',
        content: 'เราใช้คุกกี้ประเภทต่อไปนี้: คุกกี้ที่จำเป็น (ฟังก์ชันพื้นฐานของเว็บไซต์) คุกกี้ประสิทธิภาพ (การวิเคราะห์การใช้งาน) คุกกี้ฟังก์ชัน (จำการตั้งค่า) คุกกี้โฆษณา (เนื้อหาส่วนบุคคล)'
      },
      control: {
        title: 'การควบคุมคุกกี้',
        content: 'คุณสามารถควบคุมคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ เบราว์เซอร์ส่วนใหญ่อนุญาตให้คุณบล็อกหรือลบคุกกี้ได้ แต่อาจส่งผลต่อฟังก์ชันของเว็บไซต์'
      },
      thirdParty: {
        title: 'คุกกี้ของบุคคลที่สาม',
        content: 'เราอาจใช้บริการของบุคคลที่สาม เช่น เครื่องมือวิเคราะห์ ที่อาจตั้งค่าคุกกี้ของตัวเอง เราไม่สามารถควบคุมคุกกี้ของบุคคลที่สามเหล่านี้ได้'
      },
      updates: {
        title: 'การอัปเดตนโยบาย',
        content: 'เราอาจอัปเดตนโยบายคุกกี้นี้ การเปลี่ยนแปลงที่สำคัญจะแจ้งให้ผู้ใช้ทราบผ่านการแจ้งเตือนเว็บไซต์หรืออีเมล'
      }
    }
  },
  'vi': {
    title: 'Chính sách Cookie',
    subtitle: 'Thông tin về việc sử dụng Cookie trong Restarter™',
    back: 'Quay lại',
    sections: {
      intro: {
        title: 'Cookie là gì',
        content: 'Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn để cải thiện trải nghiệm duyệt web. Khi bạn truy cập trang web của chúng tôi, chúng tôi có thể đặt cookie trên thiết bị của bạn.'
      },
      purpose: {
        title: 'Mục đích của Cookie',
        content: 'Chúng tôi sử dụng cookie để: ghi nhớ tùy chọn của bạn, phân tích việc sử dụng trang web, cung cấp nội dung cá nhân hóa, cải thiện hiệu suất trang web, đảm bảo bảo mật.'
      },
      types: {
        title: 'Các loại Cookie',
        content: 'Chúng tôi sử dụng các loại cookie sau: cookie cần thiết (chức năng cơ bản của trang web), cookie hiệu suất (phân tích sử dụng), cookie chức năng (ghi nhớ tùy chọn), cookie quảng cáo (nội dung cá nhân hóa).'
      },
      control: {
        title: 'Kiểm soát Cookie',
        content: 'Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Hầu hết các trình duyệt cho phép bạn chặn hoặc xóa cookie, nhưng điều này có thể ảnh hưởng đến chức năng trang web.'
      },
      thirdParty: {
        title: 'Cookie của bên thứ ba',
        content: 'Chúng tôi có thể sử dụng các dịch vụ bên thứ ba như công cụ phân tích có thể đặt cookie riêng của họ. Chúng tôi không thể kiểm soát các cookie bên thứ ba này.'
      },
      updates: {
        title: 'Cập nhật chính sách',
        content: 'Chúng tôi có thể cập nhật chính sách Cookie này. Những thay đổi quan trọng sẽ được thông báo cho người dùng thông qua thông báo trang web hoặc email.'
      }
    }
  },
  'ms': {
    title: 'Dasar Cookie',
    subtitle: 'Maklumat tentang penggunaan Cookie dalam Restarter™',
    back: 'Kembali',
    sections: {
      intro: {
        title: 'Apa itu Cookie',
        content: 'Cookie adalah fail teks kecil yang disimpan pada peranti anda untuk meningkatkan pengalaman melayari. Apabila anda melawat laman web kami, kami mungkin meletakkan cookie pada peranti anda.'
      },
      purpose: {
        title: 'Tujuan Cookie',
        content: 'Kami menggunakan cookie untuk: mengingati pilihan anda, menganalisis penggunaan laman web, menyediakan kandungan peribadi, meningkatkan prestasi laman web, memastikan keselamatan.'
      },
      types: {
        title: 'Jenis Cookie',
        content: 'Kami menggunakan jenis cookie berikut: cookie penting (fungsi asas laman web), cookie prestasi (analisis penggunaan), cookie fungsi (ingatan pilihan), cookie iklan (kandungan peribadi).'
      },
      control: {
        title: 'Mengawal Cookie',
        content: 'Anda boleh mengawal cookie melalui tetapan pelayar. Kebanyakan pelayar membolehkan anda menyekat atau memadamkan cookie, tetapi ini mungkin menjejaskan fungsi laman web.'
      },
      thirdParty: {
        title: 'Cookie Pihak Ketiga',
        content: 'Kami mungkin menggunakan perkhidmatan pihak ketiga seperti alat analisis yang mungkin menetapkan cookie sendiri. Kami tidak boleh mengawal cookie pihak ketiga ini.'
      },
      updates: {
        title: 'Kemas Kini Dasar',
        content: 'Kami mungkin mengemas kini Dasar Cookie ini. Perubahan penting akan diberitahu kepada pengguna melalui pemberitahuan laman web atau e-mel.'
      }
    }
  },
  'la': {
    title: 'Politica Cookie',
    subtitle: 'Informatio de usu Cookie in Restarter™',
    back: 'Redire',
    sections: {
      intro: {
        title: 'Quid sunt Cookie',
        content: 'Cookie sunt parva texta documenta in tuo apparatu reposita ad meliorandum navigationis experientiam. Cum nostrum situm visitas, possumus cookie in tuo apparatu ponere.'
      },
      purpose: {
        title: 'Propositum Cookie',
        content: 'Utimur cookie ad: meminisse electiones tuas, analysare usum situs, praebere contentum personalizatum, meliorare efficacitatem situs, securitatem praestare.'
      },
      types: {
        title: 'Typi Cookie',
        content: 'Utimur sequentibus typis cookie: cookie essentiales (functiones basici situs), cookie efficacitatis (analysis usus), cookie functionales (memoria electionum), cookie publicitatis (contentum personalizatum).'
      },
      control: {
        title: 'Controllare Cookie',
        content: 'Potes controllare cookie per configurationes navigatoris. Plurimi navigatores permittunt te prohibere vel delere cookie, sed hoc potest afficere functiones situs.'
      },
      thirdParty: {
        title: 'Cookie Tertii Partis',
        content: 'Possumus uti servitiis tertii partis sicut instrumenta analysi quae possunt ponere sua propria cookie. Non possumus controllare haec cookie tertii partis.'
      },
      updates: {
        title: 'Renovationes Politicae',
        content: 'Possumus renovare hanc Politicam Cookie. Mutationes importantes notificabuntur usuariis per notificationes situs vel email.'
      }
    }
  }
};

export default function CookiePolicy() {
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
