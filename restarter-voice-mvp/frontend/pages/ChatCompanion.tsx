import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualAvatar from '../components/VirtualAvatar';
import { generateResponse } from '../lib/ai/generateResponse';
import { speak } from '../lib/ai/speak';
import { generateTalkingFace } from '../lib/ai/talkingFace';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import Footer from '../components/Footer';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import { UpgradeModal } from '../components/UpgradeModal';
import { usePermission } from '../hooks/usePermission';
import { useTestMode } from '../App';
import SharedHeader from '../components/SharedHeader';
import app from '../src/firebaseConfig';

interface ChatMsg {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  status?: 'streaming' | 'done';
  audio?: string;
}

type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'vi' | 'th' | 'la' | 'ms';

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'la', label: 'Latina' },
  { code: 'ms', label: 'Bahasa Melayu' },
];

const AVATAR_FILES = [
  'Annie.png', 'berlex.png', 'Bray.png', 'Cayly.png', 'Derxl.png', 'El.png',
  'Fenny.png', 'Gily.png', 'Henny.png', 'Jesy.png', 'Karl.png', 'michy.png',
  'Mily.png', 'Neysher.png', 'sandy.png', 'Sherl.png', 'Shu.png', 'Shyly.png'
];

const AVATAR_LIST = AVATAR_FILES.map(f => `/avatars/${f}`);
const AVATAR_NAMES = AVATAR_FILES.map(f => f.replace(/\.png$/i, ''));

