import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, onSnapshot, addDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebaseConfig';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
interface Invite {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  role: string;
  goal: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: any;
}

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

const TEXTS: { [key: string]: { back: string; title: string; accept: string; reject: string; noInvite: string; goal: string } } = {
  'zh-TW': { back: '← 返回上一頁', title: '邀請通知', accept: '接受', reject: '拒絕', noInvite: '目前沒有新的邀請', goal: '目標：' },
  'zh-CN': { back: '← 返回上一页', title: '邀请通知', accept: '接受', reject: '拒绝', noInvite: '目前没有新的邀请', goal: '目标：' },
  'en': { back: '← Back', title: 'Invitations', accept: 'Accept', reject: 'Reject', noInvite: 'No new invitations', goal: 'Goal: ' },
  'ja': { back: '← 前のページへ', title: '招待通知', accept: '承認', reject: '拒否', noInvite: '新しい招待はありません', goal: '目標：' },
  'ko': { back: '← 이전 페이지', title: '초대 알림', accept: '수락', reject: '거절', noInvite: '새 초대가 없습니다', goal: '목표: ' },
  'th': { back: '← กลับ', title: 'การแจ้งเตือนคำเชิญ', accept: 'ยอมรับ', reject: 'ปฏิเสธ', noInvite: 'ไม่มีคำเชิญใหม่', goal: 'เป้าหมาย: ' },
  'vi': { back: '← Quay lại', title: 'Thông báo mời', accept: 'Chấp nhận', reject: 'Từ chối', noInvite: 'Không có lời mời mới', goal: 'Mục tiêu: ' },
  'ms': { back: '← Kembali', title: 'Notis Jemputan', accept: 'Terima', reject: 'Tolak', noInvite: 'Tiada jemputan baru', goal: 'Matlamat: ' },
  'la': { back: '← Redire', title: 'Notitia Invitationis', accept: 'Accipe', reject: 'Reici', noInvite: 'Nullae invitationes novae', goal: 'Propositum: ' },
};

export default function InvitesPage(props: { embedded?: boolean }) {
  const [invites, setInvites] = useState<Invite[]>([]);
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null); // 新增 toast 狀態
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const authUnsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        unsubscribe = await loadInvites(currentUser.uid);
      } else {
        navigate('/');
      }
    });
    return () => {
      authUnsub();
      if (unsubscribe) unsubscribe();
    };
  }, [navigate]);

  const loadInvites = async (userId: string) => {
    try {
      setLoading(true);
      const invitesRef = collection(db, "invites");
      const q = query(invitesRef, where("toUserId", "==", userId), where("status", "==", "pending"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const invitesList: Invite[] = [];
        querySnapshot.forEach((doc) => {
          invitesList.push({
            id: doc.id,
            ...doc.data()
          } as Invite);
        });
        setInvites(invitesList);
        setLoading(false);
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error loading invites:", error);
      setLoading(false);
      return undefined;
    }
  };

  const handleAction = async (inviteId: string, accept: boolean) => {
    if (!user) return;
    
    try {
      const inviteRef = doc(db, "invites", inviteId);
      
      if (accept) {
        // Accept invite - create a link
        await updateDoc(inviteRef, { status: 'accepted' });
        
        // Create a link record
        const invite = invites.find(inv => inv.id === inviteId);
        if (invite) {
          await addDoc(collection(db, "links"), {
            user1Id: invite.fromUserId,
            user1Name: invite.fromUserName,
            user2Id: invite.toUserId,
            user2Name: invite.toUserName,
            role: invite.role,
            goal: invite.goal,
            status: 'connected',
            createdAt: new Date()
          });
        }
        
        setToast(TEXTS[lang].accept + ' 成功！');
        setTimeout(() => setToast(null), 2000);
      } else {
        // Reject invite
        await updateDoc(inviteRef, { status: 'rejected' });
        setToast(TEXTS[lang].reject + ' 成功！');
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
      console.error("Error handling invite:", error);
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

  if (!loading && invites.length === 0) {
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
          <button onClick={() => navigate('/friend')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>{TEXTS[lang].back}</button>
        )}
        <LanguageSelector />
        <div style={{ maxWidth: 500, margin: props.embedded ? '0 auto' : '40px auto', background: '#fff', borderRadius: 16, boxShadow: props.embedded ? 'none' : '0 2px 8px #0001', padding: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>{TEXTS[lang].title}</h2>
          <div style={{ color: '#888', textAlign: 'center', fontSize: 18 }}>{TEXTS[lang].noInvite}</div>
        </div>
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
      {/* 浮窗提示 */}
      {toast && (
        <div style={{ position:'fixed', top:40, left:'50%', transform:'translateX(-50%)', background:'#fff', color:'#6B5BFF', fontWeight:700, fontSize:18, borderRadius:16, boxShadow:'0 4px 24px #6B5BFF22', padding:'18px 36px', zIndex:99999, textAlign:'center', letterSpacing:1 }}>
          {toast}
        </div>
      )}
      {!props.embedded && (
        <button onClick={() => navigate('/friend')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>{TEXTS[lang].back}</button>
      )}
      <LanguageSelector />
      <div style={{ maxWidth: 500, margin: props.embedded ? '0 auto' : '40px auto', background: '#fff', borderRadius: 16, boxShadow: props.embedded ? 'none' : '0 2px 8px #0001', padding: 32 }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>{TEXTS[lang].title}</h2>
        {invites.map(invite => (
          <div key={invite.id} style={{ marginBottom: 24, borderBottom: '1px solid #eee', paddingBottom: 16 }}>
            <div style={{ fontWeight: 600 }}>{invite.fromUserName} 邀請你成為 {invite.role}</div>
            <div style={{ color: '#666', margin: '8px 0' }}>{TEXTS[lang].goal}{invite.goal}</div>
            <button onClick={() => handleAction(invite.id, true)} style={{ marginRight: 12, background: '#8ec6f7', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }}>{TEXTS[lang].accept}</button>
            <button onClick={() => handleAction(invite.id, false)} style={{ background: '#eee', color: '#888', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 700, cursor: 'pointer' }}>{TEXTS[lang].reject}</button>
          </div>
        ))}
      </div>
    </div>
  );
} 