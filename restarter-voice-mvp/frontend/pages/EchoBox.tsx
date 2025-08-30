import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import AudioRecorder from '../components/AudioRecorder';
import { usePermission } from '../hooks/usePermission';
import { TokenRenewalModal } from '../components/TokenRenewalModal';
import Footer from '../components/Footer';
import { useTestMode } from '../App';
import SharedHeader from '../components/SharedHeader';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../src/firebaseConfig';

const TEXTS = {
  'zh-TW': {
    title: '心聲釋放 Voice Release',
    subtitle: '無需放在心裡...對哪些人事物不滿你可盡情說出，天下沒有不能解決的難題',
    holdToRecord: '按住錄音',
    webSimulation: '(網頁版使用模擬錄音)',
    recording: '錄音中...',
    stopRecording: '停止錄音',
    todayMood: '今天的心情',
    reflectionMoment: '反思時刻',
    addDiary: '添加心聲',
    editDiary: '編輯心聲',
    deleteDiary: '刪除心聲',
    save: '保存',
    cancel: '取消',
    backToHome: '← 返回首頁',
    logout: '登出',
    noDiaries: '還沒有心聲日記，開始錄音吧！',
    startSpeaking: '開始說話',
    submit: '送出',
    submitVoice: '送出心聲',
    recordingComplete: '錄音完成',
    submitToSave: '點擊送出保存心聲',
    emotion: {
      happy: '開心',
      sad: '難過',
      angry: '生氣',
      neutral: '平靜',
      excited: '興奮',
      calm: '放鬆'
    }
  },
  'zh-CN': {
    title: '心声释放 Voice Release',
    subtitle: '无需放在心里...对哪些人事物不满你可尽情说出，天下没有不能解决的难题',
    holdToRecord: '按住录音',
    webSimulation: '(网页版使用模拟录音)',
    recording: '录音中...',
    stopRecording: '停止录音',
    todayMood: '今天的心情',
    reflectionMoment: '反思时刻',
    addDiary: '添加心声',
    editDiary: '编辑心声',
    deleteDiary: '删除心声',
    save: '保存',
    cancel: '取消',
    backToHome: '← 返回首页',
    logout: '登出',
    noDiaries: '还没有心声日记，开始录音吧！',
    startSpeaking: '开始说话',
    submit: '送出',
    submitVoice: '送出心声',
    recordingComplete: '录音完成',
    submitToSave: '点击送出保存心声',
    emotion: {
      happy: '开心',
      sad: '难过',
      angry: '生气',
      neutral: '平静',
      excited: '兴奋',
      calm: '放松'
    }
  },
  'ja': {
    title: '心の声を解放 Voice Release',
    subtitle: '心に留めておく必要はない...どの人や物事への不満も自由に言い、解決できない問題はない',
    holdToRecord: '録音を押し続ける',
    webSimulation: '(Web版は模擬録音を使用)',
    recording: '録音中...',
    stopRecording: '録音停止',
    todayMood: '今日の気分',
    reflectionMoment: '反省の瞬間',
    addDiary: '心の声を追加',
    editDiary: '心の声を編集',
    deleteDiary: '心の声を削除',
    save: '保存',
    cancel: 'キャンセル',
    backToHome: '← ホームに戻る',
    logout: 'ログアウト',
    noDiaries: 'まだ心の声の日記がありません。録音を始めましょう！',
    startSpeaking: '話し始める',
    submit: '送信',
    submitVoice: '心の声を送信',
    recordingComplete: '録音完了',
    submitToSave: '送信して心の声を保存',
    emotion: {
      happy: '嬉しい',
      sad: '悲しい',
      angry: '怒り',
      neutral: '平静',
      excited: '興奮',
      calm: 'リラックス'
    }
  },
  'ko': {
    title: '마음의 소리 해방 Voice Release',
    subtitle: '마음속에 담아둘 필요 없이...어떤 사람이나 사물에 대한 불만을 자유롭게 말하고, 해결할 수 없는 문제는 없다',
    holdToRecord: '녹음하려면 길게 누르세요',
    webSimulation: '(웹 버전은 시뮬레이션 녹음 사용)',
    recording: '녹음 중...',
    stopRecording: '녹음 중지',
    todayMood: '오늘의 기분',
    reflectionMoment: '성찰의 순간',
    addDiary: '마음의 소리 추가',
    editDiary: '마음의 소리 편집',
    deleteDiary: '마음의 소리 삭제',
    save: '저장',
    cancel: '취소',
    backToHome: '← 홈으로 돌아가기',
    logout: '로그아웃',
    noDiaries: '아직 마음의 소리 일기가 없습니다. 녹음을 시작해보세요!',
    startSpeaking: '말하기 시작',
    submit: '제출',
    submitVoice: '마음의 소리 제출',
    recordingComplete: '녹음 완료',
    submitToSave: '제출하여 마음의 소리 저장',
    emotion: {
      happy: '행복',
      sad: '슬픔',
      angry: '분노',
      neutral: '평온',
      excited: '흥분',
      calm: '차분'
    }
  },
  'th': {
    title: 'ปลดปล่อยเสียงในใจ Voice Release',
    subtitle: 'ไม่จำเป็นต้องเก็บไว้ในใจ...คุณสามารถพูดความไม่พอใจต่อคนหรือสิ่งต่างๆ ได้อย่างอิสระ ไม่มีปัญหาที่แก้ไขไม่ได้',
    holdToRecord: 'กดค้างเพื่อบันทึก',
    webSimulation: '(เวอร์ชันเว็บใช้การบันทึกจำลอง)',
    recording: 'กำลังบันทึก...',
    stopRecording: 'หยุดบันทึก',
    todayMood: 'อารมณ์วันนี้',
    reflectionMoment: 'ช่วงเวลาสะท้อนคิด',
    addDiary: 'เพิ่มเสียงในใจ',
    editDiary: 'แก้ไขเสียงในใจ',
    deleteDiary: 'ลบเสียงในใจ',
    save: 'บันทึก',
    cancel: 'ยกเลิก',
    backToHome: '← กลับหน้าหลัก',
    logout: 'ออกจากระบบ',
    noDiaries: 'ยังไม่มีไดอารี่เสียงในใจ เริ่มบันทึกกันเลย!',
    startSpeaking: 'เริ่มพูด',
    submit: 'ส่ง',
    submitVoice: 'ส่งเสียงในใจ',
    recordingComplete: 'บันทึกเสร็จสิ้น',
    submitToSave: 'คลิกส่งเพื่อบันทึกเสียงในใจ',
    emotion: {
      happy: 'มีความสุข',
      sad: 'เศร้า',
      angry: 'โกรธ',
      neutral: 'สงบ',
      excited: 'ตื่นเต้น',
      calm: 'ผ่อนคลาย'
    }
  },
  'vi': {
    title: 'Giải Phóng Tiếng Lòng Voice Release',
    subtitle: 'Không cần giữ trong lòng...bạn có thể tự do nói ra sự bất mãn với những người hoặc sự việc nào đó, không có vấn đề nào không thể giải quyết',
    holdToRecord: 'Giữ để ghi âm',
    webSimulation: '(Phiên bản web sử dụng ghi âm mô phỏng)',
    recording: 'Đang ghi âm...',
    stopRecording: 'Dừng ghi âm',
    todayMood: 'Tâm trạng hôm nay',
    reflectionMoment: 'Khoảnh khắc suy ngẫm',
    addDiary: 'Thêm tiếng lòng',
    editDiary: 'Chỉnh sửa tiếng lòng',
    deleteDiary: 'Xóa tiếng lòng',
    save: 'Lưu',
    cancel: 'Hủy',
    backToHome: '← Về trang chủ',
    logout: 'Đăng xuất',
    noDiaries: 'Chưa có nhật ký tiếng lòng, hãy bắt đầu ghi âm!',
    startSpeaking: 'Bắt đầu nói',
    submit: 'Gửi',
    submitVoice: 'Gửi tiếng lòng',
    recordingComplete: 'Ghi âm hoàn thành',
    submitToSave: 'Nhấp để gửi và lưu tiếng lòng',
    emotion: {
      happy: 'Vui vẻ',
      sad: 'Buồn',
      angry: 'Tức giận',
      neutral: 'Bình tĩnh',
      excited: 'Hưng phấn',
      calm: 'Thư giãn'
    }
  },
  'ms': {
    title: 'Pelepasan Suara Hati Voice Release',
    subtitle: 'Tidak perlu disimpan dalam hati...anda boleh bebas mengucapkan ketidakpuasan terhadap orang atau perkara tertentu, tiada masalah yang tidak dapat diselesaikan',
    holdToRecord: 'Tahan untuk Rakam',
    webSimulation: '(Versi web menggunakan rakaman simulasi)',
    recording: 'Merakam...',
    stopRecording: 'Hentikan Rakaman',
    todayMood: 'Mood Hari Ini',
    reflectionMoment: 'Saat Refleksi',
    addDiary: 'Tambah Suara Hati',
    editDiary: 'Sunting Suara Hati',
    deleteDiary: 'Padam Suara Hati',
    save: 'Simpan',
    cancel: 'Batal',
    backToHome: '← Kembali ke Rumah',
    logout: 'Log Keluar',
    noDiaries: 'Belum ada diari suara hati, mulakan rakaman!',
    startSpeaking: 'Mula Bercakap',
    submit: 'Hantar',
    submitVoice: 'Hantar Suara Hati',
    recordingComplete: 'Rakaman Selesai',
    submitToSave: 'Klik untuk hantar dan simpan suara hati',
    emotion: {
      happy: 'Gembira',
      sad: 'Sedih',
      angry: 'Marah',
      neutral: 'Tenang',
      excited: 'Teruja',
      calm: 'Selesa'
    }
  },
  'la': {
    title: 'Vox Liberatio Voice Release',
    subtitle: 'Non necesse est in corde servare...liberam dissatisfactionem cum hominibus vel rebus quibusdam profer, nulla quaestio insolubilis est',
    holdToRecord: 'Tene ad Recordandum',
    webSimulation: '(Versio interretialis simulatione utitur)',
    recording: 'Recordans...',
    stopRecording: 'Recordationem Cessa',
    todayMood: 'Affectus Hodiernus',
    reflectionMoment: 'Momentum Cogitationis',
    addDiary: 'Vox Adde',
    editDiary: 'Vox Edita',
    deleteDiary: 'Vox Dele',
    save: 'Serva',
    cancel: 'Cancella',
    backToHome: '← Ad Domum Reverte',
    logout: 'Exi',
    noDiaries: 'Nondum diaria vocis cordis, incipiamus recordare!',
    startSpeaking: 'Incipe Loqui',
    submit: 'Submitte',
    submitVoice: 'Vox Submitte',
    recordingComplete: 'Recordatio Perfecta',
    submitToSave: 'Click ut submitte et serva vocem',
    emotion: {
      happy: 'Laetus',
      sad: 'Tristis',
      angry: 'Iratus',
      neutral: 'Tranquillus',
      excited: 'Excitatus',
      calm: 'Placidus'
    }
  },
  'en': {
    title: 'Voice Release',
    subtitle: 'No need to keep it in your heart...you can freely speak out your dissatisfaction with which people or things, there is no problem that cannot be solved',
    holdToRecord: 'Hold to Record',
    webSimulation: '(Web version uses simulated recording)',
    recording: 'Recording...',
    stopRecording: 'Stop Recording',
    todayMood: "Today's Mood",
    reflectionMoment: 'Reflection Moment',
    addDiary: 'Add Voice',
    editDiary: 'Edit Voice',
    deleteDiary: 'Delete Voice',
    save: 'Save',
    cancel: 'Cancel',
    backToHome: '← Back to Home',
    logout: 'Logout',
    noDiaries: 'No heart voice diaries yet, start recording!',
    startSpeaking: 'Start Speaking',
    submit: 'Submit',
    submitVoice: 'Submit Voice',
    recordingComplete: 'Recording Complete',
    submitToSave: 'Click to submit and save voice',
    emotion: {
      happy: 'Happy',
      sad: 'Sad',
      angry: 'Angry',
      neutral: 'Neutral',
      excited: 'Excited',
      calm: 'Calm'
    }
  }
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

interface VoiceDiary {
  id: number;
  title: string;
  content: string;
  date: string;
  emotion: string;
  duration?: number;
  expanded?: boolean;
  audioUrl?: string; // 新增：儲存音頻URL
}

export default function EchoBox() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = TEXTS[lang] || TEXTS['zh-TW'];
  
  // 新增：用戶狀態和頁頭相關狀態
  const [user, setUser] = useState<User | null>(null);
  const [showLangBox, setShowLangBox] = useState(false);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const langBoxRef = useRef<HTMLDivElement>(null);
  const legalMenuRef = useRef<HTMLDivElement>(null);
  
  // 簡化的錄音狀態管理
  const [isListening, setIsListening] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const [diaries, setDiaries] = useState<VoiceDiary[]>(() => {
    // 從localStorage讀取保存的日記
    const savedDiaries = localStorage.getItem('voiceDiaries');
    if (savedDiaries) {
      return JSON.parse(savedDiaries);
    }
    // 預設日記
    return [
      {
        id: 1,
        title: '今天的心情',
        content: '今天感覺很棒，完成了所有計劃的任務。',
        date: new Date().toISOString(),
        emotion: 'happy',
        expanded: false
      },
      {
        id: 2,
        title: '反思時刻',
        content: '需要學會更好地管理時間，提高效率。',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        emotion: 'neutral',
        expanded: false
      }
    ];
  });
  
  const [isRecording, setIsRecording] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDiary, setEditingDiary] = useState<VoiceDiary | null>(null);
  const [newDiary, setNewDiary] = useState({
    title: '',
    content: '',
    emotion: 'neutral'
  });
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);
  const [pendingAudio, setPendingAudio] = useState<{ blob: Blob; duration: number } | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showRecordingConfirm, setShowRecordingConfirm] = useState(false);

  // 新增：權限檢查
  const { checkPermission, recordUsage } = usePermission();
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [permissionResult, setPermissionResult] = useState<any>(null);
  const [playingDiaryId, setPlayingDiaryId] = useState<number | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { isTestMode } = useTestMode();
  
  // 刪除確認跳窗狀態
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

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

  // 簡化的錄音控制函數
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
      if (isTestMode) {
        // 測試模式下直接顯示確認對話框，跳過權限檢查
        setShowRecordingConfirm(true);
        return;
      }
      if (permission.canRenew) {
        setPermissionResult(permission);
        setShowRenewalModal(true);
      } else {
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

  const handleAudio = (audioBlob: Blob, duration: number) => {
    // 創建音頻URL
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // 模擬語音轉文字
    const mockTexts = [
      '今天心情很好，完成了所有工作。',
      '遇到了一些挑戰，但都克服了。',
      '學會了新的技能，感覺很有成就感。',
      '和朋友聊天很開心，分享了很多想法。',
      '反思今天的行為，發現還有改進空間。'
    ];
    
    const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
    const randomEmotion = ['happy', 'neutral', 'calm'][Math.floor(Math.random() * 3)];
    
    const diary: VoiceDiary = {
      id: Date.now(),
      title: '心聲日記',
      content: randomText,
      date: new Date().toISOString(),
      emotion: randomEmotion,
      expanded: false,
      audioUrl: audioUrl, // 儲存音頻URL
      duration: duration // 儲存錄音時長
    };
    
    const updatedDiaries = [diary, ...diaries];
    setDiaries(updatedDiaries);
    saveDiariesToStorage(updatedDiaries);
    setIsRecording(false);
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

  // 保存日記到localStorage
  const saveDiariesToStorage = (newDiaries: VoiceDiary[]) => {
    localStorage.setItem('voiceDiaries', JSON.stringify(newDiaries));
  };

  const handleCancelSubmit = () => {
    setPendingAudio(null);
    setShowSubmitDialog(false);
  };

  const handleAddDiary = () => {
    if (newDiary.title.trim() && newDiary.content.trim()) {
      const diary: VoiceDiary = {
        id: Date.now(),
        title: newDiary.title,
        content: newDiary.content,
        date: new Date().toISOString(),
        emotion: newDiary.emotion,
        expanded: false,
        duration: 0 // 手動添加的日記沒有錄音時長
      };
      
      const updatedDiaries = [diary, ...diaries];
      setDiaries(updatedDiaries);
      saveDiariesToStorage(updatedDiaries);
      setNewDiary({ title: '', content: '', emotion: 'neutral' });
      setShowAddDialog(false);
    }
  };

  const handleEditDiary = (diary: VoiceDiary) => {
    setEditingDiary(diary);
    setNewDiary({
      title: diary.title,
      content: diary.content,
      emotion: diary.emotion
    });
  };

  const handleSaveEdit = () => {
    if (editingDiary && newDiary.title.trim() && newDiary.content.trim()) {
      const updatedDiaries = diaries.map(d => 
        d.id === editingDiary.id 
          ? { ...d, title: newDiary.title, content: newDiary.content, emotion: newDiary.emotion }
          : d
      );
      setDiaries(updatedDiaries);
      saveDiariesToStorage(updatedDiaries);
      setEditingDiary(null);
      setNewDiary({ title: '', content: '', emotion: 'neutral' });
    }
  };

  const handleDeleteDiary = (id: number) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      const updatedDiaries = diaries.filter(d => d.id !== deleteTargetId);
      setDiaries(updatedDiaries);
      saveDiariesToStorage(updatedDiaries);
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const toggleExpand = (id: number) => {
    const updatedDiaries = diaries.map(d => 
      d.id === id ? { ...d, expanded: !d.expanded } : { ...d, expanded: false }
    );
    setDiaries(updatedDiaries);
    saveDiariesToStorage(updatedDiaries);
  };

  const playVoiceDiary = (diary: VoiceDiary) => {
    // 如果正在播放同一個日記，則停止播放
    if (playingDiaryId === diary.id) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      // 停止 TTS
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setPlayingDiaryId(null);
      setCurrentAudio(null);
      return;
    }

    // 如果正在播放其他日記，先停止
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    // 停止 TTS
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (diary.audioUrl) {
      // 播放真正的原音
      const audio = new Audio(diary.audioUrl);
      
      audio.onended = () => {
        setPlayingDiaryId(null);
        setCurrentAudio(null);
      };
      
      audio.onerror = (error) => {
        console.error('音頻加載失敗:', error);
        setPlayingDiaryId(null);
        setCurrentAudio(null);
        // 如果原音播放失敗，使用文字轉語音作為備用
        playTextToSpeech(diary.content);
      };
      
      audio.play().then(() => {
        console.log('正在播放原音...');
        setPlayingDiaryId(diary.id);
        setCurrentAudio(audio);
      }).catch((error) => {
        console.error('播放失敗:', error);
        setPlayingDiaryId(null);
        setCurrentAudio(null);
        // 如果播放失敗，使用文字轉語音作為備用
        playTextToSpeech(diary.content);
      });
    } else {
      // 如果沒有原音，使用文字轉語音作為備用
      setPlayingDiaryId(diary.id);
      playTextToSpeech(diary.content);
    }
  };

  const playTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // 如果正在播放，先停止
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setPlayingDiaryId(null);
        setCurrentAudio(null);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setPlayingDiaryId(null);
        setCurrentAudio(null);
      };
      
      utterance.onerror = () => {
        setPlayingDiaryId(null);
        setCurrentAudio(null);
      };
      
      window.speechSynthesis.speak(utterance);
      
      console.log('正在播放心聲日記內容（文字轉語音）...');
    } else {
      alert('瀏覽器不支援語音播放功能');
      setPlayingDiaryId(null);
      setCurrentAudio(null);
    }
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: '#4CAF50',
      sad: '#2196F3',
      angry: '#F44336',
      neutral: '#9E9E9E',
      excited: '#FF9800',
      calm: '#8BC34A'
    };
    return colors[emotion] || '#9E9E9E';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 清理函數
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  const handleRenewalModalClose = () => {
    setShowRenewalModal(false);
    setPermissionResult(null);
  };

  return (
    <>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: window.innerWidth <= 768 ? '0' : '20px'
      }}>
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-3px); }
              60% { transform: translateY(-2px); }
            }
            @media (max-width: 767px) {
              .mobile-shared-header {
                display: block !important;
              }
              .desktop-header {
                display: none !important;
              }
            }
            @media (min-width: 768px) {
              .mobile-shared-header {
                display: none !important;
              }
              .desktop-header {
                display: flex !important;
              }
            }
          `}
        </style>
        
        {/* 手機版共用頁頭 */}
        <div className="mobile-shared-header" style={{ display: 'none' }}>
          <SharedHeader />
        </div>
        
        {/* 桌面版頂部導航 - 只在桌面版顯示 */}
        {window.innerWidth > 768 && (
        <>
          {/* 左上角LOGO */}
          <div className="fixed-logo-box" style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" className="fixed-logo-img" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
          </div>
          
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
        </>
        )}
        
        {/* LOGO已刪除 */}

        {/* 主要內容 */}
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          marginTop: window.innerWidth <= 768 ? '100px' : '120px',
          padding: window.innerWidth <= 768 ? '20px' : '0'
        }}>
          {/* 主標題 */}
          <div style={{
            textAlign: 'center',
            marginBottom: '30px',
            color: 'white'
          }}>
            <h1 style={{
              fontSize: window.innerWidth <= 768 ? '28px' : '36px',
              fontWeight: '900',
              margin: '0',
              textShadow: '0 2px 12px #232946, 0 4px 24px #0008'
            }}>
              🎤 {t.title}
            </h1>
            {/* 副標題 */}
            <p style={{
              fontSize: window.innerWidth <= 768 ? '14px' : '16px',
              fontWeight: '400',
              margin: '12px 0 0 0',
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 1px 4px #232946',
              lineHeight: '1.4'
            }}>
              說出你的心聲，留給未來的自己一份溫柔。
            </p>
          </div>
          
          {/* 錄音區域 */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(64, 64, 64, 0.9), rgba(32, 32, 32, 0.8))',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            marginBottom: '30px',
            boxShadow: '0 8px 32px rgba(128, 128, 128, 0.3)',
            maxWidth: window.innerWidth <= 768 ? '90%' : '60%',
            margin: '0 auto 30px auto',
            border: '1px solid rgba(192, 192, 192, 0.3)'
          }}>

            
            {/* 🎤 圖標移到上面 */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <button
                  onClick={handleRecordingClick}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: isListening ? 'linear-gradient(45deg, #ff5722, #ff9800)' : 'linear-gradient(45deg, #ff9800, #ff5722)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isListening ? '0 0 0 4px #ffe0b2, 0 0 20px rgba(255, 87, 34, 0.5)' : '0 4px 16px rgba(255, 152, 0, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isListening) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isListening) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <span style={{ 
                    fontSize: '32px',
                    color: 'white',
                    filter: isListening ? 'drop-shadow(0 0 6px #ff9800)' : ''
                  }}>
                    {isListening ? '⏹️' : '🎤'}
                  </span>
                </button>
              </div>
              <div style={{ 
                color: isListening ? '#ff5722' : '#ff9800', 
                fontSize: '16px',
                fontWeight: '700',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                {isListening ? t.stopRecording : t.startSpeaking}
              </div>
              {isListening && (
                <div style={{ 
                  color: '#ff5722', 
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}>
                  錄音中... {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
            
            {/* 隱藏原來的AudioRecorder，使用新的🎤按鈕 */}
            {/* <div style={{ marginBottom: '20px' }}>
              <AudioRecorder onAudio={handleAudio} lang={lang} />
            </div> */}
            
            <p style={{ 
              color: '#666', 
              fontSize: '14px',
              marginBottom: '20px'
            }}>
              {t.holdToRecord}
            </p>
            
            <button
              onClick={() => setShowAddDialog(true)}
              style={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                marginTop: '20px'
              }}
            >
              + {lang === 'zh-TW' ? '添加文字心聲' : 
                  lang === 'zh-CN' ? '添加文字心声' : 
                  lang === 'en' ? 'Add Text Voice' : 
                  lang === 'ja' ? 'テキスト心の声を追加' : 
                  lang === 'ko' ? '텍스트 마음의 소리 추가' : 
                  lang === 'th' ? 'เพิ่มเสียงในใจแบบข้อความ' : 
                  lang === 'vi' ? 'Thêm Tiếng Lòng Văn Bản' : 
                  lang === 'ms' ? 'Tambah Suara Hati Teks' : 
                  'Adde Vox Textus'}
            </button>
          </div>

          {/* 心聲日記列表 */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ 
              color: 'white', 
              fontSize: '20px', 
              marginBottom: '20px',
              fontWeight: '600'
            }}>
              {lang === 'zh-TW' ? '心聲日記' : 
               lang === 'zh-CN' ? '心声日记' : 
               lang === 'en' ? 'Voice Diary' : 
               lang === 'ja' ? '心の声日記' : 
               lang === 'ko' ? '마음의 소리 일기' : 
               lang === 'th' ? 'ไดอารี่เสียงในใจ' : 
               lang === 'vi' ? 'Nhật Ký Tiếng Lòng' : 
               lang === 'ms' ? 'Diari Suara Hati' : 
               'Diarium Vocis'} ({diaries.length})
            </h3>
            
            {diaries.length === 0 ? (
              <div style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '16px',
                padding: '40px',
                textAlign: 'center',
                color: '#666'
              }}>
                {t.noDiaries}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {diaries.map((diary) => (
                  <div key={diary.id} style={{
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          
                          <button
                            onClick={() => toggleExpand(diary.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#333',
                              textAlign: 'left',
                              flex: 1
                            }}
                          >
                            {diary.title}
                          </button>
                          
                          <button
                            onClick={() => playVoiceDiary(diary)}
                            style={{
                              background: playingDiaryId === diary.id 
                                ? 'linear-gradient(45deg, #ff5722, #ff9800)' 
                                : 'linear-gradient(45deg, #4CAF50, #45a049)',
                              border: 'none',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <span style={{ fontSize: '16px', color: 'white' }}>
                              {playingDiaryId === diary.id ? '⏹️' : '▶️'}
                            </span>
                          </button>
                          
                          <span style={{
                            background: getEmotionColor(diary.emotion),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {t.emotion[diary.emotion as keyof typeof t.emotion]}
                          </span>
                        </div>
                        
                        {/* 展開的內容 */}
                        {diary.expanded && (
                          <div style={{ 
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(0,0,0,0.05)',
                            borderRadius: '8px'
                          }}>
                            <p style={{ 
                              color: '#666', 
                              fontSize: '14px',
                              lineHeight: '1.5',
                              marginBottom: '8px'
                            }}>
                              {diary.content}
                            </p>
                            
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              marginTop: '8px'
                            }}>
                              <p style={{ 
                                color: '#999', 
                                fontSize: '12px'
                              }}>
                                {formatDate(diary.date)}
                              </p>
                              {diary.duration && (
                                <span style={{ 
                                  color: '#667eea', 
                                  fontSize: '12px',
                                  fontWeight: '500',
                                  background: 'rgba(102, 126, 234, 0.1)',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}>
                                  ⏱️ {Math.floor(diary.duration / 60)}:{(diary.duration % 60).toString().padStart(2, '0')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditDiary(diary)}
                          style={{
                            background: '#4CAF50',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✏️ {t.editDiary}
                        </button>
                        <button
                          onClick={() => handleDeleteDiary(diary.id)}
                          style={{
                            background: '#F44336',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          🗑️ {t.deleteDiary}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* 添加日記對話框 */}
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
              <h3 style={{ marginBottom: '20px', color: '#333' }}>{t.addDiary}</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                  {lang === 'zh-TW' ? '標題' : 
                   lang === 'zh-CN' ? '标题' : 
                   lang === 'en' ? 'Title' : 
                   lang === 'ja' ? 'タイトル' : 
                   lang === 'ko' ? '제목' : 
                   lang === 'th' ? 'หัวข้อ' : 
                   lang === 'vi' ? 'Tiêu đề' : 
                   lang === 'ms' ? 'Tajuk' : 
                   'Titulus'}
                </label>
                <input
                  type="text"
                  value={newDiary.title}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, title: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                  placeholder={lang === 'zh-TW' ? '輸入日記標題 (30字內)' : 
                              lang === 'zh-CN' ? '输入日记标题 (30字内)' : 
                              lang === 'en' ? 'Enter diary title (30 chars max)' : 
                              lang === 'ja' ? '日記のタイトルを入力 (30文字以内)' : 
                              lang === 'ko' ? '일기 제목 입력 (30자 이내)' : 
                              lang === 'th' ? 'ใส่หัวข้อไดอารี่ (ไม่เกิน 30 ตัวอักษร)' : 
                              lang === 'vi' ? 'Nhập tiêu đề nhật ký (tối đa 30 ký tự)' : 
                              lang === 'ms' ? 'Masukkan tajuk diari (maksimum 30 aksara)' : 
                              'Intra titulum diarii (max 30 litterae)'}
                />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                  {lang === 'zh-TW' ? '內容' : 
                   lang === 'zh-CN' ? '内容' : 
                   lang === 'en' ? 'Content' : 
                   lang === 'ja' ? '内容' : 
                   lang === 'ko' ? '내용' : 
                   lang === 'th' ? 'เนื้อหา' : 
                   lang === 'vi' ? 'Nội dung' : 
                   lang === 'ms' ? 'Kandungan' : 
                   'Contentus'}
                </label>
                <textarea
                  value={newDiary.content}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, content: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder={lang === 'zh-TW' ? '輸入日記內容 (200字內)' : 
                              lang === 'zh-CN' ? '输入日记内容 (200字内)' : 
                              lang === 'en' ? 'Enter diary content (200 chars max)' : 
                              lang === 'ja' ? '日記の内容を入力 (200文字以内)' : 
                              lang === 'ko' ? '일기 내용 입력 (200자 이내)' : 
                              lang === 'th' ? 'ใส่เนื้อหาไดอารี่ (ไม่เกิน 200 ตัวอักษร)' : 
                              lang === 'vi' ? 'Nhập nội dung nhật ký (tối đa 200 ký tự)' : 
                              lang === 'ms' ? 'Masukkan kandungan diari (maksimum 200 aksara)' : 
                              'Intra contentum diarii (max 200 litterae)'}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                  {lang === 'zh-TW' ? '情緒' : 
                   lang === 'zh-CN' ? '情绪' : 
                   lang === 'en' ? 'Emotion' : 
                   lang === 'ja' ? '感情' : 
                   lang === 'ko' ? '감정' : 
                   lang === 'th' ? 'อารมณ์' : 
                   lang === 'vi' ? 'Cảm xúc' : 
                   lang === 'ms' ? 'Emosi' : 
                   'Affectus'}
                </label>
                <select
                  value={newDiary.emotion}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, emotion: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="happy">{t.emotion.happy}</option>
                  <option value="sad">{t.emotion.sad}</option>
                  <option value="angry">{t.emotion.angry}</option>
                  <option value="neutral">{t.emotion.neutral}</option>
                  <option value="excited">{t.emotion.excited}</option>
                  <option value="calm">{t.emotion.calm}</option>
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
                  onClick={handleAddDiary}
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
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

        {/* 編輯日記對話框 */}
        {editingDiary && (
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
              <h3 style={{ marginBottom: '20px', color: '#333' }}>{t.editDiary}</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>
                  {lang === 'zh-TW' ? '標題' : 
                   lang === 'zh-CN' ? '标题' : 
                   lang === 'en' ? 'Title' : 
                   lang === 'ja' ? 'タイトル' : 
                   lang === 'ko' ? '제목' : 
                   lang === 'th' ? 'หัวข้อ' : 
                   lang === 'vi' ? 'Tiêu đề' : 
                   lang === 'ms' ? 'Tajuk' : 
                   'Titulus'}
                </label>
                <input
                  type="text"
                  value={newDiary.title}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, title: e.target.value }))}
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
                  {lang === 'zh-TW' ? '內容' : 
                   lang === 'zh-CN' ? '内容' : 
                   lang === 'en' ? 'Content' : 
                   lang === 'ja' ? '内容' : 
                   lang === 'ko' ? '내용' : 
                   lang === 'th' ? 'เนื้อหา' : 
                   lang === 'vi' ? 'Nội dung' : 
                   lang === 'ms' ? 'Kandungan' : 
                   'Contentus'}
                </label>
                <textarea
                  value={newDiary.content}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, content: e.target.value }))}
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
                  {lang === 'zh-TW' ? '情緒' : 
                   lang === 'zh-CN' ? '情绪' : 
                   lang === 'en' ? 'Emotion' : 
                   lang === 'ja' ? '感情' : 
                   lang === 'ko' ? '감정' : 
                   lang === 'th' ? 'อารมณ์' : 
                   lang === 'vi' ? 'Cảm xúc' : 
                   lang === 'ms' ? 'Emosi' : 
                   'Affectus'}
                </label>
                <select
                  value={newDiary.emotion}
                  onChange={(e) => setNewDiary(prev => ({ ...prev, emotion: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                >
                  <option value="happy">{t.emotion.happy}</option>
                  <option value="sad">{t.emotion.sad}</option>
                  <option value="angry">{t.emotion.angry}</option>
                  <option value="neutral">{t.emotion.neutral}</option>
                  <option value="excited">{t.emotion.excited}</option>
                  <option value="calm">{t.emotion.calm}</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setEditingDiary(null)}
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
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
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
                點擊「開始錄音」後，系統將開始錄製您的語音日記。<br/>
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
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  開始錄音
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 送出心聲對話框 */}
        {showSubmitDialog && pendingAudio && (() => {
          console.log('渲染送出對話框，pendingAudio:', pendingAudio);
          return true;
        })() && (
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
                marginBottom: '10px', 
                color: '#333',
                fontSize: '20px',
                fontWeight: '600'
              }}>
                {t.recordingComplete}
              </h3>
              
              <p style={{ 
                marginBottom: '20px', 
                color: '#666',
                fontSize: '16px'
              }}>
                {t.submitToSave}
              </p>
              
              <div style={{ 
                marginBottom: '20px',
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{ 
                  color: '#495057',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  錄音時長: {Math.floor(pendingAudio.duration / 60)}:{(pendingAudio.duration % 60).toString().padStart(2, '0')}
                </div>
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
                    fontWeight: '500'
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSubmitVoice}
                  style={{
                    background: 'linear-gradient(45deg, #667eea, #764ba2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}
                >
                  {t.submit}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 刪除確認跳窗 */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              padding: '40px',
              width: '90%',
              maxWidth: '450px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '2px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '20px',
                animation: 'pulse 2s infinite'
              }}>
                💔
              </div>
              
              <h3 style={{ 
                marginBottom: '15px', 
                color: 'white',
                fontSize: '22px',
                fontWeight: '600',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                這個心聲對您來說很重要嗎？
              </h3>
              
              <p style={{ 
                marginBottom: '30px', 
                color: 'rgba(255,255,255,0.9)',
                fontSize: '16px',
                lineHeight: '1.5',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}>
                刪除後將無法恢復，請確認是否真的要刪除？
              </p>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  onClick={cancelDelete}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  style={{
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 28px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 8px 20px rgba(255,107,107,0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(255,107,107,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,107,107,0.4)';
                  }}
                >
                  確定刪除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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
      

    </>
  );
} 