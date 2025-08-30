import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getAuth, signOut } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import SharedHeader from '../components/SharedHeader';
import { LanguageSelector } from '../components/LanguageSelector';
type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';

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
      backToHome: { 'zh-TW': '返回', 'zh-CN': '返回', 'ja': '戻る', 'en': 'Back', 'ko': '뒤로', 'th': 'กลับ', 'vi': 'Quay lại', 'ms': 'Kembali', 'la': 'Redire' },
  logout: { 'zh-TW': '登出', 'zh-CN': '登出', 'ja': 'ログアウト', 'en': 'Logout', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire' },
  pageTitle: { 'zh-TW': '心情解鎖盒', 'zh-CN': '心情解锁盒', 'ja': '気持ちアンロックボックス', 'en': 'Mood Unlock Box', 'ko': '감정 언락 박스', 'th': 'กล่องปลดล็อกอารมณ์', 'vi': 'Hộp Mở Khóa Cảm Xúc', 'ms': 'Kotak Buka Kunci Emosi', 'la': 'Arca Unlock Affectus' },
  subtitle: { 'zh-TW': '每天自我反思，抒發心情，一天一片追蹤情緒，照顧自己', 'zh-CN': '每天自我反思，抒發心情，一天一片追蹤情緒，照顧自己', 'ja': '毎日自分を見つめ、気持ちを表現し、感情を追いかけ、自分を大切に', 'en': 'Daily self-reflection, express your feelings, track emotions, take care of yourself', 'ko': '매일 자기 성찰, 감정 표현, 감정 추적, 자신을 돌보기', 'th': 'สะท้อนตนเองทุกวัน ระบายความรู้สึก ติดตามอารมณ์ ดูแลตัวเอง', 'vi': 'Tự phản ánh mỗi ngày, bày tỏ cảm xúc, theo dõi cảm xúc, chăm sóc bản thân', 'ms': 'Refleksi diri setiap hari, luahkan perasaan, jejak emosi, jaga diri', 'la': 'Cotidie te ipsum considera, affectus exprime, motus tuos persequere, te ipsum cura' },
  inputPrompt: { 'zh-TW': '今天，你想記錄什麼樣的心情？', 'zh-CN': '今天，你想记录什么样的心情？', 'ja': '今日、どんな気持ちを記録したいですか？', 'en': 'What kind of mood do you want to record today?', 'ko': '오늘 어떤 기분을 기록하고 싶으신가요?', 'th': 'วันนี้คุณอยากจะบันทึกอารมณ์แบบไหน?', 'vi': 'Hôm nay bạn muốn ghi lại tâm trạng gì?', 'ms': 'Apakah perasaan yang ingin anda catat hari ini?', 'la': 'Qualem animum hodie inscribere vis?' },
  inputPlaceholder: {
    'zh-TW': '請寫下你的心情...(30字內)',
    'zh-CN': '请写下你的心情...(30字内)',
    'en': 'Write your mood... (max 30 chars)',
    'ja': 'あなたの気持ちを書いてください...(30文字以内)',
    'ko': '당신의 기분을 적어주세요...(30자 이내)',
    'th': 'เขียนความรู้สึกของคุณ...(ไม่เกิน 30 ตัวอักษร)',
    'vi': 'Hãy viết tâm trạng của bạn...(tối đa 30 ký tự)',
    'ms': 'Tulis perasaan anda...(maksimum 30 aksara)',
    'la': 'Animum tuum scribe...(max 30 litterae)'
  },
      plantButton: { 'zh-TW': '記錄此刻心情', 'zh-CN': '记录此刻心情', 'ja': '今の気持ちを記録する', 'en': 'Record Today\'s Mood', 'ko': '오늘의 기분 기록', 'th': 'บันทึกอารมณ์วันนี้', 'vi': 'Ghi lại tâm trạng hôm nay', 'ms': 'Catat Perasaan Hari Ini', 'la': 'Inscribere hodiernum animum' },
      gardenAreaTitle: { 'zh-TW': '我的拼圖', 'zh-CN': '我的拼图', 'ja': '私のパズル', 'en': 'My Puzzle', 'ko': '나의 퍼즐', 'th': 'จิ๊กซอว์ของฉัน', 'vi': 'Puzzle của tôi', 'ms': 'Teka-teki Saya', 'la': 'Puzzle Meum' },
    emptyGardenPrompt: { 'zh-TW': '你的拼圖還空著，快來記錄第一塊心情碎片吧！', 'zh-CN': '你的拼图还空着，快来记录第一块心情碎片吧！', 'ja': 'あなたのパズルはまだ空です。最初の気持ちのピースを記録しに来てください！', 'en': 'Your puzzle is empty, come and record the first mood piece!', 'ko': '당신의 퍼즐은 아직 비어있습니다. 와서 첫 번째 기분 조각을 기록하세요!', 'th': 'จิ๊กซอว์ของคุณยังว่างอยู่ มาบันทึกชิ้นส่วนอารมณ์ชิ้นแรกกันเถอะ!', 'vi': 'Puzzle của bạn còn trống, hãy đến ghi lại mảnh ghép tâm trạng đầu tiên!', 'ms': 'Teka-teki anda masih kosong, datang dan catat kepingan perasaan pertama!', 'la': 'Puzzle tuum vacuus est, veni et primum fragmentum animi inscribe!' },
  completeTitle: {
    'zh-TW': '🎉 恭喜你完成拼圖！🎉',
    'zh-CN': '🎉 恭喜你完成拼图！🎉',
    'en': '🎉 Puzzle Completed! 🎉',
    'ja': '🎉 パズル完成！🎉',
    'ko': '🎉 퍼즐 완성! 🎉',
    'th': '🎉 ต่อจิ๊กซอว์สำเร็จ! 🎉',
    'vi': '🎉 Hoàn thành ghép hình! 🎉',
    'ms': '🎉 Teka-teki Selesai! 🎉',
    'la': '🎉 Puzzle Perfectum! 🎉'
  },
  completeDesc: {
    'zh-TW': '你已經解鎖全部心情拼圖，準備好迎接下一個挑戰了嗎？',
    'zh-CN': '你已经解锁全部心情拼图，准备好迎接下一个挑战了吗？',
    'en': 'You have unlocked all mood puzzle pieces. Ready for the next challenge?',
    'ja': 'すべての気持ちパズルを解放しました。次のチャレンジの準備はできましたか？',
    'ko': '모든 감정 퍼즐을 해제했습니다. 다음 도전을 준비하세요!',
    'th': 'คุณได้ปลดล็อกจิ๊กซอว์อารมณ์ทั้งหมดแล้ว พร้อมสำหรับความท้าทายถัดไปหรือยัง?',
    'vi': 'Bạn đã mở khóa tất cả các mảnh ghép cảm xúc. Sẵn sàng cho thử thách tiếp theo chưa?',
    'ms': 'Anda telah membuka semua kepingan teka-teki emosi. Sedia untuk cabaran seterusnya?',
    'la': 'Omnes partes animi puzzle aperuisti. Paratus es ad provocationem sequentem?'
  },
  nextChallenge: {
    'zh-TW': '前往{size}x{size}新挑戰',
    'zh-CN': '前往{size}x{size}新挑战',
    'en': 'Next {size}x{size} Challenge',
    'ja': '{size}x{size}新しいチャレンジへ',
    'ko': '{size}x{size} 새 도전으로',
    'th': 'ไปยังความท้าทาย {size}x{size} ถัดไป',
    'vi': 'Thử thách {size}x{size} tiếp theo',
    'ms': 'Cabaran {size}x{size} Seterusnya',
    'la': 'Ad novam provocationem {size}x{size}'
  },
      encouragement: {
      'zh-TW': '有時候，記錄心情，就是給自己一份溫柔的陪伴。',
      'zh-CN': '有时候，记录心情，就是给自己一份温柔的陪伴。',
      'en': 'Sometimes, recording your feelings is a gentle way to accompany yourself.',
      'ja': 'ときどき、気持ちを記録することは自分へのやさしい寄り添いです。',
      'ko': '가끔은 마음을 기록하는 것이 자신에게 주는 따뜻한 동행입니다.',
      'th': 'บางครั้งการบันทึกความรู้สึก คือการมอบความอ่อนโยนให้ตัวเอง',
      'vi': 'Đôi khi, ghi lại cảm xúc là cách dịu dàng để đồng hành cùng chính mình.',
      'ms': 'Kadang-kadang, mencatat perasaan adalah teman yang lembut untuk diri sendiri.',
      'la': 'Aliquando, animum inscribere est tibi ipsum leniter comitari.'
    },
  toastInput: {
    'zh-TW': '請先輸入你的心情！',
    'zh-CN': '请先输入你的心情！',
    'en': 'Please enter your mood first!',
    'ja': 'まず気持ちを入力してください！',
    'ko': '먼저 기분을 입력해주세요!',
    'th': 'กรุณากรอกความรู้สึกของคุณก่อน!',
    'vi': 'Vui lòng nhập tâm trạng của bạn trước!',
    'ms': 'Sila masukkan perasaan anda dahulu!',
    'la': 'Primum animum tuum inscribe!'
  },
  // 更新invalidMood提示內容，讓每種語言都自然且貼近母語，不提及『包含中文』
  invalidMood: {
    'zh-TW': '請輸入有意義的心情內容（不能全是數字、符號或重複字元）',
    'zh-CN': '请输入有意义的心情内容（不能全是数字、符号或重复字符）',
    'en': 'Please enter a meaningful mood (not just numbers, symbols, or repeated characters)',
    'ja': '意味のある気持ちを入力してください（数字や記号、同じ文字だけは不可）',
    'ko': '의미 있는 기분을 입력해주세요(숫자, 기호, 반복문자만은 불가)',
    'th': 'กรุณากรอกความรู้สึกที่มีความหมาย (ห้ามเป็นตัวเลข สัญลักษณ์ หรืออักษรซ้ำ)',
    'vi': 'Vui lòng nhập tâm trạng có ý nghĩa (không chỉ là số, ký hiệu hoặc ký tự lặp lại)',
    'ms': 'Sila masukkan perasaan yang bermakna (bukan hanya nombor, simbol atau aksara berulang)',
    'la': 'Sententiam significantem inscribe (non solum numeri, signa aut litterae repetitae)'
  },
  completeNext: {
    'zh-TW': '已完成本關，請點擊前往新挑戰',
    'zh-CN': '已完成本关，请点击前往新挑战',
    'en': 'Puzzle completed! Please proceed to the next challenge.',
    'ja': 'このステージはクリアしました。次のチャレンジへ進んでください。',
    'ko': '이 단계는 완료되었습니다. 다음 도전으로 이동하세요.',
    'th': 'คุณผ่านด่านนี้แล้ว กรุณาไปยังความท้าทายถัดไป',
    'vi': 'Bạn đã hoàn thành màn này, hãy chuyển sang thử thách tiếp theo.',
    'ms': 'Tahap ini telah selesai. Sila ke cabaran seterusnya.',
    'la': 'Hoc gradum perfecisti. Ad provocationem sequentem procede.'
  },
  finalCompleteTitle: {
    'zh-TW': '🎉🎉 你已經完成所有心情拼圖！ 🎉🎉',
    'zh-CN': '🎉🎉 你已经完成所有心情拼图！ 🎉🎉',
    'en': '🎉🎉 You have completed all mood puzzles! 🎉🎉',
    'ja': '🎉🎉 すべての気持ちパズルを完成しました！ 🎉🎉',
    'ko': '🎉🎉 모든 감정 퍼즐을 완성했습니다! 🎉🎉',
    'th': '🎉🎉 คุณได้ต่อจิ๊กซอว์อารมณ์ครบทุกชิ้นแล้ว! 🎉🎉',
    'vi': '🎉🎉 Bạn đã hoàn thành tất cả các mảnh ghép cảm xúc! 🎉🎉',
    'ms': '🎉🎉 Anda telah melengkapkan semua teka-teki emosi! 🎉🎉',
    'la': '🎉🎉 Omnes partes animi puzzle perfecisti! 🎉🎉'
  },
  finalCompleteDesc: {
    'zh-TW': '你已經解鎖所有拼圖碎片，這是屬於你的堅持與成就！請繼續相信自己，未來每一天都值得被記錄與慶祝！',
    'zh-CN': '你已经解锁所有拼图碎片，这是属于你的坚持与成就！请继续相信自己，未来每一天都值得被记录与庆祝！',
    'en': 'You have unlocked every puzzle piece. This is your perseverance and achievement! Keep believing in yourself—every day ahead is worth celebrating!',
    'ja': 'すべてのピースをアンロックしました。これはあなたの努力と成果です！これからも自分を信じて、毎日を大切にしてください！',
    'ko': '모든 퍼즐 조각을 해제했습니다. 이것은 당신의 끈기와 성취입니다! 앞으로도 자신을 믿고, 매일을 소중히 하세요!',
    'th': 'คุณได้ปลดล็อกจิ๊กซอว์ทุกชิ้นแล้ว นี่คือความพยายามและความสำเร็จของคุณ! จงเชื่อมั่นในตัวเองและเฉลิมฉลองทุกวัน!',
    'vi': 'Bạn đã mở khóa mọi mảnh ghép. Đây là sự kiên trì và thành tựu của bạn! Hãy tiếp tục tin vào bản thân và ăn mừng mỗi ngày!',
    'ms': 'Anda telah membuka semua kepingan teka-teki. Ini adalah ketabahan dan pencapaian anda! Teruskan percaya pada diri sendiri dan raikan setiap hari!',
    'la': 'Omnia fragmenta aenigmatis aperuisti. Haec est constantia et perfectio tua! Crede tibi et diem quemque celebra!'
  }
};

