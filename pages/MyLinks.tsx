import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../src/firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

interface Link {
  id: string;
  user1Id: string;
  user1Name: string;
  user2Id: string;
  user2Name: string;
  role: string;
  goal: string;
  status: 'connected' | 'pending' | 'rejected';
  createdAt: any;
}

type LanguageCode = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'th' | 'vi' | 'ms' | 'la';

const LANGS = [
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

const TEXTS: { [key: string]: { back: string; title: string; chat: string; task: string; noLink: string; goal: string } } = {
  'zh-TW': { back: '← 返回上一頁', title: '我的連結', chat: '進入聊天', task: '共修任務', noLink: '目前沒有已建立的連結', goal: '目標：' },
  'zh-CN': { back: '← 返回上一页', title: '我的连接', chat: '进入聊天', task: '共修任务', noLink: '目前没有已建立的连接', goal: '目标：' },
  'en': { back: '← Back', title: 'My Links', chat: 'Chat', task: 'Co-Task', noLink: 'No links established', goal: 'Goal: ' },
  'ja': { back: '← 前のページへ', title: '私のリンク', chat: 'チャットへ', task: '共修タスク', noLink: 'まだリンクがありません', goal: '目標：' },
  'ko': { back: '← 이전 페이지', title: '내 링크', chat: '채팅하기', task: '공동 작업', noLink: '아직 연결된 링크가 없습니다', goal: '목표: ' },
  'th': { back: '← กลับ', title: 'ลิงก์ของฉัน', chat: 'แชท', task: 'งานร่วมกัน', noLink: 'ยังไม่มีลิงก์ที่สร้างขึ้น', goal: 'เป้าหมาย: ' },
  'vi': { back: '← Quay lại', title: 'Liên kết của tôi', chat: 'Trò chuyện', task: 'Nhiệm vụ chung', noLink: 'Chưa có liên kết nào', goal: 'Mục tiêu: ' },
  'ms': { back: '← Kembali', title: 'Pautan Saya', chat: 'Sembang', task: 'Tugas Bersama', noLink: 'Belum ada pautan yang dibuat', goal: 'Matlamat: ' },
  'la': { back: '← Redire', title: 'Nexus Mei', chat: 'Colloquium', task: 'Munus Commune', noLink: 'Nullae nexus constitutae', goal: 'Propositum: ' },
};

const statusText: { [key: string]: { connected: string; pending: string; rejected: string } } = {
  'zh-TW': { connected: '已配對', pending: '等待對方回覆', rejected: '已拒絕' },
  'zh-CN': { connected: '已配对', pending: '等待对方回复', rejected: '已拒绝' },
  'en': { connected: 'Connected', pending: 'Pending', rejected: 'Rejected' },
  'ja': { connected: 'マッチ済み', pending: '返事待ち', rejected: '拒否されました' },
  'ko': { connected: '연결됨', pending: '대기 중', rejected: '거절됨' },
  'th': { connected: 'เชื่อมต่อแล้ว', pending: 'รอการตอบกลับ', rejected: 'ถูกปฏิเสธ' },
  'vi': { connected: 'Đã kết nối', pending: 'Đang chờ', rejected: 'Đã bị từ chối' },
  'ms': { connected: 'Telah dihubungkan', pending: 'Menunggu', rejected: 'Ditolak' },
  'la': { connected: 'Coniunctus', pending: 'Exspectans', rejected: 'Reiectus' },
};

const removeText: { [key: string]: string } = {
  'zh-TW': '解除連結', 'zh-CN': '解除连接', 'en': 'Remove', 'ja': 'リンク解除', 'ko': '연결 해제', 'th': 'ยกเลิกการเชื่อมต่อ', 'vi': 'Hủy liên kết', 'ms': 'Buang Pautan', 'la': 'Remove'
};

const cancelText: { [key: string]: string } = {
  'zh-TW': '取消邀請', 'zh-CN': '取消邀请', 'en': 'Cancel Invite', 'ja': '招待をキャンセル', 'ko': '초대 취소', 'th': 'ยกเลิกคำเชิญ', 'vi': 'Hủy lời mời', 'ms': 'Batal Jemputan', 'la': 'Invitationem Remove'
};

export default function MyLinks(props: { embedded?: boolean }) {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const [links, setLinks] = useState<Link[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string|null>(null);
  const [cancelingId, setCancelingId] = useState<string|null>(null);

  // lang 型別修正
  const langCode = lang as LanguageCode;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadLinks(currentUser.uid);
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const loadLinks = async (userId: string) => {
    try {
      setLoading(true);
      const linksRef = collection(db, "links");
      
      // 查詢用戶作為 user1 的連結
      const q1 = query(linksRef, where("user1Id", "==", userId));
      const q2 = query(linksRef, where("user2Id", "==", userId));
      
      const [snapshot1, snapshot2] = await Promise.all([
        getDocs(q1),
        getDocs(q2)
      ]);
      
      const linksList: Link[] = [];
      
      // 處理 user1 的連結
      snapshot1.forEach((doc) => {
        const data = doc.data();
        linksList.push({
          id: doc.id,
          ...data
        } as Link);
      });
      
      // 處理 user2 的連結，交換 user1 和 user2 的位置
      snapshot2.forEach((doc) => {
        const data = doc.data();
        linksList.push({
          id: doc.id,
          user1Id: data.user2Id,
          user1Name: data.user2Name,
          user2Id: data.user1Id,
          user2Name: data.user1Name,
          role: data.role,
          goal: data.goal,
          status: data.status,
          createdAt: data.createdAt
        } as Link);
      });
      
      setLinks(linksList);
      setLoading(false);
    } catch (error) {
      console.error("Error loading links:", error);
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await deleteDoc(doc(db, "links", id));
      setRemovingId(null);
      alert(removeText[langCode] + ' 成功！');
    } catch (error) {
      console.error("Error removing link:", error);
      alert('操作失敗');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await deleteDoc(doc(db, "links", id));
      setCancelingId(null);
      alert(cancelText[langCode] + ' 成功！');
    } catch (error) {
      console.error("Error canceling link:", error);
      alert('操作失敗');
    }
  };

  if (loading) {
    return (
      <div style={props.embedded ? { width: '100%', background: 'none', minHeight: 'unset', boxShadow: 'none', padding: 0 } : {
        background: `url('/green_hut.png') center center / cover no-repeat`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: '#fff', fontSize: 18 }}>載入中...</div>
      </div>
    );
  }

  return (
    <div style={props.embedded ? { width: '100%', background: 'none', minHeight: 'unset', boxShadow: 'none', padding: 0 } : {
      background: `url('/green_hut.png') center center / cover no-repeat`,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 40
    }}>
      {!props.embedded && (
        <button onClick={() => navigate('/friend')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>{TEXTS[langCode].back}</button>
      )}
      {!props.embedded && (
        <LanguageSelector />
      )}
      <div style={{ maxWidth: 500, margin: props.embedded ? '0 auto' : '40px auto', background: '#fff', borderRadius: 16, boxShadow: props.embedded ? 'none' : '0 2px 8px #0001', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>{TEXTS[langCode].title}</h2>
        {links.length === 0 && <div style={{ color: '#888' }}>{TEXTS[langCode].noLink}</div>}
        {links.map(link => (
          <div key={link.id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16, opacity: link.status==='rejected'?0.5:1 }}>
            <div style={{ fontWeight: 600 }}>{link.user2Name}（{link.role}）</div>
            <div style={{ color: '#666', margin: '8px 0' }}>{TEXTS[langCode].goal}{link.goal}</div>
            <div style={{ color: link.status==='connected'?'#23c6e6':link.status==='pending'?'#e6b800':'#e4572e', fontWeight: 700, marginBottom: 8 }}>{statusText[langCode][link.status as 'connected' | 'pending' | 'rejected']}</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {link.status==='connected' && <button onClick={() => navigate('/chatroom')} style={{ background: '#8ec6f7', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }}>{TEXTS[langCode].chat}</button>}
              {link.status==='connected' && <button onClick={() => setRemovingId(link.id)} style={{ background: '#eee', color: '#888', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }}>{removeText[langCode]}</button>}
              {link.status==='pending' && <button onClick={() => setCancelingId(link.id)} style={{ background: '#eee', color: '#888', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }}>{cancelText[langCode]}</button>}
            </div>
          </div>
        ))}
      </div>
      {/* 解除連結確認彈窗 */}
      {removingId && <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'#0006', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:'#fff', borderRadius:12, padding:32, boxShadow:'0 2px 16px #0002', minWidth:280 }}>
          <div style={{ fontWeight:700, fontSize:18, marginBottom:18 }}>{removeText[langCode]}</div>
          <div style={{ display:'flex', gap:16, justifyContent:'flex-end' }}>
            <button onClick={()=>setRemovingId(null)} style={{ background:'#eee', color:'#888', border:'none', borderRadius:6, padding:'6px 18px', fontWeight:700, cursor:'pointer' }}>取消</button>
            <button onClick={()=>handleRemove(removingId)} style={{ background:'#e4572e', color:'#fff', border:'none', borderRadius:6, padding:'6px 18px', fontWeight:700, cursor:'pointer' }}>{removeText[langCode]}</button>
          </div>
        </div>
      </div>}
      {/* 取消邀請確認彈窗 */}
      {cancelingId && <div style={{ position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'#0006', zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ background:'#fff', borderRadius:12, padding:32, boxShadow:'0 2px 16px #0002', minWidth:280 }}>
          <div style={{ fontWeight:700, fontSize:18, marginBottom:18 }}>{cancelText[langCode]}</div>
          <div style={{ display:'flex', gap:16, justifyContent:'flex-end' }}>
            <button onClick={()=>setCancelingId(null)} style={{ background:'#eee', color:'#888', border:'none', borderRadius:6, padding:'6px 18px', fontWeight:700, cursor:'pointer' }}>取消</button>
            <button onClick={()=>handleCancel(cancelingId)} style={{ background:'#e4572e', color:'#fff', border:'none', borderRadius:6, padding:'6px 18px', fontWeight:700, cursor:'pointer' }}>{cancelText[langCode]}</button>
          </div>
        </div>
      </div>}
    </div>
  );
} 