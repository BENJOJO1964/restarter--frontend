import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { usePermission } from '../hooks/usePermission';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import { UpgradeModal } from '../components/UpgradeModal';
import Footer from '../components/Footer';

import SharedHeader from '../components/SharedHeader';

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

const TEXTS = {
  'zh-TW': {
    title: '我的故事 My Story',
    subtitle: '記錄目標，回顧歷程，驗證成果——讓每一步都看得見。',
    backToHome: '← 返回首頁',
    logout: '登出',
    addMilestone: '添加里程碑',
    editMilestone: '編輯里程碑',
    deleteMilestone: '刪除里程碑',
    save: '保存',
    cancel: '取消',
    totalDays: '總天數',
    achievements: '成就',
    currentStreak: '連續',
    days: '天',
    myMilestones: '我的里程碑',
    noMilestones: '還沒有里程碑，開始記錄你的故事吧！',
    socialIntegration: '社會融入度評估',
    socialIntegrationTitle: '社會融入度評估',
    socialIntegrationDesc: '評估你在社會中的融入程度，包括人際關係、就業狀況、家庭關係等',
    socialIntegrationQuestions: {
      q1: '你覺得與他人的關係如何？',
      q2: '你對目前的工作/學習狀況滿意嗎？',
      q3: '你與家人的關係如何？',
      q4: '你對未來有信心嗎？',
      q5: '你覺得社會對你的接納程度如何？'
    },
    socialIntegrationOptions: {
      excellent: '非常好',
      good: '良好',
      fair: '一般',
      poor: '需要改善'
    },
    milestoneTypes: {
      start: '開始',
      achievement: '成就',
      growth: '成長',
      habit: '習慣',
      help: '幫助',
      goal: '目標',
      social: '社會融入'
    }
  },
  'zh-CN': {
    title: '我的故事 My Story',
    subtitle: '记录目标，回顾历程，验证成果——让每一步都看得见。',
    backToHome: '← 返回首页',
    logout: '登出',
    addMilestone: '添加里程碑',
    editMilestone: '编辑里程碑',
    deleteMilestone: '删除里程碑',
    save: '保存',
    cancel: '取消',
    totalDays: '总天数',
    achievements: '成就',
    currentStreak: '连续',
    days: '天',
    myMilestones: '我的里程碑',
    noMilestones: '还没有里程碑，开始记录你的故事吧！',
    socialIntegration: '社会融入度评估',
    socialIntegrationTitle: '社会融入度评估',
    socialIntegrationDesc: '评估你在社会中的融入程度，包括人际关系、就业状况、家庭关系等',
    socialIntegrationQuestions: {
      q1: '你觉得与他人的关系如何？',
      q2: '你对目前的工作/学习状况满意吗？',
      q3: '你与家人的关系如何？',
      q4: '你对未来有信心吗？',
      q5: '你觉得社会对你的接纳程度如何？'
    },
    socialIntegrationOptions: {
      excellent: '非常好',
      good: '良好',
      fair: '一般',
      poor: '需要改善'
    },
    milestoneTypes: {
      start: '开始',
      achievement: '成就',
      growth: '成长',
      habit: '习惯',
      help: '帮助',
      goal: '目标',
      social: '社会融入'
    }
  },
  'en': {
    title: 'My Story',
    subtitle: 'Record goals, review progress, verify results—make every step visible.',
    backToHome: '← Back to Home',
    logout: 'Logout',
    addMilestone: 'Add Milestone',
    editMilestone: 'Edit Milestone',
    deleteMilestone: 'Delete Milestone',
    save: 'Save',
    cancel: 'Cancel',
    totalDays: 'Total Days',
    achievements: 'Achievements',
    currentStreak: 'Current Streak',
    days: 'days',
    myMilestones: 'My Milestones',
    noMilestones: 'No milestones yet, start recording your story!',
    socialIntegration: 'Social Integration Assessment',
    socialIntegrationTitle: 'Social Integration Assessment',
    socialIntegrationDesc: 'Assess your level of social integration, including relationships, employment status, family relationships, etc.',
    socialIntegrationQuestions: {
      q1: 'How do you feel about your relationships with others?',
      q2: 'Are you satisfied with your current work/study situation?',
      q3: 'How are your relationships with family?',
      q4: 'Do you have confidence in the future?',
      q5: 'How do you feel about society\'s acceptance of you?'
    },
    socialIntegrationOptions: {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Needs Improvement'
    },
    milestoneTypes: {
      start: 'Start',
      achievement: 'Achievement',
      growth: 'Growth',
      habit: 'Habit',
      help: 'Help',
      goal: 'Goal',
      social: 'Social Integration'
    }
  },
  'ja': {
    title: 'マイストーリー',
    subtitle: '目標を記録し、進歩を振り返り、結果を検証する——すべてのステップを見えるようにする。',
    backToHome: '← ホームに戻る',
    logout: 'ログアウト',
    addMilestone: 'マイルストーンを追加',
    editMilestone: 'マイルストーンを編集',
    deleteMilestone: 'マイルストーンを削除',
    save: '保存',
    cancel: 'キャンセル',
    totalDays: '総日数',
    achievements: '達成',
    currentStreak: '連続',
    days: '日',
    myMilestones: 'マイマイルストーン',
    noMilestones: 'まだマイルストーンがありません。ストーリーを記録し始めましょう！',
    socialIntegration: '社会的統合度評価',
    socialIntegrationTitle: '社会的統合度評価',
    socialIntegrationDesc: '人間関係、就業状況、家族関係などを含む社会的統合度を評価する',
    socialIntegrationQuestions: {
      q1: '他者との関係をどう感じていますか？',
      q2: '現在の仕事/学習状況に満足していますか？',
      q3: '家族との関係はどうですか？',
      q4: '将来に自信がありますか？',
      q5: '社会からの受け入れられ方をどう感じていますか？'
    },
    socialIntegrationOptions: {
      excellent: '非常に良い',
      good: '良い',
      fair: '普通',
      poor: '改善が必要'
    },
    milestoneTypes: {
      start: '開始',
      achievement: '達成',
      growth: '成長',
      habit: '習慣',
      help: '支援',
      goal: '目標',
      social: '社会的統合'
    }
  },
  'ko': {
    title: '내 이야기',
    subtitle: '목표를 기록하고, 진행 상황을 되돌아보고, 결과를 검증하세요—모든 단계를 보이게 만드세요.',
    backToHome: '← 홈으로',
    logout: '로그아웃',
    addMilestone: '마일스톤 추가',
    editMilestone: '마일스톤 편집',
    deleteMilestone: '마일스톤 삭제',
    save: '저장',
    cancel: '취소',
    totalDays: '총 일수',
    achievements: '성취',
    currentStreak: '연속',
    days: '일',
    myMilestones: '내 마일스톤',
    noMilestones: '아직 마일스톤이 없습니다. 이야기를 기록하기 시작하세요!',
    socialIntegration: '사회 통합도 평가',
    socialIntegrationTitle: '사회 통합도 평가',
    socialIntegrationDesc: '인간관계, 고용상태, 가족관계 등을 포함한 사회 통합도를 평가하세요',
    socialIntegrationQuestions: {
      q1: '다른 사람과의 관계를 어떻게 느끼나요?',
      q2: '현재의 일/학습 상황에 만족하나요?',
      q3: '가족과의 관계는 어떠한가요?',
      q4: '미래에 대한 자신감이 있나요?',
      q5: '사회로부터의 수용도를 어떻게 느끼나요?'
    },
    socialIntegrationOptions: {
      excellent: '매우 좋음',
      good: '좋음',
      fair: '보통',
      poor: '개선 필요'
    },
    milestoneTypes: {
      start: '시작',
      achievement: '성취',
      growth: '성장',
      habit: '습관',
      help: '도움',
      goal: '목표',
      social: '사회 통합'
    }
  },
  'th': {
    title: 'เรื่องราวของฉัน',
    subtitle: 'บันทึกเป้าหมาย ตรวจสอบความคืบหน้า ตรวจสอบผลลัพธ์—ทำให้ทุกขั้นตอนมองเห็นได้',
    backToHome: '← กลับหน้าหลัก',
    logout: 'ออกจากระบบ',
    addMilestone: 'เพิ่มจุดหมาย',
    editMilestone: 'แก้ไขจุดหมาย',
    deleteMilestone: 'ลบจุดหมาย',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    totalDays: 'จำนวนวันทั้งหมด',
    achievements: 'ความสำเร็จ',
    currentStreak: 'ต่อเนื่อง',
    days: 'วัน',
    myMilestones: 'จุดหมายของฉัน',
    noMilestones: 'ยังไม่มีจุดหมาย เริ่มบันทึกเรื่องราวของคุณเลย!',
    socialIntegration: 'การประเมินการรวมตัวทางสังคม',
    socialIntegrationTitle: 'การประเมินการรวมตัวทางสังคม',
    socialIntegrationDesc: 'ประเมินระดับการรวมตัวทางสังคมของคุณ รวมถึงความสัมพันธ์ สถานะการจ้างงาน ความสัมพันธ์ในครอบครัว',
    socialIntegrationQuestions: {
      q1: 'คุณรู้สึกอย่างไรกับความสัมพันธ์กับผู้อื่น?',
      q2: 'คุณพอใจกับสถานการณ์การทำงาน/การเรียนปัจจุบันหรือไม่?',
      q3: 'ความสัมพันธ์กับครอบครัวเป็นอย่างไร?',
      q4: 'คุณมีความมั่นใจในอนาคตหรือไม่?',
      q5: 'คุณรู้สึกอย่างไรกับการยอมรับจากสังคม?'
    },
    socialIntegrationOptions: {
      excellent: 'ดีมาก',
      good: 'ดี',
      fair: 'ปานกลาง',
      poor: 'ต้องปรับปรุง'
    },
    milestoneTypes: {
      start: 'เริ่มต้น',
      achievement: 'ความสำเร็จ',
      growth: 'การเติบโต',
      habit: 'นิสัย',
      help: 'ความช่วยเหลือ',
      goal: 'เป้าหมาย',
      social: 'การรวมตัวทางสังคม'
    }
  },
  'vi': {
    title: 'Câu chuyện của tôi',
    subtitle: 'Ghi lại mục tiêu, xem xét tiến độ, xác minh kết quả—làm cho mọi bước đều nhìn thấy được.',
    backToHome: '← Về trang chủ',
    logout: 'Đăng xuất',
    addMilestone: 'Thêm cột mốc',
    editMilestone: 'Chỉnh sửa cột mốc',
    deleteMilestone: 'Xóa cột mốc',
    save: 'Lưu',
    cancel: 'Hủy',
    totalDays: 'Tổng số ngày',
    achievements: 'Thành tựu',
    currentStreak: 'Liên tiếp',
    days: 'ngày',
    myMilestones: 'Cột mốc của tôi',
    noMilestones: 'Chưa có cột mốc nào, hãy bắt đầu ghi lại câu chuyện của bạn!',
    socialIntegration: 'Đánh giá hòa nhập xã hội',
    socialIntegrationTitle: 'Đánh giá hòa nhập xã hội',
    socialIntegrationDesc: 'Đánh giá mức độ hòa nhập xã hội của bạn, bao gồm các mối quan hệ, tình trạng việc làm, mối quan hệ gia đình',
    socialIntegrationQuestions: {
      q1: 'Bạn cảm thấy thế nào về mối quan hệ với người khác?',
      q2: 'Bạn có hài lòng với tình hình công việc/học tập hiện tại không?',
      q3: 'Mối quan hệ với gia đình như thế nào?',
      q4: 'Bạn có tự tin về tương lai không?',
      q5: 'Bạn cảm thấy thế nào về sự chấp nhận từ xã hội?'
    },
    socialIntegrationOptions: {
      excellent: 'Rất tốt',
      good: 'Tốt',
      fair: 'Bình thường',
      poor: 'Cần cải thiện'
    },
    milestoneTypes: {
      start: 'Bắt đầu',
      achievement: 'Thành tựu',
      growth: 'Phát triển',
      habit: 'Thói quen',
      help: 'Hỗ trợ',
      goal: 'Mục tiêu',
      social: 'Hòa nhập xã hội'
    }
  },
  'ms': {
    title: 'Cerita Saya',
    subtitle: 'Rakam matlamat, semak semula kemajuan, sahkan hasil—jadikan setiap langkah kelihatan.',
    backToHome: '← Kembali ke Laman Utama',
    logout: 'Log keluar',
    addMilestone: 'Tambah Pencapaian',
    editMilestone: 'Edit Pencapaian',
    deleteMilestone: 'Padam Pencapaian',
    save: 'Simpan',
    cancel: 'Batal',
    totalDays: 'Jumlah Hari',
    achievements: 'Pencapaian',
    currentStreak: 'Berturut-turut',
    days: 'hari',
    myMilestones: 'Pencapaian Saya',
    noMilestones: 'Belum ada pencapaian, mulakan rakam cerita anda!',
    socialIntegration: 'Penilaian Integrasi Sosial',
    socialIntegrationTitle: 'Penilaian Integrasi Sosial',
    socialIntegrationDesc: 'Nilai tahap integrasi sosial anda, termasuk hubungan, status pekerjaan, hubungan keluarga',
    socialIntegrationQuestions: {
      q1: 'Bagaimana perasaan anda tentang hubungan dengan orang lain?',
      q2: 'Adakah anda berpuas hati dengan situasi kerja/pembelajaran semasa?',
      q3: 'Bagaimana hubungan anda dengan keluarga?',
      q4: 'Adakah anda yakin dengan masa hadapan?',
      q5: 'Bagaimana perasaan anda tentang penerimaan masyarakat?'
    },
    socialIntegrationOptions: {
      excellent: 'Sangat Baik',
      good: 'Baik',
      fair: 'Sederhana',
      poor: 'Perlu Penambahbaikan'
    },
    milestoneTypes: {
      start: 'Mula',
      achievement: 'Pencapaian',
      growth: 'Pertumbuhan',
      habit: 'Tabiat',
      help: 'Bantuan',
      goal: 'Matlamat',
      social: 'Integrasi Sosial'
    }
  },
  'la': {
    title: 'Fabula Mea',
    subtitle: 'Proposita inscribe, progressum recense, eventa verifica—gradum quemque visibilem fac.',
    backToHome: '← Redi ad domum',
    logout: 'Exire',
    addMilestone: 'Addere Lapidem Milliarium',
    editMilestone: 'Lapidem Milliarium Edere',
    deleteMilestone: 'Lapidem Milliarium Delere',
    save: 'Servare',
    cancel: 'Cancellare',
    totalDays: 'Dies Totales',
    achievements: 'Res Gestae',
    currentStreak: 'Series',
    days: 'dies',
    myMilestones: 'Lapides Milliarii Mei',
    noMilestones: 'Nondum lapides milliarii, incipe fabulam tuam inscribere!',
    socialIntegration: 'Aestimatio Integrationis Socialis',
    socialIntegrationTitle: 'Aestimatio Integrationis Socialis',
    socialIntegrationDesc: 'Aestima gradum integrationis socialis tuae, includens relationes, statum operis, relationes familiae',
    socialIntegrationQuestions: {
      q1: 'Quomodo sentis de relationibus cum aliis?',
      q2: 'Esne contentus cum statu operis/studii praesenti?',
      q3: 'Quomodo sunt relationes tuae cum familia?',
      q4: 'Habesne fiduciam in futuro?',
      q5: 'Quomodo sentis de acceptatione societatis?'
    },
    socialIntegrationOptions: {
      excellent: 'Optime',
      good: 'Bene',
      fair: 'Mediocriter',
      poor: 'Emendatione Opus'
    },
    milestoneTypes: {
      start: 'Initiare',
      achievement: 'Res Gesta',
      growth: 'Incrementum',
      habit: 'Consuetudo',
      help: 'Auxilium',
      goal: 'Propositum',
      social: 'Integratio Socialis'
    }
  }
};