export default function Journal() {
  const navigate = useNavigate();
    const auth = getAuth();
  const { lang, setLang } = useLanguage();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [garden, setGarden] = useState<any[]>([]);
    // 修正：動態取得目前登入者 UID
    const userId = auth.currentUser?.uid || '';
    // 在組件最上方加一個 useState 控制浮窗
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState('');
    const [showLegalMenu, setShowLegalMenu] = useState(false);
    const [showLangBox, setShowLangBox] = useState(false);
    const legalMenuRef = useRef<HTMLDivElement>(null);
    const langBoxRef = useRef<HTMLDivElement>(null);
    // 全域 today 變數
    const today = new Date().toISOString().slice(0, 10);

    // 語言選擇器點擊外部隱藏
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

    // 取得花園
    useEffect(() => {
        if (!userId) return; // 未登入不查詢
        fetch(`/api/mood?userId=${userId}`)
            .then(res => res.json())
            .then(data => setGarden(data));
    }, [userId]);

    // 新增：關卡進度與狀態
    const [stage, setStage] = React.useState(() => {
        const saved = localStorage.getItem('puzzleStage');
        return saved ? JSON.parse(saved) : { size: 3, unlocked: 0, completed: false, lastDate: '' };
    });
    React.useEffect(() => {
        localStorage.setItem('puzzleStage', JSON.stringify(stage));
    }, [stage]);

    // 拼圖關卡與圖片都根據stage.size
    const currentSize = stage.size || 3;
    const nextSize = currentSize + 1;
    const puzzleIndex = currentSize - 2; // 3x3是1，4x4是2...
    const PUZZLE_IMG = `/puzzle${puzzleIndex}.png`;
    const PUZZLE_SIZE = currentSize;
    const PUZZLE_TOTAL = PUZZLE_SIZE * PUZZLE_SIZE;
    function getPuzzleBlocks(count: number) {
      // 回傳已解鎖的拼圖索引陣列
      return Array.from({ length: PUZZLE_TOTAL }, (_, i) => i < count);
    }
    // 新增：關卡進度與狀態
    // 點擊前往下一關，重置拼圖，並設定明天才能種花
    function handleNextStage() {
        const next = { size: nextSize, unlocked: 0, completed: false, lastDate: new Date().toISOString().slice(0, 10) };
        setStage(next);
        setGarden([]); // 清空花園
        setShowInfo(null);
    }

    // 判斷今天是否已種花
    // const today = new Date().toISOString().slice(0, 10);
    // const canPlant = !stage.lastDate || stage.lastDate !== today;
    const canPlant = true;

    // 修改 handleGenerate，完成後更新 stage 狀態
    const handleGenerate = async () => {
        if (!userId) {
            setToastMsg('請先登入才能解鎖拼圖');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        // 檢查今天是否已解鎖 - 多重檢查確保準確性
        let unlockedToday = false;
        
        // 檢查1: 檢查 stage.lastDate 是否等於今天
        if (stage.lastDate === today) {
            unlockedToday = true;
        }
        
        // 檢查2: 檢查 garden 數據中是否有今天的記錄
        if (!unlockedToday && Array.isArray(garden)) {
            for (const g of garden) {
                if (g && Array.isArray(g.petals)) {
                    if (g.petals.some((p: {date:string}) => typeof p.date === 'string' && p.date.slice(0,10) === today)) {
                        unlockedToday = true;
                        break;
                    }
                }
            }
        }
        
        // 檢查3: 檢查是否有今天的本地存儲記錄
        if (!unlockedToday) {
            const todayKey = `mood_${userId}_${today}`;
            const todayRecord = localStorage.getItem(todayKey);
            if (todayRecord) {
                unlockedToday = true;
            }
        }
        
        if (unlockedToday) {
            setToastMsg('今天已經記錄過心情了，明天再來解鎖新的拼圖吧！✨');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        if (isComplete) {
            setToastMsg(UI_TEXT.completeNext[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        if (!prompt) {
            setToastMsg(UI_TEXT.toastInput[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        const trimmed = prompt.replace(/\s/g, '');
        // 僅排除全為數字
        if (/^\d+$/.test(trimmed)) {
            setToastMsg(UI_TEXT.invalidMood[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        // 僅排除全為標點符號（Unicode標點與符號，支援所有語言）
        if (/^[\p{P}\p{S}]+$/u.test(trimmed)) {
            setToastMsg(UI_TEXT.invalidMood[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        // 不能全是同一個字（4字以上才判斷）
        if (trimmed.length >= 4 && /^(.)\1+$/.test(trimmed)) {
            setToastMsg(UI_TEXT.invalidMood[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        // 最少4字
        if (trimmed.length < 4) {
            setToastMsg(UI_TEXT.invalidMood[lang]);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }
        setIsLoading(true);
        try {
            await fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, mood: prompt, date: new Date().toISOString().slice(0, 10) + '-' + Math.random() })
            });
            setPrompt('');
            fetch(`/api/mood?userId=${userId}`)
                .then(res => res.json())
                .then(data => setGarden(data));
            setIsLoading(false);
            setStage((s: any) => ({ ...s, unlocked: s.unlocked + 1, lastDate: new Date().toISOString().slice(0, 10) }));
            
            // 記錄今天已解鎖，防止重複解鎖
            const todayKey = `mood_${userId}_${today}`;
            localStorage.setItem(todayKey, JSON.stringify({
                date: today,
                mood: prompt,
                timestamp: Date.now()
            }));
            
            // 新增：彈出今日提示
            const now = new Date();
            const tipIdx = now.getDay(); // 0~6
            setShowInfo({
              date: now.toISOString().slice(0, 10),
              mood: PUZZLE_TIPS[tipIdx],
              isTodayNewPiece: true
            });
        } catch (error) {
            setIsLoading(false);
            setToastMsg('解鎖失敗，請稍後再試');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value as LanguageCode;
        localStorage.setItem('lang', newLang);
        setLang(newLang);
    };

    // 拼圖解鎖數量以 stage.unlocked 為主
    const unlocked = stage.unlocked;
    const blocks = getPuzzleBlocks(unlocked);
    const [showFull, setShowFull] = React.useState(false);
    // 新增：彈窗狀態
    const [showInfo, setShowInfo] = React.useState<{date:string, mood:string, isTodayNewPiece?:boolean}|null>(null);

    // 判斷是否全部解鎖
    const isComplete = unlocked >= PUZZLE_TOTAL;

    // 計算拼圖區域寬高，單片80px，最大1200px
    const pieceSize = 80;
    const maxBoardSize = 1200;
    const boardSize = Math.min(PUZZLE_SIZE * pieceSize, maxBoardSize);

    // 新增一個重設到第一關的按鈕（僅供測試）
    function resetToFirstStage() {
        const firstStage = { size: 3, unlocked: 0, completed: false, lastDate: '' };
        localStorage.setItem('puzzleStage', JSON.stringify(firstStage));
        window.location.reload();
    }

    // 新增一個清理當前關卡拼圖的測試按鈕
    function clearCurrentStagePuzzles() {
        const currentStage = { ...stage, unlocked: 0, lastDate: '' };
        localStorage.setItem('puzzleStage', JSON.stringify(currentStage));
        window.location.reload();
    }

    // 新增一個直接跳到22x22完成狀態的測試按鈕
    function completeFinalStage() {
        const finalSize = 22;
        const total = finalSize * finalSize;
        const finalStage = { size: finalSize, unlocked: total, completed: true, lastDate: new Date().toISOString().slice(0, 10) };
        localStorage.setItem('puzzleStage', JSON.stringify(finalStage));
        
        // 只創建3個測試心情記錄，對應當前階段的拼圖數量
        const testMoods = [
            '今天心情很好！😊',
            '有點小煩惱，但還好',
            '充滿活力的一天！💪'
        ];
        
        // 創建測試心情記錄
        const createPromises = testMoods.map((mood, index) => {
            const date = new Date();
            date.setDate(date.getDate() - index); // 從今天往前推，每天一個
            const dateStr = date.toISOString().slice(0, 10);
            const testData = {
                userId: userId,
                mood: mood,
                date: dateStr + '-' + Math.random()
            };
            
            // 發送到後端
            return fetch('/api/mood', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            }).catch(err => {
                console.log('創建測試心情記錄失敗:', err);
                return null;
            });
        });
        
        // 等待所有心情記錄創建完成後再重新載入
        Promise.all(createPromises).then(() => {
            console.log('所有測試心情記錄創建完成');
            setTimeout(() => {
                window.location.reload();
            }, 1000); // 等待1秒確保後端處理完成
        });
    }

    // 測試用：清空所有心情紀錄
    function clearAllMoods() {
      fetch(`/api/mood?userId=${userId}&clear=1`, { method: 'DELETE' })
        .then(() => { localStorage.removeItem('puzzleStage'); window.location.reload(); });
    }

    // 取每天最新一筆心情內容，依日期排序，防呆處理 garden 結構
    const moodByDate: {[date:string]: {mood:string, date:string}} = {};
    if (Array.isArray(garden)) {
      console.log('處理 garden 數據，項目數量:', garden.length);
      garden.forEach((g, index) => {
        console.log(`garden[${index}]:`, g);
        
        // 嘗試多種可能的數據結構
        let petals = null;
        if (g && Array.isArray(g.petals)) {
          petals = g.petals;
        } else if (g && Array.isArray(g)) {
          petals = g;
        } else if (g && typeof g === 'object' && g.mood && g.date) {
          // 如果 g 本身就是一個心情記錄
          petals = [g];
        }
        
        if (petals) {
          console.log(`找到 petals 數據:`, petals);
          petals.forEach((p: any, pIndex: number) => {
            console.log(`petal[${pIndex}]:`, p);
            if (p && typeof p.mood === 'string' && typeof p.date === 'string') {
              const d = p.date.slice(0,10);
              // 只保留每天最新的一筆心情記錄
              moodByDate[d] = { mood: p.mood, date: d };
              console.log('成功解析心情數據:', { date: d, mood: p.mood });
            } else if (p && typeof p === 'object') {
              console.log('petal 結構不符合預期:', p);
            }
          });
        } else {
          console.log('未找到有效的 petals 數據結構');
        }
      });
    }
    
    // 如果 garden 是空陣列，嘗試從本地存儲獲取數據
    if (Object.keys(moodByDate).length === 0) {
      console.log('嘗試從本地存儲獲取心情數據...');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('mood_')) {
          try {
            const storedData = JSON.parse(localStorage.getItem(key) || '{}');
            if (storedData.date && storedData.mood) {
              const d = storedData.date.slice(0, 10);
              // 只保留每天最新的一筆心情記錄
              moodByDate[d] = { mood: storedData.mood, date: d };
            }
          } catch (e) {
            console.log('解析本地存儲數據失敗:', key);
          }
        }
      }
    }
    const allPetals = Object.values(moodByDate).sort((a, b) => a.date.localeCompare(b.date));
    console.log('DEBUG garden:', garden);
    console.log('DEBUG moodByDate:', moodByDate);
    console.log('DEBUG allPetals:', allPetals);

    // 1. 新增 7 天輪動的溫馨提示語
    const PUZZLE_TIPS = [
      '明天記得再來喔 🌈',
      '每天一點點，心情拼圖就會完成！🧩',
      '你的心情很重要，明天也來記錄吧！📝',
      '給自己一個鼓勵，明天見！💪',
      '一天一片，慢慢拼出美好心情！🌟',
      '明天再來解鎖新拼圖吧！🔓',
      '保持好心情，明天繼續加油！😊',
    ];

    // 1. 副標題多語言
    const SUBTITLE2 = {
      'zh-TW': '用心情解鎖拼圖',
      'zh-CN': '用心情解锁拼图',
      'en': 'Unlock puzzles with your mood',
      'ja': '気持ちでパズルを解こう',
      'ko': '마음으로 퍼즐을 해제하세요',
      'th': 'ปลดล็อกจิ๊กซอว์ด้วยอารมณ์',
      'vi': 'Mở khóa ghép hình bằng cảm xúc',
      'ms': 'Buka teka-teki dengan perasaan',
      'la': 'Affectibus tuis aenigmata solve',
    };

  return (
        <div style={{
            width: '100vw',
            position: 'relative',
            overflowX: 'hidden',
            background: `url('/snowmountain.png') center center / cover no-repeat fixed, linear-gradient(to bottom, #eaf6ff 0%, #f7fafc 100%)`,
            minHeight: '0', // 讓內容自動縮放
        }}>
            {/* 浮窗提示 */}
            {showToast && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(255,255,255,0.98)',
                    color: '#6B5BFF',
                    fontWeight: 700,
                    fontSize: 20,
                    padding: '28px 48px',
                    borderRadius: 18,
                    boxShadow: '0 4px 32px #6B5BFF33',
                    zIndex: 3000,
                    textAlign: 'center',
                    letterSpacing: 1.5,
                    transition: 'opacity 0.3s',
                }}>
                    {toastMsg}
            </div>
            )}
            {/* 桌面版使用首頁頁頭 */}
            {window.innerWidth > 768 && (
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
                                aria-label={lang==='zh-TW'?'了解 Restarter 平台':'zh-CN'===lang?'了解 Restarter 平台':'en'===lang?'Learn about Restarter platform':'ja'===lang?'Restarter プラットフォームについて':'ko'===lang?'Restarter 플랫폼에 대해 알아보기':'th'===lang?'เรียนรู้เกี่ยวกับแพลตฟอร์ม Restarter':'vi'===lang?'Tìm hiểu về nền tảng Restarter':'ms'===lang?'Ketahui tentang platform Restarter':'Cognosce de suggestum Restarter'}
                                role="button"
                            >
                                {lang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===lang?'🧬 Restarter™｜我们是谁':'en'===lang?'🧬 Restarter™｜Who We Are':'ja'===lang?'🧬 Restarter™｜私たちについて':'ko'===lang?'🧬 Restarter™｜우리는 누구인가':'th'===lang?'🧬 Restarter™｜เราเป็นใคร':'vi'===lang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===lang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
                            </button>
                            <button 
                                className="topbar-btn" 
                                onClick={() => navigate('/feedback')} 
                                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
                                aria-label={lang==='zh-TW'?'提供意見回饋':'zh-CN'===lang?'提供意见反馈':'en'===lang?'Provide feedback':'ja'===lang?'フィードバックを提供':'ko'===lang?'피드백 제공':'th'===lang?'ให้ข้อเสนอแนะ':'vi'===lang?'Cung cấp phản hồi':'ms'===lang?'Beri maklum balas':'Praebe consilium'}
                                role="button"
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
                                    {UI_TEXT.logout[lang]}
                                </button>
                            </div>
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
                </>
            )}
            
            {/* 手機版頁頭 */}
            {window.innerWidth <= 768 && <SharedHeader />}
            
            {/* 主標題卡片 - 縮短並調整高度 */}
            <div
                style={{
                    width: '100%',
                    maxWidth: window.innerWidth <= 768 ? 280 : 400,
                    margin: window.innerWidth <= 768 ? '100px auto 20px auto' : '120px auto 20px auto',
                    padding: window.innerWidth <= 768 ? '8px 20px' : '12px 20px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <h1 style={{ 
                    fontWeight: 900, 
                    fontSize: 18, 
                    color: '#6B5BFF', 
                    margin: 0, 
                    lineHeight: 1,
                    textShadow: '0 2px 8px #6B5BFF88',
                    textAlign: 'center',
                }}>
                    <span role="img" aria-label="mood">🌱</span> {UI_TEXT.pageTitle[lang]}
                </h1>
            </div>
            
            {/* 主要內容區塊 */}
            <div style={{
                maxWidth: 700,
                margin: window.innerWidth <= 768 ? '0 auto 0 auto' : '20px auto 0 auto',
                padding: window.innerWidth <= 768 ? '2.5rem 2vw 0 2vw' : '1.2rem 2vw 0 2vw', // 手機版增加頂部padding
                background: 'rgba(255,255,255,0.92)',
                borderRadius: 24,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                position: 'relative',
            }}>
                {/* 副標題 */}
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'nowrap', marginBottom: 8 }}>
                    <span style={{ fontSize: 15, color: '#888', fontWeight: 700, letterSpacing: 1, textShadow: '0 2px 12px #6B5BFF55', whiteSpace: 'nowrap' }}>
                        {SUBTITLE2[lang] || SUBTITLE2['en']}
                    </span>
                </div>
                <div style={{ color: '#888', fontSize: 18, marginBottom: 0, textAlign: 'center', fontWeight: 700, letterSpacing: 1, textShadow: '0 2px 12px #6B5BFF55' }}>
                    {UI_TEXT.subtitle[lang]}
                </div>
                {/* 鼓勵與陪伴短文 */}
                <div style={{ width: '100%', textAlign: 'center', color: '#232323', fontSize: 17, fontWeight: 500, margin: '0 0 10px 0', letterSpacing: 0.5, lineHeight: 1.5, textShadow: '0 2px 8px #bbb8' }}>
                    {UI_TEXT.encouragement[lang]}<span role="img" aria-label="rainbow">🌈</span>
              </div>
                
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 12, width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={UI_TEXT.inputPlaceholder[lang]}
                        maxLength={30}
                        rows={3}
                        style={{ width: 260, minWidth: 180, maxWidth: 320, padding: 12, borderRadius: 8, border: '1.5px solid #ddd', fontSize: 16, resize: 'vertical', marginRight: 0 }}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        style={{
                            width: 140, // 與返回首頁按鈕寬度一致
                            minWidth: 100,
                            padding: '14px 0',
                            background: isLoading ? '#ccc' : 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 10,
                            fontWeight: 900,
                            fontSize: 16,
                            letterSpacing: 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            marginLeft: 0,
                            marginBottom: 0
                        }}
                    >
                        {isLoading ? '...' : UI_TEXT.plantButton[lang]}
                    </button>
            </div>
            
                <div style={{borderTop: '1px solid #eee', margin: '16px 0'}}></div>

                {/* 花園顯示區塊 */}
                <div>
                    {/* 拼圖區外層div，maxWidth:540px, margin:0 auto, padding:0 0 24px 0 */}
                    <div style={{ minHeight: 0, background: '#f0f8ff', borderRadius: 12, display: 'block', color: '#aaa', position: 'relative', width: '100%', maxWidth: 540, overflow: 'hidden', margin: '0 auto', padding: '0 0 24px 0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${PUZZLE_SIZE}, 1fr)`, gridTemplateRows: `repeat(${PUZZLE_SIZE}, 1fr)`, width: '100%', maxWidth: '100%', margin: '0 auto', aspectRatio: '1 / 1', position: 'relative', zIndex: 1, gap: 0, background: '#fff', boxShadow: '0 2px 24px #6B5BFF22', boxSizing: 'border-box' }}>
                            {blocks.map((unlocked, idx) => {
                                const petal = allPetals[idx] || null;
                                const mood = petal?.mood || '';
                                const date = petal?.date || '';
                                const row = Math.floor(idx / PUZZLE_SIZE);
                                const col = idx % PUZZLE_SIZE;
                                // 只要已解鎖就能點擊，不依賴 allPetals 的數量
                                const canClick = unlocked && !!petal;
                                return (
                                    <div key={idx} style={{ width: '100%', height: '100%', aspectRatio: '1/1', overflow: 'hidden', position: 'relative', border: 'none', boxSizing: 'border-box', cursor: canClick ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => { 
                                            console.log('點擊拼圖:', { idx, canClick, petal, date, mood });
                                            if (canClick) {
                                                console.log('設置 showInfo:', { date, mood });
                                                setShowInfo({date, mood});
                                            }
                                        }}>
                                        <img
                                            src={PUZZLE_IMG}
                                            alt="puzzle"
                                            style={{
                                                width: `calc(100% * ${PUZZLE_SIZE})`,
                                                height: `calc(100% * ${PUZZLE_SIZE})`,
                                                objectFit: 'cover',
                                                position: 'absolute',
                                                left: `-${col * 100}%`,
                                                top: `-${row * 100}%`,
                                                filter: unlocked ? 'none' : 'blur(8px) grayscale(1) brightness(1.2)',
                                                opacity: unlocked ? 1 : 0.5,
                                                transition: 'filter 0.3s, opacity 0.3s',
                                            }}
                                        />
                                        {!unlocked && <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:32}}>?</div>}
                                    </div>
                                );
                            })}
                        </div>
                        {/* 彈窗顯示：若 isTodayNewPiece 則顯示提示語，否則顯示心情內容 */}
                        {showInfo && !isComplete && (
                            <div style={{position:'fixed',left:0,top:0,width:'100vw',height:'100vh',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}} onClick={()=>setShowInfo(null)}>
                                <div style={{background:'#fff',borderRadius:16,padding:'32px 40px',boxShadow:'0 4px 32px #0008',minWidth:260,maxWidth:320,textAlign:'center',fontSize:18,fontWeight:700}}>
                                    <div style={{fontSize:16,color:'#6B5BFF',marginBottom:8}}>{showInfo.date}</div>
                                    <div style={{fontSize:22,color:'#232946',marginBottom:8}}>{showInfo.mood}</div>
                                    {showInfo.isTodayNewPiece && <div style={{fontSize:15,color:'#888',marginTop:8}}>(一天只能解鎖一片，明天再來！)</div>}
                                    <div style={{fontSize:14,color:'#888'}}>（點擊空白處關閉）</div>
          </div>
                            </div>
                        )}
                        {isComplete && (
                            <>
                                <div style={{
                                    position:'absolute',
                                    top:0,
                                    left:0,
                                    width:'100%',
                                    height:'100%',
                                    zIndex:2,
                                    pointerEvents:'auto',
                                    display:'flex',
                                    flexDirection:'column',
                                    alignItems:'center',
                                    justifyContent:'center',
                                    textAlign:'center',
                                    background:'rgba(255,255,255,0.0)'
                                }}>
                                    {stage.size === 22 ? (
                                        <div style={{
                                            display:'flex',
                                            flexDirection:'column',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:'100%',
                                            maxWidth: '90vw',
                                            margin: '0 auto',
                                        }}>
                                            <div style={{
                                                fontSize:32,
                                                fontWeight:900,
                                                color:'#ff9800',
                                                textShadow:'0 2px 12px #fff,0 4px 24px #ff980088',
                                                letterSpacing:2,
                                                marginBottom:12,
                                                lineHeight:1.2,
                                                wordBreak:'break-word',
                                                maxWidth:'100%'
                                            }}>{UI_TEXT.finalCompleteTitle[lang]}</div>
                                            <div style={{
                                                fontSize:18,
                                                fontWeight:600,
                                                color:'#6B5BFF',
                                                textShadow:'0 2px 12px #6B5BFF88',
                                                letterSpacing:1,
                                                lineHeight:1.5,
                                                wordBreak:'break-word',
                                                maxWidth:'100%',
                                                marginBottom:24
                                            }}>{UI_TEXT.finalCompleteDesc[lang]}</div>
                                            <button onClick={resetToFirstStage} style={{ padding: '14px 40px', background: 'linear-gradient(135deg,#6B5BFF 60%,#23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 16, fontWeight: 900, fontSize: 22, boxShadow: '0 2px 12px #6B5BFF44', cursor: 'pointer', letterSpacing: 2, transition: 'transform 0.2s', outline: 'none', display: 'block' }}>再來一次</button>
        </div>
      ) : (
                                        <>
                                            <div style={{
                                                position:'relative',
                                                fontSize:24,
                                                fontWeight:900,
                                                color:'#ff9800',
                                                textShadow:'0 2px 12px #fff,0 4px 24px #ff980088',
                                                transform:'scale(0.7)',
                                                opacity:1,
                                                animation:'flyIn1 0.5s 0.1s cubic-bezier(.68,-0.55,.27,1.55) forwards'
                                            }}>{UI_TEXT.completeTitle[lang]}</div>
                                            <div style={{
                                                position:'relative',
                                                fontSize:20,
                                                fontWeight:700,
                                                color:'#6B5BFF',
                                                marginTop:18,
                                                opacity:0,
                                                animation:'flyIn2 0.5s 0.6s cubic-bezier(.68,-0.55,.27,1.55) forwards'
                                            }}>{UI_TEXT.completeDesc[lang]}</div>
                                            <div style={{
                                                position:'relative',
                                                marginTop:32,
                                                opacity:0,
                                                animation:'flyIn3 0.5s 1.1s cubic-bezier(.68,-0.55,.27,1.55) forwards'
                                            }}>
                                                <button type="button" onClick={handleNextStage} style={{padding:'18px 48px',background:'linear-gradient(135deg,#6B5BFF 60%,#23c6e6 100%)',color:'#fff',borderRadius:16,fontWeight:900,fontSize:24,boxShadow:'0 2px 12px #6B5BFF44',border:'none',cursor:'pointer',letterSpacing:2,transition:'transform 0.2s',outline:'none',display:'block'}}>{UI_TEXT.nextChallenge[lang].replace(/\{size\}/g, String(nextSize))}</button>
          </div>
                                            <style>{`
@keyframes flyIn1 { from { opacity:0; transform:translateY(40px) scale(0.7);} to { opacity:1; transform:translateY(0) scale(1);} }
@keyframes flyIn2 { from { opacity:0; transform:translateY(40px) scale(0.7);} to { opacity:1; transform:translateY(0) scale(1);} }
@keyframes flyIn3 { from { opacity:0; transform:translateY(40px) scale(0.7);} to { opacity:1; transform:translateY(0) scale(1);} }
`}</style>
                                        </>
                                    )}
          </div>
        </>
      )}
                    </div>
                    {/* 刪除卡片區塊，不再顯示花園紀錄卡片 */}
                </div>
            </div>
            {/* 刪除清空所有心情紀錄按鈕區塊 */}
      {/* 測試按鈕區域 */}
      <div style={{ 
        width: '100%', 
        maxWidth: 700,
        margin: '20px auto 0 auto',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 16,
        padding: '16px',
        boxShadow: '0 2px 12px #6B5BFF22'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={clearCurrentStagePuzzles} style={{ 
            padding: '8px 16px', 
            background: 'linear-gradient(135deg,#ff6b6b 60%,#ff8e8e 100%)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            fontWeight: 700, 
            fontSize: 14, 
            cursor: 'pointer',
            letterSpacing: 1
          }}>
            清理當前拼圖
          </button>
          <button onClick={resetToFirstStage} style={{ 
            padding: '8px 16px', 
            background: 'linear-gradient(135deg,#4ecdc4 60%,#6bcfc4 100%)', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 8, 
            fontWeight: 700, 
            fontSize: 14, 
            cursor: 'pointer',
            letterSpacing: 1
          }}>
            重置到第一關
          </button>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 768px) {
          .mobile-shared-header {
            display: none !important;
          }
          .desktop-header {
            display: flex !important;
          }
        }
        @media (max-width: 767px) {
          .mobile-shared-header {
            display: block !important;
          }
          .desktop-header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}