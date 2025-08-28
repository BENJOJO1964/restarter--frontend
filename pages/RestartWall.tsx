import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWithTone } from '../utils/toneFormatter';
import type { Tone, Quote } from '../../shared/types';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { usePermission } from '../hooks/usePermission';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import Footer from '../components/Footer';
import { useTestMode } from '../App';
import SharedHeader from '../components/SharedHeader';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';
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

const TEXTS: Record<LanguageCode, any> = {
  'zh-TW': {
    back: '返回',
    logout: '登出',
    title: '🧱 情緒牆 Restart Wall',
    subtitle: '社交情感支援平台',
    subtitleDesc: '在這裡，每個人都能找到情感上的歸屬感和支援。分享你的心情，或為他人提供溫暖的支援留言，讓我們一起建立溫暖的社群。',
    inbox: '💌 我的留言箱',
    placeholder: '說出你的心聲...(200字內)',
    send: window.innerWidth <= 768 ? '送出' : '發送',
    sending: '發送中...',
    noMessages: '還沒有留言，快來發表你的心聲吧！',
    commentsTitle: '支援留言：',
    noComments: '還沒有人留言支援',
    modalTitle: '這是他的心情貼文：',
    modalAction: '給他支援留言：',
    nicknamePlaceholder: '你的暱稱',
    commentPlaceholder: '支援內容...',
    submitComment: '送出支援',
    supportMessage: '💝 給予支援',
    supportDesc: '看到別人的情感分享，給予溫暖的支援和鼓勵',
    recording: '錄音中',
    pressToStop: '按下停止',
    readyToRecord: '準備開始錄音',
    recordInstruction: '點擊「開始錄音」後，系統將開始錄製您的語音留言。',
    recordTimeLimit: '錄音時間限制為1分鐘',
    cancel: '取消',
    startRecording: '開始錄音',
    voice: '語音',
  },
  'zh-CN': {
    back: '返回',
    logout: '登出',
    title: '🧱 情绪墙 Restart Wall',
    subtitle: '社交情感支援平台',
    subtitleDesc: '在这里，每个人都能找到情感上的归属感和支援。分享你的心情，或为他人提供温暖的支援留言，让我们一起建立温暖的社群。',
    inbox: '💌 我的留言箱',
    placeholder: '说出你的心声...',
    send: '发送',
    sending: '发送中...',
    noMessages: '还没有留言，快来发表你的心声吧！',
    commentsTitle: '支援留言：',
    noComments: '还没有人留言支援',
    modalTitle: '这是他的心情贴文：',
    modalAction: '给他支援留言：',
    nicknamePlaceholder: '你的昵称',
    commentPlaceholder: '支援内容...',
    submitComment: '送出支援',
    supportMessage: '💝 给予支援',
    supportDesc: '看到别人的情感分享，给予温暖的支援和鼓励',
    recording: '录音中',
    pressToStop: '按下停止',
    readyToRecord: '准备开始录音',
    recordInstruction: '点击「开始录音」后，系统将开始录制您的语音留言。',
    recordTimeLimit: '录音时间限制为1分钟',
    cancel: '取消',
    startRecording: '开始录音',
    voice: '语音',
  },
  'en': {
    back: 'Back',
    logout: 'Logout',
    title: '🧱 Emotion Wall Restart Wall',
    subtitle: 'Social Emotional Support Platform',
    subtitleDesc: 'Here, everyone can find emotional belonging and support. Share your feelings, or provide warm support messages to others. Let\'s build a caring community together.',
    inbox: '💌 My Inbox',
    placeholder: 'Say what you feel...',
    send: 'Send',
    sending: 'Sending...',
    noMessages: 'No messages yet. Come and share your feelings!',
    commentsTitle: 'Support Messages:',
    noComments: 'No support messages yet',
    modalTitle: "Here's their post:",
    modalAction: 'Leave support message:',
    nicknamePlaceholder: 'Your Nickname',
    commentPlaceholder: 'Support content...',
    submitComment: 'Send Support',
    supportMessage: '💝 Give Support',
    supportDesc: 'See others\' emotional sharing and give warm support and encouragement',
    recording: 'Recording',
    pressToStop: 'Press to Stop',
    readyToRecord: 'Ready to Start Recording',
    recordInstruction: 'After clicking "Start Recording", the system will begin recording your voice message.',
    recordTimeLimit: 'Recording time limit is 1 minute',
    cancel: 'Cancel',
    startRecording: 'Start Recording',
    voice: 'Voice',
  },
  'ja': {
    back: '戻る',
    logout: 'ログアウト',
    title: '🧱 感情の壁 Restart Wall',
    subtitle: 'ソーシャル感情サポートプラットフォーム',
    subtitleDesc: 'ここでは、誰もが感情的な帰属意識とサポートを見つけることができます。あなたの気持ちを共有したり、他の人に温かい支援メッセージを提供したりして、一緒に思いやりのあるコミュニティを築きましょう。',
    inbox: '💌 私の受信箱',
    placeholder: 'あなたの気持ちを話して...',
    send: '送信',
    sending: '送信中...',
    noMessages: 'まだメッセージはありません。あなたの気持ちを投稿しに来てください！',
    commentsTitle: '支援メッセージ：',
    noComments: 'まだ支援メッセージはありません',
    modalTitle: '彼の投稿です：',
    modalAction: '彼に支援メッセージを送る：',
    nicknamePlaceholder: 'あなたのニックネーム',
    commentPlaceholder: '支援内容...',
    submitComment: '支援を送信',
    supportMessage: '💝 支援を送る',
    supportDesc: '他の人の感情的な共有を見て、温かい支援と励ましを提供する',
    recording: '録音中',
    pressToStop: '押して停止',
    readyToRecord: '録音の準備',
    recordInstruction: '「録音開始」をクリックすると、システムが音声メッセージの録音を開始します。',
    recordTimeLimit: '録音時間は1分に制限されています',
    cancel: 'キャンセル',
    startRecording: '録音開始',
    voice: '音声',
  },
    'ko': {
    back: '돌아가기',
    logout: '로그아웃',
    title: '🧱 감정의 벽 Restart Wall',
    subtitle: '소셜 감정 지원 플랫폼',
    subtitleDesc: '여기서 모든 사람이 감정적 소속감과 지원을 찾을 수 있습니다. 당신의 감정을 공유하거나 다른 사람에게 따뜻한 지원 메시지를 제공하여 함께 돌봄의 커뮤니티를 만들어봅시다.',
    inbox: '💌 내 메시지함',
    placeholder: '당신의 마음을 말해보세요...',
    send: '전송',
    sending: '전송 중...',
    noMessages: '아직 메시지가 없습니다. 와서 당신의 마음을 표현하세요!',
    commentsTitle: '지원 메시지:',
    noComments: '아직 지원 메시지가 없습니다',
    modalTitle: '그의 게시물입니다:',
    modalAction: '그에게 지원 메시지 남기기:',
    nicknamePlaceholder: '닉네임',
    commentPlaceholder: '지원 내용...',
    submitComment: '지원 보내기',
    supportMessage: '💝 지원하기',
    supportDesc: '다른 사람의 감정적 공유를 보고 따뜻한 지원과 격려를 제공',
    recording: '녹음 중',
    pressToStop: '누르면 중지',
    readyToRecord: '녹음 준비',
    recordInstruction: '「녹음 시작」을 클릭하면 시스템이 음성 메시지 녹음을 시작합니다.',
    recordTimeLimit: '녹음 시간은 1분으로 제한됩니다',
    cancel: '취소',
    startRecording: '녹음 시작',
    voice: '음성',
  },
  'vi': {
    back: 'Quay lại',
    logout: 'Đăng xuất',
    title: '🧱 Bức tường Cảm xúc Restart Wall',
    subtitle: 'Nền tảng Hỗ trợ Cảm xúc Xã hội',
    subtitleDesc: 'Ở đây, mọi người đều có thể tìm thấy sự thuộc về và hỗ trợ về mặt cảm xúc. Chia sẻ cảm xúc của bạn, hoặc cung cấp tin nhắn hỗ trợ ấm áp cho người khác. Hãy cùng nhau xây dựng một cộng đồng quan tâm.',
    inbox: '💌 Hộp thư của tôi',
    placeholder: 'Nói ra cảm xúc của bạn...',
    send: 'Gửi',
    sending: 'Đang gửi...',
    noMessages: 'Chưa có tin nhắn nào. Hãy đến và chia sẻ cảm xúc của bạn!',
    commentsTitle: 'Tin nhắn hỗ trợ:',
    noComments: 'Chưa có tin nhắn hỗ trợ nào',
    modalTitle: 'Đây là bài đăng của họ:',
    modalAction: 'Để lại tin nhắn hỗ trợ:',
    nicknamePlaceholder: 'Biệt danh của bạn',
    commentPlaceholder: 'Nội dung hỗ trợ...',
    submitComment: 'Gửi hỗ trợ',
    supportMessage: '💝 Gửi hỗ trợ',
    supportDesc: 'Xem chia sẻ cảm xúc của người khác và đưa ra hỗ trợ và khích lệ ấm áp',
    recording: 'Đang ghi âm',
    pressToStop: 'Nhấn để dừng',
    readyToRecord: 'Sẵn sàng ghi âm',
    recordInstruction: 'Sau khi nhấp vào "Bắt đầu ghi âm", hệ thống sẽ bắt đầu ghi âm tin nhắn giọng nói của bạn.',
    recordTimeLimit: 'Thời gian ghi âm giới hạn 1 phút',
    cancel: 'Hủy',
    startRecording: 'Bắt đầu ghi âm',
    voice: 'Giọng nói',
  },
  'th': {
    back: 'กลับ',
    logout: 'ออกจากระบบ',
    title: '🧱 กำแพงอารมณ์ Restart Wall',
    subtitle: 'แพลตฟอร์มสนับสนุนอารมณ์ทางสังคม',
    subtitleDesc: 'ที่นี่ ทุกคนสามารถหาความเป็นเจ้าของและความสนับสนุนทางอารมณ์ได้ แบ่งปันความรู้สึกของคุณ หรือให้ข้อความสนับสนุนที่อบอุ่นแก่ผู้อื่น มาเริ่มสร้างชุมชนที่ห่วงใยกันเถอะ',
    inbox: '💌 กล่องข้อความของฉัน',
    placeholder: 'บอกความรู้สึกของคุณ...',
    send: 'ส่ง',
    sending: 'กำลังส่ง...',
    noMessages: 'ยังไม่มีข้อความ มาแบ่งปันความรู้สึกของคุณสิ!',
    commentsTitle: 'ข้อความสนับสนุน:',
    noComments: 'ยังไม่มีข้อความสนับสนุน',
    modalTitle: 'นี่คือโพสต์ของพวกเขา:',
    modalAction: 'แสดงข้อความสนับสนุน:',
    nicknamePlaceholder: 'ชื่อเล่นของคุณ',
    commentPlaceholder: 'เนื้อหาสนับสนุน...',
    submitComment: 'ส่งการสนับสนุน',
    supportMessage: '💝 ให้การสนับสนุน',
    supportDesc: 'ดูการแบ่งปันอารมณ์ของผู้อื่นและให้การสนับสนุนและกำลังใจที่อบอุ่น',
    recording: 'กำลังบันทึก',
    pressToStop: 'กดเพื่อหยุด',
    readyToRecord: 'พร้อมบันทึกเสียง',
    recordInstruction: 'หลังจากคลิก "เริ่มบันทึก" ระบบจะเริ่มบันทึกข้อความเสียงของคุณ',
    recordTimeLimit: 'เวลาบันทึกเสียงจำกัด 1 นาที',
    cancel: 'ยกเลิก',
    startRecording: 'เริ่มบันทึก',
    voice: 'เสียง',
  },
  'la': {
    back: 'Redire',
    logout: 'Exire',
    title: '🧱 Murus Emotionum Restart Wall',
    subtitle: 'Platea Socialis Sustentationis Emotionalis',
    subtitleDesc: 'Hic, omnes possunt invenire pertinere emotionalem et sustentationem. Communica sensus tuos, vel praebe calidas sustentationis epistulas aliis. Simul aedificemus communitatem curantem.',
    inbox: '💌 Cista Mea',
    placeholder: 'Dic quod sentis...',
    send: 'Mittere',
    sending: 'Mittens...',
    noMessages: 'Nullae epistulae adhuc. Veni et communica sensus tuos!',
    commentsTitle: 'Epistulae Sustentationis:',
    noComments: 'Nullae epistulae sustentationis adhuc',
    modalTitle: 'Ecce nuntius eorum:',
    modalAction: 'Mitte epistulam sustentationis:',
    nicknamePlaceholder: 'Tuum agnomen',
    commentPlaceholder: 'Contentum sustentationis...',
    submitComment: 'Mitte Sustentationem',
    supportMessage: '💝 Da Sustentationem',
    supportDesc: 'Vide communicationem emotionalem aliorum et praebe calidam sustentationem et cohortationem',
    recording: 'Recordans',
    pressToStop: 'Preme ad Desinere',
    readyToRecord: 'Paratus ad Recordandum',
    recordInstruction: 'Postquam "Incipe Recordandum" cliccas, systema incipiet recordare nuntium vocis tuae.',
    recordTimeLimit: 'Tempus recordandi limitatur ad 1 minuta',
    cancel: 'Cancella',
    startRecording: 'Incipe Recordandum',
    voice: 'Vox',
  },
  'ms': {
    back: 'Kembali',
    logout: 'Log Keluar',
    title: '🧱 Tembok Emosi Restart Wall',
    subtitle: 'Platform Sokongan Emosi Sosial',
    subtitleDesc: 'Di sini, semua orang dapat mencari rasa kepunyaan dan sokongan emosi. Kongsi perasaan anda, atau berikan mesej sokongan yang hangat kepada orang lain. Mari kita bina komuniti yang prihatin bersama.',
    inbox: '💌 Kotak Mesej Saya',
    placeholder: 'Katakan perasaan anda...',
    send: 'Hantar',
    sending: 'Menghantar...',
    noMessages: 'Belum ada mesej lagi. Datang dan kongsi perasaan anda!',
    commentsTitle: 'Mesej Sokongan:',
    noComments: 'Belum ada mesej sokongan',
    modalTitle: 'Ini adalah siaran mereka:',
    modalAction: 'Tinggalkan mesej sokongan:',
    nicknamePlaceholder: 'Nama samaran anda',
    commentPlaceholder: 'Kandungan sokongan...',
    submitComment: 'Hantar Sokongan',
    supportMessage: '💝 Beri Sokongan',
    supportDesc: 'Lihat perkongsian emosi orang lain dan berikan sokongan dan galakan yang hangat',
    recording: 'Merakam',
    pressToStop: 'Tekan untuk Berhenti',
    readyToRecord: 'Sedia untuk Merakam',
    recordInstruction: 'Selepas mengklik "Mula Merakam", sistem akan mula merakam mesej suara anda.',
    recordTimeLimit: 'Masa rakaman terhad kepada 1 minit',
    cancel: 'Batal',
    startRecording: 'Mula Merakam',
    voice: 'Suara',
  },
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

interface Message {
  id: string;
  text: string;
  aiReply: string;
  toneId: string;
  createdAt: string;
  audioUrl?: string;
  duration?: number; // 新增：儲存錄音時長
  user: {
    id: string;
    name: string;
    avatar: string;
    country: string;
    region: string;
    email: string;
  };
  comments?: { 
    nickname: string; 
    content: string; 
    toUserId: string;
    commenterId: string; // 留言者ID
    commenterEmail: string; // 留言者郵箱
    commenterCountry: string; // 留言者國家
    commenterGender: string; // 留言者性別
    commenterAge: number; // 留言者年齡
    createdAt?: string; // 支援留言創建時間
    commenterAvatar?: string; // 支援留言者頭像
  }[];
}

const AVATAR_LIST = [
  '/avatars/male1.jpg', '/avatars/female1.jpg', '/avatars/male2.jpg', '/avatars/female2.jpg',
  '/avatars/male3.jpg', '/avatars/female3.jpg', '/avatars/male4.jpg', '/avatars/female4.jpg',
];

function randomAvatar() {
  return AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)];
}

