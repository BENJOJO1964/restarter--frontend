import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import SharedHeader from '../components/SharedHeader';
import TestModeButton from '../components/TestModeButton';

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

const FOOTER_TEXT = {
  'zh-TW': { privacy: '隱私權政策', terms: '條款/聲明', deletion: '資料刪除說明' },
  'zh-CN': { privacy: '隐私政策', terms: '条款/声明', deletion: '数据删除说明' },
  'en': { privacy: 'Privacy Policy', terms: 'Terms/Statement', deletion: 'Data Deletion' },
  'ja': { privacy: 'プライバシーポリシー', terms: '規約/声明', deletion: 'データ削除について' },
  'ko': { privacy: '개인정보보호정책', terms: '약관/성명', deletion: '데이터 삭제 설명' },
  'th': { privacy: 'นโยบายความเป็นส่วนตัว', terms: 'ข้อกำหนด/คำแถลง', deletion: 'คำอธิบายการลบข้อมูล' },
  'vi': { privacy: 'Chính sách bảo mật', terms: 'Điều khoản/Tuyên bố', deletion: 'Giải thích xóa dữ liệu' },
  'ms': { privacy: 'Dasar Privasi', terms: 'Terma/Penyata', deletion: 'Penerangan Pemadaman Data' },
  'la': { privacy: 'Consilium de Privata', terms: 'Termini/Declaratio', deletion: 'Explicatio Deletionis Datae' }
};

