import React from 'react';
import { useLocation } from 'react-router-dom';

// 假設留言資料存在 localStorage.messages
function getAllMessages() {
  try {
    return JSON.parse(localStorage.getItem('messages') || '[]');
  } catch {
    return [];
  }
}

export default function InboxPage() {
  const userId = localStorage.getItem('userId') || '';
  const messages = getAllMessages();
  const lang = (localStorage.getItem('lang') as 'zh-TW'|'zh-CN'|'en'|'ja'|'ko'|'vi'|'th'|'la'|'ms') || 'zh-TW';
  
  const TEXTS = {
    'zh-TW': { title: '我的留言箱', noMessages: '目前沒有收到任何留言', messageFrom: '留言：', aboutPost: '針對你的貼文：「' },
    'zh-CN': { title: '我的留言箱', noMessages: '目前没有收到任何留言', messageFrom: '留言：', aboutPost: '针对你的贴文：「' },
    'en': { title: 'My Inbox', noMessages: 'No messages received yet', messageFrom: 'message:', aboutPost: 'About your post: "' },
    'ja': { title: 'メッセージボックス', noMessages: 'まだメッセージがありません', messageFrom: 'メッセージ：', aboutPost: 'あなたの投稿について：「' },
    'ko': { title: '내 메시지함', noMessages: '아직 받은 메시지가 없습니다', messageFrom: '메시지:', aboutPost: '당신의 게시물에 대해: "' },
    'vi': { title: 'Hộp thư của tôi', noMessages: 'Chưa có tin nhắn nào', messageFrom: 'tin nhắn:', aboutPost: 'Về bài đăng của bạn: "' },
    'th': { title: 'กล่องข้อความของฉัน', noMessages: 'ยังไม่มีข้อความ', messageFrom: 'ข้อความ:', aboutPost: 'เกี่ยวกับโพสต์ของคุณ: "' },
    'la': { title: 'Mea Inbox', noMessages: 'Nondum epistulae receptae', messageFrom: 'epistula:', aboutPost: 'De tuo post: "' },
    'ms': { title: 'Peti Surat Saya', noMessages: 'Belum ada mesej diterima', messageFrom: 'mesej:', aboutPost: 'Mengenai siaran anda: "' }
  };
  
  const t = TEXTS[lang] || TEXTS['en'];
  
  // 收集所有留言給我的
  const myComments = messages.flatMap((msg: any) => (msg.comments||[]).filter((c: any) => c.toUserId === userId).map((c: any) => ({...c, post: msg.text, from: msg.user.name})));
  return (
    <div className="modern-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modern-container" style={{ maxWidth: 600, width: '100%', margin: '0 auto', padding: 32 }}>
        <h2 style={{ textAlign: 'center', color: '#6B5BFF', fontWeight: 900, marginBottom: 24 }}>{t.title}</h2>
        {myComments.length === 0 && <div style={{ color: '#bbb', textAlign: 'center' }}>{t.noMessages}</div>}
        {myComments.map((c: any, i: number) => (
          <div key={i} style={{ background: '#f7f7ff', borderRadius: 12, padding: 16, boxShadow: '0 2px 8px #6B5BFF11', marginBottom: 16 }}>
            <div style={{ color: '#6B5BFF', fontWeight: 700 }}>{c.from} {t.messageFrom}</div>
            <div style={{ color: '#232946', margin: '8px 0' }}>{c.content}</div>
            <div style={{ color: '#6B4F27', fontSize: 14 }}>{t.aboutPost}{c.post}」</div>
          </div>
        ))}
      </div>
    </div>
  );
} 