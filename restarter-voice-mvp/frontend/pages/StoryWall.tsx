import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import app from '../src/firebaseConfig';
import { useTranslation } from 'react-i18next';
import '../modern.css'; // 確保有全域樣式
import { useLanguage, LanguageCode } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { UserProfileDisplay, UserProfile } from '../components/UserProfileDisplay';
import Footer from '../components/Footer';
import SharedHeader from '../components/SharedHeader';

// 型別定義
type LangCode = LanguageCode;

type UITextType = {
  [key: string]: { [K in LangCode]: string }
};

const UI_TEXT: UITextType = {
  pageTitle: {
    'zh-TW': '故事鏈ReStoryChain™',
    'zh-CN': '故事链ReStoryChain™',
    'en': 'ReStoryChain™',
    'ja': 'ストーリーチェーンReStoryChain™',
    'ko': '스토리체인ReStoryChain™',
    'th': 'ReStoryChain™',
    'vi': 'ReStoryChain™',
    'ms': 'ReStoryChain™',
    'la': 'ReStoryChain™'
  },
  addStory: {
    'zh-TW': '分享你的故事', 'zh-CN': '分享你的故事', 'en': 'Share Your Story', 'ja': 'ストーリーを共有', 'ko': '이야기 공유', 'th': 'แบ่งปันเรื่องราวของคุณ', 'vi': 'Chia sẻ câu chuyện của bạn', 'ms': 'Kongsi Cerita Anda', 'la': 'Communica Fabulas Tuas'
  },
  title: {
    'zh-TW': '標題', 'zh-CN': '标题', 'en': 'Title', 'ja': 'タイトル', 'ko': '제목', 'th': 'ชื่อเรื่อง', 'vi': 'Tiêu đề', 'ms': 'Tajuk', 'la': 'Titulus'
  },
  content: {
    'zh-TW': '內容', 'zh-CN': '内容', 'en': 'Content', 'ja': '内容', 'ko': '내용', 'th': 'เนื้อหา', 'vi': 'Nội dung', 'ms': 'Kandungan', 'la': 'Contentum'
  },
  submit: {
    'zh-TW': '送出', 'zh-CN': '提交', 'en': 'Post', 'ja': '投稿', 'ko': '게시', 'th': 'โพสต์', 'vi': 'Đăng', 'ms': 'Hantar', 'la': 'Submittere'
  },
  comment: {
    'zh-TW': '留言', 'zh-CN': '留言', 'en': 'Comment', 'ja': 'コメント', 'ko': '댓글', 'th': 'แสดงความคิดเห็น', 'vi': 'Bình luận', 'ms': 'Komen', 'la': 'Commentarium'
  },
  addComment: {
    'zh-TW': '新增留言', 'zh-CN': '新增留言', 'en': 'Add Comment', 'ja': 'コメント追加', 'ko': '댓글 추가', 'th': 'เพิ่มความคิดเห็น', 'vi': 'Thêm bình luận', 'ms': 'Tambah Komen', 'la': 'Addere Commentarium'
  },
  encouragement: {
    'zh-TW': 'AI鼓勵語', 'zh-CN': 'AI鼓励语', 'en': 'AI Encouragement', 'ja': 'AI励まし', 'ko': 'AI 격려', 'th': 'AI ให้กำลังใจ', 'vi': 'AI động viên', 'ms': 'AI Galakan', 'la': 'AI Hortatio'
  },
  like: {
    'zh-TW': '讚', 'zh-CN': '赞', 'en': 'Like', 'ja': 'いいね', 'ko': '좋아요', 'th': 'ถูกใจ', 'vi': 'Thích', 'ms': 'Suka', 'la': 'Placere'
  },
  noStories: {
    'zh-TW': '目前沒有更多故事，請稍後再試。', 'zh-CN': '目前没有更多故事，请稍后再试。', 'en': 'No more stories for now. Please try again later.', 'ja': '現在、他のストーリーはありません。後でもう一度お試しください。', 'ko': '지금은 더 이상 이야기가 없습니다. 나중에 다시 시도해주세요.', 'th': 'ไม่มีเรื่องราวเพิ่มเติมในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง', 'vi': 'Hiện tại không có câu chuyện nào khác. Vui lòng thử lại sau.', 'ms': 'Tiada lagi cerita buat masa ini. Sila cuba lagi nanti.', 'la': 'Nullae fabulae nunc. Quaeso, postea iterum conare.' },
  back: {
    'zh-TW': '返回', 'zh-CN': '返回', 'en': 'Back', 'ja': '戻る', 'ko': '돌아가기', 'th': 'กลับ', 'vi': 'Quay lại', 'ms': 'Kembali', 'la': 'Redire'
  },
  logout: {
    'zh-TW': '登出', 'zh-CN': '登出', 'en': 'Logout', 'ja': 'ログアウト', 'ko': '로그아웃', 'th': 'ออกจากระบบ', 'vi': 'Đăng xuất', 'ms': 'Log keluar', 'la': 'Exire'
  },
  selectTag: {
    'zh-TW': '請選擇故事分類', 'zh-CN': '请选择故事分类', 'en': 'Please select story category', 'ja': 'ストーリーのカテゴリを選択してください', 'ko': '이야기 분류를 선택하세요', 'th': 'กรุณาเลือกหมวดหมู่เรื่องราว', 'vi': 'Vui lòng chọn phân loại câu chuyện', 'ms': 'Sila pilih kategori cerita', 'la': 'Elige genus fabulae'
  },
  titlePlaceholder: {
    'zh-TW': '請輸入標題(限30字)', 'zh-CN': '请输入标题(限30字)', 'en': 'Enter title (max 30 chars)', 'ja': 'タイトルを入力（30文字以内）', 'ko': '제목을 입력하세요(30자 이내)', 'th': 'กรอกชื่อเรื่อง (สูงสุด 30 ตัวอักษร)', 'vi': 'Nhập tiêu đề (tối đa 30 ký tự)', 'ms': 'Masukkan tajuk (maks 30 aksara)', 'la': 'Titulum insere (max 30 litterae)'
  },
  contentPlaceholder: {
    'zh-TW': '請輸入內容(限500字)', 'zh-CN': '请输入内容(限500字)', 'en': 'Enter content (max 500 chars)', 'ja': '内容を入力（500文字以内）', 'ko': '내용을 입력하세요(500자 이내)', 'th': 'กรอกเนื้อหา (สูงสุด 500 ตัวอักษร)', 'vi': 'Nhập nội dung (tối đa 500 ký tự)', 'ms': 'Masukkan kandungan (maks 500 aksara)', 'la': 'Contentum insere (max 500 litterae)'
  },
  greet: {
    'zh-TW': '歡迎，{name}！', 'zh-CN': '欢迎，{name}！', 'en': 'Welcome, {name}!', 'ja': 'ようこそ、{name}さん！', 'ko': '환영합니다, {name}!', 'th': 'ยินดีต้อนรับ, {name}!', 'vi': 'Chào mừng, {name}!', 'ms': 'Selamat datang, {name}!', 'la': 'Salve, {name}!'
  },
  formTitle: {
    'zh-TW': '分享你的故事', 'zh-CN': '分享你的故事', 'en': 'Share Your Story', 'ja': 'ストーリーを共有', 'ko': '이야기 공유', 'th': 'แบ่งปันเรื่องราวของคุณ', 'vi': 'Chia sẻ câu chuyện của bạn', 'ms': 'Kongsi Cerita Anda', 'la': 'Communica Fabulas Tuas'
  },
  formSubmit: {
    'zh-TW': '送出', 'zh-CN': '提交', 'en': 'Post', 'ja': '投稿', 'ko': '게시', 'th': 'โพสต์', 'vi': 'Đăng', 'ms': 'Hantar', 'la': 'Submittere'
  },
  encouragementDefault: {
    'zh-TW': '繼續前進！你的故事很重要。', 'zh-CN': '继续前进！你的故事很重要。', 'en': 'Keep going! Your story matters.', 'ja': '前に進もう！あなたのストーリーは大切です。', 'ko': '계속 나아가세요! 당신의 이야기는 소중합니다.', 'th': 'เดินหน้าต่อไป! เรื่องราวของคุณสำคัญ', 'vi': 'Tiếp tục nhé! Câu chuyện của bạn rất ý nghĩa.', 'ms': 'Teruskan! Cerita anda penting.', 'la': 'Perge! Fabula tua magni momenti est.'
  },
  storyQuote: {
    'zh-TW': '有些故事不為了解釋，只是為了放下！寫下來，也是一種放過自己... 寫下來，也是一種勇敢。',
    'zh-CN': '有些故事不是为了说明，只是为了放下！写下来，也是放过自己... 写下来，也是勇敢。',
    'en': 'Some stories are not for explanation, but for letting go. Writing them down is a way to release yourself... and a kind of courage.',
    'ja': 'いくつかの物語は説明のためではなく、手放すためのものです。書き出すことは自分を解放する方法であり、勇気でもあります。',
    'ko': '어떤 이야기는 설명을 위한 것이 아니라 내려놓기 위한 것입니다. 써내려가는 것은 자신을 놓아주는 방법이자, 용기입니다.',
    'th': 'เรื่องราวบางเรื่องไม่ได้มีไว้เพื่ออธิบาย แต่มีไว้เพื่อปล่อยวาง การเขียนออกมาก็เป็นการปลดปล่อยตัวเอง... และเป็นความกล้าหาญอย่างหนึ่ง',
    'vi': 'Có những câu chuyện không phải để giải thích, mà là để buông bỏ. Viết ra cũng là một cách tha thứ cho bản thân... và cũng là một sự dũng cảm.',
    'ms': 'Sesetengah cerita bukan untuk dijelaskan, tetapi untuk dilepaskan. Menulisnya adalah satu cara melepaskan diri... dan juga satu keberanian.',
    'la': 'Nonnullae fabulae non ad explicandum, sed ad dimittendum sunt. Scribere est te ipsum dimittere... et etiam audacia.'
  },
  storyQuoteLine1: {
    'zh-TW': '有些故事不是為了解釋，僅僅為了放下！',
    'zh-CN': '有些故事不是为了说明，仅仅为了放下！',
    'en': 'Some stories are not for explanation, merely for letting go!',
    'ja': 'いくつかの物語は説明のためではなく、単に手放すためのものです！',
    'ko': '어떤 이야기는 설명을 위한 것이 아니라 단지 내려놓기 위한 것입니다!',
    'th': 'เรื่องราวบางเรื่องไม่ได้มีไว้เพื่ออธิบาย แต่มีไว้เพียงเพื่อปล่อยวาง!',
    'vi': 'Có những câu chuyện không phải để giải thích, mà chỉ để buông bỏ!',
    'ms': 'Sesetengah cerita bukan untuk dijelaskan, tetapi hanya untuk dilepaskan!',
    'la': 'Nonnullae fabulae non ad explicandum, sed tantum ad dimittendum sunt!'
  },
  storyQuoteLine2: {
    'zh-TW': '寫下來，也是一種放過自己... 寫下來，也是一種勇敢。',
    'zh-CN': '写下来，也是放过自己... 写下来，也是勇敢。',
    'en': 'Writing it down is also a way to release yourself... Writing it down is also a kind of courage.',
    'ja': '書き出すことは自分を解放する方法でもあり... 書き出すことは勇気でもあります。',
    'ko': '써내려가는 것은 자신을 놓아주는 방법이기도 하고... 써내려가는 것은 용기이기도 합니다.',
    'th': 'การเขียนออกมาก็เป็นการปลดปล่อยตัวเอง... การเขียนออกมาก็เป็นความกล้าหาญอย่างหนึ่ง',
    'vi': 'Viết ra cũng là một cách tha thứ cho bản thân... Viết ra cũng là một sự dũng cảm.',
    'ms': 'Menulisnya adalah satu cara melepaskan diri... Menulisnya adalah satu keberanian.',
    'la': 'Scribere est te ipsum dimittere... Scribere est etiam audacia.'
  },
  storyQuoteLine3: {
    'zh-TW': '有人願意說出口，就有人不再那麼孤單，分享就是力量。',
    'zh-CN': '有人愿意说出口，就有人不再那么孤单，分享就是力量。',
    'en': 'When someone is willing to speak out, someone else is no longer alone. Sharing is power.',
    'ja': '誰かが声に出してくれることで、誰かがもう孤独ではなくなります。シェアすることは力です。',
    'ko': '누군가 말할 용기를 내면, 누군가는 더 이상 외롭지 않습니다. 나눔은 힘입니다.',
    'th': 'เมื่อมีใครสักคนกล้าที่จะพูดออกมา ก็จะมีใครสักคนที่ไม่ต้องโดดเดี่ยวอีกต่อไป การแบ่งปันคือพลัง',
    'vi': 'Khi ai đó dám nói ra, sẽ có người không còn cô đơn nữa. Chia sẻ là sức mạnh.',
    'ms': 'Apabila seseorang sanggup meluahkan, seseorang yang lain tidak lagi keseorangan. Berkongsi adalah kekuatan.',
    'la': 'Cum aliquis loqui velit, aliquis non iam solus est. Communicatio est potestas.'
  },
  blockchainNote: {
    'zh-TW': '💡 區塊鏈功能正在開發中，目前僅為標記功能，實際封存功能將在未來版本中推出',
    'zh-CN': '💡 区块链功能正在开发中，目前仅为标记功能，实际封存功能将在未来版本中推出',
    'en': '💡 Blockchain feature is under development. Currently only a marker function, actual preservation will be available in future versions',
    'ja': '💡 ブロックチェーン機能は開発中です。現在はマーカー機能のみで、実際の保存機能は将来のバージョンで提供予定です',
    'ko': '💡 블록체인 기능이 개발 중입니다. 현재는 마커 기능만 있으며, 실제 보존 기능은 향후 버전에서 제공될 예정입니다',
    'th': '💡 ฟีเจอร์บล็อกเชนกำลังอยู่ในขั้นตอนการพัฒนา ปัจจุบันเป็นเพียงฟังก์ชันเครื่องหมาย การเก็บรักษาจริงจะพร้อมใช้งานในเวอร์ชันอนาคต',
    'vi': '💡 Tính năng blockchain đang được phát triển. Hiện tại chỉ là chức năng đánh dấu, tính năng lưu trữ thực tế sẽ có trong phiên bản tương lai',
    'ms': '💡 Ciri blockchain sedang dalam pembangunan. Kini hanya fungsi penanda, fungsi pemeliharaan sebenar akan tersedia dalam versi masa hadapan',
    'la': '💡 Blockchain functio in progressu est. Nunc tantum signum functionis, vera conservatio in futuris versionibus praesto erit'
  },
  sharePower: {
    'zh-TW': '有人願意說出口，就有人不再那麼孤單，分享就是力量。',
    'zh-CN': '有人愿意说出口，就有人不再那么孤单，分享就是力量。',
    'en': 'When someone is willing to speak out, someone else is no longer alone. Sharing is power.',
    'ja': '誰かが声に出してくれることで、誰かがもう孤独ではなくなります。シェアすることは力です。',
    'ko': '누군가 말할 용기를 내면, 누군가는 더 이상 외롭지 않습니다. 나눔은 힘입니다.',
    'th': 'เมื่อมีใครสักคนกล้าที่จะพูดออกมา ก็จะมีใครสักคนที่ไม่ต้องโดดเดี่ยวอีกต่อไป การแบ่งปันคือพลัง',
    'vi': 'Khi ai đó dám nói ra, sẽ có người không còn cô đơn nữa. Chia sẻ là sức mạnh.',
    'ms': 'Apabila seseorang sanggup meluahkan, seseorang yang lain tidak lagi keseorangan. Berkongsi adalah kekuatan.',
    'la': 'Cum aliquis loqui velit, aliquis non iam solus est. Communicatio est potestas.'
  },
  storyPrompt: {
    'zh-TW': '如果只能留下一個故事，你想從哪裡開始呢？',
    'zh-CN': '如果只能留下一个故事，你想从哪里开始呢？',
    'en': 'If you could only leave one story, where would you start?',
    'ja': 'もし一つの物語しか残せないとしたら、どこから始めますか？',
    'ko': '만약 하나의 이야기만 남길 수 있다면, 어디서부터 시작하시겠습니까?',
    'th': 'หากคุณสามารถทิ้งเรื่องราวไว้เพียงเรื่องเดียว คุณจะเริ่มต้นจากที่ไหน?',
    'vi': 'Nếu bạn chỉ có thể để lại một câu chuyện, bạn sẽ bắt đầu từ đâu?',
    'ms': 'Jika anda hanya boleh tinggalkan satu cerita, di mana anda akan mula?',
    'la': 'Si unam tantum fabulam relinquere posses, unde inciperes?'
  },
  partnersStories: {
    'zh-TW': '夥伴們的分享',
    'zh-CN': '伙伴们的分享',
    'en': "Partners' Stories",
    'ja': '仲間たちのシェア',
    'ko': '파트너들의 이야기',
    'th': 'เรื่องราวของเพื่อนๆ',
    'vi': 'Chia sẻ của các bạn',
    'ms': 'Kisah Rakan-rakan',
    'la': 'Communicatio Sociorum'
  },
  myStories: {
    'zh-TW': '我的故事',
    'zh-CN': '我的故事',
    'en': 'My Stories',
    'ja': '私のストーリー',
    'ko': '나의 이야기',
    'th': 'เรื่องราวของฉัน',
    'vi': 'Câu chuyện của tôi',
    'ms': 'Cerita Saya',
    'la': 'Fabulae Meae'
  },
  friendStories: {
    'zh-TW': '好友故事',
    'zh-CN': '好友故事',
    'en': 'Friend Stories',
    'ja': '友達のストーリー',
    'ko': '친구 이야기',
    'th': 'เรื่องราวของเพื่อน',
    'vi': 'Câu chuyện bạn bè',
    'ms': 'Cerita Rakan',
    'la': 'Fabulae Amicorum'
  },
  returnMyStories: {
    'zh-TW': '返回我的故事',
    'zh-CN': '返回我的故事',
    'en': 'Return to My Stories',
    'ja': '自分のストーリーに戻る',
    'ko': '내 이야기로 돌아가기',
    'th': 'กลับไปที่เรื่องราวของฉัน',
    'vi': 'Quay lại câu chuyện của tôi',
    'ms': 'Kembali ke Cerita Saya',
    'la': 'Redi ad Fabulas Meas'
  },
  noFriends: {
    'zh-TW': '你還沒有好友連結，快去',
    'zh-CN': '你还没有好友连结，快去',
    'en': 'You have no friend connections yet, go to',
    'ja': 'まだ友達のつながりがありません。',
    'ko': '아직 친구 연결이 없습니다. 빨리',
    'th': 'คุณยังไม่มีการเชื่อมต่อเพื่อน',
    'vi': 'Bạn chưa có kết nối bạn bè nào, hãy đến',
    'ms': 'Anda masih tiada sambungan rakan, pergi ke',
    'la': 'Nondum amicos conexos habes, ad'
  },
  goToPairTalk: {
    'zh-TW': '交友區建立連結吧！',
    'zh-CN': '交友区建立连结吧！',
    'en': 'Go to Friend Zone to connect!',
    'ja': 'フレンドゾーンでつながろう！',
    'ko': '프렌드존에서 연결하세요!',
    'th': 'ไปที่ Friend Zone เพื่อเชื่อมต่อ!',
    'vi': 'đến Friend Zone để kết nối!',
    'ms': 'ke Friend Zone untuk sambung!',
    'la': 'ad Friend Zone coniunge!'
  },
  visibilityPrivate: {
    'zh-TW': '私密', 'zh-CN': '私密', 'en': 'Private', 'ja': '非公開', 'ko': '비공개', 'th': 'ส่วนตัว', 'vi': 'Riêng tư', 'ms': 'Peribadi', 'la': 'Privatus'
  },
  visibilityFriends: {
    'zh-TW': '限好友', 'zh-CN': '限好友', 'en': 'Friends Only', 'ja': '友達のみ', 'ko': '친구만', 'th': 'เฉพาะเพื่อน', 'vi': 'Chỉ bạn bè', 'ms': 'Hanya Rakan', 'la': 'Amicis Tantum'
  },
  visibilityPublic: {
    'zh-TW': '開放分享', 'zh-CN': '开放分享', 'en': 'Public', 'ja': '公開', 'ko': '공개', 'th': 'สาธารณะ', 'vi': 'Công khai', 'ms': 'Umum', 'la': 'Publicus'
  },
  storyCorrect: {
    'zh-TW': '是這樣沒錯', 'zh-CN': '是这样没错', 'en': "That's right", 'ja': 'その通りです', 'ko': '맞아요', 'th': 'ถูกต้องแล้ว', 'vi': 'Đúng vậy', 'ms': 'Betul', 'la': 'Ita vero'
  },
  profileGenderCountry: {
    'zh-TW': '{gender}{country}', 'zh-CN': '{gender}{country}', 'en': '{gender} {country}', 'ja': '{gender}{country}', 'ko': '{gender} {country}', 'th': '{gender}{country}', 'vi': '{gender}{country}', 'ms': '{gender}{country}', 'la': '{gender}{country}'
  },
  profileLabels: {
    'zh-TW': '暱稱：{nickname}\n性別：{gender}\n年齡：{age}\n國家/地區：{country}\n興趣：{interest}\n事件類型：{eventType}',
    'zh-CN': '昵称：{nickname}\n性别：{gender}\n年龄：{age}\n国家/地区：{country}\n兴趣：{interest}\n事件类型：{eventType}',
    'en': 'Nickname: {nickname}\nGender: {gender}\nAge: {age}\nCountry/Region: {country}\nInterest: {interest}\nEvent Type: {eventType}',
    'ja': 'ニックネーム：{nickname}\n性別：{gender}\n年齢：{age}\n国/地域：{country}\n興味：{interest}\nイベントタイプ：{eventType}',
    'ko': '닉네임: {nickname}\n성별: {gender}\n나이: {age}\n국가/지역: {country}\n관심사: {interest}\n이벤트 유형: {eventType}',
    'th': 'ชื่อเล่น: {nickname}\nเพศ: {gender}\nอายุ: {age}\nประเทศ/ภูมิภาค: {country}\nความสนใจ: {interest}\nประเภทเหตุการณ์: {eventType}',
    'vi': 'Biệt danh: {nickname}\nGiới tính: {gender}\nTuổi: {age}\nQuốc gia/Khu vực: {country}\nSở thích: {interest}\nLoại sự kiện: {eventType}',
    'ms': 'Nama panggilan: {nickname}\nJantina: {gender}\nUmur: {age}\nNegara/Wilayah: {country}\nMinat: {interest}\nJenis Acara: {eventType}',
    'la': 'Cognomen: {nickname}\nSexus: {gender}\nAetas: {age}\nPatria/Regio: {country}\nStudium: {interest}\nGenus Eventus: {eventType}'
  },
};

