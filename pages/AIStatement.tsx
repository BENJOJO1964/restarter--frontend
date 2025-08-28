import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: 'AI使用聲明',
    subtitle: '關於Restarter™中AI功能的使用說明',
    back: '返回',
    logout: '登出',
    sections: {
      intro: {
        title: '引言',
        content: 'Restarter™使用人工智能技術來提供個性化的心理健康支援服務。本聲明旨在向您說明我們如何使用AI技術，以及您在使用這些功能時的權利和責任。'
      },
      aiFeatures: {
        title: 'AI功能說明',
        content: '我們的AI功能包括：智能對話、情緒分析、個性化建議、內容生成等。這些功能旨在提供輔助性的心理健康支援，而非替代專業醫療服務。'
      },
      dataUsage: {
        title: '數據使用',
        content: '為了提供更好的AI服務，我們可能會收集和分析您與AI的互動數據。所有數據都經過加密處理，並嚴格遵守隱私保護規定。'
      },
      limitations: {
        title: '使用限制',
        content: 'AI功能僅供輔助使用，不應作為專業醫療建議的替代。在緊急情況下，請立即聯繫專業醫療人員或撥打緊急求助電話。'
      },
      accuracy: {
        title: '準確性聲明',
        content: '雖然我們致力於提供準確的AI回應，但AI技術仍存在局限性。我們建議您對AI提供的建議保持批判性思考。'
      },
      userRights: {
        title: '用戶權利',
        content: '您有權了解AI如何處理您的數據，有權要求更正或刪除相關數據，也有權選擇不使用AI功能。'
      },
      updates: {
        title: '更新通知',
        content: '我們會定期更新AI功能和相關政策。重要更新會通過應用程式內通知或電子郵件告知用戶。'
      },
      contact: {
        title: '聯繫我們',
        content: '如果您對AI功能有任何疑問或建議，請通過應用程式內的意見箱或客服系統與我們聯繫。'
      }
    }
  },
  'zh-CN': {
    title: 'AI使用声明',
    subtitle: '关于Restarter™中AI功能的使用说明',
    back: '返回',
    logout: '登出',
    sections: {
      intro: {
        title: '引言',
        content: 'Restarter™使用人工智能技术来提供个性化的心理健康支持服务。本声明旨在向您说明我们如何使用AI技术，以及您在使用这些功能时的权利和责任。'
      },
      aiFeatures: {
        title: 'AI功能说明',
        content: '我们的AI功能包括：智能对话、情绪分析、个性化建议、内容生成等。这些功能旨在提供辅助性的心理健康支持，而非替代专业医疗服务。'
      },
      dataUsage: {
        title: '数据使用',
        content: '为了提供更好的AI服务，我们可能会收集和分析您与AI的互动数据。所有数据都经过加密处理，并严格遵守隐私保护规定。'
      },
      limitations: {
        title: '使用限制',
        content: 'AI功能仅供辅助使用，不应作为专业医疗建议的替代。在紧急情况下，请立即联系专业医疗人员或拨打紧急求助电话。'
      },
      accuracy: {
        title: '准确性声明',
        content: '虽然我们致力于提供准确的AI回应，但AI技术仍存在局限性。我们建议您对AI提供的建议保持批判性思考。'
      },
      userRights: {
        title: '用户权利',
        content: '您有权了解AI如何处理您的数据，有权要求更正或删除相关数据，也有权选择不使用AI功能。'
      },
      updates: {
        title: '更新通知',
        content: '我们会定期更新AI功能和相关政策。重要更新会通过应用程序内通知或电子邮件告知用户。'
      },
      contact: {
        title: '联系我们',
        content: '如果您对AI功能有任何疑问或建议，请通过应用程序内的意见箱或客服系统与我们联系。'
      }
    }
  },
  'en': {
    title: 'AI Usage Statement',
    subtitle: 'Information about AI features in Restarter™',
    back: 'Back',
    logout: 'Logout',
    sections: {
      intro: {
        title: 'Introduction',
        content: 'Restarter™ uses artificial intelligence technology to provide personalized mental health support services. This statement aims to explain how we use AI technology and your rights and responsibilities when using these features.'
      },
      aiFeatures: {
        title: 'AI Features',
        content: 'Our AI features include: intelligent conversations, emotion analysis, personalized recommendations, content generation, etc. These features are designed to provide辅助mental health support, not as a substitute for professional medical services.'
      },
      dataUsage: {
        title: 'Data Usage',
        content: 'To provide better AI services, we may collect and analyze your interaction data with AI. All data is encrypted and strictly complies with privacy protection regulations.'
      },
      limitations: {
        title: 'Usage Limitations',
        content: 'AI features are for辅助use only and should not be used as a substitute for professional medical advice. In emergency situations, please contact professional medical personnel or call emergency numbers immediately.'
      },
      accuracy: {
        title: 'Accuracy Statement',
        content: 'While we strive to provide accurate AI responses, AI technology still has limitations. We recommend maintaining critical thinking about AI-provided suggestions.'
      },
      userRights: {
        title: 'User Rights',
        content: 'You have the right to understand how AI processes your data, request correction or deletion of related data, and choose not to use AI features.'
      },
      updates: {
        title: 'Update Notifications',
        content: 'We regularly update AI features and related policies. Important updates will be notified to users through in-app notifications or email.'
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions or suggestions about AI features, please contact us through the feedback box or customer service system in the app.'
      }
    }
  },
  'ja': {
    title: 'AI利用声明',
    subtitle: 'Restarter™におけるAI機能の利用に関する説明',
    back: '戻る',
    logout: 'ログアウト',
    sections: {
      intro: {
        title: 'はじめに',
        content: 'Restarter™は人工知能技術を使用して、パーソナライズされたメンタルヘルスサポートサービスを提供しています。この声明は、AI技術の使用方法と、これらの機能を使用する際の権利と責任について説明することを目的としています。'
      },
      aiFeatures: {
        title: 'AI機能',
        content: '当社のAI機能には、インテリジェントな会話、感情分析、パーソナライズされた推奨事項、コンテンツ生成などが含まれます。これらの機能は、専門的な医療サービスの代替ではなく、補助的なメンタルヘルスサポートを提供することを目的としています。'
      },
      dataUsage: {
        title: 'データ使用',
        content: 'より良いAIサービスを提供するために、AIとの対話データを収集・分析する場合があります。すべてのデータは暗号化され、プライバシー保護規定を厳格に遵守しています。'
      },
      limitations: {
        title: '利用制限',
        content: 'AI機能は補助的な使用のみを目的としており、専門的な医療アドバイスの代替として使用すべきではありません。緊急時には、専門医療従事者に連絡するか、緊急電話番号に電話してください。'
      },
      accuracy: {
        title: '正確性声明',
        content: '正確なAI応答を提供することに努めていますが、AI技術にはまだ限界があります。AIが提供する提案について批判的思考を保つことをお勧めします。'
      },
      userRights: {
        title: 'ユーザー権利',
        content: 'AIがデータをどのように処理するかを理解する権利、関連データの修正や削除を要求する権利、AI機能を使用しないことを選択する権利があります。'
      },
      updates: {
        title: '更新通知',
        content: 'AI機能と関連ポリシーを定期的に更新します。重要な更新は、アプリ内通知またはメールでユーザーに通知されます。'
      },
      contact: {
        title: 'お問い合わせ',
        content: 'AI機能についてご質問やご提案がございましたら、アプリ内のフィードバックボックスまたはカスタマーサービスシステムを通じてお問い合わせください。'
      }
    }
  },
  'ko': {
    title: 'AI 사용 성명',
    subtitle: 'Restarter™의 AI 기능 사용에 대한 설명',
    back: '뒤로',
    logout: '로그아웃',
    sections: {
      intro: {
        title: '소개',
        content: 'Restarter™는 개인화된 정신 건강 지원 서비스를 제공하기 위해 인공지능 기술을 사용합니다. 이 성명은 AI 기술을 어떻게 사용하는지, 그리고 이러한 기능을 사용할 때의 권리와 책임에 대해 설명하는 것을 목적으로 합니다.'
      },
      aiFeatures: {
        title: 'AI 기능',
        content: '우리의 AI 기능에는 지능형 대화, 감정 분석, 개인화된 추천, 콘텐츠 생성 등이 포함됩니다. 이러한 기능은 전문 의료 서비스의 대체가 아닌 보조적인 정신 건강 지원을 제공하기 위해 설계되었습니다.'
      },
      dataUsage: {
        title: '데이터 사용',
        content: '더 나은 AI 서비스를 제공하기 위해 AI와의 상호작용 데이터를 수집하고 분석할 수 있습니다. 모든 데이터는 암호화되며 개인정보 보호 규정을 엄격히 준수합니다.'
      },
      limitations: {
        title: '사용 제한',
        content: 'AI 기능은 보조적 사용만을 목적으로 하며 전문 의료 조언의 대체로 사용되어서는 안 됩니다. 긴급 상황에서는 즉시 전문 의료진에 연락하거나 긴급 전화번호로 전화하세요.'
      },
      accuracy: {
        title: '정확성 성명',
        content: '정확한 AI 응답을 제공하기 위해 노력하고 있지만, AI 기술에는 여전히 한계가 있습니다. AI가 제공하는 제안에 대해 비판적 사고를 유지하는 것을 권장합니다.'
      },
      userRights: {
        title: '사용자 권리',
        content: 'AI가 데이터를 어떻게 처리하는지 이해할 권리, 관련 데이터의 수정이나 삭제를 요청할 권리, AI 기능을 사용하지 않을 권리가 있습니다.'
      },
      updates: {
        title: '업데이트 알림',
        content: 'AI 기능과 관련 정책을 정기적으로 업데이트합니다. 중요한 업데이트는 앱 내 알림이나 이메일로 사용자에게 알려집니다.'
      },
      contact: {
        title: '연락처',
        content: 'AI 기능에 대한 질문이나 제안이 있으시면 앱 내 피드백 상자나 고객 서비스 시스템을 통해 문의해 주세요.'
      }
    }
  },
  'th': {
    title: 'คำแถลงการใช้ AI',
    subtitle: 'ข้อมูลเกี่ยวกับฟีเจอร์ AI ใน Restarter™',
    back: 'กลับ',
    logout: 'ออกจากระบบ',
    sections: {
      intro: {
        title: 'บทนำ',
        content: 'Restarter™ ใช้เทคโนโลยีปัญญาประดิษฐ์เพื่อให้บริการสนับสนุนสุขภาพจิตส่วนบุคคล คำแถลงนี้มีวัตถุประสงค์เพื่ออธิบายวิธีที่เราใช้เทคโนโลยี AI และสิทธิ์และความรับผิดชอบของคุณเมื่อใช้ฟีเจอร์เหล่านี้'
      },
      aiFeatures: {
        title: 'ฟีเจอร์ AI',
        content: 'ฟีเจอร์ AI ของเรารวมถึง: การสนทนาอัจฉริยะ การวิเคราะห์อารมณ์ คำแนะนำส่วนบุคคล การสร้างเนื้อหา เป็นต้น ฟีเจอร์เหล่านี้ได้รับการออกแบบมาเพื่อให้การสนับสนุนสุขภาพจิตแบบเสริม ไม่ใช่เป็นทางเลือกแทนบริการทางการแพทย์มืออาชีพ'
      },
      dataUsage: {
        title: 'การใช้ข้อมูล',
        content: 'เพื่อให้บริการ AI ที่ดีขึ้น เราอาจเก็บรวบรวมและวิเคราะห์ข้อมูลการโต้ตอบของคุณกับ AI ข้อมูลทั้งหมดได้รับการเข้ารหัสและปฏิบัติตามระเบียบการคุ้มครองความเป็นส่วนตัวอย่างเคร่งครัด'
      },
      limitations: {
        title: 'ข้อจำกัดการใช้งาน',
        content: 'ฟีเจอร์ AI มีไว้สำหรับการใช้งานเสริมเท่านั้นและไม่ควรใช้เป็นทางเลือกแทนคำแนะนำทางการแพทย์มืออาชีพ ในสถานการณ์ฉุกเฉิน กรุณาติดต่อบุคลากรทางการแพทย์มืออาชีพหรือโทรหาหมายเลขฉุกเฉินทันที'
      },
      accuracy: {
        title: 'คำแถลงความถูกต้อง',
        content: 'ในขณะที่เราพยายามให้การตอบสนอง AI ที่ถูกต้อง แต่เทคโนโลยี AI ยังมีข้อจำกัด เราขอแนะนำให้รักษาการคิดเชิงวิพากษ์เกี่ยวกับข้อเสนอแนะที่ AI ให้'
      },
      userRights: {
        title: 'สิทธิ์ผู้ใช้',
        content: 'คุณมีสิทธิ์ที่จะเข้าใจว่า AI ประมวลผลข้อมูลของคุณอย่างไร ขอให้แก้ไขหรือลบข้อมูลที่เกี่ยวข้อง และเลือกที่จะไม่ใช้ฟีเจอร์ AI'
      },
      updates: {
        title: 'การแจ้งเตือนการอัปเดต',
        content: 'เราอัปเดตฟีเจอร์ AI และนโยบายที่เกี่ยวข้องเป็นประจำ การอัปเดตที่สำคัญจะแจ้งให้ผู้ใช้ทราบผ่านการแจ้งเตือนในแอปหรืออีเมล'
      },
      contact: {
        title: 'ติดต่อเรา',
        content: 'หากคุณมีคำถามหรือข้อเสนอแนะเกี่ยวกับฟีเจอร์ AI กรุณาติดต่อเราผ่านกล่องข้อเสนอแนะหรือระบบบริการลูกค้าในแอป'
      }
    }
  },
  'vi': {
    title: 'Tuyên bố sử dụng AI',
    subtitle: 'Thông tin về tính năng AI trong Restarter™',
    back: 'Quay lại',
    logout: 'Đăng xuất',
    sections: {
      intro: {
        title: 'Giới thiệu',
        content: 'Restarter™ sử dụng công nghệ trí tuệ nhân tạo để cung cấp dịch vụ hỗ trợ sức khỏe tâm thần cá nhân hóa. Tuyên bố này nhằm giải thích cách chúng tôi sử dụng công nghệ AI và quyền lợi cũng như trách nhiệm của bạn khi sử dụng các tính năng này.'
      },
      aiFeatures: {
        title: 'Tính năng AI',
        content: 'Các tính năng AI của chúng tôi bao gồm: hội thoại thông minh, phân tích cảm xúc, đề xuất cá nhân hóa, tạo nội dung, v.v. Những tính năng này được thiết kế để cung cấp hỗ trợ sức khỏe tâm thần bổ sung, không phải là thay thế cho dịch vụ y tế chuyên nghiệp.'
      },
      dataUsage: {
        title: 'Sử dụng dữ liệu',
        content: 'Để cung cấp dịch vụ AI tốt hơn, chúng tôi có thể thu thập và phân tích dữ liệu tương tác của bạn với AI. Tất cả dữ liệu đều được mã hóa và tuân thủ nghiêm ngặt các quy định bảo vệ quyền riêng tư.'
      },
      limitations: {
        title: 'Hạn chế sử dụng',
        content: 'Tính năng AI chỉ dành cho mục đích sử dụng bổ sung và không nên được sử dụng như một thay thế cho lời khuyên y tế chuyên nghiệp. Trong tình huống khẩn cấp, vui lòng liên hệ nhân viên y tế chuyên nghiệp hoặc gọi số điện thoại khẩn cấp ngay lập tức.'
      },
      accuracy: {
        title: 'Tuyên bố về độ chính xác',
        content: 'Mặc dù chúng tôi cố gắng cung cấp phản hồi AI chính xác, nhưng công nghệ AI vẫn có những hạn chế. Chúng tôi khuyến nghị duy trì tư duy phản biện về các đề xuất do AI cung cấp.'
      },
      userRights: {
        title: 'Quyền của người dùng',
        content: 'Bạn có quyền hiểu cách AI xử lý dữ liệu của mình, yêu cầu sửa đổi hoặc xóa dữ liệu liên quan, và chọn không sử dụng các tính năng AI.'
      },
      updates: {
        title: 'Thông báo cập nhật',
        content: 'Chúng tôi thường xuyên cập nhật các tính năng AI và chính sách liên quan. Những cập nhật quan trọng sẽ được thông báo cho người dùng thông qua thông báo trong ứng dụng hoặc email.'
      },
      contact: {
        title: 'Liên hệ chúng tôi',
        content: 'Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào về tính năng AI, vui lòng liên hệ với chúng tôi thông qua hộp phản hồi hoặc hệ thống dịch vụ khách hàng trong ứng dụng.'
      }
    }
  },
  'ms': {
    title: 'Penyata Penggunaan AI',
    subtitle: 'Maklumat tentang ciri AI dalam Restarter™',
    back: 'Kembali',
    logout: 'Log keluar',
    sections: {
      intro: {
        title: 'Pengenalan',
        content: 'Restarter™ menggunakan teknologi kecerdasan buatan untuk menyediakan perkhidmatan sokongan kesihatan mental yang diperibadikan. Penyata ini bertujuan untuk menjelaskan bagaimana kami menggunakan teknologi AI dan hak serta tanggungjawab anda semasa menggunakan ciri-ciri ini.'
      },
      aiFeatures: {
        title: 'Ciri AI',
        content: 'Ciri AI kami termasuk: perbualan pintar, analisis emosi, cadangan diperibadikan, penjanaan kandungan, dll. Ciri-ciri ini direka untuk menyediakan sokongan kesihatan mental tambahan, bukan sebagai pengganti untuk perkhidmatan perubatan profesional.'
      },
      dataUsage: {
        title: 'Penggunaan Data',
        content: 'Untuk menyediakan perkhidmatan AI yang lebih baik, kami mungkin mengumpul dan menganalisis data interaksi anda dengan AI. Semua data disulitkan dan mematuhi peraturan perlindungan privasi dengan ketat.'
      },
      limitations: {
        title: 'Batasan Penggunaan',
        content: 'Ciri AI adalah untuk kegunaan tambahan sahaja dan tidak sepatutnya digunakan sebagai pengganti untuk nasihat perubatan profesional. Dalam situasi kecemasan, sila hubungi kakitangan perubatan profesional atau panggil nombor kecemasan dengan segera.'
      },
      accuracy: {
        title: 'Penyata Ketepatan',
        content: 'Walaupun kami berusaha untuk menyediakan respons AI yang tepat, teknologi AI masih mempunyai batasan. Kami mengesyorkan mengekalkan pemikiran kritikal tentang cadangan yang disediakan oleh AI.'
      },
      userRights: {
        title: 'Hak Pengguna',
        content: 'Anda mempunyai hak untuk memahami bagaimana AI memproses data anda, meminta pembetulan atau penghapusan data berkaitan, dan memilih untuk tidak menggunakan ciri AI.'
      },
      updates: {
        title: 'Pemberitahuan Kemas Kini',
        content: 'Kami kerap mengemas kini ciri AI dan polisi berkaitan. Kemas kini penting akan diberitahu kepada pengguna melalui pemberitahuan dalam aplikasi atau e-mel.'
      },
      contact: {
        title: 'Hubungi Kami',
        content: 'Jika anda mempunyai sebarang soalan atau cadangan tentang ciri AI, sila hubungi kami melalui kotak maklum balas atau sistem perkhidmatan pelanggan dalam aplikasi.'
      }
    }
  },
  'la': {
    title: 'Declaratio Usus AI',
    subtitle: 'Informatio de functionibus AI in Restarter™',
    back: 'Redire',
    logout: 'Exire',
    sections: {
      intro: {
        title: 'Introductio',
        content: 'Restarter™ technologia intelligentiae artificialis utitur ad praebendum servitium auxilii sanitatis mentalis personalizatum. Haec declaratio intendit explicare quomodo technologiam AI utamur et iura tua ac responsabilitates cum his functionibus utaris.'
      },
      aiFeatures: {
        title: 'Functiones AI',
        content: 'Functiones AI nostrae includunt: colloquia intelligentes, analysis emotionum, commendationes personalizatae, generatio contenti, etc. Hae functiones designatae sunt ad praebendum auxilium sanitatis mentalis supplementarium, non substitutum pro servitiis medicis professionalibus.'
      },
      dataUsage: {
        title: 'Usus Datorum',
        content: 'Ad praebendum servitia AI meliora, possumus colligere et analysare data interactionis tuae cum AI. Omnia data encryptata sunt et stricte observant regulas protectionis privatae.'
      },
      limitations: {
        title: 'Limitationes Usus',
        content: 'Functiones AI sunt ad usum supplementarium tantum et non debent uti ut substitutum pro consilio medico professionale. In circumstantiis urgentibus, quaeso contacta personalem medicum professionalem vel voca numerum urgentem statim.'
      },
      accuracy: {
        title: 'Declaratio Accuratiae',
        content: 'Etsi conamur praebere responsiones AI accuratas, technologia AI adhuc habet limitationes. Commendamus conservare cogitationem criticam de commendationibus ab AI praebitis.'
      },
      userRights: {
        title: 'Iura Usuarii',
        content: 'Habet ius intelligere quomodo AI processat data tua, petere correctionem vel deletionem datorum relatorum, et eligere non uti functionibus AI.'
      },
      updates: {
        title: 'Notificationes Renovationis',
        content: 'Regulariter renovamus functiones AI et politicas relatas. Renovationes importantes notificabuntur usuariis per notificationes in app vel email.'
      },
      contact: {
        title: 'Contacta Nos',
        content: 'Si habes quaestiones vel commendationes de functionibus AI, quaeso contacta nos per cistam feedback vel systema servitii clientis in app.'
      }
    }
  }
};

export default function AIStatement() {
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