const TEXT: {
  [key: string]: {
    back?: string;
    logout?: string;
    title: string;
    subtitle?: string;
    steps?: { title: string; desc: string; placeholder: string }[];
    submit?: string;
    loading?: string;
    next?: string;
    finish?: string;
    finishSub?: string;
    error?: string;
    task?: string;
    done?: string;
    badge?: string;
    loadingText?: string;
    submitButton?: string;
    retry?: string;
  }
} = {
  'zh-TW': {
    back: '返回',
    logout: '登出',
    title: '重啟之路',
    subtitle: '一步步走出迷霧，看見全新的自己',
    steps: [
      { title: '第一站：迷霧山谷', desc: '寫下最近一件讓你感到強烈情緒的事。不必評判自己，單純描述事情的經過、你的感受，以及這個感受帶來的影響。', placeholder: '在這裡寫下你的故事...(300字內)' },
      { title: '第二站：希望之丘', desc: '回顧你剛剛寫下的事件，請思考：在那個情境下，你有沒有做過什麼小小的努力或嘗試？即使很微小，也請寫下來。', placeholder: '寫下你做過的努力或嘗試...(300字內)' },
      { title: '第三站：勇氣森林', desc: '根據你剛剛發現的努力或資源，請設定一個你願意嘗試的小行動，並寫下你預期會遇到的困難，以及你打算怎麼面對。', placeholder: '寫下你的小行動與預期困難...(300字內)' },
      { title: '第四站：智慧溪流', desc: '回顧你剛剛的行動經驗，請反思：這個過程中，你學到了什麼？有沒有什麼新的發現或領悟？', placeholder: '寫下你的學習與領悟...(300字內)' },
      { title: '第五站：重啟之巔', desc: '綜合前面所有關卡的經歷，請寫下你給未來自己的祝福或期許，並思考：如果未來再遇到困難，你會怎麼鼓勵自己？', placeholder: '寫下給自己的祝福或期許...(300字內)' }
    ],
    submit: '提交，尋求指引',
    loading: '請稍候...',
    next: '前往下一站',
    finish: '恭喜你完成重啟之路！',
    finishSub: '未來也請繼續善待自己！',
    error: '發生錯誤，請稍後再試。',
    retry: '再來一次',
  },
  'zh-CN': {
    back: '返回首页',
    logout: '登出',
    title: '日常任务挑战',
    subtitle: '一步步走出迷雾，看见全新的自己',
    steps: [
      { title: '第一站：迷雾山谷', desc: '写下最近一件让你感到强烈情绪的事。不必评判自己，单纯描述事情的经过、你的感受，以及这个感受带来的影响。', placeholder: '在这里写下你的故事...(300字内)' },
      { title: '第二站：希望之丘', desc: '回顾你刚刚写下的事件，请思考：在那个情境下，你有没有做过什么小小的努力或尝试？即使很微小，也请写下来。', placeholder: '写下你做过的努力或尝试...(300字内)' },
      { title: '第三站：勇气森林', desc: '根据你刚刚发现的努力或资源，请设定一个你愿意尝试的小行动，并写下你预期会遇到的困难，以及你打算怎么面对。', placeholder: '写下你的小行动与预期困难...(300字内)' },
      { title: '第四站：智慧溪流', desc: '回顾你刚刚的行动经验，请反思：这个过程中，你学到了什么？有没有什么新的发现或领悟？', placeholder: '写下你的学习与领悟...(300字内)' },
      { title: '第五站：重启之巅', desc: '综合前面所有关卡的经历，请写下你给未来自己的祝福或期许，并思考：如果未来再遇到困难，你会怎么鼓励自己？', placeholder: '写下给自己的祝福或期许...(300字内)' }
    ],
    submit: '提交，寻求指引',
    loading: '请稍候...',
    next: '前往下一站',
    finish: '恭喜你完成重启之路！',
    finishSub: '未来也请继续善待自己！',
    error: '发生错误，请稍后再试。',
    retry: '再来一次',
  },
  'en': {
    back: 'Back to Home',
    logout: 'Logout',
    title: 'Restart Journey',
    subtitle: 'Step by step out of the mist, see a new self',
    steps: [
      { title: 'Step 1: Misty Valley', desc: 'Write about a recent event that made you feel strong emotions. No need to judge yourself, just describe what happened, how you felt, and how it affected you.', placeholder: 'Write your story here...(300 words max)' },
      { title: 'Step 2: Hill of Hope', desc: 'Review the event you just wrote. Did you make any small effort or try anything in that situation? Even if it was minor, write it down.', placeholder: 'Write your effort or attempt...(300 words max)' },
      { title: 'Step 3: Forest of Courage', desc: 'Based on your discovered effort or resources, set a small action you are willing to try, and write down the difficulties you expect and how you plan to face them.', placeholder: 'Write your action and expected difficulties...(300 words max)' },
      { title: 'Step 4: Stream of Wisdom', desc: 'Reflect on your action experience. What did you learn? Any new discoveries or insights?', placeholder: 'Write your learning and insights...(300 words max)' },
      { title: 'Step 5: Summit of Restart', desc: 'Summarize all your experiences and write a blessing or expectation for your future self. If you face difficulties again, how will you encourage yourself?', placeholder: 'Write your blessing or expectation...(300 words max)' }
    ],
    submit: 'Submit for Guidance',
    loading: 'Please wait...',
    next: 'Next Step',
    finish: 'Congratulations on completing your restart journey!',
    finishSub: 'Please continue to be kind to yourself in the future!',
    error: 'An error occurred, please try again later.',
    retry: 'Try Again',
  },
  'ja': {
    back: 'ホームに戻る',
    logout: 'ログアウト',
    title: '日課ミッション挑戦',
    subtitle: '一歩ずつ霧を抜けて、新しい自分に出会おう',
    steps: [
      { title: '第1ステップ：霧の谷', desc: '最近あなたが強い感情を抱いた出来事について書いてください。自分を評価せず、出来事の経過や感情、その影響を素直に書きましょう。', placeholder: 'ここにあなたのストーリーを書いてください...(300字以内)' },
      { title: '第2ステップ：希望の丘', desc: '先ほど書いた出来事を振り返り、その状況であなたが行った小さな努力や試みがあれば書いてください。些細なことでも構いません。', placeholder: 'あなたの努力や試みを書いてください...(300字以内)' },
      { title: '第3ステップ：勇気の森', desc: '発見した努力やリソースをもとに、挑戦したい小さな行動と、予想される困難、それにどう向き合うかを書いてください。', placeholder: '行動と予想される困難を書いてください...(300字以内)' },
      { title: '第4ステップ：知恵の流れ', desc: '行動の経験を振り返り、学んだことや新たな気づきがあれば書いてください。', placeholder: '学びや気づきを書いてください...(300字以内)' },
      { title: '第5ステップ：再出発の頂', desc: 'これまでの経験をまとめ、未来の自分へのメッセージや期待を書いてください。困難に直面したとき、どう自分を励ますかも考えてみましょう。', placeholder: '未来の自分へのメッセージや期待を書いてください...(300字以内)' }
    ],
    submit: '提出して指導を求める',
    loading: 'お待ちください...',
    next: '次のステップへ',
    finish: '再出発の道を完了しました！',
    finishSub: 'これからも自分を大切にしてください！',
    error: 'エラーが発生しました。しばらくしてから再度お試しください。',
    retry: 'もう一度',
  },
  'ko': {
    back: '홈으로',
    logout: '로그아웃',
    title: '일일 미션 도전',
    subtitle: '한 걸음씩 안개를 걷고, 새로운 나를 만나보세요',
    steps: [
      { title: '1단계: 안개의 계곡', desc: '최근에 강한 감정을 느꼈던 일을 적어보세요. 자신을 평가하지 말고, 그 일의 과정과 감정, 그리고 그 감정이 가져온 영향을 솔직하게 적어보세요.', placeholder: '여기에 당신의 이야기를 적어주세요...(300자 이내)' },
      { title: '2단계: 희망의 언덕', desc: '방금 적은 일을 돌아보며, 그 상황에서 했던 작은 노력이나 시도가 있다면 적어보세요. 아주 사소한 것도 괜찮아요.', placeholder: '노력이나 시도를 적어주세요...(300자 이내)' },
      { title: '3단계: 용기의 숲', desc: '발견한 노력이나 자원을 바탕으로, 시도해보고 싶은 작은 행동과 예상되는 어려움, 그리고 어떻게 대처할지 적어보세요.', placeholder: '행동과 예상되는 어려움을 적어주세요...(300자 이내)' },
      { title: '4단계: 지혜의 시냇물', desc: '행동 경험을 돌아보며, 배운 점이나 새로운 깨달음이 있다면 적어보세요.', placeholder: '배운 점이나 깨달음을 적어주세요...(300자 이내)' },
      { title: '5단계: 재시작의 정상', desc: '지금까지의 경험을 종합해 미래의 나에게 전하고 싶은 메시지나 기대를 적어보세요. 앞으로 어려움이 닥칠 때 어떻게 자신을 격려할지도 생각해보세요.', placeholder: '미래의 나에게 전하고 싶은 메시지나 기대를 적어주세요...(300자 이내)' }
    ],
    submit: '제출하고 안내받기',
    loading: '잠시만 기다려주세요...',
    next: '다음 단계로',
    finish: '재시작의 여정을 완료했습니다!',
    finishSub: '앞으로도 자신을 소중히 하세요!',
    error: '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    retry: '다시 시도',
  },
  'th': {
    back: 'กลับหน้าหลัก',
    logout: 'ออกจากระบบ',
    title: 'ภารกิจประจำวัน',
    subtitle: 'ก้าวออกจากหมอกทีละก้าว พบกับตัวเองในมุมใหม่',
    steps: [
      { title: 'ขั้นที่ 1: หุบเขาหมอก', desc: 'เขียนเกี่ยวกับเหตุการณ์ล่าสุดที่ทำให้คุณรู้สึกอารมณ์รุนแรง ไม่ต้องตัดสินตัวเอง เพียงบรรยายเหตุการณ์ ความรู้สึก และผลกระทบที่เกิดขึ้น', placeholder: 'เขียนเรื่องราวของคุณที่นี่...(300 คำ)' },
      { title: 'ขั้นที่ 2: เนินแห่งความหวัง', desc: 'ทบทวนเหตุการณ์ที่เพิ่งเขียนไป มีความพยายามหรือการลองทำอะไรเล็กๆ ในสถานการณ์นั้นหรือไม่ แม้จะเล็กน้อยก็เขียนได้', placeholder: 'เขียนความพยายามหรือสิ่งที่ลองทำ...(300 คำ)' },
      { title: 'ขั้นที่ 3: ป่าแห่งความกล้าหาญ', desc: 'จากความพยายามหรือทรัพยากรที่ค้นพบ กำหนดการกระทำเล็กๆ ที่อยากลอง พร้อมทั้งอุปสรรคที่คาดว่าจะเจอและวิธีรับมือ', placeholder: 'เขียนการกระทำและอุปสรรคที่คาดไว้...(300 คำ)' },
      { title: 'ขั้นที่ 4: ลำธารแห่งปัญญา', desc: 'ทบทวนประสบการณ์การกระทำของคุณ มีอะไรที่ได้เรียนรู้หรือค้นพบใหม่ๆ หรือไม่', placeholder: 'เขียนสิ่งที่ได้เรียนรู้หรือค้นพบ...(300 คำ)' },
      { title: 'ขั้นที่ 5: ยอดเขาแห่งการเริ่มต้นใหม่', desc: 'สรุปประสบการณ์ทั้งหมด เขียนคำอวยพรหรือความคาดหวังถึงตัวเองในอนาคต หากเจออุปสรรคอีกจะให้กำลังใจตัวเองอย่างไร', placeholder: 'เขียนคำอวยพรหรือความคาดหวัง...(300 คำ)' }
    ],
    submit: 'ส่งและขอคำแนะนำ',
    loading: 'กรุณารอสักครู่...',
    next: 'ไปยังขั้นถัดไป',
    finish: 'คุณสำเร็จภารกิจเริ่มต้นใหม่แล้ว!',
    finishSub: 'ขอให้ดูแลตัวเองต่อไป!',
    error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งภายหลัง',
    retry: 'ลองอีกครั้ง',
  },
  'vi': {
    back: 'Về trang chủ',
    logout: 'Đăng xuất',
    title: 'Thử thách nhiệm vụ hàng ngày',
    subtitle: 'Từng bước vượt qua sương mù, khám phá bản thân mới',
    steps: [
      { title: 'Bước 1: Thung lũng sương mù', desc: 'Viết về một sự kiện gần đây khiến bạn cảm xúc mạnh. Không cần phán xét bản thân, chỉ cần mô tả diễn biến, cảm xúc và ảnh hưởng của nó.', placeholder: 'Viết câu chuyện của bạn tại đây...(300 từ)' },
      { title: 'Bước 2: Đồi hy vọng', desc: 'Xem lại sự kiện vừa viết, bạn có nỗ lực hoặc thử điều gì nhỏ không? Dù nhỏ cũng hãy ghi lại.', placeholder: 'Viết nỗ lực hoặc điều bạn đã thử...(300 từ)' },
      { title: 'Bước 3: Rừng dũng cảm', desc: 'Dựa trên nỗ lực hoặc nguồn lực vừa phát hiện, hãy đặt ra một hành động nhỏ muốn thử, dự đoán khó khăn và cách đối mặt.', placeholder: 'Viết hành động và khó khăn dự đoán...(300 từ)' },
      { title: 'Bước 4: Suối trí tuệ', desc: 'Xem lại trải nghiệm hành động, bạn học được gì? Có phát hiện hay nhận thức mới không?', placeholder: 'Viết điều bạn học được hoặc nhận ra...(300 từ)' },
      { title: 'Bước 5: Đỉnh tái khởi động', desc: 'Tổng hợp mọi trải nghiệm, viết lời chúc hoặc kỳ vọng cho bản thân tương lai. Nếu gặp khó khăn, bạn sẽ động viên mình thế nào?', placeholder: 'Viết lời chúc hoặc kỳ vọng...(300 từ)' }
    ],
    submit: 'Gửi và nhận hướng dẫn',
    loading: 'Vui lòng chờ...',
    next: 'Bước tiếp theo',
    finish: 'Chúc mừng bạn đã hoàn thành hành trình tái khởi động!',
    finishSub: 'Hãy tiếp tục yêu thương bản thân nhé!',
    error: 'Đã xảy ra lỗi, vui lòng thử lại sau.',
    retry: 'Thử lại',
  },
  'la': {
    back: 'Redi ad domum',
    logout: 'Exire',
    title: 'Provocatio Cotidiana',
    subtitle: 'Gradatim e nebula progredere, novum te aspice',
    steps: [
      { title: 'Gradus I: Vallis Nebulosa', desc: 'Scribe de re nuper te vehementer commotum. Te ipsum iudicare noli, sed simpliciter rem, sensus tuos, et effectus describas.', placeholder: 'Hic fabulam tuam scribe...(300 verba)' },
      { title: 'Gradus II: Collis Spei', desc: 'Recense rem modo scriptam. In illa condicione quid parvum conatus es? Etiam minima, scribe.', placeholder: 'Conatum tuum scribe...(300 verba)' },
      { title: 'Gradus III: Silva Virtutis', desc: 'Ex conatu aut opibus inventis, parvam actionem temptare velis, difficultates praevides et quomodo eas superaturus sis scribe.', placeholder: 'Actionem et difficultates scribe...(300 verba)' },
      { title: 'Gradus IV: Rivus Sapientiae', desc: 'Recense experientiam actionis. Quid didicisti? Quid novi invenisti?', placeholder: 'Quae didicisti scribe...(300 verba)' },
      { title: 'Gradus V: Culmen Renovationis', desc: 'Omnia experientia colligens, votum aut spem tibi futuro scribe. Si iterum difficultates occurrant, quomodo te hortaberis?', placeholder: 'Votum aut spem scribe...(300 verba)' }
    ],
    submit: 'Mitte et consilium pete',
    loading: 'Exspecta quaeso...',
    next: 'Ad gradum proximum',
    finish: 'Iter renovationis confecisti!',
    finishSub: 'Te ipsum semper cura!',
    error: 'Error factus est, quaeso postea repete.',
    retry: 'Iterum conare',
  },
  'ms': {
    back: 'Kembali ke Laman Utama',
    logout: 'Log keluar',
    title: 'Cabaran Misi Harian',
    subtitle: 'Melangkah keluar dari kabus, temui diri baharu',
    steps: [
      { title: 'Langkah 1: Lembah Berkabus', desc: 'Tulis tentang peristiwa baru-baru ini yang membuatkan anda beremosi kuat. Tidak perlu menilai diri, hanya gambarkan peristiwa, perasaan dan kesannya.', placeholder: 'Tulis kisah anda di sini...(300 patah perkataan)' },
      { title: 'Langkah 2: Bukit Harapan', desc: 'Imbas kembali peristiwa tadi, adakah anda berusaha atau mencuba sesuatu walaupun kecil? Catatkan walaupun kecil.', placeholder: 'Tulis usaha atau percubaan anda...(300 patah perkataan)' },
      { title: 'Langkah 3: Hutan Keberanian', desc: 'Berdasarkan usaha atau sumber yang ditemui, tetapkan tindakan kecil yang ingin dicuba, jangka cabaran dan cara menghadapinya.', placeholder: 'Tulis tindakan dan cabaran dijangka...(300 patah perkataan)' },
      { title: 'Langkah 4: Sungai Kebijaksanaan', desc: 'Imbas kembali pengalaman tindakan anda, apa yang anda pelajari? Ada penemuan atau kesedaran baharu?', placeholder: 'Tulis apa yang anda pelajari...(300 patah perkataan)' },
      { title: 'Langkah 5: Puncak Permulaan Semula', desc: 'Gabungkan semua pengalaman, tulis harapan atau ucapan untuk diri masa depan. Jika hadapi cabaran lagi, bagaimana anda akan beri semangat pada diri?', placeholder: 'Tulis harapan atau ucapan...(300 patah perkataan)' }
    ],
    submit: 'Hantar & mohon panduan',
    loading: 'Sila tunggu...',
    next: 'Langkah seterusnya',
    finish: 'Tahniah, anda telah tamat perjalanan permulaan semula!',
    finishSub: 'Teruskan sayangi diri anda!',
    error: 'Ralat berlaku, sila cuba lagi kemudian.',
    retry: 'Cuba lagi',
  },
};

