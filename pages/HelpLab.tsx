import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import app from '../src/firebaseConfig';
import { db } from '../src/firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs, Timestamp, query, where, updateDoc, doc as fsDoc } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import Footer from '../components/Footer';
import SharedHeader from '../components/SharedHeader';
import { LanguageSelector } from '../components/LanguageSelector';
import { useTestMode } from '../App';
import { auth } from '../src/firebaseConfig';

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

// 翻譯系統
const TRANSLATIONS = {
  'zh-TW': {
    title: '互相幫助&合作實驗室',
    provide: '提供幫助',
    supply: '供應圈',
    need: '需要幫助',
    room: '互助房',
    intro: '在重啟的路上，我們都需要彼此的支持。請選擇你想要參與的方式：',
    introNeed: '如果你正在經歷困難，請告訴我們，社群夥伴會主動協助你。',
    needBtn: '我需要幫助',
    rule: '※ 所有資訊僅供社群內部交流使用，請尊重彼此隱私',
    msgTo: '留言給：',
    msgPlaceholder: '請輸入留言...',
    msgSent: '留言發送成功！',
    backToHome: '返回首頁',
    sections: {
      provide: {
        title: '我可提供幫助 & 合作室',
        desc: '分享你的專長、資源或想合作的領域，讓更多人找到你。',
        btn: '我要提供'
      },
      need: {
        title: '我需要幫助 or 合作屋',
        desc: '說出你目前遇到的困難或想找合作夥伴，讓社群支援你。',
        btn: '我需要幫助'
      },
      supply: {
        title: '幫助 & 合作供應圈',
        desc: '瀏覽大家能提供的幫助與合作資源，主動聯繫彼此。',
        btn: '探索供應圈'
      },
      room: {
        title: '進入互助房',
        desc: '即時交流，互助成長',
        btn: '進入互助房'
      }
    },
    modals: {
      provide: {
        title: '我可以提供幫助 & 合作',
        subtitle: '在重啟路上，我的經歷和優勢也許可以幫上忙！',
        experience: '我的經歷（可複選）：',
        current: '我的現狀(可複選)：',
        target: '我想優先幫助的對象（可複選）：',
        helpType: '我可以提供幫助形式：',
        statement: '我的特別聲明（50字內）：',
        frequency: '我可幫助的頻率：',
        cancel: '取消',
        submit: '送出',
        other: '其他...',
        enterPlaceholder: '請輸入...',
        messageTo: '留言給：',
        messagePlaceholder: '請輸入留言...',
        sendMessage: '送出留言',
        messageSent: '需求已成功送出！'
      },
      need: {
        title: '我需要幫助',
        subtitle: '請描述你遇到的困難或需要協助的地方，讓社群夥伴能更好幫助你！',
        experience: '我的經歷（可複選）：',
        current: '我的現狀(可複選)：',
        target: '我想優先幫助的對象（可複選）：',
        helpType: '我可以提供幫助形式：',
        statement: '我的特別聲明（50字內）：',
        frequency: '我可幫助的頻率：',
        cancel: '取消',
        submit: '送出',
        other: '其他...',
        enterPlaceholder: '請輸入...',
        messageTo: '留言給：',
        messagePlaceholder: '請輸入留言...',
        sendMessage: '送出留言',
        messageSent: '需求已成功送出！'
      }
    },
    options: {
      experience: ['成功創業', '家庭重建', '就業輔導', '法律協助', '戒癮經驗', '志工', '社區服務', '其他'],
      advantage: ['經濟困難', '無固定工作', '缺乏家庭支持', '健康問題', '法律糾紛', '心理壓力', '缺乏居住地', '人際關係困難', '正在創業中', '其他'],
      target: ['找工作/就業協助', '經濟急難救助', '心理諮詢/陪伴', '法律協助', '醫療協助', '住宿協助', '家庭修復', '戒癮支持', '人際關係協助', '生活重建', '商業輔導', '其他'],
      helpType: ['線上', '線下'],
      frequency: ['每天', '每週', '每月', '依需要者而定', '其他']
    },
    messages: {
      messageSent: '留言發送成功！',
      messageFailed: '留言發送失敗，請稍後再試',
      noMessages: '暫無留言',
      markRead: '標記已讀',
      delete: '刪除',
      confirmDelete: '你確定要刪除這條留言嗎？（一旦刪除將無法復原）',
      inboxTitle: '站內訊息',
      messageFrom: '給你的留言：',
      contactUser: '聯絡對方'
    },
    date: '日期',
    avatar: '頭像',
    name: '名稱',
    gender: '性別',
    age: '年齡',
    country: '國家'
  },
  'zh-CN': {
    sections: {
      provide: {
        title: '我可提供帮助 & 合作室',
        desc: '分享你的专长、资源或想合作的领域，让更多人找到你。',
        btn: '我要提供'
      },
      need: {
        title: '我需要帮助 or 合作屋',
        desc: '说出你目前遇到的困难或想找合作伙伴，让社群支援你。',
        btn: '我需要帮助'
      },
      supply: {
        title: '帮助 & 合作供应圈',
        desc: '浏览大家能提供的帮助与合作资源，主动联系彼此。',
        btn: '探索供应圈'
      },
      room: {
        title: '进入互助房',
        desc: '即时交流，互助成长',
        btn: '进入互助房'
      }
    },
    modals: {
      provide: {
        title: '我可以提供帮助 & 合作',
        subtitle: '在重启路上，我的经历和优势也许可以帮上忙！',
        experience: '我的经历（可复选）：',
        current: '我的现状(可复选)：',
        target: '我想优先帮助的对象（可复选）：',
        helpType: '我可以提供帮助形式：',
        statement: '我的特别声明（50字内）：',
        frequency: '我可帮助的频率：',
        cancel: '取消',
        submit: '送出',
        other: '其他...',
        enterPlaceholder: '请输入...',
        messageTo: '留言给：',
        messagePlaceholder: '请输入留言...',
        sendMessage: '送出留言',
        messageSent: '需求已成功送出！'
      },
      need: {
        title: '我需要帮助',
        subtitle: '请描述你遇到的困难或需要协助的地方，让社群伙伴能更好帮助你！',
        experience: '我的经历（可复选）：',
        current: '我的现状(可复选)：',
        target: '我遇到的困难/需求（可复选）：',
        helpType: '希望获得协助形式：',
        statement: '补充说明（50字内）：',
        frequency: '希望获得协助频率：',
        cancel: '取消',
        submit: '送出',
        other: '其他...',
        enterPlaceholder: '请输入...',
        messageTo: '留言给：',
        messagePlaceholder: '请输入留言...',
        sendMessage: '送出留言',
        messageSent: '需求已成功送出！'
      }
    },
    options: {
      experience: ['成功创业', '家庭重建', '就业辅导', '法律协助', '戒瘾经验', '志工', '社区服务', '其他'],
      advantage: ['经济困难', '无固定工作', '缺乏家庭支持', '健康问题', '法律纠纷', '心理压力', '缺乏居住地', '人际关系困难', '正在创业中', '其他'],
      target: ['找工作/就业协助', '经济急难救助', '心理咨询/陪伴', '法律协助', '医疗协助', '住宿协助', '家庭修复', '戒瘾支持', '人际关系协助', '生活重建', '商业辅导', '其他'],
      helpType: ['线上', '线下'],
      frequency: ['每天', '每周', '每月', '依需要者而定', '其他']
    },
    messages: {
      messageSent: '留言发送成功！',
      messageFailed: '留言发送失败，请稍后再试',
      noMessages: '暂无留言',
      markRead: '标记已读',
      delete: '删除',
      confirmDelete: '你确定要删除这条留言吗？（一旦删除将无法复原）',
      inboxTitle: '站内消息',
      messageFrom: '给你的留言：',
      contactUser: '联络对方'
    },
    date: '日期',
    avatar: '头像',
    name: '名称',
    gender: '性别',
    age: '年龄',
    country: '国家'
  },
  'en': {
    sections: {
      provide: {
        title: 'I can provide help & cooperation room',
        desc: 'Share your expertise, resources or areas you want to collaborate on, so more people can find you.',
        btn: 'I want to provide'
      },
      need: {
        title: 'I need help or cooperation house',
        desc: 'Tell us about the difficulties you\'re currently facing or partners you want to find, so the community can support you.',
        btn: 'I need help'
      },
      supply: {
        title: 'Help & cooperation supply circle',
        desc: 'Browse the help and cooperation resources everyone can provide, actively contact each other.',
        btn: 'Explore supply circle'
      },
      room: {
        title: 'Enter mutual aid room',
        desc: 'Real-time communication, mutual growth',
        btn: 'Enter mutual aid room'
      }
    },
    modals: {
      provide: {
        title: 'I can provide help & cooperation',
        subtitle: 'On the restart journey, my experience and advantages might be helpful!',
        experience: 'My experience (multiple choice):',
        current: 'My current situation (multiple choice):',
        target: 'People I want to help first (multiple choice):',
        helpType: 'I can provide help in the form of:',
        statement: 'My special statement (within 50 characters):',
        frequency: 'My help frequency:',
        cancel: 'Cancel',
        submit: 'Submit',
        other: 'Other...',
        enterPlaceholder: 'Please enter...',
        messageTo: 'Message to:',
        messagePlaceholder: 'Please enter message...',
        sendMessage: 'Send message',
        messageSent: 'Request sent successfully!',
        backToHome: 'Back to Home'
      },
      need: {
        title: 'I need help',
        subtitle: 'Please describe the difficulties you\'re facing or areas where you need assistance, so community partners can better help you!',
        experience: 'My experience (multiple choice):',
        current: 'My current situation (multiple choice):',
        target: 'People I want to help first (multiple choice):',
        helpType: 'I can provide help in the form of:',
        statement: 'My special statement (within 50 characters):',
        frequency: 'My help frequency:',
        cancel: 'Cancel',
        submit: 'Submit',
        other: 'Other...',
        enterPlaceholder: 'Please enter...',
        messageTo: 'Message to:',
        messagePlaceholder: 'Please enter message...',
        sendMessage: 'Send message',
        messageSent: 'Request sent successfully!',
        backToHome: 'Back to Home'
      }
    },
    options: {
      experience: ['Successful entrepreneurship', 'Family reconstruction', 'Employment guidance', 'Legal assistance', 'Addiction recovery experience', 'Volunteer', 'Community service', 'Other'],
      advantage: ['Financial difficulties', 'No fixed job', 'Lack of family support', 'Health problems', 'Legal disputes', 'Psychological pressure', 'Lack of housing', 'Interpersonal difficulties', 'Currently starting a business', 'Other'],
      target: ['Job search/employment assistance', 'Emergency financial assistance', 'Psychological counseling/companionship', 'Legal assistance', 'Medical assistance', 'Housing assistance', 'Family repair', 'Addiction support', 'Interpersonal assistance', 'Life reconstruction', 'Business guidance', 'Other'],
      helpType: ['Online', 'Offline'],
      frequency: ['Daily', 'Weekly', 'Monthly', 'As needed', 'Other']
    },
    messages: {
      messageSent: 'Message sent successfully!',
      messageFailed: 'Message sending failed, please try again later',
      noMessages: 'No messages yet',
      markRead: 'Mark as read',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this message? (Once deleted, it cannot be restored)',
      inboxTitle: 'Inbox Messages',
      messageFrom: ' sent you a message:',
      contactUser: 'Contact User'
    },
    date: 'Date',
    avatar: 'Avatar',
    name: 'Name',
    gender: 'Gender',
    age: 'Age',
    country: 'Country'
  },
  'ja': {
    sections: {
      provide: {
        title: '私は助けと協力の部屋を提供できます',
        desc: 'あなたの専門知識、リソース、または協力したい分野を共有して、より多くの人にあなたを見つけてもらいましょう。',
        btn: '提供したい'
      },
      need: {
        title: '私は助けまたは協力の家が必要です',
        desc: '現在直面している困難や見つけたいパートナーについて教えてください。コミュニティがあなたをサポートできるようにします。',
        btn: '助けが必要です'
      },
      supply: {
        title: '助けと協力の供給サークル',
        desc: 'みんなが提供できる助けと協力のリソースを閲覧し、積極的にお互いに連絡を取り合いましょう。',
        btn: '供給サークルを探索'
      },
      room: {
        title: '相互扶助の部屋に入る',
        desc: 'リアルタイムコミュニケーション、相互成長',
        btn: '相互扶助の部屋に入る'
      }
    },
    modals: {
      provide: {
        title: '私は助けと協力を提供できます',
        subtitle: '再出発の道のりで、私の経験と強みがお役に立てるかもしれません！',
        experience: '私の経験（複数選択可）：',
        current: '私の現状（複数選択可）：',
        target: '私が優先的に助けたい人（複数選択可）：',
        helpType: '私が提供できる助けの形式：',
        statement: '私の特別な声明（50文字以内）：',
        frequency: '私が助けられる頻度：',
        cancel: 'キャンセル',
        submit: '送信',
        other: 'その他...',
        enterPlaceholder: '入力してください...',
        messageTo: 'メッセージを送る：',
        messagePlaceholder: 'メッセージを入力してください...',
        sendMessage: 'メッセージを送信',
        messageSent: 'リクエストが正常に送信されました！',
        backToHome: 'ホームへ戻る'
      },
      need: {
        title: '助けが必要です',
        subtitle: '直面している困難や支援が必要な領域を説明してください。コミュニティのパートナーがより良くあなたを助けられるようにします！',
        experience: '私の経験（複数選択可）：',
        current: '私の現状（複数選択可）：',
        target: '私が優先的に助けたい人（複数選択可）：',
        helpType: '私が提供できる助けの形式：',
        statement: '私の特別な声明（50文字以内）：',
        frequency: '私が助けられる頻度：',
        cancel: 'キャンセル',
        submit: '送信',
        other: 'その他...',
        enterPlaceholder: '入力してください...',
        messageTo: 'メッセージを送る：',
        messagePlaceholder: 'メッセージを入力してください...',
        sendMessage: 'メッセージを送信',
        messageSent: 'リクエストが正常に送信されました！',
        backToHome: 'ホームへ戻る'
      }
    },
    options: {
      experience: ['成功した起業', '家族の再構築', '就職支援', '法的支援', '依存症回復経験', 'ボランティア', 'コミュニティサービス', 'その他'],
      advantage: ['経済的困難', '固定職なし', '家族のサポート不足', '健康問題', '法的紛争', '心理的プレッシャー', '住居不足', '人間関係の困難', '現在起業中', 'その他'],
      target: ['仕事探し/就職支援', '緊急経済支援', '心理カウンセリング/同伴', '法的支援', '医療支援', '住居支援', '家族修復', '依存症支援', '人間関係支援', '生活再建', 'ビジネス指導', 'その他'],
      helpType: ['オンライン', 'オフライン'],
      frequency: ['毎日', '毎週', '毎月', '必要に応じて', 'その他']
    },
    messages: {
      messageSent: 'メッセージが正常に送信されました！',
      messageFailed: 'メッセージの送信に失敗しました。後でもう一度お試しください',
      noMessages: 'まだメッセージがありません',
      markRead: '既読にする',
      delete: '削除',
      confirmDelete: 'このメッセージを削除してもよろしいですか？（削除すると復元できません）',
      inboxTitle: '受信メッセージ',
      messageFrom: 'からメッセージ：',
      contactUser: 'ユーザーに連絡',
      backToHome: 'ホームへ戻る'
    },
    date: '日付',
    avatar: 'アイコン',
    name: '名前',
    gender: '性別',
    age: '年齢',
    country: '国'
  },
  'ko': {
    sections: {
      provide: {
        title: '나는 도움과 협력 방을 제공할 수 있습니다',
        desc: '당신의 전문 지식, 자원 또는 협력하고 싶은 분야를 공유하여 더 많은 사람들이 당신을 찾을 수 있도록 하세요.',
        btn: '제공하고 싶습니다'
      },
      need: {
        title: '나는 도움이나 협력 집이 필요합니다',
        desc: '현재 직면한 어려움이나 찾고 싶은 파트너에 대해 말씀해 주세요. 커뮤니티가 당신을 지원할 수 있도록 합니다.',
        btn: '도움이 필요합니다'
      },
      supply: {
        title: '도움과 협력 공급 서클',
        desc: '모든 사람이 제공할 수 있는 도움과 협력 자원을 둘러보고, 적극적으로 서로 연락하세요.',
        btn: '공급 서클 탐색'
      },
      room: {
        title: '상호 원조 방에 들어가기',
        desc: '실시간 소통, 상호 성장',
        btn: '상호 원조 방에 들어가기'
      }
    },
    modals: {
      provide: {
        title: '나는 도움과 협력을 제공할 수 있습니다',
        subtitle: '재시작 여정에서 제 경험과 장점이 도움이 될 수 있습니다!',
        experience: '제 경험 (복수 선택 가능):',
        current: '제 현재 상황 (복수 선택 가능):',
        target: '제가 우선적으로 도우고 싶은 사람 (복수 선택 가능):',
        helpType: '제가 제공할 수 있는 도움의 형태:',
        statement: '제 특별한 선언 (50자 이내):',
        frequency: '제가 도울 수 있는 빈도:',
        cancel: '취소',
        submit: '제출',
        other: '기타...',
        enterPlaceholder: '입력하세요...',
        messageTo: '메시지 보내기:',
        messagePlaceholder: '메시지를 입력하세요...',
        sendMessage: '메시지 보내기',
        messageSent: '요청이 성공적으로 전송되었습니다!',
        backToHome: '홈으로 돌아가기'
      },
      need: {
        title: '도움이 필요합니다',
        subtitle: '당신이 직면한 어려움이나 도움이 필요한 분야를 설명해 주세요. 커뮤니티 파트너가 더 잘 당신을 도울 수 있도록 합니다!',
        experience: '제 경험 (복수 선택 가능):',
        current: '제 현재 상황 (복수 선택 가능):',
        target: '제가 우선적으로 도우고 싶은 사람 (복수 선택 가능):',
        helpType: '제가 제공할 수 있는 도움의 형태:',
        statement: '제 특별한 선언 (50자 이내):',
        frequency: '제가 도울 수 있는 빈도:',
        cancel: '취소',
        submit: '제출',
        other: '기타...',
        enterPlaceholder: '입력하세요...',
        messageTo: '메시지 보내기:',
        messagePlaceholder: '메시지를 입력하세요...',
        sendMessage: '메시지 보내기',
        messageSent: '요청이 성공적으로 전송되었습니다!',
        backToHome: '홈으로 돌아가기'
      }
    },
    options: {
      experience: ['성공한 창업', '가족 재건', '취업 지도', '법적 지원', '중독 회복 경험', '자원봉사', '커뮤니티 서비스', '기타'],
      advantage: ['경제적 어려움', '고정 직업 없음', '가족 지원 부족', '건강 문제', '법적 분쟁', '심리적 압박', '주거지 부족', '인간관계 어려움', '현재 창업 중', '기타'],
      target: ['일자리 찾기/취업 지원', '긴급 경제 지원', '심리 상담/동반', '법적 지원', '의료 지원', '주거 지원', '가족 회복', '중독 지원', '인간관계 지원', '생활 재건', '비즈니스 지도', '기타'],
      helpType: ['온라인', '오프라인'],
      frequency: ['매일', '매주', '매월', '필요에 따라', '기타']
    },
    messages: {
      messageSent: '메시지가 성공적으로 전송되었습니다!',
      messageFailed: '메시지 전송에 실패했습니다. 나중에 다시 시도해 주세요',
      noMessages: '아직 메시지가 없습니다',
      markRead: '읽음 표시',
      delete: '삭제',
      confirmDelete: '이 메시지를 삭제하시겠습니까? (삭제하면 복원할 수 없습니다)',
      inboxTitle: '받은 메시지',
      messageFrom: '님이 보낸 메시지:',
      contactUser: '사용자에게 연락',
      backToHome: '홈으로 돌아가기'
    },
    date: '날짜',
    avatar: '아바타',
    name: '이름',
    gender: '성별',
    age: '나이',
    country: '국가'
  },
  'vi': {
    sections: {
      provide: {
        title: 'Tôi có thể cung cấp phòng trợ giúp & hợp tác',
        desc: 'Chia sẻ chuyên môn, tài nguyên hoặc lĩnh vực bạn muốn hợp tác, để nhiều người có thể tìm thấy bạn.',
        btn: 'Tôi muốn cung cấp'
      },
      need: {
        title: 'Tôi cần trợ giúp hoặc nhà hợp tác',
        desc: 'Hãy nói về những khó khăn bạn đang gặp phải hoặc đối tác bạn muốn tìm, để cộng đồng có thể hỗ trợ bạn.',
        btn: 'Tôi cần trợ giúp'
      },
      supply: {
        title: 'Vòng tròn cung cấp trợ giúp & hợp tác',
        desc: 'Duyệt qua các tài nguyên trợ giúp và hợp tác mà mọi người có thể cung cấp, chủ động liên lạc với nhau.',
        btn: 'Khám phá vòng tròn cung cấp'
      },
      room: {
        title: 'Vào phòng hỗ trợ lẫn nhau',
        desc: 'Giao tiếp thời gian thực, cùng nhau phát triển',
        btn: 'Vào phòng hỗ trợ lẫn nhau'
      }
    },
    modals: {
      provide: {
        title: 'Tôi có thể cung cấp trợ giúp & hợp tác',
        subtitle: 'Trên hành trình khởi động lại, kinh nghiệm và lợi thế của tôi có thể hữu ích!',
        experience: 'Kinh nghiệm của tôi (chọn nhiều):',
        current: 'Tình trạng hiện tại của tôi (chọn nhiều):',
        target: 'Những người tôi muốn ưu tiên giúp đỡ (chọn nhiều):',
        helpType: 'Tôi có thể cung cấp trợ giúp dưới hình thức:',
        statement: 'Tuyên bố đặc biệt của tôi (trong vòng 50 ký tự):',
        frequency: 'Tần suất tôi có thể giúp:',
        cancel: 'Hủy',
        submit: 'Gửi',
        other: 'Khác...',
        enterPlaceholder: 'Vui lòng nhập...',
        messageTo: 'Nhắn tin cho:',
        messagePlaceholder: 'Vui lòng nhập tin nhắn...',
        sendMessage: 'Gửi tin nhắn',
        messageSent: 'Yêu cầu đã được gửi thành công!',
        backToHome: 'Về trang chủ'
      },
      need: {
        title: 'Tôi cần trợ giúp',
        subtitle: 'Vui lòng mô tả những khó khăn bạn đang gặp phải hoặc những lĩnh vực cần hỗ trợ, để các đối tác cộng đồng có thể giúp bạn tốt hơn!',
        experience: 'Kinh nghiệm của tôi (chọn nhiều):',
        current: 'Tình trạng hiện tại của tôi (chọn nhiều):',
        target: 'Những người tôi muốn ưu tiên giúp đỡ (chọn nhiều):',
        helpType: 'Tôi có thể cung cấp trợ giúp dưới hình thức:',
        statement: 'Tuyên bố đặc biệt của tôi (trong vòng 50 ký tự):',
        frequency: 'Tần suất tôi có thể giúp:',
        cancel: 'Hủy',
        submit: 'Gửi',
        other: 'Khác...',
        enterPlaceholder: 'Vui lòng nhập...',
        messageTo: 'Nhắn tin cho:',
        messagePlaceholder: 'Vui lòng nhập tin nhắn...',
        sendMessage: 'Gửi tin nhắn',
        messageSent: 'Yêu cầu đã được gửi thành công!',
        backToHome: 'Về trang chủ'
      }
    },
    options: {
      experience: ['Khởi nghiệp thành công', 'Tái thiết gia đình', 'Hướng dẫn việc làm', 'Hỗ trợ pháp lý', 'Kinh nghiệm cai nghiện', 'Tình nguyện viên', 'Dịch vụ cộng đồng', 'Khác'],
      advantage: ['Khó khăn tài chính', 'Không có việc làm cố định', 'Thiếu hỗ trợ gia đình', 'Vấn đề sức khỏe', 'Tranh chấp pháp lý', 'Áp lực tâm lý', 'Thiếu nơi ở', 'Khó khăn trong mối quan hệ', 'Đang khởi nghiệp', 'Khác'],
      target: ['Tìm việc/hỗ trợ việc làm', 'Hỗ trợ tài chính khẩn cấp', 'Tư vấn tâm lý/đồng hành', 'Hỗ trợ pháp lý', 'Hỗ trợ y tế', 'Hỗ trợ nhà ở', 'Sửa chữa gia đình', 'Hỗ trợ cai nghiện', 'Hỗ trợ mối quan hệ', 'Tái thiết cuộc sống', 'Hướng dẫn kinh doanh', 'Khác'],
      helpType: ['Trực tuyến', 'Ngoại tuyến'],
      frequency: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng', 'Theo nhu cầu', 'Khác']
    },
    messages: {
      messageSent: 'Tin nhắn đã được gửi thành công!',
      messageFailed: 'Gửi tin nhắn thất bại, vui lòng thử lại sau',
      noMessages: 'Chưa có tin nhắn',
      markRead: 'Đánh dấu đã đọc',
      delete: 'Xóa',
      confirmDelete: 'Bạn có chắc chắn muốn xóa tin nhắn này không? (Một khi xóa sẽ không thể khôi phục)',
      inboxTitle: 'Tin nhắn đến',
      messageFrom: ' đã gửi tin nhắn cho bạn:',
      contactUser: 'Liên hệ người dùng',
      backToHome: 'Về trang chủ'
    },
    date: 'Ngày',
    avatar: 'Ảnh đại diện',
    name: 'Tên',
    gender: 'Giới tính',
    age: 'Tuổi',
    country: 'Quốc gia'
  },
  'th': {
    sections: {
      provide: {
        title: 'ฉันสามารถให้ความช่วยเหลือและห้องความร่วมมือ',
        desc: 'แบ่งปันความเชี่ยวชาญ ทรัพยากร หรือพื้นที่ที่คุณต้องการร่วมมือ เพื่อให้คนอื่นๆ หาคุณเจอ',
        btn: 'ฉันต้องการให้'
      },
      need: {
        title: 'ฉันต้องการความช่วยเหลือหรือบ้านความร่วมมือ',
        desc: 'บอกเราเกี่ยวกับความยากลำบากที่คุณกำลังเผชิญหรือคู่ค้าที่คุณต้องการหา เพื่อให้ชุมชนสามารถสนับสนุนคุณได้',
        btn: 'ฉันต้องการความช่วยเหลือ'
      },
      supply: {
        title: 'วงกลมอุปทานความช่วยเหลือและความร่วมมือ',
        desc: 'เรียกดูทรัพยากรความช่วยเหลือและความร่วมมือที่ทุกคนสามารถให้ได้ ติดต่อกันอย่างกระตือรือร้น',
        btn: 'สำรวจวงกลมอุปทาน'
      },
      room: {
        title: 'เข้าห้องช่วยเหลือซึ่งกันและกัน',
        desc: 'การสื่อสารแบบเรียลไทม์ การเติบโตร่วมกัน',
        btn: 'เข้าห้องช่วยเหลือซึ่งกันและกัน'
      }
    },
    modals: {
      provide: {
        title: 'ฉันสามารถให้ความช่วยเหลือและความร่วมมือ',
        subtitle: 'ในการเดินทางเริ่มต้นใหม่ ประสบการณ์และข้อได้เปรียบของฉันอาจเป็นประโยชน์!',
        experience: 'ประสบการณ์ของฉัน (เลือกได้หลายข้อ):',
        current: 'สถานการณ์ปัจจุบันของฉัน (เลือกได้หลายข้อ):',
        target: 'คนที่ฉันต้องการช่วยเป็นอันดับแรก (เลือกได้หลายข้อ):',
        helpType: 'ฉันสามารถให้ความช่วยเหลือในรูปแบบ:',
        statement: 'คำแถลงพิเศษของฉัน (ไม่เกิน 50 ตัวอักษร):',
        frequency: 'ความถี่ที่ฉันสามารถช่วยได้:',
        cancel: 'ยกเลิก',
        submit: 'ส่ง',
        other: 'อื่นๆ...',
        enterPlaceholder: 'กรุณาป้อน...',
        messageTo: 'ส่งข้อความถึง:',
        messagePlaceholder: 'กรุณาป้อนข้อความ...',
        sendMessage: 'ส่งข้อความ',
        messageSent: 'ส่งคำขอสำเร็จแล้ว!',
        backToHome: 'กลับหน้าหลัก'
      },
      need: {
        title: 'ฉันต้องการความช่วยเหลือ',
        subtitle: 'กรุณาอธิบายความยากลำบากที่คุณกำลังเผชิญหรือพื้นที่ที่ต้องการความช่วยเหลือ เพื่อให้คู่ค้าชุมชนสามารถช่วยคุณได้ดีขึ้น!',
        experience: 'ประสบการณ์ของฉัน (เลือกได้หลายข้อ):',
        current: 'สถานการณ์ปัจจุบันของฉัน (เลือกได้หลายข้อ):',
        target: 'คนที่ฉันต้องการช่วยเป็นอันดับแรก (เลือกได้หลายข้อ):',
        helpType: 'ฉันสามารถให้ความช่วยเหลือในรูปแบบ:',
        statement: 'คำแถลงพิเศษของฉัน (ไม่เกิน 50 ตัวอักษร):',
        frequency: 'ความถี่ที่ฉันสามารถช่วยได้:',
        cancel: 'ยกเลิก',
        submit: 'ส่ง',
        other: 'อื่นๆ...',
        enterPlaceholder: 'กรุณาป้อน...',
        messageTo: 'ส่งข้อความถึง:',
        messagePlaceholder: 'กรุณาป้อนข้อความ...',
        sendMessage: 'ส่งข้อความ',
        messageSent: 'ส่งคำขอสำเร็จแล้ว!',
        backToHome: 'กลับหน้าหลัก'
      }
    },
    options: {
      experience: ['การเริ่มต้นธุรกิจที่ประสบความสำเร็จ', 'การสร้างครอบครัวใหม่', 'การแนะแนวการจ้างงาน', 'การช่วยเหลือทางกฎหมาย', 'ประสบการณ์การเลิกเสพติด', 'อาสาสมัคร', 'บริการชุมชน', 'อื่นๆ'],
      advantage: ['ความยากลำบากทางการเงิน', 'ไม่มีงานประจำ', 'ขาดการสนับสนุนจากครอบครัว', 'ปัญหาสุขภาพ', 'ข้อพิพาททางกฎหมาย', 'ความกดดันทางจิตใจ', 'ขาดที่อยู่อาศัย', 'ความยากลำบากในความสัมพันธ์', 'กำลังเริ่มต้นธุรกิจ', 'อื่นๆ'],
      target: ['การหางาน/ความช่วยเหลือการจ้างงาน', 'ความช่วยเหลือทางการเงินฉุกเฉิน', 'การให้คำปรึกษาทางจิตวิทยา/การเป็นเพื่อน', 'การช่วยเหลือทางกฎหมาย', 'ความช่วยเหลือทางการแพทย์', 'ความช่วยเหลือที่อยู่อาศัย', 'การซ่อมแซมครอบครัว', 'การสนับสนุนการเลิกเสพติด', 'ความช่วยเหลือความสัมพันธ์', 'การสร้างชีวิตใหม่', 'การแนะแนวธุรกิจ', 'อื่นๆ'],
      helpType: ['ออนไลน์', 'ออฟไลน์'],
      frequency: ['ทุกวัน', 'ทุกสัปดาห์', 'ทุกเดือน', 'ตามความต้องการ', 'อื่นๆ']
    },
    messages: {
      messageSent: 'ส่งข้อความสำเร็จแล้ว!',
      messageFailed: 'การส่งข้อความล้มเหลว กรุณาลองใหม่อีกครั้ง',
      noMessages: 'ยังไม่มีข้อความ',
      markRead: 'ทำเครื่องหมายว่าอ่านแล้ว',
      delete: 'ลบ',
      confirmDelete: 'คุณแน่ใจหรือไม่ที่จะลบข้อความนี้? (เมื่อลบแล้วจะไม่สามารถกู้คืนได้)',
      inboxTitle: '受信メッセージ',
      messageFrom: 'からメッセージ：',
      contactUser: 'ユーザーに連絡',
      backToHome: 'ホームへ戻る'
    },
    date: 'วันที่',
    avatar: 'รูปภาพ',
    name: 'ชื่อ',
    gender: 'เพศ',
    age: 'อายุ',
    country: 'ประเทศ'
  },
  'ms': {
    sections: {
      provide: {
        title: 'Saya boleh menyediakan bilik bantuan & kerjasama',
        desc: 'Kongsi kepakaran, sumber atau bidang yang anda ingin bekerjasama, supaya lebih ramai orang dapat mencari anda.',
        btn: 'Saya ingin menyediakan'
      },
      need: {
        title: 'Saya memerlukan bantuan atau rumah kerjasama',
        desc: 'Beritahu kami tentang kesukaran yang anda hadapi atau rakan kongsi yang anda ingin cari, supaya komuniti dapat menyokong anda.',
        btn: 'Saya memerlukan bantuan'
      },
      supply: {
        title: 'Bulatan bekalan bantuan & kerjasama',
        desc: 'Semak imbas sumber bantuan dan kerjasama yang semua orang boleh sediakan, hubungi antara satu sama lain secara aktif.',
        btn: 'Jelajah bulatan bekalan'
      },
      room: {
        title: 'Masuk bilik bantuan bersama',
        desc: 'Komunikasi masa nyata, pertumbuhan bersama',
        btn: 'Masuk bilik bantuan bersama'
      }
    },
    modals: {
      provide: {
        title: 'Saya boleh menyediakan bantuan & kerjasama',
        subtitle: 'Dalam perjalanan memulakan semula, pengalaman dan kelebihan saya mungkin boleh membantu!',
        experience: 'Pengalaman saya (pilihan berganda):',
        current: 'Keadaan semasa saya (pilihan berganda):',
        target: 'Orang yang saya ingin bantu terlebih dahulu (pilihan berganda):',
        helpType: 'Saya boleh menyediakan bantuan dalam bentuk:',
        statement: 'Pernyataan khas saya (dalam 50 aksara):',
        frequency: 'Kekerapan saya boleh membantu:',
        cancel: 'Batal',
        submit: 'Hantar',
        other: 'Lain-lain...',
        enterPlaceholder: 'Sila masukkan...',
        messageTo: 'Mesej kepada:',
        messagePlaceholder: 'Sila masukkan mesej...',
        sendMessage: 'Hantar mesej',
        messageSent: 'Permintaan berjaya dihantar!',
        backToHome: 'Kembali ke Laman Utama'
      },
      need: {
        title: 'Saya memerlukan bantuan',
        subtitle: 'Sila terangkan kesukaran yang anda hadapi atau bidang yang memerlukan bantuan, supaya rakan kongsi komuniti dapat membantu anda dengan lebih baik!',
        experience: 'Pengalaman saya (pilihan berganda):',
        current: 'Keadaan semasa saya (pilihan berganda):',
        target: 'Orang yang saya ingin bantu terlebih dahulu (pilihan berganda):',
        helpType: 'Saya boleh menyediakan bantuan dalam bentuk:',
        statement: 'Pernyataan khas saya (dalam 50 aksara):',
        frequency: 'Kekerapan saya boleh membantu:',
        cancel: 'Batal',
        submit: 'Hantar',
        other: 'Lain-lain...',
        enterPlaceholder: 'Sila masukkan...',
        messageTo: 'Mesej kepada:',
        messagePlaceholder: 'Sila masukkan mesej...',
        sendMessage: 'Hantar mesej',
        messageSent: 'Permintaan berjaya dihantar!',
        backToHome: 'Kembali ke Laman Utama'
      }
    },
    options: {
      experience: ['Keusahawanan berjaya', 'Pembinaan semula keluarga', 'Bimbingan pekerjaan', 'Bantuan undang-undang', 'Pengalaman pemulihan ketagihan', 'Sukarelawan', 'Perkhidmatan komuniti', 'Lain-lain'],
      advantage: ['Kesukaran kewangan', 'Tiada pekerjaan tetap', 'Kekurangan sokongan keluarga', 'Masalah kesihatan', 'Pertikaian undang-undang', 'Tekanan psikologi', 'Kekurangan tempat tinggal', 'Kesukaran hubungan interpersonal', 'Sedang memulakan perniagaan', 'Lain-lain'],
      target: ['Mencari kerja/bantuan pekerjaan', 'Bantuan kewangan kecemasan', 'Kaunseling psikologi/teman', 'Bantuan undang-undang', 'Bantuan perubatan', 'Bantuan tempat tinggal', 'Pembaikan keluarga', 'Sokongan ketagihan', 'Bantuan hubungan interpersonal', 'Pembinaan semula kehidupan', 'Bimbingan perniagaan', 'Lain-lain'],
      helpType: ['Dalam talian', 'Luar talian'],
      frequency: ['Setiap hari', 'Setiap minggu', 'Setiap bulan', 'Mengikut keperluan', 'Lain-lain']
    },
    messages: {
      messageSent: 'Mesej berjaya dihantar!',
      messageFailed: 'Penghantaran mesej gagal, sila cuba lagi kemudian',
      noMessages: 'Tiada mesej lagi',
      markRead: 'Tandakan sebagai dibaca',
      delete: 'Padam',
      confirmDelete: 'Adakah anda pasti mahu memadamkan mesej ini? (Sebaik sahaja dipadamkan, ia tidak dapat dipulihkan)',
      inboxTitle: '受信メッセージ',
      messageFrom: 'からメッセージ：',
      contactUser: 'ユーザーに連絡',
      backToHome: 'ホームへ戻る'
    },
    date: 'Tarikh',
    avatar: 'Avatar',
    name: 'Nama',
    gender: 'Jantina',
    age: 'Umur',
    country: 'Negara'
  },
  'la': {
    sections: {
      provide: {
        title: 'Possum praebere auxilium & cooperationis cubiculum',
        desc: 'Partiri peritiam, opes vel regiones quas cooperari vis, ut plures te invenire possint.',
        btn: 'Volo praebere'
      },
      need: {
        title: 'Egeo auxilii vel cooperationis domus',
        desc: 'Dic nobis de difficultatibus quas nunc patieris vel sociis quos quaeris, ut communitas te sustentare possit.',
        btn: 'Egeo auxilii'
      },
      supply: {
        title: 'Auxilii & cooperationis copiae circulus',
        desc: 'Perlustra auxilii et cooperationis opes quas omnes praebere possunt, active inter se communicare.',
        btn: 'Explora copiae circulum'
      },
      room: {
        title: 'Intra mutuum auxilium cubiculum',
        desc: 'Temporis realis communicatio, mutuus incrementum',
        btn: 'Intra mutuum auxilium cubiculum'
      }
    },
    modals: {
      provide: {
        title: 'Possum praebere auxilium & cooperationem',
        subtitle: 'In itinere redintegrationis, mea experientia et commoda forsitan prodesse possunt!',
        experience: 'Mea experientia (multiplex electio):',
        current: 'Mea praesens condicio (multiplex electio):',
        target: 'Homines quos primum adiuvare volo (multiplex electio):',
        helpType: 'Possum praebere auxilium in forma:',
        statement: 'Mea specialis declaratio (intra 50 characteres):',
        frequency: 'Mea auxilii frequentia:',
        cancel: 'Cancella',
        submit: 'Submitte',
        other: 'Alia...',
        enterPlaceholder: 'Quaeso intra...',
        messageTo: 'Nuntius ad:',
        messagePlaceholder: 'Quaeso intra nuntium...',
        sendMessage: 'Mitte nuntium',
        messageSent: 'Petitio feliciter missa est!',
        backToHome: 'Ad domum redire'
      },
      need: {
        title: 'Egeo auxilii',
        subtitle: 'Quaeso describe difficultates quas patieris vel regiones quae auxilio indigent, ut socii communitatis te melius adiuvare possint!',
        experience: 'Mea experientia (multiplex electio):',
        current: 'Mea praesens condicio (multiplex electio):',
        target: 'Homines quos primum adiuvare volo (multiplex electio):',
        helpType: 'Possum praebere auxilium in forma:',
        statement: 'Mea specialis declaratio (intra 50 characteres):',
        frequency: 'Mea auxilii frequentia:',
        cancel: 'Cancella',
        submit: 'Submitte',
        other: 'Alia...',
        enterPlaceholder: 'Quaeso intra...',
        messageTo: 'Nuntius ad:',
        messagePlaceholder: 'Quaeso intra nuntium...',
        sendMessage: 'Mitte nuntium',
        messageSent: 'Petitio feliciter missa est!',
        backToHome: 'Ad domum redire'
      }
    },
    options: {
      experience: ['Felix initium negotii', 'Familiae reconstructio', 'Orientatio laboris', 'Auxilium legale', 'Experientia liberationis ab addictione', 'Voluntarius', 'Servitium communitatis', 'Alia'],
      advantage: ['Difficultates oeconomicae', 'Nullus labor fixus', 'Defectus sustentationis familiae', 'Problema sanitatis', 'Controversia legalis', 'Pressura psychologica', 'Defectus habitationis', 'Difficultates relationum', 'Nunc initium negotii faciens', 'Alia'],
      target: ['Quaerere laborem/auxilium laboris', 'Auxilium oeconomicum urgentis', 'Consilium psychologicum/societas', 'Auxilium legale', 'Auxilium medicum', 'Auxilium habitationis', 'Reparatio familiae', 'Sustentatio liberationis', 'Auxilium relationum', 'Reconstructio vitae', 'Orientatio negotii', 'Alia'],
      helpType: ['Online', 'Offline'],
      frequency: ['Quotidie', 'Quot hebdomadis', 'Quot mensibus', 'Secundum necessitatem', 'Alia']
    },
    messages: {
      messageSent: 'Nuntius feliciter missus est!',
      messageFailed: 'Missio nuntii defecit, quaeso postea denuo tenta',
      noMessages: 'Nondum nuntii',
      markRead: 'Nota ut lectum',
      delete: 'Dele',
      confirmDelete: 'Esne certus hunc nuntium delere velle? (Semel deletus, restitui non potest)',
      inboxTitle: 'Inbox Messages',
      messageFrom: ' sent you a message:',
      contactUser: 'Contact User',
      backToHome: 'Back to Home'
    },
    date: 'Dies',
    avatar: 'Imago',
    name: 'Nomen',
    gender: 'Genus',
    age: 'Aetas',
    country: 'Patria'
  }
};