const TEXTS: Record<LanguageCode, any> = {
  'zh-TW': {
    friend: '朋友',
    avatarTitle: '選我做你的朋友',
    companionPhrase: ['🕊️ 守在海這端，', '我都聽著呢。'],
    changeAvatar: '更換我的頭像',
    aiReplyTemplate: (text: string) => `AI陪聊：我明白你的意思，「${text}」，讓我再多聽你說說...`,
    aiSystemPrompt: '你是一個溫暖、善解人意的虛擬人，請用鼓勵、正向語氣回應。',
    careerPrompt: '你是一個專業的職涯顧問，擅長幫助用戶進行職業規劃、技能評估、求職策略等。請提供實用、具體的建議。',
    speechErrorBrowser: '此瀏覽器不支援語音辨識，請改用 Chrome/Edge。',
    speechErrorFail: '語音辨識失敗，請再試一次。',
    speechErrorNoDetect: '沒有偵測到語音，請再試一次。',
    logout: '登出',
    inputPlaceholder: '或者，直接輸入文字... (Enter 送出)',
    welcome: (name: string) => `嗨，${name}，我是你的 AI 朋友，你可以開始跟我說話囉！`,
    welcomePickAvatar: (name: string) => `嗨，${name}，先幫我選個頭像後我們再輕鬆自在，天南地北痛快聊...`,
    welcomeChat: (avatar: string, name: string) => `${avatar}說：嗨，${name}，今天想聊點什麼呢？`,
    whoAmI: '你想我是誰？',
    tapToTalk: '按一下開始語音聊天...',
    aiReplying: 'AI 正在回覆中，輸入新訊息可立即打斷',
    recognizing: '正在辨識中...',
    careerMode: '職涯諮詢模式',
    chatMode: '一般聊天模式',
    careerWelcome: (name: string) => `嗨，${name}，我是你的職涯顧問！我可以幫助你進行職業規劃、技能評估、求職策略等。請告訴我你的職業目標或遇到的問題。`,
  },
  'zh-CN': {
    friend: '朋友',
    avatarTitle: '选我做你的朋友',
    companionPhrase: ['🕊️ 守在海这端，', '我都听着呢。'],
    changeAvatar: '更换我的头像',
    aiReplyTemplate: (text: string) => `AI陪聊：我明白你的意思，"${text}"，让我再多听你聊聊...`,
    aiSystemPrompt: '你是一个温暖、善解人意的虚拟人，请用鼓励、正向语气回应。',
    careerPrompt: '你是一个专业的职涯顾问，擅长帮助用户进行职业规划、技能评估、求职策略等。请提供实用、具体的建议。',
    speechErrorBrowser: '此浏览器不支持语音识别，请改用 Chrome/Edge。',
    speechErrorFail: '语音识别失败，请再试一次。',
    speechErrorNoDetect: '没有检测到语音，请再试一次。',
    logout: '登出',
    inputPlaceholder: '或者，直接输入文字... (Enter 发送)',
    welcome: (name: string) => `嗨，${name}，我是你的 AI 朋友，你可以开始跟我说话啰！`,
    welcomePickAvatar: (name: string) => `嗨，${name}，先帮我选个头像后我们再轻松自在，天南地北畅快聊...`,
    welcomeChat: (avatar: string, name:string) => `${avatar}说：嗨，${name}，今天想聊点什么呢？`,
    whoAmI: '你想我是谁？',
    tapToTalk: '点一下开始语音聊天...',
    aiReplying: 'AI 正在回复中，输入新消息可立即打断',
    recognizing: '正在识别中...',
    careerMode: '职涯咨询模式',
    chatMode: '一般聊天模式',
    careerWelcome: (name: string) => `嗨，${name}，我是你的职涯顾问！我可以帮助你进行职业规划、技能评估、求职策略等。请告诉我你的职业目标或遇到的问题。`,
  },
  'en': {
    friend: 'Friend',
    avatarTitle: 'Pick Me as Your Friend',
    companionPhrase: ["🕊️ I'm here by the sea,", "I'm listening."],
    changeAvatar: 'Change My Avatar',
    aiReplyTemplate: (text: string) => `AI Chat: I understand what you mean, "${text}", let me hear more from you...`,
    aiSystemPrompt: 'You are a warm, empathetic virtual person. Please respond in an encouraging and positive tone.',
    careerPrompt: 'You are a professional career advisor, skilled in helping users with career planning, skill assessment, job search strategies, etc. Please provide practical and specific advice.',
    speechErrorBrowser: 'This browser does not support speech recognition. Please use Chrome/Edge.',
    speechErrorFail: 'Speech recognition failed, please try again.',
    speechErrorNoDetect: 'No speech detected, please try again.',
    logout: 'Logout',
    inputPlaceholder: 'Or, type text directly... (Enter to send)',
    welcome: (name: string) => `Hi, ${name}, I'm your AI friend. You can start talking to me now!`,
    welcomePickAvatar: (name: string) => `Hi, ${name}, pick my avatar and let's chat freely!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: Hi, ${name}, what do you want to talk about today?`,
    whoAmI: 'Who do you want me to be?',
    tapToTalk: 'Tap to start voice chat...',
    aiReplying: 'AI is replying, type a new message to interrupt.',
    recognizing: 'Recognizing...',
    careerMode: 'Career Consultation Mode',
    chatMode: 'General Chat Mode',
    careerWelcome: (name: string) => `Hi, ${name}, I'm your career advisor! I can help you with career planning, skill assessment, job search strategies, etc. Please tell me your career goals or any issues you're facing.`,
  },
  'ja': {
    friend: '友達',
    avatarTitle: '友達に選んでね',
    companionPhrase: ['🕊️ この海辺で待ってるよ、', 'ずっと聞いているから。'],
    changeAvatar: 'アバターを変更',
    aiReplyTemplate: (text: string) => `AIチャット：あなたの言うこと、「${text}」、わかります。もっと聞かせてください...`,
    aiSystemPrompt: 'あなたは温かく、共感的なバーチャルパーソンです。励ましとポジティブなトーンで応答してください。',
    careerPrompt: 'あなたは専門的なキャリアアドバイザーです。ユーザーのキャリアプランニング、スキル評価、求職戦略などを支援するのが得意です。実用的で具体的なアドバイスを提供してください。',
    speechErrorBrowser: 'このブラウザは音声認識に対応していません。Chrome/Edgeを使用してください。',
    speechErrorFail: '音声認識に失敗しました。もう一度お試しください。',
    speechErrorNoDetect: '音声が検出されませんでした。もう一度お試しください。',
    logout: 'ログアウト',
    inputPlaceholder: 'あるいは、直接テキストを入力... (Enterで送信)',
    welcome: (name: string) => `こんにちは、${name}さん。あなたのAIの友達です。さあ、話しましょう！`,
    welcomePickAvatar: (name: string) => `やあ、${name}、まずは私のアバターを選んでから、気軽に何でも話そう！`,
    welcomeChat: (avatar: string, name: string) => `${avatar}：やあ、${name}、今日は何を話そうか？`,
    whoAmI: '私が誰であってほしいですか？',
    tapToTalk: 'タップして音声チャット開始',
    aiReplying: 'AIが返信中です。新しいメッセージを入力するとすぐに中断できます',
    recognizing: '認識中...',
    careerMode: 'キャリア相談モード',
    chatMode: '一般チャットモード',
    careerWelcome: (name: string) => `こんにちは、${name}さん。私はあなたのキャリアアドバイザーです！キャリアプランニング、スキル評価、求職戦略などをお手伝いできます。あなたのキャリア目標やお困りのことを教えてください。`,
  },
  'ko': {
    friend: '친구',
    avatarTitle: '나를 친구로 선택해줘',
    companionPhrase: ['🕊️ 바다 이편에서 지키고 있을게,', '다 듣고 있어.'],
    changeAvatar: '내 아바타 변경',
    aiReplyTemplate: (text: string) => `AI 채팅: 무슨 말인지 알겠어, "${text}", 더 얘기해줘...`,
    aiSystemPrompt: '당신은 따뜻하고 공감 능력이 뛰어난 가상 인간입니다. 격려하고 긍정적인 톤으로 응답해주세요.',
    careerPrompt: '당신은 전문적인 커리어 어드바이저입니다. 사용자의 커리어 플래닝, 스킬 평가, 구직 전략 등을 도와주는 것이 특기입니다. 실용적이고 구체적인 조언을 제공해주세요.',
    speechErrorBrowser: '이 브라우저는 음성 인식을 지원하지 않습니다. Chrome/Edge를 사용해주세요.',
    speechErrorFail: '음성 인식이 실패했습니다. 다시 시도해주세요.',
    speechErrorNoDetect: '음성이 감지되지 않았습니다. 다시 시도해주세요.',
    logout: '로그아웃',
    inputPlaceholder: '아니면, 직접 텍스트를 입력하세요... (Enter로 전송)',
    welcome: (name: string) => `안녕, ${name}. 나는 너의 AI 친구야. 이제 나에게 말을 걸 수 있어!`,
    welcomePickAvatar: (name: string) => `안녕, ${name}. 먼저 내 아바타를 고르고 자유롭게 얘기하자!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: 안녕, ${name}, 오늘 무슨 얘기하고 싶어?`,
    whoAmI: '내가 누구였으면 좋겠어?',
    tapToTalk: '탭하여 음성 채팅 시작...',
    aiReplying: 'AI가 답장 중입니다. 새 메시지를 입력하여 중단할 수 있습니다.',
    recognizing: '인식 중...',
    careerMode: '커리어 상담 모드',
    chatMode: '일반 채팅 모드',
    careerWelcome: (name: string) => `안녕, ${name}. 나는 너의 커리어 어드바이저야! 커리어 플래닝, 스킬 평가, 구직 전략 등을 도와줄 수 있어. 너의 커리어 목표나 고민하는 일을 말해줘.`,
  },
  'vi': {
    friend: 'Bạn bè',
    avatarTitle: 'Chọn tôi làm bạn của bạn',
    companionPhrase: ['🕊️ Em ở đây bên bờ biển,', 'Em đang lắng nghe đây.'],
    changeAvatar: 'Thay đổi Avatar của tôi',
    aiReplyTemplate: (text: string) => `Trò chuyện AI: Tôi hiểu ý bạn, "${text}", hãy cho tôi nghe thêm...`,
    aiSystemPrompt: 'Bạn là một người ảo ấm áp, đồng cảm. Vui lòng trả lời bằng giọng điệu khích lệ và tích cực.',
    careerPrompt: 'Bạn là một cố vấn nghề nghiệp chuyên nghiệp, có kỹ năng giúp người dùng lập kế hoạch nghề nghiệp, đánh giá kỹ năng, chiến lược tìm việc, v.v. Vui lòng đưa ra lời khuyên thực tế và cụ thể.',
    speechErrorBrowser: 'Trình duyệt này không hỗ trợ nhận dạng giọng nói. Vui lòng sử dụng Chrome/Edge.',
    speechErrorFail: 'Nhận dạng giọng nói thất bại, vui lòng thử lại.',
    speechErrorNoDetect: 'Không phát hiện thấy giọng nói, vui lòng thử lại.',
    logout: 'Đăng xuất',
    inputPlaceholder: 'Hoặc, nhập văn bản trực tiếp... (Enter để gửi)',
    welcome: (name: string) => `Chào, ${name}. Tôi là người bạn AI của bạn. Bây giờ bạn có thể bắt đầu nói chuyện với tôi!`,
    welcomePickAvatar: (name: string) => `Chào, ${name}, hãy chọn avatar của tôi và chúng ta hãy trò chuyện thoải mái!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: Chào, ${name}, hôm nay bạn muốn nói về điều gì?`,
    whoAmI: 'Bạn muốn tôi là ai?',
    tapToTalk: 'Nhấn để bắt đầu trò chuyện thoại...',
    aiReplying: 'AI đang trả lời, nhập tin nhắn mới để ngắt.',
    recognizing: 'Đang nhận dạng...',
    careerMode: 'Chế độ tư vấn nghề nghiệp',
    chatMode: 'Chế độ trò chuyện chung',
    careerWelcome: (name: string) => `Chào, ${name}. Tôi là cố vấn nghề nghiệp của bạn! Tôi có thể giúp bạn lập kế hoạch nghề nghiệp, đánh giá kỹ năng, chiến lược tìm việc, v.v. Vui lòng cho tôi biết mục tiêu nghề nghiệp hoặc vấn đề bạn đang gặp phải.`,
  },
  'th': {
    friend: 'เพื่อน',
    avatarTitle: 'เลือกฉันเป็นเพื่อนของคุณ',
    companionPhrase: ['🕊️ ฉันอยู่ที่นี่ริมทะเล,', 'ฉันกำลังฟังอยู่'],
    changeAvatar: 'เปลี่ยนอวตารของฉัน',
    aiReplyTemplate: (text: string) => `แชท AI: ฉันเข้าใจที่คุณหมายถึง, "${text}", เล่าให้ฉันฟังอีกสิ...`,
    aiSystemPrompt: 'คุณเป็นบุคคลเสมือนที่อบอุ่นและเข้าอกเข้าใจ โปรดตอบกลับด้วยน้ำเสียงที่ให้กำลังใจและเป็นบวก',
    careerPrompt: 'คุณเป็นที่ปรึกษาด้านอาชีพมืออาชีพ มีความเชี่ยวชาญในการช่วยผู้ใช้วางแผนอาชีพ ประเมินทักษะ กลยุทธ์การหางาน ฯลฯ โปรดให้คำแนะนำที่เป็นประโยชน์และเฉพาะเจาะจง',
    speechErrorBrowser: 'เบราว์เซอร์นี้ไม่รองรับการจำแนกเสียงพูด กรุณาใช้ Chrome/Edge',
    speechErrorFail: 'การจำแนกเสียงพูดล้มเหลว กรุณาลองอีกครั้ง',
    speechErrorNoDetect: 'ไม่พบเสียงพูด กรุณาลองอีกครั้ง',
    logout: 'ออกจากระบบ',
    inputPlaceholder: 'หรือพิมพ์ข้อความโดยตรง... (Enter เพื่อส่ง)',
    welcome: (name: string) => `สวัสดี, ${name}. ฉันคือเพื่อน AI ของคุณ คุณสามารถเริ่มคุยกับฉันได้เลย!`,
    welcomePickAvatar: (name: string) => `สวัสดี, ${name}, เลือกอวตารของฉันแล้วมาคุยกันอย่างอิสระ!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: สวัสดี, ${name}, วันนี้คุณอยากคุยเรื่องอะไร?`,
    whoAmI: 'คุณอยากให้ฉันเป็นใคร?',
    tapToTalk: 'แตะเพื่อเริ่มแชทด้วยเสียง...',
    aiReplying: 'AI กำลังตอบกลับ, พิมพ์ข้อความใหม่เพื่อขัดจังหวะ',
    recognizing: 'กำลังจดจำ...',
    careerMode: 'โหมดให้คำปรึกษาด้านอาชีพ',
    chatMode: 'โหมดแชททั่วไป',
    careerWelcome: (name: string) => `สวัสดี, ${name}. ฉันเป็นที่ปรึกษาด้านอาชีพของคุณ! ฉันสามารถช่วยคุณวางแผนอาชีพ ประเมินทักษะ กลยุทธ์การหางาน ฯลฯ โปรดบอกฉันเกี่ยวกับเป้าหมายอาชีพหรือปัญหาที่คุณกำลังเผชิญ`,
  },
  'la': {
    friend: 'Amicus',
    avatarTitle: 'Elige Me ut Amicum Tuum',
    companionPhrase: ['🕊️ Hic adsum ad mare,', 'Audio.'],
    changeAvatar: 'Muta Imaginem Meam',
    aiReplyTemplate: (text: string) => `AI Curabitur: Intellego quid velis, "${text}", sine me plura a te audire...`,
    aiSystemPrompt: 'Tu es persona virtualis calida et empathetica. Quaeso responde sono hortanti et positivo.',
    careerPrompt: 'Tu es consiliarius professionalis curriculi, peritus in adiuvandis usoribus cum consilio curriculi, aestimatione artium, strategiis quaerendi operis, etc. Quaeso praebe consilia utilia et specifica.',
    speechErrorBrowser: 'Hic navigator recognitionem vocis non sustinet. Quaeso utere Chrome/Edge.',
    speechErrorFail: 'Recognitio vocis defecit, quaeso iterum conare.',
    speechErrorNoDetect: 'Nulla oratio detecta, quaeso iterum conare.',
    logout: 'Exire',
    inputPlaceholder: 'Aut, textum directe scribe... (Enter mittere)',
    welcome: (name: string) => `Salve, ${name}. Amicus tuus AI sum. Iam potes mecum loqui!`,
    welcomePickAvatar: (name: string) => `Salve, ${name}, elige imaginem meam et libere loquamur!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: Salve, ${name}, de quo hodie loqui vis?`,
    whoAmI: 'Quis vis me esse?',
    tapToTalk: 'Tange ut colloquium vocale incipias...',
    aiReplying: 'AI respondet, scribe novum nuntium ad interrumpendum.',
    recognizing: 'Agnoscens...',
    careerMode: 'Modus Consultationis Curriculi',
    chatMode: 'Modus Colloquii Generalis',
    careerWelcome: (name: string) => `Salve, ${name}. Consiliarius curriculi tuus sum! Possum te adiuvare cum consilio curriculi, aestimatione artium, strategiis quaerendi operis, etc. Quaeso narra mihi de propositis curriculi tuis vel quaestionibus quas patieris.`,
  },
  'ms': {
    friend: 'Kawan',
    avatarTitle: 'Pilih Saya sebagai Kawan Anda',
    companionPhrase: ['🕊️ Saya di sini di tepi laut,', 'Saya sedang mendengar.'],
    changeAvatar: 'Tukar Avatar Saya',
    aiReplyTemplate: (text: string) => `Sembang AI: Saya faham maksud awak, "${text}", beritahu saya lagi...`,
    aiSystemPrompt: 'Anda adalah orang maya yang mesra dan empati. Sila balas dengan nada yang menggalakkan dan positif.',
    careerPrompt: 'Anda adalah penasihat kerjaya profesional, mahir dalam membantu pengguna dengan perancangan kerjaya, penilaian kemahiran, strategi mencari kerja, dll. Sila berikan nasihat yang praktikal dan khusus.',
    speechErrorBrowser: 'Pelayar ini tidak menyokong pengecaman pertuturan. Sila gunakan Chrome/Edge.',
    speechErrorFail: 'Pengecaman pertuturan gagal, sila cuba lagi.',
    speechErrorNoDetect: 'Tiada pertuturan dikesan, sila cuba lagi.',
    logout: 'Log keluar',
    inputPlaceholder: 'Atau, taip teks secara terus... (Enter untuk hantar)',
    welcome: (name: string) => `Hai, ${name}. Saya kawan AI anda. Anda boleh mula bercakap dengan saya sekarang!`,
    welcomePickAvatar: (name: string) => `Hai, ${name}, pilih avatar saya dan mari berbual dengan bebas!`,
    welcomeChat: (avatar: string, name: string) => `${avatar}: Hai, ${name}, apa yang anda mahu bualkan hari ini?`,
    whoAmI: 'Awak nak saya jadi siapa?',
    tapToTalk: 'Ketik untuk memulakan sembang suara...',
    aiReplying: 'AI sedang membalas, taip mesej baru untuk mengganggu.',
    recognizing: 'Mengecam...',
    careerMode: 'Mod Perundingan Kerjaya',
    chatMode: 'Mod Sembang Umum',
    careerWelcome: (name: string) => `Hai, ${name}. Saya penasihat kerjaya anda! Saya boleh membantu anda dengan perancangan kerjaya, penilaian kemahiran, strategi mencari kerja, dll. Sila beritahu saya tentang matlamat kerjaya atau isu yang anda hadapi.`,
  },
};

