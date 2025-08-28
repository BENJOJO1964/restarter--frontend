import { addDoc, collection, setDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// 初始化測試數據
export const initFirebaseData = async () => {
  try {
    // 創建測試用戶檔案
    const testProfiles = [
      {
        id: 'test_user_1',
        name: 'Alice',
        nickname: 'Alice',
        gender: 'female',
        age: '25-34',
        country: '台灣',
        region: '台北',
        interest: '閱讀',
        eventType: '轉職',
        avatar: '/avatars/sandy.png',
        avatarUrl: '/avatars/sandy.png',
        goal: 'learnNewSkills',
        role: 'peer',
        bio: {
          'zh-TW': '剛接觸程式設計，希望找到能一起學習的朋友。',
          'zh-CN': '刚接触程式设计，希望找到能一起学习的朋友。',
          'en': 'Just started coding, looking for a friend to learn with.',
          'ja': 'プログラミングを始めたばかりで、一緒に学べる友達を探しています。',
          'ko': '코딩을 막 시작해서 같이 공부할 친구를 찾고 있어요.',
          'th': 'เพิ่งเริ่มเขียนโค้ด กำลังมองหาเพื่อนเรียนด้วยกัน',
          'vi': 'Mới bắt đầu lập trình, tìm bạn để cùng học hỏi.',
          'ms': 'Baru mula pengekodan, mencari rakan untuk belajar bersama.',
          'la': 'Modo incepi codicem scribere, amicum quaerens ad discendum simul.'
        },
        skills: 'JavaScript, React',
        createdAt: new Date()
      },
      {
        id: 'test_user_2',
        name: 'Bob',
        nickname: 'Bob',
        gender: 'male',
        age: '35-44',
        country: '新加坡',
        region: '新加坡',
        interest: '美食',
        eventType: '轉職',
        avatar: '/avatars/berlex.png',
        avatarUrl: '/avatars/berlex.png',
        goal: 'jobSeeking',
        role: 'peer',
        bio: {
          'zh-TW': '我正在找餐飲業的工作，希望能交流面試心得。',
          'zh-CN': '我正在找餐饮业的工作，希望能交流面试心得。',
          'en': 'I am looking for a job in the restaurant industry and hope to exchange interview tips.',
          'ja': '飲食業界の仕事を探しており、面接のヒントを交換したいです。',
          'ko': '외식업계에서 일자리를 찾고 있으며, 면접 팁을 교환하고 싶습니다.',
          'th': 'ฉันกำลังหางานในอุตสาหกรรมร้านอาหารและหวังว่าจะได้แลกเปลี่ยนเคล็ดลับการสัมภาษณ์',
          'vi': 'Tôi đang tìm việc trong ngành nhà hàng và hy vọng có thể trao đổi kinh nghiệm phỏng vấn.',
          'ms': 'Saya sedang mencari kerja dalam industri restoran dan berharap untuk bertukar-tukar tips temu duga.',
          'la': 'Opus in industria popinae quaero et spero colloquii apices commutare.'
        },
        skills: 'Customer Service, Food Safety',
        createdAt: new Date()
      },
      {
        id: 'test_user_3',
        name: 'Carol',
        nickname: 'Carol',
        gender: 'female',
        age: '45-54',
        country: '美國',
        region: '舊金山',
        interest: '創業',
        eventType: '創業',
        avatar: '/avatars/michy.png',
        avatarUrl: '/avatars/michy.png',
        goal: 'startupPrep',
        role: 'mentor',
        bio: {
          'zh-TW': '已經成功創業五年，樂意分享經驗給想開店的後進。',
          'zh-CN': '已经成功创业五年，乐意分享经验给想开店的后进。',
          'en': 'Successfully started a business five years ago, happy to share my experience with newcomers.',
          'ja': '5年前に起業に成功し、新しい方々と経験を共有できることを嬉しく思います。',
          'ko': '5년 전 성공적으로 사업을 시작했으며, 새로운 사람들과 제 경험을 공유하게 되어 기쁩니다.',
          'th': 'เริ่มต้นธุรกิจสำเร็จเมื่อห้าปีที่แล้ว ยินดีที่จะแบ่งปันประสบการณ์ของฉันกับผู้มาใหม่',
          'vi': 'Đã khởi nghiệp thành công năm năm trước, rất vui được chia sẻ kinh nghiệm của mình với những người mới.',
          'ms': 'Berjaya memulakan perniagaan lima tahun lalu, gembira untuk berkongsi pengalaman saya dengan pendatang baru.',
          'la': 'Negotium feliciter incepi abhinc quinque annos, laetus sum experientiam meam cum novis advenis communicare.'
        },
        skills: 'Business Strategy, Marketing',
        createdAt: new Date()
      }
    ];

    // 添加測試檔案
    for (const profile of testProfiles) {
      await setDoc(doc(db, "profiles", profile.id), profile);
    }

    // 創建一些測試邀請
    const testInvites = [
      {
        fromUserId: 'test_user_1',
        fromUserName: 'Alice',
        toUserId: 'test_user_2',
        toUserName: 'Bob',
        role: 'peer',
        goal: 'jobSeeking',
        status: 'pending',
        createdAt: new Date()
      }
    ];

    for (const invite of testInvites) {
      await addDoc(collection(db, "invites"), invite);
    }

    // 創建一些測試連結
    const testLinks = [
      {
        user1Id: 'test_user_1',
        user1Name: 'Alice',
        user2Id: 'test_user_3',
        user2Name: 'Carol',
        role: 'mentor',
        goal: 'startupPrep',
        status: 'connected',
        createdAt: new Date()
      }
    ];

    for (const link of testLinks) {
      await addDoc(collection(db, "links"), link);
    }

    // 創建一些測試訊息
    const testMessages = [
      {
        fromUserId: 'test_user_1',
        fromUserName: 'Alice',
        toUserId: 'test_user_3',
        toUserName: 'Carol',
        text: '嗨，很高興認識你！',
        participants: ['test_user_1', 'test_user_3'],
        createdAt: new Date()
      },
      {
        fromUserId: 'test_user_3',
        fromUserName: 'Carol',
        toUserId: 'test_user_1',
        toUserName: 'Alice',
        text: '我也很高興！有什麼我可以幫助你的嗎？',
        participants: ['test_user_1', 'test_user_3'],
        createdAt: new Date()
      }
    ];

    for (const message of testMessages) {
      await addDoc(collection(db, "messages"), message);
    }

    console.log('Firebase 測試數據初始化完成！');
  } catch (error) {
    console.error('初始化 Firebase 數據時發生錯誤:', error);
  }
}; 