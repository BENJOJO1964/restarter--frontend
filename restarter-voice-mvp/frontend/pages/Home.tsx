import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import app from '../src/firebaseConfig';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import { useTestMode } from '../App';
import WeatherWidget from '../components/WeatherWidget';


import type { LanguageCode } from '../contexts/LanguageContext';

// 移除重複的 LANGS 定義，使用 LanguageContext 中的

const TEXT: Record<string, { slogan: string[]; desc: string; wall: string; friend: string; voice: string; ai: string; tts: string; chat: string; emotion: string; welcomeRegister: string; }> = {
  'zh-TW': {
    slogan: ['找回信任的起點，重新出發不孤單！'],
    desc: 'Restarter™ 一個重啟人生的平台，這裡沒有標籤，只有理解。\n從「社會融入評估」開始，AI 將陪你走進十個關卡：情緒解鎖、心聲釋放、挑戰任務、交友連結……每一站都為了幫助你找回信任與方向。\n情緒來了不需要壓抑——專屬的情緒發洩遊戲區讓你不傷人更能盡情釋放壓力。\n你不是被定型的人，而是有勇氣重新選擇的人。\n在這裡，你可以放心說出自己的故事與情緒，找到解方，為自己活出下一章。',
    wall: '你可以放心說出自己的故事與心情，這裡有理解與同行。',
    friend: '心靈連結坊',
    voice: '即時語音輸入',
    ai: 'AI 風格回覆',
    tts: '擬真語音輸出',
    chat: '即時心聊',
    emotion: '情緒圖像實驗室',
    welcomeRegister: '歡迎註冊',
  },
  'zh-CN': {
    slogan: ['找回信任的起点，重新出发不孤单！'],
    desc: 'Restarter™ 一个重启人生的平台，这里没有标签，只有理解。\n从「社会融入评估」开始，AI 将陪你走进十个关卡：情绪解锁、心声释放、挑战任务、交友连结……每一站都为了帮助你找回信任与方向。\n情绪来了不需要压抑——专属的情绪发泄游戏区让你不伤人更能尽情释放压力。\n你不是被定型的人，而是有勇气重新选择的人。\n在这里，你可以放心说出自己的故事与情绪，找到解方，为自己活出下一章。',
    wall: '你可以放心说出自己的故事与心情，这里有理解与同行。',
    friend: '心灵连接坊',
    voice: '即时语音输入',
    ai: 'AI 风格回复',
    tts: '拟真语音输出',
    chat: '即时心聊',
    emotion: '情绪图像实验室',
    welcomeRegister: '欢迎注册',
  },
  'en': {
    slogan: ['Regain trust and start anew, you are never alone!'],
    desc: 'Restarter™ is a platform for restarting your life. Here, there are no labels, only understanding.\nStarting with "Social Integration Assessment", AI will accompany you through ten levels: emotional unlocking, voice release, challenging tasks, friend connections... every stop is to help you find trust and direction.\nWhen emotions come, there is no need to suppress them—a dedicated emotional release game zone allows you to fully release stress without harming others.\nYou are not a fixed person, but someone with the courage to choose again.\nHere, you can confidently tell your stories and emotions, find solutions, and live out your next chapter.',
    wall: 'You can safely share your story and feelings here, where you will find understanding and companionship.',
    friend: 'Soul Connection Workshop',
    voice: 'Voice Input',
    ai: 'AI Style Reply',
    tts: 'Realistic TTS',
    chat: 'Instant Heart Chat',
    emotion: 'Emotion Visual Lab',
    welcomeRegister: 'Welcome Register',
  },
  'ja': {
    slogan: ['信頼を取り戻し、新たな一歩を踏み出そう！'],
    desc: 'Restarter™は人生を再出発するためのプラットフォームです。ここにはラベルはなく、理解だけがあります。\n「社会的統合評価」から始まり、AIがあなたと一緒に10のレベルを進みます：感情の解放、心の声の解放、挑戦的なタスク、友達とのつながり... 各ステップはあなたが信頼と方向性を見つけるのを助けるためです。\n感情が湧いてきた時、それを抑える必要はありません——専用の感情解放ゲームゾーンで、他の人を傷つけることなくストレスを完全に解放できます。\nあなたは固定された人ではなく、再び選択する勇気を持つ人です。\nここでは、自分の物語と感情を安心して話し、解決策を見つけ、次の章を生きることができます。',
    wall: 'ここでは安心して自分のストーリーや気持ちを話せます。理解と共感がここにあります。',
    friend: '心のつながりワークショップ',
    voice: '音声入力',
    ai: 'AIスタイル返信',
    tts: 'リアルTTS',
    chat: '即座の心のチャット',
    emotion: '感情ビジュアルラボ',
    welcomeRegister: '登録へようこそ',
  },
  'ko': {
    slogan: ['신뢰를 되찾고, 새롭게 시작하세요. 당신은 결코 혼자가 아닙니다!'],
    desc: 'Restarter™는 인생을 재시작하는 플랫폼입니다. 이곳에는 낙인이 없고, 오직 이해만이 있습니다.\n「사회적 통합 평가」부터 시작하여 AI가 당신과 함께 10개의 레벨을 진행합니다: 감정 해방, 마음의 소리 해방, 도전적인 임무, 친구 연결... 각 정류장은 당신이 신뢰와 방향을 찾는 것을 돕기 위한 것입니다.\n감정이 올 때 그것을 억누를 필요가 없습니다——전용 감정 해방 게임 존에서 다른 사람을 다치게 하지 않고 스트레스를 완전히 해방할 수 있습니다.\n당신은 고정된 사람이 아니라 다시 선택할 용기를 가진 사람입니다.\n여기서는 자신의 이야기와 감정을 안심하고 말하고, 해결책을 찾아 다음 장을 살아갈 수 있습니다.',
    wall: '여기서는 자신의 이야기와 감정을 안심하고 말할 수 있습니다. 이곳에는 이해와 동행이 있습니다.',
    friend: '영혼 연결 워크숍',
    voice: '음성 입력',
    ai: 'AI 스타일 답장',
    tts: '현실적인 TTS',
    chat: '즉시 마음 채팅',
    emotion: '감정 비주얼 랩',
    welcomeRegister: '가입 환영',
  },
  'th': {
    slogan: ['เริ่มต้นใหม่ด้วยความไว้วางใจ คุณไม่ได้อยู่คนเดียว!'],
    desc: 'Restarter™ คือแพลตฟอร์มสำหรับเริ่มต้นชีวิตใหม่ ที่นี่ไม่มีป้ายกำกับ มีแต่ความเข้าใจ\nเริ่มต้นจาก「การประเมินการผสมผสานทางสังคม」AI จะอยู่เคียงข้างคุณผ่าน 10 ระดับ: การปลดล็อคอารมณ์ การปลดปล่อยเสียงในใจ งานท้าทาย การเชื่อมต่อเพื่อน... ทุกจุดหยุดเพื่อช่วยให้คุณค้นพบความไว้วางใจและทิศทาง\nเมื่ออารมณ์มา ไม่จำเป็นต้องกดดัน——โซนเกมปลดปล่อยอารมณ์เฉพาะช่วยให้คุณปลดปล่อยความเครียดได้อย่างเต็มที่โดยไม่ทำร้ายผู้อื่น\nคุณไม่ใช่คนที่ถูกกำหนดไว้ แต่เป็นคนที่มีความกล้าหาญที่จะเลือกใหม่\nที่นี่ คุณสามารถบอกเล่าเรื่องราวและอารมณ์ของตัวเองได้อย่างสบายใจ หาแนวทางแก้ไข และใช้ชีวิตบทถัดไป',
    wall: 'คุณสามารถพูดเรื่องราวและความรู้สึกของคุณได้อย่างสบายใจ ที่นี่มีความเข้าใจและเพื่อนร่วมทาง',
    friend: 'เวิร์กช็อปการเชื่อมต่อจิตวิญญาณ',
    voice: 'ป้อนข้อมูลด้วยเสียง',
    ai: 'ตอบกลับสไตล์ AI',
    tts: 'TTS ที่สมจริง',
    chat: 'แชทใจทันที',
    emotion: 'ห้องทดลองภาพอารมณ์',
    welcomeRegister: 'ยินดีต้อนรับการลงทะเบียน',
  },
  'vi': {
    slogan: ['Tìm lại niềm tin, bắt đầu lại, bạn không bao giờ đơn độc!'],
    desc: 'Restarter™ là nền tảng để làm lại cuộc đời. Ở đây không có nhãn mác, chỉ có sự thấu hiểu.\nBắt đầu từ「Đánh giá Hòa nhập Xã hội」, AI sẽ đồng hành cùng bạn qua 10 cấp độ: mở khóa cảm xúc, giải phóng tiếng nói nội tâm, nhiệm vụ thách thức, kết nối bạn bè... mỗi điểm dừng để giúp bạn tìm lại niềm tin và định hướng.\nKhi cảm xúc đến, không cần phải kìm nén——khu vực trò chơi giải phóng cảm xúc chuyên biệt cho phép bạn giải phóng căng thẳng hoàn toàn mà không làm tổn thương người khác.\nBạn không phải là người bị định hình, mà là người có dũng khí để lựa chọn lại.\nỞ đây, bạn có thể yên tâm chia sẻ câu chuyện và cảm xúc của mình, tìm ra giải pháp, và sống chương tiếp theo của cuộc đời.',
    wall: 'Bạn có thể yên tâm chia sẻ câu chuyện và cảm xúc của mình tại đây, nơi có sự thấu hiểu và đồng hành.',
    friend: 'Hội Thảo Kết Nối Tâm Hồn',
    voice: 'Nhập liệu bằng giọng nói',
    ai: 'Trả lời theo phong cách AI',
    tts: 'TTS thực tế',
    chat: 'Trò Chuyện Từ Trái Tim Ngay Lập Tức',
    emotion: 'Phòng thí nghiệm hình ảnh cảm xúc',
    welcomeRegister: 'Chào mừng đăng ký',
  },
  'ms': {
    slogan: ['Temui semula kepercayaan, mulakan semula, anda tidak pernah keseorangan!'],
    desc: 'Restarter™ ialah platform untuk memulakan semula kehidupan. Di sini tiada label, hanya pemahaman.\nBermula dari「Penilaian Integrasi Sosial」, AI akan menemani anda melalui 10 peringkat: membuka kunci emosi, melepaskan suara hati, tugas mencabar, sambungan rakan... setiap perhentian untuk membantu anda mencari kepercayaan dan arah tuju.\nApabila emosi datang, tidak perlu menekan——zon permainan pelepasan emosi khusus membolehkan anda melepaskan tekanan sepenuhnya tanpa mencederakan orang lain.\nAnda bukan orang yang ditetapkan, tetapi seseorang yang mempunyai keberanian untuk memilih semula.\nDi sini, anda boleh berkongsi kisah dan emosi anda dengan tenang, mencari penyelesaian, dan hidup bab seterusnya.',
    wall: 'Anda boleh berkongsi kisah dan perasaan anda dengan tenang di sini, di mana ada pemahaman dan teman seperjalanan.',
    friend: 'Bengkel Sambungan Jiwa',
    voice: 'Input Suara',
    ai: 'Balasan Gaya AI',
    tts: 'TTS Realistik',
    chat: 'Sembang Hati Segera',
    emotion: 'Makmal Visual Emosi',
    welcomeRegister: 'Selamat Datang Daftar',
  },
  'la': {
    slogan: ['Fidem recupera et iterum incipe, numquam solus es!'],
    desc: 'Restarter™ est suggestum ad vitam iterum incipiendam. Hic nullae notae sunt, tantum intellectus.\nIncipiendo ab「Aestimatio Integrationis Socialis」, AI tecum per decem gradus ambulabit: solutio affectuum, emissio vocis cordis, negotia provocantia, nexus amicorum... omnis statio ad te adiuvandum fidem et directionem inveniendam.\nCum affectus veniunt, non necesse est eos supprimere——zona ludi emissionis affectuum dedicata te sinit tensionem plene emittere sine aliis laedendis.\nTu non es homo fixus, sed qui audaciam habet iterum eligendi.\nHic, tuto fabulas tuas et affectus narrare potes, solutiones invenire, et proximum caput vivere.',
    wall: 'Hic tuto fabulas tuas et sensus tuos narrare potes: hic intellectus et comitatus invenies.',
    friend: 'Officina Nexus Animi',
    voice: 'Vox Input',
    ai: 'AI Stylus Responsio',
    tts: 'Verus TTS',
    chat: 'Colloquium Cordis Instantaneum',
    emotion: 'Emotion Visual Lab',
    welcomeRegister: 'Benevenite Registrare',
  },
};

