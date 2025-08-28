import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import VideoReactionPlayer, { VideoReactionType } from '../components/VideoReactionPlayer';
import { useVideoReaction } from '../components/VideoReactionContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import Footer from '../components/Footer';
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
  backToHome: { 'zh-TW': '← 返回首頁', 'zh-CN': '← 返回首页', 'ja': '← ホームへ戻る', 'en': '← Home', 'ko': '← 홈으로 돌아가기', 'th': '← กลับหน้าหลัก', 'vi': '← Về trang chủ', 'ms': '← Kembali ke Laman Utama', 'la': '← Ad domum redire' },
  back: { 'zh-TW': '↩ 返回上一頁', 'zh-CN': '↩ 返回上一页', 'ja': '↩ 前のページへ', 'en': '↩ Back', 'ko': '↩ 이전 페이지로', 'th': '↩ กลับไป', 'vi': '↩ Quay lại', 'ms': '↩ Kembali', 'la': '↩ Redire' },
  logout: { 'zh-TW': '登出', 'zh-CN': '登出', 'ja': 'ログアウト', 'en': 'Logout', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire' },
  pageTitle: { 'zh-TW': '配對對聊 PairTalk', 'zh-CN': '配对对聊 PairTalk', 'ja': 'ペアトーク PairTalk', 'en': 'PairTalk', 'ko': '페어톡', 'th': 'คู่คุย', 'vi': 'Trò chuyện đôi', 'ms': 'PairTalk', 'la': 'PairTalk' },
  subtitle: { 'zh-TW': '劫後餘生的交友最珍貴，沒人怕跨出第一步！', 'zh-CN': '劫后余生的交友最珍贵，没人怕跨出第一步！', 'en': 'Friendship after hardship is the most precious, no one is afraid to take the first step!', 'ja': '困難を乗り越えた後の友情こそが最も貴重、一歩踏み出すのは誰も怖くない！', 'ko': '역경 후의 우정이 가장 소중하며, 첫 걸음을 내딛는 것을 두려워하는 사람은 아무도 없습니다!', 'th': 'มิตรภาพหลังความยากลำบากนั้นมีค่าที่สุด ไม่มีใครกลัวที่จะก้าวแรก!', 'vi': 'Tình bạn sau gian khó là quý giá nhất, không ai ngại bước bước đầu tiên!', 'ms': 'Persahabatan selepas kesusahan adalah yang paling berharga, tiada siapa yang takut untuk mengambil langkah pertama!', 'la': 'Amicitia post aerumnas pretiosissima est, nemo primum gradum timere metuit!' },
  matchStatus: { 'zh-TW': '配對狀態', 'zh-CN': '配对状态', 'ja': 'マッチ状況', 'en': 'Match Status', 'ko': '매칭 상태', 'th': 'สถานะการจับคู่', 'vi': 'Tình trạng ghép đôi', 'ms': 'Status Padanan', 'la': 'Status Par' },
  empty: { 'zh-TW': '目前沒有配對，等待系統為你尋找夥伴...', 'zh-CN': '目前没有配对，等待系统为你寻找伙伴...', 'en': 'No matches yet. Waiting for a companion...', 'ja': 'まだマッチがありません。相手を探しています...', 'ko': '아직 매칭이 없습니다. 상대를 기다리는 중...', 'th': 'ยังไม่มีคู่ รอระบบหาคู่ให้อยู่...', 'vi': 'Chưa có ai được ghép đôi. Đang chờ hệ thống tìm bạn đồng hành...', 'ms': 'Tiada padanan lagi. Menunggu teman...', 'la': 'Nulli pares adhuc. Socium exspectans...' },
  todayMatch: { 'zh-TW': '今日配對：', 'zh-CN': '今日配对：', 'ja': '今日のマッチ：', 'en': 'Today\'s Match:', 'ko': '오늘의 매칭:', 'th': 'คู่ของวันนี้:', 'vi': 'Ghép đôi hôm nay:', 'ms': 'Padanan Hari Ini:', 'la': 'Par Hodiernus:' },
  timeLeft: { 'zh-TW': '剩餘時間：', 'zh-CN': '剩余时间：', 'ja': '残り時間：', 'en': 'Time Left:', 'ko': '남은 시간:', 'th': 'เวลาที่เหลือ:', 'vi': 'Thời gian còn lại:', 'ms': 'Masa Tinggal:', 'la': 'Tempus Reliquum:' },
  archive: { 'zh-TW': '封存對話', 'zh-CN': '封存对话', 'ja': 'アーカイブ', 'en': 'Archive', 'ko': '보관', 'th': 'เก็บถาวร', 'vi': 'Lưu trữ', 'ms': 'Arkib', 'la': 'Archivum' },
  rematch: { 'zh-TW': '重配', 'zh-CN': '重配', 'ja': '再マッチ', 'en': 'Rematch', 'ko': '재매칭', 'th': 'จับคู่ใหม่', 'vi': 'Ghép lại', 'ms': 'Padan semula', 'la': 'Repar' },
  history: { 'zh-TW': '歷史配對', 'zh-CN': '历史配对', 'ja': '履歴', 'en': 'History', 'ko': '기록', 'th': 'ประวัติ', 'vi': 'Lịch sử', 'ms': 'Sejarah', 'la': 'Historia' },
  viewDetails: { 'zh-TW': '查看完整資料', 'zh-CN': '查看完整资料', 'ja': '詳細を見る', 'en': 'View Details', 'ko': '상세 정보 보기', 'th': 'ดูรายละเอียด', 'vi': 'Xem chi tiết', 'ms': 'Lihat Butiran', 'la': 'Singula Videre' },
  hideDetails: { 'zh-TW': '收合資料', 'zh-CN': '收起资料', 'ja': '閉じる', 'en': 'Hide', 'ko': '숨기기', 'th': 'ซ่อน', 'vi': 'Ẩn', 'ms': 'Sembunyi', 'la': 'Celare' },
  nickname: { 'zh-TW': '暱稱', 'zh-CN': '昵称', 'ja': 'ニックネーム', 'en': 'Nickname', 'ko': '닉네임', 'th': 'ชื่อเล่น', 'vi': 'Biệt danh', 'ms': 'Nama Samaran', 'la': 'Agnomen' },
  country: { 'zh-TW': '國家', 'zh-CN': '国家', 'ja': '国', 'en': 'Country', 'ko': '국가', 'th': 'ประเทศ', 'vi': 'Quốc gia', 'ms': 'Negara', 'la': 'Natio' },
  age: { 'zh-TW': '年齡', 'zh-CN': '年龄', 'ja': '年齢', 'en': 'Age', 'ko': '나이', 'th': 'อายุ', 'vi': 'Tuổi', 'ms': 'Umur', 'la': 'Aetas' },
  gender: { 'zh-TW': '性別', 'zh-CN': '性别', 'ja': '性別', 'en': 'Gender', 'ko': '성별', 'th': 'เพศ', 'vi': 'Giới tính', 'ms': 'Jantina', 'la': 'Genus' },
  interest: { 'zh-TW': '興趣', 'zh-CN': '兴趣', 'ja': '趣味', 'en': 'Interest', 'ko': '관심사', 'th': 'ความสนใจ', 'vi': 'Sở thích', 'ms': 'Minat', 'la': 'Studium' },
  eventType: { 'zh-TW': '事件類型', 'zh-CN': '事件类型', 'ja': 'イベントタイプ', 'en': 'Event Type', 'ko': '이벤트 유형', 'th': 'ประเภทเหตุการณ์', 'vi': 'Loại sự kiện', 'ms': 'Jenis Acara', 'la': 'Genus Eventus' },
  bio: { 'zh-TW': '簡介', 'zh-CN': '简介', 'ja': '自己紹介', 'en': 'Bio', 'ko': '소개', 'th': 'ประวัติ', 'vi': 'Tiểu sử', 'ms': 'Bio', 'la': 'Bio' },
  sendGift: { 'zh-TW': '送出禮物', 'zh-CN': '送出礼物', 'ja': 'ギフトを送る', 'en': 'Send Gift', 'ko': '선물 보내기', 'th': 'ส่งของขวัญ', 'vi': 'Gửi quà', 'ms': 'Hantar Hadiah', 'la': 'Donum Mittere' },
  sendEmail: { 'zh-TW': '發送Email', 'zh-CN': '发送Email', 'ja': 'メール送信', 'en': 'Send Email', 'ko': '이메일 보내기', 'th': 'ส่งอีเมล', 'vi': 'Gửi Email', 'ms': 'Hantar E-mel', 'la': 'Epistulam Mittere' },
  next: { 'zh-TW': '下一頁', 'zh-CN': '下一页', 'ja': '次へ', 'en': 'Next', 'ko': '다음', 'th': 'ถัดไป', 'vi': 'Tiếp', 'ms': 'Seterusnya', 'la': 'Proximus' },
  lastPage: { 'zh-TW': '最後一頁', 'zh-CN': '最后一页', 'ja': '最後のページ', 'en': 'Last page', 'ko': '마지막 페이지', 'th': 'หน้าสุดท้าย', 'vi': 'Trang cuối', 'ms': 'Halaman terakhir', 'la': 'Pagina Ultima' },
};