// 1. 多語言返回與更換頭像
const BACK_TEXT = {
  'zh-TW': '返回',
  'zh-CN': '返回',
  'en': 'Back',
  'ja': '戻る',
  'ko': '뒤로',
  'th': 'ย้อนกลับ',
  'vi': 'Quay lại',
  'ms': 'Kembali',
  'la': 'Redi',
};

const LOGOUT_TEXT = {
  'zh-TW': '登出',
  'zh-CN': '登出',
  'en': 'Logout',
  'ja': 'ログアウト',
  'ko': '로그아웃',
  'th': 'ออกจากระบบ',
  'vi': 'Đăng xuất',
  'ms': 'Log keluar',
  'la': 'Exire'
};

const CHANGE_AVATAR_TEXT = {
  'zh-TW': '更換頭像',
  'zh-CN': '更换头像',
  'en': 'Change Avatar',
  'ja': 'アバターを変更',
  'ko': '아바타 변경',
  'th': 'เปลี่ยนภาพประจำตัว',
  'vi': 'Đổi avatar',
  'ms': 'Tukar Avatar',
  'la': 'Muta Imaginem',
};

// 1. 多語言主副標題
const MAIN_TITLE = {
  'zh-TW': '讓我們來聊天...',
  'zh-CN': '让我们来聊天...',
  'en': "Let's Chat...",
  'ja': 'さあ、話そう...',
  'ko': '함께 이야기해요...',
  'th': 'มาคุยกันเถอะ...',
  'vi': 'Hãy trò chuyện nào...',
  'ms': 'Mari Berbual...',
  'la': 'Colloquamur...'
};
const SUB_TITLE = {
  'zh-TW': '聊什麼都可以喔 😊',
  'zh-CN': '聊什么都可以哦 😊',
  'en': 'Anything is okay to talk about 😊',
  'ja': '何でも話していいよ 😊',
  'ko': '무엇이든 이야기해도 돼요 😊',
  'th': 'คุยอะไรก็ได้เลย 😊',
  'vi': 'Nói gìก็ได้ nhé 😊',
  'ms': 'Boleh berbual apa sahaja 😊',
  'la': 'De omnibus loqui licet 😊'
};