// 頭像顏色
const AVATAR_BG = [
  'bg-gradient-to-br from-[#7f8fff] to-[#b6b6f6]',
  'bg-gradient-to-br from-[#ffb6b6] to-[#ffd6e0]',
  'bg-gradient-to-br from-[#6be6ff] to-[#b6f6ff]',
  'bg-gradient-to-br from-[#ffe66b] to-[#ffb86b]'
];
function getAvatarColor(name: string | null | undefined) {
  if (!name || typeof name !== 'string') return AVATAR_BG[0];
  let sum = 0;
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
  return AVATAR_BG[sum % AVATAR_BG.length];
}

type StoryType = {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  createdAt?: { toDate?: () => Date } | Date;
  comments?: { content: string; author: string; createdAt?: { toDate?: () => Date } | Date }[];
  encouragement?: string;
  encouragementLangs?: Partial<Record<LangCode, string>>;
  tag?: string;
  visibility?: string;
  onChain?: boolean;
  titleLangs?: Partial<Record<LangCode, string>>;
  contentLangs?: Partial<Record<LangCode, string>>;
};

// 1. 定義本地詞彙物件
const TAGS_TEXT: Record<LangCode, { [key: string]: string }> = {
  'zh-TW': {
    work_restart: '工作重啟', family_trust: '家庭信任', social_treatment: '社會對待', inner_choice: '內心選擇', misunderstood_and_recovered: '誤解與復原', restart_path: '重啟之路'
  },
  'zh-CN': {
    work_restart: '工作重启', family_trust: '家庭信任', social_treatment: '社会对待', inner_choice: '内心选择', misunderstood_and_recovered: '误解与复原', restart_path: '重启之路'
  },
  'en': {
    work_restart: 'Work Restart', family_trust: 'Family Trust', social_treatment: 'Social Treatment', inner_choice: 'Inner Choice', misunderstood_and_recovered: 'Misunderstood & Recovered', restart_path: 'Restart Path'
  },
  'ja': {
    work_restart: '仕事の再出発', family_trust: '家族の信頼', social_treatment: '社会の扱い', inner_choice: '内なる選択', misunderstood_and_recovered: '誤解と回復', restart_path: '再出発の道'
  },
  'ko': {
    work_restart: '일 재시작', family_trust: '가족의 신뢰', social_treatment: '사회적 대우', inner_choice: '내면의 선택', misunderstood_and_recovered: '오해와 회복', restart_path: '재시작의 길'
  },
  'th': {
    work_restart: 'เริ่มงานใหม่', family_trust: 'ความไว้วางใจในครอบครัว', social_treatment: 'การปฏิบัติของสังคม', inner_choice: 'ทางเลือกภายในใจ', misunderstood_and_recovered: 'ความเข้าใจผิดและการฟื้นฟู', restart_path: 'เส้นทางเริ่มต้นใหม่'
  },
  'vi': {
    work_restart: 'Khởi động lại công việc', family_trust: 'Niềm tin gia đình', social_treatment: 'Cách đối xử của xã hội', inner_choice: 'Lựa chọn nội tâm', misunderstood_and_recovered: 'Hiểu lầm và phục hồi', restart_path: 'Con đường làm lại'
  },
  'ms': {
    work_restart: 'Mula Kerja Semula', family_trust: 'Kepercayaan Keluarga', social_treatment: 'Layanan Sosial', inner_choice: 'Pilihan Dalaman', misunderstood_and_recovered: 'Salah Faham & Pemulihan', restart_path: 'Jalan Permulaan Semula'
  },
  'la': {
    work_restart: 'Opus Renovatum', family_trust: 'Fides Familiaris', social_treatment: 'Tractatio Socialis', inner_choice: 'Electio Interior', misunderstood_and_recovered: 'Error et Recuperatio', restart_path: 'Iter Renovationis'
  }
};
const BLOCKCHAIN_TEXT: Record<LangCode, string> = {
  'zh-TW': '✔ 我願意將這段見證封存於區塊鏈（開發中）',
  'zh-CN': '✔ 我愿意将这段见证封存于区块链（开发中）',
  'en': '✔ I agree to preserve this testimony on the blockchain (In Development)',
  'ja': '✔ この証言をブロックチェーンに保存することに同意します（開発中）',
  'ko': '✔ 이 증언을 블록체인에 보존하는 것에 동의합니다（개발 중）',
  'th': '✔ ฉันยินยอมให้บันทึกเรื่องราวนี้บนบล็อกเชน（กำลังพัฒนา）',
  'vi': '✔ Tôi đồng ý lưu giữ câu chuyện này trên blockchain (Đang phát triển)',
  'ms': '✔ Saya bersetuju untuk menyimpan kisah ini di blockchain (Dalam Pembangunan)',
  'la': '✔ Assentior hanc testificationem in blockchain servari (In Progressu)'
};
const VISIBILITY_TEXT: Record<LangCode, { private: string; friends: string; public: string; label: string }> = {
  'zh-TW': { private: '只有我', friends: '好友可見', public: '所有人', label: '誰可以看到這段故事？' },
  'zh-CN': { private: '只有我', friends: '好友可见', public: '所有人', label: '谁可以看到这段故事？' },
  'en': { private: 'Only me', friends: 'Friends only', public: 'Everyone', label: 'Who can see this story?' },
  'ja': { private: '自分だけ', friends: '友達のみ', public: '全員', label: '誰がこのストーリーを見られますか？' },
  'ko': { private: '나만 보기', friends: '친구만 보기', public: '모두 보기', label: '이 이야기를 누가 볼 수 있나요?' },
  'th': { private: 'เฉพาะฉัน', friends: 'เพื่อนเท่านั้น', public: 'ทุกคน', label: 'ใครสามารถเห็นเรื่องราวนี้ได้บ้าง?' },
  'vi': { private: 'Chỉ mình tôi', friends: 'Chỉ bạn bè', public: 'Mọi người', label: 'Ai có thể xem câu chuyện này?' },
  'ms': { private: 'Hanya saya', friends: 'Hanya rakan', public: 'Semua orang', label: 'Siapa boleh melihat cerita ini?' },
  'la': { private: 'Solus ego', friends: 'Amici tantum', public: 'Omnes', label: 'Quis hanc historiam videre potest?' }
};