const mockPairs = [
  { id: 1, partner: '小明', status: 'active', aiGuide: '你可以問對方：今天過得如何？' },
  { id: 2, partner: 'Sandy', status: 'archived', aiGuide: '你可以問對方：最近有什麼開心的事？' },
];

const mockProfiles = [
  {
    id: 1,
    nickname: 'Alice',
    country: '台灣',
    age: 28,
    gender: 'female',
    email: 'alice@example.com',
    bio: '喜歡閱讀與旅行',
    interest: '閱讀',
    eventType: '經濟',
    avatar: '/avatars/female1.jpg',
  },
  {
    id: 2,
    nickname: 'Bob',
    country: '日本',
    age: 32,
    gender: 'male',
    email: 'bob@example.com',
    bio: '音樂愛好者',
    interest: '音樂',
    eventType: '科技',
    avatar: '/avatars/male1.jpg',
  },
];

const GENDER_LABEL: Record<string, Record<string, string>> = {
  'zh-TW': { male: '男性', female: '女性', other: '其他' },
  'zh-CN': { male: '男性', female: '女性', other: '其他' },
  'en': { male: 'Male', female: 'Female', other: 'Other' },
  'ja': { male: '男性', female: '女性', other: 'その他' },
  'ko': { male: '남성', female: '여성', other: '기타' },
  'th': { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' },
  'vi': { male: 'Nam', female: 'Nữ', other: 'Khác' },
  'ms': { male: 'Lelaki', female: 'Perempuan', other: 'Lain-lain' },
  'la': { male: 'Mas', female: 'Femina', other: 'Aliud' },
};

const GIFT_OPTIONS = [
  { value: '🌹', label: '🌹' },
  { value: '💍', label: '💍' },
  { value: '🍰', label: '🍰' },
  { value: '🎩', label: '🎩' },
  { value: '🌺', label: '🌺' },
  { value: '👗', label: '👗' },
  { value: '✒️', label: '✒️' },
  { value: '🏎️', label: '🏎️' },
];

const AGE_UNIT: Record<string, string> = {
  'zh-TW': '歲',
  'zh-CN': '岁',
  'en': 'yrs',
  'ja': '歳',
  'ko': '세',
  'th': 'ปี',
  'vi': 'tuổi',
  'ms': 'tahun',
  'la': 'anni',
};

export default function PairTalk() {
  const navigate = useNavigate();
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || '';
  const lang = useLanguage();
  const [pairs, setPairs] = useState<any[]>(JSON.parse(localStorage.getItem('pairs')||'[]')||mockPairs);
  const [timer, setTimer] = useState(300); // 5分鐘
  const [activeId, setActiveId] = useState(pairs.find((p:any)=>p.status==='active')?.id||null);
  const [aiMsg, setAiMsg] = useState('AI：記得保持友善，互相傾聽！');
  const isSubPage = window.location.pathname !== '/';
  const [matchIndex, setMatchIndex] = useState(0);
  const matched = mockProfiles[matchIndex];
  const [showDetail, setShowDetail] = useState(false);
  const [selectedGift, setSelectedGift] = useState(GIFT_OPTIONS[0].value);
  const { setVideoReaction } = useVideoReaction();
  React.useEffect(()=>{ if(activeId){ const t = setInterval(()=>setTimer(s=>s>0?s-1:0),1000); return()=>clearInterval(t);} },[activeId]);
  const handleArchive = (id:number) => {
    setPairs(pairs.map(p=>p.id===id?{...p,status:'archived'}:p));
    localStorage.setItem('pairs', JSON.stringify(pairs.map(p=>p.id===id?{...p,status:'archived'}:p)));
    setVideoReaction('disappointment');
  };
  const handleRematch = () => {
    setVideoReaction('breakthrough');
  };
  const handleSendGift = () => {
    alert(`${selectedGift} 已送出給 ${matched.nickname}！`);
  };
  const handleSendEmail = () => {
    window.location.href = `mailto:${matched.email}?subject=PairTalk&body=Hi${userEmail ? `&from=${userEmail}` : ''}`;
  };
  const handleNextMatch = () => {
    if (mockProfiles.length <= 1 || matchIndex === mockProfiles.length - 1) {
      alert(UI_TEXT.lastPage[lang]);
      return;
    }
    setShowDetail(false);
    setMatchIndex(i => i + 1);
  };
  return (
    <div className="modern-bg" style={{ background: `url('/valley.png') center center / cover no-repeat`, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{position:'absolute',top:0,left:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',background:'transparent'}}>
        <button className="topbar-btn" onClick={()=>navigate('/')} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginRight:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{UI_TEXT.backToHome[lang]}</button>
        {window.location.pathname!=='/pairtalk' && <button className="topbar-btn" onClick={()=>navigate(-1)} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s', marginLeft:8}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{UI_TEXT.back[lang]}</button>}
      </div>
      <div style={{position:'absolute',top:0,right:0,zIndex:100,display:'flex',alignItems:'center',padding:'18px 32px 0 32px',background:'transparent',gap:12}}>
        <button className="topbar-btn" onClick={async()=>{await signOut(auth);localStorage.clear();window.location.href='/'}} style={{fontWeight:700,fontSize:18,padding:'6px 16px',borderRadius:8,border:'1.5px solid #6B5BFF',background:'#fff',color:'#6B5BFF',cursor:'pointer',transition:'background 0.18s, color 0.18s, border 0.18s'}} onMouseOver={e=>{e.currentTarget.style.background='#6B5BFF';e.currentTarget.style.color='#fff';}} onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color='#6B5BFF';}}>{UI_TEXT.logout[lang]}</button>
        <LanguageSelector />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#6B5BFF', textShadow: '0 2px 12px #6B5BFF88, 0 4px 24px #0008', letterSpacing:1, background:'#fff', borderRadius:12, boxShadow:'0 2px 12px #6B5BFF22', padding:'12px 32px', margin:0, marginBottom: 24, display:'flex',alignItems:'center',gap:12 }}>🤝 {UI_TEXT.pageTitle[lang]}</h2>
        <div style={{ maxWidth: 540, width: '100%', background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 24px #0002', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 22, color: '#6B5BFF', fontWeight: 900, marginBottom: 24, textAlign:'center', textShadow:'0 2px 12px #6B5BFF88, 0 4px 24px #0008' }}>{UI_TEXT.subtitle[lang]}</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 18 }}>{UI_TEXT.pageTitle[lang]}</h2>
          <div style={{ marginTop: 18 }}>
            <b>{UI_TEXT.matchStatus[lang]}</b>
            <div style={{ marginTop: 8 }}>{UI_TEXT.empty[lang]}</div>
          </div>
          {activeId ? (
            <div style={{ marginBottom: 16 }}>
              <b>{UI_TEXT.todayMatch[lang]}</b> {pairs.find(p=>p.id===activeId)?.partner}
              <div style={{ marginTop: 8, color: '#6B5BFF' }}>{UI_TEXT.timeLeft[lang]}{Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</div>
              <div style={{ marginTop: 8, color: '#23c6e6' }}>{pairs.find(p=>p.id===activeId)?.aiGuide}</div>
              <div style={{ marginTop: 8, color: '#614425' }}>{aiMsg}</div>
              <button onClick={()=>handleArchive(activeId)} style={{ marginTop: 10, borderRadius: 8, background: '#eee', color: '#6B5BFF', border: 'none', fontWeight: 700, padding: '6px 18px' }}>{UI_TEXT.archive[lang]}</button>
              <button onClick={handleRematch} style={{ marginTop: 10, marginLeft: 10, borderRadius: 8, background: '#6B5BFF', color: '#fff', border: 'none', fontWeight: 700, padding: '6px 18px' }}>{UI_TEXT.rematch[lang]}</button>
            </div>
          ) : <div style={{ color: '#614425', fontSize: 18, textAlign: 'center', marginTop: 40 }}>{UI_TEXT.empty[lang]}</div>}
          <div style={{ marginTop: 18 }}>
            <b>{UI_TEXT.history[lang]}</b>
            <ul style={{ marginTop: 8, paddingLeft: 0, listStyle: 'none' }}>{pairs.filter(p=>p.status==='archived').map((p,i)=>(<li key={i} style={{ background: '#f7f7ff', borderRadius: 8, padding: 10, marginBottom: 8 }}><div style={{ fontWeight: 700 }}>{p.partner}</div><div style={{ color: '#614425', marginTop: 4 }}>{p.aiGuide}</div></li>))}</ul>
          </div>
          {/* 配對對象卡片 */}
          <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', background: '#f7f7ff', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #6B5BFF11', marginBottom: 24, textAlign: 'center', position: 'relative' }}>
            <img src={matched.avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF', background: '#eee', marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 20, color: '#6B5BFF', marginBottom: 6 }}>{matched.nickname}</div>
            <div style={{ color: '#614425', fontSize: 16, marginBottom: 6 }}>{matched.country} / {matched.age}{AGE_UNIT[lang]} / {GENDER_LABEL[lang][matched.gender]}</div>
            <button
              onClick={()=>setShowDetail(v=>!v)}
              style={{ margin: '8px 0', padding: '6px 18px', borderRadius: 8, fontWeight: 700, background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', cursor: 'pointer', fontSize: 15, transition: 'background 0.18s, color 0.18s, box-shadow 0.18s' }}
              onMouseOver={e => { e.currentTarget.style.background = '#6B5BFF'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 6px 32px #6B5BFF99'; }}
              onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B5BFF'; e.currentTarget.style.boxShadow = 'none'; }}
            >{showDetail ? UI_TEXT.hideDetails[lang] : UI_TEXT.viewDetails[lang]}</button>
            {showDetail && (
              <div style={{ marginTop: 8, color: '#232946', fontSize: 15, background:'#fff', borderRadius:8, padding:12, boxShadow:'0 2px 8px #6B5BFF11', display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <img src={matched.avatar} alt="avatar" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF', background: '#eee', marginBottom: 6 }} />
                <div><b>{UI_TEXT.nickname[lang]}：</b>{matched.nickname}</div>
                <div><b>{UI_TEXT.country[lang]}：</b>{matched.country}</div>
                <div><b>{UI_TEXT.age[lang]}：</b>{matched.age}</div>
                <div><b>{UI_TEXT.gender[lang]}：</b>{GENDER_LABEL[lang][matched.gender]}</div>
                <div><b>Email：</b>{matched.email}</div>
                <div><b>{UI_TEXT.interest[lang]}：</b>{matched.interest}</div>
                <div><b>{UI_TEXT.eventType[lang]}：</b>{matched.eventType}</div>
                <div><b>{UI_TEXT.bio[lang]}：</b>{matched.bio}</div>
              </div>
            )}
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
              <select value={selectedGift} onChange={e=>setSelectedGift(e.target.value)} style={{ padding: '6px 12px', borderRadius: 8, border: '1.5px solid #6B5BFF', fontSize: 18 }}>
                {GIFT_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
              <button
                onClick={handleSendGift}
                style={{ padding: '6px 18px', borderRadius: 8, fontWeight: 700, background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', fontSize: 16, transition: 'background 0.18s, box-shadow 0.18s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #3a2fff 60%, #0e7fd6 100%)'; e.currentTarget.style.boxShadow = '0 6px 32px #6B5BFF99'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)'; e.currentTarget.style.boxShadow = 'none'; }}
              >{UI_TEXT.sendGift[lang]}</button>
              <button
                onClick={handleSendEmail}
                style={{ padding: '6px 18px', borderRadius: 8, fontWeight: 700, background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', fontSize: 16, transition: 'background 0.18s, color 0.18s, box-shadow 0.18s' }}
                onMouseOver={e => { e.currentTarget.style.background = '#6B5BFF'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.boxShadow = '0 6px 32px #6B5BFF99'; }}
                onMouseOut={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#6B5BFF'; e.currentTarget.style.boxShadow = 'none'; }}
              >{UI_TEXT.sendEmail[lang]}</button>
            </div>
            {/* 右下角下一頁按鈕 */}
            <button
              onClick={handleNextMatch}
              style={{ position: 'absolute', right: 18, bottom: 0, transform: 'translateY(60px)', padding: '8px 24px', borderRadius: 8, fontWeight: 700, background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', fontSize: 16, boxShadow: '0 2px 8px #6B5BFF33', transition: 'background 0.18s, box-shadow 0.18s, transform 0.18s', cursor: 'pointer' }}
              onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #3a2fff 60%, #0e7fd6 100%)'; e.currentTarget.style.boxShadow = '0 6px 32px #6B5BFF99'; e.currentTarget.style.transform = 'translateY(55px) scale(1.04)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)'; e.currentTarget.style.boxShadow = '0 2px 8px #6B5BFF33'; e.currentTarget.style.transform = 'translateY(60px)'; }}
            >{UI_TEXT.next[lang]}</button>
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