export default function ChatCompanion() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [aiStreaming, setAIStreaming] = useState(false);
  const aiTimeout = useRef<NodeJS.Timeout|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showInput, setShowInput] = useState(false);
  const [recording, setRecording] = useState(false);
  const [aiAvatar, setAiAvatar] = useState<string>('');
  const [showAvatarSelect, setShowAvatarSelect] = useState(false);
  const [avatarVideo, setAvatarVideo] = useState<string>('');
  const [avatarAudio, setAvatarAudio] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [showLangBox, setShowLangBox] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [isCareerMode, setIsCareerMode] = useState(false);
  
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['zh-TW'];
  
  const langBoxRef = useRef<HTMLDivElement>(null);
  const legalMenuRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { isTestMode } = useTestMode();
  
  // 新增：響應式螢幕寬度判斷
  const [isMobile, setIsMobile] = useState(() => {
    // 在伺服器端渲染時，window 可能不存在
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  
  // 新增：用戶認證相關
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  const [authChecked, setAuthChecked] = useState(false);
  
  // 新增：登出文字
  const LOGOUT_TEXT = {
    'zh-TW': '登出',
    'zh-CN': '登出',
    'en': 'Logout',
    'ja': 'ログアウト',
    'ko': '로그아웃',
    'th': 'ออกจากระบบ',
    'vi': 'Đăng xuất',
    'ms': 'Log Keluar',
    'la': 'Exire'
  };
  
  // 新增：Footer文字
  const FOOTER_TEXT = {
    'zh-TW': {
      privacy: '隱私政策',
      terms: '使用條款',
      deletion: '資料刪除'
    },
    'zh-CN': {
      privacy: '隐私政策',
      terms: '使用条款',
      deletion: '资料删除'
    },
    'en': {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      deletion: 'Data Deletion'
    },
    'ja': {
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      deletion: 'データ削除'
    },
    'ko': {
      privacy: '개인정보 처리방침',
      terms: '이용약관',
      deletion: '데이터 삭제'
    },
    'th': {
      privacy: 'นโยบายความเป็นส่วนตัว',
      terms: 'เงื่อนไขการใช้งาน',
      deletion: 'การลบข้อมูล'
    },
    'vi': {
      privacy: 'Chính sách bảo mật',
      terms: 'Điều khoản sử dụng',
      deletion: 'Xóa dữ liệu'
    },
    'ms': {
      privacy: 'Dasar Privasi',
      terms: 'Terma Perkhidmatan',
      deletion: 'Pemadaman Data'
    },
    'la': {
      privacy: 'Politica Privata',
      terms: 'Termini Servitii',
      deletion: 'Deletio Datorum'
    }
  };

  // 新增：響應式螢幕寬度檢查
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // 新增：用戶認證檢查
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
    
    return () => unsubscribe();
  }, [auth]);

  // Handle clicking outside language box
  useEffect(() => {
    if (!showLangBox) return;
    const handleClick = (e: MouseEvent) => {
      if (langBoxRef.current && !langBoxRef.current.contains(e.target as Node)) {
        setShowLangBox(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showLangBox]);

  // Handle clicking outside legal menu
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

  // 新增：語音自動循環控制
  const [autoVoiceLoop, setAutoVoiceLoop] = useState(false);
  const voiceLoopTimeout = useRef<NodeJS.Timeout|null>(null);
  // 新增：強制控制麥克風按鈕狀態
  const [forceStop, setForceStop] = useState(false);

  // 新增：權限檢查
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);

  const getNickname = () => {
    const user = getAuth().currentUser;
    return (user && user.displayName) || localStorage.getItem('nickname') || t.friend;
  };

  const [nickname, setNickname] = useState(getNickname());
  const [lastUid, setLastUid] = useState(() => localStorage.getItem('lastUid'));
  const [firstAvatarSelected, setFirstAvatarSelected] = useState(() => !localStorage.getItem('avatarWelcomed'));
  const [isFirstChat, setIsFirstChat] = useState(() => !localStorage.getItem('aiAvatar'));
  const [uploadedAvatar, setUploadedAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    setNickname(getNickname());
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = lang;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setInput(lastTranscript + finalTranscript + interimTranscript);

        if (finalTranscript) {
          const fullText = lastTranscript + finalTranscript;
          setLastTranscript(prev => prev + finalTranscript);
          
          // 無論是測試模式還是正常模式，都自動發送語音辨識結果
          (async () => {
            const newUserMsg: ChatMsg = { id: `user-${Date.now()}`, text: fullText, sender: 'user' };
            setMessages(prev => [...prev, newUserMsg]);
            setInput('');
            
            if (aiTimeout.current) clearTimeout(aiTimeout.current);
            const newMsgId = `ai-${Date.now()}`;
            setMessages(prev => [...prev, { id: newMsgId, text: '', sender: 'ai', status: 'streaming' }]);
            setAIStreaming(true);
            
            try {
              const stream = await generateResponse(fullText, lang, t.aiSystemPrompt, isTestMode);
              let fullReply = '';
              for await (const chunk of stream) {
                fullReply += chunk;
                setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: fullReply } : m));
              }
              setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'done' } : m));
            } catch (error) {
              console.error("Error in AI pipeline: ", error);
              const errorMessage = error instanceof Error ? error.message : '未知錯誤';
              setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: `API錯誤：${errorMessage}`, status: 'done' } : m));
            } finally {
              setAIStreaming(false);
            }
          })();
          // 移除自動停止錄音，讓語音辨識持續進行
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        let errorMsg = '';
        switch (event.error) {
          case 'no-speech':
            errorMsg = t.speechErrorNoDetect;
            break;
          case 'audio-capture':
          case 'network':
            errorMsg = t.speechErrorFail;
            break;
          default:
            errorMsg = '';
        }
        setSpeechError(errorMsg);
        setRecognizing(false);
        setRecording(false);
      };

      recognitionRef.current.onend = () => {
        setRecognizing(false);
        if (recording) {
          // If recording was stopped manually, don't restart.
          // If it stopped by itself, maybe restart it if needed.
        }
      };
    } else {
      setSpeechError(t.speechErrorBrowser);
    }
  }, [lang, t.speechErrorBrowser, t.speechErrorFail, t.speechErrorNoDetect, recording, lastTranscript]);

  useEffect(() => {
    if (!recognitionRef.current) return;
    // 語音辨識結束時自動觸發AI回覆與循環
    recognitionRef.current.onend = () => {
      setRecognizing(false);
      if (autoVoiceLoop && recording && !forceStop) {
        // 停下後0.1秒自動AI回覆，然後自動再啟動語音辨識
        voiceLoopTimeout.current = setTimeout(() => {
          if (!recording || forceStop) return;
          if (input.trim()) {
            handleSend(input);
            setInput('');
            setLastTranscript('');
          }
          // AI回覆完再自動啟動語音辨識
          setTimeout(() => {
            if (recording && autoVoiceLoop && !forceStop) {
              recognitionRef.current.start();
              setRecognizing(true);
            }
          }, 500); // AI回覆後再啟動語音辨識
        }, 100);
      }
    };
    // eslint-disable-next-line
  }, [autoVoiceLoop, recording, input, forceStop]);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('aiAvatar');
    if (savedAvatar) {
      setAiAvatar(savedAvatar);
      setShowAvatarSelect(false);
    } else {
      setShowAvatarSelect(true);
    }
    
    const currentUid = getAuth().currentUser?.uid;
    if (currentUid !== lastUid) {
      localStorage.removeItem('aiAvatar');
      localStorage.removeItem('avatarWelcomed');
      setAiAvatar('');
      setLastUid(currentUid || null);
      if (currentUid) {
        localStorage.setItem('lastUid', currentUid);
      }
    }

    if (getAuth().currentUser) {
      setNickname(getAuth().currentUser?.displayName || t.friend);
    }

  }, [lastUid, t.friend]);

  // 自動捲動到最新訊息
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleLogout = async () => {
    try {
      await signOut(getAuth());
      localStorage.removeItem('nickname');
      localStorage.removeItem('lastUid');
      localStorage.removeItem('aiAvatar');
      localStorage.removeItem('avatarWelcomed');
      navigate('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSelectAvatar = (url: string) => {
    setAiAvatar(url);
    localStorage.setItem('aiAvatar', url);
    setShowAvatarSelect(false);
    if (firstAvatarSelected) {
      setMessages([{ id: 'welcome-1', text: t.welcomeChat(getAvatarName(url), nickname), sender: 'ai' }]);
      localStorage.setItem('avatarWelcomed', 'true');
      setFirstAvatarSelected(false);
    }
  };

  const fakeAIReply = (userText: string) => {
    if (aiTimeout.current) clearTimeout(aiTimeout.current);
    const newMsgId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: newMsgId, text: '', sender: 'ai', status: 'streaming' }]);
    setAIStreaming(true);

    const replyText = t.aiReplyTemplate(userText);
    let i = 0;
    const interval = setInterval(() => {
      setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: replyText.substring(0, i) } : m));
      i++;
      if (i > replyText.length) {
        clearInterval(interval);
        setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'done' } : m));
        setAIStreaming(false);
      }
    }, 50);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    // 檢查 AI 聊天權限
    const permission = await checkPermission('aiChat');
    if (!permission.allowed) {
      if (isTestMode) {
        // 測試模式下直接執行，不檢查權限，但調用真實的AI API
        const newUserMsg: ChatMsg = { id: `user-${Date.now()}`, text, sender: 'user' };
        setMessages(prev => [...prev, newUserMsg]);
        setInput('');
        setLastTranscript('');

        if (aiTimeout.current) clearTimeout(aiTimeout.current);
        const newMsgId = `ai-${Date.now()}`;
        setMessages(prev => [...prev, { id: newMsgId, text: '', sender: 'ai', status: 'streaming' }]);
        setAIStreaming(true);
        
        try {
          const systemPrompt = isCareerMode ? t.careerPrompt : t.aiSystemPrompt;
          const stream = await generateResponse(text, lang, systemPrompt, isTestMode);
          let fullReply = '';
          for await (const chunk of stream) {
            fullReply += chunk;
            setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: fullReply } : m));
          }

          setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'done' } : m));
        } catch (error) {
          console.error("Error in AI pipeline: ", error);
          const errorMessage = error instanceof Error ? error.message : '未知錯誤';
          setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: `API錯誤：${errorMessage}`, status: 'done' } : m));
        } finally {
          setAIStreaming(false);
        }
        return;
      }
      if (permission.isFreeUser) {
        // 免費用戶顯示升級跳窗
        setShowUpgradeModal(true);
      } else if (permission.canRenew) {
        // 已訂閱用戶但 Token 用完，顯示續購跳窗
        setPermissionResult(permission);
        setShowRenewalModal(true);
      } else {
        // 其他情況也顯示續購跳窗
        setPermissionResult(permission);
        setShowRenewalModal(true);
      }
      return;
    }

    const newUserMsg: ChatMsg = { id: `user-${Date.now()}`, text, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setLastTranscript('');

    if (aiTimeout.current) clearTimeout(aiTimeout.current);
    const newMsgId = `ai-${Date.now()}`;
    setMessages(prev => [...prev, { id: newMsgId, text: '', sender: 'ai', status: 'streaming' }]);
    setAIStreaming(true);
    
    try {
      const systemPrompt = isCareerMode ? t.careerPrompt : t.aiSystemPrompt;
      const stream = await generateResponse(text, lang, systemPrompt, isTestMode);
      let fullReply = '';
      for await (const chunk of stream) {
        fullReply += chunk;
        setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: fullReply } : m));
      }
      setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, status: 'done' } : m));
      
      setIsSpeaking(true);
      // 暫時跳過語音和影片生成
      // const audioUrl = await speak(fullReply, lang);
      // setAvatarAudio(audioUrl);
      // const videoUrl = await generateTalkingFace(fullReply, aiAvatar);
      // setAvatarVideo(videoUrl);
      
      // 記錄使用量
      await recordUsage('aiChat', 2); // AI 聊天消耗 2 tokens
      
    } catch (error) {
      console.error("Error in AI pipeline: ", error);
      setMessages(prev => prev.map(m => m.id === newMsgId ? { ...m, text: 'Oops, something went wrong.', status: 'done' } : m));
    } finally {
      setAIStreaming(false);
      setIsSpeaking(false);
    }
  };

  const getAvatarName = (url: string) => {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1].replace(/\.png$/i, '');
  };

  const handleRecordVoice = async () => {
    if (!recognitionRef.current) return;
    
    if (recording || autoVoiceLoop || recognizing) {
      recognitionRef.current.stop();
      setRecording(false);
      setRecognizing(false);
      setAutoVoiceLoop(false); // 停止自動循環
      if (voiceLoopTimeout.current) clearTimeout(voiceLoopTimeout.current);
      setForceStop(true); // 強制停止
    } else {
      // 檢查語音權限
      const permission = await checkPermission('aiChat');
      if (!permission.allowed) {
        if (isTestMode) {
          // 測試模式下直接執行，不檢查權限
          setLastTranscript('');
          setInput('');
          recognitionRef.current.start();
          setRecording(true);
          setRecognizing(true);
          setSpeechError('');
          setAutoVoiceLoop(true); // 啟動自動循環
          setForceStop(false);
          return;
        }
        if (permission.isFreeUser) {
          // 免費用戶顯示升級跳窗
          setShowUpgradeModal(true);
        } else if (permission.canRenew) {
          // 已訂閱用戶但 Token 用完，顯示續購跳窗
          setPermissionResult(permission);
          setShowRenewalModal(true);
        } else {
          // 其他情況也顯示續購跳窗
          setPermissionResult(permission);
          setShowRenewalModal(true);
        }
        return;
      }

      setLastTranscript('');
      setInput('');
      recognitionRef.current.start();
      setRecording(true);
      setRecognizing(true);
      setSpeechError('');
      setAutoVoiceLoop(true); // 啟動自動循環
      setForceStop(false);
      
      // 記錄使用量
      await recordUsage('aiChat', 1);
    }
  };

  const randomAvatar = () => {
    const randUrl = AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)];
    handleSelectAvatar(randUrl);
  };

  const handleUploadAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 檢查文件類型
      if (!file.type.startsWith('image/')) {
        alert('請選擇圖片文件');
        return;
      }
      
      // 檢查文件大小 (限制為 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('圖片大小不能超過 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedAvatar(result);
        handleSelectAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  
  // 確保 autoVoiceLoop 和 recording 都為 false 時才重置 forceStop
  useEffect(() => {
    if (!recording && !autoVoiceLoop) setForceStop(false);
  }, [recording, autoVoiceLoop]);

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  if (!authChecked) {
    return <div style={{textAlign:'center',marginTop:'30vh',fontSize:24}}>載入中...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' }}>

      {/* Logo - 左上角 (僅電腦版顯示) */}
      {!isMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, margin: 0, padding: 0 }}>
          <img src="/ctx-logo.png" alt="CTX Logo" style={{ width: 182, height: 182, objectFit: 'contain', cursor: 'pointer', margin: 0, padding: 0, display: 'block' }} onClick={() => navigate('/')} />
        </div>
      )}
      
      {/* 響應式適配：根據 isMobile 狀態切換 */}
      {isMobile ? (
        // 手機版使用共用頁頭
        <SharedHeader />
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
              <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '2px solid #90caf9', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 10px', minWidth: 90 }}>{lang==='zh-TW'?'註冊/登入':'zh-CN'===lang?'注册/登录':'en'===lang?'Register / Login':'ja'===lang?'登録/ログイン':'ko'===lang?'가입/로그인':'th'===lang?'สมัคร/เข้าสู่ระบบ':'vi'===lang?'Đăng ký/Đăng nhập':'ms'===lang?'Daftar / Log Masuk':'Registrare / Login'}</button>
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
      )}



      {showAvatarSelect && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, textAlign: 'center', position: 'relative' }}>
            {/* X 關閉按鈕 */}
            <button 
              onClick={() => setShowAvatarSelect(false)} 
              style={{ 
                position: 'absolute', 
                top: 12, 
                right: 12, 
                background: 'none', 
                border: 'none', 
                fontSize: 24, 
                color: '#888', 
                cursor: 'pointer', 
                fontWeight: 700 
              }}
            >
              ×
            </button>
            <h2>{t.avatarTitle}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, margin: '24px 0' }}>
              {AVATAR_LIST.slice(0, 15).map(url => (
                <img key={url} src={url} alt={getAvatarName(url)} onClick={() => handleSelectAvatar(url)} style={{ width: 80, height: 80, borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }} />
              ))}
              {/* 上傳心儀頭像 */}
              <div 
                style={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: '50%', 
                  border: '2px dashed #6B5BFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer',
                  background: '#f8f8ff',
                  color: '#6B5BFF',
                  fontSize: 12,
                  fontWeight: 600
                }}
                onClick={triggerFileUpload}
              >
                上傳心儀頭像
              </div>
            </div>
            {/* 隱藏的文件輸入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUploadAvatar}
            />
          </div>
        </div>
      )}

      {!aiAvatar && !showAvatarSelect && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 18, marginBottom: 24 }}>{t.welcomePickAvatar(nickname)}</p>
          <button onClick={() => setShowAvatarSelect(true)} style={{ padding: '10px 20px', borderRadius: 8, background: '#1877f2', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16 }}>
            {t.avatarTitle}
          </button>
        </div>
      )}
      
      {aiAvatar && (
        <main 
          ref={chatContainerRef}
          className="chat-main-container"
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '20px',
            paddingLeft: '20px', // 移除額外的左側padding，讓內容真正居中
            paddingTop: '200px', // 桌面版增加頂部間距，讓對話框在LOGO下方
            maxHeight: 'calc(100vh - 240px)', // 調整高度計算，為固定footer預留空間
            scrollBehavior: 'smooth',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column-reverse' // 讓最新訊息顯示在上面
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100%', display: 'flex', flexDirection: 'column-reverse' }}>
            {/* 確保最後一條訊息後有足夠空間 */}
            <div style={{ height: '20px' }}></div>
            {messages.slice().reverse().map((msg) => (
              <div key={msg.id} style={{ 
                display: 'flex', 
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'center', // 用戶訊息靠右，AI訊息居中
                margin: '15px 0', // 增加上下間距，讓左右訊息不會平行
                wordWrap: 'break-word',
                width: '100%'
              }}>
                <div style={{
                  backgroundColor: msg.sender === 'user' ? '#0084ff' : '#e4e6eb',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  padding: '10px 14px',
                  borderRadius: 18,
                  maxWidth: '60%', // 統一最大寬度
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.3',
                  fontSize: '14px' // 統一文字大小
                }}>
                  {msg.text}
                  {msg.status === 'streaming' && '...'}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
                <p style={{ fontSize: 18 }}>{t.welcomeChat(getAvatarName(aiAvatar), nickname)}</p>
              </div>
            )}
          </div>
        </main>
      )}

      {aiAvatar && (
        <footer style={{ 
          padding: '10px 20px 10px 20px', 
          backgroundColor: '#fff', 
          borderTop: '1px solid #ddd', 
          position: 'relative',
          minHeight: '160px', // 固定最小高度避免佈局變化
          boxSizing: 'border-box'
        }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ flex: 1, marginLeft: 0, marginRight: 0 }}>
              {/* 手機版：AI頭像和使用者頭像在訊息框上方 */}
              <div className="mobile-avatars-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '0 8px' }}>
                {/* AI頭像 - 手機版樣式 */}
                <div className="mobile-ai-avatar" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 80, height: 80, borderRadius: '50% / 45%', border: '4px solid #2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'hidden' }}>
                    <div style={{ width: 72, height: 72, minWidth: 72, minHeight: 72, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                        <VirtualAvatar avatar={aiAvatar} videoUrl={avatarVideo} audioUrl={avatarAudio} isSpeaking={isSpeaking} size={72} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setShowAvatarSelect(true)} style={{ background: '#6B5BFF', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontWeight: 600, fontSize: 10, cursor: 'pointer', boxShadow: '0 2px 4px rgba(107, 91, 255, 0.3)', whiteSpace: 'nowrap' }}>{CHANGE_AVATAR_TEXT[lang]}</button>
                </div>
                            {/* 中間歡迎訊息 */}
            <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
              <div style={{ fontSize: 14, color: '#666', lineHeight: '1.4' }}>
                <span style={{ fontWeight: 700, color: '#ff9800' }}>{getAvatarName(aiAvatar) || 'Fenny'}</span>
                <br />
                <span style={{ color: '#1976d2' }}>
                  {isCareerMode ? t.careerMode : (lang === 'zh-TW' ? '讓我們來聊天...' : lang === 'zh-CN' ? '让我们来聊天...' : lang === 'en' ? "Let's Chat..." : lang === 'ja' ? 'さあ、話そう...' : lang === 'ko' ? '함께 이야기해요...' : lang === 'th' ? 'มาคุยกันเถอะ...' : lang === 'vi' ? 'Hãy trò chuyện nào...' : lang === 'ms' ? 'Mari Berbual...' : 'Colloquamur...')}
                </span>
                <br />
                <span style={{ color: '#1976d2' }}>{getAuth().currentUser?.displayName || getAuth().currentUser?.email || (lang === 'zh-TW' ? '用戶' : lang === 'zh-CN' ? '用户' : lang === 'en' ? 'User' : lang === 'ja' ? 'ユーザー' : lang === 'ko' ? '사용자' : lang === 'th' ? 'ผู้ใช้' : lang === 'vi' ? 'Người dùng' : lang === 'ms' ? 'Pengguna' : 'Usor')}</span>
                <br />
                <span style={{ color: '#666' }}>
                  {isCareerMode ? (lang === 'zh-TW' ? '職業規劃、技能評估、求職策略 💼' : lang === 'zh-CN' ? '职业规划、技能评估、求职策略 💼' : lang === 'en' ? 'Career planning, skill assessment, job search strategies 💼' : lang === 'ja' ? 'キャリアプランニング、スキル評価、求職戦略 💼' : lang === 'ko' ? '커리어 플래닝, 스킬 평가, 구직 전략 💼' : lang === 'th' ? 'การวางแผนอาชีพ การประเมินทักษะ กลยุทธ์การหางาน 💼' : lang === 'vi' ? 'Lập kế hoạch nghề nghiệp, đánh giá kỹ năng, chiến lược tìm việc 💼' : lang === 'ms' ? 'Perancangan kerjaya, penilaian kemahiran, strategi mencari kerja 💼' : 'Consilium curriculi, aestimatio artium, strategiae quaerendi operis 💼') : (lang === 'zh-TW' ? '聊什麼都可以喔 😊' : lang === 'zh-CN' ? '聊什么都可以哦 😊' : lang === 'en' ? 'Anything is okay to talk about 😊' : lang === 'ja' ? '何でも話していいよ 😊' : lang === 'ko' ? '무엇이든 이야기해도 돼요 😊' : lang === 'th' ? 'คุยอะไรก็ได้เลย 😊' : lang === 'vi' ? 'Nói gì cũng được nhé 😊' : lang === 'ms' ? 'Boleh berbual apa sahaja 😊' : 'De omnibus loqui licet 😊')}
                </span>
                <br />
                {/* 職業諮詢模式切換按鈕 */}
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => setIsCareerMode(!isCareerMode)}
                    style={{
                      background: isCareerMode ? '#FF6B9D' : '#6B5BFF',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 16,
                      padding: '6px 12px',
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isCareerMode ? `💼 ${t.careerMode}` : `💬 ${t.chatMode}`}
                  </button>
                </div>
              </div>
            </div>
                {/* 使用者頭像 - 手機版樣式 */}
                <div style={{ width: 80, height: 80, borderRadius: '50% / 45%', border: '4px solid #2196f3', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflow: 'visible' }}>
                  <img src={getAuth().currentUser?.photoURL || '/ctx-logo.png'} alt="user" style={{ width: 72, height: 72, minWidth: 72, minHeight: 72, borderRadius: '50%', objectFit: 'cover', border: 'none', verticalAlign: 'bottom' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: 80 }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={aiStreaming ? t.aiReplying : t.inputPlaceholder}
                  style={{ width: '100%', padding: 12, borderRadius: 18, border: '1px solid #ccc' }}
                  disabled={aiStreaming || recognizing}
                />
              </div>
              {/* 手機版：送出與麥克風按鈕在輸入框下方置中 */}
              <div className="chat-action-row-mobile" style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 16 }}>
                <button
                  onClick={() => handleSend()}
                  disabled={aiStreaming || !input}
                  style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 16, cursor: aiStreaming || !input ? 'not-allowed' : 'pointer' }}
                >送出</button>
                <button
                  onClick={handleRecordVoice}
                  disabled={aiStreaming}
                  style={{ padding: 16, borderRadius: '50%', border: 'none', background: (recording || autoVoiceLoop || recognizing) ? '#ff4d4d' : '#1877f2', color: '#fff', cursor: 'pointer', fontSize: 20 }}
                >
                  {(recording || autoVoiceLoop || recognizing) ? '停止' : '🎤'}
                </button>
              </div>
              {/* 電腦版：送出與麥克風按鈕在輸入框下方置中 */}
              <div className="chat-action-row-desktop" style={{ width: '100%', display: 'none', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 16 }}>
                <button
                  onClick={() => handleSend()}
                  disabled={aiStreaming || !input}
                  style={{ padding: '10px 28px', borderRadius: 8, border: 'none', background: '#1976d2', color: '#fff', fontWeight: 700, fontSize: 16, cursor: aiStreaming || !input ? 'not-allowed' : 'pointer' }}
                >送出</button>
                <button
                  onClick={handleRecordVoice}
                  disabled={aiStreaming}
                  style={{ padding: 16, borderRadius: '50%', border: 'none', background: (recording || autoVoiceLoop || recognizing) ? '#ff4d4d' : '#1877f2', color: '#fff', cursor: 'pointer', fontSize: 20 }}
                >
                  {(recording || autoVoiceLoop || recognizing) ? '停止' : '🎤'}
                </button>
              </div>
              {/* 固定高度的提示區域，避免佈局閃動 */}
              <div style={{ height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {speechError && <p style={{ color: 'red', margin: 0 }}>{speechError}</p>}
                {!speechError && !input && !recognizing && !aiStreaming && !recording && !autoVoiceLoop &&
                  <p style={{ color: '#888', margin: 0, cursor: 'pointer' }} onClick={handleRecordVoice}>{t.tapToTalk}</p>
                }
                {!speechError && recognizing && <p style={{ color: '#888', margin: 0 }}>{t.recognizing}</p>}
                {!speechError && (input || aiStreaming || recording || autoVoiceLoop) && <p style={{ color: 'transparent', margin: 0 }}>佔位</p>}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#aaa' }}>
              <p>{t.companionPhrase[0]}{t.companionPhrase[1]}</p>
          </div>
        </footer>
      )}
      

      
      {/* Token 續購彈窗 */}
      {showRenewalModal && permissionResult && (
        <TokenRenewalModal
          isOpen={showRenewalModal}
          onClose={handleRenewalModalClose}
          currentPlan={permissionResult.currentPlan}
          remainingDays={permissionResult.remainingDays}
          usedTokens={permissionResult.usedTokens}
          totalTokens={permissionResult.totalTokens}
        />
      )}

      {/* 升級彈窗 */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="AI 聊天"
        />
      )}
    </div>
  );
}

