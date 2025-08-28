import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: '國際用戶法律聲明',
    subtitle: '關於Restarter™國際用戶的法律適用說明',
    back: '返回',
    sections: {
      scope: {
        title: '1. 適用範圍',
        content: '本聲明適用於所有使用Restarter服務的國際用戶，無論您位於哪個國家或地區。'
      },
      crossBorder: {
        title: '2. 數據跨境傳輸',
        content: '由於我們的服務可能涉及數據跨境傳輸，我們承諾：',
        items: [
          '遵守相關國家的數據保護法律',
          '實施適當的安全措施保護您的數據',
          '在必要時獲得必要的法律授權'
        ]
      },
      compliance: {
        title: '3. 當地法律合規',
        content: '我們努力確保服務符合您所在地區的適用法律，包括但不限於：',
        items: [
          '數據保護法規（如GDPR、CCPA等）',
          '消費者保護法律',
          '內容監管要求'
        ]
      },
      dispute: {
        title: '4. 爭議解決',
        content: '如發生爭議，我們將優先通過友好協商解決。如協商不成，將根據相關法律和我們的服務條款進行處理。'
      },
      contact: {
        title: '5. 聯繫信息',
        content: '如果您對本聲明有任何疑問，或需要了解特定地區的法律適用情況，請通過以下方式聯繫我們：',
        email: '郵箱：legal@restarter.com'
      },
      updates: {
        title: '6. 更新通知',
        content: '我們可能會根據法律變化或業務需要更新本聲明。重要更新將通過應用內通知或郵件方式告知用戶。'
      }
    }
  },
  'zh-CN': {
    title: '国际用户法律声明',
    subtitle: '关于Restarter™国际用户的法律适用说明',
    back: '返回',
    sections: {
      scope: {
        title: '1. 适用范围',
        content: '本声明适用于所有使用Restarter服务的国际用户，无论您位于哪个国家或地区。'
      },
      crossBorder: {
        title: '2. 数据跨境传输',
        content: '由于我们的服务可能涉及数据跨境传输，我们承诺：',
        items: [
          '遵守相关国家的数据保护法律',
          '实施适当的安全措施保护您的数据',
          '在必要时获得必要的法律授权'
        ]
      },
      compliance: {
        title: '3. 当地法律合规',
        content: '我们努力确保服务符合您所在地区的适用法律，包括但不限于：',
        items: [
          '数据保护法规（如GDPR、CCPA等）',
          '消费者保护法律',
          '内容监管要求'
        ]
      },
      dispute: {
        title: '4. 争议解决',
        content: '如发生争议，我们将优先通过友好协商解决。如协商不成，将根据相关法律和我们的服务条款进行处理。'
      },
      contact: {
        title: '5. 联系信息',
        content: '如果您对本声明有任何疑问，或需要了解特定地区的法律适用情况，请通过以下方式联系我们：',
        email: '邮箱：legal@restarter.com'
      },
      updates: {
        title: '6. 更新通知',
        content: '我们可能会根据法律变化或业务需要更新本声明。重要更新将通过应用内通知或邮件方式告知用户。'
      }
    }
  },
  'en': {
    title: 'International Users Legal Statement',
    subtitle: 'Legal applicability information for Restarter™ international users',
    back: 'Back',
    sections: {
      scope: {
        title: '1. Scope of Application',
        content: 'This statement applies to all international users of Restarter services, regardless of which country or region you are located in.'
      },
      crossBorder: {
        title: '2. Cross-Border Data Transmission',
        content: 'As our services may involve cross-border data transmission, we commit to:',
        items: [
          'Comply with data protection laws of relevant countries',
          'Implement appropriate security measures to protect your data',
          'Obtain necessary legal authorization when required'
        ]
      },
      compliance: {
        title: '3. Local Legal Compliance',
        content: 'We strive to ensure that our services comply with applicable laws in your region, including but not limited to:',
        items: [
          'Data protection regulations (such as GDPR, CCPA, etc.)',
          'Consumer protection laws',
          'Content regulation requirements'
        ]
      },
      dispute: {
        title: '4. Dispute Resolution',
        content: 'In the event of disputes, we will prioritize resolution through friendly negotiation. If negotiation fails, we will handle the matter according to relevant laws and our service terms.'
      },
      contact: {
        title: '5. Contact Information',
        content: 'If you have any questions about this statement, or need to understand the legal applicability in specific regions, please contact us through:',
        email: 'Email: legal@restarter.com'
      },
      updates: {
        title: '6. Update Notifications',
        content: 'We may update this statement based on legal changes or business needs. Important updates will be notified to users through in-app notifications or email.'
      }
    }
  },
  'ja': {
    title: '国際ユーザー法的声明',
    subtitle: 'Restarter™国際ユーザー向け法的適用性に関する説明',
    back: '戻る',
    sections: {
      scope: {
        title: '1. 適用範囲',
        content: '本声明は、どの国や地域に所在するかを問わず、Restarterサービスを利用するすべての国際ユーザーに適用されます。'
      },
      crossBorder: {
        title: '2. データの越境転送',
        content: '当社のサービスにはデータの越境転送が含まれる可能性があるため、以下のことを約束します：',
        items: [
          '関連国のデータ保護法を遵守する',
          '適切なセキュリティ対策を実施してデータを保護する',
          '必要に応じて必要な法的認可を取得する'
        ]
      },
      compliance: {
        title: '3. 現地法規制への準拠',
        content: '当社は、お客様の地域の適用法に準拠するようサービスを提供することを目指しており、以下を含みますが、これらに限定されません：',
        items: [
          'データ保護規制（GDPR、CCPAなど）',
          '消費者保護法',
          'コンテンツ規制要件'
        ]
      },
      dispute: {
        title: '4. 紛争解決',
        content: '紛争が発生した場合、当社は友好的な交渉による解決を優先します。交渉が失敗した場合、関連法および当社のサービス条項に従って処理します。'
      },
      contact: {
        title: '5. 連絡先情報',
        content: '本声明についてご質問がある場合、または特定地域の法的適用性について知りたい場合は、以下を通じてお問い合わせください：',
        email: 'メール：legal@restarter.com'
      },
      updates: {
        title: '6. 更新通知',
        content: '法的変更やビジネスニーズに基づいて本声明を更新する場合があります。重要な更新は、アプリ内通知またはメールでユーザーに通知されます。'
      }
    }
  },
  'ko': {
    title: '국제 사용자 법적 성명',
    subtitle: 'Restarter™ 국제 사용자를 위한 법적 적용성 정보',
    back: '뒤로',
    sections: {
      scope: {
        title: '1. 적용 범위',
        content: '본 성명은 어느 국가나 지역에 위치하든 상관없이 Restarter 서비스를 이용하는 모든 국제 사용자에게 적용됩니다.'
      },
      crossBorder: {
        title: '2. 데이터 국경 간 전송',
        content: '당사의 서비스에는 데이터 국경 간 전송이 포함될 수 있으므로 다음을 약속합니다:',
        items: [
          '관련 국가의 데이터 보호법을 준수합니다',
          '적절한 보안 조치를 시행하여 데이터를 보호합니다',
          '필요시 필요한 법적 승인을 받습니다'
        ]
      },
      compliance: {
        title: '3. 현지 법적 준수',
        content: '당사는 귀하의 지역의 적용 법률을 준수하도록 서비스를 제공하기 위해 노력하며, 다음을 포함하지만 이에 국한되지 않습니다:',
        items: [
          '데이터 보호 규정(GDPR, CCPA 등)',
          '소비자 보호법',
          '콘텐츠 규제 요구사항'
        ]
      },
      dispute: {
        title: '4. 분쟁 해결',
        content: '분쟁이 발생할 경우, 당사는 우선적으로 친선적 협상을 통한 해결을 추구합니다. 협상이 실패할 경우, 관련 법률과 당사의 서비스 약관에 따라 처리합니다.'
      },
      contact: {
        title: '5. 연락처 정보',
        content: '본 성명에 대한 질문이 있거나 특정 지역의 법적 적용성에 대해 알고 싶으시면 다음을 통해 연락해 주세요:',
        email: '이메일: legal@restarter.com'
      },
      updates: {
        title: '6. 업데이트 알림',
        content: '법적 변경사항이나 비즈니스 요구사항에 따라 본 성명을 업데이트할 수 있습니다. 중요한 업데이트는 앱 내 알림이나 이메일로 사용자에게 통지됩니다.'
      }
    }
  },
  'th': {
    title: 'คำแถลงทางกฎหมายสำหรับผู้ใช้ระหว่างประเทศ',
    subtitle: 'ข้อมูลการบังคับใช้กฎหมายสำหรับผู้ใช้ Restarter™ ระหว่างประเทศ',
    back: 'กลับ',
    sections: {
      scope: {
        title: '1. ขอบเขตการบังคับใช้',
        content: 'คำแถลงนี้ใช้กับผู้ใช้ระหว่างประเทศทั้งหมดของบริการ Restarter โดยไม่คำนึงถึงประเทศหรือภูมิภาคที่คุณตั้งอยู่'
      },
      crossBorder: {
        title: '2. การส่งข้อมูลข้ามพรมแดน',
        content: 'เนื่องจากบริการของเราอาจเกี่ยวข้องกับการส่งข้อมูลข้ามพรมแดน เรามุ่งมั่นที่จะ:',
        items: [
          'ปฏิบัติตามกฎหมายการคุ้มครองข้อมูลของประเทศที่เกี่ยวข้อง',
          'ดำเนินการมาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อปกป้องข้อมูลของคุณ',
          'ขออนุญาตทางกฎหมายที่จำเป็นเมื่อจำเป็น'
        ]
      },
      compliance: {
        title: '3. การปฏิบัติตามกฎหมายท้องถิ่น',
        content: 'เรามุ่งมั่นที่จะให้บริการที่สอดคล้องกับกฎหมายที่บังคับใช้ในภูมิภาคของคุณ รวมถึงแต่ไม่จำกัดเฉพาะ:',
        items: [
          'กฎระเบียบการคุ้มครองข้อมูล (เช่น GDPR, CCPA เป็นต้น)',
          'กฎหมายคุ้มครองผู้บริโภค',
          'ข้อกำหนดการกำกับดูแลเนื้อหา'
        ]
      },
      dispute: {
        title: '4. การแก้ไขข้อพิพาท',
        content: 'ในกรณีที่มีข้อพิพาท เราจะให้ความสำคัญกับการแก้ไขผ่านการเจรจาอย่างเป็นมิตร หากการเจรจาล้มเหลว เราจะจัดการตามกฎหมายที่เกี่ยวข้องและข้อกำหนดการให้บริการของเรา'
      },
      contact: {
        title: '5. ข้อมูลการติดต่อ',
        content: 'หากคุณมีคำถามเกี่ยวกับคำแถลงนี้ หรือต้องการทราบการบังคับใช้กฎหมายในภูมิภาคเฉพาะ กรุณาติดต่อเราผ่าน:',
        email: 'อีเมล: legal@restarter.com'
      },
      updates: {
        title: '6. การแจ้งเตือนการอัปเดต',
        content: 'เราอาจอัปเดตคำแถลงนี้ตามการเปลี่ยนแปลงทางกฎหมายหรือความต้องการทางธุรกิจ การอัปเดตที่สำคัญจะแจ้งให้ผู้ใช้ทราบผ่านการแจ้งเตือนในแอปหรืออีเมล'
      }
    }
  },
  'vi': {
    title: 'Tuyên bố pháp lý cho người dùng quốc tế',
    subtitle: 'Thông tin về khả năng áp dụng pháp lý cho người dùng Restarter™ quốc tế',
    back: 'Quay lại',
    sections: {
      scope: {
        title: '1. Phạm vi áp dụng',
        content: 'Tuyên bố này áp dụng cho tất cả người dùng quốc tế của dịch vụ Restarter, bất kể bạn ở quốc gia hoặc khu vực nào.'
      },
      crossBorder: {
        title: '2. Truyền dữ liệu xuyên biên giới',
        content: 'Vì dịch vụ của chúng tôi có thể liên quan đến việc truyền dữ liệu xuyên biên giới, chúng tôi cam kết:',
        items: [
          'Tuân thủ luật bảo vệ dữ liệu của các quốc gia liên quan',
          'Thực hiện các biện pháp bảo mật phù hợp để bảo vệ dữ liệu của bạn',
          'Có được ủy quyền pháp lý cần thiết khi cần thiết'
        ]
      },
      compliance: {
        title: '3. Tuân thủ pháp luật địa phương',
        content: 'Chúng tôi nỗ lực đảm bảo dịch vụ tuân thủ luật pháp áp dụng trong khu vực của bạn, bao gồm nhưng không giới hạn ở:',
        items: [
          'Quy định bảo vệ dữ liệu (như GDPR, CCPA, v.v.)',
          'Luật bảo vệ người tiêu dùng',
          'Yêu cầu quản lý nội dung'
        ]
      },
      dispute: {
        title: '4. Giải quyết tranh chấp',
        content: 'Trong trường hợp có tranh chấp, chúng tôi sẽ ưu tiên giải quyết thông qua đàm phán thân thiện. Nếu đàm phán thất bại, chúng tôi sẽ xử lý theo luật pháp liên quan và điều khoản dịch vụ của chúng tôi.'
      },
      contact: {
        title: '5. Thông tin liên hệ',
        content: 'Nếu bạn có bất kỳ câu hỏi nào về tuyên bố này, hoặc cần hiểu về khả năng áp dụng pháp lý ở các khu vực cụ thể, vui lòng liên hệ chúng tôi qua:',
        email: 'Email: legal@restarter.com'
      },
      updates: {
        title: '6. Thông báo cập nhật',
        content: 'Chúng tôi có thể cập nhật tuyên bố này dựa trên thay đổi pháp lý hoặc nhu cầu kinh doanh. Các cập nhật quan trọng sẽ được thông báo cho người dùng thông qua thông báo trong ứng dụng hoặc email.'
      }
    }
  },
  'ms': {
    title: 'Penyata Undang-undang Pengguna Antarabangsa',
    subtitle: 'Maklumat kebolehgunaan undang-undang untuk pengguna Restarter™ antarabangsa',
    back: 'Kembali',
    sections: {
      scope: {
        title: '1. Skop Permohonan',
        content: 'Penyata ini terpakai kepada semua pengguna antarabangsa perkhidmatan Restarter, tanpa mengira negara atau rantau mana anda berada.'
      },
      crossBorder: {
        title: '2. Pemindahan Data Merentasi Sempadan',
        content: 'Oleh kerana perkhidmatan kami mungkin melibatkan pemindahan data merentasi sempadan, kami berjanji untuk:',
        items: [
          'Mematuhi undang-undang perlindungan data negara-negara yang berkaitan',
          'Melaksanakan langkah-langkah keselamatan yang sesuai untuk melindungi data anda',
          'Mendapatkan kebenaran undang-undang yang diperlukan apabila diperlukan'
        ]
      },
      compliance: {
        title: '3. Pematuhan Undang-undang Tempatan',
        content: 'Kami berusaha untuk memastikan perkhidmatan mematuhi undang-undang yang berkenaan di rantau anda, termasuk tetapi tidak terhad kepada:',
        items: [
          'Peraturan perlindungan data (seperti GDPR, CCPA, dll.)',
          'Undang-undang perlindungan pengguna',
          'Keperluan pengawalseliaan kandungan'
        ]
      },
      dispute: {
        title: '4. Penyelesaian Pertikaian',
        content: 'Sekiranya berlaku pertikaian, kami akan mengutamakan penyelesaian melalui rundingan secara baik. Jika rundingan gagal, kami akan mengendalikan perkara mengikut undang-undang yang berkaitan dan terma perkhidmatan kami.'
      },
      contact: {
        title: '5. Maklumat Perhubungan',
        content: 'Jika anda mempunyai sebarang soalan tentang penyata ini, atau perlu memahami kebolehgunaan undang-undang di rantau tertentu, sila hubungi kami melalui:',
        email: 'E-mel: legal@restarter.com'
      },
      updates: {
        title: '6. Pemberitahuan Kemas Kini',
        content: 'Kami mungkin mengemas kini penyata ini berdasarkan perubahan undang-undang atau keperluan perniagaan. Kemas kini penting akan diberitahu kepada pengguna melalui pemberitahuan dalam aplikasi atau e-mel.'
      }
    }
  },
  'la': {
    title: 'Declaratio Iuridica Usuarii Internationalis',
    subtitle: 'Informatio de applicabilitate iuridica pro usuariis Restarter™ internationalibus',
    back: 'Redire',
    sections: {
      scope: {
        title: '1. Scopum Applicationis',
        content: 'Haec declaratio applicatur omnibus usuariis internationalibus servitiorum Restarter, quocumque in regione vel civitate sitis.'
      },
      crossBorder: {
        title: '2. Transmissio Datorum Trans Fines',
        content: 'Cum servitia nostra transmissionem datorum trans fines involvere possint, nos promittimus:',
        items: [
          'Leges protectionis datorum civitatum pertinentium observare',
          'Mensuras securitatis aptas implementare ad data tua protegenda',
          'Auctoritatem iuridicam necessariam obtinere cum necesse est'
        ]
      },
      compliance: {
        title: '3. Observantia Legis Localis',
        content: 'Nos conamur ut servitia nostra legibus applicabilibus in regione tua conformia sint, includendo sed non limitando ad:',
        items: [
          'Regulationes protectionis datorum (sicut GDPR, CCPA, etc.)',
          'Leges protectionis consumptorum',
          'Requisitiones regulationis contenti'
        ]
      },
      dispute: {
        title: '4. Resolutio Controversiarum',
        content: 'In casu controversiarum, nos controversias per negotiationem amicabilem resolvere praeferimus. Si negotiatio defecit, nos materiam secundum leges pertinentes et terminos servitiorum nostrorum tractabimus.'
      },
      contact: {
        title: '5. Informatio Contactus',
        content: 'Si quaestiones de hac declaratione habes, vel necesse est intellegere applicabilitatem iuridicam in regionibus specificis, quaeso nos contacta per:',
        email: 'Epistula: legal@restarter.com'
      },
      updates: {
        title: '6. Notificationes Renovationis',
        content: 'Nos hanc declarationem renovare possumus secundum mutationes iuridicas vel necessitates negotii. Renovationes importantes per notificationes in app vel epistulam usuariis notificabuntur.'
      }
    }
  }
};

const InternationalUsers: React.FC = () => {
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
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InternationalUsers;