// 1. 新增一週 7 天 intro 語錄多語物件
const INTRO_TEXT: Record<LangCode, { [key: string]: string }> = {
  'zh-TW': {
    'intro.monday': '🗓️「這週才剛開始，你不需要完美，只需要一點點願意。」',
    'intro.tuesday': '📎「有些故事不為了解釋，只是為了放下。寫下來，也是一種放過自己。」',
    'intro.wednesday': '🌀「今天也許不太好過，但你願意打開這裡，就是一種勇氣。」',
    'intro.thursday': '🪞「不要怕你寫得不好，這裡沒有誰評分，只有人在傾聽。」',
    'intro.friday': '☕「週末快到了，你可以選擇留下些什麼，再好好放下些什麼。」',
    'intro.saturday': '🎧「願你在這裡找到一點共鳴、一點出口，不為誰，只為自己。」',
    'intro.sunday': '🌙「如果你願意分享，那段日子就不再只是沉默。」'
  },
  'zh-CN': {
    'intro.monday': '��️「这周才刚开始，你不需要完美，只需要一点点愿意。」',
    'intro.tuesday': '📎「有些故事不是为了说明，只是为了放下。写下来，也是放过自己。」',
    'intro.wednesday': '🌀「今天也许不太好过，但你愿意打开这里，就是一种勇气。」',
    'intro.thursday': '🪞「不要怕你写得不好，这里没有人打分，只有人在倾听。」',
    'intro.friday': '☕「周末快到了，你可以选择留下什么，再好好放下什么。」',
    'intro.saturday': '🎧「愿你在这里找到一点共鸣，一点出口，不为谁，只为自己。」',
    'intro.sunday': '🌙「如果你愿意分享，那段日子就不再只是沉默。」'
  },
  'en': {
    'intro.monday': '🗓️ "It\'s just the start of the week. You don\'t have to be perfect, just a little willing."',
    'intro.tuesday': '📎 "Some stories aren\'t for explaining, just for letting go. Writing is a way to set yourself free."',
    'intro.wednesday': '🌀 "Today might be tough, but opening up here is already an act of courage."',
    'intro.thursday': '🪞 "Don\'t worry about writing perfectly. No one is judging here—only listening."',
    'intro.friday': '☕ "The weekend is near. You can choose what to keep, and what to let go."',
    'intro.saturday': '🎧 "May you find some resonance and an outlet here—not for anyone else, just for yourself."',
    'intro.sunday': '🌙 "If you\'re willing to share, those days are no longer just silence."'
  },
  'ja': {
    'intro.monday': '🗓️「今週はまだ始まったばかり。完璧でなくていい、少しの勇気で十分です。」',
    'intro.tuesday': '📎「説明のためじゃなく、手放すための物語もある。書くことは自分を解放すること。」',
    'intro.wednesday': '🌀「今日はつらいかもしれない。でもここを開いたあなたは、もう勇気を出しています。」',
    'intro.thursday': '🪞「うまく書けなくても大丈夫。ここには評価する人はいません、ただ聴く人がいるだけです。」',
    'intro.friday': '☕「週末が近づいています。何を残し、何を手放すかはあなた次第。」',
    'intro.saturday': '🎧「ここで少しの共鳴と出口が見つかりますように。他の誰のためでもなく、自分のために。」',
    'intro.sunday': '🌙「もしあなたが分かち合うなら、その日々はもう沈黙だけではありません。」'
  },
  'ko': {
    'intro.monday': '🗓️ "이번 주는 이제 시작이에요. 완벽할 필요 없어요, 약간의 용기면 충분해요."',
    'intro.tuesday': '📎 "어떤 이야기는 설명이 아니라 내려놓기 위한 것. 써내려가는 것만으로도 자신을 놓아주는 거예요."',
    'intro.wednesday': '🌀 "오늘이 힘들 수 있지만, 이곳을 열었다는 것만으로도 이미 용기입니다."',
    'intro.thursday': '🪞 "잘 쓰지 않아도 괜찮아요. 여긴 점수 매기는 곳이 아니라, 들어주는 곳이에요."',
    'intro.friday': '☕ "주말이 다가오고 있어요. 무엇을 남기고, 무엇을 놓을지 선택할 수 있어요."',
    'intro.saturday': '🎧 "여기서 공감과 출구를 찾길 바랍니다. 누구를 위한 게 아니라, 오직 나를 위해."',
    'intro.sunday': '🌙 "당신이 나누고 싶다면, 그날들은 더 이상 침묵만은 아닙니다."'
  },
  'th': {
    'intro.monday': '🗓️ "สัปดาห์นี้เพิ่งเริ่มต้น คุณไม่จำเป็นต้องสมบูรณ์แบบ แค่มีความตั้งใจก็พอ"',
    'intro.tuesday': '📎 "บางเรื่องไม่ได้เขียนเพื่ออธิบาย แต่เพื่อปล่อยวาง การเขียนคือการปลดปล่อยตัวเอง"',
    'intro.wednesday': '🌀 "วันนี้อาจจะไม่ง่าย แต่แค่คุณเปิดหน้านี้ก็ถือว่ากล้าหาญแล้ว"',
    'intro.thursday': '🪞 "ไม่ต้องกลัวว่าจะเขียนไม่ดี ที่นี่ไม่มีใครตัดสิน มีแต่คนรับฟัง"',
    'intro.friday': '☕ "วันหยุดสุดสัปดาห์ใกล้เข้ามาแล้ว คุณเลือกได้ว่าจะเก็บอะไรไว้ และปล่อยอะไรไป"',
    'intro.saturday': '🎧 "ขอให้คุณพบความรู้สึกและทางออกที่นี่ ไม่ใช่เพื่อใคร แต่เพื่อคุณเอง"',
    'intro.sunday': '🌙 "ถ้าคุณพร้อมจะแบ่งปัน วันเหล่านั้นจะไม่ใช่แค่ความเงียบอีกต่อไป"'
  },
  'vi': {
    'intro.monday': '🗓️ "Tuần mới chỉ vừa bắt đầu. Bạn không cần phải hoàn hảo, chỉ cần một chút sẵn lòng."',
    'intro.tuesday': '📎 "Có những câu chuyện không phải để giải thích, mà là để buông bỏ. Viết ra cũng là tự giải thoát cho mình."',
    'intro.wednesday': '🌀 "Hôm nay có thể không dễ dàng, nhưng chỉ cần bạn mở trang này đã là một sự dũng cảm."',
    'intro.thursday': '🪞 "Đừng lo lắng nếu bạn viết chưa hay. Ở đây không ai chấm điểm, chỉ có người lắng nghe."',
    'intro.friday': '☕ "Cuối tuần sắp đến rồi. Bạn có thể chọn giữ lại điều gì, và buông bỏ điều gì."',
    'intro.saturday': '🎧 "Chúc bạn tìm thấy sự đồng cảm và lối thoát ở đây. Không phải cho ai khác, mà cho chính mình."',
    'intro.sunday': '🌙 "Nếu bạn sẵn sàng chia sẻ, những ngày đó sẽ không còn là sự im lặng."'
  },
  'ms': {
    'intro.monday': '🗓️ "Minggu ini baru bermula. Anda tidak perlu sempurna, cukup sekadar bersedia."',
    'intro.tuesday': '📎 "Ada cerita bukan untuk dijelaskan, tetapi untuk dilepaskan. Menulis adalah cara membebaskan diri."',
    'intro.wednesday': '🌀 "Hari ini mungkin sukar, tetapi membuka halaman ini sudah cukup berani."',
    'intro.thursday': '🪞 "Jangan takut jika anda menulis tidak bagus. Di sini tiada siapa menilai, hanya ada yang mendengar."',
    'intro.friday': '☕ "Hujung minggu hampir tiba. Anda boleh memilih apa yang ingin disimpan, dan apa yang ingin dilepaskan."',
    'intro.saturday': '🎧 "Semoga anda temui sedikit resonans dan jalan keluar di sini. Bukan untuk sesiapa, hanya untuk diri sendiri."',
    'intro.sunday': '🌙 "Jika anda sudi berkongsi, hari-hari itu tidak lagi hanya diam."'
  },
  'la': {
    'intro.monday': '🗓️ "Haec hebdomas modo coepit. Non opus est ut perfectus sis, sed paulum voluntatis satis est."',
    'intro.tuesday': '📎 "Nonnullae fabulae non ad explicandum, sed ad dimittendum sunt. Scribere est te ipsum liberare."',
    'intro.wednesday': '🌀 "Hodie fortasse difficilis est, sed hanc paginam aperire iam est audacia."',
    'intro.thursday': '🪞 "Noli timere si male scribis. Hic nemo iudicat, tantum auscultat."',
    'intro.friday': '☕ "Fere adest finis hebdomadis. Potes eligere quid retineas, quid dimittas."',
    'intro.saturday': '🎧 "Spero te hic resonantiam et exitum invenire. Non pro aliis, sed pro te ipso."',
    'intro.sunday': '🌙 "Si communicare vis, illi dies iam non sunt solum silentium."'
  }
};

