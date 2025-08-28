import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from '../src/firebaseConfig';
import { initFirebaseData } from '../src/initFirebaseData';
import TinderCard from 'react-tinder-card';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import MyLinks from './MyLinks';
import InvitesPage from './InvitesPage';
import Footer from '../components/Footer';
import SharedHeader from '../components/SharedHeader';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';
type Role = 'peer' | 'mentor' | 'skillPartner';
type Goal = 'jobSeeking' | 'learnNewSkills' | 'emotionalSupport' | 'networking' | 'startupPrep';

const LANGS: { code: LanguageCode; label: string }[] = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'la', label: 'Latīna' },
];

const UI_TEXT = {
  backToHome: { 'zh-TW': '← 返回', 'zh-CN': '← 返回', 'ja': '← 戻る', 'en': '← Back', 'ko': '← 뒤로', 'th': '← กลับ', 'vi': '← Quay lại', 'ms': '← Kembali', 'la': '← Redire' },
  logout: { 'zh-TW': '登出', 'zh-CN': '登出', 'ja': 'ログアウト', 'en': 'Logout', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire' },
  pageTitle: { 'zh-TW': '【破繭重生】夥伴計畫', 'zh-CN': '【破茧重生】伙伴计划', 'ja': '【再出発】パートナー計画', 'en': 'Project Butterfly', 'ko': '【새출발】 파트너 계획', 'th': '【เกิดใหม่】แผนพันธมิตร', 'vi': '【Tái sinh】Kế hoạch đối tác', 'ms': '【Lahir Semula】Rancangan Rakan Kongsi', 'la': '【Renascitur】Propositum Socius' },
  editProfile: { 'zh-TW': '編輯我的檔案', 'zh-CN': '编辑我的档案', 'ja': 'プロフィール編集', 'en': 'Edit My Profile', 'ko': '내 프로필 편집', 'th': 'แก้ไขโปรไฟล์ของฉัน', 'vi': 'Chỉnh sửa hồ sơ của tôi', 'ms': 'Sunting Profil Saya', 'la': 'Meum Profilum Muta' },
  partnerRoleTitle: { 'zh-TW': '我想尋找的夥伴角色', 'zh-CN': '我想寻找的伙伴角色', 'ja': '探している仲間', 'en': "I'm looking for a", 'ko': '찾고 있는 파트너 역할', 'th': 'บทบาทพันธมิตรที่ฉันมองหา', 'vi': 'Vai trò đối tác tôi đang tìm', 'ms': 'Peranan Rakan Kongsi Yang Saya Cari', 'la': 'Partem Socii Quam Quæro' },
  peer: { 'zh-TW': '同行者', 'zh-CN': '同行者', 'ja': '同じ道の仲間', 'en': 'Peer', 'ko': '동행자', 'th': 'เพื่อนร่วมทาง', 'vi': 'Bạn đồng hành', 'ms': 'Rakan Sebaya', 'la': 'Par' },
  mentor: { 'zh-TW': '生命導師', 'zh-CN': '生命导师', 'ja': '人生の師', 'en': 'Mentor', 'ko': '인생 멘토', 'th': 'ที่ปรึกษาชีวิต', 'vi': 'Người hướng dẫn', 'ms': 'Mentor Kehidupan', 'la': 'Mentor' },
  skillPartner: { 'zh-TW': '技能夥伴', 'zh-CN': '技能伙伴', 'ja': 'スキル仲間', 'en': 'Skill Partner', 'ko': '기술 파트너', 'th': 'พันธมิตรด้านทักษะ', 'vi': 'Đối tác kỹ năng', 'ms': 'Rakan Kemahiran', 'la': 'Socius Peritiae' },
  mainGoalTitle: { 'zh-TW': '我的主要目標', 'zh-CN': '我的主要目标', 'ja': '私の主な目標', 'en': 'My Main Goal', 'ko': '나의 주요 목표', 'th': 'เป้าหมายหลักของฉัน', 'vi': 'Mục tiêu chính của tôi', 'ms': 'Matlamat Utama Saya', 'la': 'Meum Propositum Principale' },
  allGoals: { 'zh-TW': '所有目標', 'zh-CN': '所有目标', 'ja': 'すべての目標', 'en': 'All Goals', 'ko': '모든 목표', 'th': 'เป้าหมายทั้งหมด', 'vi': 'Tất cả mục tiêu', 'ms': 'Semua Matlamat', 'la': 'Omnia Proposita' },
  goalLabel: { 'zh-TW': '目標', 'zh-CN': '目标', 'ja': '目標', 'en': 'Goal', 'ko': '목표', 'th': 'เป้าหมาย', 'vi': 'Mục tiêu', 'ms': 'Matlamat', 'la': 'Propositum' },
  goalOptions: {
    jobSeeking: { 'zh-TW': '尋找工作', 'zh-CN': '寻找工作', 'en': 'Job Seeking', 'ja': '仕事探し', 'ko': '구직', 'th': 'หางาน', 'vi': 'Tìm việc', 'ms': 'Mencari Kerja', 'la': 'Quaerere Opus' },
    learnNewSkills: { 'zh-TW': '學習新技能', 'zh-CN': '学习新技能', 'en': 'Learn New Skills', 'ja': '新しいスキルを学ぶ', 'ko': '새로운 기술 배우기', 'th': 'เรียนรู้ทักษะใหม่', 'vi': 'Học kỹ năng mới', 'ms': 'Belajar Kemahiran Baru', 'la': 'Disce Novas Artes' },
    emotionalSupport: { 'zh-TW': '情緒支持', 'zh-CN': '情绪支持', 'en': 'Emotional Support', 'ja': '心のサポート', 'ko': '정서적 지원', 'th': 'การสนับสนุนทางอารมณ์', 'vi': 'Hỗ trợ tinh thần', 'ms': 'Sokongan Emosi', 'la': 'Auxilium Emotionale' },
    networking: { 'zh-TW': '建立人脈', 'zh-CN': '建立人脉', 'en': 'Networking', 'ja': '人脈作り', 'ko': '네트워킹', 'th': 'สร้างเครือข่าย', 'vi': 'Xây dựng mạng lưới', 'ms': 'Rangkaian', 'la': 'Nexus Creare' },
    startupPrep: { 'zh-TW': '創業準備', 'zh-CN': '创业准备', 'en': 'Startup Prep', 'ja': '起業準備', 'ko': '창업 준비', 'th': 'เตรียมตัวเริ่มต้นธุรกิจ', 'vi': 'Chuẩn bị khởi nghiệp', 'ms': 'Persediaan Permulaan', 'la': 'Praeparatio Negotii' },
  },
  pass: { 'zh-TW': '跳過', 'zh-CN': '跳过', 'ja': 'スキップ', 'en': 'Pass', 'ko': '건너뛰기', 'th': 'ข้าม', 'vi': 'Bỏ qua', 'ms': 'Langkau', 'la': 'Transilire' },
  like: { 'zh-TW': '建立連結', 'zh-CN': '建立连结', 'ja': '繋がる', 'en': 'Connect', 'ko': '연결하기', 'th': 'เชื่อมต่อ', 'vi': 'Kết nối', 'ms': 'Berhubung', 'la': 'Coniungere' },
  noMoreUsers: { 'zh-TW': '目前沒有更多夥伴了，請稍後再試。', 'zh-CN': '目前没有更多伙伴了，请稍后再试。', 'ja': '現在、他の仲間はいません。後でもう一度お試しください。', 'en': 'No more partners for now. Please try again later.', 'ko': '지금은 더 이상 파트너가 없습니다. 나중에 다시 시도해주세요.', 'th': 'ไม่มีพันธมิตรเพิ่มเติมในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง', 'vi': 'Hiện tại không có đối tác nào khác. Vui lòng thử lại sau.', 'ms': 'Tiada lagi rakan kongsi buat masa ini. Sila cuba lagi nanti.', 'la': 'Nulli socii nunc. Quaeso, postea iterum conare.' },
  profileModal: {
    nameLabel: { 'zh-TW': '暱稱 / Name', 'zh-CN': '昵称 / Name', 'en': 'Name', 'ja': 'ニックネーム', 'ko': '닉네임', 'th': 'ชื่อเล่น', 'vi': 'Biệt danh', 'ms': 'Nama Panggilan', 'la': 'Nomen' },
    bioLabel: { 'zh-TW': '簡介 / Bio', 'zh-CN': '简介 / Bio', 'en': 'Bio', 'ja': '自己紹介', 'ko': '소개', 'th': 'ประวัติ', 'vi': 'Tiểu sử', 'ms': 'Bio', 'la': 'Descriptio' },
    goalLabel: { 'zh-TW': '主要目標 / Main Goal', 'zh-CN': '主要目标 / Main Goal', 'en': 'Main Goal', 'ja': '主な目標', 'ko': '주요 목표', 'th': 'เป้าหมายหลัก', 'vi': 'Mục tiêu chính', 'ms': 'Matlamat Utama', 'la': 'Propositum Principale' },
    skillsLabel: { 'zh-TW': '技能 / Skills', 'zh-CN': '技能 / Skills', 'en': 'Skills', 'ja': 'スキル', 'ko': '기술', 'th': 'ทักษะ', 'vi': 'Kỹ năng', 'ms': 'Kemahiran', 'la': 'Artes' },
    selectDefault: { 'zh-TW': '請選擇', 'zh-CN': '请选择', 'en': 'Please select', 'ja': '選択してください', 'ko': '선택하세요', 'th': 'กรุณาเลือก', 'vi': 'Vui lòng chọn', 'ms': 'Sila pilih', 'la': 'Quaeso selige' },
    cancelButton: { 'zh-TW': '取消', 'zh-CN': '取消', 'en': 'Cancel', 'ja': 'キャンセル', 'ko': '취소', 'th': 'ยกเลิก', 'vi': 'Hủy bỏ', 'ms': 'Batal', 'la': 'Abrogare' },
    saveButton: { 'zh-TW': '儲存', 'zh-CN': '保存', 'en': 'Save', 'ja': '保存', 'ko': '저장', 'th': 'บันทึก', 'vi': 'Lưu', 'ms': 'Simpan', 'la': 'Servare' },
    avatarLabel: { 'zh-TW': '頭像 / Avatar', 'zh-CN': '头像 / Avatar', 'en': 'Avatar', 'ja': 'アバター', 'ko': '아바타', 'th': 'รูปประจำตัว', 'vi': 'Ảnh đại diện', 'ms': 'Avatar', 'la': 'Imago' },
    uploading: { 'zh-TW': '上傳中...', 'zh-CN': '上传中...', 'en': 'Uploading...', 'ja': 'アップロード中...', 'ko': '업로드 중...', 'th': 'กำลังอัปโหลด...', 'vi': 'Đang tải lên...', 'ms': 'Memuat naik...', 'la': 'Imponens...' }
  },
  chatroom: { 'zh-TW': '聊天室', 'zh-CN': '聊天室', 'en': 'Chat Room', 'ja': 'チャットルーム', 'ko': '채팅방', 'th': 'ห้องแชท', 'vi': 'Phòng chat', 'ms': 'Bilik Sembang', 'la': 'Cella Colloquii' },
  invites: { 'zh-TW': '邀請通知', 'zh-CN': '邀请通知', 'en': 'Invitations', 'ja': '招待通知', 'ko': '초대 알림', 'th': 'การแจ้งเตือนคำเชิญ', 'vi': 'Thông báo mời', 'ms': 'Notis Jemputan', 'la': 'Notitia Invitationis' },
  mylinks: { 'zh-TW': '我的連結', 'zh-CN': '我的连接', 'en': 'My Links', 'ja': '私のリンク', 'ko': '내 링크', 'th': 'ลิงก์ของฉัน', 'vi': 'Liên kết của tôi', 'ms': 'Pautan Saya', 'la': 'Nexus Mei' },
  returnFriendStories: {
    'zh-TW': '返回好友故事',
    'zh-CN': '返回好友故事',
    'en': 'Return to Friend Stories',
    'ja': '友達のストーリーに戻る',
    'ko': '친구 이야기로 돌아가기',
    'th': 'กลับไปที่เรื่องราวของเพื่อน',
    'vi': 'Quay lại câu chuyện bạn bè',
    'ms': 'Kembali ke Cerita Rakan',
    'la': 'Redi ad Fabulas Amicorum'
  },
  hello: { 'zh-TW': '你好，', 'zh-CN': '你好，', 'ja': 'こんにちは、', 'en': 'Hello,', 'ko': '안녕하세요,', 'th': 'สวัสดี,', 'vi': 'Xin chào,', 'ms': 'Hai,', 'la': 'Salve,' },
  partnerTitle: { 'zh-TW': '尋求夥伴同行', 'zh-CN': '寻找伙伴同行', 'ja': '仲間を探す', 'en': 'Find a Partner', 'ko': '동행자 찾기', 'th': 'ค้นหาคู่หู', 'vi': 'Tìm bạn đồng hành', 'ms': 'Cari Rakan Kongsi', 'la': 'Socius Quaerere' },
  partnerSubtitle: { 'zh-TW': '請選擇你的目標夥伴', 'zh-CN': '请选择你的目标伙伴', 'ja': '目標パートナーを選択してください', 'en': 'Please select your target partner', 'ko': '목표 파트너를 선택하세요', 'th': 'โปรดเลือกพันธมิตรเป้าหมาย', 'vi': 'Vui lòng chọn đối tác mục tiêu', 'ms': 'Sila pilih rakan kongsi sasaran anda', 'la': 'Quaeso selige socium propositum tuum' },
  noPartnerYet: { 'zh-TW': '🦋你的夥伴很快就會出現喔，請耐心等待...', 'zh-CN': '🦋你的伙伴很快就會出现哦，请耐心等待...', 'ja': '🦋あなたのパートナーはすぐに現れます。お待ちください。', 'en': '🦋 Your partner will appear soon. Please be patient.', 'ko': '🦋 당신의 파트너가 곧 나타날 것입니다. 조금만 기다려주세요.', 'th': '🦋พันธมิตรของคุณจะปรากฏในขณะนี้ โปรดอดทนต่อไป', 'vi': '🦋 Bạn đồng hành của bạn sẽ xuất hiện sớm. Vui lòng đợi để chờ đợi...', 'ms': '🦋 Rakan kongsi anda akan muncul segera. Sila tunggu dengan sabar...', 'la': '🦋 Socius tuus apparebit. Quaeso, patientia attendas...' },
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

const PLACEHOLDER = {
  name: {
    'zh-TW': '請輸入您的暱稱',
    'zh-CN': '请输入您的昵称',
    'en': 'Enter your name',
    'ja': 'ニックネームを入力してください',
    'ko': '닉네임을 입력하세요',
    'th': 'กรุณากรอกชื่อเล่น',
    'vi': 'Nhập biệt danh của bạn',
    'ms': 'Masukkan nama samaran anda',
    'la': 'Nomen tuum insere'
  },
  bio: {
    'zh-TW': '請簡短介紹自己，例如：我擅長烹飪，想認識新朋友。',
    'zh-CN': '请简短介绍自己，例如：我擅长烹饪，想认识新朋友。',
    'en': 'Briefly introduce yourself, e.g. I am good at cooking and want to make new friends.',
    'ja': '簡単に自己紹介してください。例：料理が得意で、新しい友達を作りたいです。',
    'ko': '간단히 자기소개를 해주세요. 예: 요리를 잘하고 새로운 친구를 사귀고 싶어요.',
    'th': 'แนะนำตัวเองสั้นๆ เช่น ฉันทำอาหารเก่งและอยากมีเพื่อนใหม่',
    'vi': 'Giới thiệu ngắn gọn về bản thân, ví dụ: Tôi nấu ăn giỏi và muốn kết bạn mới.',
    'ms': 'Perkenalkan diri anda secara ringkas, cth: Saya pandai memasak dan ingin mencari kawan baru.',
    'la': 'Te brevi introduce, ex. bene coquo et novos amicos quaero.'
  },
  skills: {
    'zh-TW': '請輸入您的技能（可用逗號分隔）',
    'zh-CN': '请输入您的技能（可用逗号分隔）',
    'en': 'Enter your skills (comma separated)',
    'ja': 'あなたのスキルを入力してください（カンマ区切り）',
    'ko': '당신의 기술을 입력하세요 (쉼표로 구분)',
    'th': 'กรอกทักษะของคุณ (คั่นด้วย , )',
    'vi': 'Nhập kỹ năng của bạn (cách nhau bằng dấu phẩy)',
    'ms': 'Masukkan kemahiran anda (pisahkan dengan koma)',
    'la': 'Artes tuas insere (commatibus separa)'
  }
};

interface UserProfile {
  id: string;
  name: string;
  goal: Goal;
  role: Role;
  bio: Record<LanguageCode, string>;
  avatar: string;
  skills: string;
  createdAt: any;
  country?: string;
  gender?: string;
}

export default function FriendMatch() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { lang, setLang } = useLanguage();

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRole, setActiveRole] = useState<Role>('peer');
  const [activeGoal, setActiveGoal] = useState<Goal | 'other' | ''>('');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    goal: '',
    skills: '',
    avatar: '',
    customSkill: '',
    country: '',
    gender: '',
  });
  const [editProfile, setEditProfile] = useState({
    name: '',
    bio: '',
    goal: '',
    skills: '',
    avatar: '',
    customSkill: '',
    country: '',
    gender: '',
  });
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [rightTab, setRightTab] = useState<'main' | 'chat' | 'links' | 'invites'>('main');
  const [cardAnim, setCardAnim] = useState<'none' | 'out' | 'in'>('none');
  // 1. 新增 toast 狀態
  const [toast, setToast] = useState<string | null>(null);
  const [showLangBox, setShowLangBox] = useState(false);

  const currentIndexRef = useRef(currentIndex);
  const langBoxRef = useRef<HTMLDivElement>(null);

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

  // Fetch user and profile on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as { nickname?: string; name?: string; bio: string; goal: string; skills: string; avatar: string; customSkill?: string; country?: string; gender?: string };
          setProfile({
            name: data.nickname || data.name || '新用戶',
            bio: data.bio,
            goal: data.goal,
            skills: data.skills,
            avatar: data.avatar,
            customSkill: data.customSkill || '',
            country: data.country || '',
            gender: data.gender || '',
          });
        } else {
          const defaultProfile = {
            name: currentUser.displayName || '新用戶',
            bio: '',
            goal: '',
            skills: '',
            avatar: currentUser.photoURL || `/avatars/Derxl.png`,
            customSkill: '',
            country: '',
            gender: '',
          };
          setProfile(defaultProfile);
          await setDoc(docRef, defaultProfile);
        }
        await loadUsers(currentUser.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const loadUsers = async (currentUserId: string) => {
    try {
      setLoading(true);
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("__name__", "!=", currentUserId));
      const querySnapshot = await getDocs(q);
      
      const users: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          name: data.name || 'Unknown',
          goal: data.goal || 'learnNewSkills',
          role: data.role || 'peer',
          bio: data.bio || { 'zh-TW': 'No bio available', 'zh-CN': '暂无简介', 'en': 'No bio available', 'ja': '自己紹介なし', 'ko': '소개 없음', 'th': 'ไม่มีประวัติ', 'vi': 'Không có tiểu sử', 'ms': 'Tiada bio', 'la': 'Nulla descriptio' },
          avatar: data.avatar || '/avatars/Derxl.png',
          skills: data.skills || '',
          createdAt: data.createdAt,
          country: data.country || '',
          gender: data.gender || '',
        });
      });
      
      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitTestData = async () => {
    try {
      await initFirebaseData();
      alert('測試數據初始化完成！');
      if (user) {
        await loadUsers(user.uid);
      }
    } catch (error) {
      console.error("Error initializing test data:", error);
      alert('初始化失敗');
    }
  };

  const sendInvite = async (targetUserId: string, targetUser: UserProfile) => {
    if (!user) return;
    try {
      const inviteData = {
        fromUserId: user.uid,
        fromUserName: profile.name,
        fromUserAvatar: profile.avatar,
        fromUserCountry: profile.country || '',
        fromUserGender: profile.gender || '',
        fromUserEmail: user.email || '',
        fromUserNickname: profile.name || '',
        toUserId: targetUserId,
        toUserName: targetUser.name,
        role: targetUser.role,
        goal: targetUser.goal,
        status: 'pending',
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "invites"), inviteData);
      setToast(UI_TEXT.like[lang] + ' 成功！');
      setTimeout(() => setToast(null), 2000);
    } catch (error) {
      console.error("Error sending invite:", error);
      alert('發送邀請失敗');
    }
  };

  const childRefs = useMemo(
    () =>
      Array(filteredUsers.length)
        .fill(0)
        .map((i) => React.createRef<any>()),
    [filteredUsers.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const handleSaveProfile = async () => {
    if (user) {
      let saveProfile = { ...editProfile };
      if (editProfile.skills === '其他') {
        saveProfile.skills = editProfile.customSkill;
      }
      if (avatarFile) {
        saveProfile.avatar = previewAvatar;
        const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, avatarFile);
        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload failed", error);
            alert("上傳失敗");
            setUploadProgress(null);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              const newProfile = { ...saveProfile, avatar: downloadURL };
              setProfile(newProfile);
              setEditProfile(newProfile);
              const docRef = doc(db, "profiles", user.uid);
              await setDoc(docRef, newProfile, { merge: true });
              setUploadProgress(null);
              setAvatarFile(null);
              setShowProfileModal(false);
            });
          }
        );
      } else {
        const docRef = doc(db, "profiles", user.uid);
        setProfile(saveProfile);
        setEditProfile(saveProfile);
        await setDoc(docRef, saveProfile, { merge: true });
        setShowProfileModal(false);
      }
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewAvatar(previewUrl);
    }
  };

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: string, name: string, index: number) => {
    if (direction === 'right' && user) {
      const targetUser = filteredUsers[index];
      sendInvite(targetUser.id, targetUser);
    }
  };

  const outOfFrame = (name: string, idx: number) => {
    // handle the case where the user swipes back the card
    if (currentIndexRef.current >= idx && childRefs[idx]) {
      childRefs[idx].current?.restoreCard();
    }
  };

  const swipe = async (dir: 'left' | 'right') => {
    if (canSwipe && currentIndex < filteredUsers.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // Handle language change
  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageCode;
    localStorage.setItem('lang', newLang);
    setLang(newLang);
  };

  // Filter users when activeRole or activeGoal changes
  useEffect(() => {
    if (allUsers.length > 0) {
      const newFilteredUsers = allUsers.filter(user => {
        const roleMatch = user.role === activeRole;
        const goalMatch = activeGoal ? user.goal === activeGoal : true; // If no goal is selected, it's a match
        return roleMatch && goalMatch;
      });
      setFilteredUsers(newFilteredUsers);
      setCurrentIndex(newFilteredUsers.length - 1); // Start from the last card
    }
  }, [activeRole, activeGoal, allUsers]);

  // Modal 開啟時同步 editProfile, previewAvatar, uploadProgress, avatarFile
  useEffect(() => {
    if (showProfileModal) {
      setEditProfile(profile);
      setPreviewAvatar(profile.avatar);
      setUploadProgress(null);
      setAvatarFile(null);
    }
  }, [showProfileModal, profile]);

  const currentUser = filteredUsers[currentIndex];
  const partnerRoles: Role[] = ['peer', 'mentor', 'skillPartner'];

  // 只顯示5個目標選項
  const goalKeys: Goal[] = ['jobSeeking', 'learnNewSkills', 'emotionalSupport', 'networking', 'startupPrep'];

  useEffect(() => {
    // 自動語言切換：如果 localStorage 沒有 lang，根據瀏覽器語言自動設置
    if (!localStorage.getItem('lang')) {
      const browserLang = navigator.language;
      let detectedLang: LanguageCode = 'zh-TW';
      if (browserLang.startsWith('zh-CN')) detectedLang = 'zh-CN';
      else if (browserLang.startsWith('zh-TW')) detectedLang = 'zh-TW';
      else if (browserLang.startsWith('ja')) detectedLang = 'ja';
      else if (browserLang.startsWith('ko')) detectedLang = 'ko';
      else if (browserLang.startsWith('th')) detectedLang = 'th';
      else if (browserLang.startsWith('vi')) detectedLang = 'vi';
      else if (browserLang.startsWith('ms')) detectedLang = 'ms';
      else if (browserLang.startsWith('la')) detectedLang = 'la';
      else if (browserLang.startsWith('en')) detectedLang = 'en';
      setLang(detectedLang);
      localStorage.setItem('lang', detectedLang);
    }
  }, [setLang]);

  useEffect(() => {
    if (cardAnim === 'in') {
      const card = document.getElementById('user-card');
      if (card) {
        card.animate([
          { transform: 'translateX(-120%) scale(0.4)', opacity: 0 },
          { transform: 'translateX(0) scale(1)', opacity: 1 }
        ], { duration: 400 });
      }
      setTimeout(() => setCardAnim('none'), 400);
    }
  }, [cardAnim]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* 手機適配：檢測螢幕寬度 */}
      {window.innerWidth <= 768 ? (
        // 手機版佈局
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: `url('/green_hut.png') center center / cover no-repeat fixed` }}>
          {/* 手機版共用頁頭 */}
          <SharedHeader />
          
          {/* 手機版主內容區 */}
          <div style={{ marginTop: 60, padding: '16px', flex: 1, overflowY: 'auto' }}>
            {/* 用戶資訊卡片 */}
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 2px 12px #6B5BFF22' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 24 }}>🦋</div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#6B5BFF' }}>{UI_TEXT.hello ? UI_TEXT.hello[lang] : '你好，'}</div>
                <img src={profile.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF' }} />
                <div style={{ fontWeight: 700, fontSize: 14, color: '#333' }}>{profile.name}</div>
              </div>
              {/* 目標選擇區域 - 灰色卡片背景 */}
              <div style={{ background: 'rgba(128,128,128,0.1)', borderRadius: 12, padding: '16px', marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#6B5BFF', textAlign: 'center', marginBottom: 8 }}>{UI_TEXT.partnerTitle ? UI_TEXT.partnerTitle[lang] : '尋求夥伴同行'}</div>
                <div style={{ fontSize: 12, color: '#888', textAlign: 'center', marginBottom: 12 }}>{UI_TEXT.partnerSubtitle ? UI_TEXT.partnerSubtitle[lang] : '請選擇你的夥伴目標'}</div>
                
                {/* 目標按鈕 */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {goalKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveGoal(key);
                        setRightTab('main');
                      }}
                      style={{
                        flex: '1 1 calc(50% - 4px)',
                        padding: '8px 4px',
                        borderRadius: 8,
                        border: activeGoal === key ? '2px solid #23c6e6' : '1px solid #eee',
                        background: activeGoal === key ? '#e6f7ff' : '#fff',
                        color: activeGoal === key ? '#23c6e6' : '#333',
                        fontWeight: 600,
                        fontSize: 12,
                        cursor: 'pointer',
                        boxShadow: activeGoal === key ? '0 2px 8px #23c6e622' : '0 1px 4px #0001'
                      }}
                    >
                      {UI_TEXT.goalOptions[key][lang]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 功能按鈕 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button onClick={() => navigate('/chatroom')} style={{ padding: '8px', borderRadius: 8, border: rightTab === 'chat' ? '2px solid #8ec6f7' : '1px solid #eee', background: rightTab === 'chat' ? '#e6f7ff' : '#fff', color: rightTab === 'chat' ? '#23c6e6' : '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{UI_TEXT.chatroom[lang]}</button>
                <button onClick={() => setRightTab('invites')} style={{ padding: '8px', borderRadius: 8, border: rightTab === 'invites' ? '2px solid #6B5BFF' : '1px solid #eee', background: rightTab === 'invites' ? '#f5f4ff' : '#fff', color: rightTab === 'invites' ? '#6B5BFF' : '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{UI_TEXT.invites[lang]}</button>
                <button onClick={() => setRightTab('links')} style={{ padding: '8px', borderRadius: 8, border: rightTab === 'links' ? '2px solid #6B5BFF' : '1px solid #eee', background: rightTab === 'links' ? '#f5f4ff' : '#fff', color: rightTab === 'links' ? '#6B5BFF' : '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>{UI_TEXT.mylinks[lang]}</button>
                <span href="/storywall" style={{ padding: '8px', borderRadius: 8, border: '1px solid #23c6e6', background: '#fff', color: '#23c6e6', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'block' }}>{UI_TEXT.returnFriendStories[lang]} 🦋</span>
              </div>
            </div>
            
            {/* 主內容區域 */}
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '16px', minHeight: 400 }}>
              {rightTab === 'main' && (
                <>
                  {(() => {
                    const candidates = filteredUsers.filter(u => !activeGoal || u.goal === activeGoal);
                    if (candidates.length === 0) {
                      return <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: 16, marginTop: 40, fontWeight: 700 }}>{UI_TEXT.noPartnerYet?.[lang] || '🦋你的夥伴很快就會出現喔，請耐心等待...'}</div>;
                    }
                    const user = candidates[currentIndex >= 0 && currentIndex < candidates.length ? currentIndex : 0];
                    if (!user) return null;
                    return (
                      <div
                        id="user-card"
                        style={{
                          textAlign: 'center',
                          transition: 'box-shadow 0.2s, transform 0.4s',
                          transform: cardAnim === 'in' ? 'translateX(-120%) scale(0.4)' : cardAnim === 'out' ? 'translateX(120%) scale(0.4)' : 'translateX(0) scale(1)',
                          opacity: 1
                        }}
                        onAnimationEnd={() => { if (cardAnim === 'in') setCardAnim('none'); }}
                      >
                        <img src={user.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6B5BFF', marginBottom: 12 }} />
                        <div style={{ fontWeight: 800, fontSize: 18, color: '#6B5BFF', marginBottom: 8 }}>{user.name}</div>
                        <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>國家/地區：{user.country || '未填寫'}</div>
                        <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>性別：{user.gender || '未填寫'}</div>
                        <div style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>目標：{UI_TEXT.goalOptions[user.goal]?.[lang] || user.goal}</div>
                        <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>技能：{user.skills || '未填寫'}</div>

                      </div>
                    );
                  })()}
                </>
              )}
              {rightTab === 'chat' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, justifyContent: 'center', alignItems: 'center', minHeight: '50vh', padding: '20px 0' }}>
                  {/* 上面一個淺灰色卡片框是【好友列表】 */}
                  <div style={{ background: 'rgba(128,128,128,0.15)', borderRadius: 16, padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', width: '95%', maxWidth: 320, border: '1px solid rgba(128,128,128,0.2)' }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: '#6B5BFF', marginBottom: 16, textAlign: 'center' }}>好友列表</div>
                    <div style={{ textAlign: 'center', color: '#666', fontSize: 15, lineHeight: 1.4 }}>請先加好友,才能開始聊天</div>
                  </div>
                  
                  {/* 下面一個淺灰色卡片框是【聊天訊息框】 */}
                  <div style={{ background: 'rgba(128,128,128,0.15)', borderRadius: 16, padding: '24px', boxShadow: '0 6px 16px rgba(0,0,0,0.2)', width: '95%', maxWidth: 320, border: '1px solid rgba(128,128,128,0.2)' }}>
                    <div style={{ fontWeight: 800, fontSize: 20, color: '#6B5BFF', marginBottom: 16, textAlign: 'center' }}>聊天訊息框</div>
                    <div style={{ textAlign: 'center', color: '#666', fontSize: 15, lineHeight: 1.4 }}>還沒有朋友,去交友區加好友吧!</div>
                  </div>
                </div>
              )}
              {rightTab === 'links' && <MyLinks embedded={true} />}
              {rightTab === 'invites' && <InvitesPage embedded={true} />}
            </div>
            
            {/* 手機版 Footer */}
            <div style={{ width: '100%', margin: '0 auto', marginTop: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* 只保留非法律文件的連結 */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <span onClick={() => navigate("/about")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>🧬 Restarter™｜我們是誰</span>
                  <span onClick={() => navigate("/feedback")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>💬 意見箱｜我們想聽你說</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 桌面版佈局
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
            
            {/* 漢堡選單 - 法律文件 */}
            <div style={{ position: 'relative', display: 'inline-block' }} ref={langBoxRef}>
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
                onClick={() => setShowLangBox(v => !v)}
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
              {showLangBox && (
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
                        setShowLangBox(false);
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
          
          {/* 左側固定側邊欄 */}
          <div style={{ position: 'fixed', left: 0, top: 0, width: 340, height: '100vh', background: 'rgba(255,255,255,0.95)', borderRight: '1px solid #eee', overflowY: 'auto', zIndex: 2, padding: '24px 16px' }}>
            {/* 用戶資訊卡片 */}
            <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '20px', marginBottom: 24, boxShadow: '0 2px 12px #6B5BFF22' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 32 }}>🦋</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#6B5BFF' }}>{UI_TEXT.hello ? UI_TEXT.hello[lang] : '你好，'}</div>
                <img src={profile.avatar} alt="avatar" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6B5BFF' }} />
                <div style={{ fontWeight: 700, fontSize: 16, color: '#333' }}>{profile.name}</div>
              </div>
              {/* 目標選擇區域 - 灰色卡片背景 */}
              <div style={{ background: 'rgba(128,128,128,0.1)', borderRadius: 12, padding: '20px', marginBottom: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                <div style={{ fontWeight: 700, fontSize: 18, color: '#6B5BFF', textAlign: 'center', marginBottom: 12 }}>{UI_TEXT.partnerTitle ? UI_TEXT.partnerTitle[lang] : '尋求夥伴同行'}</div>
                <div style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 }}>{UI_TEXT.partnerSubtitle ? UI_TEXT.partnerSubtitle[lang] : '請選擇你的夥伴目標'}</div>
                
                {/* 目標按鈕 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {goalKeys.map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveGoal(key);
                        setRightTab('main');
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: activeGoal === key ? '2px solid #23c6e6' : '1.5px solid #eee',
                        background: activeGoal === key ? '#e6f7ff' : '#fff',
                        color: activeGoal === key ? '#23c6e6' : '#333',
                        fontWeight: 700,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: activeGoal === key ? '0 2px 8px #23c6e622' : '0 2px 8px #0001',
                        transition: 'all 0.2s',
                        outline: 'none',
                        borderLeft: activeGoal === key ? '6px solid #23c6e6' : '6px solid transparent',
                        marginBottom: 0
                      }}
                    >
                      {UI_TEXT.goalOptions[key][lang]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 功能按鈕 */}
              <button onClick={() => navigate('/chatroom')} style={{ width: '100%', marginBottom: 12, padding: '12px 0', borderRadius: 10, border: rightTab === 'chat' ? '2px solid #8ec6f7' : '1.5px solid #eee', background: rightTab === 'chat' ? '#e6f7ff' : '#fff', color: rightTab === 'chat' ? '#23c6e6' : '#333', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: rightTab === 'chat' ? '0 2px 8px #23c6e622' : '0 2px 8px #0001', transition: 'all 0.2s' }}>{UI_TEXT.chatroom[lang]}</button>
              <button onClick={() => setRightTab('invites')} style={{ width: '100%', marginBottom: 12, padding: '12px 0', borderRadius: 10, border: rightTab === 'invites' ? '2px solid #6B5BFF' : '1.5px solid #eee', background: rightTab === 'invites' ? '#f5f4ff' : '#fff', color: rightTab === 'invites' ? '#6B5BFF' : '#333', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: rightTab === 'invites' ? '0 2px 8px #6B5BFF22' : '0 2px 8px #0001', transition: 'all 0.2s' }}>{UI_TEXT.invites[lang]}</button>
              <button onClick={() => setRightTab('links')} style={{ width: '100%', marginBottom: 12, padding: '12px 0', borderRadius: 10, border: rightTab === 'links' ? '2px solid #6B5BFF' : '1.5px solid #eee', background: rightTab === 'links' ? '#f5f4ff' : '#fff', color: rightTab === 'links' ? '#6B5BFF' : '#333', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: rightTab === 'links' ? '0 2px 8px #6B5BFF22' : '0 2px 8px #0001', transition: 'all 0.2s' }}>{UI_TEXT.mylinks[lang]}</button>
              <span href="/storywall" style={{ width: '100%', marginBottom: 12, padding: '12px 0', borderRadius: 10, border: '1.5px solid #23c6e6', background: '#fff', color: '#23c6e6', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #23c6e622', textAlign: 'center', textDecoration: 'none', display: 'block', transition: 'all 0.2s' }}>{UI_TEXT.returnFriendStories[lang]} 🦋</span>
            </div>
          </div>
          
          {/* 右側主顯示區 */}
          <div style={{ position: 'fixed', left: 340, top: 60, width: 'calc(100vw - 340px)', height: 'calc(100vh - 60px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', background: `url('/green_hut.png') center center / cover no-repeat fixed`, zIndex: 1, pointerEvents: 'auto', paddingLeft: 0 }}>
            {/* 主內容區 */}
            <div style={{ width: '100%', maxWidth: 900, marginTop: 60 }}>
              {rightTab === 'main' && (
                <>
                  {(() => {
                    const candidates = filteredUsers.filter(u => !activeGoal || u.goal === activeGoal);
                    if (candidates.length === 0) {
                      return <div style={{ textAlign: 'center', color: '#e74c3c', fontSize: 18, marginTop: 40, fontWeight: 700 }}>{UI_TEXT.noPartnerYet?.[lang] || '🦋你的夥伴很快就會出現喔，請耐心等待...'}</div>;
                    }
                    const user = candidates[currentIndex >= 0 && currentIndex < candidates.length ? currentIndex : 0];
                    if (!user) return null;
                    return (
                      <div
                        id="user-card"
                        style={{
                          width: 340,
                          margin: '0 auto',
                          background: '#fff',
                          borderRadius: 18,
                          boxShadow: '0 2px 16px #6B5BFF22',
                          padding: 32,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          position: 'relative',
                          minHeight: 380,
                          transition: 'box-shadow 0.2s, transform 0.4s',
                          transform: cardAnim === 'in' ? 'translateX(-120%) scale(0.4)' : cardAnim === 'out' ? 'translateX(120%) scale(0.4)' : 'translateX(0) scale(1)',
                          opacity: 1
                        }}
                        onAnimationEnd={() => { if (cardAnim === 'in') setCardAnim('none'); }}
                      >
                        <img src={user.avatar} alt="avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6B5BFF', marginBottom: 16 }} />
                        <div style={{ fontWeight: 800, fontSize: 22, color: '#6B5BFF', marginBottom: 8 }}>{user.name}</div>
                        <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>國家/地區：{user.country || '未填寫'}</div>
                        <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>性別：{user.gender || '未填寫'}</div>
                        <div style={{ color: '#888', fontSize: 15, marginBottom: 4 }}>目標：{UI_TEXT.goalOptions[user.goal]?.[lang] || user.goal}</div>
                        <div style={{ color: '#888', fontSize: 15, marginBottom: 12 }}>技能：{user.skills || '未填寫'}</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
                          <button onClick={() => {
                            const card = document.getElementById('user-card');
                            if (card) {
                              setCardAnim('out');
                              card.animate([
                                { transform: 'translateX(0) scale(1)', opacity: 1 },
                                { transform: 'translateX(120%) scale(0.4)', opacity: 0 }
                              ], { duration: 400 });
                            }
                            setTimeout(() => {
                              setCurrentIndex(idx => {
                                setCardAnim('in');
                                return (idx - 1 + candidates.length) % candidates.length;
                              });
                            }, 400);
                          }} style={{ padding: '10px 28px', borderRadius: 8, border: '1.5px solid #bbb', background: '#fff', color: '#888', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001', transition: 'all 0.2s' }}>跳過</button>
                          <button onClick={() => sendInvite(user.id, user)} style={{ padding: '10px 28px', borderRadius: 8, border: '1.5px solid #6B5BFF', background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #6B5BFF22', transition: 'all 0.2s' }}>建立連結</button>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )}
              {rightTab === 'chat' && (
                <div>聊天室功能開發中</div>
              )}
              {rightTab === 'links' && <MyLinks embedded={true} />}
              {rightTab === 'invites' && <InvitesPage embedded={true} />}
            </div>
          </div>
          

        </>
      )}
      
      {/* Toast 浮窗 */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1976d2',
          color: '#fff',
          padding: '14px 32px',
          borderRadius: 16,
          fontSize: 18,
          fontWeight: 700,
          zIndex: 9999,
          boxShadow: '0 2px 16px #1976d288',
          letterSpacing: 1,
          textAlign: 'center',
          opacity: 0.97
        }}>
          {toast}
        </div>
      )}
    </div>
  );
} 