interface Milestone {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  completed: boolean;
  audioUrl?: string; // 新增：儲存音頻URL
  duration?: number; // 新增：儲存錄音時長
}

interface UserProfile {
  name: string;
  startDate: Date;
  totalDays: number;
  achievements: number;
  currentStreak: number;
}

export default function MyStory() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['zh-TW'];


  // 獲取用戶頭像
  const getUserAvatar = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        const db = getFirestore();
        const docRef = doc(db, "profiles", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.avatar) {
            setUserAvatar(data.avatar);
          }
        }
      }
    } catch (error) {
      console.error('獲取用戶頭像失敗:', error);
    }
  };
  
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    // 從localStorage讀取保存的里程碑
    const savedMilestones = localStorage.getItem('userMilestones');
    if (savedMilestones) {
      return JSON.parse(savedMilestones);
    }
    // 預設里程碑
    return [
      {
        id: 1,
        title: '開始新的旅程',
        description: '決定重新開始，為自己設定新的目標',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'start',
        completed: true
      },
      {
        id: 2,
        title: '完成第一個小目標',
        description: '成功完成了一項小任務，感覺很棒',
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'achievement',
        completed: true
      },
      {
        id: 3,
        title: '學會控制情緒',
        description: '在困難時刻保持冷靜，學會了情緒管理',
        date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'growth',
        completed: true
      },
      {
        id: 4,
        title: '建立新的習慣',
        description: '每天堅持做一些小事情，建立正向習慣',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'habit',
        completed: true
      },
      {
        id: 5,
        title: '幫助他人',
        description: '第一次主動幫助別人，感受到付出的快樂',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'help',
        completed: true
      },
      {
        id: 6,
        title: '設定更大的目標',
        description: '為自己設定更具挑戰性的目標',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'goal',
        completed: false
      }
    ];
  });
  
  const [userProfile] = useState<UserProfile>({
    name: '我的故事',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalDays: 30,
    achievements: 5,
    currentStreak: 7
  });
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showSocialIntegrationDialog, setShowSocialIntegrationDialog] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const legalMenuRef = useRef<HTMLDivElement>(null);

  const [showSocialIntegrationReport, setShowSocialIntegrationReport] = useState(false);
  const [socialIntegrationReport, setSocialIntegrationReport] = useState<any>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    type: 'achievement'
  });


  // 漢堡選單點擊外部隱藏
  useEffect(() => {
    if (!showLegalMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (legalMenuRef.current && !legalMenuRef.current.contains(e.target as Node)) {
        setShowLegalMenu(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [showLegalMenu]);

  // 語音錄製相關狀態
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [pendingAudio, setPendingAudio] = useState<{ blob: Blob; duration: number } | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showRecordingConfirm, setShowRecordingConfirm] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);

  // 新增：權限檢查
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);

  // 組件加載時獲取用戶頭像
  useEffect(() => {
    getUserAvatar();
  }, []);

  // 保存里程碑到localStorage
  const saveMilestonesToStorage = (newMilestones: Milestone[]) => {
    localStorage.setItem('userMilestones', JSON.stringify(newMilestones));
  };

  const handleAddMilestone = () => {
    if (newMilestone.title.trim() && newMilestone.description.trim()) {
      const milestone: Milestone = {
        id: Date.now(),
        title: newMilestone.title,
        description: newMilestone.description,
        date: new Date().toISOString(),
        type: newMilestone.type,
        completed: false
      };
      
      const updatedMilestones = [milestone, ...milestones];
      setMilestones(updatedMilestones);
      saveMilestonesToStorage(updatedMilestones);
      setNewMilestone({ title: '', description: '', type: 'achievement' });
      setShowAddDialog(false);
    }
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone(milestone);
    setNewMilestone({
      title: milestone.title,
      description: milestone.description,
      type: milestone.type
    });
  };

  const handleSaveEdit = () => {
    if (editingMilestone && newMilestone.title.trim() && newMilestone.description.trim()) {
      const updatedMilestones = milestones.map(m => 
        m.id === editingMilestone.id 
          ? { ...m, title: newMilestone.title, description: newMilestone.description, type: newMilestone.type }
          : m
      );
      setMilestones(updatedMilestones);
      saveMilestonesToStorage(updatedMilestones);
      setEditingMilestone(null);
      setNewMilestone({ title: '', description: '', type: 'achievement' });
    }
  };

  const handleDeleteMilestone = (id: number) => {
    if (window.confirm('🌟 親愛的朋友，您真的要刪除這個里程碑嗎？\n\n💫 每個里程碑都記錄著您成長的足跡，刪除後就無法找回囉～\n\n✨ 如果您確定要刪除，我們會溫柔地幫您處理。')) {
      const updatedMilestones = milestones.filter(m => m.id !== id);
      setMilestones(updatedMilestones);
      saveMilestonesToStorage(updatedMilestones);
    }
  };

  // 語音錄製相關函數
  const handleRecordingClick = async () => {
    if (isListening) {
      // 停止錄音
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
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

    // 檢查語音權限
    const permission = await checkPermission('aiChat');
    if (!permission.allowed) {

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
        // 使用ref中收集的音頻塊
        const currentChunks = [...audioChunksRef.current];
        console.log('錄音停止，音頻塊數量:', currentChunks.length);
        
        // 創建音頻blob
        const audioBlob = currentChunks.length > 0 
          ? new Blob(currentChunks, { type: 'audio/webm' })
          : new Blob([''], { type: 'audio/webm' });
        
        // 計算實際錄音時長（基於音頻塊數量估算）
        const estimatedDuration = Math.max(1, Math.floor(currentChunks.length * 0.1)); // 每個音頻塊約0.1秒
        console.log('創建音頻blob，大小:', audioBlob.size, '估算錄音時長:', estimatedDuration);
        
        // 設置送出對話框
        setPendingAudio({ blob: audioBlob, duration: estimatedDuration });
        setShowSubmitDialog(true);
        setAudioChunks([]);
        audioChunksRef.current = [];
        console.log('設置送出對話框狀態');
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(100); // 每100毫秒收集一次數據，確保能收集到音頻
      setMediaRecorder(recorder);
      setIsListening(true);
      setIsRecording(true);
      
      // 開始計時器
      const timer = setInterval(() => {
        setRecordingDuration(prev => {
          const newDuration = prev + 1;
          // 檢查是否達到1分鐘限制
          if (newDuration >= 60) {
            // 自動停止錄音
            if (mediaRecorder && mediaRecorder.state === 'recording') {
              mediaRecorder.stop();
            }
            if (timer) {
              clearInterval(timer);
              setRecordingTimer(null);
            }
            setIsListening(false);
            setIsRecording(false);
            alert('錄音時間已達1分鐘限制，已自動停止錄音');
          }
          return newDuration;
        });
      }, 1000);
      setRecordingTimer(timer);
    } catch (error) {
      console.error('錄音錯誤:', error);
      alert('無法啟動麥克風，請檢查權限設置');
    }
  };

  const handleCancelRecording = () => {
    setShowRecordingConfirm(false);
  };

  const handleSubmitVoice = () => {
    if (pendingAudio) {
      handleAudio(pendingAudio.blob, pendingAudio.duration);
      setPendingAudio(null);
      setShowSubmitDialog(false);
      
      // 記錄使用量
      recordUsage('aiChat', 1);
    }
  };

  const handleCancelSubmit = () => {
    setPendingAudio(null);
    setShowSubmitDialog(false);
  };

  // 社會融入度評估相關函數
  const [socialIntegrationAnswers, setSocialIntegrationAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: ''
  });

  // 預設評估結果映射表
  const getAssessmentResult = (answers: any) => {
    const answerMap = {
      'excellent': 5,
      'good': 4,
      'fair': 3,
      'poor': 2
    };
    
    // 計算總分
    const scores = [
      answerMap[answers.q1 as keyof typeof answerMap] || 3,
      answerMap[answers.q2 as keyof typeof answerMap] || 3,
      answerMap[answers.q3 as keyof typeof answerMap] || 3,
      answerMap[answers.q4 as keyof typeof answerMap] || 3,
      answerMap[answers.q5 as keyof typeof answerMap] || 3
    ];
    
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    const averageScore = totalScore / 5;
    
    // 根據分數範圍返回評估結果
    if (averageScore >= 4.5) {
      return {
        score: averageScore,
        result: '優秀',
        description: '你的社會融入度非常高，在人際關係、就業狀況、家庭關係等方面都表現出色。',
        recommendations: [
          '繼續保持現有的良好狀態',
          '可以考慮擔任志工幫助其他更生人',
          '分享你的成功經驗給其他需要幫助的人',
          '參與社區活動擴大影響力'
        ],
        analysis: '基於你的評估結果，你在各個方面都表現優秀，顯示出良好的社會適應能力和積極的生活態度。建議繼續保持這種狀態，並可以考慮幫助其他需要支持的人。'
      };
    } else if (averageScore >= 3.5) {
      return {
        score: averageScore,
        result: '良好',
        description: '你的社會融入度良好，在大部分方面都有不錯的表現，還有提升空間。',
        recommendations: [
          '參加更多社交活動擴大交友圈',
          '尋求職業技能培訓提升就業競爭力',
          '與家人多溝通改善家庭關係',
          '制定具體的個人發展計劃'
        ],
        analysis: '你的社會融入度處於良好水平，顯示出積極的改善趨勢。建議在現有基礎上進一步提升，特別是在就業技能和人際關係方面。'
      };
    } else if (averageScore >= 2.5) {
      return {
        score: averageScore,
        result: '一般',
        description: '你的社會融入度一般，在某些方面需要改善，建議尋求更多支持。',
        recommendations: [
          '建議尋求專業輔導師協助',
          '參加更生人互助團體',
          '制定具體的改善計劃',
          '逐步建立支持網絡'
        ],
        analysis: '你的社會融入度處於一般水平，這表明在某些方面還需要改善。建議尋求專業支持，制定具體的改善計劃，並逐步建立支持網絡。'
      };
    } else {
      return {
        score: averageScore,
        result: '需要改善',
        description: '你的社會融入度需要改善，建議尋求專業輔導和支持。',
        recommendations: [
          '立即聯繫專業輔導師',
          '參加更生人支持計劃',
          '尋求心理諮商服務',
          '建立穩定的生活規律'
        ],
        analysis: '你的社會融入度需要改善，建議立即尋求專業輔導和支持。這不是失敗，而是需要更多幫助的表現。專業輔導師可以幫助你制定適合的改善計劃。'
      };
    }
  };

  const handleSocialIntegrationSubmit = () => {
    // 檢查是否所有問題都已回答
    const allAnswered = Object.values(socialIntegrationAnswers).every(answer => answer !== '');
    if (!allAnswered) {
      alert('請回答所有問題');
      return;
    }
    
    // 獲取預設評估結果
    const assessmentResult = getAssessmentResult(socialIntegrationAnswers);
    
    // 生成詳細報告
    const report = {
      score: assessmentResult.score,
      result: assessmentResult.result,
      description: assessmentResult.description,
      recommendations: assessmentResult.recommendations,
      analysis: assessmentResult.analysis,
      details: {
        relationships: socialIntegrationAnswers.q1,
        employment: socialIntegrationAnswers.q2,
        family: socialIntegrationAnswers.q3,
        confidence: socialIntegrationAnswers.q4,
        acceptance: socialIntegrationAnswers.q5
      }
    };
    
    const milestone: Milestone = {
      id: Date.now(),
      title: `${t.socialIntegrationTitle} - ${assessmentResult.result}`,
      description: `${assessmentResult.description} 評估分數: ${assessmentResult.score.toFixed(1)}/5.0\n\n分析：\n${assessmentResult.analysis}\n\n建議：\n${assessmentResult.recommendations.map(rec => `• ${rec}`).join('\n')}`,
      date: new Date().toISOString(),
      type: 'social',
      completed: true
    };
    
    const updatedMilestones = [milestone, ...milestones];
    setMilestones(updatedMilestones);
    saveMilestonesToStorage(updatedMilestones);
    setSocialIntegrationAnswers({ q1: '', q2: '', q3: '', q4: '', q5: '' });
    setShowSocialIntegrationDialog(false);
    
    // 顯示詳細報告
    setShowSocialIntegrationReport(true);
    setSocialIntegrationReport(report);
  };

  const handleAudio = (audioBlob: Blob, duration: number) => {
    // 創建音頻URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // 模擬語音轉文字
    const mockTexts = [
      '今天完成了一個重要目標，感覺很有成就感。',
      '學會了新的技能，為自己的成長感到驕傲。',
      '克服了困難，證明了自己的能力。',
      '幫助了別人，感受到付出的快樂。',
      '建立了新的習慣，為未來打下基礎。'
    ];
    
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    const randomType = ['achievement', 'growth', 'habit', 'help', 'goal'][Math.floor(Math.random() * 5)];
    
    const milestone: Milestone = {
      id: Date.now(),
      title: '語音里程碑',
      description: randomText,
      date: new Date().toISOString(),
      type: randomType,
      completed: true,
      audioUrl: audioUrl, // 儲存音頻URL
      duration: duration // 儲存錄音時長
    };
    
    const updatedMilestones = [milestone, ...milestones];
    setMilestones(updatedMilestones);
    saveMilestonesToStorage(updatedMilestones);
  };

  const getMilestoneTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      start: '#2196F3',
      achievement: '#4CAF50',
      growth: '#9C27B0',
      habit: '#FF9800',
      help: '#E91E63',
      goal: '#F44336',
      social: '#6B5BFF'
    };
    return colors[type] || '#9E9E9E';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 播放音頻里程碑
  const playVoiceMilestone = (milestone: Milestone) => {
    if (milestone.audioUrl) {
      // 播放真正的原音
      const audio = new Audio(milestone.audioUrl);
      
      // 添加錯誤處理
      audio.onerror = (error) => {
        console.error('音頻加載失敗:', error);
        // 如果原音播放失敗，使用文字轉語音作為備用
        playTextToSpeech(milestone.description);
      };
      
      audio.play().then(() => {
        console.log('正在播放原音...');
      }).catch((error) => {
        console.error('播放失敗:', error);
        // 如果播放失敗，使用文字轉語音作為備用
        playTextToSpeech(milestone.description);
      });
    } else {
      // 如果沒有原音，使用文字轉語音作為備用
      playTextToSpeech(milestone.description);
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
      
      console.log('正在播放里程碑內容（文字轉語音）...');
    } else {
      alert('瀏覽器不支援語音播放功能');
    }
  };

  const completedMilestones = milestones.filter(m => m.completed).length;

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
      padding: window.innerWidth <= 768 ? '0' : '20px'
    }}>
      {/* 手機版使用共用頁頭，桌面版使用首頁頁頭 */}
      {window.innerWidth <= 768 ? (
        <SharedHeader />
      ) : (
        <>
          {/* LOGO */}
          <div className="fixed-logo-box" style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" className="fixed-logo-img" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
          </div>
          
          {/* 右側導航按鈕 */}
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

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {getAuth().currentUser?.photoURL ? (
  <img src={getAuth().currentUser.photoURL} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF' }} />
) : (
  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B5BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold', border: '2px solid #6B5BFF' }}>
    {getAuth().currentUser?.displayName ? getAuth().currentUser.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                <span style={{ color: '#6B5BFF', fontWeight: 600, fontSize: 12, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getAuth().currentUser?.displayName || getAuth().currentUser?.email || '用戶'}</span>
                <button 
                  className="topbar-btn" 
                  onClick={async () => { const auth = getAuth(); await auth.signOut(); navigate('/'); }} 
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
              </div>
            </div>
            <LanguageSelector style={{ width: '80px', fontSize: 14, padding: '6px 10px', height: '28px' }} />
            
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
                    { key: 'privacy', title: '隱私政策', path: '/privacy-policy' },
                    { key: 'terms', title: '使用條款', path: '/terms' },
                    { key: 'data', title: '資料刪除', path: '/data-deletion' },
                    { key: 'ai', title: 'AI使用聲明', path: '/ai-statement' },
                    { key: 'mental', title: '心理健康免責聲明', path: '/mental-health-disclaimer' },
                    { key: 'cookie', title: 'Cookie政策', path: '/cookie-policy' },
                    { key: 'children', title: '兒童隱私保護', path: '/children-privacy' },
                    { key: 'international', title: '國際用戶聲明', path: '/international-users' },
                    { key: 'security', title: '安全聲明', path: '/security-statement' },
                    { key: 'update', title: '更新通知機制', path: '/update-notification' }
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
                      {item.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 頁面標題區域 */}
          <div style={{ marginTop: '100px', marginBottom: '30px', textAlign: 'center' }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold',
              margin: 0,
              marginBottom: '8px'
            }}>
              {t.myMilestones}
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              fontWeight: 400,
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.4
            }}>
              {t.subtitle}
            </p>
          </div>
        </>
      )}

      {/* 主要內容 */}
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        marginTop: window.innerWidth <= 768 ? '100px' : '0',
        padding: window.innerWidth <= 768 ? '20px' : '0'
      }}>
        {/* 用戶概況卡片 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="用戶頭像"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#4CAF50',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold'
                }}>
                  {getAuth().currentUser?.displayName ? getAuth().currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            
            <h2 style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '6px'
            }}>
              {lang === 'zh-TW' ? '里程碑' : 
               lang === 'zh-CN' ? '里程碑' : 
               lang === 'en' ? 'Milestone' : 
               lang === 'ja' ? 'マイルストーン' : 
               lang === 'ko' ? '마일스톤' : 
               lang === 'th' ? 'จุดหมาย' : 
               lang === 'vi' ? 'Cột mốc' : 
               lang === 'ms' ? 'Pencapaian' : 
               'Lapis Milliarius'}
            </h2>
            
            <p style={{ 
              color: '#666', 
              fontSize: '13px',
              marginBottom: '20px'
            }}>
              開始於 {userProfile.startDate.toLocaleDateString('zh-TW')}
            </p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: 'bold',
                color: '#4CAF50',
                marginBottom: '3px'
              }}>
                {userProfile.totalDays}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#666'
              }}>
                {t.totalDays}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: 'bold',
                color: '#FF9800',
                marginBottom: '3px'
              }}>
                {completedMilestones}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#666'
              }}>
                {t.achievements}
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: 'bold',
                color: '#2196F3',
                marginBottom: '3px'
              }}>
                {userProfile.currentStreak}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: '#666'
              }}>
                {t.currentStreak} {t.days}
              </div>
            </div>
          </div>
        </div>

        {/* 添加里程碑按鈕區域 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {/* 文字添加按鈕 */}
          <button
            onClick={() => setShowAddDialog(true)}
            style={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '12px 24px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(33, 150, 243, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(33, 150, 243, 0.3)';
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            {t.addMilestone}
          </button>

          {/* 語音錄製按鈕 */}
          <button
            onClick={handleRecordingClick}
            style={{
              background: isRecording 
                ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                : 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              border: 'none',
              borderRadius: '16px',
              padding: '12px 24px',
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
              animation: isRecording ? 'pulse 1.5s infinite' : 'none'
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
            {isRecording ? `${lang === 'zh-TW' ? '錄音中' : lang === 'zh-CN' ? '录音中' : lang === 'en' ? 'Recording' : lang === 'ja' ? '録音中' : lang === 'ko' ? '녹음 중' : lang === 'th' ? 'กำลังบันทึก' : lang === 'vi' ? 'Đang ghi âm' : lang === 'ms' ? 'Sedang Merakam' : 'Recording'} ${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}` : lang === 'zh-TW' ? '語音輸入' : lang === 'zh-CN' ? '语音输入' : lang === 'en' ? 'Voice Input' : lang === 'ja' ? '音声入力' : lang === 'ko' ? '음성 입력' : lang === 'th' ? 'ป้อนเสียง' : lang === 'vi' ? 'Nhập giọng nói' : lang === 'ms' ? 'Input Suara' : 'Input Vox'}
          </button>


        </div>

        {/* 里程碑區域 */}
        <div style={{ marginBottom: '30px' }}>
          
          {milestones.length === 0 ? (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }}>
              {t.noMilestones}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {milestones.map((milestone, index) => (
                <div key={milestone.id} style={{
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    {/* 時間軸點 */}
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: '40px'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: milestone.completed ? getMilestoneTypeColor(milestone.type) : '#ddd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        {milestone.completed && (
                          <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
                        )}
                      </div>
                      
                      {index < milestones.length - 1 && (
                        <div style={{
                          width: '2px',
                          height: '40px',
                          background: '#ddd'
                        }} />
                      )}
                    </div>
                    
                    {/* 里程碑內容 */}
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            background: getMilestoneTypeColor(milestone.type),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {t.milestoneTypes[milestone.type as keyof typeof t.milestoneTypes]}
                          </span>
                          
                          <span style={{
                            color: '#999',
                            fontSize: '12px'
                          }}>
                            {formatDate(milestone.date)}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {/* 語音里程碑不顯示編輯按鈕，只顯示刪除按鈕 */}
                          {milestone.title !== '語音里程碑' && (
                            <button
                              onClick={() => handleEditMilestone(milestone)}
                              style={{
                                background: '#4CAF50',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '4px 8px',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              ✏️
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMilestone(milestone.id)}
                            style={{
                              background: '#F44336',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <h4 style={{ 
                        margin: '0 0 8px 0', 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: milestone.completed ? '#333' : '#666'
                      }}>
                        {milestone.title}
                      </h4>
                      
                      <p style={{ 
                        color: '#666', 
                        fontSize: '14px',
                        lineHeight: '1.5',
                        margin: 0,
                        marginBottom: '8px'
                      }}>
                        {milestone.description}
                      </p>
                      
                      {/* 語音里程碑播放區域 */}
                      {milestone.audioUrl && (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          marginTop: '8px'
                        }}>
                          <button
                            onClick={() => playVoiceMilestone(milestone)}
                            style={{
                              background: 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span style={{ fontSize: '14px' }}>▶️</span>
                            播放原音
                          </button>
                          
                          {milestone.duration && (
                            <span style={{
                              color: '#666',
                              fontSize: '12px',
                              background: '#f5f5f5',
                              padding: '4px 8px',
                              borderRadius: '6px'
                            }}>
                              錄音時長: {Math.floor(milestone.duration / 60)}:{(milestone.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 添加里程碑對話框 */}
      {showAddDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>{t.addMilestone}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                標題
              </label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
                placeholder="輸入里程碑標題"
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                描述
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
                placeholder="輸入里程碑描述"
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                類型
              </label>
              <select
                value={newMilestone.type}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              >
                <option value="start">{t.milestoneTypes.start}</option>
                <option value="achievement">{t.milestoneTypes.achievement}</option>
                <option value="growth">{t.milestoneTypes.growth}</option>
                <option value="habit">{t.milestoneTypes.habit}</option>
                <option value="help">{t.milestoneTypes.help}</option>
                <option value="goal">{t.milestoneTypes.goal}</option>
                <option value="social">{t.milestoneTypes.social}</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddDialog(false)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleAddMilestone}
                style={{
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 語音送出對話框 */}
      {showSubmitDialog && pendingAudio && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>語音里程碑</h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                錄音時長: {Math.floor(pendingAudio.duration / 60)}:{(pendingAudio.duration % 60).toString().padStart(2, '0')}
              </p>
              <audio 
                controls 
                style={{ width: '100%', marginBottom: '20px' }}
                src={URL.createObjectURL(pendingAudio.blob)}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelSubmit}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                取消
              </button>
              <button
                onClick={handleSubmitVoice}
                style={{
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                送出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 錄音確認對話框 */}
      {showRecordingConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '20px'
            }}>
              🎤
            </div>
            
            <h3 style={{ 
              marginBottom: '16px', 
              color: '#333',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              準備開始錄音
            </h3>
            
            <p style={{ 
              marginBottom: '20px', 
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              點擊「開始錄音」後，系統將開始錄製您的語音里程碑。<br/>
              <strong style={{ color: '#ff6b6b' }}>⚠️ 錄音時間限制為1分鐘</strong>
            </p>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleCancelRecording}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                取消
              </button>
              <button
                onClick={handleConfirmRecording}
                style={{
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                }}
              >
                開始錄音
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 編輯里程碑對話框 */}
      {editingMilestone && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '500px'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>{t.editMilestone}</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                標題
              </label>
              <input
                type="text"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                描述
              </label>
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  minHeight: '100px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                類型
              </label>
              <select
                value={newMilestone.type}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, type: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px'
                }}
              >
                <option value="start">{t.milestoneTypes.start}</option>
                <option value="achievement">{t.milestoneTypes.achievement}</option>
                <option value="growth">{t.milestoneTypes.growth}</option>
                <option value="habit">{t.milestoneTypes.habit}</option>
                <option value="help">{t.milestoneTypes.help}</option>
                <option value="goal">{t.milestoneTypes.goal}</option>
                <option value="social">{t.milestoneTypes.social}</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingMilestone(null)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveEdit}
                style={{
                  background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {t.save}
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

      {/* 升級彈窗 */}
      {showUpgradeModal && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName="語音錄製功能"
        />
      )}
      
      {/* 社會融入度評估對話框 */}
      {showSocialIntegrationDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>
              {t.socialIntegrationTitle}
            </h3>
            
            <p style={{ 
              marginBottom: '24px', 
              color: '#666', 
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              {t.socialIntegrationDesc}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* 問題1 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
                  {t.socialIntegrationQuestions.q1}
                </label>
                <select
                  value={socialIntegrationAnswers.q1}
                  onChange={(e) => setSocialIntegrationAnswers(prev => ({ ...prev, q1: e.target.value }))}
        style={{
          width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="">請選擇...</option>
                  <option value="excellent">{t.socialIntegrationOptions.excellent}</option>
                  <option value="good">{t.socialIntegrationOptions.good}</option>
                  <option value="fair">{t.socialIntegrationOptions.fair}</option>
                  <option value="poor">{t.socialIntegrationOptions.poor}</option>
                </select>
              </div>
              
              {/* 問題2 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
                  {t.socialIntegrationQuestions.q2}
                </label>
                <select
                  value={socialIntegrationAnswers.q2}
                  onChange={(e) => setSocialIntegrationAnswers(prev => ({ ...prev, q2: e.target.value }))}
          style={{
            width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="">請選擇...</option>
                  <option value="excellent">{t.socialIntegrationOptions.excellent}</option>
                  <option value="good">{t.socialIntegrationOptions.good}</option>
                  <option value="fair">{t.socialIntegrationOptions.fair}</option>
                  <option value="poor">{t.socialIntegrationOptions.poor}</option>
                </select>
              </div>
              
              {/* 問題3 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
                  {t.socialIntegrationQuestions.q3}
                </label>
                <select
                  value={socialIntegrationAnswers.q3}
                  onChange={(e) => setSocialIntegrationAnswers(prev => ({ ...prev, q3: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="">請選擇...</option>
                  <option value="excellent">{t.socialIntegrationOptions.excellent}</option>
                  <option value="good">{t.socialIntegrationOptions.good}</option>
                  <option value="fair">{t.socialIntegrationOptions.fair}</option>
                  <option value="poor">{t.socialIntegrationOptions.poor}</option>
                </select>
              </div>
              
              {/* 問題4 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
                  {t.socialIntegrationQuestions.q4}
                </label>
                <select
                  value={socialIntegrationAnswers.q4}
                  onChange={(e) => setSocialIntegrationAnswers(prev => ({ ...prev, q4: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="">請選擇...</option>
                  <option value="excellent">{t.socialIntegrationOptions.excellent}</option>
                  <option value="good">{t.socialIntegrationOptions.good}</option>
                  <option value="fair">{t.socialIntegrationOptions.fair}</option>
                  <option value="poor">{t.socialIntegrationOptions.poor}</option>
                </select>
              </div>
              
              {/* 問題5 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>
                  {t.socialIntegrationQuestions.q5}
                </label>
                <select
                  value={socialIntegrationAnswers.q5}
                  onChange={(e) => setSocialIntegrationAnswers(prev => ({ ...prev, q5: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="">請選擇...</option>
                  <option value="excellent">{t.socialIntegrationOptions.excellent}</option>
                  <option value="good">{t.socialIntegrationOptions.good}</option>
                  <option value="fair">{t.socialIntegrationOptions.fair}</option>
                  <option value="poor">{t.socialIntegrationOptions.poor}</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
              <button
                onClick={() => setShowSocialIntegrationDialog(false)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSocialIntegrationSubmit}
                disabled={!Object.values(socialIntegrationAnswers).every(answer => answer !== '')}
                style={{
                  background: Object.values(socialIntegrationAnswers).every(answer => answer !== '') 
                    ? 'linear-gradient(45deg, #6B5BFF, #5A4FCF)' 
                    : '#ccc',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: Object.values(socialIntegrationAnswers).every(answer => answer !== '') ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                提交評估
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 社會融入度評估詳細報告對話框 */}
      {showSocialIntegrationReport && socialIntegrationReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '20px', color: '#333', textAlign: 'center' }}>
              📊 社會融入度評估報告
            </h3>
            
            {/* 總體評分 */}
            <div style={{ 
              background: 'linear-gradient(135deg, #6B5BFF 0%, #5A4FCF 100%)',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                {socialIntegrationReport.result}
              </div>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>
                總分：{socialIntegrationReport.score.toFixed(1)}/5.0
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                {socialIntegrationReport.description}
              </div>
            </div>
            
            {/* 詳細分析 */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', fontWeight: '600' }}>
                📋 詳細分析
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ color: '#666' }}>人際關係</span>
                  <span style={{ fontWeight: '600', color: '#6B5BFF' }}>
                    {socialIntegrationReport.details.relationships === 'excellent' ? '優秀' :
                     socialIntegrationReport.details.relationships === 'good' ? '良好' :
                     socialIntegrationReport.details.relationships === 'fair' ? '一般' : '需要改善'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ color: '#666' }}>就業狀況</span>
                  <span style={{ fontWeight: '600', color: '#6B5BFF' }}>
                    {socialIntegrationReport.details.employment === 'excellent' ? '優秀' :
                     socialIntegrationReport.details.employment === 'good' ? '良好' :
                     socialIntegrationReport.details.employment === 'fair' ? '一般' : '需要改善'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ color: '#666' }}>家庭關係</span>
                  <span style={{ fontWeight: '600', color: '#6B5BFF' }}>
                    {socialIntegrationReport.details.family === 'excellent' ? '優秀' :
                     socialIntegrationReport.details.family === 'good' ? '良好' :
                     socialIntegrationReport.details.family === 'fair' ? '一般' : '需要改善'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ color: '#666' }}>未來信心</span>
                  <span style={{ fontWeight: '600', color: '#6B5BFF' }}>
                    {socialIntegrationReport.details.confidence === 'excellent' ? '優秀' :
                     socialIntegrationReport.details.confidence === 'good' ? '良好' :
                     socialIntegrationReport.details.confidence === 'fair' ? '一般' : '需要改善'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: '#f8f9fa', borderRadius: '6px' }}>
                  <span style={{ color: '#666' }}>社會接納</span>
                  <span style={{ fontWeight: '600', color: '#6B5BFF' }}>
                    {socialIntegrationReport.details.acceptance === 'excellent' ? '優秀' :
                     socialIntegrationReport.details.acceptance === 'good' ? '良好' :
                     socialIntegrationReport.details.acceptance === 'fair' ? '一般' : '需要改善'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 改善建議 */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#333', marginBottom: '12px', fontWeight: '600' }}>
                💡 改善建議
              </h4>
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '16px' }}>
                {socialIntegrationReport.recommendations.map((rec: string, index: number) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '8px', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    lineHeight: '1.4'
                  }}>
                    <span style={{ color: '#6B5BFF', fontWeight: 'bold' }}>•</span>
                    <span style={{ color: '#333' }}>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 專業輔導建議 */}
            <div style={{ 
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: 'white', marginBottom: '8px', fontWeight: '600' }}>
                🎯 專業輔導建議
              </h4>
              <p style={{ color: 'white', fontSize: '14px', lineHeight: '1.4', margin: 0 }}>
                基於您的評估結果，我們建議您考慮尋求專業輔導師的協助。專業輔導師可以為您提供個性化的改善計劃和持續的支持。
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowSocialIntegrationReport(false)}
                style={{
                  background: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                關閉報告
              </button>
              <button
                onClick={() => {
                  setShowSocialIntegrationReport(false);
                  // 這裡可以添加聯繫輔導師的功能
                  alert('功能開發中：聯繫專業輔導師');
                }}
                style={{
                  background: 'linear-gradient(45deg, #6B5BFF, #5A4FCF)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                聯繫輔導師
              </button>
        </div>
          </div>
        </div>
      )}
      

    </div>
  );
} 