// 動態生成 sections 基於當前語言
const getSections = (lang: string) => {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS] || TRANSLATIONS['zh-TW'];
  return [
    {
      emoji: '🤝',
      title: t.sections.provide.title,
      desc: t.sections.provide.desc,
      btn: t.sections.provide.btn,
      color: '#e0f7fa',
    },
    {
      emoji: '🆘',
      title: t.sections.need.title,
      desc: t.sections.need.desc,
      btn: t.sections.need.btn,
      color: '#fff3e0',
    },
    {
      emoji: '🌐',
      title: t.sections.supply.title,
      desc: t.sections.supply.desc,
      btn: t.sections.supply.btn,
      color: '#e8f5e9',
    },
    {
      emoji: '🏠',
      title: t.sections.room.title,
      desc: t.sections.room.desc,
      btn: t.sections.room.btn,
      color: '#f3e5f5',
    },
  ];
};

// 動態生成選項基於當前語言
const getOptions = (lang: string) => {
  const options: { [key: string]: { [key: string]: string[] } } = {
    'zh-TW': {
      experience: ['成功創業', '家庭重建', '就業輔導', '法律協助', '戒癮經驗', '志工', '社區服務', '其他'],
      advantage: ['經濟困難', '無固定工作', '缺乏家庭支持', '健康問題', '法律糾紛', '心理壓力', '缺乏居住地', '人際關係困難', '正在創業中', '其他'],
      target: ['找工作/就業協助', '經濟急難救助', '心理諮詢/陪伴', '法律協助', '醫療協助', '住宿協助', '家庭修復', '戒癮支持', '人際關係協助', '生活重建', '商業輔導', '其他'],
      helpType: ['線上', '線下'],
      frequency: ['每天', '每週', '每月', '依需要者而定', '其他']
    },
    'zh-CN': {
      experience: ['成功创业', '家庭重建', '就业辅导', '法律协助', '戒瘾经验', '志工', '社区服务', '其他'],
      advantage: ['经济困难', '无固定工作', '缺乏家庭支持', '健康问题', '法律纠纷', '心理压力', '缺乏居住地', '人际关系困难', '正在创业中', '其他'],
      target: ['找工作/就业协助', '经济急难救助', '心理咨询/陪伴', '法律协助', '医疗协助', '住宿协助', '家庭修复', '戒瘾支持', '人际关系协助', '生活重建', '商业辅导', '其他'],
      helpType: ['线上', '线下'],
      frequency: ['每天', '每周', '每月', '依需要者而定', '其他']
    },
    'en': {
      experience: ['Successful entrepreneurship', 'Family reconstruction', 'Employment guidance', 'Legal assistance', 'Addiction recovery experience', 'Volunteer', 'Community service', 'Other'],
      advantage: ['Financial difficulties', 'No fixed job', 'Lack of family support', 'Health problems', 'Legal disputes', 'Psychological pressure', 'Lack of housing', 'Interpersonal difficulties', 'Currently starting a business', 'Other'],
      target: ['Job search/employment assistance', 'Emergency financial assistance', 'Psychological counseling/companionship', 'Legal assistance', 'Medical assistance', 'Housing assistance', 'Family repair', 'Addiction support', 'Interpersonal assistance', 'Life reconstruction', 'Business guidance', 'Other'],
      helpType: ['Online', 'Offline'],
      frequency: ['Daily', 'Weekly', 'Monthly', 'As needed', 'Other']
    },
    'ja': {
      experience: ['成功した起業', '家族の再構築', '就職支援', '法的支援', '依存症回復経験', 'ボランティア', 'コミュニティサービス', 'その他'],
      advantage: ['経済的困難', '固定職なし', '家族のサポート不足', '健康問題', '法的紛争', '心理的プレッシャー', '住居不足', '人間関係の困難', '現在起業中', 'その他'],
      target: ['仕事探し/就職支援', '緊急経済支援', '心理カウンセリング/同伴', '法的支援', '医療支援', '住居支援', '家族修復', '依存症支援', '人間関係支援', '生活再建', 'ビジネス指導', 'その他'],
      helpType: ['オンライン', 'オフライン'],
      frequency: ['毎日', '毎週', '毎月', '必要に応じて', 'その他']
    },
    'ko': {
      experience: ['성공한 창업', '가족 재건', '취업 지도', '법적 지원', '중독 회복 경험', '자원봉사', '커뮤니티 서비스', '기타'],
      advantage: ['경제적 어려움', '고정 직업 없음', '가족 지원 부족', '건강 문제', '법적 분쟁', '심리적 압박', '주거지 부족', '인간관계 어려움', '현재 창업 중', '기타'],
      target: ['일자리 찾기/취업 지원', '긴급 경제 지원', '심리 상담/동반', '법적 지원', '의료 지원', '주거 지원', '가족 회복', '중독 지원', '인간관계 지원', '생활 재건', '비즈니스 지도', '기타'],
      helpType: ['온라인', '오프라인'],
      frequency: ['매일', '매주', '매월', '필요에 따라', '기타']
    },
    'vi': {
      experience: ['Khởi nghiệp thành công', 'Tái thiết gia đình', 'Hướng dẫn việc làm', 'Hỗ trợ pháp lý', 'Kinh nghiệm cai nghiện', 'Tình nguyện viên', 'Dịch vụ cộng đồng', 'Khác'],
      advantage: ['Khó khăn tài chính', 'Không có việc làm cố định', 'Thiếu hỗ trợ gia đình', 'Vấn đề sức khỏe', 'Tranh chấp pháp lý', 'Áp lực tâm lý', 'Thiếu nơi ở', 'Khó khăn trong mối quan hệ', 'Đang khởi nghiệp', 'Khác'],
      target: ['Tìm việc/hỗ trợ việc làm', 'Hỗ trợ tài chính khẩn cấp', 'Tư vấn tâm lý/đồng hành', 'Hỗ trợ pháp lý', 'Hỗ trợ y tế', 'Hỗ trợ nhà ở', 'Sửa chữa gia đình', 'Hỗ trợ cai nghiện', 'Hỗ trợ mối quan hệ', 'Tái thiết cuộc sống', 'Hướng dẫn kinh doanh', 'Khác'],
      helpType: ['Trực tuyến', 'Ngoại tuyến'],
      frequency: ['Hàng ngày', 'Hàng tuần', 'Hàng tháng', 'Theo nhu cầu', 'Khác']
    },
    'th': {
      experience: ['การเริ่มต้นธุรกิจที่ประสบความสำเร็จ', 'การสร้างครอบครัวใหม่', 'การแนะแนวการจ้างงาน', 'การช่วยเหลือทางกฎหมาย', 'ประสบการณ์การเลิกเสพติด', 'อาสาสมัคร', 'บริการชุมชน', 'อื่นๆ'],
      advantage: ['ความยากลำบากทางการเงิน', 'ไม่มีงานประจำ', 'ขาดการสนับสนุนจากครอบครัว', 'ปัญหาสุขภาพ', 'ข้อพิพาททางกฎหมาย', 'ความกดดันทางจิตใจ', 'ขาดที่อยู่อาศัย', 'ความยากลำบากในความสัมพันธ์', 'กำลังเริ่มต้นธุรกิจ', 'อื่นๆ'],
      target: ['การหางาน/ความช่วยเหลือการจ้างงาน', 'ความช่วยเหลือทางการเงินฉุกเฉิน', 'การให้คำปรึกษาทางจิตวิทยา/การเป็นเพื่อน', 'การช่วยเหลือทางกฎหมาย', 'ความช่วยเหลือทางการแพทย์', 'ความช่วยเหลือที่อยู่อาศัย', 'การซ่อมแซมครอบครัว', 'การสนับสนุนการเลิกเสพติด', 'ความช่วยเหลือความสัมพันธ์', 'การสร้างชีวิตใหม่', 'การแนะแนวธุรกิจ', 'อื่นๆ'],
      helpType: ['ออนไลน์', 'ออฟไลน์'],
      frequency: ['ทุกวัน', 'ทุกสัปดาห์', 'ทุกเดือน', 'ตามความต้องการ', 'อื่นๆ']
    },
    'ms': {
      experience: ['Keusahawanan berjaya', 'Pembinaan semula keluarga', 'Bimbingan pekerjaan', 'Bantuan undang-undang', 'Pengalaman pemulihan ketagihan', 'Sukarelawan', 'Perkhidmatan komuniti', 'Lain-lain'],
      advantage: ['Kesukaran kewangan', 'Tiada pekerjaan tetap', 'Kekurangan sokongan keluarga', 'Masalah kesihatan', 'Pertikaian undang-undang', 'Tekanan psikologi', 'Kekurangan tempat tinggal', 'Kesukaran hubungan interpersonal', 'Sedang memulakan perniagaan', 'Lain-lain'],
      target: ['Mencari kerja/bantuan pekerjaan', 'Bantuan kewangan kecemasan', 'Kaunseling psikologi/teman', 'Bantuan undang-undang', 'Bantuan perubatan', 'Bantuan tempat tinggal', 'Pembaikan keluarga', 'Sokongan ketagihan', 'Bantuan hubungan interpersonal', 'Pembinaan semula kehidupan', 'Bimbingan perniagaan', 'Lain-lain'],
      helpType: ['Dalam talian', 'Luar talian'],
      frequency: ['Setiap hari', 'Setiap minggu', 'Setiap bulan', 'Mengikut keperluan', 'Lain-lain']
    },
    'la': {
      experience: ['Felix initium negotii', 'Familiae reconstructio', 'Orientatio laboris', 'Auxilium legale', 'Experientia liberationis ab addictione', 'Voluntarius', 'Servitium communitatis', 'Alia'],
      advantage: ['Difficultates oeconomicae', 'Nullus labor fixus', 'Defectus sustentationis familiae', 'Problema sanitatis', 'Controversia legalis', 'Pressura psychologica', 'Defectus habitationis', 'Difficultates relationum', 'Nunc initium negotii faciens', 'Alia'],
      target: ['Quaerere laborem/auxilium laboris', 'Auxilium oeconomicum urgentis', 'Consilium psychologicum/societas', 'Auxilium legale', 'Auxilium medicum', 'Auxilium habitationis', 'Reparatio familiae', 'Sustentatio liberationis', 'Auxilium relationum', 'Reconstructio vitae', 'Orientatio negotii', 'Alia'],
      helpType: ['Online', 'Offline'],
      frequency: ['Quotidie', 'Quot hebdomadis', 'Quot mensibus', 'Secundum necessitatem', 'Alia']
    }
  };
  return options[lang] || options['zh-TW'];
};