// 0. 新增文案多語
const UX_TEXT: Record<LangCode, any> = {
  'zh-TW': {
    launch: '寫下來，也是⼀種勇敢。',
    ask: '如果只能留下一個故事，你會從哪裡說起？',
    thanks: '🎉 感謝你分享，這是你的故事',
    success: '你寫得很好，這段經歷值得被看見。',
    randomEncourage: [
      '你的過去不定義你，選擇講述它，才是你的力量。',
      '每個故事都值得被聽見。',
      '你願意分享真心，我們願意陪你走一段。',
      '你的經歷很珍貴，謝謝你願意說出來。'
    ],
    chain: '我要將這段故事封存於區塊鏈',
    anonymous: '我要匿名分享',
    countryName: { '中國大陸': '中國大陸', '台灣': '台灣', '日本': '日本', '韓國': '韓國', '美國': '美國', '其他': '其他' },
    eventTypeName: { '家暴加害': '家暴加害', '家暴受害': '家暴受害', '其他': '其他' }
  },
  'zh-CN': {
    launch: '写下来，也是一种勇敢。',
    ask: '这次你想聊的是什么？',
    thanks: '🎉 感谢你的分享，这是你的故事',
    success: '你写得很好，这段经历值得被看见。',
    randomEncourage: [
      '你的过去不定义你，选择讲述它，才是你的力量。',
      '每个故事都值得被听见。',
      '你愿意分享真心，我们愿意陪你走一段。',
      '你的经历很珍贵，谢谢你愿意说出来。'
    ],
    chain: '我要将这段故事封存于区块链',
    anonymous: '我要匿名分享',
    countryName: { '中國大陸': '中国大陆', '台灣': '台湾', '日本': '日本', '韓國': '韩国', '美國': '美国', '其他': '其他' },
    eventTypeName: { '家暴加害': '家暴加害', '家暴受害': '家暴受害', '其他': '其他' }
  },
  'en': {
    launch: 'Writing it down is also an act of courage.',
    ask: 'What do you want to talk about this time?',
    thanks: '🎉 Thank you for sharing, this is your story',
    success: 'You wrote beautifully. This experience deserves to be seen.',
    randomEncourage: [
      'Your past does not define you. Choosing to tell it is your power.',
      'Every story deserves to be heard.',
      'You share your heart, we walk with you.',
      'Your experience is precious, thank you for sharing.'
    ],
    chain: 'I want to preserve this story on the blockchain',
    anonymous: 'I want to share anonymously',
    countryName: { '中國大陸': 'China', '台灣': 'Taiwan', '日本': 'Japan', '韓國': 'Korea', '美國': 'USA', '其他': 'Other' },
    eventTypeName: { '家暴加害': 'Domestic Violence Perpetrator', '家暴受害': 'Domestic Violence Victim', '其他': 'Other' }
  },
  'ja': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' },
  'ko': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' },
  'th': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' },
  'vi': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' },
  'ms': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' },
  'la': { launch: '', ask: '', thanks: '', success: '', randomEncourage: [''], chain: '', anonymous: '' }
};

// 1. 新增自動翻譯函式
async function translateAll(text: string, from: LangCode, toList: LangCode[]): Promise<Partial<Record<LangCode, string>>> {
  const result: Partial<Record<LangCode, string>> = { [from]: text };
  for (const to of toList) {
    if (to === from) continue;
    try {
      // 優先用 OpenAI GPT-4o
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, from, to })
      });
      const data = await res.json();
      result[to] = data.translated || '';
    } catch {
      // fallback: Google Translate
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
        const data = await res.json();
        result[to] = data[0]?.map((d: any) => d[0]).join('') || '';
      } catch {
        result[to] = '';
      }
    }
  }
  return result;
}

// 取得顯示用 title/content 的輔助函式
function getStoryTitle(story: any, lang: LangCode) {
  return (story.titleLangs && story.titleLangs[lang]) || story.title;
}
function getStoryContent(story: any, lang: LangCode) {
  return (story.contentLangs && story.contentLangs[lang]) || story.content;
}

// 1. 將 countryName 與 eventTypeName 拆出為獨立物件
const COUNTRY_NAME: Record<LangCode, Record<string, string>> = {
  'zh-TW': { '中國大陸': '中國大陸', '台灣': '台灣', '日本': '日本', '韓國': '韓國', '美國': '美國', '其他': '其他' },
  'zh-CN': { '中國大陸': '中国大陆', '台灣': '台湾', '日本': '日本', '韓國': '韩国', '美國': '美国', '其他': '其他' },
  'en': { '中國大陸': 'China', '台灣': 'Taiwan', '日本': 'Japan', '韓國': 'Korea', '美國': 'USA', '其他': 'Other' },
  'ja': { '中國大陸': '中国大陸', '台灣': '台湾', '日本': '日本', '韓國': '韓国', '美國': 'アメリカ', '其他': 'その他' },
  'ko': { '中國大陸': '중국', '台灣': '대만', '日本': '일본', '韓國': '한국', '美國': '미국', '其他': '기타' },
  'th': { '中國大陸': 'จีน', '台灣': 'ไต้หวัน', '日本': 'ญี่ปุ่น', '韓國': 'เกาหลี', '美國': 'สหรัฐอเมริกา', '其他': 'อื่นๆ' },
  'vi': { '中國大陸': 'Trung Quốc', '台灣': 'Đài Loan', '日本': 'Nhật Bản', '韓國': 'Hàn Quốc', '美國': 'Mỹ', '其他': 'Khác' },
  'ms': { '中國大陸': 'China', '台灣': 'Taiwan', '日本': 'Jepun', '韓國': 'Korea', '美國': 'Amerika', '其他': 'Lain-lain' },
  'la': { '中國大陸': 'Sina', '台灣': 'Taiwan', '日本': 'Iaponia', '韓國': 'Corea', '美國': 'CFA', '其他': 'Aliud' }
};
const EVENT_TYPE_NAME: Record<LangCode, Record<string, string>> = {
  'zh-TW': { '家暴加害': '家暴加害', '家暴受害': '家暴受害', '其他': '其他' },
  'zh-CN': { '家暴加害': '家暴加害', '家暴受害': '家暴受害', '其他': '其他' },
  'en': { '家暴加害': 'Domestic Violence Perpetrator', '家暴受害': 'Domestic Violence Victim', '其他': 'Other' },
  'ja': { '家暴加害': '家庭内暴力加害者', '家暴受害': '家庭内暴力被害者', '其他': 'その他' },
  'ko': { '家暴加害': '가정폭력 가해자', '家暴受害': '가정폭력 피해자', '其他': '기타' },
  'th': { '家暴加害': 'ผู้กระทำความรุนแรงในครอบครัว', '家暴受害': 'เหยื่อความรุนแรงในครอบครัว', '其他': 'อื่นๆ' },
  'vi': { '家暴加害': 'Người gây bạo lực gia đình', '家暴受害': 'Nạn nhân bạo lực gia đình', '其他': 'Khác' },
  'ms': { '家暴加害': 'Pelaku Keganasan Rumah Tangga', '家暴受害': 'Mangsa Keganasan Rumah Tangga', '其他': 'Lain-lain' },
  'la': { '家暴加害': 'Violentus Domesticus', '家暴受害': 'Victima Violentiae Domesticae', '其他': 'Aliud' }
};

