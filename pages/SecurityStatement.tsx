import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';

const TEXTS = {
  'zh-TW': {
    title: '安全聲明',
    subtitle: '關於Restarter™數據安全和隱私保護的聲明',
    back: '返回',
    sections: {
      commitment: {
        title: '1. 數據安全承諾',
        content: 'Restarter致力於保護您的個人信息和數據安全。我們採用行業標準的安全措施來保護您的數據。'
      },
      encryption: {
        title: '2. 數據加密',
        content: '我們使用以下加密技術保護您的數據：',
        items: [
          '傳輸層安全協議（TLS）加密所有數據傳輸',
          '數據庫級別的加密存儲',
          '端到端加密保護敏感信息'
        ]
      },
      accessControl: {
        title: '3. 訪問控制',
        content: '我們實施嚴格的數據訪問控制：',
        items: [
          '基於角色的訪問控制（RBAC）',
          '多因素認證（MFA）',
          '定期安全審計和監控',
          '最小權限原則'
        ]
      },
      infrastructure: {
        title: '4. 安全基礎設施',
        content: '我們的基礎設施安全措施包括：',
        items: [
          '雲服務提供商的安全認證',
          '定期安全漏洞掃描',
          '入侵檢測和防護系統',
          '災難恢復和業務連續性計劃'
        ]
      },
      employees: {
        title: '5. 員工安全',
        content: '我們確保所有員工：',
        items: [
          '接受定期安全培訓',
          '簽署保密協議',
          '遵循數據保護最佳實踐'
        ]
      },
      incidentResponse: {
        title: '6. 安全事件響應',
        content: '如發生安全事件，我們將：',
        items: [
          '立即啟動應急響應程序',
          '評估事件影響範圍',
          '及時通知受影響的用戶',
          '採取補救措施防止類似事件'
        ]
      },
      thirdParty: {
        title: '7. 第三方安全',
        content: '我們嚴格審查第三方服務提供商的安全標準，確保他們符合我們的安全要求。'
      },
      reporting: {
        title: '8. 安全報告',
        content: '如果您發現安全漏洞或有安全相關問題，請立即聯繫我們：',
        email: '安全郵箱：security@restarter.com'
      }
    }
  },
  'zh-CN': {
    title: '安全声明',
    subtitle: '关于Restarter™数据安全和隐私保护的声明',
    back: '返回',
    sections: {
      commitment: {
        title: '1. 数据安全承诺',
        content: 'Restarter致力于保护您的个人信息和数据安全。我们采用行业标准的安全措施来保护您的数据。'
      },
      encryption: {
        title: '2. 数据加密',
        content: '我们使用以下加密技术保护您的数据：',
        items: [
          '传输层安全协议（TLS）加密所有数据传输',
          '数据库级别的加密存储',
          '端到端加密保护敏感信息'
        ]
      },
      accessControl: {
        title: '3. 访问控制',
        content: '我们实施严格的数据访问控制：',
        items: [
          '基于角色的访问控制（RBAC）',
          '多因素认证（MFA）',
          '定期安全审计和监控',
          '最小权限原则'
        ]
      },
      infrastructure: {
        title: '4. 安全基础设施',
        content: '我们的基础设施安全措施包括：',
        items: [
          '云服务提供商的安全认证',
          '定期安全漏洞扫描',
          '入侵检测和防护系统',
          '灾难恢复和业务连续性计划'
        ]
      },
      employees: {
        title: '5. 员工安全',
        content: '我们确保所有员工：',
        items: [
          '接受定期安全培训',
          '签署保密协议',
          '遵循数据保护最佳实践'
        ]
      },
      incidentResponse: {
        title: '6. 安全事件响应',
        content: '如发生安全事件，我们将：',
        items: [
          '立即启动应急响应程序',
          '评估事件影响范围',
          '及时通知受影响的用户',
          '采取补救措施防止类似事件'
        ]
      },
      thirdParty: {
        title: '7. 第三方安全',
        content: '我们严格审查第三方服务提供商的安全标准，确保他们符合我们的安全要求。'
      },
      reporting: {
        title: '8. 安全报告',
        content: '如果您发现安全漏洞或有安全相关问题，请立即联系我们：',
        email: '安全邮箱：security@restarter.com'
      }
    }
  },
  'en': {
    title: 'Security Statement',
    subtitle: 'Statement on Restarter™ data security and privacy protection',
    back: 'Back',
    sections: {
      commitment: {
        title: '1. Data Security Commitment',
        content: 'Restarter is committed to protecting your personal information and data security. We adopt industry-standard security measures to protect your data.'
      },
      encryption: {
        title: '2. Data Encryption',
        content: 'We use the following encryption technologies to protect your data:',
        items: [
          'Transport Layer Security (TLS) encryption for all data transmission',
          'Database-level encrypted storage',
          'End-to-end encryption for sensitive information'
        ]
      },
      accessControl: {
        title: '3. Access Control',
        content: 'We implement strict data access controls:',
        items: [
          'Role-based access control (RBAC)',
          'Multi-factor authentication (MFA)',
          'Regular security audits and monitoring',
          'Principle of least privilege'
        ]
      },
      infrastructure: {
        title: '4. Security Infrastructure',
        content: 'Our infrastructure security measures include:',
        items: [
          'Cloud service provider security certifications',
          'Regular security vulnerability scanning',
          'Intrusion detection and prevention systems',
          'Disaster recovery and business continuity plans'
        ]
      },
      employees: {
        title: '5. Employee Security',
        content: 'We ensure all employees:',
        items: [
          'Receive regular security training',
          'Sign confidentiality agreements',
          'Follow data protection best practices'
        ]
      },
      incidentResponse: {
        title: '6. Security Incident Response',
        content: 'In the event of a security incident, we will:',
        items: [
          'Immediately activate emergency response procedures',
          'Assess the scope of the incident',
          'Timely notify affected users',
          'Take remedial measures to prevent similar incidents'
        ]
      },
      thirdParty: {
        title: '7. Third-Party Security',
        content: 'We strictly review the security standards of third-party service providers to ensure they meet our security requirements.'
      },
      reporting: {
        title: '8. Security Reporting',
        content: 'If you discover security vulnerabilities or have security-related issues, please contact us immediately:',
        email: 'Security email: security@restarter.com'
      }
    }
  },
  'ja': {
    title: 'セキュリティ声明',
    subtitle: 'Restarter™データセキュリティとプライバシー保護に関する声明',
    back: '戻る',
    sections: {
      commitment: {
        title: '1. データセキュリティへの取り組み',
        content: 'Restarterは、お客様の個人情報とデータセキュリティの保護に取り組んでいます。暗号化技術、アクセス制御、セキュリティ監視など、業界標準のセキュリティ対策を採用してデータを保護しています。'
      },
      encryption: {
        title: '2. データ暗号化',
        content: 'お客様のデータを保護するために、多層暗号化技術を使用しています：',
        items: [
          'データ伝送暗号化のためのTransport Layer Security（TLS）',
          'データベースレベルの暗号化ストレージ',
          '機密情報のエンドツーエンド暗号化'
        ]
      },
      access: {
        title: '3. アクセス制御',
        content: 'ロールベースアクセス制御（RBAC）や多要素認証を含む厳格なデータアクセス制御を実装し、承認された担当者のみがデータにアクセスできるようにしています。'
      },
      monitoring: {
        title: '4. セキュリティ監視',
        content: '異常検知、侵入検知、定期的なセキュリティ監査を含むシステムセキュリティを継続的に監視し、データセキュリティを確保しています。'
      },
      incident: {
        title: '5. セキュリティインシデント対応',
        content: 'セキュリティインシデントが発生した場合、緊急対応手順を即座に開始し、影響を受けたユーザーに72時間以内に通知します。'
      },
      compliance: {
        title: '6. コンプライアンス',
        content: 'GDPR、CCPAなどの関連データ保護規制を遵守し、最新の法的要件を満たすためにセキュリティ対策を定期的に更新しています。'
      }
    }
  },
  'ko': {
    title: '보안 성명',
    subtitle: 'Restarter™ 데이터 보안 및 개인정보 보호에 관한 성명',
    back: '뒤로',
    sections: {
      commitment: {
        title: '1. 데이터 보안 약속',
        content: 'Restarter는 귀하의 개인정보와 데이터 보안을 보호하기 위해 노력합니다. 암호화 기술, 접근 제어, 보안 모니터링을 포함한 업계 표준 보안 조치를 채택하여 데이터를 보호합니다.'
      },
      encryption: {
        title: '2. 데이터 암호화',
        content: '귀하의 데이터를 보호하기 위해 다층 암호화 기술을 사용합니다:',
        items: [
          '데이터 전송 암호화를 위한 Transport Layer Security(TLS)',
          '데이터베이스 레벨 암호화 저장',
          '민감한 정보의 엔드투엔드 암호화'
        ]
      },
      access: {
        title: '3. 접근 제어',
        content: '역할 기반 접근 제어(RBAC)와 다중 인증을 포함한 엄격한 데이터 접근 제어를 구현하여 승인된 인원만 데이터에 접근할 수 있도록 합니다.'
      },
      monitoring: {
        title: '4. 보안 모니터링',
        content: '이상 탐지, 침입 탐지, 정기 보안 감사를 포함한 시스템 보안을 지속적으로 모니터링하여 데이터 보안을 보장합니다.'
      },
      incident: {
        title: '5. 보안 사고 대응',
        content: '보안 사고가 발생할 경우, 즉시 비상 대응 절차를 시작하고 영향을 받은 사용자에게 72시간 이내에 통지합니다.'
      },
      compliance: {
        title: '6. 준수',
        content: 'GDPR, CCPA 등의 관련 데이터 보호 규정을 준수하며, 최신 법적 요구사항을 충족하기 위해 보안 조치를 정기적으로 업데이트합니다.'
      }
    }
  },
  'th': {
    title: 'คำแถลงความปลอดภัย',
    subtitle: 'คำแถลงเกี่ยวกับความปลอดภัยของข้อมูลและความเป็นส่วนตัวของ Restarter™',
    back: 'กลับ',
    sections: {
      commitment: {
        title: '1. ความมุ่งมั่นด้านความปลอดภัยของข้อมูล',
        content: 'Restarter มุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลและความปลอดภัยของข้อมูลของคุณ เราใช้มาตรการความปลอดภัยตามมาตรฐานอุตสาหกรรมเพื่อปกป้องข้อมูลของคุณ รวมถึงแต่ไม่จำกัดเฉพาะเทคโนโลยีการเข้ารหัส การควบคุมการเข้าถึง และการตรวจสอบความปลอดภัย'
      },
      encryption: {
        title: '2. การเข้ารหัสข้อมูล',
        content: 'เราใช้เทคโนโลยีการเข้ารหัสหลายชั้นเพื่อปกป้องข้อมูลของคุณ:',
        items: [
          'Transport Layer Security (TLS) สำหรับการเข้ารหัสการส่งข้อมูล',
          'การจัดเก็บข้อมูลแบบเข้ารหัสระดับฐานข้อมูล',
          'การเข้ารหัสแบบ end-to-end สำหรับข้อมูลที่ละเอียดอ่อน'
        ]
      },
      access: {
        title: '3. การควบคุมการเข้าถึง',
        content: 'เราใช้การควบคุมการเข้าถึงข้อมูลที่เข้มงวด รวมถึงการควบคุมการเข้าถึงแบบ Role-Based Access Control (RBAC) และการยืนยันตัวตนหลายปัจจัย เพื่อให้แน่ใจว่าบุคลากรที่ได้รับอนุญาตเท่านั้นที่สามารถเข้าถึงข้อมูลของคุณได้'
      },
      monitoring: {
        title: '4. การตรวจสอบความปลอดภัย',
        content: 'เราเฝ้าติดตามความปลอดภัยของระบบอย่างต่อเนื่อง รวมถึงการตรวจจับความผิดปกติ การตรวจจับการบุกรุก และการตรวจสอบความปลอดภัยเป็นประจำ เพื่อให้แน่ใจในความปลอดภัยของข้อมูลของคุณ'
      },
      incident: {
        title: '5. การตอบสนองต่อเหตุการณ์ความปลอดภัย',
        content: 'ในกรณีที่เกิดเหตุการณ์ความปลอดภัย เราจะเปิดใช้งานขั้นตอนการตอบสนองฉุกเฉินทันทีและแจ้งเตือนผู้ใช้ที่ได้รับผลกระทบภายใน 72 ชั่วโมง'
      },
      compliance: {
        title: '6. การปฏิบัติตามกฎระเบียบ',
        content: 'เราปฏิบัติตามกฎระเบียบการคุ้มครองข้อมูลที่เกี่ยวข้อง รวมถึง GDPR, CCPA เป็นต้น และอัปเดตมาตรการความปลอดภัยเป็นประจำเพื่อให้ตรงตามข้อกำหนดทางกฎหมายล่าสุด'
      }
    }
  },
  'vi': {
    title: 'Tuyên bố bảo mật',
    subtitle: 'Tuyên bố về bảo mật dữ liệu và bảo vệ quyền riêng tư của Restarter™',
    back: 'Quay lại',
    sections: {
      commitment: {
        title: '1. Cam kết bảo mật dữ liệu',
        content: 'Restarter cam kết bảo vệ thông tin cá nhân và bảo mật dữ liệu của bạn. Chúng tôi sử dụng các biện pháp bảo mật theo tiêu chuẩn ngành để bảo vệ dữ liệu của bạn, bao gồm nhưng không giới hạn ở công nghệ mã hóa, kiểm soát truy cập và giám sát bảo mật.'
      },
      encryption: {
        title: '2. Mã hóa dữ liệu',
        content: 'Chúng tôi sử dụng công nghệ mã hóa nhiều lớp để bảo vệ dữ liệu của bạn:',
        items: [
          'Transport Layer Security (TLS) để mã hóa truyền dữ liệu',
          'Lưu trữ mã hóa cấp độ cơ sở dữ liệu',
          'Mã hóa end-to-end cho thông tin nhạy cảm'
        ]
      },
      access: {
        title: '3. Kiểm soát truy cập',
        content: 'Chúng tôi thực hiện kiểm soát truy cập dữ liệu nghiêm ngặt, bao gồm Kiểm soát truy cập dựa trên vai trò (RBAC) và xác thực đa yếu tố, đảm bảo chỉ nhân viên được ủy quyền mới có thể truy cập dữ liệu của bạn.'
      },
      monitoring: {
        title: '4. Giám sát bảo mật',
        content: 'Chúng tôi liên tục giám sát bảo mật hệ thống, bao gồm phát hiện bất thường, phát hiện xâm nhập và kiểm toán bảo mật định kỳ, để đảm bảo bảo mật dữ liệu của bạn.'
      },
      incident: {
        title: '5. Phản ứng sự cố bảo mật',
        content: 'Trong trường hợp xảy ra sự cố bảo mật, chúng tôi sẽ ngay lập tức kích hoạt các thủ tục phản ứng khẩn cấp và thông báo cho người dùng bị ảnh hưởng trong vòng 72 giờ.'
      },
      compliance: {
        title: '6. Tuân thủ',
        content: 'Chúng tôi tuân thủ các quy định bảo vệ dữ liệu liên quan, bao gồm GDPR, CCPA, v.v., và thường xuyên cập nhật các biện pháp bảo mật để đáp ứng các yêu cầu pháp lý mới nhất.'
      }
    }
  },
  'ms': {
    title: 'Penyata Keselamatan',
    subtitle: 'Penyata mengenai Keselamatan Data dan Perlindungan Privasi Restarter™',
    back: 'Kembali',
    sections: {
      commitment: {
        title: '1. Komitmen Keselamatan Data',
        content: 'Restarter komited untuk melindungi maklumat peribadi dan keselamatan data anda. Kami menggunakan langkah-langkah keselamatan standard industri untuk melindungi data anda, termasuk tetapi tidak terhad kepada teknologi penyulitan, kawalan akses, dan pemantauan keselamatan.'
      },
      encryption: {
        title: '2. Penyulitan Data',
        content: 'Kami menggunakan teknologi penyulitan berbilang lapisan untuk melindungi data anda:',
        items: [
          'Transport Layer Security (TLS) untuk penyulitan penghantaran data',
          'Penyimpanan tersulit peringkat pangkalan data',
          'Penyulitan end-to-end untuk maklumat sensitif'
        ]
      },
      access: {
        title: '3. Kawalan Akses',
        content: 'Kami melaksanakan kawalan akses data yang ketat, termasuk Kawalan Akses Berasaskan Peranan (RBAC) dan pengesahan berbilang faktor, memastikan hanya kakitangan yang diberi kuasa dapat mengakses data anda.'
      },
      monitoring: {
        title: '4. Pemantauan Keselamatan',
        content: 'Kami sentiasa memantau keselamatan sistem, termasuk pengesanan anomali, pengesanan pencerobohan, dan audit keselamatan berkala, untuk memastikan keselamatan data anda.'
      },
      incident: {
        title: '5. Tindak Balas Insiden Keselamatan',
        content: 'Dalam kes insiden keselamatan, kami akan segera mengaktifkan prosedur tindak balas kecemasan dan memberitahu pengguna yang terjejas dalam tempoh 72 jam.'
      },
      compliance: {
        title: '6. Pematuhan',
        content: 'Kami mematuhi peraturan perlindungan data yang berkaitan, termasuk GDPR, CCPA, dll., dan mengemas kini langkah-langkah keselamatan secara berkala untuk memenuhi keperluan undang-undang terkini.'
      }
    }
  },
  'la': {
    title: 'Declaratio Securitatis',
    subtitle: 'Declaratio de Securitate Datorum et Protectione Privatae Restarter™',
    back: 'Redire',
    sections: {
      commitment: {
        title: '1. Promissio Securitatis Datorum',
        content: 'Restarter promittit protegere informationem personalem et securitatem datorum tuorum. Nos utimur mensuris securitatis standard industriae ad protegenda data tua, includendo sed non limitando ad technologiam encryptionis, controlum accessus, et monitoring securitatis.'
      },
      encryption: {
        title: '2. Encryptio Datorum',
        content: 'Nos utimur technologia encryptionis multi-strata ad protegenda data tua:',
        items: [
          'Transport Layer Security (TLS) pro encryptione transmissionis datorum',
          'Repositorium encryptum nivelis database',
          'Encryptio end-to-end pro informatione sensibili'
        ]
      },
      access: {
        title: '3. Controlum Accessus',
        content: 'Nos implementamus controla stricta accessus datorum, includendo Controlum Accessus Basatum in Rolam (RBAC) et authenticationem multi-factor, securos solum personalem auctorizatum posse accedere data tua.'
      },
      monitoring: {
        title: '4. Monitoring Securitatis',
        content: 'Nos continue monitamus securitatem systematis, includendo detectionem anomaliae, detectionem intrusionis, et auditum securitatis periodicum, ad securam securitatem datorum tuorum.'
      },
      incident: {
        title: '5. Responsum Incidentis Securitatis',
        content: 'In casu incidentis securitatis, nos immediate activabimus proceduras responsi urgentis et notificabimus usuarios affectatos intra 72 horas.'
      },
      compliance: {
        title: '6. Observantia',
        content: 'Nos observamus regulationes protectionis datorum pertinentes, includendo GDPR, CCPA, etc., et regulariter renovamus mensuras securitatis ad satisfaciendas requisitiones iuridicas recentissimas.'
      }
    }
  }
};

const SecurityStatement: React.FC = () => {
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

export default SecurityStatement;
