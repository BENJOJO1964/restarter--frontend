import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const LANGS = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'la', label: 'Latin' },
];

const FOOTER_TEXT: Record<string, { privacy: string; deletion: string }> = {
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

const SUPPORTED_LANGS = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'th', 'vi', 'ms', 'la'] as const;
type LangType = typeof SUPPORTED_LANGS[number];

const TERMS: Record<LangType, React.ReactNode> = {
  'zh-TW': (
    <div>
      <h1>Restarter™ 使用條款與更生者聲明</h1>
      <h2>一、平台理念聲明</h2>
      <p>Restarter™ 是幫助更生人社會、心理、生活自信恢復的 AI 平台。我們透過情感引導、角色扮演、任務挑戰，協助用戶釋放負面情緒、重建目標與自信，更引導使用者逐步建立內在動力與行動信心。</p>
      <p>我們相信每一位更生人都值得被尊重與重新認識。即使你曾經犯錯，在這裡不再被貼標籤。</p>
      <h2>二、用戶身份與行為規範</h2>
      <p>本平台歡迎曾經服刑、戒癮、感化、接受司法保護、霸凌或因社會排斥而渴望重新開始的個人註冊使用。</p>
      <p>為確保社群安全與信任，嚴禁下列行為：</p>
      <ul>
        <li>冒用他人身份或誤導他人註冊資料</li>
        <li>散佈仇恨、歧視、暴力、色情、違法內容</li>
        <li>上傳侵犯他人肖像權或機敏資料的圖片</li>
      </ul>
      <p>違反上述條款者，平台有權立即中止其帳號與使用權限。</p>
      <h2>三、AI 使用與責任聲明</h2>
      <p>平台所提供的 AI 對話、建議與角色模擬，僅供陪伴、練習與個人成長參考，不構成法律、醫療或心理專業意見。</p>
      <ul>
        <li>平台不對使用者依據 AI 輸出所做的決策承擔法律責任</li>
        <li>平台不保證 AI 對話完全正確或與真實情境一致</li>
        <li>請勿將 AI 對話內容散佈作為公共引用資訊</li>
      </ul>
      <p>我們已設置基本風險過濾與話術限制，但 AI 存在輸出偏差或感受誤解的可能。</p>
      <p>若遇到不適當內容，請透過回報機制通知我們，我們將持續優化模型。</p>
      <h3>三之一、AI 對話內容使用規範</h3>
      <ul>
        <li>不得詢問或輸入他人私密資訊（如住址、犯罪紀錄）</li>
        <li>不得操作 AI 模擬暴力、自殘或誘導非法行為</li>
        <li>不得以 Restarter™ 名義散佈虛假或詐騙訊息</li>
        <li>所有對話資料僅用於匿名模型優化，不作個人追蹤</li>
        <li>如有必要，平台保留法律配合義務</li>
        <li>未滿十八歲使用者，需經家長同意方可使用本平台</li>
        <li>本平台禁止自動爬蟲或未授權系統串接</li>
        <li>使用者需自負資料輸入內容之法律風險</li>
          </ul>
      <h2>四、資料處理與隱私權聲明</h2>
      <p>平台僅會蒐集註冊所需最基本資料，如暱稱、電子信箱與使用語言偏好。</p>
      <p>所有資料經加密儲存，不會轉售第三方或做商業行銷使用。</p>
      <p>使用者可隨時申請帳號刪除，並請求系統清除其所有紀錄。</p>
      <h2>五、帳號停用與終止權利</h2>
      <p>平台保留中止任何違反本條款使用者帳號的權利，且無須事前通知。</p>
      <p>如帳號長期未使用，平台將主動發出提醒並保留停用處理權限。</p>
      <p>用戶可自行隨時停用帳號並刪除所有資料紀錄。</p>
      <h2>六、本條款之調整與最終解釋權</h2>
      <p>平台有權依據法律、政策與服務優化隨時修改本條款內容。</p>
      <p>重大異動將透過站內公告與電子郵件通知用戶。</p>
      <p>本條款之最終解釋權歸 Restarter™ 平台所有。</p>
    </div>
  ),
  'zh-CN': (
    <div>
      <h1>Restarter™ 使用条款与更生者声明</h1>
      <h2>一、平台理念声明</h2>
      <p>Restarter™ 是帮助更生人社会、心理、生活自信恢复的 AI 平台。我们通过情感引导、角色扮演、任务挑战，协助用户释放负面情绪、重建目标与自信，并引导用户逐步建立内在动力与行动信心。</p>
      <p>我们相信每一位更生人都值得被尊重与重新认识。即使你曾经犯错，在这里不再被贴标签。</p>
      <h2>二、用户身份与行为规范</h2>
      <p>本平台欢迎曾经服刑、戒瘾、感化、接受司法保护、霸凌或因社会排斥而渴望重新开始的个人注册使用。</p>
      <p>为确保社群安全与信任，严禁下列行为：</p>
      <ul>
        <li>冒用他人身份或误导他人注册资料</li>
        <li>散布仇恨、歧视、暴力、色情、违法内容</li>
        <li>上传侵犯他人肖像权或敏感资料的图片</li>
      </ul>
      <p>违反上述条款者，平台有权立即中止其账号与使用权限。</p>
      <h2>三、AI 使用与责任声明</h2>
      <p>平台所提供的 AI 对话、建议与角色模拟，仅供陪伴、练习与个人成长参考，不构成法律、医疗或心理专业意见。</p>
      <ul>
        <li>平台不对用户依据 AI 输出所做的决策承担法律责任</li>
        <li>平台不保证 AI 对话完全正确或与真实情境一致</li>
        <li>请勿将 AI 对话内容散布作为公共引用信息</li>
      </ul>
      <p>我们已设置基本风险过滤与话术限制，但 AI 存在输出偏差或感受误解的可能。</p>
      <p>若遇到不适当内容，请通过举报机制通知我们，我们将持续优化模型。</p>
      <h3>三之一、AI 对话内容使用规范</h3>
      <ul>
        <li>不得询问或输入他人私密信息（如住址、犯罪记录）</li>
        <li>不得操作 AI 模拟暴力、自残或诱导非法行为</li>
        <li>不得以 Restarter™ 名义散布虚假或诈骗信息</li>
        <li>全对话资料仅用于匿名模型优化，不作个人追踪</li>
        <li>如有必要，平台保留法律配合义务</li>
        <li>未满十八岁用户，需经家长同意方可使用本平台</li>
        <li>本平台禁止自动爬虫或未授权系统串接</li>
        <li>用户需自负资料输入内容之法律风险</li>
          </ul>
      <h2>四、资料处理与隐私权声明</h2>
      <p>平台仅会收集注册所需最基本资料，如昵称、电子邮箱与使用语言偏好。</p>
      <p>所有资料经加密存储，不会转售第三方或做商业营销使用。</p>
      <p>用户可随时申请账号删除，并请求系统清除其所有记录。</p>
      <h2>五、账号停用与终止权利</h2>
      <p>平台保留中止任何违反本条款用户账号的权利，且无需事前通知。</p>
      <p>如账号长期未使用，平台将主动发出提醒并保留停用处理权限。</p>
      <p>用户可自行随时停用账号并删除所有资料记录。</p>
      <h2>六、本条款之调整与最终解释权</h2>
      <p>平台有权依据法律、政策与服务优化随时修改本条款内容。</p>
      <p>重大变动将通过站内公告与电子邮件通知用户。</p>
      <p>本条款之最终解释权归 Restarter™ 平台所有。</p>
    </div>
  ),
  'en': (
    <div>
      <h1>Restarter™ Terms of Use and Ex-Offender Declaration</h1>
      <h2>1. Platform Philosophy Statement</h2>
      <p>Restarter™ is an AI platform dedicated to helping ex-offenders rebuild social, psychological, and life confidence. Through emotional guidance, role-playing, and task challenges, we help users release negative emotions, rebuild goals and confidence, and guide them to gradually build inner motivation and action confidence.</p>
      <p>We believe that every ex-offender deserves respect and a new recognition. Even if you have made mistakes, you will not be labeled here.</p>
      <h2>2. User Identity and Code of Conduct</h2>
      <p>This platform welcomes individuals who have served sentences, undergone rehabilitation, received judicial protection, experienced bullying, or wish to start over due to social exclusion.</p>
      <p>To ensure community safety and trust, the following behaviors are strictly prohibited:</p>
      <ul>
        <li>Impersonating others or providing misleading registration information</li>
        <li>Spreading hate, discrimination, violence, pornography, or illegal content</li>
        <li>Uploading images that infringe on others' portrait rights or sensitive data</li>
      </ul>
      <p>Those who violate the above terms may have their accounts and access immediately terminated by the platform.</p>
      <h2>3. AI Usage and Responsibility Statement</h2>
      <p>The AI dialogues, suggestions, and role simulations provided by the platform are for companionship, practice, and personal growth reference only, and do not constitute legal, medical, or psychological professional advice.</p>
      <ul>
        <li>The platform is not legally responsible for decisions made by users based on AI output</li>
        <li>The platform does not guarantee that AI dialogues are completely accurate or consistent with real situations</li>
        <li>Do not distribute AI dialogue content as public reference information</li>
      </ul>
      <p>We have set up basic risk filtering and dialogue restrictions, but AI may still produce biased or misunderstood outputs.</p>
      <p>If you encounter inappropriate content, please notify us through the reporting mechanism, and we will continue to optimize the model.</p>
      <h3>3.1 AI Dialogue Content Usage Guidelines</h3>
      <ul>
        <li>Do not ask for or input others' private information (such as address or criminal record)</li>
        <li>Do not use AI to simulate violence, self-harm, or induce illegal behavior</li>
        <li>Do not distribute false or fraudulent information in the name of Restarter™</li>
        <li>All dialogue data is used only for anonymous model optimization, not for personal tracking</li>
        <li>The platform reserves the right to cooperate with legal authorities if necessary</li>
        <li>Users under 18 must have parental consent to use this platform</li>
        <li>The platform prohibits automated crawling or unauthorized system integration</li>
        <li>Users are responsible for the legal risks of the content they input</li>
          </ul>
      <h2>4. Data Processing and Privacy Statement</h2>
      <p>The platform only collects the most basic registration information, such as nickname, email, and language preference.</p>
      <p>All data is stored encrypted and will not be sold to third parties or used for commercial marketing.</p>
      <p>Users can request account deletion at any time and ask the system to clear all their records.</p>
      <h2>5. Account Suspension and Termination Rights</h2>
      <p>The platform reserves the right to terminate any user's account that violates these terms at any time without prior notice.</p>
      <p>If an account is inactive for a long period, the platform will proactively send reminders and reserves the right to suspend the account.</p>
      <p>Users can deactivate their accounts and delete all data records at any time.</p>
      <h2>6. Amendments and Final Interpretation</h2>
      <p>The platform reserves the right to modify these terms at any time in accordance with laws, policies, and service optimization.</p>
      <p>Major changes will be announced on the platform and via email notifications to users.</p>
      <p>The final interpretation of these terms belongs to the Restarter™ platform.</p>
    </div>
  ),
  'ja': (
    <div>
      <h1>Restarter™ 利用規約および更生者宣言</h1>
      <h2>1. プラットフォーム理念声明</h2>
      <p>Restarter™ は更生者の社会的・心理的・生活的自信の回復を支援するAIプラットフォームです。感情ガイダンス、ロールプレイ、タスクチャレンジを通じて、ユーザーがネガティブな感情を解放し、目標と自信を再構築し、内面の動機と行動への自信を段階的に築くことをサポートします。</p>
      <p>私たちは、すべての更生者が尊重され、新たに認識される価値があると信じています。過去に過ちを犯したとしても、ここではラベルを貼られません。</p>
      <h2>2. ユーザーの身分と行動規範</h2>
      <p>本プラットフォームは、服役経験者、依存症克服者、感化・司法保護を受けた方、いじめや社会的排除を経験し再出発を望む方の登録を歓迎します。</p>
      <p>コミュニティの安全と信頼を守るため、以下の行為を厳禁とします：</p>
      <ul>
        <li>他人の身分を詐称または誤った登録情報の提供</li>
        <li>憎悪・差別・暴力・ポルノ・違法コンテンツの拡散</li>
        <li>他人の肖像権や機密情報を侵害する画像のアップロード</li>
      </ul>
      <p>上記規約に違反した場合、プラットフォームは直ちにアカウントと利用権限を停止する権利を有します。</p>
      <h2>3. AI利用と責任声明</h2>
      <p>本プラットフォームが提供するAI対話・提案・ロールプレイは、伴走・練習・自己成長の参考用であり、法的・医療的・心理的な専門アドバイスではありません。</p>
      <ul>
        <li>AI出力に基づく意思決定に対し、プラットフォームは法的責任を負いません</li>
        <li>AI対話が常に正確または現実と一致することを保証しません</li>
        <li>AI対話内容を公共の引用情報として拡散しないでください</li>
      </ul>
      <p>基本的なリスクフィルタと発話制限を設けていますが、AIには出力の偏りや誤解が生じる可能性があります。</p>
      <p>不適切な内容に遭遇した場合は、報告機能からご連絡ください。モデルの最適化に努めます。</p>
      <h3>3.1 AI対話内容の利用規範</h3>
      <ul>
        <li>他人の個人情報（住所・犯罪歴等）を尋ねたり入力しない</li>
        <li>AIで暴力・自傷・違法行為を模擬しない</li>
        <li>Restarter™名義で虚偽・詐欺情報を拡散しない</li>
        <li>全対話データは匿名モデル最適化のみに利用し、個人追跡はしません</li>
        <li>必要に応じて法的協力義務を負います</li>
        <li>未満18歳の方は保護者の同意が必要です</li>
        <li>自動クローラーや未承認システム連携は禁止します</li>
        <li>入力内容の法的リスクは利用者自身が負います</li>
          </ul>
      <h2>4. データ処理とプライバシー声明</h2>
      <p>登録時に必要最低限の情報（ニックネーム・メール・言語設定）のみ収集します。</p>
      <p>全データは暗号化保存され、第三者への販売や商用利用はしません。</p>
      <p>アカウント削除申請と全記録の消去依頼がいつでも可能です。</p>
      <h2>5. アカウント停止と終了権利</h2>
      <p>本規約違反者のアカウントは、事前通知なく停止できる権利を有します。</p>
      <p>長期間未使用の場合、リマインダー送信や停止処理権限を保持します。</p>
      <p>利用者はいつでもアカウント停止・全データ削除が可能です。</p>
      <h2>6. アカウント停止と終了権利</h2>
      <p>本規約違反者のアカウントは、事前通知なく停止できる権利を有します。</p>
      <p>長期間未使用の場合、リマインダー送信や停止処理権限を保持します。</p>
      <p>利用者はいつでもアカウント停止・全データ削除が可能です。</p>
      <h2>6. 本規約の改定と最終解釈権</h2>
      <p>法令・政策・サービス最適化に応じて本規約を随時改定します。</p>
      <p>重大な変更はサイト告知やメールで通知します。</p>
      <p>最終解釈権はRestarter™プラットフォームに帰属します。</p>
    </div>
  ),
  'ko': (
    <div>
      <h1>Restarter™ 이용약관 및 갱생자 선언</h1>
      <h2>1. 플랫폼 이념 선언</h2>
      <p>Restarter™는 갱생인의 사회적, 심리적, 생활적 자신감 회복을 돕는 AI 플랫폼입니다. 감정 안내, 역할극, 과제 도전을 통해 사용자가 부정적 감정을 해소하고 목표와 자신감을 재구축하며, 내면 동기와 행동 자신감을 단계적으로 쌓을 수 있도록 지원합니다.</p>
      <p>우리는 모든 갱생인이 존중받고 새롭게 인식받을 가치가 있다고 믿습니다. 과거에 실수했더라도 여기서는 낙인찍지 않습니다.</p>
      <h2>2. 사용자 신분 및 행동 규범</h2>
      <p>본 플랫폼은 형을 마친 자, 중독을 극복한 자, 감화를 받은 자, 사법 보호를 받은 자, 따돌림이나 사회적 배제를 경험하고 재출발을 원하는 자의 가입을 환영합니다.</p>
      <p>커뮤니티의 안전과 신뢰를 위해 다음 행위를 엄격히 금지합니다:</p>
      <ul>
        <li>타인 신분 도용 또는 허위 등록 정보 제공</li>
        <li>증오, 차별, 폭력, 음란, 불법 콘텐츠 유포</li>
        <li>타인의 초상권 또는 민감 정보 침해 이미지 업로드</li>
      </ul>
      <p>위 조항 위반 시 플랫폼은 즉시 계정 및 이용 권한을 중지할 수 있습니다.</p>
      <h2>3. AI 이용 및 책임 선언</h2>
      <p>플랫폼이 제공하는 AI 대화, 제안, 역할 시뮬레이션은 동반, 연습, 자기 성장 참고용이며, 법률·의료·심리 전문가의 조언이 아닙니다.</p>
      <ul>
        <li>플랫폼은 AI에 따른 결정에 대해 법적 책임을 지지 않습니다</li>
        <li>플랫폼은 AI 대화가 항상 정확하거나 실제와 일치함을 보장하지 않습니다</li>
        <li>AI 대화 내용을 공공 인용 정보로 유포하지 마십시오</li>
      </ul>
      <p>기본 위험 필터와 발화 제한을 두었으나, AI는 편향되거나 오해를 불러일으킬 수 있습니다.</p>
      <p>부적절한 내용 발견 시 신고 기능을 통해 알려주시면 지속적으로 모델을 개선하겠습니다.</p>
      <h3>3.1 AI 대화 내용 이용 규범</h3>
      <ul>
        <li>타인 개인정보(주소, 범죄기록 등) 문의·입력 금지</li>
        <li>AI로 폭력·자해·불법행위 모의 금지</li>
        <li>Restarter™ 명의로 허위·사기 정보 유포 금지</li>
        <li>모든 대화 데이터는 익명 모델 최적화에만 사용, 개인 추적 불가</li>
        <li>필요시 법적 협조 의무 보유</li>
        <li>18세 미만은 부모 동의 필요</li>
        <li>자동 크롤러·미승인 시스템 연동 금지</li>
        <li>입력 내용의 법적 책임은 사용자 본인에게 있음</li>
          </ul>
      <h2>4. 데이터 처리 및 개인정보 보호</h2>
      <p>가입 시 닉네임, 이메일, 언어 설정 등 최소 정보만 수집합니다.</p>
      <p>모든 데이터는 암호화 저장되며, 제3자 판매·상업적 이용은 없습니다.</p>
      <p>언제든 계정 삭제 및 기록 삭제 요청 가능</p>
      <h2>5. 계정 정지 및 종료 권리</h2>
      <p>플랫폼은 본 약관 위반 계정을 사전 통보 없이 정지할 수 있습니다.</p>
      <p>장기간 미사용 시 알림 발송 및 정지 처리 권한 보유</p>
      <p>사용자는 언제든 계정 정지 및 데이터 삭제 가능</p>
      <h2>6. 약관 개정 및 최종 해석권</h2>
      <p>법령·정책·서비스 최적화에 따라 약관을 수시로 개정할 수 있습니다.</p>
      <p>중대한 변경은 사이트 공지 및 이메일로 안내</p>
      <p>최종 해석권은 Restarter™ 플랫폼에 있음</p>
    </div>
  ),
  'th': (
    <div>
      <h1>Restarter™ ข้อกำหนดการใช้งานและประกาศสำหรับผู้กลับตัว</h1>
      <h2>1. ปรัชญาแพลตฟอร์ม</h2>
      <p>Restarter™ เป็นแพลตฟอร์ม AI ที่ช่วยฟื้นฟูความมั่นใจทางสังคม จิตใจ และชีวิตของผู้กลับตัว ผ่านการชี้นำทางอารมณ์ บทบาทสมมติ และภารกิจท้าทาย เพื่อช่วยให้ผู้ใช้ปลดปล่อยอารมณ์ลบ สร้างเป้าหมายและความมั่นใจ และสร้างแรงบันดาลใจภายในและความมั่นใจในการลงมือทำ</p>
      <p>เราเชื่อว่าทุกคนที่กลับตัวสมควรได้รับความเคารพและการยอมรับใหม่ แม้คุณจะเคยทำผิด ที่นี่จะไม่มีใครติดป้ายคุณอีก</p>
      <h2>2. ตัวตนและข้อปฏิบัติของผู้ใช้</h2>
      <p>แพลตฟอร์มนี้ยินดีต้อนรับผู้ที่เคยต้องโทษ เลิกยา ฟื้นฟู ได้รับการคุ้มครองทางกฎหมาย ถูกกลั่นแกล้ง หรือถูกกีดกันทางสังคมและต้องการเริ่มต้นใหม่</p>
      <p>เพื่อความปลอดภัยและความไว้วางใจในชุมชน ห้ามกระทำดังต่อไปนี้อย่างเด็ดขาด:</p>
      <ul>
        <li>แอบอ้างตัวตนหรือให้ข้อมูลสมัครสมาชิกที่ทำให้เข้าใจผิด</li>
        <li>เผยแพร่ความเกลียดชัง การเลือกปฏิบัติ ความรุนแรง สื่อลามก หรือเนื้อหาผิดกฎหมาย</li>
        <li>อัปโหลดภาพที่ละเมิดสิทธิ์ในภาพบุคคลหรือข้อมูลสำคัญของผู้อื่น</li>
      </ul>
      <p>หากฝ่าฝืนข้อกำหนดข้างต้น แพลตฟอร์มมีสิทธิ์ระงับบัญชีและสิทธิ์การใช้งานทันที</p>
      <h2>3. การใช้ AI และคำประกาศความรับผิดชอบ</h2>
      <p>AI ที่แพลตฟอร์มให้บริการใช้สำหรับการพูดคุย แนะนำ และจำลองสถานการณ์เพื่อการฝึกฝนและพัฒนาตนเองเท่านั้น ไม่ถือเป็นคำแนะนำทางกฎหมาย การแพทย์ หรือจิตวิทยา</p>
      <ul>
        <li>แพลตฟอร์มไม่รับผิดชอบทางกฎหมายต่อการตัดสินใจที่เกิดจาก AI</li>
        <li>แพลตฟอร์มไม่รับประกันว่า AI จะถูกต้องสมบูรณ์หรือสอดคล้องกับสถานการณ์จริงเสมอไป</li>
        <li>ห้ามนำเนื้อหาการสนทนา AI ไปเผยแพร่เป็นข้อมูลอ้างอิงสาธารณะ</li>
      </ul>
      <p>แม้จะมีการกรองความเสี่ยงและจำกัดเนื้อหาแล้ว AI อาจยังมีความคลาดเคลื่อนหรือเข้าใจผิดได้</p>
      <p>หากพบเนื้อหาไม่เหมาะสม กรุณาแจ้งผ่านระบบรายงาน เราจะปรับปรุงโมเดลอย่างต่อเนื่อง</p>
      <h3>3.1 ข้อกำหนดการใช้เนื้อหาการสนทนา AI</h3>
      <ul>
        <li>ห้ามสอบถามหรือกรอกข้อมูลส่วนตัวของผู้อื่น (เช่น ที่อยู่ ประวัติอาชญากรรม)</li>
        <li>ห้ามใช้ AI จำลองความรุนแรง ทำร้ายตนเอง หรือชักจูงให้กระทำผิดกฎหมาย</li>
        <li>ห้ามใช้ชื่อ Restarter™ เผยแพร่ข้อมูลเท็จหรือหลอกลวง</li>
        <li>ข้อมูลการสนทนาทั้งหมดใช้เพื่อปรับปรุงโมเดลแบบไม่ระบุตัวตนเท่านั้น ไม่ติดตามตัวบุคคล</li>
        <li>หากจำเป็น แพลตฟอร์มขอสงวนสิทธิ์ให้ความร่วมมือทางกฎหมาย</li>
        <li>ผู้ใช้ที่อายุต่ำกว่า 18 ปี ต้องได้รับความยินยอมจากผู้ปกครอง</li>
        <li>ห้ามใช้บอทหรือเชื่อมต่อระบบโดยไม่ได้รับอนุญาต</li>
        <li>ผู้ใช้ต้องรับผิดชอบความเสี่ยงทางกฎหมายของข้อมูลที่กรอกเอง</li>
          </ul>
      <h2>4. การจัดการข้อมูลและนโยบายความเป็นส่วนตัว</h2>
      <p>แพลตฟอร์มจะเก็บเฉพาะข้อมูลที่จำเป็นสำหรับการสมัคร เช่น ชื่อเล่น อีเมล และภาษาที่ใช้</p>
      <p>ข้อมูลทั้งหมดจะถูกเข้ารหัสและไม่ขายให้บุคคลที่สามหรือใช้เพื่อการตลาด</p>
      <p>ผู้ใช้สามารถขอลบบัญชีและข้อมูลทั้งหมดได้ตลอดเวลา</p>
      <h2>5. สิทธิ์ในการระงับและยกเลิกบัญชี</h2>
      <p>แพลตฟอร์มขอสงวนสิทธิ์ในการระงับบัญชีผู้ใช้ที่ละเมิดข้อกำหนดโดยไม่ต้องแจ้งล่วงหน้า</p>
      <p>หากบัญชีไม่ได้ใช้งานเป็นเวลานาน แพลตฟอร์มจะส่งการแจ้งเตือนและขอสงวนสิทธิ์ในการระงับบัญชี</p>
      <p>ผู้ใช้สามารถระงับบัญชีและลบข้อมูลได้ตลอดเวลา</p>
      <h2>6. การปรับปรุงและการตีความข้อกำหนด</h2>
      <p>แพลตฟอร์มมีสิทธิ์ปรับปรุงข้อกำหนดนี้ได้ตลอดเวลาเพื่อให้สอดคล้องกับกฎหมาย นโยบาย และการให้บริการ</p>
      <p>การเปลี่ยนแปลงสำคัญจะแจ้งให้ผู้ใช้ทราบผ่านประกาศในระบบและอีเมล</p>
      <p>สิทธิ์ในการตีความข้อกำหนดนี้เป็นของแพลตฟอร์ม Restarter™</p>
    </div>
  ),
  'vi': (
    <div>
      <h1>Restarter™ Điều khoản sử dụng và Tuyên bố hoàn lương</h1>
      <h2>1. Tuyên bố triết lý nền tảng</h2>
      <p>Restarter™ là nền tảng AI giúp người hoàn lương xây dựng lại sự tự tin xã hội, tâm lý và cuộc sống. Thông qua hướng dẫn cảm xúc, nhập vai và thử thách nhiệm vụ, chúng tôi giúp người dùng giải tỏa cảm xúc tiêu cực, xây dựng lại mục tiêu và sự tự tin, đồng thời hướng dẫn người dùng từng bước xây dựng động lực nội tại và sự tự tin hành động.</p>
      <p>Chúng tôi tin rằng mọi người hoàn lương đều xứng đáng được tôn trọng và công nhận lại. Dù bạn từng mắc sai lầm, ở đây bạn sẽ không bị dán nhãn.</p>
      <h2>2. Danh tính và quy tắc hành vi của người dùng</h2>
      <p>Nền tảng này chào đón những người từng bị kết án, men thuốc, correctionem acceperunt, tutela iudiciali fruuntur, vexationem passi sunt, aut ob exclusionem socialem iterum incipere cupiunt.</p>
      <p>Bagi memastikan keselamatan dan kepercayaan komuniti, haec acta stricte vetantur:</p>
      <ul>
        <li>Personae alienae simulationem aut falsam informationem praebere</li>
        <li>Odium, discriminationem, violentiam, pornographiam, contenta illicita disseminare</li>
        <li>Imagines iura aliorum vel data sensitiva violantes onerare</li>
      </ul>
      <p>Qui haec violaverint, suggestum statim rationem et usum intercludere potest.</p>
      <h2>3. Usus AI et Declaratio Responsabilitatis</h2>
      <p>Colloquia, consilia, simulationesque AI a suggesto praebita tantum ad comitatum, exercitationem, progressionemque personalem spectant, non ad consilium legale, medicum, psychologicumque.</p>
      <ul>
        <li>Suggestum non tenetur de decisionibus ex AI ortis</li>
        <li>Non praestat colloquia AI semper recta aut实实在在congruentia esse</li>
        <li>Ne dissemines colloquia AI ut informationem publicam</li>
      </ul>
      <p>Filtra periculorum et restrictiones sermonum posuimus, sed AI adhuc praeiudicium aut errorem gignere potest.</p>
      <p>Si quid incommodum inveneris, per mechanismum referendi nos certiorem facias; modelum continue emendabimus.</p>
      <h3>3.1 Praecepta Usus Colloquiorum AI</h3>
      <ul>
        <li>Ne quaeras aut inseras informationes privatas aliorum (ut domicilium, delicta)</li>
        <li>Ne AI adhibeas ad violentiam, sui laesionem, aut actus illicitos simulandos</li>
        <li>Ne dissemines falsa aut fraudulenta sub nomine Restarter™</li>
        <li>Omnia colloquia ad optimizationem anonymam tantum, non ad tracking personalem</li>
        <li>Suggestum, si opus sit, cum auctoritatibus legalibus cooperabitur</li>
        <li>Usoribus minoribus XVIII annis consensus parentum requiritur</li>
        <li>Automata aut systemata non auctorata vetantur</li>
        <li>Usor ipse de periculis legalibus contentorum suorum respondet</li>
          </ul>
      <h2>4. Processus Datae et Declaratio Privacy</h2>
      <p>Suggestum tantum colligit notitias adnotationis fundamentales, ut cognomen, email, linguam praeoptatam.</p>
      <p>Omnia data cryptate servantur nec tertiis partibus venduntur nec ad mercaturam adhibentur.</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>5. Ius Suspensionis et Terminationis Rationis</h2>
      <p>Suggestum ius habet rationem usoris qui haec violat statim sine praevia notitia suspendere</p>
      <p>Si ratio diu non utatur, suggestum admonitionem mittet et ius suspensionis retinebit</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>6. Emendationes et Interpretatio Finalis</h2>
      <p>Suggestum ius habet haec emendandi pro legibus, consiliis, et optimizatione servitii</p>
      <p>Mutationes maximi momenti per systema et email nuntiabuntur</p>
      <p>Ius interpretationis finalis harum condicionum Restarter™ suggestui reservatur</p>
    </div>
  ),
  'ms': (
    <div>
      <h1>Restarter™ Terma Penggunaan dan Pengisytiharan Bekas Banduan</h1>
      <h2>1. Kenyataan Falsafah Platform</h2>
      <p>Restarter™ ialah platform AI yang membantu bekas banduan membina semula keyakinan sosial, psikologi dan kehidupan. Melalui bimbingan emosi, lakonan peranan dan cabaran tugasan, kami membantu pengguna melepaskan emosi negatif, membina semula matlamat dan keyakinan, serta membimbing mereka membina motivasi dalaman dan keyakinan bertindak secara berperingkat.</p>
      <p>Kami percaya setiap bekas banduan layak dihormati dan diiktiraf semula. Etiamsi peccaveris, hic non amplius notaberis.</p>
      <h2>2. Identiti dan Tatakelakuan Pengguna</h2>
      <p>Platform ini mengalu-alukan individu yang pernah dipenjarakan, abusus vicerunt, correctionem acceperunt, tutela iudiciali fruuntur, vexationem passi sunt, aut ob exclusionem socialem iterum incipere cupiunt.</p>
      <p>Bagi memastikan keselamatan dan kepercayaan komuniti, haec acta stricte vetantur:</p>
      <ul>
        <li>Personae alienae simulationem aut falsam informationem praebere</li>
        <li>Odium, discriminationem, violentiam, pornographiam, contenta illicita disseminare</li>
        <li>Imagines iura aliorum vel data sensitiva violantes onerare</li>
      </ul>
      <p>Qui haec violaverint, suggestum statim rationem et usum intercludere potest.</p>
      <h2>3. Usus AI et Declaratio Responsabilitatis</h2>
      <p>Colloquia, consilia, simulationesque AI a suggesto praebita tantum ad comitatum, exercitationem, progressionemque personalem spectant, non ad consilium legale, medicum, psychologicumque.</p>
      <ul>
        <li>Suggestum non tenetur de decisionibus ex AI ortis</li>
        <li>Non praestat colloquia AI semper recta aut实实在在congruentia esse</li>
        <li>Ne dissemines colloquia AI ut informationem publicam</li>
      </ul>
      <p>Filtra periculorum et restrictiones sermonum posuimus, sed AI adhuc praeiudicium aut errorem gignere potest.</p>
      <p>Si quid incommodum inveneris, per mechanismum referendi nos certiorem facias; modelum continue emendabimus.</p>
      <h3>3.1 Praecepta Usus Colloquiorum AI</h3>
      <ul>
        <li>Ne quaeras aut inseras informationes privatas aliorum (ut domicilium, delicta)</li>
        <li>Ne AI adhibeas ad violentiam, sui laesionem, aut actus illicitos simulandos</li>
        <li>Ne dissemines falsa aut fraudulenta sub nomine Restarter™</li>
        <li>Omnia colloquia ad optimizationem anonymam tantum, non ad tracking personalem</li>
        <li>Suggestum, si opus sit, cum auctoritatibus legalibus cooperabitur</li>
        <li>Usoribus minoribus XVIII annis consensus parentum requiritur</li>
        <li>Automata aut systemata non auctorata vetantur</li>
        <li>Usor ipse de periculis legalibus contentorum suorum respondet</li>
          </ul>
      <h2>4. Processus Datae et Declaratio Privacy</h2>
      <p>Suggestum tantum colligit notitias adnotationis fundamentales, ut cognomen, email, linguam praeoptatam.</p>
      <p>Omnia data cryptate servantur nec tertiis partibus venduntur nec ad mercaturam adhibentur.</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>5. Ius Suspensionis et Terminationis Rationis</h2>
      <p>Suggestum ius habet rationem usoris qui haec violat statim sine praevia notitia suspendere</p>
      <p>Si ratio diu non utatur, suggestum admonitionem mittet et ius suspensionis retinebit</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>6. Emendationes et Interpretatio Finalis</h2>
      <p>Suggestum ius habet haec emendandi pro legibus, consiliis, et optimizatione servitii</p>
      <p>Mutationes maximi momenti per systema et email nuntiabuntur</p>
      <p>Ius interpretationis finalis harum condicionum Restarter™ suggestui reservatur</p>
    </div>
  ),
  'la': (
    <div>
      <h1>Restarter™ Condiciones Usus et Declaratio Redemptorum</h1>
      <h2>1. Propositum et Philosophia</h2>
      <p>Restarter™ est suggestum AI adiuuans redemptos fiduciam socialem, animi, vitae restituere. Per ductum animi, partes simulandas, provocationesque, utentes adiuvat ad vitia superanda, metas restituendas, fiduciamque recuperandam, simulque gradatim motivum internum et fiduciam agendi aedificare.</p>
      <p>Censemus omnes redemptos dignos esse honore et recognitione nova. Etiamsi peccaveris, hic non amplius notaberis.</p>
      <h2>2. Identitas et Regulae Usoris</h2>
      <p>Haec suggestum recipit eos qui poenam egerunt, abusus vicerunt, correctionem acceperunt, tutela iudiciali fruuntur, vexationem passi sunt, aut ob exclusionem socialem iterum incipere cupiunt.</p>
      <p>Ad salutem et fidem communitatis tuendam, haec acta stricte vetantur:</p>
      <ul>
        <li>Personae alienae simulationem aut falsam informationem praebere</li>
        <li>Odium, discriminationem, violentiam, pornographiam, contenta illicita disseminare</li>
        <li>Imagines iura aliorum vel data sensitiva violantes onerare</li>
          </ul>
      <p>Qui haec violaverint, suggestum statim rationem et usum intercludere potest.</p>
      <h2>3. Usus AI et Declaratio Responsabilitatis</h2>
      <p>Colloquia, consilia, simulationesque AI a suggesto praebita tantum ad comitatum, exercitationem, progressionemque personalem spectant, non ad consilium legale, medicum, psychologicumque.</p>
      <ul>
        <li>Suggestum non tenetur de decisionibus ex AI ortis</li>
        <li>Non praestat colloquia AI semper recta aut实实在在congruentia esse</li>
        <li>Ne dissemines colloquia AI ut informationem publicam</li>
          </ul>
      <p>Filtra periculorum et restrictiones sermonum posuimus, sed AI adhuc praeiudicium aut errorem gignere potest.</p>
      <p>Si quid incommodum inveneris, per mechanismum referendi nos certiorem facias; modelum continue emendabimus.</p>
      <h3>3.1 Praecepta Usus Colloquiorum AI</h3>
      <ul>
        <li>Ne quaeras aut inseras informationes privatas aliorum (ut domicilium, delicta)</li>
        <li>Ne AI adhibeas ad violentiam, sui laesionem, aut actus illicitos simulandos</li>
        <li>Ne dissemines falsa aut fraudulenta sub nomine Restarter™</li>
        <li>Omnia colloquia ad optimizationem anonymam tantum, non ad tracking personalem</li>
        <li>Suggestum, si opus sit, cum auctoritatibus legalibus cooperabitur</li>
        <li>Usoribus minoribus XVIII annis consensus parentum requiritur</li>
        <li>Automata aut systemata non auctorata vetantur</li>
        <li>Usor ipse de periculis legalibus contentorum suorum respondet</li>
              </ul>
      <h2>4. Processus Datae et Declaratio Privacy</h2>
      <p>Suggestum tantum colligit notitias adnotationis fundamentales, ut cognomen, email, linguam praeoptatam.</p>
      <p>Omnia data cryptate servantur nec tertiis partibus venduntur nec ad mercaturam adhibentur.</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>5. Ius Suspensionis et Terminationis Rationis</h2>
      <p>Suggestum ius habet rationem usoris qui haec violat statim sine praevia notitia suspendere</p>
      <p>Si ratio diu non utatur, suggestum admonitionem mittet et ius suspensionis retinebit</p>
      <p>Usor rationem suam et omnia data delere potest quovis tempore</p>
      <h2>6. Emendationes et Interpretatio Finalis</h2>
      <p>Suggestum ius habet haec emendandi pro legibus, consiliis, et optimizatione servitii</p>
      <p>Mutationes maximi momenti per systema et email nuntiabuntur</p>
      <p>Ius interpretationis finalis harum condicionum Restarter™ suggestui reservatur</p>
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

export default function TermsPage() {
  const [lang, setLang] = useState<LangType>((localStorage.getItem('lang') as LangType) || 'zh-TW');
  const navigate = useNavigate();

  useEffect(() => {
    const onStorage = () => setLang((localStorage.getItem('lang') as LangType) || 'zh-TW');
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const l = (localStorage.getItem('lang') as LangType) || 'zh-TW';
      if (l !== lang) setLang(l);
    }, 300);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <div style={{ minHeight: '100vh', background: '#111827', color: 'white', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
      <button
        onClick={() => navigate('/', { replace: true })}
        style={{ position: 'absolute', top: 32, left: 36, zIndex: 10, backgroundColor: '#374151', color: 'white', fontWeight: 'bold', padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: 16 }}>
        &larr; {BACK_TEXT[lang] || '返回'}
      </button>
      <div style={{ flex: '1 0 auto' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', color: '#111', borderRadius: 16, padding: 32, position: 'relative' }}>
          {TERMS[lang] as React.ReactNode}
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
          <span onClick={() => navigate("/privacy-policy")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>隱私權政策</span>
          <span onClick={() => navigate("/terms")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>條款/聲明</span>
          <span onClick={() => navigate("/data-deletion")} style={{ color: '#6B5BFF', textDecoration: 'underline', padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>資料刪除說明</span>
          <span onClick={() => navigate("/about")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>🧬 Restarter™｜我們是誰</span>
          <span onClick={() => navigate("/feedback")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>💬 意見箱｜我們想聽你說</span>
        </div>
      </div>
    </div>
  );
} 