function randomName() {
  const names = ['小明', '小美', 'John', 'Alice', 'Yuki', 'Tom', 'Mia', 'Ken'];
  return names[Math.floor(Math.random() * names.length)];
}

function randomCountry() {
  const arr = ['台灣', '日本', '美國', '香港', '韓國', '新加坡'];
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomRegion() {
  const arr = ['台北', '東京', '舊金山', '首爾', '新加坡', '高雄'];
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomEmail(name: string) {
  return name.toLowerCase() + '@demo.com';
}

// 模擬用戶資料
const mockUserData = {
  id: 'user123',
  name: '小明',
  avatar: 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=小',
  email: 'xiaoming@example.com',
  country: '台灣',
  gender: '男',
  age: 25
};

// 模擬其他用戶資料
const mockOtherUsers = {
  'user456': {
    id: 'user456',
    name: '小華',
    avatar: 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=華',
    email: 'xiaohua@example.com',
    country: '香港',
    gender: '女',
    age: 28
  },
  'user789': {
    id: 'user789',
    name: '阿強',
    avatar: 'https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=強',
    email: 'aqiang@example.com',
    country: '新加坡',
    gender: '男',
    age: 32
  }
};

// 獲取用戶完整信息
const getUserFullInfo = (userId: string) => {
  if (userId === mockUserData.id) {
    return mockUserData;
  }
  return mockOtherUsers[userId as keyof typeof mockOtherUsers] || {
    id: userId,
    name: '匿名用戶',
    avatar: 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?',
    email: 'anonymous@example.com',
    country: '未知',
    gender: '未知',
    age: 0
  };
};

// 獲取顯示給其他用戶的信息
const getUserDisplayInfo = (userId: string) => {
  const userInfo = getUserFullInfo(userId);
  return {
    avatar: userInfo.avatar,
    country: userInfo.country,
    name: userInfo.name
  };
};

// 獲取顯示給原貼文者的信息
const getUserOwnerInfo = (userId: string) => {
  const userInfo = getUserFullInfo(userId);
  return {
    name: userInfo.name,
    avatar: userInfo.avatar,
    email: userInfo.email,
    country: userInfo.country,
    gender: userInfo.gender,
    age: userInfo.age
  };
};

export default function RestartWall() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showUser, setShowUser] = useState<null|Message>(null);
  const [commentInput, setCommentInput] = useState('');
  const [showMyMessages, setShowMyMessages] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // 語音錄製相關狀態
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string>('');
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [showRecordingConfirm, setShowRecordingConfirm] = useState(false);
  
  // 語音錄製相關引用
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const actualRecordingDurationRef = useRef<number>(0);
  
  // 播放狀態管理
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [countdownTimer, setCountdownTimer] = useState<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['zh-TW'];
  
  // 新增：用戶狀態和頁頭相關狀態
  const [user, setUser] = useState<User | null>(null);
  const [showLangBox, setShowLangBox] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const langBoxRef = useRef<HTMLDivElement>(null);
  const legalMenuRef = useRef<HTMLDivElement>(null);

  // 新增：權限檢查
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);

  const { isTestMode } = useTestMode();

  // 新增：處理用戶狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 新增：處理點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langBoxRef.current && !langBoxRef.current.contains(event.target as Node)) {
        setShowLangBox(false);
      }
      if (legalMenuRef.current && !legalMenuRef.current.contains(event.target as Node)) {
        setShowLegalMenu(false);
      }
    };

    if (showLangBox || showLegalMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLangBox, showLegalMenu]);

  // 從 Firestore 獲取用戶完整個人信息
  const getUserProfile = async (userId: string) => {
    try {
      const docRef = doc(db, "profiles", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          name: data.nickname || data.name || '用戶',
          avatar: data.avatar || '/avatars/Derxl.png',
          country: data.country || '台灣',
          gender: data.gender || '未知',
          age: data.age || 25,
          email: auth.currentUser?.email || 'unknown@example.com'
        };
      } else {
        // 如果沒有 profile 文檔，使用 Auth 中的基本信息
        const currentUser = auth.currentUser;
        return {
          name: currentUser?.displayName || currentUser?.email?.split('@')[0] || '用戶',
          avatar: currentUser?.photoURL || '/avatars/Derxl.png',
          country: '台灣',
          gender: '未知',
          age: 25,
          email: currentUser?.email || 'unknown@example.com'
        };
      }
    } catch (error) {
      console.error('獲取用戶資料失敗:', error);
      // 返回默認值
      const currentUser = auth.currentUser;
      return {
        name: currentUser?.displayName || currentUser?.email?.split('@')[0] || '用戶',
        avatar: currentUser?.photoURL || '/avatars/Derxl.png',
        country: '台灣',
        gender: '未知',
        age: 25,
        email: currentUser?.email || 'unknown@example.com'
      };
    }
  };

  // 初始化加載localStorage中的消息
  useEffect(() => {
    // 清理舊的假數據
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        
        // 過濾掉使用假用戶ID的消息（保留真實用戶的消息）
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const filteredMessages = parsedMessages.filter((msg: Message) => {
          // 保留真實用戶發送的消息，或者如果沒有登入用戶，保留所有消息
          return !currentUser || msg.user.id !== 'user123' && msg.user.id !== 'user456' && msg.user.id !== 'user789';
        });
        
        // 清理沒有正確錄音時長的語音消息
        const cleanedMessages = filteredMessages.filter((msg: Message) => {
          // 如果是語音消息但沒有正確的時長，則移除
          if (msg.text.includes('[語音留言') && (!msg.duration || msg.duration <= 0)) {
            console.log('移除無效的語音消息:', msg);
            return false;
          }
          return true;
        });
        
        // 按創建時間倒序排列，最新的在最上面
        const sortedMessages = cleanedMessages.sort((a: Message, b: Message) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setMessages(sortedMessages);
        console.log('已加載localStorage中的消息:', sortedMessages.length, '條');
        console.log('消息內容:', sortedMessages);
        
        // 更新localStorage，移除假數據和無效語音消息
        if (cleanedMessages.length !== parsedMessages.length) {
          localStorage.setItem('messages', JSON.stringify(cleanedMessages));
          console.log('已清理假數據和無效語音消息');
        }
        
        // 修復舊的支援留言數據
        const currentUserForRepair = auth.currentUser;
        if (currentUserForRepair) {
          // 異步修復支援留言數據
          const repairComments = async () => {
            try {
              let hasUpdated = false;
              const userProfile = await getUserProfile(currentUserForRepair.uid);
              
              const updatedMessages = cleanedMessages.map((msg: Message) => {
                if (msg.comments) {
                  const updatedComments = msg.comments.map((comment: any) => {
                    // 強制修復所有假數據的支援留言
                    if (comment.nickname === 'lkjh123' || comment.commenterEmail === 'as0@gmail.com' || !comment.commenterId || comment.commenterAge === 0 || comment.commenterAge === 35 || comment.commenterAge === 39) {
                      comment.commenterId = currentUserForRepair.uid;
                      comment.nickname = userProfile.name;
                      comment.commenterEmail = userProfile.email;
                      comment.commenterAvatar = userProfile.avatar;
                      comment.commenterCountry = userProfile.country;
                      comment.commenterGender = userProfile.gender;
                      comment.commenterAge = userProfile.age;
                      comment.createdAt = comment.createdAt || new Date().toISOString(); // 確保有時間戳
                      hasUpdated = true;
                      console.log('強制修復支援留言:', comment);
                    }
                    return comment;
                  });
                  return { ...msg, comments: updatedComments };
                }
                return msg;
              });
              
              if (hasUpdated) {
                setMessages(updatedMessages);
                localStorage.setItem('messages', JSON.stringify(updatedMessages));
                console.log('已修復舊的支援留言數據');
              }
            } catch (error) {
              console.error('修復支援留言數據失敗:', error);
            }
          };
          
          repairComments();
        }
      } catch (error) {
        console.error('解析localStorage消息失敗:', error);
      }
    } else {
      console.log('localStorage中沒有保存的消息');
    }
  }, []);

  // 移除語音相關狀態

  // 檢查是否為擁有者
  const isOwner = (message: Message) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser && message.user.id === currentUser.uid;
  };

  // 檢查是否為留言者本人
  const isCommenter = (comment: any) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser && comment.commenterId === currentUser.uid;
  };

  // 過濾我的留言
  const getMyMessages = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return currentUser ? messages.filter(msg => msg.user.id === currentUser.uid) : [];
  };

  // 過濾我給別人的支援留言
  const getMyComments = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const myComments: Array<{message: Message, comment: any}> = [];
    
    if (!currentUser) {
      console.log('沒有登入用戶');
      return myComments;
    }
    
    console.log('當前用戶UID:', currentUser.uid);
    console.log('所有留言:', messages);
    
    messages.forEach(msg => {
      console.log('檢查留言:', msg.id, '支援留言數量:', msg.comments?.length || 0);
      msg.comments?.forEach(comment => {
        // 為舊的支援留言添加默認的commenterId（如果沒有的話）
        if (!comment.commenterId) {
          // 檢查用戶名或郵箱是否匹配
          const currentUserName = currentUser.displayName || currentUser.email?.split('@')[0] || '用戶';
          const currentUserEmail = currentUser.email;
          
          if (comment.nickname === currentUserName || comment.commenterEmail === currentUserEmail) {
            comment.commenterId = currentUser.uid;
            console.log('為舊支援留言添加commenterId:', comment);
          }
        }
        
        console.log('支援留言:', comment.nickname, 'commenterId:', comment.commenterId, '當前用戶UID:', currentUser.uid);
        if (comment.commenterId === currentUser.uid) {
          console.log('找到我的支援留言:', comment);
          myComments.push({message: msg, comment: comment});
        }
      });
    });
    
    console.log('我的支援留言總數:', myComments.length);
    return myComments;
  };

  // 語音錄製相關函數
  const handleRecordingClick = async () => {
    if (isListening) {
      // 停止錄音
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
        setRecordingTimer(null);
      }
      setIsListening(false);
      setIsRecording(false);
      setRecordingDuration(0);
      return;
    }

    // 檢查測試模式
    const isTestMode = localStorage.getItem('testMode') === 'true';
    
    // 如果是測試模式，直接顯示確認對話框
    if (isTestMode) {
      setShowRecordingConfirm(true);
      return;
    }
    
    // 如果不是測試模式，檢查語音權限
    const permission = await checkPermission('aiChat');
    if (!permission.allowed) {
      setPermissionResult(permission);
      setShowRenewalModal(true);
      return;
    }

    // 顯示確認對話框
    setShowRecordingConfirm(true);
  };

  const handleConfirmRecording = async () => {
    setShowRecordingConfirm(false);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      
      // 清空之前的音頻塊
      setAudioChunks([]);
      audioChunksRef.current = [];
      setRecordingDuration(0);
      actualRecordingDurationRef.current = 0;
      setRemainingTime(0);
      
      recorder.ondataavailable = (event) => {
        console.log('收到音頻數據，大小:', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          setAudioChunks(prev => {
            const newChunks = [...prev, event.data];
            console.log('更新音頻塊，當前數量:', newChunks.length);
            return newChunks;
          });
        }
      };
      
      recorder.onstop = () => {
        // 先停止計時器，確保時長準確
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }
        
        // 使用ref中收集的音頻塊
        const currentChunks = [...audioChunksRef.current];
        console.log('錄音停止，音頻塊數量:', currentChunks.length);
        
        // 創建音頻blob
        const audioBlob = currentChunks.length > 0 
          ? new Blob(currentChunks, { type: 'audio/webm' })
          : new Blob([''], { type: 'audio/webm' });
        
        // 使用 ref 中的實際錄音時長，確保不為0
        const actualDuration = Math.max(1, actualRecordingDurationRef.current);
        console.log('創建音頻blob，大小:', audioBlob.size, '實際錄音時長:', actualDuration);
        
        // 創建音頻URL
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        setRecordedDuration(actualDuration);
        
        // 顯示提交對話框
        setShowSubmitDialog(true);
        
        // 停止所有音軌
        stream.getTracks().forEach(track => track.stop());
        
        // 停止錄音狀態
        setIsListening(false);
        setIsRecording(false);
      };
      
      // 開始錄音
      recorder.start(100); // 每100ms收集一次數據
      mediaRecorderRef.current = recorder;
      setIsListening(true);
      setIsRecording(true);
      
      // 開始計時
      const timer = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          // 同步更新 ref 中的實際時長
          actualRecordingDurationRef.current = newDuration;
          // 檢查是否達到1分鐘限制
          if (newDuration >= 60) {
            // 自動停止錄音
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            if (timer) {
              clearInterval(timer);
              setRecordingTimer(null);
            }
            setIsListening(false);
            setIsRecording(false);
            alert('⏰ 親愛的朋友，錄音時間已達1分鐘限制，已自動停止錄音囉～\n\n💭 我們希望給您足夠的時間表達，但也要照顧其他朋友的使用體驗。');
          }
          return newDuration;
        });
      }, 1000);
      setRecordingTimer(timer);
      
      console.log('開始錄音...');
    } catch (error) {
      console.error('錄音失敗:', error);
              alert('🎤 親愛的朋友，無法訪問麥克風呢～\n\n🔧 請檢查瀏覽器權限設置，允許我們使用麥克風功能。\n\n💡 通常在網址列旁邊有個麥克風圖示，點擊允許即可。');
    }
  };

  const handleCancelRecording = () => {
    setShowRecordingConfirm(false);
  };

  const handleSubmitVoice = async () => {
    if (recordedAudioUrl) {
      // 確保錄音時長不為0
      const actualDuration = Math.max(1, recordedDuration);
      
      // 將語音轉換為文字（這裡簡化處理，實際應該使用語音識別API）
      const voiceText = `[語音留言 - ${Math.floor(actualDuration / 60)}:${(actualDuration % 60).toString().padStart(2, '0')}]`;
      
      console.log('發送語音留言:', { voiceText, actualDuration });
      setLoading(true);
      
      // 獲取真實的用戶信息
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        alert('請先登入');
        setLoading(false);
        return;
      }
      
      // 從 Firestore 獲取完整的用戶個人信息
      const userProfile = await getUserProfile(currentUser.uid);
      
      const userMsg: Message = {
        id: Date.now().toString(),
        text: voiceText,
        aiReply: '', // 移除AI回覆
        toneId: '', // 移除語調ID
        createdAt: new Date().toISOString(),
        audioUrl: recordedAudioUrl,
        duration: actualDuration, // 確保錄音時長正確保存
        user: {
          id: currentUser.uid,
          name: userProfile.name,
          avatar: userProfile.avatar,
          country: userProfile.country,
          region: userProfile.country, // 使用 country 作為 region
          email: userProfile.email,
        },
        comments: [],
      };
      
      console.log('語音留言詳情:', {
        duration: recordedDuration,
        audioUrl: recordedAudioUrl,
        voiceText: voiceText
      });
      
      console.log('創建的語音留言對象:', userMsg);
      
      const newMessages = [userMsg, ...messages];
      setMessages(newMessages);
      
      // 保存到localStorage
      localStorage.setItem('messages', JSON.stringify(newMessages));
      console.log('語音留言已保存到localStorage');
      
      // 記錄使用量
      await recordUsage('aiChat', 1);
      
      // 清空錄音相關狀態
      setRecordedAudioUrl('');
      setRecordedDuration(0);
      setShowSubmitDialog(false);
      setLoading(false);
      
      // 顯示我的留言列表
      setShowMyMessages(true);
    }
  };

  const handleCancelSubmit = () => {
    setShowSubmitDialog(false);
    setRecordedAudioUrl('');
    setRecordedDuration(0);
  };

  const handleAudio = (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    setRecordedAudioUrl(audioUrl);
    setRecordedDuration(duration);
    setShowSubmitDialog(true);
  };

  // 播放語音功能
  const playVoiceMessage = (message: Message) => {
    // 如果是同一個音頻且正在播放，則暫停
    if (playingMessageId === message.id && playingAudio) {
      playingAudio.pause();
      setPlayingMessageId(null);
      setPlayingAudio(null);
      if (countdownTimer) {
        clearInterval(countdownTimer);
        setCountdownTimer(null);
      }
      setRemainingTime(0);
      return;
    }
    
    // 如果是同一個音頻且已暫停，則繼續播放
    if (playingMessageId === message.id && !playingAudio) {
      const audio = new Audio(message.audioUrl);
      const currentTime = message.duration ? message.duration - remainingTime : 0;
      audio.currentTime = currentTime;
      
      setPlayingMessageId(message.id);
      setPlayingAudio(audio);
      
      // 繼續倒數計時
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPlayingMessageId(null);
            setPlayingAudio(null);
            setCountdownTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdownTimer(timer);
      
      audio.play().then(() => {
        console.log('繼續播放原音...');
      }).catch((error) => {
        console.error('播放失敗:', error);
        playTextToSpeech(message.text);
      });
      return;
    }
    
    // 如果正在播放其他音頻，先停止
    if (playingAudio) {
      playingAudio.pause();
      if (countdownTimer) {
        clearInterval(countdownTimer);
        setCountdownTimer(null);
      }
      setRemainingTime(0);
    }

    if (message.audioUrl) {
      console.log('播放音頻:', {
        audioUrl: message.audioUrl,
        duration: message.duration,
        messageId: message.id
      });
      
      // 播放真正的原音
      const audio = new Audio(message.audioUrl);
      
      // 設置播放狀態
      setPlayingMessageId(message.id);
      setPlayingAudio(audio);
      setRemainingTime(message.duration || 0);
      
      // 添加錯誤處理
      audio.onerror = (error) => {
        console.error('音頻加載失敗:', error);
        // 如果原音播放失敗，使用文字轉語音作為備用
        playTextToSpeech(message.text);
      };
      
      // 播放結束時清理狀態
      audio.onended = () => {
        setPlayingMessageId(null);
        setPlayingAudio(null);
        setRemainingTime(0);
        if (countdownTimer) {
          clearInterval(countdownTimer);
          setCountdownTimer(null);
        }
      };
      
      // 開始倒數計時
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPlayingMessageId(null);
            setPlayingAudio(null);
            setCountdownTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setCountdownTimer(timer);
      
      audio.play().then(() => {
        console.log('正在播放原音...');
      }).catch((error) => {
        console.error('播放失敗:', error);
        // 如果播放失敗，使用文字轉語音作為備用
        playTextToSpeech(message.text);
      });
    } else {
      // 如果沒有原音，使用文字轉語音作為備用
      playTextToSpeech(message.text);
    }
  };

  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      
      console.log('正在播放留言內容（文字轉語音）...');
    } else {
      alert('瀏覽器不支援語音播放功能');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      console.log('沒有輸入內容，無法發送');
      return;
    }
    
    console.log('發送消息:', { input });
    setLoading(true);
    
    // 獲取真實的用戶信息
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      alert('請先登入');
      setLoading(false);
      return;
    }
    
    // 從 Firestore 獲取完整的用戶個人信息
    const userProfile = await getUserProfile(currentUser.uid);
    
    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      aiReply: '', // 移除AI回覆
      toneId: '', // 移除語調ID
      createdAt: new Date().toISOString(),
      user: {
        id: currentUser.uid,
        name: userProfile.name,
        avatar: userProfile.avatar,
        country: userProfile.country,
        region: userProfile.country, // 使用 country 作為 region
        email: userProfile.email,
      },
      comments: [],
    };
    
    console.log('創建的消息對象:', userMsg);
    
    const newMessages = [userMsg, ...messages];
    setMessages(newMessages);
    
    // 保存到localStorage
    localStorage.setItem('messages', JSON.stringify(newMessages));
    console.log('消息已保存到localStorage');
    
    setInput('');
    setLoading(false); // 立即完成，不需要等待AI
  };

  const handleAddComment = async (msg: Message) => {
    if (!commentInput.trim()) return;
    
    // 獲取真實的用戶信息
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      alert('請先登入');
      return;
    }
    
    // 從 Firestore 獲取完整的用戶個人信息
    const userProfile = await getUserProfile(currentUser.uid);
    
    setMessages(msgs => {
      const newMsgs = msgs.map(m => m.id === msg.id ? { 
        ...m, 
        comments: [...(m.comments||[]), { 
          nickname: userProfile.name, 
          content: commentInput, 
          toUserId: msg.user.id,
          commenterId: currentUser.uid,
          commenterEmail: userProfile.email,
          commenterCountry: userProfile.country,
          commenterGender: userProfile.gender,
          commenterAge: userProfile.age,
          createdAt: new Date().toISOString(), // 添加支援留言的時間戳
          commenterAvatar: userProfile.avatar
        }] 
      } : m);
      localStorage.setItem('messages', JSON.stringify(newMsgs));
      return newMsgs;
    });
    setCommentInput('');
    setShowUser(null);
  };

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  // 刪除留言功能
  const handleDeleteMessage = (messageId: string) => {
    if (window.confirm('🤗 親愛的朋友，您真的要刪除這條留言嗎？\n\n💭 我們理解您可能想要重新整理思緒，但刪除後就無法找回囉～\n\n✨ 如果您確定要刪除，我們會溫柔地幫您處理。')) {
      const updatedMessages = messages.filter(msg => msg.id !== messageId);
      setMessages(updatedMessages);
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      console.log('已刪除留言:', messageId);
    }
  };

  return (
    <div className="modern-bg" style={{ 
      background: window.innerWidth <= 768 ? '#8a8a8a' : '#8a8a8a', 
      backgroundImage: 'url(/soil.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      {/* 手機版使用共用頁頭，桌面版使用首頁頁頭 */}
      {window.innerWidth <= 768 ? (
        <SharedHeader />
      ) : (
        <>
          {/* 桌面版頂部導航 - 複製首頁格式 */}
          <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginRight: 24 }}>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/about')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 80 }}
              >
                {lang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===lang?'🧬 Restarter™｜我们是谁':'en'===lang?'🧬 Restarter™｜Who We Are':'ja'===lang?'🧬 Restarter™｜私たちについて':'ko'===lang?'🧬 Restarter™｜우리는 누구인가':'th'===lang?'🧬 Restarter™｜เราเป็นใคร':'vi'===lang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===lang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
              </button>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/feedback')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
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
            
            {/* 語言選擇按鈕 */}
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
                    { key: 'privacy', title: { 'zh-TW': '隱私權政策', 'zh-CN': '隐私权政策', 'en': 'Privacy Policy', 'ja': 'プライバシーポリシー', 'ko': '개인정보 처리방침', 'th': 'นโยบายความเป็นส่วนตัว', 'vi': 'Chính sách bảo mật', 'ms': 'Dasar Privasi', 'la': 'Politica Privata' }, path: '/privacy-policy' },
                    { key: 'terms', title: { 'zh-TW': '條款/聲明', 'zh-CN': '条款/声明', 'en': 'Terms & Conditions', 'ja': '利用規約', 'ko': '이용약관', 'th': 'ข้อกำหนดและเงื่อนไข', 'vi': 'Điều khoản & Điều kiện', 'ms': 'Terma & Syarat', 'la': 'Termini & Conditiones' }, path: '/terms' },
                    { key: 'data', title: { 'zh-TW': '資料刪除說明', 'zh-CN': '资料删除说明', 'en': 'Data Deletion', 'ja': 'データ削除', 'ko': '데이터 삭제', 'th': 'การลบข้อมูล', 'vi': 'Xóa dữ liệu', 'ms': 'Pemadaman Data', 'la': 'Deletio Datorum' }, path: '/data-deletion' },
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
                      {item.title[lang] || item.title['zh-TW']}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* LOGO - 複製首頁格式 */}
          <div style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
          </div>
        </>
      )}
              <div className="modern-container" style={{ 
          maxWidth: window.innerWidth <= 768 ? '100%' : 600, 
          width: '100%', 
          margin: '0 auto', 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          padding: window.innerWidth <= 768 ? '140px 16px 20px 16px' : '0',
          marginTop: window.innerWidth <= 768 ? '0' : '120px',
          boxSizing: 'border-box',
          minHeight: window.innerWidth <= 768 ? '100vh' : 'auto',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          background: window.innerWidth <= 768 ? 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)' : 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          willChange: 'auto'
        }}>
        {/* 主標題 */}
                  <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: window.innerWidth <= 768 ? 12 : 12,
            flexDirection: window.innerWidth <= 768 ? 'column' : 'column',
            gap: window.innerWidth <= 768 ? 8 : 8,
            width: '100%',
            minHeight: window.innerWidth <= 768 ? 'auto' : 'auto',
            background: window.innerWidth <= 768 ? 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)' : 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)'
          }}>
                      <h2 className="modern-title" style={{ 
              fontSize: window.innerWidth <= 768 ? '1.4rem' : '1.4rem', 
              margin: 0, 
              flex: 1, 
              textAlign: 'center', 
              color:'#6B5BFF', 
              textShadow:'0 2px 12px #6B5BFF88, 0 4px 24px #0008', 
              letterSpacing: 1, 
              display:'flex',
              alignItems:'center',
              gap: window.innerWidth <= 768 ? 2 : 2,
              whiteSpace: 'nowrap',
              flexWrap: 'wrap',
              justifyContent: 'center',
              background: window.innerWidth <= 768 ? 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)' : 'linear-gradient(135deg, #FFB366 0%, #FFE5CC 100%)'
            }}>{t.title}</h2>
                    {/* 手機版按鈕 - 只在手機版顯示在主標題區域 */}
                    {window.innerWidth <= 768 && (
                      <button
                        onClick={() => {
                          console.log('【我的留言】按鈕被點擊，當前狀態:', showMyMessages);
                          setShowMyMessages(!showMyMessages);
                          console.log('設置新狀態:', !showMyMessages);
                        }}
                        style={{
                          background: showMyMessages ? 'linear-gradient(135deg, #23c6e6 60%, #6B5BFF 100%)' : 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: 12, 
                          fontWeight: 900, 
                          fontSize: 10, 
                          padding: '8px 12px', 
                          boxShadow: '0 2px 12px #6B5BFF33', 
                          letterSpacing: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '2px',
                          whiteSpace: 'nowrap',
                          width: '120px',
                          minHeight: '32px',
                          cursor: 'pointer',
                          zIndex: 9999,
                          position: 'relative',
                          pointerEvents: 'auto',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                          touchAction: 'manipulation'
                        }}
                      >
                        {showMyMessages ? 
                          (lang === 'zh-TW' ? '🌍 所有留言' : 
                           lang === 'zh-CN' ? '🌍 所有留言' : 
                           lang === 'en' ? '🌍 All Messages' : 
                           lang === 'ja' ? '🌍 すべてのメッセージ' : 
                           lang === 'ko' ? '🌍 모든 메시지' : 
                           lang === 'vi' ? '🌍 Tất cả tin nhắn' : 
                           lang === 'th' ? '🌍 ข้อความทั้งหมด' : 
                           lang === 'la' ? '🌍 Visi ziņojumi' : 
                           lang === 'ms' ? '🌍 Semua mesej' : '🌍 所有留言') : 
                          (lang === 'zh-TW' ? '💌 我的留言' : 
                           lang === 'zh-CN' ? '💌 我的留言' : 
                           lang === 'en' ? '💌 My Messages' : 
                           lang === 'ja' ? '💌 私のメッセージ' : 
                           lang === 'ko' ? '💌 내 메시지' : 
                           lang === 'vi' ? '💌 Tin nhắn của tôi' : 
                           lang === 'th' ? '💌 ข้อความของฉัน' : 
                           lang === 'la' ? '💌 Mani ziņojumi' : 
                           lang === 'ms' ? '💌 Mesej saya' : '💌 我的留言')}
                      </button>
                    )}
        </div>

        {/* 副標題卡片 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(107, 91, 255, 0.1) 0%, rgba(35, 198, 230, 0.1) 100%)',
          borderRadius: '20px',
          padding: window.innerWidth <= 768 ? '16px' : '24px',
          marginBottom: '18px',
          border: '2px solid rgba(107, 91, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(107, 91, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          marginTop: window.innerWidth <= 768 ? '40px' : window.innerWidth <= 768 ? '20px' : '10px'
        }}>
          <h3 style={{
            color: '#fff',
            fontSize: window.innerWidth <= 768 ? '1.2rem' : '1.2rem',
            fontWeight: '700',
            margin: '0 0 12px 0',
            textShadow: '0 2px 8px rgba(107, 91, 255, 0.3)'
          }}>
            {t.subtitle}
          </h3>
          <p style={{
            color: '#000',
            fontSize: window.innerWidth <= 768 ? '0.8rem' : '0.9rem',
            lineHeight: '1.6',
            margin: '0',
            opacity: '0.9'
          }}>
            在這裡，分享你真實的情感與心情，或為他人提供溫暖的支援留言，彼此傾聽支持，每個人都能找到情感上的歸屬感和後盾，讓我們一起建立溫暖的社群，共同打造一個有溫度大家庭。
          </p>
        </div>
        <div className="tone-list" style={{ marginBottom: 18 }}>
          {/* 移除語調選擇 */}
        </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12, 
                  marginBottom: 18,
                  padding: window.innerWidth <= 768 ? '0 8px' : '0 8px',
                  width: '100%',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}>
          <input
            className="quote-card"
            style={{ 
              width: window.innerWidth <= 768 ? '100%' : 'calc(100% - 32px)',
              fontSize: window.innerWidth <= 768 ? 16 : 18, 
              padding: window.innerWidth <= 768 ? '10px 14px' : '12px 16px', 
              border: '2px solid rgba(107, 91, 255, 0.5)', 
              outline: 'none', 
              background: '#232946', 
              color: '#fff',
              borderRadius: '12px',
              marginBottom: '8px',
              boxSizing: 'border-box',
              margin: window.innerWidth <= 768 ? undefined : '0 auto 8px auto'
            }}
            maxLength={200} // 限制200字
            placeholder={t.placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <div style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'space-between',
            width: window.innerWidth <= 768 ? '100%' : 'calc(100% - 32px)',
            padding: window.innerWidth <= 768 ? '0 8px' : '0 8px 0 16px',
            margin: window.innerWidth <= 768 ? undefined : '0 auto'
          }}>
            <button
              className="tone-card selected"
              style={{ 
                fontSize: window.innerWidth <= 768 ? 14 : 16, 
                padding: window.innerWidth <= 768 ? '8px 12px' : '10px 16px',
                minWidth: window.innerWidth <= 768 ? '60px' : '70px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6B5BFF 0%, #23c6e6 100%)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => {
                console.log('發送按鈕被點擊');
                console.log('當前狀態:', { input, loading });
                handleSend();
              }}
              disabled={loading}
            >
              {loading ? t.sending : t.send}
            </button>
          {/* 語音錄製按鈕 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={handleRecordingClick}
              style={{
                background: isRecording 
                  ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                  : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: window.innerWidth <= 768 ? '10px 16px' : '10px 10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: isRecording 
                  ? '0 4px 16px rgba(244, 67, 54, 0.3)'
                  : '0 4px 16px rgba(33, 150, 243, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animation: isRecording ? 'pulse 1.5s infinite' : 'none',
                minWidth: window.innerWidth <= 768 ? '70px' : '56px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                marginRight: window.innerWidth <= 768 ? undefined : 8
              }}
              onMouseOver={(e) => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!isRecording) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.3)';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>🎤</span>
              {isRecording ? `${t.recording} ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}` : t.voice}
            </button>
            {isRecording && (
              <div style={{ 
                fontSize: '12px', 
                color: '#f44336', 
                marginTop: '4px',
                fontWeight: '500'
              }}>
                {t.pressToStop}
              </div>
            )}
            
            {/* 我的留言按鈕 - 只在桌面版顯示在語音按鈕下方 */}
            {window.innerWidth > 768 && (
              <button
                onClick={() => {
                  console.log('【我的留言】按鈕被點擊，當前狀態:', showMyMessages);
                  setShowMyMessages(!showMyMessages);
                  console.log('設置新狀態:', !showMyMessages);
                }}
                style={{
                  background: showMyMessages ? 'linear-gradient(135deg, #23c6e6 60%, #6B5BFF 100%)' : 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 12, 
                  fontWeight: 900, 
                  fontSize: 10, 
                  padding: '6px 10px', 
                  boxShadow: '0 2px 12px #6B5BFF33', 
                  letterSpacing: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  whiteSpace: 'nowrap',
                  width: '100px',
                  minHeight: '28px',
                  cursor: 'pointer',
                  zIndex: 9999,
                  position: 'relative',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  touchAction: 'manipulation',
                  marginTop: '8px'
                }}
              >
                {showMyMessages ? 
                  (lang === 'zh-TW' ? '🌍 所有留言' : 
                   lang === 'zh-CN' ? '🌍 所有留言' : 
                   lang === 'en' ? '🌍 All' : 
                   lang === 'ja' ? '🌍 すべて' : 
                   lang === 'ko' ? '🌍 모든' : 
                   lang === 'vi' ? '🌍 Tất cả' : 
                   lang === 'th' ? '🌍 ทั้งหมด' : 
                   lang === 'la' ? '🌍 Visi' : 
                   lang === 'ms' ? '🌍 Semua' : '🌍 所有留言') : 
                  (lang === 'zh-TW' ? '💌 我的留言' : 
                   lang === 'zh-CN' ? '💌 我的留言' : 
                   lang === 'en' ? '💌 My' : 
                   lang === 'ja' ? '💌 私の' : 
                   lang === 'ko' ? '💌 내' : 
                   lang === 'vi' ? '💌 Tin nhắn' : 
                   lang === 'th' ? '💌 ข้อความ' : 
                   lang === 'la' ? '💌 Mani' : 
                   lang === 'ms' ? '💌 Mesej' : '💌 我的留言')}
              </button>
            )}
          </div>
        </div>
        
        {/* 移除錄音狀態顯示 */}
        <div className="quote-list">
          {showMyMessages ? (
            // 顯示我的留言
            <div>
              <h3 style={{ color: '#6B5BFF', fontSize: '1.5rem', marginBottom: '20px', textAlign: 'center', fontWeight: '700' }}>
                💌 {lang === 'zh-TW' ? '我的留言' : 
                    lang === 'zh-CN' ? '我的留言' : 
                    lang === 'en' ? 'My Messages' : 
                    lang === 'ja' ? '私のメッセージ' : 
                    lang === 'ko' ? '내 메시지' : 
                    lang === 'vi' ? 'Tin nhắn của tôi' : 
                    lang === 'th' ? 'ข้อความของฉัน' : 
                    lang === 'la' ? 'Mani ziņojumi' : 
                    lang === 'ms' ? 'Mesej saya' : '我的留言'}
              </h3>
              {/* 我的留言 */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#6B5BFF', fontSize: '1.2rem', marginBottom: '12px', textAlign: 'center' }}>📝 我發表的留言</h3>
                {getMyMessages().length === 0 ? (
                  <div style={{ color: '#000', textAlign: 'center', padding: '20px' }}>您還沒有發表過留言</div>
                ) : (
                  getMyMessages().map(msg => (
                    <div key={msg.id} className="quote-card" style={{ position: 'relative', paddingLeft: 64, marginBottom: '12px' }}>
                      <img src={msg.user.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', position: 'absolute', left: 8, top: 16, cursor: 'pointer', border: '2px solid #6B5BFF' }} onClick={() => setShowUser(msg)} />
                      
                      {/* 刪除按鈕移到右上角 */}
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        style={{ 
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'linear-gradient(135deg, #ff6b6b 60%, #ff8e8e 100%)', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '12px', 
                          padding: '4px 8px', 
                          fontSize: '12px', 
                          fontWeight: '600',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(255, 107, 107, 0.3)',
                          zIndex: 10
                        }}
                      >
                        刪除
                      </button>
                      
                      <div className="quote-text">{msg.text}</div>
                      
                      {/* 語音播放功能 */}
                      {msg.audioUrl && (
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => playVoiceMessage(msg)}
                            style={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{playingMessageId === msg.id ? '⏹️' : '▶️'}</span>
                            {playingMessageId === msg.id ? '停止播放' : '播放原音'}
                          </button>
                          <span style={{ fontSize: '12px', color: '#ccc' }}>
                            錄音時長: {msg.duration && msg.duration > 0 ? `${Math.floor(msg.duration / 60)}:${(msg.duration % 60).toString().padStart(2, '0')}` : '未知'}
                          </span>
                        </div>
                      )}
                      
                      <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>{new Date(msg.createdAt).toLocaleString()}</div>
                      
                      <div style={{ marginTop: 14, background: '#f7f7ff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 1px 6px #6B5BFF11' }}>
                        <b style={{ color: '#6B5BFF', fontSize: 16 }}>{t.commentsTitle}</b>
                        {(msg.comments||[]).length === 0 && <span style={{ color: '#bbb', marginLeft: 8 }}>{t.noComments}</span>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                          {(msg.comments||[]).sort((a, b) => {
                            // 按時間倒序排列，最新的支援留言在最上面
                            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(msg.createdAt).getTime();
                            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(msg.createdAt).getTime();
                            return timeB - timeA;
                          }).map((c, i) => (
                            <div key={i} style={{ 
                              background: '#fff', 
                              borderRadius: 8, 
                              padding: '8px 12px', 
                              color: '#232946', 
                              fontSize: 15, 
                              border: '1px solid #eee', 
                              boxShadow: '0 1px 4px #6B5BFF08',
                              position: 'relative',
                              paddingLeft: '60px' // 為頭像留出空間
                            }}>
                              {/* 支援留言者頭像 */}
                              <img 
                                src={c.commenterAvatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?'} 
                                alt="commenter avatar" 
                                style={{ 
                                  width: 40, 
                                  height: 40, 
                                  borderRadius: '50%', 
                                  objectFit: 'cover', 
                                  position: 'absolute', 
                                  left: 8, 
                                  top: 8, 
                                  border: '2px solid #6B5BFF' 
                                }} 
                              />
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <b style={{ color: '#6B5BFF' }}>{c.nickname}</b>
                                {/* 只有擁有者或留言者本人可以看到完整聯繫資訊 */}
                                {(isOwner(msg) || isCommenter(c)) && (
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    <div>📧 {c.commenterEmail}</div>
                                    <div>🌍 {c.commenterCountry}</div>
                                    <div>👤 {c.commenterGender}・{c.commenterAge}歲</div>
                                  </div>
                                )}
                                {/* 其他用戶只看到頭像和國家 */}
                                {!isOwner(msg) && !isCommenter(c) && (
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    <div>🌍 {c.commenterCountry}</div>
                                  </div>
                                )}
                              </div>
                              <div>{c.content}</div>
                              <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                                {c.createdAt ? new Date(c.createdAt).toLocaleString() : new Date(msg.createdAt).toLocaleString()}
                              </div>
                              
                              {/* 只有擁有者可以看到聯繫按鈕 */}
                              {isOwner(msg) && !isCommenter(c) && (
                                <button 
                                  onClick={() => alert(`聯繫 ${c.nickname}：\n郵箱：${c.commenterEmail}\n國家：${c.commenterCountry}\n性別：${c.commenterGender}\n年齡：${c.commenterAge}`)}
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                  }}
                                >
                                  📞 聯繫
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // 顯示全部留言（不包括自己發的）
            <>
              <h3 style={{ color: '#6B5BFF', fontSize: '1.2rem', marginBottom: '20px', textAlign: 'center', fontWeight: '700' }}>
                🌍 {lang === 'zh-TW' ? '全部留言' : 
                    lang === 'zh-CN' ? '全部留言' : 
                    lang === 'en' ? 'All Messages' : 
                    lang === 'ja' ? 'すべてのメッセージ' : 
                    lang === 'ko' ? '모든 메시지' : 
                    lang === 'vi' ? 'Tất cả tin nhắn' : 
                    lang === 'th' ? 'ข้อความทั้งหมด' : 
                    lang === 'la' ? 'Visi ziņojumi' : 
                    lang === 'ms' ? 'Semua mesej' : '全部留言'}
              </h3>
              {messages.filter(msg => !isOwner(msg)).length === 0 && <div style={{ color: '#000', textAlign: 'center', marginTop: 32 }}>{t.noMessages}</div>}
              
              {/* 我給別人的支援留言 - 移到頁面中間 */}
              <div style={{ marginTop: '40px', marginBottom: '40px' }}>
                <h3 style={{ color: '#6B5BFF', fontSize: '1rem', marginBottom: '12px', textAlign: 'center' }}>💝 我給別人的支援留言</h3>
                {(() => {
                  const myComments = getMyComments();
                  console.log('我的支援留言數量:', myComments.length);
                  console.log('我的支援留言:', myComments);
                  return myComments.length === 0 ? (
                    <div style={{ color: '#000', textAlign: 'center', padding: '20px' }}>您還沒有給別人留過支援留言</div>
                  ) : (
                    myComments.map(({message, comment}, index) => (
                      <div key={index} className="quote-card" style={{ position: 'relative', paddingLeft: 64, marginBottom: '12px' }}>
                        <img src={message.user.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', position: 'absolute', left: 8, top: 16, border: '2px solid #6B5BFF' }} />
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                          給 <b style={{ color: '#6B5BFF' }}>{message.user.name}</b> 的支援留言：
                        </div>
                        <div className="quote-text" style={{ background: '#f0f8ff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e6f3ff' }}>
                          {comment.content}
                        </div>
                        <div style={{ fontSize: 12, color: '#614425', marginTop: 6 }}>{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : new Date(message.createdAt).toLocaleString()}</div>
                      </div>
                    ))
                  );
                })()}
              </div>
              
          {messages.filter(msg => !isOwner(msg)).map(msg => (
            <div key={msg.id} className="quote-card" style={{ position: 'relative', paddingLeft: 64 }}>
              <img src={msg.user.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', position: 'absolute', left: 8, top: 16, cursor: 'pointer', border: '2px solid #6B5BFF' }} onClick={() => setShowUser(msg)} />
              <div className="quote-text">{msg.text}</div>
                  {/* 移除語調顯示 */}
                  {/* 移除AI回覆顯示 */}
                  
                  {/* 語音播放功能 */}
                  {msg.audioUrl && (
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => playVoiceMessage(msg)}
                        style={{
                          background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{playingMessageId === msg.id ? '⏹️' : '▶️'}</span>
                        {playingMessageId === msg.id ? '停止播放' : '播放原音'}
                      </button>
                      <span style={{ fontSize: '12px', color: '#ccc' }}>
                        錄音時長: {msg.duration && msg.duration > 0 ? `${Math.floor(msg.duration / 60)}:${(msg.duration % 60).toString().padStart(2, '0')}` : '未知'}
                      </span>
                    </div>
                  )}
                  
              <div style={{ fontSize: 12, color: '#fff', marginTop: 6 }}>{new Date(msg.createdAt).toLocaleString()}</div>
                  
                  {/* 支援按鈕 */}
                  <div style={{ marginTop: 12, display: 'flex', justifyContent: 'center' }}>
                    <button 
                      onClick={() => setShowUser(msg)}
                      style={{ 
                        background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '20px', 
                        padding: '8px 20px', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(107, 91, 255, 0.3)'
                      }}
                    >
                      {t.supportMessage}
                    </button>
                  </div>
                  
              <div style={{ marginTop: 14, background: '#f7f7ff', borderRadius: 10, padding: '10px 14px', boxShadow: '0 1px 6px #6B5BFF11' }}>
                <b style={{ color: '#6B5BFF', fontSize: 16 }}>{t.commentsTitle}</b>
                {(msg.comments||[]).length === 0 && <span style={{ color: '#bbb', marginLeft: 8 }}>{t.noComments}</span>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                  {(msg.comments||[]).sort((a, b) => {
                    // 按時間倒序排列，最新的支援留言在最上面
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(msg.createdAt).getTime();
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(msg.createdAt).getTime();
                    return timeB - timeA;
                  }).map((c, i) => (
                        <div key={i} style={{ 
                          background: '#fff', 
                          borderRadius: 8, 
                          padding: '8px 12px', 
                          color: '#232946', 
                          fontSize: 15, 
                          border: '1px solid #eee', 
                          boxShadow: '0 1px 4px #6B5BFF08',
                          position: 'relative',
                          paddingLeft: '60px' // 為頭像留出空間
                        }}>
                          {/* 支援留言者頭像 */}
                          <img 
                            src={c.commenterAvatar || 'https://via.placeholder.com/40x40/6B7280/FFFFFF?text=?'} 
                            alt="commenter avatar" 
                            style={{ 
                              width: 40, 
                              height: 40, 
                              borderRadius: '50%', 
                              objectFit: 'cover', 
                              position: 'absolute', 
                              left: 8, 
                              top: 8, 
                              border: '2px solid #6B5BFF' 
                            }} 
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <b style={{ color: '#6B5BFF' }}>{c.nickname}</b>
                            {/* 只有擁有者或留言者本人可以看到完整聯繫資訊 */}
                            {(isOwner(msg) || isCommenter(c)) && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <div>📧 {c.commenterEmail}</div>
                                <div>🌍 {c.commenterCountry}</div>
                                <div>👤 {c.commenterGender}・{c.commenterAge}歲</div>
                              </div>
                            )}
                            {/* 其他用戶只看到頭像和國家 */}
                            {!isOwner(msg) && !isCommenter(c) && (
                              <div style={{ fontSize: '12px', color: '#666' }}>
                                <div>🌍 {c.commenterCountry}</div>
                              </div>
                            )}
                          </div>
                          <div>{c.content}</div>
                          <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
                            {c.createdAt ? new Date(c.createdAt).toLocaleString() : new Date(msg.createdAt).toLocaleString()}
                          </div>
                          
                          {/* 只有擁有者可以看到聯繫按鈕 */}
                          {isOwner(msg) && !isCommenter(c) && (
                            <button 
                              onClick={() => alert(`聯繫 ${c.nickname}：\n郵箱：${c.commenterEmail}\n國家：${c.commenterCountry}\n性別：${c.commenterGender}\n年齡：${c.commenterAge}`)}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '4px 8px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                fontWeight: '600'
                              }}
                            >
                              📞 聯繫
                            </button>
                          )}
                        </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
              

            </>
          )}
        </div>

      </div>
    </div>
      
      {/* 錄音確認對話框 */}
      {showRecordingConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎤</div>
            <h3 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '20px' }}>{t.readyToRecord}</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666', lineHeight: '1.5' }}>
              {t.recordInstruction}<br/>
              <strong style={{ color: '#ff6b6b' }}>⚠️ {t.recordTimeLimit}</strong>
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelRecording}
                style={{
                  background: '#f44336',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  minWidth: '120px'
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleConfirmRecording}
                style={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  minWidth: '120px'
                }}
              >
                {t.startRecording}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 語音提交對話框 */}
      {showSubmitDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>語音錄製完成</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              錄音時長: {recordedDuration > 0 ? `${Math.floor(recordedDuration / 60)}:${(recordedDuration % 60).toString().padStart(2, '0')}` : '0:00'} (實際錄音: {Math.max(1, recordedDuration)}秒)
            </p>
            
            {/* 播放按鈕 */}
            <button
              onClick={() => {
                if (recordedAudioUrl) {
                  // 確保錄音時長不為0
                  const actualDuration = Math.max(1, recordedDuration);
                  
                  // 如果正在播放錄音，則暫停
                  if (playingAudio) {
                    playingAudio.pause();
                    setPlayingAudio(null);
                    if (countdownTimer) {
                      clearInterval(countdownTimer);
                      setCountdownTimer(null);
                    }
                    return;
                  }
                  
                  // 開始新播放
                  const audio = new Audio(recordedAudioUrl);
                  setPlayingAudio(audio);
                  setRemainingTime(actualDuration);
                  
                  // 播放結束時清理狀態
                  audio.onended = () => {
                    setPlayingAudio(null);
                    setRemainingTime(0);
                    if (countdownTimer) {
                      clearInterval(countdownTimer);
                      setCountdownTimer(null);
                    }
                  };
                  
                  // 開始倒數計時
                  const timer = setInterval(() => {
                    setRemainingTime(prev => {
                      if (prev <= 1) {
                        clearInterval(timer);
                        setPlayingAudio(null);
                        return 0;
                      }
                      return prev - 1;
                    });
                  }, 1000);
                  setCountdownTimer(timer);
                  
                  audio.play();
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                margin: '0 auto 16px auto'
              }}
            >
              <span>{playingAudio ? '⏹️' : '▶️'}</span>
              {playingAudio ? '停止播放' : '播放錄音'}
            </button>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleSubmitVoice}
                style={{
                  background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                確定
              </button>
              <button
                onClick={handleCancelSubmit}
                style={{
                  background: '#f44336',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
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
      

    </div>
  );
} 