function ProvideModal({ open, onClose, userInfo, onSubmit }: { open: boolean, onClose: () => void, userInfo: any, onSubmit: (data: any) => Promise<void> }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  // 當表格打開時，在手機版添加歷史記錄條目
  useEffect(() => {
    if (open && window.innerWidth <= 768) {
      // 添加一個歷史記錄條目，這樣當用戶點擊返回按鈕時會觸發popstate事件
      window.history.pushState({ modal: 'provide' }, '', window.location.pathname);
    }
  }, [open]);
  const options = getOptions(lang);
  const [exp, setExp] = useState<string[]>([]);
  const [expOther, setExpOther] = useState('');
  const [adv, setAdv] = useState<string[]>([]);
  const [advOther, setAdvOther] = useState('');
  const [target, setTarget] = useState<string[]>([]);
  const [targetOther, setTargetOther] = useState('');
  const [helpType, setHelpType] = useState(options.helpType[0]);
  const [statement, setStatement] = useState('');
  const [freq, setFreq] = useState(options.frequency[0]);
  const [freqOther, setFreqOther] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [showMsgSent, setShowMsgSent] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  if (!open) return null;
  const handleCheckbox = (arr: string[], setArr: any, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log('ProvideModal 開始提交數據');
      await onSubmit({
        exp,
        expOther,
        adv,
        advOther,
        target,
        targetOther,
        helpType,
        statement,
        freq,
        freqOther,
      });
      console.log('ProvideModal 數據提交成功');
    } catch (error) {
      console.error('ProvideModal 數據提交失敗:', error);
    }
  };
  return (
    <div style={{ position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <form onSubmit={handleSubmit} style={{ 
        background: '#fff', 
        borderRadius: 24, 
        boxShadow: '0 8px 40px #6B5BFF33', 
        padding: 24, 
        minWidth: 360, 
        width: '100%', 
        maxWidth: '500px', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 18, 
        maxHeight: 'calc(100vh - 32px)',
        '@media (max-width: 768px)': {
          maxHeight: 'calc(100vh - 16px)',
          margin: '8px',
          width: 'calc(100% - 16px)',
          minWidth: 'auto'
        }
      }}>
        {/* X 關閉 */}
        <button type="button" onClick={() => {
          onClose();
          // 手機版：點擊X按鈕時回到HelpLab頁面
          if (window.innerWidth <= 768) {
            navigate('/HelpLab');
          }
        }} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#888', cursor: 'pointer', fontWeight: 700, zIndex: 1 }}>×</button>
        
        {/* 滾動內容區域 */}
        <div style={{ 
          overflow: 'auto', 
          flex: 1, 
          paddingRight: '8px', 
          paddingBottom: '8px', 
          maxHeight: 'calc(100vh - 120px)', 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain'
        }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#6B5BFF', textAlign: 'center', marginBottom: 2 }}>{TRANSLATIONS[lang]?.modals?.provide?.title || '我可以提供幫助 & 合作'}</div>
          <div style={{ color: '#888', fontSize: 15, textAlign: 'center', marginBottom: 8 }}>{TRANSLATIONS[lang]?.modals?.provide?.subtitle || '在重啟路上，我的經歷和優勢也許可以幫上忙！'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <img src={userInfo.avatarUrl} alt="avatar" style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #e0e7ff', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowMsg(true)}>{userInfo.nickname}</span>
              <span style={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(`mailto:${userInfo.email}`)}>{userInfo.email}</span>
              <span style={{ color: '#555', fontSize: 14 }}>{userInfo.country}｜{userInfo.gender}｜{userInfo.age}</span>
            </div>
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.experience || '我的經歷（可複選）：'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.experience.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={exp.includes(opt)} onChange={() => handleCheckbox(exp, setExp, opt)} />{opt}
              </label>
            ))}
            <input placeholder={TRANSLATIONS[lang]?.modals?.provide?.other || "其他..."} value={expOther} onChange={e => setExpOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.current || '我的現狀(可複選)：'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.advantage.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={adv.includes(opt)} onChange={() => handleCheckbox(adv, setAdv, opt)} />{opt}
              </label>
            ))}
            <input placeholder={TRANSLATIONS[lang]?.modals?.provide?.other || "其他..."} value={advOther} onChange={e => setAdvOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.target || '我想優先幫助的對象（可複選）：'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.target.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={target.includes(opt)} onChange={() => handleCheckbox(target, setTarget, opt)} />{opt}
              </label>
            ))}
            <input placeholder={TRANSLATIONS[lang]?.modals?.provide?.other || "其他..."} value={targetOther} onChange={e => setTargetOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.helpType || '我可以提供幫助形式：'}</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
            {options.helpType.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="radio" name="helptype" checked={helpType===opt} onChange={() => setHelpType(opt)} />{opt}
              </label>
            ))}
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.statement || '我的特別聲明（50字內）：'}</div>
          <input maxLength={50} value={statement} onChange={e => setStatement(e.target.value)} placeholder={TRANSLATIONS[lang]?.modals?.provide?.enterPlaceholder || "請輸入..."} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '4px 10px', fontSize: 14 }} />
          <div style={{ color: '#888', fontSize: 13, textAlign: 'right', marginTop: -8 }}>{statement.length}/50</div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>{TRANSLATIONS[lang]?.modals?.provide?.frequency || '我可幫助的頻率：'}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14 }}>
            {options.frequency.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, marginRight: 12 }}>
                <input type="radio" name="freq" checked={freq===opt} onChange={() => setFreq(opt)} />{opt}
              </label>
            ))}
            <input placeholder={TRANSLATIONS[lang]?.modals?.provide?.other || "其他..."} value={freqOther} onChange={e => setFreqOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          
          {/* 按鈕區域 - 在滾動容器內部 */}
          <div style={{ 
            display: 'flex', 
            gap: 18, 
            marginTop: 18, 
            justifyContent: 'center', 
            padding: '8px 0', 
            minHeight: '44px', 
            background: '#fff', 
            zIndex: 10, 
            borderTop: '1px solid #f0f0f0',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={() => {
                onClose();
                // 手機版：點擊取消按鈕時回到HelpLab頁面
                if (window.innerWidth <= 768) {
                  navigate('/HelpLab');
                }
              }} 
              style={{ 
                background: '#eee', 
                color: '#555', 
                border: 'none', 
                borderRadius: 18, 
                padding: '8px 28px', 
                fontWeight: 700, 
                fontSize: 16, 
                cursor: 'pointer', 
                minHeight: '44px', 
                touchAction: 'manipulation', 
                flex: 1, 
                maxWidth: '120px',
                userSelect: 'none'
              }}
            >
              {TRANSLATIONS[lang]?.modals?.provide?.cancel || '取消'}
            </button>
            <button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(90deg, #6e8efb, #a777e3)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 18, 
                padding: '8px 28px', 
                fontWeight: 700, 
                fontSize: 16, 
                cursor: 'pointer', 
                boxShadow: '0 2px 8px #a777e355', 
                minHeight: '44px', 
                touchAction: 'manipulation', 
                flex: 1, 
                maxWidth: '120px',
                userSelect: 'none'
              }}
            >
              {TRANSLATIONS[lang]?.modals?.provide?.submit || '送出'}
            </button>
          </div>
          
          {/* 額外空白區域 - 防止鍵盤彈出時按鈕被隱藏 */}
          <div style={{ 
            height: '120px', 
            width: '100%', 
            background: 'transparent',
            flexShrink: 0
          }}></div>
        </div>
        {/* 留言小視窗 */}
        {showMsg && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF33', padding: 28, minWidth: 280, maxWidth: 340, width: '90vw', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button type="button" onClick={()=>setShowMsg(false)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer', fontWeight: 700 }}>×</button>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#6B5BFF', textAlign: 'center', marginBottom: 2 }}>{TRANSLATIONS[lang]?.modals?.provide?.messageTo || '留言給：'}{userInfo.nickname}</div>
              <textarea value={msgContent} onChange={e=>setMsgContent(e.target.value)} rows={3} maxLength={100} placeholder={TRANSLATIONS[lang]?.modals?.provide?.messagePlaceholder || "請輸入留言..."} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '6px 10px', fontSize: 15, resize: 'none' }} />
              <button onClick={async()=>{
                setShowMsg(false);
                try {
                  await fetch('/api/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      content: msgContent,
                      toUid: userInfo.uid,
                      toEmail: userInfo.email,
                      toNickname: userInfo.nickname,
                      fromUid: (window as any).currentUserUid || '',
                      fromEmail: (window as any).currentUserEmail || '',
                      fromNickname: (window as any).currentUserNickname || ''
                    })
                  });
                  setShowMsgSent(true);
                  setTimeout(()=>setShowMsgSent(false),1500);
                } catch {
                  alert('留言發送失敗，請稍後再試');
                }
              }} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 14, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', alignSelf: 'center' }}>{TRANSLATIONS[lang]?.modals?.provide?.sendMessage || '送出留言'}</button>
            </div>
          </div>
        )}
        {showMsgSent && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffb74d55', padding: '18px 32px', fontWeight: 700, color: '#ff4d4f', fontSize: 18 }}>{TRANSLATIONS[lang]?.modals?.provide?.messageSent || '需求已成功送出！'}</div>
          </div>
        )}
      </form>
    </div>
  );
}