<style>{`
  @media (min-width: 768px) {
    .mobile-shared-header {
      display: none !important;
    }
    .desktop-topbar {
      display: flex !important;
    }
    .chat-main-container {
      padding-top: 200px !important;
      padding-left: 20px !important;
    }
    .emotion-phrase-left {
      position: fixed;
      top: 32%;
      left: 2vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      display: block;
    }
    .emotion-phrase-right {
      position: fixed;
      top: 32%;
      right: 2vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: right;
      display: block;
    }
    .emotion-phrase-mobile-top, .emotion-phrase-mobile-bottom {
      display: none;
    }
  }
  @media (max-width: 767px) {
    .mobile-shared-header {
      display: block !important;
    }
    .desktop-topbar {
      display: none !important;
    }
    /* 手機版顯示SharedHeader頁頭 */
    .fixed-logo-box {
      display: none !important;
    }
    .chat-main-container {
      padding: 20px !important;
      padding-top: 20px !important;
    }
    .chat-main-container > div {
      max-width: 800px !important;
    }
    .emotion-phrase-left, .emotion-phrase-right {
      display: none;
    }
    .emotion-phrase-mobile-top {
      position: fixed;
      top: 70px;
      left: 0;
      width: 100vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.08rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: center;
      display: block;
    }
    .emotion-phrase-mobile-bottom {
      position: fixed;
      bottom: 60px;
      left: 0;
      width: 100vw;
      z-index: 1001;
      color: #fff;
      font-size: 1.08rem;
      font-weight: 400;
      text-shadow: 0 2px 8px #23294688;
      background: rgba(0,0,0,0.18);
      border-radius: 10px;
      padding: 6px 18px;
      backdrop-filter: blur(2px);
      box-shadow: 0 2px 12px #0002;
      text-align: center;
      display: block;
    }
  }
  .companion-phrase-left {
    position: absolute;
    top: 120px;
    left: 32px;
    color: rgba(255,255,255,0.85);
    font-size: 1.15rem;
    line-height: 1.6;
    max-width: 200px;
    text-shadow: 0 2px 8px #23294688;
    z-index: 1001;
    font-weight: 400;
    pointer-events: none;
    letter-spacing: 0.5px;
    background: rgba(0,0,0,0.10);
    border-radius: 10px;
    padding: 8px 16px;
    box-shadow: 0 2px 12px #0002;
    backdrop-filter: blur(2px);
  }
  @media (max-width: 767px) {
    .companion-phrase-left {
      position: static;
      margin: 12px auto 0 auto;
      left: unset;
      top: unset;
      display: block;
      text-align: center;
      max-width: 90vw;
      background: rgba(0,0,0,0.18);
    }
  }
  @media (min-width: 768px) {
    .change-avatar-desktop { display: block !important; }
    .change-avatar-mobile { display: none !important; }
    .ai-avatar-img-wrap { width: 40px !important; height: 40px !important; }
    .ai-name-desktop { max-width: 120px !important; }
    .chat-action-row-mobile { display: none !important; }
    .chat-action-row-desktop { display: flex !important; }
    .mobile-avatars-row { display: none !important; }
  }
  @media (max-width: 767px) {
    .change-avatar-desktop { display: none !important; }
    .change-avatar-mobile { display: block !important; }
    .ai-avatar-img-wrap { width: 40px !important; height: 40px !important; }
    .ai-name-desktop { max-width: 100px !important; }
    .chat-action-row-mobile { display: flex !important; }
    .chat-action-row-desktop { display: none !important; }
    .mobile-avatars-row { display: flex !important; }
  }
`}</style> 