const missions = [
  {
    title: '第一站：迷霧山谷',
    desc: '寫下最近一件讓你感到強烈情緒的事。不必評判自己，單純描述事情的經過、你的感受，以及這個感受帶來的影響。',
    boxBg: '#fff',
    placeholder: '在這裡寫下你的故事...'
  },
  {
    title: '第二站：希望之丘',
    desc: '回顧你剛剛寫下的事件，請思考：在那個情境下，你有沒有做過什麼小小的努力或嘗試？即使很微小，也請寫下來。',
    boxBg: '#e6f9e6',
    placeholder: '寫下你做過的努力或嘗試...'
  },
  {
    title: '第三站：勇氣森林',
    desc: '根據你剛剛發現的努力或資源，請設定一個你願意嘗試的小行動，並寫下你預期會遇到的困難，以及你打算怎麼面對。',
    boxBg: '#d0ead7',
    placeholder: '寫下你的小行動與預期困難...'
  },
  {
    title: '第四站：智慧溪流',
    desc: '回顧你剛剛的行動經驗，請反思：這個過程中，你學到了什麼？有沒有什麼新的發現或領悟？',
    boxBg: '#e6f2fa',
    placeholder: '寫下你的學習與領悟...'
  },
  {
    title: '第五站：重啟之巔',
    desc: '綜合前面所有關卡的經歷，請寫下你給未來自己的祝福或期許，並思考：如果未來再遇到困難，你會怎麼鼓勵自己？',
    boxBg: '#fffbe6',
    placeholder: '寫下給自己的祝福或期許...'
  }
];