function NeedHelpModal({ open, onClose, userInfo, onSubmit, showMsgSent }: { open: boolean, onClose: () => void, userInfo: any, onSubmit: (data: any) => Promise<void>, showMsgSent: boolean }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const options = getOptions(lang);
  
  // 當表格打開時，在手機版添加歷史記錄條目
  useEffect(() => {
    if (open && window.innerWidth <= 768) {
      // 添加一個歷史記錄條目，這樣當用戶點擊返回按鈕時會觸發popstate事件
      window.history.pushState({ modal: 'need' }, '', window.location.pathname);
    }
  }, [open]);
  const [exp, setExp] = useState<string[]>([]);
  const [expOther, setExpOther] = useState('');
  const [adv, setAdv] = useState<string[]>([]);
  const [advOther, setAdvOther] = useState('');
  const [target, setTarget] = useState<string[]>([]);
  const [targetOther, setTargetOther] = useState('');
  const [helpType, setHelpType] = useState(options.helpType[0]);
  const [statement, setStatement] = useState('');
  const [freq, setFreq] = useState(options.frequency[0]);
  const [freqOther, setFreqOther] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [msgContent, setMsgContent] = useState('');
  const [localShowMsgSent, setLocalShowMsgSent] = useState(false);
  if (!open) return null;
  const handleCheckbox = (arr: string[], setArr: any, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      console.log('NeedHelpModal 開始提交數據');
      await onSubmit({
        exp,
        expOther,
        adv,
        advOther,
        target,
        targetOther,
        helpType,
        statement,
        freq,
        freqOther,
      });
      console.log('NeedHelpModal 數據提交成功');
    } catch (error) {
      console.error('NeedHelpModal 數據提交失敗:', error);
    }
  };
  return (
    <div style={{ position: 'fixed', zIndex: 9999, left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <form onSubmit={handleSubmit} style={{ 
        background: '#fff', 
        borderRadius: 24, 
        boxShadow: '0 8px 40px #6B5BFF33', 
        padding: 24, 
        minWidth: 360, 
        width: '100%', 
        maxWidth: '500px', 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 18, 
        maxHeight: 'calc(100vh - 32px)',
        '@media (max-width: 768px)': {
          maxHeight: 'calc(100vh - 16px)',
          margin: '8px',
          width: 'calc(100% - 16px)',
          minWidth: 'auto'
        }
      }}>
        {/* X 關閉 */}
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', fontSize: 26, color: '#888', cursor: 'pointer', fontWeight: 700, zIndex: 1 }}>×</button>
        
        {/* 滾動內容區域 */}
        <div style={{ 
          overflow: 'auto', 
          flex: 1, 
          paddingRight: '8px', 
          paddingBottom: '8px', 
          maxHeight: 'calc(100vh - 120px)', 
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain'
        }}>
          <div style={{ fontWeight: 900, fontSize: 22, color: '#ff4d4f', textAlign: 'center', marginBottom: 2 }}>我需要幫助</div>
          <div style={{ color: '#888', fontSize: 15, textAlign: 'center', marginBottom: 8 }}>請描述你遇到的困難或需要協助的地方，讓社群夥伴能更好幫助你！</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <img src={userInfo.avatarUrl} alt="avatar" style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid #e0e7ff', objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: '#1976d2', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setShowMsg(true)}>{userInfo.nickname}</span>
              <span style={{ color: '#1976d2', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => window.open(`mailto:${userInfo.email}`)}>{userInfo.email}</span>
              <span style={{ color: '#555', fontSize: 14 }}>{userInfo.country}｜{userInfo.gender}｜{userInfo.age}</span>
            </div>
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>我的經歷（可複選）：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.experience.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={exp.includes(opt)} onChange={() => handleCheckbox(exp, setExp, opt)} />{opt}
              </label>
            ))}
            <input placeholder="其他..." value={expOther} onChange={e => setExpOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>我的現狀(可複選)：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.advantage.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={adv.includes(opt)} onChange={() => handleCheckbox(adv, setAdv, opt)} />{opt}
              </label>
            ))}
            <input placeholder="其他..." value={advOther} onChange={e => setAdvOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>我遇到的困難/需求（可複選）：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14 }}>
            {options.target.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="checkbox" checked={target.includes(opt)} onChange={() => handleCheckbox(target, setTarget, opt)} />{opt}
              </label>
            ))}
            <input placeholder="其他..." value={targetOther} onChange={e => setTargetOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>希望獲得協助形式：</div>
          <div style={{ display: 'flex', gap: 16, fontSize: 14 }}>
            {options.helpType.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
                <input type="radio" name="helptype" checked={helpType===opt} onChange={() => setHelpType(opt)} />{opt}
              </label>
            ))}
          </div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>補充說明（50字內）：</div>
          <input maxLength={50} value={statement} onChange={e => setStatement(e.target.value)} placeholder="請輸入..." style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '4px 10px', fontSize: 14 }} />
          <div style={{ color: '#888', fontSize: 13, textAlign: 'right', marginTop: -8 }}>{statement.length}/50</div>
          <div style={{ fontWeight: 700, marginTop: 8, fontSize: 15 }}>希望獲得協助頻率：</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 14 }}>
            {options.frequency.map((opt: string) => (
              <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, marginRight: 12 }}>
                <input type="radio" name="freq" checked={freq===opt} onChange={() => setFreq(opt)} />{opt}
              </label>
            ))}
            <input placeholder="其他..." value={freqOther} onChange={e => setFreqOther(e.target.value)} style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '2px 8px', minWidth: 60, fontSize: 14 }} />
          </div>
          
          {/* 按鈕區域 - 在滾動容器內部 */}
          <div style={{ 
            display: 'flex', 
            gap: 18, 
            marginTop: 18, 
            justifyContent: 'center', 
            padding: '8px 0', 
            minHeight: '44px', 
            background: '#fff', 
            zIndex: 10, 
            borderTop: '1px solid #f0f0f0',
            position: 'relative'
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ 
                background: '#eee', 
                color: '#555', 
                border: 'none', 
                borderRadius: 18, 
                padding: '8px 28px', 
                fontWeight: 700, 
                fontSize: 16, 
                cursor: 'pointer', 
                minHeight: '44px', 
                touchAction: 'manipulation', 
                flex: 1, 
                maxWidth: '120px',
                userSelect: 'none'
              }}
            >
              取消
            </button>
            <button 
              type="submit" 
              style={{ 
                background: 'linear-gradient(90deg, #6e8efb, #a777e3)', 
                color: '#fff', 
                border: 'none', 
                borderRadius: 18, 
                padding: '8px 28px', 
                fontWeight: 700, 
                fontSize: 16, 
                cursor: 'pointer', 
                boxShadow: '0 2px 8px #a777e355', 
                minHeight: '44px', 
                touchAction: 'manipulation', 
                flex: 1, 
                maxWidth: '120px',
                userSelect: 'none'
              }}
            >
              送出
            </button>
          </div>
          
          {/* 額外空白區域 - 防止鍵盤彈出時按鈕被隱藏 */}
          <div style={{ 
            height: '120px', 
            width: '100%', 
            background: 'transparent',
            flexShrink: 0
          }}></div>
        </div>
        {/* 留言小視窗 */}
        {showMsg && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.18)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF33', padding: 28, minWidth: 280, maxWidth: 340, width: '90vw', position: 'relative', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button type="button" onClick={()=>setShowMsg(false)} style={{ position: 'absolute', top: 10, right: 12, background: 'none', border: 'none', fontSize: 22, color: '#888', cursor: 'pointer', fontWeight: 700 }}>×</button>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#6B5BFF', textAlign: 'center', marginBottom: 2 }}>留言給：{userInfo.nickname}</div>
              <textarea value={msgContent} onChange={e=>setMsgContent(e.target.value)} rows={3} maxLength={100} placeholder="請輸入留言..." style={{ border: '1px solid #e0e7ff', borderRadius: 8, padding: '6px 10px', fontSize: 15, resize: 'none' }} />
              <button onClick={async()=>{
                setShowMsg(false);
                try {
                  await fetch('/api/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      content: msgContent,
                      toUid: userInfo.uid,
                      toEmail: userInfo.email,
                      toNickname: userInfo.nickname,
                      fromUid: (window as any).currentUserUid || '',
                      fromEmail: (window as any).currentUserEmail || '',
                      fromNickname: (window as any).currentUserNickname || ''
                    })
                  });
                  setLocalShowMsgSent(true);
                  setTimeout(()=>setLocalShowMsgSent(false),1500);
                } catch {
                  alert('留言發送失敗，請稍後再試');
                }
              }} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 14, padding: '6px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer', alignSelf: 'center' }}>送出留言</button>
            </div>
          </div>
        )}
        {localShowMsgSent && (
          <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', background: 'rgba(40,40,80,0.08)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 12px #ffb74d55', padding: '18px 32px', fontWeight: 700, color: '#ff4d4f', fontSize: 18 }}>需求已成功送出！</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default function HelpLab() {
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const sections = getSections(lang);
  const [user, setUser] = useState<User | null>(null);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [showLangBox, setShowLangBox] = useState(false);
  const legalMenuRef = useRef<HTMLDivElement>(null);
  const langBoxRef = useRef<HTMLDivElement>(null);
  const { isTestMode } = useTestMode();
  
  // 監聽用戶認證狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 監聽瀏覽器返回按鈕 - 手機版時導航到HelpLab頁面
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 手機版：當用戶點擊瀏覽器返回按鈕時，導航到HelpLab頁面
      if (window.innerWidth <= 768) {
        navigate('/HelpLab');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (legalMenuRef.current && !legalMenuRef.current.contains(event.target as Node)) {
        setShowLegalMenu(false);
      }
      if (langBoxRef.current && !langBoxRef.current.contains(event.target as Node)) {
        setShowLangBox(false);
      }
    };

    if (showLegalMenu || showLangBox) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLegalMenu, showLangBox]);
  
  // 簡化的翻譯系統
  const getText = (key: string) => {
    const translations: { [key: string]: { [key: string]: string } } = {
      'zh-TW': {
        title: '互相幫助&合作實驗室',
        provide: '提供幫助',
        supply: '供應圈',
        need: '需要幫助',
        room: '互助房',
        intro: '在重啟的路上，我們都需要彼此的支持。請選擇你想要參與的方式：',
        introNeed: '如果你正在經歷困難，請告訴我們，社群夥伴會主動協助你。',
        needBtn: '我需要幫助',
        rule: '※ 所有資訊僅供社群內部交流使用，請尊重彼此隱私',
        msgTo: '留言給：',
        msgPlaceholder: '請輸入留言...',
        msgSent: '留言發送成功！',
        backToHome: '返回首頁',
        back: '返回',
        date: '日期',
        avatar: '頭像',
        name: '名稱',
        gender: '性別',
        age: '年齡',
        country: '國家'
      },
      'zh-CN': {
        title: '互相帮助&合作实验室',
        provide: '提供帮助',
        supply: '供应圈',
        need: '需要帮助',
        room: '互助房',
        intro: '在重启的路上，我们都需要彼此的支持。请选择你想要参与的方式：',
        introNeed: '如果你正在经历困难，请告诉我们，社群伙伴会主动协助你。',
        needBtn: '我需要帮助',
        rule: '※ 所有信息仅供社群内部交流使用，请尊重彼此隐私',
        msgTo: '留言给：',
        msgPlaceholder: '请输入留言...',
        msgSent: '留言发送成功！',
        backToHome: '返回首页',
        back: '返回',
        date: '日期',
        avatar: '头像',
        name: '名称',
        gender: '性别',
        age: '年龄',
        country: '国家'
      },
      'en': {
        title: 'Mutual Help & Cooperation Laboratory',
        provide: 'Provide Help',
        supply: 'Supply Circle',
        need: 'Need Help',
        room: 'Mutual Aid Room',
        intro: 'On the restart journey, we all need each other\'s support. Please choose how you want to participate:',
        introNeed: 'If you are experiencing difficulties, please tell us, and community partners will actively assist you.',
        needBtn: 'I Need Help',
        rule: '※ All information is for internal community communication only, please respect each other\'s privacy',
        msgTo: 'Message to:',
        msgPlaceholder: 'Please enter message...',
        msgSent: 'Message sent successfully!',
        backToHome: 'Back to Home',
        back: 'Back',
        date: 'Date',
        avatar: 'Avatar',
        name: 'Name',
        gender: 'Gender',
        age: 'Age',
        country: 'Country'
      },
      'ja': {
        title: '相互支援&協力実験室',
        provide: '支援を提供',
        supply: '供給サークル',
        need: '支援が必要',
        room: '相互扶助の部屋',
        intro: '再出発の道のりで、私たちは皆お互いのサポートが必要です。参加したい方法を選択してください：',
        introNeed: '困難を経験している場合は、お知らせください。コミュニティのパートナーが積極的にサポートします。',
        needBtn: '支援が必要です',
        rule: '※ すべての情報はコミュニティ内の交流のみに使用され、お互いのプライバシーを尊重してください',
        msgTo: 'メッセージを送る：',
        msgPlaceholder: 'メッセージを入力してください...',
        msgSent: 'メッセージが正常に送信されました！',
        backToHome: 'ホームへ戻る',
        back: '戻る',
        date: '日付',
        avatar: 'アバター',
        name: '名前',
        gender: '性別',
        age: '年齢',
        country: '国'
      },
      'ko': {
        title: '상호 도움&협력 실험실',
        provide: '도움 제공',
        supply: '공급 서클',
        need: '도움 필요',
        room: '상호 원조 방',
        intro: '재시작 여정에서 우리 모두는 서로의 지원이 필요합니다. 참여하고 싶은 방법을 선택하세요:',
        introNeed: '어려움을 겪고 있다면 알려주세요. 커뮤니티 파트너가 적극적으로 도와드릴 것입니다.',
        needBtn: '도움이 필요합니다',
        rule: '※ 모든 정보는 커뮤니티 내부 교류용으로만 사용되며, 서로의 개인정보를 존중해 주세요',
        msgTo: '메시지 보내기:',
        msgPlaceholder: '메시지를 입력하세요...',
        msgSent: '메시지가 성공적으로 전송되었습니다!',
        backToHome: '홈으로 돌아가기',
        back: '돌아가기',
        date: '날짜',
        avatar: '아바타',
        name: '이름',
        gender: '성별',
        age: '나이',
        country: '국가'
      },
      'vi': {
        title: 'Phòng thí nghiệm trợ giúp',
        provide: 'Cung cấp trợ giúp',
        supply: 'Vòng tròn cung cấp',
        need: 'Cần trợ giúp',
        room: 'Phòng hỗ trợ lẫn nhau',
        intro: 'Trên hành trình khởi động lại, tất cả chúng ta đều cần sự hỗ trợ của nhau. Vui lòng chọn cách bạn muốn tham gia:',
        introNeed: 'Nếu bạn đang gặp khó khăn, hãy cho chúng tôi biết, các đối tác cộng đồng sẽ tích cực hỗ trợ bạn.',
        needBtn: 'Tôi cần trợ giúp',
        rule: '※ Tất cả thông tin chỉ dành cho giao tiếp nội bộ cộng đồng, vui lòng tôn trọng quyền riêng tư của nhau',
        msgTo: 'Nhắn tin cho:',
        msgPlaceholder: 'Vui lòng nhập tin nhắn...',
        msgSent: 'Tin nhắn đã được gửi thành công!',
        backToHome: 'Về trang chủ',
        back: 'Quay lại',
        date: 'Ngày',
        avatar: 'Ảnh đại diện',
        name: 'Tên',
        gender: 'Giới tính',
        age: 'Tuổi',
        country: 'Quốc gia'
      },
      'th': {
        title: 'ห้องทดลองช่วยเหลือ',
        provide: 'ให้ความช่วยเหลือ',
        supply: 'วงกลมอุปทาน',
        need: 'ต้องการความช่วยเหลือ',
        room: 'ห้องช่วยเหลือซึ่งกันและกัน',
        intro: 'ในการเดินทางเริ่มต้นใหม่ เราทุกคนต้องการการสนับสนุนจากกันและกัน กรุณาเลือกวิธีที่คุณต้องการมีส่วนร่วม:',
        introNeed: 'หากคุณกำลังประสบความยากลำบาก กรุณาบอกเรา คู่ค้าชุมชนจะช่วยเหลือคุณอย่างกระตือรือร้น',
        needBtn: 'ฉันต้องการความช่วยเหลือ',
        rule: '※ ข้อมูลทั้งหมดใช้สำหรับการสื่อสารภายในชุมชนเท่านั้น กรุณาเคารพความเป็นส่วนตัวของกันและกัน',
        msgTo: 'ส่งข้อความถึง:',
        msgPlaceholder: 'กรุณาป้อนข้อความ...',
        msgSent: 'ส่งข้อความสำเร็จแล้ว!',
        backToHome: 'กลับหน้าหลัก',
        back: 'กลับ',
        date: 'วันที่',
        avatar: 'รูปโปรไฟล์',
        name: 'ชื่อ',
        gender: 'เพศ',
        age: 'อายุ',
        country: 'ประเทศ'
      },
      'ms': {
        title: 'Makmal Bantuan & Kerjasama Bersama',
        provide: 'Sediakan Bantuan',
        supply: 'Bulatan Bekalan',
        need: 'Memerlukan Bantuan',
        room: 'Bilik Bantuan Bersama',
        intro: 'Dalam perjalanan memulakan semula, kita semua memerlukan sokongan antara satu sama lain. Sila pilih cara anda ingin mengambil bahagian:',
        introNeed: 'Jika anda menghadapi kesukaran, sila beritahu kami, rakan kongsi komuniti akan membantu anda secara aktif.',
        needBtn: 'Saya Memerlukan Bantuan',
        rule: '※ Semua maklumat adalah untuk komunikasi dalaman komuniti sahaja, sila hormati privasi antara satu sama lain',
        msgTo: 'Mesej kepada:',
        msgPlaceholder: 'Sila masukkan mesej...',
        msgSent: 'Mesej berjaya dihantar!',
        backToHome: 'Kembali ke Laman Utama',
        back: 'Kembali',
        date: 'Tarikh',
        avatar: 'Avatar',
        name: 'Nama',
        gender: 'Jantina',
        age: 'Umur',
        country: 'Negara'
      },
      'la': {
        title: 'Laboratorium Auxilii',
        provide: 'Praebere Auxilium',
        supply: 'Copiae Circulus',
        need: 'Egere Auxilii',
        room: 'Mutuum Auxilium Cubiculum',
        intro: 'In itinere redintegrationis, omnes indigemus sustentatione mutua. Quaeso elige quomodo participare vis:',
        introNeed: 'Si difficultates patieris, quaeso nobis dic, socii communitatis te active adiuvabunt.',
        needBtn: 'Egeo Auxilii',
        rule: '※ Omnia notitia ad communicationem internam communitatis tantum sunt, quaeso honora privaciam inter se',
        msgTo: 'Nuntius ad:',
        msgPlaceholder: 'Quaeso intra nuntium...',
        msgSent: 'Nuntius feliciter missus est!',
        backToHome: 'Ad domum redire',
        back: 'Redire',
        date: 'Dies',
        avatar: 'Imago',
        name: 'Nomen',
        gender: 'Sexus',
        age: 'Aetas',
        country: 'Patria'
      }
    };
    return translations[lang]?.[key] || translations['zh-TW'][key] || key;
  };
  const [showProvide, setShowProvide] = useState(false);
  const [userInfo, setUserInfo] = useState({
    avatarUrl: '/ctx-logo.png',
    nickname: '',
    email: '',
    country: '',
    gender: '',
    age: '',
  });
  const [tab, setTab] = useState<'provide'|'supply'|'need'|'room'>('provide');
  const [supplyList, setSupplyList] = useState<any[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number|null>(null);
  const auth = getAuth(app);
  const [toast, setToast] = useState('');
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgTo, setMsgTo] = useState<any>(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [unreadMsgs, setUnreadMsgs] = useState<any[]>([]);
  const [msgError, setMsgError] = useState('');
  const [msgLoading, setMsgLoading] = useState(false);
  const [showNeedHelp, setShowNeedHelp] = useState(false);
  const [helpNeedsList, setHelpNeedsList] = useState<any[]>([]);
  const [showMsgSent, setShowMsgSent] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        const profile = profileDoc.exists() ? profileDoc.data() : {};
        // 自動修補 country/gender/age
        let needUpdate = false;
        const updateData: any = {};
        if (!profile.country) { updateData.country = '台灣'; needUpdate = true; }
        if (!profile.gender) { updateData.gender = '男'; needUpdate = true; }
        if (!profile.age) { updateData.age = '30'; needUpdate = true; }
        if (needUpdate) {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(doc(db, 'profiles', user.uid), { ...profile, ...updateData }, { merge: true });
          // 重新 fetch
          const newDoc = await getDoc(doc(db, 'profiles', user.uid));
          const newProfile = newDoc.exists() ? newDoc.data() : {};
          setUserInfo({
            avatarUrl: newProfile.avatar || user.photoURL || '/ctx-logo.png',
            nickname: newProfile.nickname || user.displayName || 'Restarter',
            email: newProfile.email || user.email || '',
            country: newProfile.country || '',
            gender: newProfile.gender || '',
            age: newProfile.age || '',
          });
          return;
        }
        setUserInfo({
          avatarUrl: profile.avatar || user.photoURL || '/ctx-logo.png',
          nickname: profile.nickname || user.displayName || 'Restarter',
          email: profile.email || user.email || '',
          country: profile.country || '',
          gender: profile.gender || '',
          age: profile.age || '',
        });
      } catch {
        setUserInfo({
          avatarUrl: user.photoURL || '/ctx-logo.png',
          nickname: user.displayName || 'Restarter',
          email: user.email || '',
          country: '',
          gender: '',
          age: '',
        });
      }
    };
    fetchProfile();
  }, [user]);
  // 送出表單時寫入 helpSupplies
  async function handleProvideSubmit(data: any) {
    try {
      console.log('開始保存提供幫助數據:', data);
      console.log('用戶信息:', userInfo);
      console.log('當前用戶:', user);
      
      if (!user) {
        console.error('用戶未登入');
        setToast('❌ 請先登入後再送出');
        setTimeout(()=>setToast(''), 3000);
        return;
      }
      
      const docRef = await addDoc(collection(db, 'helpSupplies'), {
        ...data,
        type: 'provide', // 添加類型標識
        avatarUrl: userInfo.avatarUrl,
        nickname: userInfo.nickname,
        email: userInfo.email,
        country: userInfo.country,
        gender: userInfo.gender,
        age: userInfo.age,
        createdAt: Timestamp.now(),
        uid: user?.uid || '',
      });
      
      console.log('數據保存成功，文檔ID:', docRef.id);
      setShowProvide(false);
      setToast('🎉 已成功送出，感謝你的溫暖分享！');
      setTimeout(()=>setToast(''), 3000);
      fetchSupplyList();
    } catch (error) {
      console.error('保存提供幫助數據失敗:', error);
      setToast('❌ 保存失敗，請稍後再試');
      setTimeout(()=>setToast(''), 3000);
    }
  }
  // 取得供應圈列表
  async function fetchSupplyList() {
    try {
      console.log('開始獲取供應圈列表');
      const q = query(collection(db, 'helpSupplies'), where('type', '==', 'provide'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc=>({id:doc.id,...doc.data()}));
      // 在客戶端按時間倒序排列
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return timeB - timeA;
      });
      console.log('獲取到的供應圈數據:', sortedData);
      setSupplyList(sortedData);
    } catch (error) {
      console.error('獲取供應圈列表失敗:', error);
      setToast('❌ 獲取數據失敗，請稍後再試');
      setTimeout(()=>setToast(''), 3000);
    }
  }
  useEffect(()=>{ if(tab==='supply') fetchSupplyList(); },[tab]);
  // 供應圈留言
  async function sendMessage(toUser:any, content:string) {
    console.log('留言送出偵錯：', {
      user,
      fromUid: user?.uid,
      toUid: toUser?.uid,
      fromEmail: user?.email,
      toEmail: toUser?.email,
      content
    });
    if (!user) {
      setMsgError('偵錯：user 為 null，請確認已登入');
      return;
    }
    if (!user.uid) {
      setMsgError('偵錯：user.uid 為空');
      return;
    }
    if (!toUser?.uid) {
      setMsgError('偵錯：toUser.uid 為空');
      return;
    }
    if (!content.trim()) {
      setMsgError('請輸入留言內容');
      return;
    }
    setMsgLoading(true);
    setMsgError('');
    try {
      await addDoc(collection(db, 'messages'), {
        toUid: toUser.uid,
        toEmail: toUser.email,
        toNickname: toUser.nickname,
        fromUid: user.uid,
        fromEmail: user.email,
        fromNickname: userInfo.nickname,
        content,
        timestamp: Timestamp.now(),
        read: false
      });
      setMsgSent(true);
      setTimeout(()=>{setShowMsgModal(false);setMsgSent(false);setMsgContent('');}, 1500);
    } catch (e) {
      setMsgError('留言發送失敗，請稍後再試 (偵錯: ' + ((e as any)?.message||e) + ')');
    } finally {
      setMsgLoading(false);
    }
  }
  // 取得未讀訊息
  async function fetchUnreadMsgs() {
    if (!user) return;
    const q = query(collection(db, 'messages'), where('toUid', '==', user.uid), where('read', '==', false));
    const snap = await getDocs(q);
    setUnreadMsgs(snap.docs.map(doc=>({id:doc.id,...doc.data()})));
  }
  useEffect(()=>{ fetchUnreadMsgs(); },[user, showInbox]);
  // 標記訊息已讀
  async function markMsgRead(msgId:string) {
    await updateDoc(fsDoc(db, 'messages', msgId), { read: true });
    fetchUnreadMsgs();
  }
  // 送出表單時寫入 helpNeeds
  async function handleNeedHelpSubmit(data: any) {
    try {
      console.log('開始保存需要幫助數據:', data);
      console.log('用戶信息:', userInfo);
      console.log('當前用戶:', user);
      
      if (!user) {
        console.error('用戶未登入');
        setToast('❌ 請先登入後再送出');
        setTimeout(()=>setToast(''), 3000);
        return;
      }
      
      const docRef = await addDoc(collection(db, 'helpSupplies'), {
        ...data,
        type: 'need', // 添加類型標識
        avatarUrl: userInfo.avatarUrl,
        nickname: userInfo.nickname,
        email: userInfo.email,
        country: userInfo.country,
        gender: userInfo.gender,
        age: userInfo.age,
        createdAt: Timestamp.now(),
        uid: user?.uid || '',
      });
      
      console.log('數據保存成功，文檔ID:', docRef.id);
      setShowMsgSent(true);
      setTimeout(()=>{
        setShowMsgSent(false);
        setShowNeedHelp(false);
      }, 1800);
      setToast('🎉 你的需求已送出，社群夥伴會看到！');
      setTimeout(()=>setToast(''), 3000);
      fetchHelpNeedsList();
    } catch (error) {
      console.error('保存需要幫助數據失敗:', error);
      setToast('❌ 保存失敗，請稍後再試');
      setTimeout(()=>setToast(''), 3000);
    }
  }
  // 取得需要幫助列表
  async function fetchHelpNeedsList() {
    try {
      console.log('開始獲取需要幫助列表');
      const q = query(collection(db, 'helpSupplies'), where('type', '==', 'need'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc=>({id:doc.id,...doc.data()}));
      // 在客戶端按時間倒序排列
      const sortedData = data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return timeB - timeA;
      });
      console.log('獲取到的需要幫助數據:', sortedData);
      setHelpNeedsList(sortedData);
    } catch (error) {
      console.error('獲取需要幫助列表失敗:', error);
      setToast('❌ 獲取數據失敗，請稍後再試');
      setTimeout(()=>setToast(''), 3000);
    }
  }
  // 進入互助房 tab 時自動 fetch
  useEffect(()=>{ if(tab==='room') fetchHelpNeedsList(); },[tab]);
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'auto', position: 'relative' }}>
      {/* 手機適配：檢測螢幕寬度 */}
      {window.innerWidth <= 768 ? (
        // 手機版佈局
        <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
          {/* 手機版共用頁頭 */}
          <SharedHeader />
          
          {/* 手機版主內容區 */}
          <div style={{ marginTop: 60, padding: '16px', flex: 1, overflowY: 'auto', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', paddingBottom: '48px', position:'relative' }}>
    
      {/* 訊息彈窗 */}
      {showInbox && (
        <>
          {/* 背景遮罩 */}
          <div 
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              background: 'rgba(0,0,0,0.3)', 
              zIndex: 10000 
            }}
            onClick={() => setShowInbox(false)}
          />
          {/* 跳窗內容 */}
          <div 
            style={{ 
              position:'fixed', 
              top:70, 
              right:36, 
              background:'#fff', 
              borderRadius:18, 
              boxShadow:'0 4px 24px #6B5BFF33', 
              padding:24, 
              minWidth:320, 
              zIndex:10001 
            }}
          >
            <div style={{ fontWeight:900, fontSize:20, color:'#6B5BFF', marginBottom:12 }}>{TRANSLATIONS[lang]?.messages?.inboxTitle || '站內訊息'}</div>
            {unreadMsgs.length===0 && <div style={{ color:'#888', fontSize:15 }}>{TRANSLATIONS[lang]?.messages?.noMessages || '目前沒有新訊息'}</div>}
            {unreadMsgs.map(msg=>(
              <div key={msg.id} style={{ background:'#f7f7ff', borderRadius:12, padding:12, marginBottom:12, boxShadow:'0 2px 8px #6B5BFF11', cursor:'pointer' }}
                   onClick={() => {
                     // 切換訊息的展開狀態
                     setExpandedMessages(prev => ({
                       ...prev,
                       [msg.id]: !prev[msg.id]
                     }));
                   }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontWeight:700, color:'#1976d2' }}>{msg.fromNickname} {TRANSLATIONS[lang]?.messages?.messageFrom || '給你的留言：'}</div>
                  <span style={{ fontSize:12, color:'#888' }}>{expandedMessages[msg.id] ? '收起' : '展開'}</span>
                </div>
                
                {/* 展開的詳細內容 */}
                {expandedMessages[msg.id] && (
                  <div style={{ 
                    background:'rgba(255,255,255,0.8)', 
                    borderRadius:8, 
                    padding:12, 
                    marginBottom:8,
                    border:'1px solid #e0e7ff'
                  }}>
                    <div style={{ color:'#232946', marginBottom:8, lineHeight:'1.5' }}>{msg.content}</div>
                    <div style={{ color:'#888', fontSize:13, marginBottom:8 }}>{msg.timestamp?.toDate?.().toLocaleString?.()}</div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <span onClick={() => window.open(`mailto:${msg.fromEmail}`)} style={{ color:'#6B5BFF', fontWeight:700, textDecoration:'underline', fontSize:13, cursor: 'pointer' }}>{TRANSLATIONS[lang]?.messages?.contactUser || '聯絡對方'}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // 防止觸發父元素的點擊事件
                          markMsgRead(msg.id);
                        }} 
                        style={{ 
                          background:'#eee', 
                          color:'#6B5BFF', 
                          border:'none', 
                          borderRadius:6, 
                          padding:'4px 12px', 
                          fontWeight:700, 
                          fontSize:13, 
                          cursor:'pointer' 
                        }}
                      >
                        {TRANSLATIONS[lang]?.messages?.markRead || '標記已讀'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 未展開時顯示的預覽 */}
                {!expandedMessages[msg.id] && (
                  <div style={{ color:'#666', fontSize:14, fontStyle:'italic' }}>
                    {msg.content.length > 30 ? `${msg.content.substring(0, 30)}...` : msg.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {toast && (
        <div style={{ position:'fixed', top:40, left:'50%', transform:'translateX(-50%)', background:'#fff', color:'#6B5BFF', fontWeight:700, fontSize:18, borderRadius:16, boxShadow:'0 4px 24px #6B5BFF22', padding:'18px 36px', zIndex:99999, textAlign:'center', letterSpacing:1 }}>
          {toast}
        </div>
      )}
      
      {/* Top Bar 獨立卡片 - 調整佈局，主標題和🔔居中 */}
      <div
          style={{
              width: '100%',
              maxWidth: 700,
              margin: '20px auto 20px auto',
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.95)',
              borderRadius: 16,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
          }}
      >
          <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8,
              justifyContent: 'center',
          }}>
              <h1 style={{ 
                  fontWeight: 900, 
                  fontSize: 18, 
                  color: '#6B5BFF', 
                  margin: 0, 
                  lineHeight: 1,
                  textShadow: '0 2px 8px #6B5BFF88',
                  textAlign: 'center',
              }}>
                  <span role="img" aria-label="helplab">🧪</span> {getText('title')}
              </h1>
              <button
                  onClick={() => setShowInbox(v => !v)}
                  style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      padding: '8px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 8,
                  }}
              >
                  <span style={{ fontSize: 24, color: '#6B5BFF' }}>🔔</span>
                  {unreadMsgs.length > 0 && (
                      <span style={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          minWidth: 18,
                          height: 18,
                          background: '#ff4d4f',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #fff',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: 13,
                          padding: '0 5px',
                          boxShadow: '0 2px 8px #ff4d4f88',
                          zIndex: 1
                      }}>{unreadMsgs.length}</span>
                  )}
              </button>
          </div>
      </div>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 0 16px', background: '#fff', borderRadius: 32, boxShadow: '0 8px 40px #b6b6f633, 0 1.5px 8px #6B5BFF22', border: '1.5px solid #e0e7ff' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:24 }}>
          <button onClick={()=>setTab('provide')} style={{ fontWeight:900, fontSize:18, color:tab==='provide'?'#6B5BFF':'#888', background:'#fff', border:tab==='provide'?'3px solid #6B5BFF':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #b6b6f633', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('provide')}</button>
          <button onClick={()=>setTab('supply')} style={{ fontWeight:900, fontSize:18, color:tab==='supply'?'#6B5BFF':'#888', background:'#fff', border:tab==='supply'?'3px solid #6B5BFF':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #b6b6f633', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('supply')}</button>
          <button onClick={()=>setTab('need')} style={{ fontWeight:900, fontSize:18, color:tab==='need'?'#ff4d4f':'#888', background:'#fff', border:tab==='need'?'3px solid #ff4d4f':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #ffb74d55', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('need')}</button>
          <button onClick={()=>setTab('room')} style={{ fontWeight:900, fontSize:18, color:tab==='room'?'#ff4d4f':'#888', background:'#fff', border:tab==='room'?'3px solid #ff4d4f':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #ffb74d55', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('room')}</button>
        </div>
        {tab==='provide' && (
          <>
            <p style={{ textAlign: 'center', color: '#555', fontSize: 18, marginBottom: 36 }}>
              {getText('intro')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
              {sections.map((sec, i) => (
                <div key={i} style={{ background: sec.color, borderRadius: 20, boxShadow: '0 4px 24px #0001', padding: '32px 28px', minWidth: 260, maxWidth: 320, flex: '1 1 260px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{sec.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, color: '#333', letterSpacing: 1 }}>{sec.title}</div>
                  <div style={{ color: '#666', fontSize: 15, marginBottom: 18, textAlign: 'center', minHeight: 44 }}>{sec.desc}</div>
                  {i===0 ? (
                    <button onClick={()=>{setTab('provide'); setShowProvide(true);}} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a777e355', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                  ) : i===1 ? (
                    <button onClick={()=>{setTab('need'); setShowNeedHelp(true);}} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                  ) : i===2 ? (
                    <button onClick={()=>setTab('supply')} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a777e355', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                  ) : (
                    <button onClick={()=>setTab('room')} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', color: '#888', fontSize: 15, marginTop: 40 }}>
              {getText('rule')}
            </div>
            <ProvideModal open={showProvide} onClose={()=>{
              setShowProvide(false);
              // 手機版：點擊取消按鈕時回到HelpLab頁面
              if (window.innerWidth <= 768) {
                navigate('/HelpLab');
              }
            }} userInfo={userInfo} onSubmit={handleProvideSubmit} />
          </>
        )}
        {tab==='supply' && (
          <div style={{ marginTop:24 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:15, tableLayout:'fixed' }}>
              <colgroup>
                <col style={{width:'28%'}} />
                <col style={{width:'14%'}} />
                <col style={{width:'22%'}} />
                <col style={{width:'12%'}} />
                <col style={{width:'12%'}} />
                <col style={{width:'12%'}} />
              </colgroup>
              <thead>
                <tr style={{ background:'#f3f3ff', color:'#6B5BFF' }}>
                  <th style={{ padding:'8px 4px', textAlign:'left' }}>{getText('date')}</th>
                  <th style={{ textAlign:'center' }}>{getText('avatar')}</th>
                  <th style={{ textAlign:'left' }}>{getText('name')}</th>
                  <th style={{ textAlign:'center' }}>{getText('gender')}</th>
                  <th style={{ textAlign:'center' }}>{getText('age')}</th>
                  <th style={{ textAlign:'center' }}>{getText('country')}</th>
                </tr>
              </thead>
              <tbody>
                {supplyList.map((item,i)=>(
                  <React.Fragment key={item.id}>
                    <tr style={{ cursor:'pointer', borderBottom:'1px solid #eee' }} onClick={()=>setExpandedIdx(expandedIdx===i?null:i)}>
                      <td>{item.createdAt?.toDate?.()?.toLocaleString?.()||''}</td>
                      <td><img src={item.avatarUrl||'/ctx-logo.png'} alt="avatar" style={{ width:36, height:36, borderRadius:'50%' }} /></td>
                      <td style={{ color:'#1976d2', fontWeight:700, textDecoration:'underline', cursor:'pointer' }} onClick={()=>{ setMsgTo(item); setShowMsgModal(true); }}>{item.nickname}</td>
                      <td>{item.gender}</td>
                      <td>{item.age}</td>
                      <td>{item.country}</td>
                    </tr>
                    {expandedIdx===i && (
                      <tr>
                        <td colSpan={6} style={{ background:'#f8f8ff', padding:18 }}>
                          <div style={{ fontWeight:700, color:'#6B5BFF', marginBottom:8 }}>【你的困難也是我們的困難，讓我們一起面對並解決】</div>
                          <div style={{ marginBottom:8 }}><b>經歷：</b>{(item.exp||[]).join('、')}{item.expOther?`、${item.expOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>優勢：</b>{(item.adv||[]).join('、')}{item.advOther?`、${item.advOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>優先幫助對象：</b>{(item.target||[]).join('、')}{item.targetOther?`、${item.targetOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>幫助形式：</b>{item.helpType}</div>
                          <div style={{ marginBottom:8 }}><b>特別聲明：</b>{item.statement}</div>
                          <div style={{ marginBottom:8 }}><b>幫助頻率：</b>{item.freq}{item.freqOther?`、${item.freqOther}`:''}</div>
                          <div style={{ marginTop:12 }}>
                            <span onClick={() => window.open(`mailto:${item.email}`)} style={{ color:'#6B5BFF', textDecoration:'underline', marginLeft:12, cursor: 'pointer' }}>{item.email}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tab==='need' && (
          <>
            <p style={{ textAlign: 'center', color: '#555', fontSize: 18, marginBottom: 36 }}>
              {getText('introNeed')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
              <button onClick={()=>setShowNeedHelp(true)} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{getText('needBtn')}</button>
            </div>
            <NeedHelpModal open={showNeedHelp} onClose={()=>setShowNeedHelp(false)} userInfo={userInfo} onSubmit={handleNeedHelpSubmit} showMsgSent={showMsgSent} />
          </>
        )}
        {tab==='room' && (
          <div style={{ marginTop:24 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:15 }}>
              <thead>
                <tr style={{ background:'#fff3e0', color:'#ff4d4f' }}>
                  <th style={{ padding:'8px 4px', textAlign:'left' }}>{getText('date')}</th>
                  <th style={{ textAlign:'center' }}>{getText('avatar')}</th>
                  <th style={{ textAlign:'left' }}>{getText('name')}</th>
                  <th style={{ textAlign:'center' }}>{getText('gender')}</th>
                  <th style={{ textAlign:'center' }}>{getText('age')}</th>
                  <th style={{ textAlign:'center' }}>{getText('country')}</th>
                </tr>
              </thead>
              <tbody>
                {helpNeedsList.map((item,i)=>(
                  <React.Fragment key={item.id}>
                    <tr style={{ cursor:'pointer', borderBottom:'1px solid #eee' }} onClick={()=>setExpandedIdx(expandedIdx===i?null:i)}>
                      <td>{item.createdAt?.toDate?.()?.toLocaleString?.()||''}</td>
                      <td><img src={item.avatarUrl||'/ctx-logo.png'} alt="avatar" style={{ width:36, height:36, borderRadius:'50%' }} /></td>
                      <td style={{ color:'#ff4d4f', fontWeight:700, textDecoration:'underline', cursor:'pointer' }} onClick={()=>{ setMsgTo(item); setShowMsgModal(true); }}>{item.nickname}</td>
                      <td>{item.gender}</td>
                      <td>{item.age}</td>
                      <td>{item.country}</td>
                    </tr>
                    {expandedIdx===i && (
                      <tr>
                        <td colSpan={6} style={{ background:'#fff8f0', padding:18 }}>
                          <div style={{ fontWeight:700, color:'#ff4d4f', marginBottom:8 }}>【你的困難我們一起面對，社群夥伴會主動協助你】</div>
                          <div style={{ marginBottom:8 }}><b>經歷：</b>{(item.exp||[]).join('、')}{item.expOther?`、${item.expOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>優勢：</b>{(item.adv||[]).join('、')}{item.advOther?`、${item.advOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>困難/需求：</b>{(item.target||[]).join('、')}{item.targetOther?`、${item.targetOther}`:''}</div>
                          <div style={{ marginBottom:8 }}><b>協助形式：</b>{item.helpType}</div>
                          <div style={{ marginBottom:8 }}><b>補充說明：</b>{item.statement}</div>
                          <div style={{ marginBottom:8 }}><b>協助頻率：</b>{item.freq}{item.freqOther?`、${item.freqOther}`:''}</div>
                          <div style={{ marginTop:12 }}>
                            <span onClick={() => window.open(`mailto:${item.email}`)} style={{ color:'#ff4d4f', textDecoration:'underline', marginLeft:12, cursor: 'pointer' }}>{item.email}</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 供應圈列表名稱可點擊留言 */}
      {showMsgModal && msgTo && (
        <div style={{ position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(40,40,80,0.18)', zIndex: 10000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:18, boxShadow:'0 4px 24px #6B5BFF33', padding:28, minWidth:280, maxWidth:340, width:'90vw', position:'relative', display:'flex', flexDirection:'column', gap:12 }}>
            <button type="button" onClick={()=>setShowMsgModal(false)} style={{ position:'absolute', top:10, right:12, background:'none', border:'none', fontSize:22, color:'#888', cursor:'pointer', fontWeight:700 }}>×</button>
            <div style={{ fontWeight:800, fontSize:18, color:'#6B5BFF', textAlign:'center', marginBottom:2 }}>{getText('msgTo')}{msgTo.nickname}</div>
            <textarea value={msgContent} onChange={e=>setMsgContent(e.target.value)} rows={3} maxLength={100} placeholder={getText('msgPlaceholder')} style={{ border:'1px solid #e0e7ff', borderRadius:8, padding:'6px 10px', fontSize:15, resize:'none' }} />
            {msgError && <div style={{ color:'#ff4d4f', fontWeight:700, textAlign:'center', marginTop:4 }}>{msgError}</div>}
            <button onClick={()=>sendMessage(msgTo, msgContent)} disabled={!msgContent.trim()||msgLoading} style={{ background:'linear-gradient(90deg, #6e8efb, #a777e3)', color:'#fff', border:'none', borderRadius:14, padding:'6px 18px', fontWeight:700, fontSize:15, cursor:!msgContent.trim()||msgLoading?'not-allowed':'pointer', alignSelf:'center', opacity:!msgContent.trim()||msgLoading?0.6:1 }}>{msgLoading?'送出中...':'送出留言'}</button>
            {msgSent && <div style={{ color:'#6B5BFF', fontWeight:700, textAlign:'center', marginTop:8 }}>{getText('msgSent')}</div>}
          </div>
        </div>
      )}
          
          </div>
        </div>
      ) : (
        // 桌面版佈局
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: '0 0 48px 0', position:'relative', overflow: 'auto' }}>
          {/* 桌面版頂部導航 - 完整複製首頁的頁頭 */}
          <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
            {/* 左側：LOGO */}
            <div style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
              <img src="/ctx-logo.png" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => setTab('provide')} />
            </div>
            
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
                aria-label={lang==='zh-TW'?'提供意見和建議':'zh-CN'===lang?'提供意见和建议':'en'===lang?'Provide feedback and suggestions':'ja'===lang?'ご意見やご提案を提供':'ko'===lang?'의견과 제안 제공':'th'===lang?'ให้ข้อเสนอแนะและคำแนะนำ':'vi'===lang?'Cung cấp phản hồi và đề xuất':'ms'===lang?'Berikan maklum balas dan cadangan':'Praebe consilia et suggestiones'}
                role="button"
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
            {/* 語言選擇按鈕，靠右且寬度縮短，點擊彈出小框 */}
            <div ref={langBoxRef} style={{ position: 'relative', display: 'inline-block' }} className="language-selector">
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
                    <div key={l} style={{ padding: '10px 18px', cursor: 'pointer', color: l === lang ? '#6B5BFF' : '#232946', fontWeight: l === lang ? 700 : 500, background: l === lang ? '#f3f0ff' : '#fff' }} onClick={() => { setLang(l as any); setShowLangBox(false); }}>
                      {l === 'zh-TW' ? '繁中' : l === 'zh-CN' ? '简中' : l === 'en' ? 'English' : l === 'ja' ? '日本語' : l === 'ko' ? '한국어' : l === 'th' ? 'ไทย' : l === 'vi' ? 'Tiếng Việt' : l === 'ms' ? 'Bahasa Melayu' : 'Latin'}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 漢堡選單 - 法律文件 */}
            <div ref={legalMenuRef} style={{ position: 'relative', display: 'inline-block' }} className="legal-menu">
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
                      {item.title[lang] || item.title['zh-TW']}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* 測試模式按鈕 */}
          <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10001 }}>
            <button
              style={{
                background: isTestMode ? '#ff4d4f' : '#52c41a',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '6px 12px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              測試模式 {isTestMode ? 'ON' : 'OFF'}
            </button>
          </div>
          
          {/* 桌面版主內容區 */}
          <div style={{ padding: '120px 20px 20px 20px', maxWidth: 1200, margin: '0 auto' }}>
            {/* 訊息彈窗 */}
            {showInbox && (
              <>
                {/* 背景遮罩 */}
                <div 
                  style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    background: 'rgba(0,0,0,0.3)', 
                    zIndex: 10000 
                  }}
                  onClick={() => setShowInbox(false)}
                />
                {/* 跳窗內容 */}
                <div 
                  style={{ 
                    position:'fixed', 
                    top:70, 
                    right:36, 
                    background:'#fff', 
                    borderRadius:18, 
                    boxShadow:'0 4px 24px #6B5BFF33', 
                    padding:24, 
                    minWidth:320, 
                    zIndex:10001 
                  }}
                >
                  <div style={{ fontWeight:900, fontSize:20, color:'#6B5BFF', marginBottom:12 }}>{TRANSLATIONS[lang]?.messages?.inboxTitle || '站內訊息'}</div>
                  {unreadMsgs.length===0 && <div style={{ color:'#888', fontSize:15 }}>{TRANSLATIONS[lang]?.messages?.noMessages || '目前沒有新訊息'}</div>}
                  {unreadMsgs.map(msg=>(
                    <div key={msg.id} style={{ background:'#f7f7ff', borderRadius:12, padding:12, marginBottom:12, boxShadow:'0 2px 8px #6B5BFF11', cursor:'pointer' }}
                         onClick={() => {
                           // 切換訊息的展開狀態
                           setExpandedMessages(prev => ({
                             ...prev,
                             [msg.id]: !prev[msg.id]
                           }));
                         }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                        <div style={{ fontWeight:700, color:'#1976d2' }}>{msg.fromNickname} {TRANSLATIONS[lang]?.messages?.messageFrom || '給你的留言：'}</div>
                        <span style={{ fontSize:12, color:'#888' }}>{expandedMessages[msg.id] ? '收起' : '展開'}</span>
                      </div>
                      
                      {/* 展開的詳細內容 */}
                      {expandedMessages[msg.id] && (
                        <div style={{ 
                          background:'rgba(255,255,255,0.8)', 
                          borderRadius:8, 
                          padding:12, 
                          marginBottom:8,
                          border:'1px solid #e0e7ff'
                        }}>
                          <div style={{ color:'#232946', marginBottom:8, lineHeight:'1.5' }}>{msg.content}</div>
                          <div style={{ color:'#888', fontSize:13, marginBottom:8 }}>{msg.timestamp?.toDate?.().toLocaleString?.()}</div>
                          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                            <span onClick={() => window.open(`mailto:${msg.fromEmail}`)} style={{ color:'#6B5BFF', fontWeight:700, textDecoration:'underline', fontSize:13, cursor: 'pointer' }}>{TRANSLATIONS[lang]?.messages?.contactUser || '聯絡對方'}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // 防止觸發父元素的點擊事件
                                markMsgRead(msg.id);
                              }} 
                              style={{ 
                                background:'#eee', 
                                color:'#6B5BFF', 
                                border:'none', 
                                borderRadius:6, 
                                padding:'4px 12px', 
                                fontWeight:700, 
                                fontSize:13, 
                                cursor:'pointer' 
                              }}
                            >
                              {TRANSLATIONS[lang]?.messages?.markRead || '標記已讀'}
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* 未展開時顯示的預覽 */}
                      {!expandedMessages[msg.id] && (
                        <div style={{ color:'#666', fontSize:14, fontStyle:'italic' }}>
                          {msg.content.length > 30 ? `${msg.content.substring(0, 30)}...` : msg.content}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            {toast && (
              <div style={{ position:'fixed', top:40, left:'50%', transform:'translateX(-50%)', background:'#fff', color:'#6B5BFF', fontWeight:700, fontSize:18, borderRadius:16, boxShadow:'0 4px 24px #6B5BFF22', padding:'18px 36px', zIndex:99999, textAlign:'center', letterSpacing:1 }}>
                {toast}
              </div>
            )}
            
            {/* Top Bar 獨立卡片 - 調整佈局，主標題和🔔居中，縮短卡片寬度 */}
            <div
                style={{
                    width: 'fit-content',
                    margin: '20px auto 20px auto',
                    padding: '12px 20px',
                    background: 'rgba(255,255,255,0.95)',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 8,
                    justifyContent: 'center',
                }}>
                    <h1 style={{ 
                        fontWeight: 900, 
                        fontSize: 18, 
                        color: '#6B5BFF', 
                        margin: 0, 
                        lineHeight: 1,
                        textShadow: '0 2px 8px #6B5BFF88',
                        textAlign: 'center',
                    }}>
                        <span role="img" aria-label="helplab">🧪</span> {getText('title')}
                    </h1>
                    <button
                        onClick={() => setShowInbox(v => !v)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            padding: '8px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: 8,
                        }}
                    >
                        <span style={{ fontSize: 24, color: '#6B5BFF' }}>🔔</span>
                        {unreadMsgs.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                minWidth: 18,
                                height: 18,
                                background: '#ff4d4f',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid #fff',
                                color: '#fff',
                                fontWeight: 900,
                                fontSize: 13,
                                padding: '0 5px',
                                boxShadow: '0 2px 8px #ff4d4f88',
                                zIndex: 1
                            }}>{unreadMsgs.length}</span>
                        )}
                    </button>
                </div>
            </div>
            <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 16px 0 16px', background: '#fff', borderRadius: 32, boxShadow: '0 8px 40px #b6b6f633, 0 1.5px 8px #6B5BFF22', border: '1.5px solid #e0e7ff' }}>
              <div style={{ display:'flex', justifyContent:'center', gap:24, marginBottom:24 }}>
                <button onClick={()=>setTab('provide')} style={{ fontWeight:900, fontSize:18, color:tab==='provide'?'#6B5BFF':'#888', background:'#fff', border:tab==='provide'?'3px solid #6B5BFF':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #b6b6f633', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('provide')}</button>
                <button onClick={()=>setTab('supply')} style={{ fontWeight:900, fontSize:18, color:tab==='supply'?'#6B5BFF':'#888', background:'#fff', border:tab==='supply'?'3px solid #6B5BFF':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #b6b6f633', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('supply')}</button>
                <button onClick={()=>setTab('need')} style={{ fontWeight:900, fontSize:18, color:tab==='need'?'#ff4d4f':'#888', background:'#fff', border:tab==='need'?'3px solid #ff4d4f':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #ffb74d55', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('need')}</button>
                <button onClick={()=>setTab('room')} style={{ fontWeight:900, fontSize:18, color:tab==='room'?'#ff4d4f':'#888', background:'#fff', border:tab==='room'?'3px solid #ff4d4f':'2px solid #e0e7ff', borderRadius:16, boxShadow:'0 2px 8px #ffb74d55', padding:'8px 24px', cursor:'pointer', marginBottom:2 }}>{getText('room')}</button>
              </div>
              {tab==='provide' && (
                <>
                  <p style={{ textAlign: 'center', color: '#555', fontSize: 18, marginBottom: 36 }}>
                    {getText('intro')}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                    {sections.map((sec, i) => (
                      <div key={i} style={{ background: sec.color, borderRadius: 20, boxShadow: '0 4px 24px #0001', padding: '32px 28px', minWidth: 260, maxWidth: 320, flex: '1 1 260px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>{sec.emoji}</div>
                        <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8, color: '#333', letterSpacing: 1 }}>{sec.title}</div>
                        <div style={{ color: '#666', fontSize: 15, marginBottom: 18, textAlign: 'center', minHeight: 44 }}>{sec.desc}</div>
                        {i===0 ? (
                          <button onClick={()=>{setTab('provide'); setShowProvide(true);}} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a777e355', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                        ) : i===1 ? (
                          <button onClick={()=>{setTab('need'); setShowNeedHelp(true);}} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                        ) : i===2 ? (
                          <button onClick={()=>setTab('supply')} style={{ background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #a777e355', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                        ) : (
                          <button onClick={()=>setTab('room')} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{sec.btn}</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', color: '#888', fontSize: 15, marginTop: 40 }}>
                    {getText('rule')}
                  </div>
                  <ProvideModal open={showProvide} onClose={()=>{
                    setShowProvide(false);
                    // 手機版：點擊取消按鈕時回到HelpLab頁面
                    if (window.innerWidth <= 768) {
                      navigate('/HelpLab');
                    }
                  }} userInfo={userInfo} onSubmit={handleProvideSubmit} />
                </>
              )}
              {tab==='supply' && (
                <div style={{ marginTop:24 }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:15, tableLayout:'fixed' }}>
                    <colgroup>
                      <col style={{width:'28%'}} />
                      <col style={{width:'14%'}} />
                      <col style={{width:'22%'}} />
                      <col style={{width:'12%'}} />
                      <col style={{width:'12%'}} />
                      <col style={{width:'12%'}} />
                    </colgroup>
                    <thead>
                      <tr style={{ background:'#f3f3ff', color:'#6B5BFF' }}>
                        <th style={{ padding:'8px 4px', textAlign:'left' }}>{getText('date')}</th>
                        <th style={{ textAlign:'center' }}>{getText('avatar')}</th>
                        <th style={{ textAlign:'left' }}>{getText('name')}</th>
                        <th style={{ textAlign:'center' }}>{getText('gender')}</th>
                        <th style={{ textAlign:'center' }}>{getText('age')}</th>
                        <th style={{ textAlign:'center' }}>{getText('country')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyList.map((item,i)=>(
                        <React.Fragment key={item.id}>
                          <tr style={{ cursor:'pointer', borderBottom:'1px solid #eee' }} onClick={()=>setExpandedIdx(expandedIdx===i?null:i)}>
                            <td>{item.createdAt?.toDate?.()?.toLocaleString?.()||''}</td>
                            <td><img src={item.avatarUrl||'/ctx-logo.png'} alt="avatar" style={{ width:36, height:36, borderRadius:'50%' }} /></td>
                            <td style={{ color:'#1976d2', fontWeight:700, textDecoration:'underline', cursor:'pointer' }} onClick={()=>{ setMsgTo(item); setShowMsgModal(true); }}>{item.nickname}</td>
                            <td>{item.gender}</td>
                            <td>{item.age}</td>
                            <td>{item.country}</td>
                          </tr>
                          {expandedIdx===i && (
                            <tr>
                              <td colSpan={6} style={{ background:'#f8f8ff', padding:18 }}>
                                <div style={{ fontWeight:700, color:'#6B5BFF', marginBottom:8 }}>【你的困難也是我們的困難，讓我們一起面對並解決】</div>
                                <div style={{ marginBottom:8 }}><b>經歷：</b>{(item.exp||[]).join('、')}{item.expOther?`、${item.expOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>優勢：</b>{(item.adv||[]).join('、')}{item.advOther?`、${item.advOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>優先幫助對象：</b>{(item.target||[]).join('、')}{item.targetOther?`、${item.targetOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>幫助形式：</b>{item.helpType}</div>
                                <div style={{ marginBottom:8 }}><b>特別聲明：</b>{item.statement}</div>
                                <div style={{ marginBottom:8 }}><b>幫助頻率：</b>{item.freq}{item.freqOther?`、${item.freqOther}`:''}</div>
                                <div style={{ marginTop:12 }}>
                                  <span onClick={() => window.open(`mailto:${item.email}`)} style={{ color:'#6B5BFF', textDecoration:'underline', marginLeft:12, cursor: 'pointer' }}>{item.email}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {tab==='need' && (
                <>
                  <p style={{ textAlign: 'center', color: '#555', fontSize: 18, marginBottom: 36 }}>
                    {getText('introNeed')}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
                    <button onClick={()=>setShowNeedHelp(true)} style={{ background: 'linear-gradient(90deg, #ff4d4f, #ffb74d)', color: '#fff', border: 'none', borderRadius: 24, padding: '10px 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #ffb74d55', marginTop: 'auto', transition: 'background 0.2s' }}>{getText('needBtn')}</button>
                  </div>
                  <NeedHelpModal open={showNeedHelp} onClose={()=>setShowNeedHelp(false)} userInfo={userInfo} onSubmit={handleNeedHelpSubmit} showMsgSent={showMsgSent} />
                </>
              )}
              {tab==='room' && (
                <div style={{ marginTop:24 }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:15 }}>
                    <thead>
                      <tr style={{ background:'#fff3e0', color:'#ff4d4f' }}>
                        <th style={{ padding:'8px 4px', textAlign:'left' }}>{getText('date')}</th>
                        <th style={{ textAlign:'center' }}>{getText('avatar')}</th>
                        <th style={{ textAlign:'left' }}>{getText('name')}</th>
                        <th style={{ textAlign:'center' }}>{getText('gender')}</th>
                        <th style={{ textAlign:'center' }}>{getText('age')}</th>
                        <th style={{ textAlign:'center' }}>{getText('country')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {helpNeedsList.map((item,i)=>(
                        <React.Fragment key={item.id}>
                          <tr style={{ cursor:'pointer', borderBottom:'1px solid #eee' }} onClick={()=>setExpandedIdx(expandedIdx===i?null:i)}>
                            <td>{item.createdAt?.toDate?.()?.toLocaleString?.()||''}</td>
                            <td><img src={item.avatarUrl||'/ctx-logo.png'} alt="avatar" style={{ width:36, height:36, borderRadius:'50%' }} /></td>
                            <td style={{ color:'#ff4d4f', fontWeight:700, textDecoration:'underline', cursor:'pointer' }} onClick={()=>{ setMsgTo(item); setShowMsgModal(true); }}>{item.nickname}</td>
                            <td>{item.gender}</td>
                            <td>{item.age}</td>
                            <td>{item.country}</td>
                          </tr>
                          {expandedIdx===i && (
                            <tr>
                              <td colSpan={6} style={{ background:'#fff8f0', padding:18 }}>
                                <div style={{ fontWeight:700, color:'#ff4d4f', marginBottom:8 }}>【你的困難我們一起面對，社群夥伴會主動協助你】</div>
                                <div style={{ marginBottom:8 }}><b>經歷：</b>{(item.exp||[]).join('、')}{item.expOther?`、${item.expOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>優勢：</b>{(item.adv||[]).join('、')}{item.advOther?`、${item.advOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>困難/需求：</b>{(item.target||[]).join('、')}{item.targetOther?`、${item.targetOther}`:''}</div>
                                <div style={{ marginBottom:8 }}><b>協助形式：</b>{item.helpType}</div>
                                <div style={{ marginBottom:8 }}><b>補充說明：</b>{item.statement}</div>
                                <div style={{ marginBottom:8 }}><b>協助頻率：</b>{item.freq}{item.freqOther?`、${item.freqOther}`:''}</div>
                                <div style={{ marginTop:12 }}>
                                  <span onClick={() => window.open(`mailto:${item.email}`)} style={{ color:'#ff4d4f', textDecoration:'underline', marginLeft:12, cursor: 'pointer' }}>{item.email}</span>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 供應圈列表名稱可點擊留言 */}
            {showMsgModal && msgTo && (
              <div style={{ position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(40,40,80,0.18)', zIndex: 10000, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ background:'#fff', borderRadius:18, boxShadow:'0 4px 24px #6B5BFF33', padding:28, minWidth:280, maxWidth:340, width:'90vw', position:'relative', display:'flex', flexDirection:'column', gap:12 }}>
                  <button type="button" onClick={()=>setShowMsgModal(false)} style={{ position:'absolute', top:10, right:12, background:'none', border:'none', fontSize:22, color:'#888', cursor:'pointer', fontWeight:700 }}>×</button>
                  <div style={{ fontWeight:800, fontSize:18, color:'#6B5BFF', textAlign:'center', marginBottom:2 }}>{getText('msgTo')}{msgTo.nickname}</div>
                  <textarea value={msgContent} onChange={e=>setMsgContent(e.target.value)} rows={3} maxLength={100} placeholder={getText('msgPlaceholder')} style={{ border:'1px solid #e0e7ff', borderRadius:8, padding:'6px 10px', fontSize:15, resize:'none' }} />
                  {msgError && <div style={{ color:'#ff4d4f', fontWeight:700, textAlign:'center', marginTop:4 }}>{msgError}</div>}
                  <button onClick={()=>sendMessage(msgTo, msgContent)} disabled={!msgContent.trim()||msgLoading} style={{ background:'linear-gradient(90deg, #6e8efb, #a777e3)', color:'#fff', border:'none', borderRadius:14, padding:'6px 18px', fontWeight:700, fontSize:15, cursor:!msgContent.trim()||msgLoading?'not-allowed':'pointer', alignSelf:'center', opacity:!msgContent.trim()||msgLoading?0.6:1 }}>{msgLoading?'送出中...':'送出留言'}</button>
                  {msgSent && <div style={{ color:'#6B5BFF', fontWeight:700, textAlign:'center', marginTop:8 }}>{getText('msgSent')}</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 