import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: '心理健康免責聲明',
    subtitle: '關於Restarter™心理健康支援服務的重要聲明',
    back: '返回',
    logout: '登出',
    sections: {
      intro: {
        title: '重要聲明',
        content: 'Restarter™提供的是輔助性的心理健康支援服務，並非專業的心理治療或醫療服務。本平台旨在幫助用戶進行自我探索和情緒管理，但不能替代專業的心理健康治療。'
      },
      serviceScope: {
        title: '服務範圍',
        content: '我們的服務包括：情緒記錄、AI對話輔助、社群支援、自我反思工具等。這些功能設計用於日常的情緒管理和心理健康維護，而非處理嚴重的心理健康問題。'
      },
      limitations: {
        title: '服務限制',
        content: 'Restarter™不提供緊急心理危機干預、專業診斷或治療服務。如果您正在經歷嚴重的心理健康問題，請立即尋求專業醫療幫助。'
      },
      emergency: {
        title: '緊急情況',
        content: '如果您有自殺念頭、嚴重抑鬱、急性焦慮或其他緊急心理健康問題，請立即：1) 撥打緊急求助電話 2) 聯繫專業心理醫生 3) 前往最近的急診室。'
      },
      professionalHelp: {
        title: '專業幫助',
        content: '我們強烈建議在以下情況尋求專業心理健康服務：持續的抑鬱或焦慮、創傷後應激障礙、人格障礙、物質濫用問題等。'
      },
      userResponsibility: {
        title: '用戶責任',
        content: '使用本平台時，您需要對自己的心理健康狀況負責。如果您發現症狀惡化或出現新的問題，請立即停止使用並尋求專業幫助。'
      },
      privacy: {
        title: '隱私保護',
        content: '我們嚴格保護您的隱私，但請注意：在緊急情況下，我們可能會根據法律要求分享必要信息以保護您的安全。'
      },
      contact: {
        title: '聯繫我們',
        content: '如果您對我們的服務有任何疑問或建議，請通過應用程式內的意見箱與我們聯繫。我們會盡快回覆您的問題。'
      }
    }
  },
  'zh-CN': {
    title: '心理健康免责声明',
    subtitle: '关于Restarter™心理健康支持服务的重要声明',
    back: '返回',
    logout: '登出',
    sections: {
      intro: {
        title: '重要声明',
        content: 'Restarter™提供的是辅助性的心理健康支持服务，并非专业的心理治疗或医疗服务。本平台旨在帮助用户进行自我探索和情绪管理，但不能替代专业的心理健康治疗。'
      },
      serviceScope: {
        title: '服务范围',
        content: '我们的服务包括：情绪记录、AI对话辅助、社群支持、自我反思工具等。这些功能设计用于日常的情绪管理和心理健康维护，而非处理严重的心理健康问题。'
      },
      limitations: {
        title: '服务限制',
        content: 'Restarter™不提供紧急心理危机干预、专业诊断或治疗服务。如果您正在经历严重的心理健康问题，请立即寻求专业医疗帮助。'
      },
      emergency: {
        title: '紧急情况',
        content: '如果您有自杀念头、严重抑郁、急性焦虑或其他紧急心理健康问题，请立即：1) 拨打紧急求助电话 2) 联系专业心理医生 3) 前往最近的急诊室。'
      },
      professionalHelp: {
        title: '专业帮助',
        content: '我们强烈建议在以下情况寻求专业心理健康服务：持续的抑郁或焦虑、创伤后应激障碍、人格障碍、物质滥用问题等。'
      },
      userResponsibility: {
        title: '用户责任',
        content: '使用本平台时，您需要对自己的心理健康状况负责。如果您发现症状恶化或出现新的问题，请立即停止使用并寻求专业帮助。'
      },
      privacy: {
        title: '隐私保护',
        content: '我们严格保护您的隐私，但请注意：在紧急情况下，我们可能会根据法律要求分享必要信息以保护您的安全。'
      },
      contact: {
        title: '联系我们',
        content: '如果您对我们的服务有任何疑问或建议，请通过应用程序内的意见箱与我们联系。我们会尽快回复您的问题。'
      }
    }
  },
  'en': {
    title: 'Mental Health Disclaimer',
    subtitle: 'Important statement about Restarter™ mental health support services',
    back: 'Back',
    logout: 'Logout',
    sections: {
      intro: {
        title: 'Important Statement',
        content: 'Restarter™ provides辅助mental health support services, not professional psychological therapy or medical services. This platform is designed to help users with self-exploration and emotion management, but cannot replace professional mental health treatment.'
      },
      serviceScope: {
        title: 'Service Scope',
        content: 'Our services include: emotion recording, AI conversation assistance, community support, self-reflection tools, etc. These features are designed for daily emotion management and mental health maintenance, not for handling serious mental health issues.'
      },
      limitations: {
        title: 'Service Limitations',
        content: 'Restarter™ does not provide emergency psychological crisis intervention, professional diagnosis, or treatment services. If you are experiencing serious mental health issues, please seek professional medical help immediately.'
      },
      emergency: {
        title: 'Emergency Situations',
        content: 'If you have suicidal thoughts, severe depression, acute anxiety, or other emergency mental health issues, please immediately: 1) Call emergency hotlines 2) Contact professional psychologists 3) Go to the nearest emergency room.'
      },
      professionalHelp: {
        title: 'Professional Help',
        content: 'We strongly recommend seeking professional mental health services in the following situations: persistent depression or anxiety, post-traumatic stress disorder, personality disorders, substance abuse issues, etc.'
      },
      userResponsibility: {
        title: 'User Responsibility',
        content: 'When using this platform, you are responsible for your own mental health condition. If you find symptoms worsening or new problems arising, please stop using immediately and seek professional help.'
      },
      privacy: {
        title: 'Privacy Protection',
        content: 'We strictly protect your privacy, but please note: in emergency situations, we may share necessary information according to legal requirements to protect your safety.'
      },
      contact: {
        title: 'Contact Us',
        content: 'If you have any questions or suggestions about our services, please contact us through the feedback box in the app. We will respond to your questions as soon as possible.'
      }
    }
  },
  'ja': {
    title: 'メンタルヘルス免責事項',
    subtitle: 'Restarter™メンタルヘルスサポートサービスに関する重要な声明',
    back: '戻る',
    logout: 'ログアウト',
    sections: {
      intro: {
        title: '重要な声明',
        content: 'Restarter™は補助的なメンタルヘルスサポートサービスを提供しており、専門的な心理療法や医療サービスではありません。このプラットフォームは自己探求と感情管理を支援することを目的としていますが、専門的なメンタルヘルス治療の代替とはなりません。'
      },
      serviceScope: {
        title: 'サービス範囲',
        content: '当社のサービスには、感情記録、AI会話支援、コミュニティサポート、自己反省ツールなどが含まれます。これらの機能は日常的な感情管理とメンタルヘルス維持のために設計されており、深刻なメンタルヘルス問題の処理のためではありません。'
      },
      limitations: {
        title: 'サービス制限',
        content: 'Restarter™は緊急心理危機介入、専門診断、または治療サービスを提供しません。深刻なメンタルヘルス問題を経験している場合は、すぐに専門医療の助けを求めてください。'
      },
      emergency: {
        title: '緊急事態',
        content: '自殺念慮、重度のうつ病、急性不安、またはその他の緊急メンタルヘルス問題がある場合は、すぐに：1) 緊急ホットラインに電話 2) 専門心理学者に連絡 3) 最寄りの救急室に行ってください。'
      },
      professionalHelp: {
        title: '専門的支援',
        content: '以下の状況では専門メンタルヘルスサービスを求めることを強く推奨します：持続的なうつ病や不安、心的外傷後ストレス障害、人格障害、物質乱用問題など。'
      },
      userResponsibility: {
        title: 'ユーザーの責任',
        content: 'このプラットフォームを使用する際は、自分のメンタルヘルス状態に責任を持つ必要があります。症状が悪化したり新しい問題が発生した場合は、すぐに使用を停止し専門的支援を求めてください。'
      },
      privacy: {
        title: 'プライバシー保護',
        content: 'プライバシーを厳格に保護していますが、緊急事態では、あなたの安全を守るために法的要件に従って必要な情報を共有する場合があることにご注意ください。'
      },
      contact: {
        title: 'お問い合わせ',
        content: '当社のサービスについてご質問やご提案がございましたら、アプリ内のフィードバックボックスを通じてお問い合わせください。できるだけ早くご返信いたします。'
      }
    }
  },
  'ko': {
    title: '정신건강 면책조항',
    subtitle: 'Restarter™ 정신건강 지원 서비스에 대한 중요한 성명',
    back: '뒤로',
    logout: '로그아웃',
    sections: {
      intro: {
        title: '중요한 성명',
        content: 'Restarter™는 보조적인 정신건강 지원 서비스를 제공하며, 전문적인 심리 치료나 의료 서비스가 아닙니다. 이 플랫폼은 사용자의 자기 탐구와 감정 관리를 돕기 위해 설계되었지만, 전문적인 정신건강 치료의 대체가 될 수 없습니다.'
      },
      serviceScope: {
        title: '서비스 범위',
        content: '우리의 서비스에는 감정 기록, AI 대화 지원, 커뮤니티 지원, 자기 성찰 도구 등이 포함됩니다. 이러한 기능들은 일상적인 감정 관리와 정신건강 유지를 위해 설계되었으며, 심각한 정신건강 문제를 처리하기 위한 것이 아닙니다.'
      },
      limitations: {
        title: '서비스 제한',
        content: 'Restarter™는 긴급 심리 위기 개입, 전문 진단 또는 치료 서비스를 제공하지 않습니다. 심각한 정신건강 문제를 경험하고 있다면 즉시 전문 의료 도움을 구하세요.'
      },
      emergency: {
        title: '긴급 상황',
        content: '자살 생각, 심각한 우울증, 급성 불안 또는 기타 긴급 정신건강 문제가 있다면 즉시: 1) 긴급 도움 전화 2) 전문 심리학자 연락 3) 가장 가까운 응급실로 이동하세요.'
      },
      professionalHelp: {
        title: '전문적 도움',
        content: '다음과 같은 상황에서는 전문 정신건강 서비스를 구하는 것을 강력히 권장합니다: 지속적인 우울증이나 불안, 외상 후 스트레스 장애, 인격 장애, 물질 남용 문제 등.'
      },
      userResponsibility: {
        title: '사용자 책임',
        content: '이 플랫폼을 사용할 때는 자신의 정신건강 상태에 책임을 져야 합니다. 증상이 악화되거나 새로운 문제가 발생한다면 즉시 사용을 중단하고 전문적 도움을 구하세요.'
      },
      privacy: {
        title: '개인정보 보호',
        content: '개인정보를 엄격히 보호하지만, 긴급 상황에서는 안전을 보호하기 위해 법적 요구사항에 따라 필요한 정보를 공유할 수 있다는 점에 유의하세요.'
      },
      contact: {
        title: '연락처',
        content: '서비스에 대한 질문이나 제안이 있으시면 앱 내 피드백 상자를 통해 문의해 주세요. 가능한 한 빨리 답변드리겠습니다.'
      }
    }
  },
  'th': {
    title: 'ข้อจำกัดความรับผิดชอบด้านสุขภาพจิต',
    subtitle: 'คำแถลงสำคัญเกี่ยวกับบริการสนับสนุนสุขภาพจิตของ Restarter™',
    back: 'กลับ',
    logout: 'ออกจากระบบ',
    sections: {
      intro: {
        title: 'คำแถลงสำคัญ',
        content: 'Restarter™ ให้บริการสนับสนุนสุขภาพจิตแบบเสริม ไม่ใช่การบำบัดทางจิตวิทยาหรือบริการทางการแพทย์แบบมืออาชีพ แพลตฟอร์มนี้ได้รับการออกแบบมาเพื่อช่วยผู้ใช้ในการสำรวจตนเองและการจัดการอารมณ์ แต่ไม่สามารถแทนที่การรักษาสุขภาพจิตแบบมืออาชีพได้'
      },
      serviceScope: {
        title: 'ขอบเขตบริการ',
        content: 'บริการของเรารวมถึง: การบันทึกอารมณ์ การสนทนา AI แบบเสริม การสนับสนุนชุมชน เครื่องมือการสะท้อนตนเอง เป็นต้น ฟีเจอร์เหล่านี้ได้รับการออกแบบมาเพื่อการจัดการอารมณ์ประจำวันและการบำรุงรักษาสุขภาพจิต ไม่ใช่สำหรับการจัดการปัญหาสุขภาพจิตที่ร้ายแรง'
      },
      limitations: {
        title: 'ข้อจำกัดบริการ',
        content: 'Restarter™ ไม่ให้บริการการแทรกแซงวิกฤตทางจิตวิทยาแบบฉุกเฉิน การวินิจฉัยแบบมืออาชีพ หรือบริการการรักษา หากคุณกำลังประสบปัญหาสุขภาพจิตที่ร้ายแรง กรุณาแสวงหาความช่วยเหลือทางการแพทย์แบบมืออาชีพทันที'
      },
      emergency: {
        title: 'สถานการณ์ฉุกเฉิน',
        content: 'หากคุณมีความคิดฆ่าตัวตาย ภาวะซึมเศร้าอย่างร้ายแรง ความวิตกกังวลแบบเฉียบพลัน หรือปัญหาสุขภาพจิตฉุกเฉินอื่นๆ กรุณาทันที: 1) โทรสายด่วนฉุกเฉิน 2) ติดต่อนักจิตวิทยามืออาชีพ 3) ไปห้องฉุกเฉินที่ใกล้ที่สุด'
      },
      professionalHelp: {
        title: 'ความช่วยเหลือแบบมืออาชีพ',
        content: 'เราแนะนำอย่างยิ่งให้แสวงหาบริการสุขภาพจิตแบบมืออาชีพในสถานการณ์ต่อไปนี้: ภาวะซึมเศร้าหรือความวิตกกังวลที่ต่อเนื่อง โรคเครียดหลังเหตุการณ์สะเทือนขวัญ โรคบุคลิกภาพ การใช้สารเสพติด เป็นต้น'
      },
      userResponsibility: {
        title: 'ความรับผิดชอบของผู้ใช้',
        content: 'เมื่อใช้แพลตฟอร์มนี้ คุณต้องรับผิดชอบต่อสภาพสุขภาพจิตของตนเอง หากคุณพบว่าอาการแย่ลงหรือเกิดปัญหาต่างๆ ใหม่ กรุณาหยุดใช้ทันทีและแสวงหาความช่วยเหลือแบบมืออาชีพ'
      },
      privacy: {
        title: 'การคุ้มครองความเป็นส่วนตัว',
        content: 'เราให้ความคุ้มครองความเป็นส่วนตัวอย่างเข้มงวด แต่โปรดทราบ: ในสถานการณ์ฉุกเฉิน เราอาจแบ่งปันข้อมูลที่จำเป็นตามข้อกำหนดทางกฎหมายเพื่อปกป้องความปลอดภัยของคุณ'
      },
      contact: {
        title: 'ติดต่อเรา',
        content: 'หากคุณมีคำถามหรือข้อเสนอแนะเกี่ยวกับบริการของเรา กรุณาติดต่อเราผ่านกล่องข้อเสนอแนะในแอป เราจะตอบกลับคำถามของคุณโดยเร็วที่สุด'
      }
    }
  },
  'vi': {
    title: 'Tuyên bố miễn trừ sức khỏe tâm thần',
    subtitle: 'Tuyên bố quan trọng về dịch vụ hỗ trợ sức khỏe tâm thần của Restarter™',
    back: 'Quay lại',
    logout: 'Đăng xuất',
    sections: {
      intro: {
        title: 'Tuyên bố quan trọng',
        content: 'Restarter™ cung cấp dịch vụ hỗ trợ sức khỏe tâm thần bổ sung, không phải là liệu pháp tâm lý chuyên nghiệp hoặc dịch vụ y tế. Nền tảng này được thiết kế để giúp người dùng tự khám phá và quản lý cảm xúc, nhưng không thể thay thế điều trị sức khỏe tâm thần chuyên nghiệp.'
      },
      serviceScope: {
        title: 'Phạm vi dịch vụ',
        content: 'Dịch vụ của chúng tôi bao gồm: ghi lại cảm xúc, hỗ trợ hội thoại AI, hỗ trợ cộng đồng, công cụ tự phản ánh, v.v. Những tính năng này được thiết kế để quản lý cảm xúc hàng ngày và duy trì sức khỏe tâm thần, không phải để xử lý các vấn đề sức khỏe tâm thần nghiêm trọng.'
      },
      limitations: {
        title: 'Hạn chế dịch vụ',
        content: 'Restarter™ không cung cấp can thiệp khủng hoảng tâm lý khẩn cấp, chẩn đoán chuyên nghiệp hoặc dịch vụ điều trị. Nếu bạn đang gặp các vấn đề sức khỏe tâm thần nghiêm trọng, vui lòng tìm kiếm sự giúp đỡ y tế chuyên nghiệp ngay lập tức.'
      },
      emergency: {
        title: 'Tình huống khẩn cấp',
        content: 'Nếu bạn có ý nghĩ tự tử, trầm cảm nghiêm trọng, lo lắng cấp tính hoặc các vấn đề sức khỏe tâm thần khẩn cấp khác, vui lòng ngay lập tức: 1) Gọi đường dây nóng khẩn cấp 2) Liên hệ nhà tâm lý học chuyên nghiệp 3) Đến phòng cấp cứu gần nhất.'
      },
      professionalHelp: {
        title: 'Sự giúp đỡ chuyên nghiệp',
        content: 'Chúng tôi khuyến nghị mạnh mẽ tìm kiếm dịch vụ sức khỏe tâm thần chuyên nghiệp trong các tình huống sau: trầm cảm hoặc lo lắng dai dẳng, rối loạn căng thẳng sau chấn thương, rối loạn nhân cách, vấn đề lạm dụng chất, v.v.'
      },
      userResponsibility: {
        title: 'Trách nhiệm của người dùng',
        content: 'Khi sử dụng nền tảng này, bạn cần chịu trách nhiệm về tình trạng sức khỏe tâm thần của mình. Nếu bạn thấy các triệu chứng xấu đi hoặc xuất hiện vấn đề mới, vui lòng ngừng sử dụng ngay lập tức và tìm kiếm sự giúp đỡ chuyên nghiệp.'
      },
      privacy: {
        title: 'Bảo vệ quyền riêng tư',
        content: 'Chúng tôi bảo vệ quyền riêng tư của bạn một cách nghiêm ngặt, nhưng vui lòng lưu ý: trong tình huống khẩn cấp, chúng tôi có thể chia sẻ thông tin cần thiết theo yêu cầu pháp lý để bảo vệ sự an toàn của bạn.'
      },
      contact: {
        title: 'Liên hệ chúng tôi',
        content: 'Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào về dịch vụ của chúng tôi, vui lòng liên hệ với chúng tôi thông qua hộp phản hồi trong ứng dụng. Chúng tôi sẽ trả lời câu hỏi của bạn càng sớm càng tốt.'
      }
    }
  },
  'ms': {
    title: 'Penafian Kesihatan Mental',
    subtitle: 'Penyata penting tentang perkhidmatan sokongan kesihatan mental Restarter™',
    back: 'Kembali',
    logout: 'Log keluar',
    sections: {
      intro: {
        title: 'Penyata Penting',
        content: 'Restarter™ menyediakan perkhidmatan sokongan kesihatan mental tambahan, bukan terapi psikologi profesional atau perkhidmatan perubatan. Platform ini direka untuk membantu pengguna dengan penerokaan diri dan pengurusan emosi, tetapi tidak boleh menggantikan rawatan kesihatan mental profesional.'
      },
      serviceScope: {
        title: 'Skop Perkhidmatan',
        content: 'Perkhidmatan kami termasuk: rakaman emosi, bantuan perbualan AI, sokongan komuniti, alat refleksi diri, dll. Ciri-ciri ini direka untuk pengurusan emosi harian dan penyelenggaraan kesihatan mental, bukan untuk menangani isu kesihatan mental yang serius.'
      },
      limitations: {
        title: 'Batasan Perkhidmatan',
        content: 'Restarter™ tidak menyediakan campur tangan krisis psikologi kecemasan, diagnosis profesional, atau perkhidmatan rawatan. Jika anda mengalami isu kesihatan mental yang serius, sila dapatkan bantuan perubatan profesional dengan segera.'
      },
      emergency: {
        title: 'Situasi Kecemasan',
        content: 'Jika anda mempunyai pemikiran membunuh diri, kemurungan teruk, kebimbangan akut, atau isu kesihatan mental kecemasan lain, sila segera: 1) Panggil talian panas kecemasan 2) Hubungi ahli psikologi profesional 3) Pergi ke bilik kecemasan terdekat.'
      },
      professionalHelp: {
        title: 'Bantuan Profesional',
        content: 'Kami sangat mengesyorkan mendapatkan perkhidmatan kesihatan mental profesional dalam situasi berikut: kemurungan atau kebimbangan berterusan, gangguan tekanan pasca trauma, gangguan personaliti, isu penyalahgunaan bahan, dll.'
      },
      userResponsibility: {
        title: 'Tanggungjawab Pengguna',
        content: 'Apabila menggunakan platform ini, anda bertanggungjawab untuk keadaan kesihatan mental anda sendiri. Jika anda mendapati simptom bertambah teruk atau masalah baru timbul, sila berhenti menggunakan dengan segera dan dapatkan bantuan profesional.'
      },
      privacy: {
        title: 'Perlindungan Privasi',
        content: 'Kami melindungi privasi anda dengan ketat, tetapi sila ambil perhatian: dalam situasi kecemasan, kami mungkin berkongsi maklumat yang diperlukan mengikut keperluan undang-undang untuk melindungi keselamatan anda.'
      },
      contact: {
        title: 'Hubungi Kami',
        content: 'Jika anda mempunyai sebarang soalan atau cadangan tentang perkhidmatan kami, sila hubungi kami melalui kotak maklum balas dalam aplikasi. Kami akan menjawab soalan anda secepat mungkin.'
      }
    }
  },
  'la': {
    title: 'Renuntiatio Salutis Mentalis',
    subtitle: 'Declaratio magna de servitiis auxilii salutis mentalis Restarter™',
    back: 'Redire',
    logout: 'Exire',
    sections: {
      intro: {
        title: 'Declaratio Magna',
        content: 'Restarter™ praebet servitia auxilii salutis mentalis supplementaria, non therapiam psychologicam professionalem vel servitia medica. Haec platforma designata est ad iuvandum usuarios cum exploratione sui et administratione emotionum, sed non potest substituere curationem salutis mentalis professionalem.'
      },
      serviceScope: {
        title: 'Scopus Servitii',
        content: 'Servitia nostra includunt: recordationem emotionum, auxilium colloquii AI, sustentationem communitatis, instrumenta reflexionis sui, etc. Hae functiones designatae sunt ad administrationem emotionum quotidianam et sustentationem salutis mentalis, non ad tractandas quaestiones salutis mentalis graves.'
      },
      limitations: {
        title: 'Limitationes Servitii',
        content: 'Restarter™ non praebet interventionem crisis psychologicae urgentis, diagnosis professionalem, vel servitia curationis. Si experiris quaestiones salutis mentalis graves, quaeso pete auxilium medicum professionalem statim.'
      },
      emergency: {
        title: 'Circumstantiae Urgentes',
        content: 'Si habes cogitationes suicidales, depressionem gravem, anxietatem acutam, vel alias quaestiones salutis mentalis urgentes, quaeso statim: 1) Voca lineas calidas urgentes 2) Contacta psychologos professionales 3) I ad cubiculum urgentium proximum.'
      },
      professionalHelp: {
        title: 'Auxilium Professionale',
        content: 'Valde commendamus petere servitia salutis mentalis professionalia in circumstantiis sequentibus: depressio vel anxietas persistens, perturbatio post-traumatica, perturbationes personalitatis, quaestiones abusus substantiarum, etc.'
      },
      userResponsibility: {
        title: 'Responsabilitas Usuarii',
        content: 'Cum utaris hac platforma, es responsabilis pro conditione salutis mentalis tuae. Si invenis symptomata deteriorantia vel problemata nova oriuntur, quaeso desine uti statim et pete auxilium professionale.'
      },
      privacy: {
        title: 'Protectio Privatae',
        content: 'Stricte protegitur privata tua, sed quaeso nota: in circumstantiis urgentibus, possumus communicare informationem necessariam secundum requisita legalia ad protegendum securitatem tuam.'
      },
      contact: {
        title: 'Contacta Nos',
        content: 'Si habes quaestiones vel commendationes de servitiis nostris, quaeso contacta nos per cistam feedback in app. Respondebimus quaestionibus tuis quam celerrime.'
      }
    }
  }
};

export default function MentalHealthDisclaimer() {
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