const LANGS = [
  { code: 'zh-TW', label: '繁中' },
  { code: 'zh-CN', label: '简中' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ภาษาไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'la', label: 'Latīna' },
  { code: 'ms', label: 'Bahasa Melayu' },
];

export default function RestartMissions() {
  const navigate = useNavigate();
  const auth = getAuth();
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [showLegalMenu, setShowLegalMenu] = useState(false);
  const [showLangBox, setShowLangBox] = useState(false);
  const legalMenuRef = useRef<HTMLDivElement>(null);
  const langBoxRef = useRef<HTMLDivElement>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  
  // 取得語言內容，缺少欄位自動補繁中
  const base = TEXT['zh-TW'];
  const raw = TEXT[lang] || base;
  const t = {
    ...base,
    ...raw,
    steps: raw.steps || base.steps,
    submit: raw.submit || base.submit,
    loading: raw.loading || base.loading,
    next: raw.next || base.next,
    finish: raw.finish || base.finish,
    finishSub: raw.finishSub || base.finishSub,
    error: raw.error || base.error,
    retry: raw.retry || base.retry,
  };
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [aiReply, setAiReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const mission = t.steps?.[step];

  // 監聽用戶認證狀態
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 檢查是否為手機版
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLegalMenu, showLangBox]);

  useEffect(() => {
    if (aiReply && step === (t.steps?.length || 0) - 1) {
      setShowFireworks(true);
      const timer = setTimeout(() => setShowFireworks(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [aiReply, step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiReply('');
    
    try {
      console.log('Sending request to /api/mission-ai with:', { step, input, history: answers });
      
      const res = await fetch('/api/mission-ai', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ step, input, history: answers })
      });
      
      console.log('Response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Response data:', data);
      
      setAiReply(data.reply || 'AI教練祝福你！');
      setAnswers(prev => [...prev, input]);
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setAiReply('發生錯誤，請稍後再試。錯誤詳情：' + (error instanceof Error ? error.message : '未知錯誤'));
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setInput('');
    setAiReply('');
    setStep(step + 1);
  };

  // 煙火動畫元件
  const Fireworks = () => (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <iframe src="https://embed.lottiefiles.com/animation/85716" style={{ width: 400, height: 400, border: 'none', background: 'transparent' }} title="fireworks1" />
      <iframe src="https://embed.lottiefiles.com/animation/85716" style={{ width: 400, height: 400, border: 'none', background: 'transparent', position: 'absolute', left: '20vw', top: '10vh' }} title="fireworks2" />
      <iframe src="https://embed.lottiefiles.com/animation/85716" style={{ width: 400, height: 400, border: 'none', background: 'transparent', position: 'absolute', right: '20vw', top: '20vh' }} title="fireworks3" />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflowX: 'hidden',
      background: `url('/mountain.png') center center / cover no-repeat fixed, linear-gradient(to bottom, #eaf6ff 0%, #f7fafc 100%)`,
    }}>
      {/* 首頁完整頁頭 */}
      {isMobile ? (
        // 手機版頂部導航
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px #0001' }}>
          {/* 左側：LOGO */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/ctx-logo.png" alt="logo" style={{ width: 72, height: 72, cursor: 'pointer' }} onClick={() => navigate('/')} />
      </div>
      
          {/* 右側：用戶資訊和按鈕 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {user ? (
              <>
                {user.photoURL ? (
  <img src={user.photoURL} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6B5BFF' }} />
) : (
  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#6B5BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold', border: '2px solid #6B5BFF' }}>
    {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
  </div>
)}
                <span style={{ color: '#6B5BFF', fontWeight: 600, fontSize: 12, maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.displayName || user.email || '用戶'}</span>
                <button 
                  className="topbar-btn" 
                  onClick={async () => { await signOut(auth); }} 
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
              </>
            ) : (
              <button className="topbar-btn" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '4px 8px' }}>{lang==='zh-TW'?'註冊':'zh-CN'===lang?'注册':'en'===lang?'Register':'ja'===lang?'登録':'ko'===lang?'가입':'th'===lang?'สมัคร':'vi'===lang?'Đăng ký':'ms'===lang?'Daftar':'Registrare'}</button>
            )}
            <LanguageSelector style={{ width: '80px', fontSize: 14, padding: '6px 10px', height: '28px' }} />
            
            {/* 手機版漢堡選單 - 法律文件 */}
            <div style={{ position: 'relative', display: 'inline-block' }} ref={legalMenuRef}>
              <button
                className="topbar-btn"
                style={{
                  background: '#6B5BFF',
                  color: '#fff',
                  border: '2px solid #6B5BFF',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 12,
                  padding: '8px 10px',
                  minWidth: 44,
                  height: '36px',
                  cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setShowLegalMenu(v => !v)}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#5a4fd9';
                  e.currentTarget.style.borderColor = '#5a4fd9';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#6B5BFF';
                  e.currentTarget.style.borderColor = '#6B5BFF';
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
                    // Footer原有的法律文件 (優先使用footer的路徑和文字)
                    { key: 'privacy', title: FOOTER_TEXT, titleKey: 'privacy', path: '/privacy-policy' },
                    { key: 'terms', title: FOOTER_TEXT, titleKey: 'terms', path: '/terms' },
                    { key: 'data', title: FOOTER_TEXT, titleKey: 'deletion', path: '/data-deletion' },
                    // 漢堡選單原有的其他法律文件 - 改為React路由
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
                        // 所有法律文件都使用React路由
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
                      {item.titleKey ? (item.title[lang]?.[item.titleKey] || item.title['zh-TW'][item.titleKey]) : (item.title[lang] || item.title['zh-TW'])}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
      ) : (
        // 桌面版頂部導航
        <div style={{ position: 'fixed', top: 8, right: 36, zIndex: 9999, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, pointerEvents: 'auto', width: '100%', justifyContent: 'flex-end' }}>
          {/* 左上角LOGO */}
          <div style={{ position: 'fixed', top: 16, left: 42, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 10000, paddingTop: 0, marginTop: 0 }}>
            <img src="/ctx-logo.png" style={{ marginBottom: 0, width: 182, height: 182, cursor: 'pointer', marginTop: '-40px' }} onClick={() => navigate('/')} />
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
                  <div key={l} style={{ padding: '10px 18px', cursor: 'pointer', color: l === lang ? '#6B5BFF' : '#232946', fontWeight: l === lang ? 700 : 500, background: l === lang ? '#f3f0ff' : '#fff' }} onClick={() => { setLang(l as any); setShowLangBox(false); }}>
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
                  // Footer原有的法律文件 (優先使用footer的路徑和文字)
                  { key: 'privacy', title: FOOTER_TEXT, titleKey: 'privacy', path: '/privacy-policy' },
                  { key: 'terms', title: FOOTER_TEXT, titleKey: 'terms', path: '/terms' },
                  { key: 'data', title: FOOTER_TEXT, titleKey: 'deletion', path: '/data-deletion' },
                  // 漢堡選單原有的其他法律文件 - 改為React路由
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
                      // 所有法律文件都使用React路由
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
                    {item.titleKey ? (item.title[lang]?.[item.titleKey] || item.title['zh-TW'][item.titleKey]) : (item.title[lang] || item.title['zh-TW'])}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 測試模式按鈕 */}
      <TestModeButton onTestModeChange={setIsTestMode} />

      {/* 挑戰任務標題卡片 - 縮短寬度並往下移動 */}
          <div
              style={{
                  width: '100%',
              maxWidth: 500,
              margin: '120px auto 20px auto',
                  padding: '16px 24px',
                  background: 'rgba(255,255,255,0.95)',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
              }}
          >
              <h1 style={{ 
                  fontWeight: 900, 
                  fontSize: 24, 
                  color: '#6B5BFF', 
                  margin: 0, 
                  lineHeight: 1,
                  textShadow: '0 2px 8px #6B5BFF88',
                  textAlign: 'center',
              }}>
                  <span role="img" aria-label="mission">🎯</span> 挑戰任務
              </h1>
              <p style={{ 
                  fontSize: 14, 
                  color: '#666', 
                  margin: '8px 0 0 0', 
                  textAlign: 'center',
                  lineHeight: 1.4,
                  fontWeight: 400,
                  whiteSpace: 'nowrap'
              }}>
                  不斷挑戰自我，這次完成，下一次更進一步，騎過難關，突破極限。
              </p>
          </div>

      {/* 主內容區域 - 放寬寬度讓視覺合理 */}
      <div style={{ 
        maxWidth: 600, 
        margin: '0 auto', 
        padding: isMobile ? '1rem 0 2rem 0' : '2rem 0 2rem 0', 
        background: 'rgba(255,255,255,0.92)', 
        borderRadius: 24, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
        marginTop: isMobile ? '120px' : '20px' 
      }}>
        <h1 style={{ textAlign: 'center', fontWeight: 700, fontSize: '2rem', marginBottom: 8 }}>{t.title}</h1>
        <div style={{ textAlign: 'center', color: '#666', marginBottom: 32 }}>{t.subtitle}</div>
        <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 2px 8px #0001', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#2a5d8f', marginBottom: 8 }}>{mission?.title || ''}</div>
          <div style={{ color: '#333', marginBottom: 24 }}>{mission?.desc || ''}</div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={mission?.placeholder || ''}
              style={{ width: '100%', minHeight: 100, borderRadius: 8, border: '1px solid #ccc', padding: 12, marginBottom: 16 }}
              required
            />
            <button
              type="submit"
              disabled={loading || !input}
              style={{ width: '100%', background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', borderRadius: 8, padding: '12px 0', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.99 : 1, filter: 'none', textShadow: 'none', transition: 'background 0.18s' }}
            >
              {loading ? t.loading : t.submit}
            </button>
          </form>
          {aiReply && (
            <div style={{ marginTop: 24, background: '#f5f5f5', borderRadius: 8, padding: 16, color: '#2a5d8f' }}>{aiReply}</div>
          )}
          {aiReply && step < (t.steps?.length || 0) - 1 && (
            <button
              onClick={handleNext}
              style={{ marginTop: 16, width: '100%', background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', borderRadius: 8, padding: '10px 0', cursor: 'pointer', transition: 'background 0.18s' }}
            >
              {t.next}
            </button>
          )}
          {aiReply && step === (t.steps?.length || 0) - 1 && (
            <div style={{ marginTop: 24, textAlign: 'center', color: '#e6b800', fontWeight: 700, fontSize: 20 }}>
              {t.finish}<br />
              <span style={{ fontSize: 16, color: '#888' }}>{t.finishSub}</span>
              {showFireworks && <Fireworks />}
              <div style={{ marginTop: 24 }}>
                <button
                  onClick={() => {
                    setStep(0);
                    setInput('');
                    setAnswers([]);
                    setAiReply('');
                  }}
                  style={{
                    background: '#6B5BFF',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 16,
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 32px',
                    cursor: 'pointer',
                    marginTop: 8,
                    boxShadow: '0 2px 8px #0001',
                    transition: 'background 0.18s',
                  }}
                >
                  {t.retry}
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14 }}>
          {(t.steps || []).map((m: any, i: any) => (
            <span key={i} style={{
              display: 'inline-block',
              width: 18,
              height: 18,
              borderRadius: '50%',
              background: i <= step ? '#8ec6f7' : '#e0e0e0',
              margin: '0 4px',
              border: i === step ? '2px solid #2a5d8f' : 'none',
              transition: 'all 0.2s'
            }} />
          ))}
        </div>
      </div>
      
      {/* 煙火動畫 */}
      {aiReply && step === (t.steps?.length || 0) - 1 && showFireworks && <Fireworks />}
    </div>
  );
} 