const FRIEND_EMOJI: Record<string, string> = {
  'zh-TW': '🧑‍🤝‍🧑',
  'zh-CN': '🧑‍🤝‍🧑',
  'en': '🧑‍🤝‍🧑',
  'ja': '🧑‍🤝‍🧑',
  'ko': '🧑‍🤝‍🧑',
  'th': '🧑‍🤝‍🧑',
  'vi': '🧑‍🤝‍🧑',
  'ms': '🧑‍🤝‍🧑',
  'la': '🧑‍🤝‍🧑',
};

const SLOGAN2: Record<string, string> = {
  'zh-TW': '每一位更生人，都是世界的一員！',
  'zh-CN': '每一位更生人，都是世界的一员！',
  'en': 'Everyone deserves a place in the world!',
  'ja': 'すべての更生者は世界の一員です！',
  'ko': '모든 사람은 세상에 있을 자격이 있습니다!',
  'th': 'ทุกคนสมควรได้รับที่ในโลก!',
  'vi': 'Mọi người đều xứng đáng có một vị trí trên thế giới!',
  'ms': 'Setiap orang berhak mendapat tempat di dunia!',
  'la': 'Omnes locum in mundo merentur!',
};

const FOOTER_TEXT = {
  'zh-TW': { privacy: '隱私權政策', terms: '條款/聲明', deletion: '資料刪除說明' },
  'zh-CN': { privacy: '隐私政策', terms: '条款/声明', deletion: '资料删除说明' },
  'en': { privacy: 'Privacy Policy', terms: 'Terms/Statement', deletion: 'Data Deletion' },
  'ja': { privacy: 'プライバシーポリシー', terms: '規約/声明', deletion: 'データ削除について' },
  'ko': { privacy: '개인정보처리방침', terms: '약관/성명', deletion: '데이터 삭제 안내' },
  'th': { privacy: 'นโยบายความเป็นส่วนตัว', terms: 'ข้อกำหนด/แถลงการณ์', deletion: 'คำอธิบายการลบข้อมูล' },
  'vi': { privacy: 'Chính sách bảo mật', terms: 'Điều khoản/Tuyên bố', deletion: 'Giải thích xóa dữ liệu' },
  'ms': { privacy: 'Dasar Privasi', terms: 'Terma/Pernyataan', deletion: 'Penjelasan Penghapusan Data' },
  'la': { privacy: 'Consilium Privacy', terms: 'Termini/Declaratio', deletion: 'Norma Deletionis Datae' },
};

const ABOUT_TEXT = {
  'zh-TW': '🧬 Restarter™｜我們是誰',
  'zh-CN': '🧬 Restarter™｜我们是谁',
  'en': '🧬 Restarter™｜Who We Are',
  'ja': '🧬 Restarter™｜私たちについて',
  'ko': '🧬 Restarter™｜우리는 누구인가',
  'th': '🧬 Restarter™｜เราเป็นใคร',
  'vi': '🧬 Restarter™｜Chúng tôi là ai',
  'ms': '🧬 Restarter™｜Siapa Kami',
  'la': '🧬 Restarter™｜Quis sumus',
};

const FEEDBACK_TEXT = {
  'zh-TW': '💬 意見箱｜我們想聽你說',
  'zh-CN': '💬 意见箱｜我们想听你说',
  'en': '💬 Feedback｜We Want to Hear You',
  'ja': '💬 ご意見箱｜あなたの声を聞かせて',
  'ko': '💬 피드백｜여러분의 의견을 듣고 싶어요',
  'th': '💬 กล่องความคิดเห็น｜เราอยากฟังคุณ',
  'vi': '💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn',
  'ms': '💬 Kotak Maklum Balas｜Kami ingin mendengar anda',
  'la': '💬 Arca Consilii｜Te audire volumus',
};

const PROFILE_MANAGEMENT_TEXT = {
  'zh-TW': '個人管理中心',
  'zh-CN': '个人管理中心',
  'en': 'Profile Management',
  'ja': 'プロフィール管理',
  'ko': '프로필 관리',
  'th': 'จัดการโปรไฟล์',
  'vi': 'Quản lý hồ sơ',
  'ms': 'Pengurusan Profil',
  'la': 'Administratio Profili',
};

const MEMBER_BENEFITS_TEXT = {
  'zh-TW': '訂閱方案',
  'zh-CN': '订阅方案',
  'en': 'Subscription Plans',
  'ja': 'サブスクリプションプラン',
  'ko': '구독 플랜',
  'th': 'แผนการสมัครสมาชิก',
  'vi': 'Gói Đăng Ký',
  'ms': 'Pelan Langganan',
  'la': 'Plana Subscriptionis',
};