const StoryWall = () => {
  const db = getFirestore(app);
  const auth = getAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  // 1. lang 預設值與型別明確
  const [lang, setLang] = useState<LangCode>('zh-TW');
  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored && ['zh-TW','zh-CN','en','ja','ko','th','vi','ms','la'].includes(stored)) {
      setLang(stored as LangCode);
    }
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<StoryType[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [commentStoryId, setCommentStoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState('');
  const [onChain, setOnChain] = useState(false);
  const [visibility, setVisibility] = useState('public');
  const [tagsData, setTagsData] = useState<{ tags: Record<string, string> }>({ tags: {} });
  const [justPosted, setJustPosted] = useState<StoryType|null>(null);
  const [showPublicWall, setShowPublicWall] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingDots, setWaitingDots] = useState('');
  const [expandedStoryId, setExpandedStoryId] = useState<string|null>(null);
  const [fixedEncourage, setFixedEncourage] = useState<string>('');
  const [showMyStories, setShowMyStories] = useState(false);
  const [profiles, setProfiles] = useState<{[key: string]: UserProfile}>({});
  // 1. 新增 name->profile map
  const [profilesByName, setProfilesByName] = useState<{[key: string]: UserProfile}>({});
  const [profilesByEmail, setProfilesByEmail] = useState<{[key:string]: UserProfile}>({});
  // 新增一個 state 控制顯示哪個分頁
  const [showFriendsStories, setShowFriendsStories] = useState(false);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [showLangBox, setShowLangBox] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    const load = async () => {
      const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setStories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoryType)));
    };
    load();
  }, [db]);

  useEffect(() => {
    // 使用 fetch 來動態加載 tags.json 文件
    fetch(`/locales/${lang}/tags.json`)
      .then(response => response.json())
      .then(data => setTagsData(data))
      .catch(() => setTagsData({ tags: {} }));
  }, [lang]);

  useEffect(() => {
    let dotTimer: any;
    if (isWaiting) {
      let dotCount = 0;
      dotTimer = setInterval(() => {
        dotCount = (dotCount + 1) % 6;
        setWaitingDots('.'.repeat(dotCount));
      }, 400);
    } else {
      setWaitingDots('');
    }
    return () => clearInterval(dotTimer);
  }, [isWaiting]);

  useEffect(() => {
    async function fetchProfiles() {
      const profilesCol = await import('firebase/firestore').then(firestore => firestore.getDocs(firestore.collection(db, 'profiles')));
      const byName: {[key:string]:any} = {};
      profilesCol.forEach((doc:any) => {
        const data = doc.data();
        if (data.nickname) byName[data.nickname] = data;
        if (data.name) byName[data.name] = data;
      });
      setProfilesByName(byName);
    }
    fetchProfiles();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      const profilesCol = await import('firebase/firestore').then(firestore => firestore.getDocs(firestore.collection(db, 'profiles')));
      const byEmail: {[key:string]:any} = {};
      profilesCol.forEach((doc:any) => {
        const data = doc.data();
        if (data.email) byEmail[data.email] = data;
      });
      setProfilesByEmail(byEmail);
    }
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (user) {
      // 取得好友名單（從 links collection 查詢 status 為 connected 的 user2Id 或 user1Id）
      const fetchFriends = async () => {
        const linksRef = collection(db, 'links');
        const q1 = query(linksRef, where('user1Id', '==', user.uid), where('status', '==', 'connected'));
        const q2 = query(linksRef, where('user2Id', '==', user.uid), where('status', '==', 'connected'));
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const ids = new Set<string>();
        snap1.forEach(doc => ids.add(doc.data().user2Id));
        snap2.forEach(doc => ids.add(doc.data().user1Id));
        setFriendsList(Array.from(ids));
      };
      fetchFriends();
    }
  }, [user]);

  // 點擊空白處關閉下拉選項
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.language-selector') && !target.closest('.legal-menu')) {
        setShowLangBox(false);
        setShowLegalMenu(false);
      }
    };

    if (showLangBox || showLegalMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLangBox, showLegalMenu]);

  // 2. handleAddStory 時自動翻譯 title/content
  const handleAddStory = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsWaiting(true);
    setShowPublicWall(false);
    let dotCount = 0;
    const dotTimer = setInterval(() => {
      dotCount = (dotCount + 1) % 6;
      setWaitingDots('.'.repeat(dotCount));
    }, 400);
    
    try {
      setLoading(true);
      
      // 並行處理：同時進行AI鼓勵和多語翻譯
      const [encouragementRes, titleLangs, contentLangs] = await Promise.all([
        // AI鼓勵語（可選，如果失敗就用隨機鼓勵語）
        fetch('/api/gpt/encourage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story: content })
        }).then(res => res.json()).catch(() => ({ encouragement: '' })),
        
        // 標題翻譯（只翻譯主要語言，減少成本）
        translateAll(title, lang, ['zh-TW', 'zh-CN', 'en'] as LangCode[]),
        
        // 內容翻譯（只翻譯主要語言，減少成本）
        translateAll(content, lang, ['zh-TW', 'zh-CN', 'en'] as LangCode[])
      ]);
      
      const encouragement = encouragementRes.encouragement || '';
      
      // 鼓勵語翻譯（如果AI鼓勵語存在才翻譯）
      const encouragementLangs = encouragement ? 
        await translateAll(encouragement, lang, ['zh-TW', 'zh-CN', 'en'] as LangCode[]) : 
        {};
      
      // 隨機鼓勵語作為備用
      const randomEnc = UX_TEXT[safeLang].randomEncourage;
      const chosenEnc = randomEnc[Math.floor(Math.random()*randomEnc.length)];
      setFixedEncourage(chosenEnc);
      
      // 儲存故事
      await addDoc(collection(db, 'stories'), {
        title, content, author: user?.displayName || '匿名', authorEmail: user?.email || '', createdAt: new Date(), comments: [], likes: 0, encouragement, encouragementLangs, tag, visibility, onChain,
        titleLangs, contentLangs
      });
      
      setTitle(''); setContent(''); setLoading(false);
      const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const allStories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoryType));
      setStories(allStories);
      setJustPosted(allStories[0] || null);
      
    } catch (error) {
      console.error('Error adding story:', error);
      // 即使出錯也要清理狀態
      setTitle(''); setContent(''); setLoading(false);
    } finally {
      clearInterval(dotTimer);
      setIsWaiting(false);
    }
  };

  const handleAddComment = async (storyId: string) => {
    if (!comment.trim()) return;
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    const updatedComments = [...(story.comments || []), { content: comment, author: user?.displayName || '匿名', createdAt: new Date() }];
    await updateDoc(doc(db, 'stories', storyId), { comments: updatedComments });
    setComment(''); setCommentStoryId(null);
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setStories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoryType)));
  };

  const handleLike = async (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (!story) return;
    const currentLikes = (story as any).likes || 0;
    await updateDoc(doc(db, 'stories', storyId), { likes: currentLikes + 1 });
    const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setStories(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StoryType)));
  };

  // 假AI鼓勵語（可串接API）
  function getEncouragement(story: StoryType) {
    if (story.encouragementLangs && story.encouragementLangs[safeLang]) return story.encouragementLangs[safeLang] as string;
    return story.encouragement || UI_TEXT.encouragementDefault[safeLang];
  }

  // 2. 標題下方顯示今日語錄
  const weekdayKey = ['intro.sunday','intro.monday','intro.tuesday','intro.wednesday','intro.thursday','intro.friday','intro.saturday'][new Date().getDay()];

  // 刪除故事功能
  const handleDeleteStory = async (storyId: string) => {
    await deleteDoc(doc(db, 'stories', storyId));
    setStories(stories.filter(s => s.id !== storyId));
    if (justPosted && justPosted.id === storyId) setJustPosted(null);
  };

  const handleVisibilityChange = (value: string) => {
    setVisibility(value);
    if (value !== 'public') {
      setOnChain(false);
    }
  };

  // 在 StoryWall 組件最外層（函式內部，return 之前）定義 safeLang，並型別保證：
  const safeLang: LangCode = (lang as LangCode) || 'zh-TW';

  return (
    <div>
      {window.innerWidth <= 768 ? (
        // 手機版：只顯示主標題、副標題和Footer
        <>
          {/* 手機版共用頁頭 */}
          <div className="mobile-shared-header">
            <SharedHeader />
          </div>
          
          {/* 主標題卡片 - 隨頁面滾動 */}
          <div style={{ marginTop: '80px', marginBottom: 16, width: '240px', marginLeft: 'auto', marginRight: 'auto', background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '12px 16px', boxShadow: '0 2px 12px #6B5BFF22', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6B5BFF' }}>📖</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6B5BFF' }}>{UI_TEXT.pageTitle[safeLang]}</span>
            </div>
          </div>
          {/* 副標題三行卡片 */}
          <div style={{ marginBottom: 16, background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '16px', boxShadow: '0 2px 12px #6B5BFF22', textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: '#000', fontWeight: 600, marginBottom: 8 }}>{UI_TEXT.storyQuoteLine1[safeLang]}</div>
            <div style={{ fontSize: 14, color: '#000', fontWeight: 600, marginBottom: 8 }}>{UI_TEXT.storyQuoteLine2[safeLang]}</div>
            <div style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>{UI_TEXT.storyQuoteLine3[safeLang]}</div>
          </div>
          
          {/* 手機版表單區域 */}
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 2px 12px #6B5BFF22' }}>
            <div style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 17, letterSpacing: 1, textAlign: 'center', marginBottom: 16 }}>
              {UI_TEXT.formTitle[safeLang]}
            </div>
            <div style={{ fontSize: 16, color: '#6B5BFF', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
              {UI_TEXT.storyPrompt[safeLang]}
            </div>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={UI_TEXT.titlePlaceholder[safeLang]} style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 16, border: '1px solid #ddd', fontSize: 16, marginBottom: 8, color: '#232946' }} />
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder={UI_TEXT.contentPlaceholder[safeLang]} style={{ width: '100%', height: 120, boxSizing: 'border-box', padding: 12, borderRadius: 16, border: '1px solid #ddd', fontSize: 16, marginBottom: 8, color: '#232946', resize: 'none' }} />
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8, fontSize: 15 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => handleVisibilityChange('private')} /> {UI_TEXT.visibilityPrivate[safeLang]}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input type="radio" name="visibility" value="friends" checked={visibility === 'friends'} onChange={() => handleVisibilityChange('friends')} /> {UI_TEXT.visibilityFriends[safeLang]}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => handleVisibilityChange('public')} /> {UI_TEXT.visibilityPublic[safeLang]}
              </label>
            </div>
            {visibility === 'public' && (
              <div style={{ marginBottom: 8 }}>
                <label style={{ display:'flex',alignItems:'center',fontSize:15 }}>
                  <input type="checkbox" checked={onChain} onChange={e => setOnChain(e.target.checked)} style={{marginRight:4}} /> {BLOCKCHAIN_TEXT[safeLang]}
                </label>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontStyle: 'italic' }}>
                  {UI_TEXT.blockchainNote[safeLang]}
                </div>
              </div>
            )}
            <button onClick={handleAddStory} disabled={loading} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 17, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
              {UI_TEXT.formSubmit[safeLang]}
            </button>
          </div>
          
          {/* 手機版故事卡片區域 */}
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: 16, padding: '16px', marginBottom: 16, boxShadow: '0 2px 12px #6B5BFF22' }}>
            {/* 手機版故事分類按鈕 */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
              <button onClick={() => { setShowPublicWall(true); setShowFriendsStories(false); setShowMyStories(false); setExpandedStoryId(null); }} style={{ padding: '6px 8px', borderRadius: 18, border: 'none', background: showPublicWall ? 'linear-gradient(90deg,#ffb86b 60%,#6B5BFF 100%)' : '#eee', color: showPublicWall ? '#fff' : '#6B5BFF', fontWeight: 700, fontSize: 12, cursor: 'pointer', flex: 1, marginRight: 4 }}>#💬{UI_TEXT.partnersStories[safeLang]}</button>
              <button onClick={() => { setShowFriendsStories(true); setShowPublicWall(false); setShowMyStories(false); setExpandedStoryId(null); }} style={{ padding: '6px 8px', borderRadius: 18, border: 'none', background: showFriendsStories ? 'linear-gradient(90deg,#23c6e6 60%,#6B5BFF 100%)' : '#eee', color: showFriendsStories ? '#fff' : '#6B5BFF', fontWeight: 700, fontSize: 12, cursor: 'pointer', flex: 1, marginRight: 4 }}>#🤝{UI_TEXT.friendStories[safeLang]}</button>
              <button onClick={() => { setShowMyStories(true); setShowPublicWall(false); setShowFriendsStories(false); setExpandedStoryId(null); }} style={{ padding: '6px 8px', borderRadius: 18, border: 'none', background: showMyStories ? 'linear-gradient(90deg,#6B5BFF 60%,#23c6e6 100%)' : '#eee', color: showMyStories ? '#fff' : '#6B5BFF', fontWeight: 700, fontSize: 12, cursor: 'pointer', flex: 1 }}>#📝{UI_TEXT.myStories[safeLang]}</button>
            </div>
            
            {/* 手機版故事列表內容 */}
            <div style={{ maxHeight: 400, overflowY: 'auto', width: '100%', paddingRight: 6 }}>
              {showFriendsStories ? (
                // 好友故事
                friendsList.length === 0 ? (
                  <div style={{ color: '#888', fontWeight: 600, fontSize: 16, padding: '32px 0', textAlign: 'center' }}>
                    {UI_TEXT.noFriends[safeLang]}
                    <span onClick={() => navigate('/friend')} style={{ color: '#6B5BFF', textDecoration: 'underline', fontWeight: 700, cursor: 'pointer' }}>{UI_TEXT.goToPairTalk[safeLang]}</span>
                  </div>
                ) : (
                  stories.filter(s => s.visibility === 'friends' && friendsList.includes(s.authorEmail)).map(s => {
                    const profile = profilesByEmail[s.authorEmail] || {};
                    return (
                      <div key={s.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #b6b6f622', padding: 14, marginBottom: 14, cursor: 'pointer' }}>
                        <div style={{ fontWeight: 700, color: '#6B5BFF', fontSize: 16, marginBottom: 4 }} onClick={e => { e.stopPropagation(); setExpandedStoryId(expandedStoryId === s.id ? null : s.id); }}>{getStoryTitle(s, safeLang)}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '12px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                          <img src={profile.avatar || profile.avatarUrl || '/avatars/Derxl.png'} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececff' }} />
                          <span style={{ fontWeight: 600 }}>{profile && profile.nickname ? profile.nickname : '-'}</span>
                          <span>，{profile && profile.age ? profile.age : '-'}</span>
                          <span>，{profile && profile.gender ? profile.gender : '-'}</span>
                        </div>
                        {expandedStoryId === s.id && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ color: '#232946', fontSize: 14, marginBottom: 4, whiteSpace: 'pre-line' }}>{getStoryContent(s, safeLang)}</div>
                            <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '6px 10px', margin: '6px 0', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px #b6b6f622', fontSize: 12 }}>
                              <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                              <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                            </div>
                            {s.tag && <div style={{ fontSize: 12, color: '#6B5BFF', fontWeight: 700, marginBottom: 4 }}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                            {s.onChain && <span style={{ fontSize: 12, color: '#23c6e6', fontWeight: 700, marginLeft: 8 }}>🔗 已封存</span>}
                            {/* 手機版完整個人資料區塊 */}
                            <div style={{ marginTop: 8, fontSize: 12, color: '#6B5BFF', fontWeight: 500, background: '#f7f8fc', borderRadius: 8, padding: '6px 10px' }}>
                              <div>
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[0].split('：')[0]}：${profile && profile.nickname ? profile.nickname : '-'}，`}
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[1].split('：')[0]}：${profile && profile.gender ? profile.gender : '-'}，`}
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[2].split('：')[0]}：${profile && profile.age ? profile.age : '-'}，`}
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[3].split('：')[0]}：${profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}，`}
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[4].split('：')[0]}：${profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}，`}
                                {`${UI_TEXT.profileLabels[safeLang].split('\n')[5].split('：')[0]}：${profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}`}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )
              ) : showMyStories ? (
                // 我的故事
                stories.filter(s => s.author === user?.displayName).map(s => {
                  const profile = profilesByEmail[s.authorEmail] || {};
                  return (
                    <div key={s.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #b6b6f622', padding: 14, marginBottom: 14, position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-[#ececff] shadow ${getAvatarColor(s.author)}`}>{s.author?.[0] || 'A'}</div>
                        <div style={{ fontWeight: 700, color: '#6B5BFF', fontSize: 14, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); setExpandedStoryId(expandedStoryId === s.id ? null : s.id); }}>{getStoryTitle(s, safeLang)}</div>
                        <button onClick={() => handleDeleteStory(s.id)} style={{ marginLeft: 'auto', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: 6, padding: '2px 8px', fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>刪除</button>
                      </div>
                      {expandedStoryId === s.id && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ color: '#232946', fontSize: 14, marginBottom: 4 }}>{getStoryContent(s, safeLang)}</div>
                          <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '6px 10px', margin: '6px 0', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px #b6b6f622', fontSize: 12 }}>
                            <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                            <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                          </div>
                          {s.tag && <div style={{ fontSize: 12, color: '#6B5BFF', fontWeight: 700, marginBottom: 4 }}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                          {s.onChain && <span style={{ fontSize: 12, color: '#23c6e6', fontWeight: 700, marginLeft: 8 }}>🔗 已封存</span>}
                          {/* 手機版完整個人資料區塊 */}
                          <div style={{ marginTop: 8, fontSize: 12, color: '#6B5BFF', fontWeight: 500, background: '#f7f8fc', borderRadius: 8, padding: '6px 10px' }}>
                            <div>
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[0].split('：')[0]}：${profile && profile.nickname ? profile.nickname : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[1].split('：')[0]}：${profile && profile.gender ? profile.gender : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[2].split('：')[0]}：${profile && profile.age ? profile.age : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[3].split('：')[0]}：${profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[4].split('：')[0]}：${profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[5].split('：')[0]}：${profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                // 公開故事（預設）
                stories.filter(s => s.visibility === 'public').map(s => {
                  const profile = profilesByEmail[s.authorEmail] || {};
                  return (
                    <div key={s.id} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px #b6b6f622', padding: 14, marginBottom: 14, cursor: 'pointer' }}>
                      <div style={{ fontWeight: 700, color: '#6B5BFF', fontSize: 16, marginBottom: 4 }} onClick={e => { e.stopPropagation(); setExpandedStoryId(expandedStoryId === s.id ? null : s.id); }}>
                        {getStoryTitle(s, safeLang)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: '12px', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
                        <img src={profile.avatar || profile.avatarUrl || '/avatars/Derxl.png'} alt="avatar" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececff' }} />
                        <span style={{ fontWeight: 600 }}>{profile && profile.nickname ? profile.nickname : '-'}</span>
                        <span>，{profile && profile.age ? profile.age : '-'}</span>
                        <span>，{profile && profile.gender ? profile.gender : '-'}</span>
                      </div>
                      {expandedStoryId === s.id && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ color: '#232946', fontSize: 14, marginBottom: 4, whiteSpace: 'pre-line' }}>{getStoryContent(s, safeLang)}</div>
                          <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '6px 10px', margin: '6px 0', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 8px #b6b6f622', fontSize: 12 }}>
                            <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                            <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                          </div>
                          {s.tag && <div style={{ fontSize: 12, color: '#6B5BFF', fontWeight: 700, marginBottom: 4 }}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                          {s.onChain && <span style={{ fontSize: 12, color: '#23c6e6', fontWeight: 700, marginLeft: 8 }}>🔗 已封存</span>}
                          {/* 手機版完整個人資料區塊 */}
                          <div style={{ marginTop: 8, fontSize: 12, color: '#6B5BFF', fontWeight: 500, background: '#f7f8fc', borderRadius: 8, padding: '6px 10px' }}>
                            <div>
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[0].split('：')[0]}：${profile && profile.nickname ? profile.nickname : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[1].split('：')[0]}：${profile && profile.gender ? profile.gender : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[2].split('：')[0]}：${profile && profile.age ? profile.age : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[3].split('：')[0]}：${profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[4].split('：')[0]}：${profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}，`}
                              {`${UI_TEXT.profileLabels[safeLang].split('\n')[5].split('：')[0]}：${profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
          

        </>
      ) : (
        // 桌面版：顯示完整內容
        <>
          {/* 桌面版背景圖 */}
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/skytree.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', zIndex: -1 }}></div>
          
          {/* 桌面版頂部導航 - 完整複製首頁的頁頭 */}
          <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
            {/* 左側：LOGO */}
            <div style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
              <img src="/ctx-logo.png" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: 18, marginRight: 24 }}>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/about')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 80 }}
                aria-label={safeLang==='zh-TW'?'了解 Restarter 平台':'zh-CN'===safeLang?'了解 Restarter 平台':'en'===safeLang?'Learn about Restarter platform':'ja'===safeLang?'Restarter プラットフォームについて':'ko'===safeLang?'Restarter 플랫폼에 대해 알아보기':'th'===safeLang?'เรียนรู้เกี่ยวกับแพลตฟอร์ม Restarter':'vi'===safeLang?'Tìm hiểu về nền tảng Restarter':'ms'===safeLang?'Ketahui tentang platform Restarter':'Cognosce de suggestum Restarter'}
                role="button"
              >
                {safeLang==='zh-TW'?'🧬 Restarter™｜我們是誰':'zh-CN'===safeLang?'🧬 Restarter™｜我们是谁':'en'===safeLang?'🧬 Restarter™｜Who We Are':'ja'===safeLang?'🧬 Restarter™｜私たちについて':'ko'===safeLang?'🧬 Restarter™｜우리는 누구인가':'th'===safeLang?'🧬 Restarter™｜เราเป็นใคร':'vi'===safeLang?'🧬 Restarter™｜Chúng tôi là ai':'ms'===safeLang?'🧬 Restarter™｜Siapa Kami':'🧬 Restarter™｜Quis sumus'}
              </button>
              <button 
                className="topbar-btn" 
                onClick={() => navigate('/feedback')} 
                style={{ background: '#fff', color: '#6B5BFF', border: '2px solid #6B5BFF', borderRadius: 6, fontWeight: 700, fontSize: 12, padding: '4px 8px', minWidth: 100 }}
                aria-label={safeLang==='zh-TW'?'提供意見和建議':'zh-CN'===safeLang?'提供意见和建议':'en'===safeLang?'Provide feedback and suggestions':'ja'===safeLang?'ご意見やご提案を提供':'ko'===safeLang?'의견과 제안 제공':'th'===safeLang?'ให้ข้อเสนอแนะและคำแนะนำ':'vi'===safeLang?'Cung cấp phản hồi và đề xuất':'ms'===safeLang?'Berikan maklum balas dan cadangan':'Praebe consilia et suggestiones'}
                role="button"
              >
                {safeLang==='zh-TW'?'💬 意見箱｜我們想聽你說':'zh-CN'===safeLang?'💬 意见箱｜我们想听你说':'en'===safeLang?'💬 Feedback｜We Want to Hear You':'ja'===safeLang?'💬 ご意見箱｜あなたの声を聞かせて':'ko'===safeLang?'💬 피드백｜여러분의 의견을 듣고 싶어요':'th'===safeLang?'💬 กล่องความคิดเห็น｜เราอยากฟังคุณ':'vi'===safeLang?'💬 Hộp góp ý｜Chúng tôi muốn lắng nghe bạn':'ms'===safeLang?'💬 Kotak Maklum Balas｜Kami ingin mendengar anda':'💬 Arca Consilii｜Te audire volumus'}
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
                    <button className="topbar-btn" onClick={async () => { await signOut(auth); }} style={{ background: '#fff', color: '#ff6347', border: '2px solid #ffb4a2', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 14px', marginLeft: 6 }}>{UI_TEXT.logout[safeLang]}</button>
                  </div>
                </>
              ) : (
                <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '2px solid #90caf9', borderRadius: 8, fontWeight: 700, fontSize: 16, padding: '8px 10px', minWidth: 90 }}>{safeLang==='zh-TW'?'註冊/登入':'zh-CN'===safeLang?'注册/登录':'en'===safeLang?'Register / Login':'ja'===safeLang?'登録/ログイン':'ko'===safeLang?'가입/로그인':'th'===safeLang?'สมัคร/เข้าสู่ระบบ':'vi'===safeLang?'Đăng ký/Đăng nhập':'ms'===safeLang?'Daftar / Log Masuk':'Registrare / Login'}</button>
              )}
            </div>
            {/* 語言選擇按鈕，靠右且寬度縮短，點擊彈出小框 */}
            <div style={{ position: 'relative', display: 'inline-block' }} className="language-selector">
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
            <div style={{ position: 'relative', display: 'inline-block' }} className="legal-menu">
              <button
                className="topbar-btn"
                style={{
                  background: '#fff',
                  color: '#6B5BFF',
                  border: '2px solid #6B5BFF',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 16,
                  padding: '8px 10px',
                  minWidth: 44,
                  height: '44px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowLegalMenu(v => !v)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f3f0ff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff';
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
                  minWidth: 180,
                  maxWidth: 220,
                  padding: '8px 0'
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B5BFF' }}>
                      {safeLang === 'zh-TW' ? '法律文件' : 
                       safeLang === 'zh-CN' ? '法律文件' : 
                       safeLang === 'en' ? 'Legal Documents' : 
                       safeLang === 'ja' ? '法的文書' : 
                       safeLang === 'ko' ? '법적 문서' : 
                       safeLang === 'th' ? 'เอกสารทางกฎหมาย' : 
                       safeLang === 'vi' ? 'Tài liệu pháp lý' : 
                       safeLang === 'ms' ? 'Dokumen Undang-undang' : 
                       'Documenta Iuridica'}
                    </span>
                  </div>
                  {[
                    { key: 'privacy', title: { 'zh-TW': '隱私權政策', 'zh-CN': '隐私政策', 'en': 'Privacy Policy', 'ja': 'プライバシーポリシー', 'ko': '개인정보보호정책', 'th': 'นโยบายความเป็นส่วนตัว', 'vi': 'Chính sách bảo mật', 'ms': 'Dasar Privasi', 'la': 'Consilium de Privata' }, path: '/privacy-policy' },
                    { key: 'terms', title: { 'zh-TW': '條款/聲明', 'zh-CN': '条款/声明', 'en': 'Terms/Statement', 'ja': '利用規約/声明', 'ko': '약관/성명', 'th': 'ข้อกำหนด/คำแถลง', 'vi': 'Điều khoản/Tuyên bố', 'ms': 'Terma/Penyata', 'la': 'Termini/Declaratio' }, path: '/terms' },
                    { key: 'data', title: { 'zh-TW': '資料刪除說明', 'zh-CN': '数据删除说明', 'en': 'Data Deletion', 'ja': 'データ削除について', 'ko': '데이터 삭제 설명', 'th': 'คำอธิบายการลบข้อมูล', 'vi': 'Giải thích xóa dữ liệu', 'ms': 'Penerangan Pemadaman Data', 'la': 'Explicatio Deletionis Datae' }, path: '/data-deletion' },
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
                      {item.title[safeLang] || item.title['zh-TW']}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 主標題卡片 - 跟著頁面捲動，不固定 */}
          <div style={{ 
            marginTop: '100px', 
            marginBottom: '0px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              borderRadius: 16, 
              padding: '16px 24px', 
              boxShadow: '0 4px 20px #6B5BFF22',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#6B5BFF' }}>📖</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#6B5BFF' }}>{UI_TEXT.pageTitle[safeLang]}</span>
              </div>
            </div>
          </div>
          
          {/* 桌面版主容器 - 置中，往上移動與主標題卡片交界 */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '0px 20px 20px 20px' }}>
            <div className="modern-container" style={{ width: '90%', maxWidth: 1000, display: 'flex', flexDirection: 'column', gap: 32, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: 32, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}>
            {/* 桌面版主標題和副標題 */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontSize: '1rem', color: '#000', fontWeight: 600, margin: '0 0 8px 0', lineHeight: 1.5 }}>{UI_TEXT.storyQuoteLine1[safeLang]}</p>
              <p style={{ fontSize: '1rem', color: '#000', fontWeight: 600, margin: '0 0 8px 0', lineHeight: 1.5 }}>{UI_TEXT.storyQuoteLine2[safeLang]}</p>
              <p style={{ fontSize: '0.9rem', color: '#888', fontWeight: 500, margin: 0, lineHeight: 1.4 }}>{UI_TEXT.storyQuoteLine3[safeLang]}</p>
            </div>
            <div style={{ display: 'flex', gap: 32 }}>
              {/* Left Panel: Add Story */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 17, letterSpacing: 1, textAlign: 'center' }}>
                      {UI_TEXT.formTitle[safeLang]}
                    </div>
                  </div>
                  <div style={{ fontSize: 16, color: '#6B5BFF', fontWeight: 600, textAlign: 'center' }}>
                    {UI_TEXT.storyPrompt[safeLang]}
                  </div>
                </div>

                <input value={title} onChange={e => setTitle(e.target.value)} placeholder={UI_TEXT.titlePlaceholder[safeLang]} style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 16, border: '1px solid #ddd', fontSize: 16, marginBottom: 8, color: '#232946' }} />
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder={UI_TEXT.contentPlaceholder[safeLang]} style={{ width: '100%', height: 120, boxSizing: 'border-box', padding: 12, borderRadius: 16, border: '1px solid #ddd', fontSize: 16, marginBottom: 8, color: '#232946', resize: 'none' }} />
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8, fontSize: 15 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={() => handleVisibilityChange('private')} /> {UI_TEXT.visibilityPrivate[safeLang]}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input type="radio" name="visibility" value="friends" checked={visibility === 'friends'} onChange={() => handleVisibilityChange('friends')} /> {UI_TEXT.visibilityFriends[safeLang]}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={() => handleVisibilityChange('public')} /> {UI_TEXT.visibilityPublic[safeLang]}
                  </label>
                </div>
                {visibility === 'public' && (
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display:'flex',alignItems:'center',fontSize:15 }}>
                      <input type="checkbox" checked={onChain} onChange={e => setOnChain(e.target.checked)} style={{marginRight:4}} /> {BLOCKCHAIN_TEXT[safeLang]}
                    </label>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4, fontStyle: 'italic' }}>
                      {UI_TEXT.blockchainNote[safeLang]}
                    </div>
                  </div>
                )}
                <button onClick={handleAddStory} disabled={loading} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #6B5BFF 60%, #23c6e6 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 900, fontSize: 17, letterSpacing: 1, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                  {UI_TEXT.formSubmit[safeLang]}
                </button>
              </div>

              {/* Right Panel: Story Card Flow */}
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{display:'flex',gap:10,marginBottom:18}}>
                  <button onClick={()=>{setShowPublicWall(true);setShowFriendsStories(false);setShowMyStories(false);setExpandedStoryId(null);}} style={{padding:'8px 18px',borderRadius:18,border:'none',background:showPublicWall?'linear-gradient(90deg,#ffb86b 60%,#6B5BFF 100%)':'#eee',color:showPublicWall?'#fff':'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>#💬{UI_TEXT.partnersStories[safeLang]}</button>
                  <button onClick={()=>{setShowFriendsStories(true);setShowPublicWall(false);setShowMyStories(false);setExpandedStoryId(null);}} style={{padding:'8px 18px',borderRadius:18,border:'none',background:showFriendsStories?'linear-gradient(90deg,#23c6e6 60%,#6B5BFF 100%)':'#eee',color:showFriendsStories?'#fff':'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>#🤝{UI_TEXT.friendStories[safeLang]}</button>
                  <button onClick={()=>{setShowMyStories(true);setShowPublicWall(false);setShowFriendsStories(false);setExpandedStoryId(null);}} style={{padding:'8px 18px',borderRadius:18,border:'none',background:showMyStories?'linear-gradient(90deg,#6B5BFF 60%,#23c6e6 100%)':'#eee',color:showMyStories?'#fff':'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>#📝{UI_TEXT.myStories[safeLang]}</button>
                </div>
                {isWaiting ? (
                  <div style={{padding:'48px 0',textAlign:'center',color:'#6B5BFF',fontWeight:700,fontSize:22}}>
                    🤖 AI正在幫你包裝故事，請稍候{waitingDots}
                    <div style={{fontSize:15,color:'#888',marginTop:12}}>（有時AI會偷偷加點幽默，請耐心等候...）</div>
                  </div>
                ) : showFriendsStories ? (
                  <div style={{width:'100%',background:'#fff',borderRadius:18,boxShadow:'0 2px 12px #6B5BFF22',padding:'18px 12px',marginBottom:18}}>
                    <div style={{fontWeight:700,fontSize:18,marginBottom:10,background: 'linear-gradient(90deg,#23c6e6 60%,#6B5BFF 100%)',WebkitBackgroundClip: 'text',WebkitTextFillColor: 'transparent',backgroundClip: 'text'}}>#🤝{UI_TEXT.friendStories[safeLang]}</div>
                    <button onClick={()=>{setShowFriendsStories(false);setShowPublicWall(true);setShowMyStories(false);setExpandedStoryId(null);}} style={{margin:'0 0 18px 0',padding:'8px 18px',borderRadius:18,border:'none',background:'#eee',color:'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>返回夥伴們的故事</button>
                    <div style={{maxHeight:420,overflowY:'auto',width:'100%',paddingRight:6}}>
                      {friendsList.length === 0 ? (
                        <div style={{color:'#888',fontWeight:600,fontSize:16,padding:'32px 0',textAlign:'center'}}>
                          {UI_TEXT.noFriends[safeLang]}
                          <span onClick={()=>navigate('/friend')} style={{color:'#6B5BFF',textDecoration:'underline',fontWeight:700,cursor:'pointer'}}>{UI_TEXT.goToPairTalk[safeLang]}</span>
                        </div>
                      ) : (
                        stories.filter(s=>s.visibility==='friends' && friendsList.includes(s.authorEmail)).map(s=>{
                          const profile = profilesByEmail[s.authorEmail] || {};
                          return (
                            <div key={s.id} style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 8px #b6b6f622',padding:14,marginBottom:14,cursor:'pointer'}}>
                              <div style={{fontWeight:700,color:'#6B5BFF',fontSize:18,cursor:'pointer',marginBottom:4}} onClick={e=>{e.stopPropagation();setExpandedStoryId(expandedStoryId===s.id?null:s.id);}}>{getStoryTitle(s, safeLang)}</div>
                              <UserProfileDisplay profile={profile} variant="compact" />
                              {expandedStoryId===s.id && (
                                <div style={{marginTop:10}}>
                                  <div style={{color:'#232946',fontSize:15,marginBottom:4,whiteSpace:'pre-line'}}>{getStoryContent(s, safeLang)}</div>
                                  <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '8px 12px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px #b6b6f622', fontSize:14 }}>
                                    <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                                    <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                                  </div>
                                  {s.tag && <div style={{fontSize:14,color:'#6B5BFF',fontWeight:700,marginBottom:4}}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                                  {s.onChain && <span style={{fontSize:14,color:'#23c6e6',fontWeight:700,marginLeft:8}}>🔗 已封存</span>}
                                  {s.visibility && ['private','friends','public'].includes(s.visibility) && (
                                    <span style={{fontSize:13,color:'#888',marginLeft:8}}>{VISIBILITY_TEXT[safeLang][s.visibility as 'private'|'friends'|'public']}</span>
                                  )}
                                  {/* 完整個人資料區塊 */}
                                  <UserProfileDisplay profile={profile} variant="detailed" />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ) : showMyStories ? (
                  <div style={{width:'100%',background:'#fff',borderRadius:18,boxShadow:'0 2px 12px #6B5BFF22',padding:'18px 12px',marginBottom:18}}>
                    <div style={{fontWeight:700,fontSize:18,marginBottom:10,background: 'linear-gradient(90deg,#6B5BFF 0%,#23c6e6 100%)',WebkitBackgroundClip: 'text',WebkitTextFillColor: 'transparent',backgroundClip: 'text'}}>#📝{UI_TEXT.myStories[safeLang]}</div>
                    <button onClick={()=>{setShowMyStories(false);setShowPublicWall(true);setShowFriendsStories(false);setExpandedStoryId(null);}} style={{margin:'0 0 18px 0',padding:'8px 18px',borderRadius:18,border:'none',background:'#eee',color:'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>返回夥伴們的故事</button>
                    <div style={{maxHeight:420,overflowY:'auto',width:'100%',paddingRight:6}}>
                      {stories.filter(s=>s.author===user?.displayName).map(s=>{
                        const profile = profilesByEmail[s.authorEmail] || {};
                        return (
                          <div key={s.id} style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 8px #b6b6f622',padding:14,marginBottom:14,position:'relative'}}>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-lg border-2 border-[#ececff] shadow ${getAvatarColor(s.author)}`}>{s.author?.[0]||'A'}</div>
                              <div style={{fontWeight:700,color:'#6B5BFF',fontSize:16,cursor:'pointer'}} onClick={e=>{e.stopPropagation();setExpandedStoryId(expandedStoryId===s.id?null:s.id);}}>{getStoryTitle(s, safeLang)}</div>
                              <button onClick={()=>handleDeleteStory(s.id)} style={{marginLeft:'auto',background:'#ff6b6b',color:'#fff',border:'none',borderRadius:8,padding:'4px 12px',fontWeight:700,cursor:'pointer'}}>刪除</button>
                            </div>
                            {expandedStoryId===s.id && (
                              <div style={{marginTop:10}}>
                                <div style={{color:'#232946',fontSize:15,marginBottom:4}}>{getStoryContent(s, safeLang)}</div>
                                <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '8px 12px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px #b6b6f622', fontSize:14 }}>
                                  <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                                  <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                                </div>
                                {s.tag && <div style={{fontSize:14,color:'#6B5BFF',fontWeight:700,marginBottom:4}}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                                {s.onChain && <span style={{fontSize:14,color:'#23c6e6',fontWeight:700,marginLeft:8}}>🔗 已封存</span>}
                                {s.visibility && ['private','friends','public'].includes(s.visibility) && (
                                  <span style={{fontSize:13,color:'#888',marginLeft:8}}>{VISIBILITY_TEXT[safeLang][s.visibility as 'private'|'friends'|'public']}</span>
                                )}
                                <div style={{marginTop:10,fontSize:14,color:'#6B5BFF',fontWeight:500,background:'#f7f8fc',borderRadius:8,padding:'8px 12px'}}>
                                  <div>
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[0].split('：')[0]}：${profile && profile.nickname ? profile.nickname : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[1].split('：')[0]}：${profile && profile.gender ? profile.gender : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[2].split('：')[0]}：${profile && profile.age ? profile.age : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[3].split('：')[0]}：${profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[4].split('：')[0]}：${profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[5].split('：')[0]}：${profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{width:'100%',background:'#fff',borderRadius:18,boxShadow:'0 2px 12px #6B5BFF22',padding:'18px 12px',marginBottom:18}}>
                    <div style={{fontWeight:700,fontSize:18,marginBottom:10,background: 'linear-gradient(90deg,#ffb86b 60%,#6B5BFF 100%)',WebkitBackgroundClip: 'text',WebkitTextFillColor: 'transparent',backgroundClip: 'text'}}>#💬{UI_TEXT.partnersStories[safeLang]}</div>
                    <button onClick={()=>{setShowMyStories(true);setShowPublicWall(false);setShowFriendsStories(false);setExpandedStoryId(null);}} style={{margin:'0 0 18px 0',padding:'8px 18px',borderRadius:18,border:'none',background:'#eee',color:'#6B5BFF',fontWeight:700,fontSize:16,cursor:'pointer'}}>返回我的故事</button>
                    <div style={{maxHeight:420,overflowY:'auto',width:'100%',paddingRight:6}}>
                      {stories.filter(s => s.visibility === 'public').map(s => {
                        const profile = profilesByEmail[s.authorEmail] || {};
                        return (
                          <div key={s.id} style={{background:'#fff',borderRadius:14,boxShadow:'0 2px 8px #b6b6f622',padding:14,marginBottom:14,cursor:'pointer'}}>
                            <div style={{fontWeight:700,color:'#6B5BFF',fontSize:18,cursor:'pointer',marginBottom:4}} onClick={e=>{e.stopPropagation();setExpandedStoryId(expandedStoryId===s.id?null:s.id);}}>{getStoryTitle(s, safeLang)}</div>
                            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:2, fontSize: '14px', flexWrap: 'nowrap', whiteSpace: 'nowrap'}}>
                              <img src={profile.avatar || profile.avatarUrl || '/avatars/Derxl.png'} alt="avatar" style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'2px solid #ececff'}} />
                              <span style={{fontWeight:600}}>{profile && profile.nickname ? profile.nickname : '-'}</span>
                              <span>，{profile && profile.age ? profile.age : '-'}</span>
                              <span>，{profile && profile.gender ? profile.gender : '-'}</span>
                              <span>，{profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}</span>
                              <span>，{profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}</span>
                              <span>，{profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}</span>
                            </div>
                            {expandedStoryId===s.id && (
                              <div style={{marginTop:10}}>
                                <div style={{color:'#232946',fontSize:15,marginBottom:4,whiteSpace:'pre-line'}}>{getStoryContent(s, safeLang)}</div>
                                <div style={{ background: 'linear-gradient(90deg, #f7f8fc 60%, #e3e6f3 100%)', borderRadius: 12, padding: '8px 12px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 2px 8px #b6b6f622', fontSize:14 }}>
                                  <span style={{ color: '#7f8fff', fontWeight: 700 }}>🤖 {UI_TEXT.encouragement[safeLang]}：</span>
                                  <span style={{ color: '#4b4b6b', fontWeight: 500 }}>{getEncouragement(s)}</span>
                                </div>
                                {s.tag && <div style={{fontSize:14,color:'#6B5BFF',fontWeight:700,marginBottom:4}}>{TAGS_TEXT[safeLang][s.tag]}</div>}
                                {s.onChain && <span style={{fontSize:14,color:'#23c6e6',fontWeight:700,marginLeft:8}}>🔗 已封存</span>}
                                {s.visibility && ['private','friends','public'].includes(s.visibility) && (
                                  <span style={{fontSize:13,color:'#888',marginLeft:8}}>{VISIBILITY_TEXT[safeLang][s.visibility as 'private'|'friends'|'public']}</span>
                                )}
                                {/* 完整個人資料區塊（公開故事卡片） */}
                                <div style={{marginTop:10,fontSize:14,color:'#6B5BFF',fontWeight:500,background:'#f7f8fc',borderRadius:8,padding:'8px 12px'}}>
                                  <div>
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[0].split('：')[0]}：${profile && profile.nickname ? profile.nickname : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[1].split('：')[0]}：${profile && profile.gender ? profile.gender : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[2].split('：')[0]}：${profile && profile.age ? profile.age : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[3].split('：')[0]}：${profile && typeof profile.country === 'string' && profile.country ? (COUNTRY_NAME[safeLang][profile.country] || profile.country) : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[4].split('：')[0]}：${profile && typeof profile.interest === 'string' && profile.interest ? (TAGS_TEXT && TAGS_TEXT[safeLang] && TAGS_TEXT[safeLang][profile.interest] ? TAGS_TEXT[safeLang][profile.interest] : profile.interest) : '-'}，`}
                                    {`${UI_TEXT.profileLabels[safeLang].split('\n')[5].split('：')[0]}：${profile && typeof profile.eventType === 'string' && profile.eventType ? (EVENT_TYPE_NAME[safeLang][profile.eventType] || profile.eventType) : '-'}`}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </>
    )}
    
    <style>{`
      @media (min-width: 768px) {
        .mobile-shared-header {
          display: none !important;
        }
      }
      @media (max-width: 767px) {
        .mobile-shared-header {
          display: block !important;
        }
      }
    `}</style>
  </div>
);
};

export default StoryWall;