export default function Home() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = TEXT[lang];
  const featureBtnsRef = useRef<HTMLDivElement>(null);
  const chatBtnRef = useRef<HTMLButtonElement>(null);
  const [chatBtnMargin, setChatBtnMargin] = useState(0);
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(false);
  const [showLangBox, setShowLangBox] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [showLoginTip, setShowLoginTip] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionModalData, setSubscriptionModalData] = useState({
    title: '',
    message: '',
    requiredPlan: 'basic'
  });
  const { isTestMode } = useTestMode();
  
  // Token 續購彈跳窗狀態
  const [showTokenRenewalModal, setShowTokenRenewalModal] = useState(false);
  const [tokenRenewalData, setTokenRenewalData] = useState({
    currentPlan: 'basic',
    remainingDays: 0,
    usedTokens: 0,
    totalTokens: 0
  });


  // 新增：響應式螢幕寬度判斷
  const [isMobile, setIsMobile] = useState(() => {
    // 在伺服器端渲染時，window 可能不存在
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // 強制重新計算Footer位置
    const timer = setTimeout(() => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.transition = 'none';
        setTimeout(() => {
          footer.style.transition = 'top 0.3s ease';
        }, 50);
      }
    }, 500);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, []);

  // MODULES 陣列（還原）
  const MODULES = [
    {
      key: 'echo-box',
      icon: '🎤',
      title: {
        'zh-TW': '心語日記',
        'zh-CN': '心语日记',
        'ja': '心の言葉日記',
        'en': 'Heartfelt Diary',
        'ko': '마음의 말 일기',
        'th': 'ไดอารี่คำพูดจากใจ',
        'vi': 'Nhật Ký Từ Trái Tim',
        'ms': 'Diari Kata-kata Hati',
        'la': 'Diarium Verborum Cordis'
      },
      desc: {
        'zh-TW': '語音與文字情緒輸出，個人情緒的私密紀錄',
        'zh-CN': '语音与文字情绪输出，个人情绪的私密记录',
        'ja': '音声とテキストによる感情の出力、個人の感情のプライベートな記録',
        'en': 'Voice and text emotional output, private record of personal emotions',
        'ko': '음성과 텍스트 감정 출력, 개인 감정의 사적인 기록',
        'th': 'การส่งออกอารมณ์ด้วยเสียงและข้อความ บันทึกส่วนตัวของอารมณ์ส่วนบุคคล',
        'vi': 'Đầu ra cảm xúc bằng giọng nói và văn bản, ghi chép riêng tư về cảm xúc cá nhân',
        'ms': 'Output emosi suara dan teks, rekod peribadi emosi peribadi',
        'la': 'Output emotio vocis et textus, recordatio privata emotionum personalium'
      },
      path: '/echo-box'
    },
    {
      key: 'restart-wall',
      icon: '🧱',
      title: {
        'zh-TW': '共鳴分享牆',
        'zh-CN': '共鸣分享墙',
        'ja': '共鳴シェアリングウォール',
        'en': 'Resonance Sharing Wall',
        'ko': '공명 공유 벽',
        'th': 'กำแพงแบ่งปันการสะท้อน',
        'vi': 'Tường Chia Sẻ Cộng Hưởng',
        'ms': 'Dinding Perkongsian Resonans',
        'la': 'Murus Communicationis Resonantiae'
      },
      desc: {
        'zh-TW': '匿名分享情緒故事，促進社群共鳴與互動',
        'zh-CN': '匿名分享情绪故事，促进社群共鸣与互动',
        'ja': '匿名で感情ストーリーを共有し、コミュニティの共鳴とインタラクションを促進',
        'en': 'Anonymously share emotional stories, promote community resonance and interaction',
        'ko': '익명으로 감정 이야기를 공유하고, 커뮤니티 공명과 상호작용을 촉진',
        'th': 'แบ่งปันเรื่องราวอารมณ์แบบไม่ระบุตัวตน ส่งเสริมการสะท้อนและปฏิสัมพันธ์ของชุมชน',
        'vi': 'Chia sẻ câu chuyện cảm xúc ẩn danh, thúc đẩy cộng hưởng và tương tác cộng đồng',
        'ms': 'Kongsi cerita emosi secara anonim, galakkan resonans dan interaksi komuniti',
        'la': 'Fabulas affectuum anonyme partiri, resonantiam communitatis et interactionem promovere'
      },
      path: '/wall'
    },
    {
      key: 'my-story',
      icon: '📖',
      title: {
        'zh-TW': '成長足跡',
        'zh-CN': '成长足迹',
        'ja': '成長の足跡',
        'en': 'Growth Footprints',
        'ko': '성장의 발자국',
        'th': 'รอยเท้าแห่งการเติบโต',
        'vi': 'Dấu Chân Trưởng Thành',
        'ms': 'Jejak Pertumbuhan',
        'la': 'Vestigia Incrementi'
      },
      desc: {
        'zh-TW': '個人成長與目標進度的記錄與回顧',
        'zh-CN': '个人成长与目标进度的记录与回顾',
        'ja': '個人の成長と目標進捗の記録と振り返り',
        'en': 'Record and review personal growth and goal progress',
        'ko': '개인 성장과 목표 진행 상황의 기록과 회고',
        'th': 'บันทึกและทบทวนการเติบโตส่วนบุคคลและความคืบหน้าของเป้าหมาย',
        'vi': 'Ghi lại và xem xét sự phát triển cá nhân và tiến độ mục tiêu',
        'ms': 'Rekod dan semak semula pertumbuhan peribadi dan kemajuan matlamat',
        'la': 'Recorda et recense incrementum personale et progressum propositi'
      },
      path: '/my-story'
    },
    {
      key: 'journal',
      icon: '🌳',
      title: {
        'zh-TW': '每日心禮',
        'zh-CN': '每日心礼',
        'ja': '毎日の心の贈り物',
        'en': 'Daily Heart Gift',
        'ko': '매일의 마음 선물',
        'th': 'ของขวัญใจประจำวัน',
        'vi': 'Món Quà Từ Trái Tim Hàng Ngày',
        'ms': 'Hadiah Hati Harian',
        'la': 'Donum Cordis Diurnum'
      },
      desc: {
        'zh-TW': '每日隨機心情提示與正向鼓勵',
        'zh-CN': '每日随机心情提示与正向鼓励',
        'ja': '毎日のランダムな気分のヒントとポジティブな励まし',
        'en': 'Daily random mood prompts and positive encouragement',
        'ko': '매일 랜덤한 기분 힌트와 긍정적인 격려',
        'th': 'คำแนะนำอารมณ์แบบสุ่มประจำวันและการให้กำลังใจเชิงบวก',
        'vi': 'Gợi ý tâm trạng ngẫu nhiên hàng ngày và khuyến khích tích cực',
        'ms': 'Petunjuk mood rawak harian dan galakan positif',
        'la': 'Promptus animi cotidiani casuales et hortatio positiva'
      },
      path: '/journal'
    },
    {
      key: 'missions',
      icon: '🎯',
      title: {
        'zh-TW': '自我挑戰', 'zh-CN': '自我挑战', 'en': 'Self-Challenge', 'ja': '自己挑戦', 'ko': '자기 도전', 'th': 'ท้าทายตัวเอง', 'vi': 'Thử thách bản thân', 'ms': 'Cabaran Diri', 'la': 'Provocatio Sui'
      },
      desc: {
        'zh-TW': '個人成長挑戰任務，激勵持續自我突破', 'zh-CN': '个人成长挑战任务，激励持续自我突破', 'en': 'Personal growth challenge missions, inspire continuous self-breakthrough', 'ja': '個人成長挑戦ミッション、継続的な自己突破を鼓舞', 'ko': '개인 성장 도전 임무, 지속적인 자기 돌파를 격려', 'th': 'งานท้าทายการเติบโตส่วนบุคคล กระตุ้นการทะลุผ่านตัวเองอย่างต่อเนื่อง', 'vi': 'Nhiệm vụ thử thách phát triển cá nhân, truyền cảm hứng đột phá bản thân liên tục', 'ms': 'Misi cabaran pertumbuhan peribadi, inspirasi penembusan diri berterusan', 'la': 'Missiones provocationis incrementi personalis, inspirationem continuam sui transgressionis'
      },
      path: '/restart-missions'
    },
    {
      key: 'storywall',
      icon: '📖',
      title: {
        'zh-TW': '身份故事鏈', 'zh-CN': '身份故事链', 'ja': 'アイデンティティストーリーチェーン', 'en': 'Identity Story Chain', 'ko': '정체성 스토리 체인', 'th': 'ห่วงโซ่เรื่องราวอัตลักษณ์', 'vi': 'Chuỗi Câu Chuyện Bản Sắc', 'ms': 'Rantai Cerita Identiti', 'la': 'Catena Fabularum Identitatis'
      },
      desc: {
        'zh-TW': '深度故事創作與自我認同的探索',
        'zh-CN': '深度故事创作与自我认同的探索',
        'ja': '深いストーリー創作と自己同一性の探求',
        'en': 'Deep story creation and exploration of self-identity',
        'ko': '깊이 있는 이야기 창작과 자기 정체성 탐구',
        'th': 'การสร้างสรรค์เรื่องราวเชิงลึกและการสำรวจอัตลักษณ์ของตนเอง',
        'vi': 'Sáng tạo câu chuyện sâu sắc và khám phá bản sắc cá nhân',
        'ms': 'Penciptaan cerita mendalam dan penerokaan identiti diri',
        'la': 'Creatio fabularum profunda et exploratio identitatis sui'
      },
      path: '/storywall'
    },

    {
      key: 'skillbox',
      icon: '🛠️',
      title: {
        'zh-TW': '社會模擬所',
        'zh-CN': '社会模拟所',
        'ja': '社会シミュレーション研究所',
        'en': 'Social Simulation Institute',
        'ko': '사회 시뮬레이션 연구소',
        'th': 'สถาบันจำลองสังคม',
        'vi': 'Viện Mô Phỏng Xã Hội',
        'ms': 'Institut Simulasi Sosial',
        'la': 'Institutum Simulationis Socialis'
      },
      desc: {
        'zh-TW': 'AI模擬真實社會情境，練習人際互動技巧', 'zh-CN': 'AI模拟真实社会情境，练习人际互动技巧', 'en': 'AI simulates real social situations, practice interpersonal interaction skills', 'ja': 'AIが実際の社会的状況をシミュレートし、対人交流スキルを練習', 'ko': 'AI가 실제 사회 상황을 시뮬레이션하고, 대인 상호작용 기술을 연습', 'th': 'AI จำลองสถานการณ์สังคมจริง ฝึกฝนทักษะการปฏิสัมพันธ์ระหว่างบุคคล', 'vi': 'AI mô phỏng tình huống xã hội thực tế, thực hành kỹ năng tương tác giữa các cá nhân', 'ms': 'AI mensimulasikan situasi sosial sebenar, latih kemahiran interaksi interpersonal', 'la': 'AI simulat situationes sociales reales, exerce artes interactionis interpersonal'
      },
      path: '/skillbox'
    },
    {
      key: 'emotionRelease',
      icon: '🎮',
      title: {
        'zh-TW': '壓力釋放室',
        'zh-CN': '压力释放室',
        'ja': 'ストレス解放室',
        'en': 'Stress Release Room',
        'ko': '스트레스 해방실',
        'th': 'ห้องปลดปล่อยความเครียด',
        'vi': 'Phòng Giải Tỏa Áp Lực',
        'ms': 'Bilik Pelepasan Tekanan',
        'la': 'Cubiculum Liberationis Tensionis'
      },
      desc: {
        'zh-TW': '簡單遊戲幫助快速舒緩壓力與情緒', 'zh-CN': '简单游戏帮助快速舒缓压力与情绪', 'en': 'Simple games help quickly relieve stress and emotions', 'ja': 'シンプルなゲームがストレスと感情を素早く和らげる', 'ko': '간단한 게임이 스트레스와 감정을 빠르게 완화하는 데 도움', 'th': 'เกมง่ายๆ ช่วยบรรเทาความเครียดและอารมณ์ได้อย่างรวดเร็ว', 'vi': 'Trò chơi đơn giản giúp nhanh chóng giảm bớt căng thẳng và cảm xúc', 'ms': 'Permainan mudah membantu melegakan tekanan dan emosi dengan cepat', 'la': 'Ludi simplices adiuvant tensionem et affectus celeriter alleviare'
      },
      path: '/emotion-release'
    }
  ];

  useLayoutEffect(() => {
    if (featureBtnsRef.current && chatBtnRef.current) {
      const featureTop = featureBtnsRef.current.getBoundingClientRect().top;
      const chatBtnTop = chatBtnRef.current.getBoundingClientRect().top;
      const featureHeight = featureBtnsRef.current.getBoundingClientRect().height;
      const chatBtnHeight = chatBtnRef.current.getBoundingClientRect().height;
      setChatBtnMargin((featureTop + featureHeight) - (chatBtnTop + chatBtnHeight));
    }
  }, [lang]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [auth]);

  // 1. 新增 state 與 useEffect 處理語言下拉點擊空白自動關閉
  const langBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showLangBox) return;
    const handleClick = (e: MouseEvent) => {
      if (langBoxRef.current && !langBoxRef.current.contains(e.target as Node)) {
        setShowLangBox(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLangBox]);

  // 2. 新增 state 與 useEffect 處理法律文件選單點擊空白自動關閉
  const legalMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!showLegalMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (legalMenuRef.current && !legalMenuRef.current.contains(e.target as Node)) {
        setShowLegalMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLegalMenu]);

  const handleFeature = (type: string) => {
    if (type === 'voice') {
      navigate('/voice');
    } else if (type === 'ai') {
      navigate('/ai');
    } else if (type === 'tts') {
      navigate('/tts');
    } else if (type === 'chat') {
      navigate('/chat');
    } else if (type === 'friend') {
      navigate('/friend');
    } else if (type === 'emotion') {
      navigate('/EmotionVisualLab');
    } else if (type === 'storywall') {
      navigate('/storywall');
    }
  };

  // 1. 多語言登出與互助實驗室
  const LOGOUT_TEXT = {
    'zh-TW': '登出',
    'zh-CN': '登出',
    'en': 'Logout',
    'ja': 'ログアウト',
    'ko': '로그아웃',
    'th': 'ออกจากระบบ',
    'vi': 'Đăng xuất',
    'ms': 'Keluar',
    'la': 'Exire',
  };
  const MUTUAL_HELP_TEXT = {
    'zh-TW': '共創實驗室',
    'zh-CN': '共创实验室',
    'en': 'Co-creation Lab',
    'ja': '共創ラボ',
    'ko': '공동창작실험실',
    'th': 'ห้องทดลองการสร้างสรรค์ร่วมกัน',
    'vi': 'Phòng Thí Nghiệm Đồng Sáng Tạo',
    'ms': 'Makmal Penciptaan Bersama',
    'la': 'Laboratorium Co-creationis',
  };
  const MUTUAL_HELP_DESC = {
    'zh-TW': '彼此協作與互助，推動共創與合作任務',
    'zh-CN': '用户协作与互助，推动共创与合作任务',
    'en': 'User collaboration and mutual assistance, promote co-creation and cooperative tasks',
    'ja': 'ユーザー協力と相互支援、共創と協力タスクを推進',
    'ko': '사용자 협력과 상호 지원, 공동 창작과 협력 작업 촉진',
    'th': 'การทำงานร่วมกันของผู้ใช้และการช่วยเหลือซึ่งกันและกัน ส่งเสริมการสร้างสรรค์ร่วมกันและงานร่วมมือ',
    'vi': 'Sự hợp tác và hỗ trợ lẫn nhau của người dùng, thúc đẩy đồng sáng tạo và nhiệm vụ hợp tác',
    'ms': 'Kerjasama pengguna dan bantuan bersama, galakkan penciptaan bersama dan tugas kerjasama',
    'la': 'Collaboratio usorum et auxilium mutuum, promovere co-creationem et opera cooperativa',
  };

  // 多語言提示內容
  const LOGIN_TIP_TEXT = {
    'zh-TW': {
      title: '請先註冊/登入才能使用此功能',
      btn: '前往註冊/登入',
      close: '關閉',
    },
    'zh-CN': {
      title: '请先注册/登录才能使用此功能',
      btn: '前往注册/登录',
      close: '关闭',
    },
    'en': {
      title: 'Please register/login to use this feature',
      btn: 'Go to Register/Login',
      close: 'Close',
    },
    'ja': {
      title: 'ご利用には登録/ログインが必要です',
      btn: '登録/ログインへ',
      close: '閉じる',
    },
    'ko': {
      title: '이 기능을 사용하려면 가입/로그인 해주세요',
      btn: '가입/로그인으로 이동',
      close: '닫기',
    },
    'th': {
      title: 'กรุณาสมัคร/เข้าสู่ระบบก่อนใช้ฟีเจอร์นี้',
      btn: 'ไปที่สมัคร/เข้าสู่ระบบ',
      close: 'ปิด',
    },
    'vi': {
      title: 'Vui lòng đăng ký/đăng nhập để sử dụng chức năng này',
      btn: 'Đến đăng ký/đăng nhập',
      close: 'Đóng',
    },
    'ms': {
      title: 'Sila daftar/log masuk untuk menggunakan ciri ini',
      btn: 'Pergi ke Daftar/Log Masuk',
      close: 'Tutup',
    },
    'la': {
      title: 'Quaeso registra/aperi ut hoc munus utaris',
      btn: 'Ad registra/login',
      close: 'Claude',
    },
  };
  const tipText = LOGIN_TIP_TEXT[lang];

  // 改寫 feature 按鈕 onClick，檢查登入和訂閱權限
  const handleFeatureWithAuth = async (cb: () => void, feature?: string) => {
    if (!user) {
      setShowLoginTip(true);
      return;
    }

    // 測試模式：跳過所有權限檢查
    if (isTestMode) {
      cb();
      return;
    }

    // 如果有指定功能，檢查訂閱權限
    if (feature) {
      try {
        const response = await fetch('/api/subscription/check-permission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.uid,
            feature,
          }),
        });

        if (!response.ok) {
          throw new Error('權限檢查失敗');
        }

        const result = await response.json();
        
        if (!result.allowed) {
          // 檢查是否為 Token 續購情況
          if (result.canRenew) {
            setTokenRenewalData({
              currentPlan: result.currentPlan,
              remainingDays: result.remainingDays,
              usedTokens: result.usedTokens,
              totalTokens: result.totalTokens
            });
            setShowTokenRenewalModal(true);
          } else {
            // 顯示訂閱提示模態框
            setSubscriptionModalData({
              title: '功能需要升級',
              message: result.reason || '此功能需要升級訂閱才能使用',
              requiredPlan: result.requiredPlan || 'basic'
            });
            setShowSubscriptionModal(true);
          }
          return;
        }
      } catch (error) {
        console.error('權限檢查錯誤:', error);
        // 如果檢查失敗，仍然允許使用功能
      }
    }

    cb();
  };

  if (!authChecked) {
    return <div style={{textAlign:'center',marginTop:'30vh',fontSize:24}}>載入中...</div>;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 響應式適配：根據 isMobile 狀態切換 */}
      {isMobile ? (
        // 手機版頂部導航
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px #0001' }}>
          {/* 左側：LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/ctx-logo.png" alt="logo" style={{ width: 72, height: 72, cursor: 'pointer' }} onClick={() => navigate('/')} />
          </div>
          
          {/* 右側：用戶資訊和按鈕 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <>
                {user.photoURL ? (
  <img src={user.photoURL} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF' }} />
) : (
  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B5BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', border: '2px solid #6B5BFF' }}>
    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                <span style={{ color: '#6B5BFF', fontWeight: 600, fontSize: 12, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || user.email || '用戶'}</span>
                <button 
                  className="topbar-btn" 
                  onClick={async () => { await signOut(auth); }} 
                  style={{ 
                    width: '80px', 
                    fontSize: 14, 
                    padding: '6px 10px', 
                    height: '28px',
                    borderRadius: 4,
                    fontWeight: 600,
                    border: '1px solid #ff6347',
                    color: '#ff6347',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.18s, color 0.18s, border 0.18s'
                  }}
                >
                  {LOGOUT_TEXT[lang]}
                </button>
              </>
            ) : (
              <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '4px 8px' }}>{lang==='zh-TW'?'註冊':'zh-CN'===lang?'注册':'en'===lang?'Register':'ja'===lang?'登録':'ko'===lang?'가입':'th'===lang?'สมัคร':'vi'===lang?'Đăng ký':'ms'===lang?'Daftar':'Registrare'}</button>
            )}
            <LanguageSelector style={{ width: '80px', fontSize: 14, padding: '6px 10px', height: '28px' }} />
            
            {/* 手機版漢堡選單 - 法律文件 */}
            <div style={{ position: 'relative', display: 'inline-block' }} ref={legalMenuRef}>
              <button
                className="topbar-btn"
                style={{
                  background: '#6B5BFF',
                  color: '#fff',
                  border: '2px solid #6B5BFF',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '8px 10px',
                  minWidth: 44,
                  height: '36px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowLegalMenu(v => !v)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#5a4fd9';
                  e.currentTarget.style.borderColor = '#5a4fd9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#6B5BFF';
                  e.currentTarget.style.borderColor = '#6B5BFF';
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
                  <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
                  <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
                </div>
              </button>
              {showLegalMenu && (
                <div style={{ 
                  position: 'absolute', 
                  right: 0, 
                  top: '110%', 
                  background: '#fff', 
                  border: '1.5px solid #6B5BFF', 
                  borderRadius: 8, 
                  boxShadow: '0 4px 16px #0002', 
                  zIndex: 9999, 
                  minWidth: 180,
                  maxWidth: 220,
                  padding: '8px 0'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B5BFF' }}>
                      {lang === 'zh-TW' ? '法律文件' : 
                       lang === 'zh-CN' ? '法律文件' : 
                       lang === 'en' ? 'Legal Documents' : 
                       lang === 'ja' ? '法的文書' : 
                       lang === 'ko' ? '법적 문서' : 
                       lang === 'th' ? 'เอกสารทางกฎหมาย' : 
                       lang === 'vi' ? 'Tài liệu pháp lý' : 
                       lang === 'ms' ? 'Dokumen Undang-undang' : 
                       'Documenta Iuridica'}
                    </span>
                  </div>
                  {[
                    // Footer原有的法律文件 (優先使用footer的路徑和文字)
                    { key: 'privacy', title: FOOTER_TEXT, titleKey: 'privacy', path: '/privacy-policy' },
                    { key: 'terms', title: FOOTER_TEXT, titleKey: 'terms', path: '/terms' },
                    { key: 'data', title: FOOTER_TEXT, titleKey: 'deletion', path: '/data-deletion' },
                    // 漢堡選單原有的其他法律文件 - 改為React路由
                    { key: 'ai', title: { 'zh-TW': 'AI使用聲明', 'zh-CN': 'AI使用声明', 'en': 'AI Usage Statement', 'ja': 'AI利用声明', 'ko': 'AI 사용 성명', 'th': 'คำแถลงการใช้ AI', 'vi': 'Tuyên bố sử dụng AI', 'ms': 'Penyata Penggunaan AI', 'la': 'Declaratio Usus AI' }, path: '/ai-statement' },
                    { key: 'mental', title: { 'zh-TW': '心理健康免責聲明', 'zh-CN': '心理健康免责声明', 'en': 'Mental Health Disclaimer', 'ja': 'メンタルヘルス免責事項', 'ko': '정신건강 면책조항', 'th': 'ข้อจำกัดความรับผิดชอบด้านสุขภาพจิต', 'vi': 'Tuyên bố miễn trừ sức khỏe tâm thần', 'ms': 'Penafian Kesihatan Mental', 'la': 'Renuntiatio Salutis Mentalis' }, path: '/mental-health-disclaimer' },
                    { key: 'cookie', title: { 'zh-TW': 'Cookie政策', 'zh-CN': 'Cookie政策', 'en': 'Cookie Policy', 'ja': 'Cookieポリシー', 'ko': '쿠키 정책', 'th': 'นโยบายคุกกี้', 'vi': 'Chính sách Cookie', 'ms': 'Dasar Cookie', 'la': 'Politica Cookie' }, path: '/cookie-policy' },
                    { key: 'children', title: { 'zh-TW': '兒童隱私保護', 'zh-CN': '儿童隐私保护', 'en': 'Children\'s Privacy', 'ja': '児童プライバシー保護', 'ko': '아동 개인정보 보호', 'th': 'การคุ้มครองความเป็นส่วนตัวของเด็ก', 'vi': 'Bảo vệ quyền riêng tư trẻ em', 'ms': 'Privasi Kanak-kanak', 'la': 'Privata Puerorum' }, path: '/children-privacy' },
                    { key: 'international', title: { 'zh-TW': '國際用戶聲明', 'zh-CN': '国际用户声明', 'en': 'International Users', 'ja': '国際ユーザー声明', 'ko': '국제 사용자 성명', 'th': 'คำแถลงสำหรับผู้ใช้ระหว่างประเทศ', 'vi': 'Tuyên bố người dùng quốc tế', 'ms': 'Penyata Pengguna Antarabangsa', 'la': 'Declaratio Usuarii Internationalis' }, path: '/international-users' },
                    { key: 'security', title: { 'zh-TW': '安全聲明', 'zh-CN': '安全声明', 'en': 'Security Statement', 'ja': 'セキュリティ声明', 'ko': '보안 성명', 'th': 'คำแถลงความปลอดภัย', 'vi': 'Tuyên bố bảo mật', 'ms': 'Penyata Keselamatan', 'la': 'Declaratio Securitatis' }, path: '/security-statement' },
                    { key: 'update', title: { 'zh-TW': '更新通知機制', 'zh-CN': '更新通知机制', 'en': 'Update Notification', 'ja': '更新通知メカニズム', 'ko': '업데이트 알림 메커니즘', 'th': 'กลไกการแจ้งเตือนการอัปเดต', 'vi': 'Cơ chế thông báo cập nhật', 'ms': 'Mekanisme Pemberitahuan Kemas Kini', 'la': 'Mechanismus Notificationis Renovationis' }, path: '/update-notification' }
                  ].map(item => (
                    <div 
                      key={item.key}
                      style={{ 
                        padding: '8px 12px', 
                        cursor: 'pointer', 
                        color: '#232946', 
                        fontWeight: 500, 
                        background: '#fff',
                        fontSize: '11px',
                        borderBottom: '1px solid #f0f0f0',
                        transition: 'all 0.2s ease'
                      }} 
                      onClick={() => {
                        // 所有法律文件都使用React路由
                        navigate(item.path);
                        setShowLegalMenu(false);
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f3f0ff';
                        e.currentTarget.style.color = '#6B5BFF';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#fff';
                        e.currentTarget.style.color = '#232946';
                      }}
                    >
                      {item.titleKey ? (item.title[lang]?.[item.titleKey] || item.title['zh-TW'][item.titleKey]) : (item.title[lang] || item.title['zh-TW'])}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        // 桌面版頂部導航
        <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginRight: 24 }}>
            <button 
              className="topbar-btn" 
              onClick={() => navigate('/about')} 
              style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 80 }}
              aria-label={lang==='zh-TW'?'了解 Restarter 平台':'zh-CN'===lang?'了解 Restarter 平台':'en'===lang?'Learn about Restarter platform':'ja'===lang?'Restarter プラットフォームについて':'ko'===lang?'Restarter 플랫폼에 대해 알아보기':'th'===lang?'เรียนรู้เกี่ยวกับแพลตฟอร์ม Restarter':'vi'===lang?'Tìm hiểu về nền tảng Restarter':'ms'===lang?'Ketahui tentang platform Restarter':'Cognosce de suggestum Restarter'}
              role="button"
            >
              {lang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===lang?'🧬 Restarter™｜我们是谁':'en'===lang?'🧬 Restarter™｜Who We Are':'ja'===lang?'🧬 Restarter™｜私たちについて':'ko'===lang?'🧬 Restarter™｜우리는 누구인가':'th'===lang?'🧬 Restarter™｜เราเป็นใคร':'vi'===lang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===lang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
            </button>
            <button 
              className="topbar-btn" 
              onClick={() => navigate('/feedback')} 
              style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
              aria-label={lang==='zh-TW'?'提供意見和建議':'zh-CN'===lang?'提供意见和建议':'en'===lang?'Provide feedback and suggestions':'ja'===lang?'ご意見やご提案を提供':'ko'===lang?'의견과 제안 제공':'th'===lang?'ให้ข้อเสนอแนะและคำแนะนำ':'vi'===lang?'Cung cấp phản hồiและ đề xuất':'ms'===lang?'Berikan maklum balas dan cadangan':'Praebe consilia et suggestiones'}
              role="button"
            >
              {lang==='zh-TW'?'💬 意見箱｜我們想聽你說':'zh-CN'===lang?'💬 意见箱｜我们想听你说':'en'===lang?'💬 Feedback｜We Want to Hear You':'ja'===lang?'💬 ご意見箱｜あなたの声を聞かせて':'ko'===lang?'💬 피드백｜여러분의 의견을 듣고 싶어요':'th'===lang?'💬 กล่องความคิดเห็น｜เราอยากฟังคุณ':'vi'===lang?'💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn':'ms'===lang?'💬 Kotak Maklum Balas｜Kami ingin mendengar anda':'💬 Arca Consilii｜Te audire volumus'}
            </button>

            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.photoURL ? (
  <img src={user.photoURL} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #90caf9' }} />
) : (
  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#90caf9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 'bold', border: '2px solid #90caf9' }}>
    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                  <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 16 }}>{user.displayName || user.email || '用戶'}</span>
                  <button className="topbar-btn" onClick={async () => { await signOut(auth); }} style={{ background: '#fff', color: '#ff6347', border: '2px solid #ffb4a2', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 14px', marginLeft: 6 }}>{LOGOUT_TEXT[lang]}</button>
                </div>
              </>
            ) : (
                              <>
                  <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '2px solid #90caf9', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 10px', minWidth: 90 }}>{lang==='zh-TW'?'註冊/登入':'zh-CN'===lang?'注册/登录':'en'===lang?'Register / Login':'ja'===lang?'登録/ログイン':'ko'===lang?'가입/로그인':'th'===lang?'สมัคร/เข้าสู่ระบบ':'vi'===lang?'Đăng ký/Đăng nhập':'ms'===lang?'Daftar / Log Masuk':'Registrare / Login'}</button>
              </>
            )}
          </div>
          {/* 語言選擇按鈕，靠右且寬度縮短，點擊彈出小框 */}
          <div style={{ position: 'relative', display: 'inline-block' }} ref={langBoxRef}>
            <button
              className="topbar-btn"
              style={{
                background: '#6B5BFF',
                color: '#fff',
                border: '2px solid #6B5BFF',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                padding: '8px 10px',
                minWidth: 90,
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setShowLangBox(v => !v)}
            >
              {lang === 'zh-TW' ? '繁中' : lang === 'zh-CN' ? '简中' : lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : lang === 'ko' ? '한국어' : lang === 'th' ? 'ไทย' : lang === 'vi' ? 'Tiếng Việt' : lang === 'ms' ? 'Bahasa Melayu' : 'Latin'}
              <span style={{ marginLeft: 6 }}>▼</span>
            </button>
            {showLangBox && (
              <div style={{ position: 'absolute', right: 0, top: '110%', background: '#fff', border: '1.5px solid #6B5BFF', borderRadius: 8, boxShadow: '0 4px 16px #0002', zIndex: 9999, minWidth: 120 }}>
                {['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'th', 'vi', 'ms', 'la'].map(l => (
                  <div key={l} style={{ padding: '10px 18px', cursor: 'pointer', color: l === lang ? '#6B5BFF' : '#232946', fontWeight: l === lang ? 700 : 500, background: l === lang ? '#f3f0ff' : '#fff' }} onClick={() => { setLang(l as LanguageCode); setShowLangBox(false); }}>
                    {l === 'zh-TW' ? '繁中' : l === 'zh-CN' ? '简中' : l === 'en' ? 'English' : l === 'ja' ? '日本語' : l === 'ko' ? '한국어' : l === 'th' ? 'ไทย' : l === 'vi' ? 'Tiếng Việt' : l === 'ms' ? 'Bahasa Melayu' : 'Latin'}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* 漢堡選單 - 法律文件 */}
          <div style={{ position: 'relative', display: 'inline-block' }} ref={legalMenuRef}>
            <button
              className="topbar-btn"
              style={{
                background: '#fff',
                color: '#6B5BFF',
                border: '2px solid #6B5BFF',
                borderRadius: 8,
                fontWeight: 700,
                fontSize: 16,
                padding: '8px 12px',
                minWidth: 50,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setShowLegalMenu(v => !v)}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#6B5BFF';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#6B5BFF';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
                <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
                <div style={{ width: '16px', height: '2px', background: 'currentColor', borderRadius: '1px' }}></div>
              </div>
            </button>
            {showLegalMenu && (
              <div style={{ 
                position: 'absolute', 
                right: 0, 
                top: '110%', 
                background: '#fff', 
                border: '1.5px solid #6B5BFF', 
                borderRadius: 8, 
                boxShadow: '0 4px 16px #0002', 
                zIndex: 9999, 
                minWidth: 200,
                maxWidth: 250,
                padding: '8px 0'
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#6B5BFF' }}>
                    {lang === 'zh-TW' ? '法律文件' : 
                     lang === 'zh-CN' ? '法律文件' : 
                     lang === 'en' ? 'Legal Documents' : 
                     lang === 'ja' ? '法的文書' : 
                     lang === 'ko' ? '법적 문서' : 
                     lang === 'th' ? 'เอกสารทางกฎหมาย' : 
                     lang === 'vi' ? 'Tài liệu pháp lý' : 
                     lang === 'ms' ? 'Dokumen Undang-undang' : 
                     'Documenta Iuridica'}
                  </span>
                </div>
                {[
                  // Footer原有的法律文件 (優先使用footer的路徑和文字)
                  { key: 'privacy', title: FOOTER_TEXT, titleKey: 'privacy', path: '/privacy-policy' },
                  { key: 'terms', title: FOOTER_TEXT, titleKey: 'terms', path: '/terms' },
                  { key: 'data', title: FOOTER_TEXT, titleKey: 'deletion', path: '/data-deletion' },
                  // 漢堡選單原有的其他法律文件 - 改為React路由
                  { key: 'ai', title: { 'zh-TW': 'AI使用聲明', 'zh-CN': 'AI使用声明', 'en': 'AI Usage Statement', 'ja': 'AI利用声明', 'ko': 'AI 사용 성명', 'th': 'คำแถลงการใช้ AI', 'vi': 'Tuyên bố sử dụng AI', 'ms': 'Penyata Penggunaan AI', 'la': 'Declaratio Usus AI' }, path: '/ai-statement' },
                  { key: 'mental', title: { 'zh-TW': '心理健康免責聲明', 'zh-CN': '心理健康免责声明', 'en': 'Mental Health Disclaimer', 'ja': 'メンタルヘルス免責事項', 'ko': '정신건강 면책조항', 'th': 'ข้อจำกัดความรับผิดชอบด้านสุขภาพจิต', 'vi': 'Tuyên bố miễn trừ sức khỏe tâm thần', 'ms': 'Penafian Kesihatan Mental', 'la': 'Renuntiatio Salutis Mentalis' }, path: '/mental-health-disclaimer' },
                  { key: 'cookie', title: { 'zh-TW': 'Cookie政策', 'zh-CN': 'Cookie政策', 'en': 'Cookie Policy', 'ja': 'Cookieポリシー', 'ko': '쿠키 정책', 'th': 'นโยบายคุกกี้', 'vi': 'Chính sách Cookie', 'ms': 'Dasar Cookie', 'la': 'Politica Cookie' }, path: '/cookie-policy' },
                  { key: 'children', title: { 'zh-TW': '兒童隱私保護', 'zh-CN': '儿童隐私保护', 'en': 'Children\'s Privacy', 'ja': '児童プライバシー保護', 'ko': '아동 개인정보 보호', 'th': 'การคุ้มครองความเป็นส่วนตัวของเด็ก', 'vi': 'Bảo vệ quyền riêng tư trẻ em', 'ms': 'Privasi Kanak-kanak', 'la': 'Privata Puerorum' }, path: '/children-privacy' },
                  { key: 'international', title: { 'zh-TW': '國際用戶聲明', 'zh-CN': '国际用户声明', 'en': 'International Users', 'ja': '国際ユーザー声明', 'ko': '국제 사용자 성명', 'th': 'คำแถลงสำหรับผู้ใช้ระหว่างประเทศ', 'vi': 'Tuyên bố người dùng quốc tế', 'ms': 'Penyata Pengguna Antarabangsa', 'la': 'Declaratio Usuarii Internationalis' }, path: '/international-users' },
                  { key: 'security', title: { 'zh-TW': '安全聲明', 'zh-CN': '安全声明', 'en': 'Security Statement', 'ja': 'セキュリティ声明', 'ko': '보안 성명', 'th': 'คำแถลงความปลอดภัย', 'vi': 'Tuyên bố bảo mật', 'ms': 'Penyata Keselamatan', 'la': 'Declaratio Securitatis' }, path: '/security-statement' },
                  { key: 'update', title: { 'zh-TW': '更新通知機制', 'zh-CN': '更新通知机制', 'en': 'Update Notification', 'ja': '更新通知メカニズム', 'ko': '업데이트 알림 메커니즘', 'th': 'กลไกการแจ้งเตือนการอัปเดต', 'vi': 'Cơ chế thông báo cập nhật', 'ms': 'Mekanisme Pemberitahuan Kemas Kini', 'la': 'Mechanismus Notificationis Renovationis' }, path: '/update-notification' }
                ].map(item => (
                  <div 
                    key={item.key}
                    style={{ 
                      padding: '10px 16px', 
                      cursor: 'pointer', 
                      color: '#232946', 
                      fontWeight: 500, 
                      background: '#fff',
                      fontSize: '13px',
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s ease'
                    }} 
                    onClick={() => {
                      // 所有法律文件都使用React路由
                      navigate(item.path);
                      setShowLegalMenu(false);
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f3f0ff';
                      e.currentTarget.style.color = '#6B5BFF';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#fff';
                      e.currentTarget.style.color = '#232946';
                    }}
                                      >
                      {item.titleKey ? (item.title[lang]?.[item.titleKey] || item.title['zh-TW'][item.titleKey]) : (item.title[lang] || item.title['zh-TW'])}
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isMobile ? (
        // 手機版主內容
        <div style={{ width: '100vw', minHeight: '100vh', background: `url('/plains.png') center center/cover no-repeat`, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 100 }}>
          
          {/* 手機版天氣組件 */}
          <div style={{ width: '100%', padding: '0 16px', marginBottom: 16 }}>
            <WeatherWidget />
          </div>
          
          {/* 手機版主標題區域 */}
          <div style={{ width: '100%', padding: '20px 16px', textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontWeight: 900, color: '#232946', fontSize: 16, lineHeight: 1.2, letterSpacing: 0.3, textShadow: '1px 2px 8px #fff', whiteSpace: 'nowrap' }}>
                {lang === 'zh-TW' ? '找回信任的起點，重新出發不孤單！' : 
                 lang === 'zh-CN' ? '找回信任的起点，重新出发不孤单！' : 
                 lang === 'en' ? 'Regain trust and start anew, you are never alone!' : 
                 lang === 'ja' ? '信頼を取り戻し、新たな一歩を踏み出そう！' : 
                 lang === 'ko' ? '신뢰를 되찾고, 새롭게 시작하세요. 당신은 결코 혼자가 아닙니다!' : 
                 lang === 'th' ? 'เริ่มต้นใหม่ด้วยความไว้วางใจ คุณไม่ได้อยู่คนเดียว!' : 
                 lang === 'vi' ? 'Tìm lại niềm tin, bắt đầu lại, bạn không bao giờ đơn độc!' : 
                 lang === 'ms' ? 'Temui semula kepercayaan, mulakan semula, anda tidak pernah keseorangan!' : 
                 'Fidem recupera et iterum incipe, numquam solus es!'}
              </span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12, textShadow: '0 2px 8px #232946' }}>
              <span style={{ color: '#6B5BFF' }}>Restarter™</span> Global Platform
            </h1>
            <div style={{ marginBottom: 10 }}>
              <span style={{ color: '#232946', fontWeight: 500, fontSize: 14, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
                {TEXT[lang].desc}
              </span>
            </div>
          </div>
          
          {/* 手機版AI機器人圖片 - 並排顯示 */}
          <div style={{ width: '100%', padding: '0 16px', marginBottom: 16, display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'center' }}>
            {/* 左邊AI機器人 - 視覺上在前面 */}
            <img 
              src="/herogirl.png" 
              style={{ 
                width: '50%', 
                maxWidth: 150, 
                height: 'auto', 
                objectFit: 'contain', 
                borderRadius: '16px', 
                boxShadow: 'none' 
              }} 
            />
            
            {/* 右邊AI機器人 - 視覺上在後面 */}
            <img 
              src="/Robotgirl.png" 
              style={{ 
                width: '50%', 
                maxWidth: 150, 
                height: 'auto', 
                objectFit: 'contain', 
                borderRadius: '16px', 
                boxShadow: 'none' 
              }} 
            />
          </div>
          
          {/* 社會融入度評估按鈕 */}
          <div style={{ width: '100%', padding: '0 16px', marginBottom: '16px', position: 'relative' }}>
            <button
              onClick={() => handleFeatureWithAuth(() => navigate('/social-integration'))}
              style={{
                background: 'linear-gradient(135deg, #6B5BFF 0%, #5A4FCF 100%)',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 16px rgba(107, 91, 255, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'center',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 91, 255, 0.4)';
                const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                if (tooltip) tooltip.style.opacity = '1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(107, 91, 255, 0.3)';
                const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                if (tooltip) tooltip.style.opacity = '0';
              }}
            >
              <span style={{ fontSize: '18px' }}>📊</span>
              {lang === 'zh-TW' ? '社會融入度評估' :
               lang === 'zh-CN' ? '社会融入度评估' :
               lang === 'ja' ? '社会統合度評価' :
               lang === 'en' ? 'Social Integration Assessment' :
               lang === 'ko' ? '사회 통합도 평가' :
               lang === 'th' ? 'การประเมินการผสมผสานทางสังคม' :
               lang === 'vi' ? 'Đánh Giá Hòa Nhập Xã Hội' :
               lang === 'ms' ? 'Penilaian Integrasi Sosial' :
               'Aestimatio Integrationis Socialis'}
            </button>
            <div style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#232946',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '500',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              opacity: '0',
              transition: 'opacity 0.3s ease',
              zIndex: 1000,
              pointerEvents: 'none',
              maxWidth: '200px',
              marginBottom: '8px'
            }}>
              {lang === 'zh-TW' ? '評估個人社會融入度，獲得專業建議和改善方向' :
               lang === 'zh-CN' ? '评估个人社会融入度，获得专业建议和改善方向' :
               lang === 'ja' ? '個人の社会統合度を評価し、専門的なアドバイスと改善方向を獲得' :
               lang === 'en' ? 'Assess personal social integration, get professional advice and improvement direction' :
               lang === 'ko' ? '개인 사회 통합도를 평가하고 전문적인 조언과 개선 방향을 얻으세요' :
               lang === 'th' ? 'ประเมินการผสมผสานทางสังคมส่วนบุคคล รับคำแนะนำจากผู้เชี่ยวชาญและทิศทางการปรับปรุง' :
               lang === 'vi' ? 'Đánh giá mức độ hòa nhập xã hội cá nhân, nhận lời khuyên chuyên môn và hướng cải thiện' :
               lang === 'ms' ? 'Nilai integrasi sosial peribadi, dapatkan nasihat profesional dan arah penambahbaikan' :
               'Aestima integrationem socialem personalem, consilium professionalem et directionem meliorationis accipe'}
            </div>
          </div>
          
          {/* 手機版職涯中心和訂閱方案按鈕 */}
          <div style={{ width: '100%', padding: '0 16px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => navigate('/profile')} style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#00CFFF', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '2px solid #00CFFF', cursor: 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>
              {lang==='zh-TW'?'💼 職涯中心':'zh-CN'===lang?'💼 职涯中心':'en'===lang?'💼 Career Center':'ja'===lang?'💼 キャリアセンター':'ko'===lang?'💼 커리어 센터':'th'===lang?'💼 ศูนย์อาชีพ':'vi'===lang?'💼 Trung tâm nghề nghiệp':'ms'===lang?'💼 Pusat Kerjaya':'💼 Career Center'}
            </button>
            <span href="/plans" style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '2px solid #6B5BFF', cursor: 'pointer', textAlign: 'center', display: 'block', boxSizing: 'border-box' }}>{MEMBER_BENEFITS_TEXT[lang]}</span>
          </div>
          
          {/* 手機版功能按鈕 */}
          <div style={{ width: '100%', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* 第一行：交友區 + 來聊天吧 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <button 
                className="feature-btn" 
                style={{ flex: 1, minWidth: 'calc(50% - 4px)', padding: '16px 8px', borderRadius: 12, border: '2px solid #6B5BFF', background: '#fff', color: '#6B5BFF', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }} 
                onClick={() => handleFeatureWithAuth(() => navigate('/friend'))}
              >
                <span style={{ fontSize: 20 }}>{FRIEND_EMOJI[lang]}</span>
                <span style={{ fontSize: 12, textAlign: 'center' }}>{t.friend}</span>
              </button>
              <button
                className="feature-btn"
                style={{
                  flex: 1,
                  minWidth: 'calc(50% - 4px)',
                  padding: '16px 8px',
                  borderRadius: 12,
                  border: '2px solid #6B5BFF',
                  background: '#fff',
                  color: '#6B5BFF',
                  fontWeight: 700,
                  fontSize: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
                onClick={() => handleFeatureWithAuth(() => handleFeature('chat'), 'aiChat')}
              >
                <span style={{ fontSize: 20 }}>💬</span>
                <span style={{ fontSize: 12, textAlign: 'center' }}>{t.chat}</span>
              </button>
            </div>
            

            
            {/* 第二行：每2個一行排列功能按鈕 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {MODULES.slice(0, 2).map(m => (
                <button 
                  key={m.key} 
                  className="feature-btn" 
                  style={{ flex: 1, minWidth: 'calc(50% - 4px)', padding: '16px 8px', borderRadius: 12, border: '2px solid #6B5BFF', background: '#fff', color: '#6B5BFF', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }} 
                  onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, textAlign: 'center' }}>{m.title[lang]}</span>
                </button>
              ))}
            </div>
            
            {/* 第三行：每2個一行排列功能按鈕 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {MODULES.slice(2, 4).map(m => (
                <button 
                  key={m.key} 
                  className="feature-btn" 
                  style={{ flex: 1, minWidth: 'calc(50% - 4px)', padding: '16px 8px', borderRadius: 12, border: '2px solid #6B5BFF', background: '#fff', color: '#6B5BFF', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }} 
                  onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, textAlign: 'center' }}>{m.title[lang]}</span>
                </button>
              ))}
            </div>
            
            {/* 第四行：社會模擬所 + 互相幫助&合作實驗室 + 冥想放鬆工具 */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {MODULES.slice(4).map(m => (
                <button 
                  key={m.key} 
                  className="feature-btn" 
                  style={{ flex: 1, minWidth: 'calc(50% - 4px)', padding: '16px 8px', borderRadius: 12, border: '2px solid #6B5BFF', background: '#fff', color: '#6B5BFF', fontWeight: 700, fontSize: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }} 
                  onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                >
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, textAlign: 'center' }}>{m.title[lang]}</span>
                </button>
              ))}
              <button
                className="feature-btn"
                style={{
                  flex: 1,
                  minWidth: 'calc(50% - 4px)',
                  padding: '16px 8px',
                  borderRadius: 12,
                  background: 'linear-gradient(90deg, #ffe0b2 0%, #ffb74d 100%)',
                  color: '#b85c00',
                  border: '2px solid #ffb74d',
                  fontWeight: 900,
                  fontSize: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4
                }}
                onClick={() => handleFeatureWithAuth(() => navigate('/HelpLab'))}
              >
                <span style={{ fontSize: 20 }}>🧪</span>
                <span style={{ fontSize: 12, textAlign: 'center' }}>{MUTUAL_HELP_TEXT[lang]}</span>
              </button>


            </div>
          </div>
          

        </div>
      ) : (
        // 桌面版主內容
        <div style={{ width: '100vw', minHeight: '160vh', background: `url('/plains.png') center center/cover no-repeat`, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center' }}>
          {/* 左側內容：主標題、說明、功能按鈕 */}
          <div className="home-left-col left-relative" style={{ flex: 1, minWidth: 320, maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '120px 0 0 0', zIndex: 2 }}>
            {/* LOGO、標語、主標題、說明、功能按鈕等原本內容 */}
            <div className="fixed-logo-box" style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
              <img src="/ctx-logo.png" className="fixed-logo-img" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
            </div>
            <div className="column-content" style={{ justifyContent: 'center', alignItems: 'center', height: '100%', paddingTop: lang === 'vi' ? '200px' : 
                        lang === 'ms' ? '220px' : 
                        lang === 'la' ? '240px' : 
                        lang === 'en' ? '180px' : '80px' }}>
              
              {/* 恢復主標語、主標題、說明等重要文字內容 */}
              <div
                style={{
                  width: '100%',
                  maxWidth: 900,
                  margin: '0 auto 16px auto',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  whiteSpace: 'normal',
                  marginLeft: '0px',
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    color: '#232946',
                    fontSize: 20,
                    lineHeight: 1.2,
                    letterSpacing: 0.5,
                    textShadow: '2px 4px 12px #fff, 0 2px 8px #23294688',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {lang === 'zh-TW' ? '找回信任的起點，重新出發不孤單！' : 
                   lang === 'zh-CN' ? '找回信任的起点，重新出发不孤单！' : 
                   lang === 'en' ? 'Regain trust and start anew, you are never alone!' : 
                   lang === 'ja' ? '信頼を取り戻し、新たな一歩を踏み出そう！' : 
                   lang === 'ko' ? '신뢰를 되찾고, 새롭게 시작하세요. 당신은 결코 혼자가 아닙니다!' : 
                   lang === 'th' ? 'เริ่มต้นใหม่ด้วยความไว้วางใจ คุณไม่ได้อยู่คนเดียว!' : 
                   lang === 'vi' ? 'Tìm lại niềm tin, bắt đầu lại, bạn không bao giờ đơn độc!' : 
                   lang === 'ms' ? 'Temui semula kepercayaan, mulakan semula, anda tidak pernah keseorangan!' : 
                   'Fidem recupera et iterum incipe, numquam solus es!'}
                </span>
              </div>
              <h1 className="main-title" style={{ position: 'relative', left: '0px', fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 18, textShadow: '0 2px 12px #232946, 0 4px 24px #0008' }}>
                <span style={{ color: '#6B5BFF' }}>Restarter™</span> Global Platform
              </h1>
              <div style={{ width: '100%', textAlign: 'center', margin: '0 auto', marginBottom: 16, marginTop: '0px' }}>
                <span style={{ color: '#232946', fontWeight: 500, fontSize: 16, lineHeight: 1.5, letterSpacing: 0.5, whiteSpace: 'pre-line' }}>
                                                          {TEXT[lang].desc}
                </span>
              </div>
              
              {/* 桌面版社會融入度評估按鈕 */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', position: 'relative' }}>
                <button
                  onClick={() => handleFeatureWithAuth(() => navigate('/social-integration'))}
                  style={{
                    background: 'linear-gradient(135deg, #6B5BFF 0%, #5A4FCF 100%)',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '16px 32px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 4px 16px rgba(107, 91, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 91, 255, 0.4)';
                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '1';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(107, 91, 255, 0.3)';
                    const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                    if (tooltip) tooltip.style.opacity = '0';
                  }}
                >
                  <span style={{ fontSize: '24px' }}>📊</span>
                  {lang === 'zh-TW' ? '社會融入度評估' :
                   lang === 'zh-CN' ? '社会融入度评估' :
                   lang === 'ja' ? '社会統合度評価' :
                   lang === 'en' ? 'Social Integration Assessment' :
                   lang === 'ko' ? '사회 통합도 평가' :
                   lang === 'th' ? 'การประเมินการผสมผสานทางสังคม' :
                   lang === 'vi' ? 'Đánh Giá Hòa Nhập Xã Hội' :
                   lang === 'ms' ? 'Penilaian Integrasi Sosial' :
                   'Aestimatio Integrationis Socialis'}
                </button>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#232946',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  opacity: '0',
                  transition: 'opacity 0.3s ease',
                  zIndex: 1000,
                  pointerEvents: 'none'
                }}>
                  {lang === 'zh-TW' ? '評估個人社會融入度，獲得專業建議和改善方向' :
                   lang === 'zh-CN' ? '评估个人社会融入度，获得专业建议和改善方向' :
                   lang === 'ja' ? '個人の社会統合度を評価し、専門的なアドバイスと改善方向を獲得' :
                   lang === 'en' ? 'Assess personal social integration, get professional advice and improvement direction' :
                   lang === 'ko' ? '개인 사회 통합도를 평가하고 전문적인 조언과 개선 방향을 얻으세요' :
                   lang === 'th' ? 'ประเมินการผสมผสานทางสังคมส่วนบุคคล รับคำแนะนำจากผู้เชี่ยวชาญและทิศทางการปรับปรุง' :
                   lang === 'vi' ? 'Đánh giá mức độ hòa nhập xã hội cá nhân, nhận lời khuyên chuyên môn và hướng cải thiện' :
                   lang === 'ms' ? 'Nilai integrasi sosial peribadi, dapatkan nasihat profesional dan arah penambahbaikan' :
                   'Aestima integrationem socialem personalem, consilium professionalem et directionem meliorationis accipe'}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 60, justifyContent: 'center', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center' }}>
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="feature-btn" 
                      style={{ fontSize: 18, padding: '16px 16px', minWidth: 160, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', transition: 'all 0.3s ease' }} 
                      onClick={() => handleFeatureWithAuth(() => navigate('/friend'), 'userInteraction')}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 91, 255, 0.4)';
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '0';
                      }}

                      role="button"
                    >
                      <span style={{ fontSize: 32 }}>{FRIEND_EMOJI[lang]}</span>
                      <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{t.friend}</span>
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#232946',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      maxWidth: '300px',
                      marginBottom: '8px'
                    }}>
                      進入交友區做深度社交，建立真實且支持性的連結。
                    </div>
                  </div>
                  {MODULES.slice(0,2).map(m => (
                    <button 
                      key={m.key} 
                      className="feature-btn" 
                      style={{ fontSize: 18, padding: '16px 16px', minWidth: 160, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }} 
                      onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                      aria-label={m.desc[lang]}
                      role="button"
                    >
                      <span style={{ 
                        fontSize: 32,
                        transform: m.icon === '🎤' ? 'translateY(8px)' : 'none'
                      }}>{m.icon}</span>
                      <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{m.title[lang]}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center' }}>
                  {MODULES.slice(2, 5).map(m => (
                    <button 
                      key={m.key} 
                      className="feature-btn" 
                      style={{ fontSize: 18, padding: '16px 16px', minWidth: 160, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }} 
                      onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                      aria-label={m.desc[lang]}
                      role="button"
                    >
                      <span style={{ fontSize: 32 }}>{m.icon}</span>
                      <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{m.title[lang]}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 18, justifyContent: 'center', marginTop: 10 }}>
                  {MODULES.slice(5, 6).map(m => (
                    <button 
                      key={m.key} 
                      className="feature-btn" 
                      style={{ fontSize: 18, padding: '16px 16px', minWidth: 160, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }} 
                      onClick={() => handleFeatureWithAuth(() => navigate(m.path))}
                      aria-label={m.desc[lang]}
                      role="button"
                    >
                      <span style={{ fontSize: 32 }}>{m.icon}</span>
                      <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{m.title[lang]}</span>
                    </button>
                  ))}
                  {/* 互相幫助&合作實驗室按鈕 - 縮短寬度 */}
                  <div style={{ position: 'relative' }}>
                    <button
                      className="feature-btn mutual-help-btn"
                      style={{
                        fontSize: 18,
                        padding: '16px 16px',
                        minWidth: 180,
                        maxWidth: 240,
                        minHeight: 80,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'center',
                        background: 'linear-gradient(90deg, #ffe0b2 0%, #ffb74d 100%)',
                        color: '#b85c00',
                        border: '2px solid #ffb74d',
                        fontWeight: 900,
                        boxShadow: '0 2px 12px #ffb74d55',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={() => handleFeatureWithAuth(() => navigate('/HelpLab'))}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 183, 77, 0.4)';
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '1';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 12px #ffb74d55';
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip) tooltip.style.opacity = '0';
                      }}

                      role="button"
                    >
                      <span style={{ fontSize: 32 }}>🧪</span>
                      <span style={{ fontWeight: 900, color: '#1976d2', textAlign: 'center', lineHeight: 1.2 }}>{MUTUAL_HELP_TEXT[lang]}</span>
                    </button>
                    <div style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#232946',
                      color: 'white',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      opacity: '0',
                      transition: 'opacity 0.3s ease',
                      zIndex: 1000,
                      pointerEvents: 'none',
                      maxWidth: '200px',
                      marginBottom: '8px'
                    }}>
                      {MUTUAL_HELP_DESC[lang]}
                    </div>
                  </div>
                  {/* 情緒發洩區按鈕 */}
                  <button 
                    className="feature-btn" 
                    style={{ fontSize: 18, padding: '16px 16px', minWidth: 160, minHeight: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }} 
                    onClick={() => handleFeatureWithAuth(() => navigate('/emotion-release'))}
                    aria-label={lang === 'zh-TW' ? '簡單遊戲幫助快速舒緩壓力與情緒' : lang === 'zh-CN' ? '简单游戏帮助快速舒缓压力与情绪' : lang === 'en' ? 'Simple games help quickly relieve stress and emotions' : lang === 'ja' ? 'シンプルなゲームがストレスと感情を素早く和らげる' : lang === 'ko' ? '간단한 게임이 스트레스와 감정을 빠르게 완화하는 데 도움' : lang === 'th' ? 'เกมง่ายๆ ช่วยบรรเทาความเครียดและอารมณ์ได้อย่างรวดเร็ว' : lang === 'vi' ? 'Trò chơi đơn giản giúp nhanh chóng giảm bớt căng thẳng và cảm xúc' : lang === 'ms' ? 'Permainan mudah membantu melegakan tekanan dan emosi dengan cepat' : 'Ludi simplices adiuvant tensionem et affectus celeriter alleviare'}
                    role="button"
                  >
                    <span style={{ fontSize: 32 }}>🎮</span>
                    <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{lang === 'zh-TW' ? '壓力釋放室' : lang === 'zh-CN' ? '压力释放室' : lang === 'ja' ? 'ストレス解放室' : lang === 'en' ? 'Stress Release Room' : lang === 'ko' ? '스트레스 해방실' : lang === 'th' ? 'ห้องปลดปล่อยความเครียด' : lang === 'vi' ? 'Phòng Giải Tỏa Áp Lực' : lang === 'ms' ? 'Bilik Pelepasan Tekanan' : 'Cubiculum Liberationis Tensionis'}</span>
                  </button>


                </div>
              </div>
            </div>
          </div>
          {/* 右側內容：mockup 圖片和來聊天吧按鈕 */}
          <div className="home-right-col" style={{ flex: 1, minWidth: 320, maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 120, zIndex: 2 }}>
            {/* 新增：上方按鈕區塊 */}
            <div style={{ display: 'flex', gap: 18, marginBottom: 18, justifyContent: 'center', width: '100%', flexWrap: 'wrap', zIndex: 1000, position: 'relative' }}>
              <button onClick={() => navigate('/profile')} style={{ background: '#00CFFF', color: '#fff', fontWeight: 700, fontSize: 18, padding: '10px 28px', borderRadius: 10, boxShadow: '0 2px 8px #00CFFF33', textDecoration: 'none', border: '2px solid #00CFFF', cursor: 'pointer', zIndex: 1001, position: 'relative' }}>
                {lang==='zh-TW'?'💼 職涯中心':'zh-CN'===lang?'💼 职涯中心':'en'===lang?'💼 Career Center':'ja'===lang?'💼 キャリアセンター':'ko'===lang?'💼 커리어 센터':'th'===lang?'💼 ศูนย์อาชีพ':'vi'===lang?'💼 Trung tâm nghề nghiệp':'ms'===lang?'💼 Pusat Kerjaya':'💼 Career Center'}
              </button>
              <span href="/plans" style={{ background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 18, padding: '10px 28px', borderRadius: 10, boxShadow: '0 2px 8px #6B5BFF33', textDecoration: 'none', border: '2px solid #6B5BFF', cursor: 'pointer', zIndex: 1001, position: 'relative' }}>{MEMBER_BENEFITS_TEXT[lang]}</span>
            </div>
            {/* 天氣組件 - 移動到訂閱方案按鈕下方 */}
            <div style={{ marginBottom: 18, width: '100%', maxWidth: 300 }}>
              <WeatherWidget />
            </div>
            {/* 兩個AI機器人並排顯示 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              gap: '20px', 
              width: '100%', 
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '-100px',
              height: 'calc(100vh - 120px)',
              maxHeight: 600,
              minHeight: 400
            }}>
              {/* 左邊AI機器人 - 視覺上在前面 */}
              <img 
                src="/herogirl.png" 
                className="home-mic-img" 
                style={{ 
                  marginBottom: 0, 
                  height: '100%', 
                  width: '50%', 
                  objectFit: 'contain', 
                  borderRadius: '0', 
                  boxShadow: 'none', 
                  border: 'none' 
                }} 
              />
              
              {/* 右邊AI機器人 - 視覺上在後面 */}
              <img 
                src="/Robotgirl.png" 
                className="home-mic-img" 
                style={{ 
                  marginBottom: 0, 
                  height: '100%', 
                  width: '50%', 
                  objectFit: 'contain', 
                  borderRadius: '0', 
                  boxShadow: 'none', 
                  border: 'none' 
                }} 
              />
            </div>
            <div style={{ position: 'relative' }}>
              <button
                ref={chatBtnRef}
                className="feature-btn home-chat-btn"
                style={{ height: 80, marginTop: 0, marginBottom: 0, position: 'relative', top: '-40px', gap: 8, padding: '16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }}
                onClick={() => handleFeatureWithAuth(() => handleFeature('chat'), 'aiChat')}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(107, 91, 255, 0.4)';
                  const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                  if (tooltip) tooltip.style.opacity = '1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(107, 91, 255, 0.3)';
                  const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                  if (tooltip) tooltip.style.opacity = '0';
                }}
                role="button"
              >
                <span role="img" style={{ fontSize: 32 }}>💬</span>
                <span className="home-chat-btn-text" style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>{t.chat}</span>
              </button>
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#232946',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                opacity: '0',
                transition: 'opacity 0.3s ease',
                zIndex: 1000,
                pointerEvents: 'none',
                maxWidth: '200px',
                marginBottom: '8px'
              }}>
                即時語音/文字聊天，情感交流與支持。
              </div>
            </div>
            
            {/* 社會模擬所按鈕 */}
            <button
              className="feature-btn"
              style={{ height: 80, marginTop: 10, marginBottom: 0, position: 'relative', top: '-40px', gap: 8, padding: '16px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF' }}
              onClick={() => handleFeatureWithAuth(() => navigate('/skillbox'))}
              aria-label={lang === 'zh-TW' ? '進入社會模擬所，練習對話技巧，應對各種挑戰' : lang === 'zh-CN' ? '进入社会模拟所，练习对话技巧，应对各种挑战' : lang === 'en' ? 'Enter SkillBox to practice conversation skills and handle various challenges' : lang === 'ja' ? 'SkillBoxに入って会話スキルを練習し、様々な挑戦に対処' : lang === 'ko' ? 'SkillBox에 들어가 대화 기술을 연습하고 다양한 도전에 대처' : lang === 'th' ? 'เข้าสู่ SkillBox เพื่อฝึกทักษะการสนทนาและรับมือกับความท้าทายต่างๆ' : lang === 'vi' ? 'Vào SkillBox để luyện tập kỹ năng hội thoại và xử lý các thách thức khác nhau' : lang === 'ms' ? 'Masuk ke SkillBox untuk berlatih kemahiran perbualan dan menangani pelbagai cabaran' : 'Intra in SkillBox ad exercenda colloquia et varias difficultates tractandas'}
              role="button"
            >
              <span style={{ fontSize: 32 }}>🛠️</span>
              <span style={{ fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
                {lang === 'zh-TW' ? '社會模擬所' :
                 lang === 'zh-CN' ? '社会模拟所' :
                 lang === 'en' ? 'SkillBox' :
                 lang === 'ja' ? 'SkillBox' :
                 lang === 'ko' ? 'SkillBox' :
                 lang === 'th' ? 'SkillBox' :
                 lang === 'vi' ? 'SkillBox' :
                 lang === 'ms' ? 'SkillBox' :
                 'SkillBox'}
              </span>
            </button>


          </div>
        </div>
      )}
      

      {/* 登入提示視窗 */}
      {showLoginTip && (
        <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF33', padding: 28, minWidth: 280, maxWidth: 340, width: '90vw', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button type="button" onClick={() => setShowLoginTip(false)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer', fontWeight: 700 }}>×</button>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#6B5BFF', textAlign: 'center', marginBottom: 2 }}>{tipText.title}</div>
            <button onClick={() => navigate('/register')} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 14, padding: '12px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', margin: '12px 0' }}>{tipText.btn}</button>
            <button onClick={() => setShowLoginTip(false)} style={{ background: '#eee', color: '#666', border: 'none', borderRadius: 14, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{tipText.close}</button>
          </div>
        </div>
      )}
      
      {/* 訂閱提示模態框 */}
              <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
          title={subscriptionModalData.title}
          message={subscriptionModalData.message}
          requiredPlan={subscriptionModalData.requiredPlan}
        />
        
        <TokenRenewalModal
          isOpen={showTokenRenewalModal}
          onClose={() => setShowTokenRenewalModal(false)}
          currentPlan={tokenRenewalData.currentPlan}
          remainingDays={tokenRenewalData.remainingDays}
          usedTokens={tokenRenewalData.usedTokens}
          totalTokens={tokenRenewalData.totalTokens}
        />
      

      
      <style>{`
        .feature-btn, .home-chat-btn, .topbar-btn {
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        /* 移除懸停效果以避免畫面停滯和耗電 */
        .feature-btn, .home-chat-btn {
          background: #fff;
          border-radius: 12px;
          border: 2px solid #6B5BFF;
          color: #6B5BFF;
          font-weight: 700;
          font-size: 16px;
          padding: 8px 16px;
          backdrop-filter: blur(10px);
        }
        .home-chat-btn-text {
          font-size: 18px;
          margin-left: 2px;
        }
        .topbar-btn {
          background: #6c63ff;
          border-radius: 8px;
          border: none;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          padding: 8px 18px;
        }
        .fixed-logo-box {
          position: fixed;
          top: 16px;
          left: 42px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 10000;
        }
        .fixed-logo-img {
          width: 54px;
          height: 54px;
        }
        .fixed-logo-slogan {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 2px 8px #232946, 0 4px 18px #0008;
        }
        
        /* 響應式設計：手機版按鈕佈局 */
        @media (max-width: 768px) {
          .home-right-col > div:first-child {
            flex-direction: column !important;
            gap: 12px !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
          .home-right-col > div:first-child > button,
          .home-right-col > div:first-child > span {
            width: 100% !important;
            max-width: 280px !important;
            text-align: center !important;
            font-size: 16px !important;
            padding: 12px 20px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
        
        /* 確保按鈕在手機版上可見 */
        @media (max-width: 768px) {
          .home-right-col {
            padding-top: 80px !important;
          }
          .home-right-col > div:first-child {
            position: relative !important;
            z-index: 1000 !important;
            background: rgba(255, 255, 255, 0.9) !important;
            padding: 10px !important;
            border-radius: 10px !important;
            margin-bottom: 20px !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
          }
        }
        
        /* 強制顯示職涯中心按鈕 */
        @media (max-width: 768px) {
          .home-right-col > div:first-child > button:first-child {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: #00CFFF !important;
            color: #fff !important;
            border: 2px solid #00CFFF !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            padding: 12px 20px !important;
            border-radius: 10px !important;
            margin-bottom: 8px !important;
            width: 100% !important;
            max-width: 280px !important;
            text-align: center !important;
          }
        }
        
        /* 額外強制顯示 - 使用更通用的選擇器 */
        @media (max-width: 768px) {
          .home-right-col > div:first-child button {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: #00CFFF !important;
            color: #fff !important;
            border: 2px solid #00CFFF !important;
            font-weight: 700 !important;
            font-size: 16px !important;
            padding: 12px 20px !important;
            border-radius: 10px !important;
            margin-bottom: 8px !important;
            width: 100% !important;
            max-width: 280px !important;
            text-align: center !important;
          }
        }
        
        /* 確保按鈕容器可見 */
        @media (max-width: 768px) {
          .home-right-col > div:first-child {
            display: flex !important;
            flex-direction: column !important;
            gap: 12px !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: relative !important;
            z-index: 1000 !important;
            background: rgba(255, 255, 255, 0.9) !important;
            padding: 10px !important;
            border-radius: 10px !important;
            margin-bottom: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}