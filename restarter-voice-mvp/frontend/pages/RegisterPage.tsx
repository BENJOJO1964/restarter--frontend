import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getApiUrl } from '../src/config/api';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect, OAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import app from '../src/firebaseConfig';
import { db } from '../src/firebaseConfig';
import { storage } from '../src/firebaseConfig';
import CompleteProfile, { ProfileRequiredNotice } from './CompleteProfile';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

const auth = getAuth(app);

const TEXT = {
  'zh-TW': {
    heroLeftTop: '救贖不是罪，',
    heroLeftMain: '只是走錯太久。',
    heroLeftSub: '',
    heroLeftYellow: '野花昂首盡綻放！',
    heroRightTop: '我要重新開始...',
    heroRightMain: '每一次的經歷，都是獨一無二的篇章',
    heroRightSub: '而不是成長的絆腳石。',
    heroRightYellow: '從灰燼中重生！',
    title: 'Restarter™ 註冊',
    email: '電子郵件 *必填',
    password: '密碼(至少6位，含英文及數字)*必填',
    nickname: '暱稱*必填',
    age: '年齡*選填',
    selectAge: '請選擇年齡區間*必選',
    country: '國家(地區)*必選',
    city: '城市(可選)',
    interest: '興趣*選填',
    eventType: '經歷事件**選填',
    whatToImprove: '想改善什麼*選填',
    uploadAvatar: '上傳頭像',
    uploadAvatarOptional: '(可選)',
    male: '男',
    female: '女',
    genderRequired: '(必選)',
    register: '🚀 註冊',
    registering: '註冊中...',
    errorAvatar: '請上傳頭像',
    errorGender: '請選擇性別',
    errorEmailFormat: '電子郵件格式無效',
    errorPasswordFormat: '密碼必須至少8個字符，且包含字母和數字',
    errorNicknameFormat: '暱稱必須是6-16個字符',
    errorAgeFormat: '年齡必須在18到99歲之間',
    errorCountry: '請選擇國家/地區',
    errorRegion: '請輸入城市',
    errorInterest: '請選擇興趣',
    errorEventType: '請選擇事件類型',
    errorImprovement: '請選擇想改善的項目',
    formTopSlogan: '你來了，就值得被歡迎！',
    login: '登入',
    terms: '條款/聲明',
    privacy: '隱私權政策',
    deletion: '資料刪除說明',
    googleLogin: '使用 Google 登入',
    appleLogin: '使用 Apple 登入',
  },
  'zh-CN': {
    heroLeftTop: '救赎不是罪，',
    heroLeftMain: '只是走错太久。',
    heroLeftSub: '',
    heroLeftYellow: '野花昂首尽绽放！',
    heroRightTop: '我要重新开始...',
    heroRightMain: '每一次的经历，都是独一无二的篇章',
    heroRightSub: '而不是成长的绊脚石。',
    heroRightYellow: '从灰烬中重生！',
    title: 'Restarter™ 注册',
    email: '电子邮件 *必填',
    password: '密码 (至少8位，含英文及数字) *必填',
    nickname: '昵称 (6-16字) *必填',
    age: '年龄*选填',
    selectAge: '请选择年龄区间*必选',
    country: '国家(地区)*必选',
    city: '城市(可选)',
    interest: '兴趣*选填',
    eventType: '经历事件**选填',
    whatToImprove: '想改善什么*选填',
    uploadAvatar: '上传头像',
    uploadAvatarOptional: '(可选)',
    male: '男',
    female: '女',
    genderRequired: '(必选)',
    register: '🚀 注册',
    registering: '注册中...',
    errorAvatar: '请上传头像',
    errorGender: '请选择性别',
    errorEmailFormat: '电子邮件格式无效',
    errorPasswordFormat: '密码必须至少8个字符，且包含字母和数字',
    errorNicknameFormat: '昵称必须是6-16个字符',
    errorAgeFormat: '年龄必须在18到99岁之间',
    errorCountry: '请选择国家/地区',
    errorRegion: '请输入城市',
    errorInterest: '请选择兴趣',
    errorEventType: '请选择事件类型',
    errorImprovement: '请选择想改善的项目',
    formTopSlogan: '你來了，就值得被歡迎！',
    login: '登录',
    terms: '条款/声明',
    privacy: '隐私政策',
    deletion: '数据删除说明',
    googleLogin: '使用 Google 登录',
    appleLogin: '使用 Apple 登录',
  },
  'en': {
    heroLeftTop: 'Redemption is not a crime,',
    heroLeftMain: 'just went down the wrong path for too long.',
    heroLeftSub: '',
    heroLeftYellow: 'Wildflowers bloom bravely!',
    heroRightTop: 'I want a new start...',
    heroRightMain: 'Every experience is a unique chapter,',
    heroRightSub: 'not a barrier to growth.',
    heroRightYellow: 'Rise from the ashes!',
    title: 'Restarter™ Registration',
    email: 'Email *required',
    password: 'Password (min 8 chars, letter & number) *required',
    nickname: 'Nickname (6-16 chars) *required',
    age: 'Age*optional',
    selectAge: 'Select age range',
    country: 'Country (Region)*optional',
    city: 'City (optional)',
    interest: 'Interest*optional',
    eventType: 'History Event**optional',
    whatToImprove: 'What to improve*optional',
    uploadAvatar: 'Upload Avatar',
    uploadAvatarOptional: '(Optional)',
    male: 'Male',
    female: 'Female',
    genderRequired: '(*required)',
    register: '🚀 Register',
    registering: 'Registering...',
    errorAvatar: 'Please upload an avatar.',
    errorGender: 'Please select a gender.',
    errorEmailFormat: 'Invalid email format.',
    errorPasswordFormat: 'Password must be at least 8 characters long and contain both letters and numbers.',
    errorNicknameFormat: 'Nickname must be 6-16 characters long.',
    errorAgeFormat: 'Age must be between 18 and 99.',
    errorCountry: 'Please select a country.',
    errorRegion: 'Please enter a city.',
    errorInterest: 'Please select an interest.',
    errorEventType: 'Please select an event type.',
    errorImprovement: 'Please select an item to improve.',
    formTopSlogan: "It's not wrong to rise up!",
    login: 'Login',
    terms: 'Terms/Statement',
    privacy: 'Privacy Policy',
    deletion: 'Data Deletion',
    googleLogin: 'Sign in with Google',
    appleLogin: 'Sign in with Apple',
  },
  'ja': {
    heroLeftTop: '贖いは罪ではない、',
    heroLeftMain: 'ただ道に迷った時間が長すぎただけだ。',
    heroLeftSub: '',
    heroLeftYellow: '野の花も堂々と咲く！',
    heroRightTop: '私は新しく始めたい...',
    heroRightMain: '一つ一つの経験が、ユニークな章であり、',
    heroRightSub: '成長の障害ではない。',
    heroRightYellow: '灰の中から蘇れ！',
    title: 'Restarter™ 登録',
    email: 'メールアドレス *必須',
    password: 'パスワード (8文字以上、英数字を含む) *必須',
    nickname: 'ニックネーム (6-16文字) *必須',
    age: '年齢*任意',
    selectAge: '年齢層を選択',
    country: '国/地域*任意',
    city: '都市(任意)',
    interest: '興味*任意',
    eventType: '経験した出来事**任意',
    whatToImprove: '改善したいこと*任意',
    uploadAvatar: 'アバターをアップロード',
    uploadAvatarOptional: '(任意)',
    male: '男性',
    female: '女性',
    genderRequired: '(*必須)',
    register: '🚀 登録',
    registering: '登録中...',
    errorAvatar: 'アバターをアップロードしてください。',
    errorGender: '性別を選択してください。',
    errorEmailFormat: '無効なメール形式です。',
    errorPasswordFormat: 'パスワードは8文字以上で、文字と数字の両方を含める必要があります。',
    errorNicknameFormat: 'ニックネームは6～16文字である必要があります。',
    errorAgeFormat: '年齢は18歳から99歳の間でなければなりません。',
    errorCountry: '国を選択してください。',
    errorRegion: '都市を入力してください。',
    errorInterest: '興味を選択してください。',
    errorEventType: 'イベントタイプを選択してください。',
    errorImprovement: '改善したい項目を選択してください。',
    formTopSlogan: '立ち上がることは間違いじゃない！',
    login: 'ログイン',
    terms: '規約/声明',
    privacy: 'プライバシーポリシー',
    deletion: 'データ削除について',
    googleLogin: 'Googleでログイン',
    appleLogin: 'Appleでログイン',
  },
  'ko': {
    heroLeftTop: '구원은 죄가 아니며,',
    heroLeftMain: '그저 너무 오랫동안 길을 잃었을 뿐이다.',
    heroLeftSub: '',
    heroLeftYellow: '들꽃은 용감하게 핀다!',
    heroRightTop: '새로운 시작을 원해...',
    heroRightMain: '모든 경험은 독특한 장이며,',
    heroRightSub: '성장의 장벽이 아니다.',
    heroRightYellow: '잿더미에서 일어나라!',
    title: 'Restarter™ 회원가입',
    email: '이메일 *필수',
    password: '비밀번호 (최소 8자, 영문/숫자 포함) *필수',
    nickname: '닉네임 (6-16자) *필수',
    age: '나이*선택',
    selectAge: '연령대 선택',
    country: '국가/지역*선택',
    city: '도시(선택 사항)',
    interest: '관심사*선택',
    eventType: '경험한 사건**선택',
    whatToImprove: '개선하고 싶은 점*선택',
    uploadAvatar: '아바타 업로드',
    uploadAvatarOptional: '(선택)',
    male: '남성',
    female: '여성',
    genderRequired: '(*필수)',
    register: '🚀 가입하기',
    registering: '가입 중...',
    errorAvatar: '아바타를 업로드해주세요.',
    errorGender: '성별을 선택해주세요.',
    errorEmailFormat: '유효하지 않은 이메일 형식입니다.',
    errorPasswordFormat: '비밀번호는 최소 8자 이상이며, 문자와 숫자를 모두 포함해야 합니다.',
    errorNicknameFormat: '닉네임은 6-16자여야 합니다.',
    errorAgeFormat: '나이는 18세에서 99세 사이여야 합니다.',
    errorCountry: '국가를 선택해주세요.',
    errorRegion: '도시를 입력해주세요.',
    errorInterest: '관심사를 선택해주세요.',
    errorEventType: '사건 유형을 선택해주세요.',
    errorImprovement: '개선할 항목을 선택해주세요.',
    formTopSlogan: '일어서는 것은 잘못이 아니야!',
    login: '로그인',
    terms: '약관/성명서',
    privacy: '개인정보처리방침',
    deletion: '데이터 삭제 안내',
    googleLogin: 'Google로 로그인',
    appleLogin: 'Apple로 로그인',
  },
  'th': {
    heroLeftTop: 'การไถ่บาปไม่ใช่ความผิด',
    heroLeftMain: 'เพียงแค่หลงทางมานานเกินไป',
    heroLeftSub: '',
    heroLeftYellow: 'ดอกไม้ป่าบานอย่างกล้าหาญ!',
    heroRightTop: 'ฉันต้องการเริ่มต้นใหม่...',
    heroRightMain: 'ทุกประสบการณ์คือบทที่พิเศษ',
    heroRightSub: 'ไม่ใช่อุปสรรคต่อการเติบโต',
    heroRightYellow: 'ลุกขึ้นจากเถ้าถ่าน!',
    title: 'Restarter™ ลงทะเบียน',
    email: 'อีเมล *จำเป็น',
    password: 'รหัสผ่าน (ขั้นต่ำ 8 ตัวอักษร, ประกอบด้วยตัวอักษรและตัวเลข) *จำเป็น',
    nickname: 'ชื่อเล่น (6-16 ตัวอักษร) *จำเป็น',
    age: 'อายุ*ไม่บังคับ',
    selectAge: 'เลือกช่วงอายุ',
    country: 'ประเทศ/ภูมิภาค*ไม่บังคับ',
    city: 'เมือง (ไม่บังคับ)',
    interest: 'ความสนใจ*ไม่บังคับ',
    eventType: 'เหตุการณ์ที่ผ่านมา**ไม่บังคับ',
    whatToImprove: 'สิ่งที่ต้องการปรับปรุง*ไม่บังคับ',
    uploadAvatar: 'อัปโหลดรูปภาพ',
    uploadAvatarOptional: '(ไม่บังคับ)',
    male: 'ชาย',
    female: 'หญิง',
    genderRequired: '(*จำเป็น)',
    register: '🚀 ลงทะเบียน',
    registering: 'กำลังลงทะเบียน...',
    errorAvatar: 'กรุณาอัปโหลดรูปโปรไฟล์',
    errorGender: 'กรุณาเลือกเพศ',
    errorEmailFormat: 'รูปแบบอีเมลไม่ถูกต้อง',
    errorPasswordFormat: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรและมีทั้งตัวอักษรและตัวเลข',
    errorNicknameFormat: 'ชื่อเล่นต้องมีความยาว 6-16 ตัวอักษร',
    errorAgeFormat: 'อายุต้องอยู่ระหว่าง 18 ถึง 99 ปี',
    errorCountry: 'กรุณาเลือกประเทศ',
    errorRegion: 'กรุณากรอกเมือง',
    errorInterest: 'กรุณาเลือกความสนใจ',
    errorEventType: 'กรุณาเลือกประเภทเหตุการณ์',
    errorImprovement: 'กรุณาเลือกรายการที่ต้องการปรับปรุง',
    formTopSlogan: 'การลุกขึ้นสู้ไม่ใช่เรื่องผิด!',
    login: 'เข้าสู่ระบบ',
    terms: 'ข้อกำหนด/คำชี้แจง',
    privacy: 'นโยบายความเป็นส่วนตัว',
    deletion: 'นโยบายการลบข้อมูล',
    googleLogin: 'เข้าสู่ระบบด้วย Google',
    appleLogin: 'เข้าสู่ระบบด้วย Apple',
  },
  'vi': {
    heroLeftTop: 'Sự chuộc lỗi không phải là tội ác,',
    heroLeftMain: 'chỉ là đi sai đường quá lâu.',
    heroLeftSub: '',
    heroLeftYellow: 'Hoa dại nở rộ dũng cảm!',
    heroRightTop: 'Tôi muốn một khởi đầu mới...',
    heroRightMain: 'Mỗi trải nghiệm là một chương độc đáo,',
    heroRightSub: 'Không phải là rào cản cho sự phát triển.',
    heroRightYellow: 'Vươn lên từ đống tro tàn!',
    title: 'Đăng ký Restarter™',
    email: 'Email *bắt buộc',
    password: 'Mật khẩu (tối thiểu 8 ký tự, gồm chữ và số) *bắt buộc',
    nickname: 'Biệt danh (6-16 ký tự) *bắt buộc',
    age: 'Tuổi*không bắt buộc',
    selectAge: 'Chọn độ tuổi',
    country: 'Quốc gia/Khu vực*không bắt buộc',
    city: 'Thành phố (tùy chọn)',
    interest: 'Sở thích*không bắt buộc',
    eventType: 'Sự kiện đã trải qua**không bắt buộc',
    whatToImprove: 'Điều muốn cải thiện*không bắt buộc',
    uploadAvatar: 'Tải lên hình đại diện',
    uploadAvatarOptional: '(tùy chọn)',
    male: 'Nam',
    female: 'Nữ',
    genderRequired: '(*bắt buộc)',
    register: '🚀 Đăng ký',
    registering: 'Đang đăng ký...',
    errorAvatar: 'Vui lòng tải lên ảnh đại diện.',
    errorGender: 'Vui lòng chọn giới tính.',
    errorEmailFormat: 'Định dạng email không hợp lệ.',
    errorPasswordFormat: 'Mật khẩu phải dài ít nhất 8 ký tự và chứa cả chữ cái và số.',
    errorNicknameFormat: 'Biệt danh phải dài từ 6-16 ký tự.',
    errorAgeFormat: 'Tuổi phải từ 18 đến 99.',
    errorCountry: 'Vui lòng chọn một quốc gia.',
    errorRegion: 'Vui lòng nhập thành phố.',
    errorInterest: 'Vui lòng chọn một sở thích.',
    errorEventType: 'Vui lòng chọn một loại sự kiện.',
    errorImprovement: 'Vui lòng chọn một mục để cải thiện.',
    formTopSlogan: 'Vươn lên không phải là sai!',
    login: 'Đăng nhập',
    terms: 'Điều khoản/Tuyên bố',
    privacy: 'Chính sách bảo mật',
    deletion: 'Chính sách xóa dữ liệu',
    googleLogin: 'Đăng nhập bằng Google',
    appleLogin: 'Đăng nhập bằng Apple',
  },
  'ms': {
    heroLeftTop: 'Penebusan bukanlah jenayah,',
    heroLeftMain: 'hanya tersalah jalan terlalu lama.',
    heroLeftSub: '',
    heroLeftYellow: 'Bunga liar mekar dengan berani!',
    heroRightTop: 'Saya mahu permulaan yang baru...',
    heroRightMain: 'Setiap pengalaman adalah satu bab yang unik,',
    heroRightSub: 'bukan penghalang kepada pertumbuhan.',
    heroRightYellow: 'Bangkit dari abu!',
    title: 'Pendaftaran Restarter™',
    email: 'E-mel *diperlukan',
    password: 'Kata laluan (min 8 aksara, huruf & nombor) *diperlukan',
    nickname: 'Nama samaran (6-16 aksara) *diperlukan',
    age: 'Umur*pilihan',
    selectAge: 'Pilih julat umur',
    country: 'Negara/Wilayah*pilihan',
    city: 'Bandar (pilihan)',
    interest: 'Minat*pilihan',
    eventType: 'Peristiwa Bersejarah**pilihan',
    whatToImprove: 'Apa yang ingin diperbaiki*pilihan',
    uploadAvatar: 'Muat naik gambar profil',
    uploadAvatarOptional: '(pilihan)',
    male: 'Lelaki',
    female: 'Perempuan',
    genderRequired: '(*diperlukan)',
    register: '🚀 Daftar',
    registering: 'Mendaftar...',
    errorAvatar: 'Sila muat naik avatar.',
    errorGender: 'Sila pilih jantina.',
    errorEmailFormat: 'Format e-mel tidak sah.',
    errorPasswordFormat: 'Kata laluan mesti sekurang-kurangnya 8 aksara dan mengandungi kedua-dua huruf dan nombor.',
    errorNicknameFormat: 'Nama samaran mestilah 6-16 aksara.',
    errorAgeFormat: 'Umur mestilah antara 18 dan 99.',
    errorCountry: 'Sila pilih negara.',
    errorRegion: 'Sila masukkan bandar.',
    errorInterest: 'Sila pilih minat.',
    errorEventType: 'Sila pilih jenis acara.',
    errorImprovement: 'Sila pilih item untuk diperbaiki.',
    formTopSlogan: 'Bukan salah untuk bangkit!',
    login: 'Log masuk',
    terms: 'Terma/Penyata',
    privacy: 'Dasar Privasi',
    deletion: 'Dasar Pemadaman Data',
    googleLogin: 'Log masuk dengan Google',
    appleLogin: 'Log masuk dengan Apple',
  },
  'la': { 
    heroLeftTop: 'Redemptio non est crimen,',
    heroLeftMain: 'modo errasse diu.',
    heroLeftSub: '',
    heroLeftYellow: 'Flores feri fortiter efflorescunt!',
    heroRightTop: 'Novum initium volo...',
    heroRightMain: 'Omnis experientia unicum capitulum est,',
    heroRightSub: 'non impedimentum incrementi.',
    heroRightYellow: 'Resurge ex cineribus!',
    title: 'Restarter™ Inscriptio',
    email: 'Email *requiritur',
    password: 'Password (min 8 chars, letter & number) *requiritur',
    nickname: 'Nickname (6-16 chars) *requiritur',
    age: 'Aetas*optio',
    selectAge: 'Selecta aetatis spatium',
    country: 'Patria (Regio)*optio',
    city: 'Urbs (optio)',
    interest: 'Studium*optio',
    eventType: 'Eventus Historiae**optio',
    whatToImprove: 'Quid emendare vis*optio',
    uploadAvatar: 'Upload Avatar',
    uploadAvatarOptional: '(Optional)',
    male: 'Male',
    female: 'Female',
    genderRequired: '(*required)',
    register: '🚀 Register',
    registering: 'Registering...',
    errorAvatar: 'Please upload an avatar.',
    errorGender: 'Please select a gender.',
    errorEmailFormat: 'Invalid email format.',
    errorPasswordFormat: 'Password must be at least 8 characters long and contain both letters and numbers.',
    errorNicknameFormat: 'Nickname must be 6-16 characters long.',
    errorAgeFormat: 'Age must be between 18 and 99.',
    errorCountry: 'Please select a country.',
    errorRegion: 'Please enter a city.',
    errorInterest: 'Please select an interest.',
    errorEventType: 'Please select an event type.',
    errorImprovement: 'Please select an item to improve.',
    formTopSlogan: 'Surgere non est peccatum!',
    login: 'Inire',
    terms: 'Termini/Declaratio',
    privacy: 'Consilium Privacy',
    deletion: 'Norma Deletionis Datae',
    googleLogin: 'Intra cum Google',
    appleLogin: 'Intra cum Apple',
  },
};

const BACK_TEXT = {
  'zh-TW': '返回',
  'zh-CN': '返回',
  'en': 'Back',
  'ja': '戻る',
  'ko': '뒤로',
  'th': 'กลับ',
  'vi': 'Quay lại',
  'ms': 'Kembali',
  'la': 'Revertere',
};

const PROFILE_NOTICE = {
  'zh-TW': '請先補齊個人資料',
  'zh-CN': '请先补齐个人资料',
  'en': 'Please complete your profile first',
  'ja': 'まずプロフィールを完成させてください',
  'ko': '먼저 프로필을 완성해 주세요',
  'th': 'กรุณากรอกข้อมูลส่วนตัวให้ครบก่อน',
  'vi': 'Vui lòng hoàn thiện hồ sơ cá nhân trước',
  'ms': 'Sila lengkapkan profil anda terlebih dahulu',
  'la': 'Quaeso prius profile tuum comple',
};

const LANGS = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'th', label: 'ไทย' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'la', label: 'Latina' },
];

const SLOGAN2: Record<string, string> = {
  'zh-TW': '每一位更生人，都是世界的一員！',
  'zh-CN': '每一位更生人，都是世界的一员！',
  'en': 'Every Restarter is still one of us.',
  'ja': 'すべての更生者は世界の一員です！',
  'ko': '모든 Restarter는 우리 중 한 명입니다!',
  'th': 'ทุกคนที่ถูกกำพฤติกรรมก็ยังเป็นหนึ่งของเรา!',
  'vi': 'Mỗi người được định hình đều là một thành viên của chúng tôi!',
  'ms': 'Setiap Restarter masih satu di antara kita!',
  'la': 'Omnis Restarter adhuc unus ex nobis est.',
};

const restarterRoleLeft: Record<string, string> = {
  'zh-TW': 'Restarter™ 是更生者的 副駕 / 合作人。',
  'zh-CN': 'Restarter™ 是更生者的 副驾 / 合作人。',
  'en': 'Restarter™ is a co-pilot/partner for Restarters.',
  'ja': 'Restarter™ は更生者の副操縦士・パートナーです。',
  'ko': 'Restarter™는 재생자의 부승무 또는 파트너입니다.',
  'th': 'Restarter™ เป็นคู่ควบคุมหรือพาร์ทเนอร์สำหรับ Restarters.',
  'vi': 'Restarter™ là phi công phụ hoặc đối tác cho Restarters.',
  'ms': 'Restarter™ adalah kopilot/pasukan untuk Restarters.',
  'la': 'Restarter™ est co-pilotus/socius pro Restarters.',
};

const restarterRoleRight: Record<string, string> = {
  'zh-TW': 'Restarter™ 是更生者的情緒管家 / 生產助手',
  'zh-CN': 'Restarter™ 是更生者的情绪管家 / 生产助手',
  'en': 'Restarter™ is an emotional steward/productivity assistant for Restarters.',
  'ja': 'Restarter™ は更生者の感情マネージャー・生産アシスタントです。',
  'ko': 'Restarter™는 재생자의 감정 관리자 및 생산 보조자입니다.',
  'th': 'Restarter™ เป็นผู้ดูแลอารมณ์และผู้ช่วยในการผลิตสำหรับ Restarters.',
  'vi': 'Restarter™ là người quản lý cảm xúc và người trợ giúp sản xuất cho Restarters.',
  'ms': 'Restarter™ adalah pengurus emosi / pembantu produktiviti untuk Restarters.',
  'la': 'Restarter™ est motus oeconomus/producentis adiutor pro Restarters.',
};

const INTEREST_OPTIONS: Record<string, string[]> = {
  'zh-TW': ['經濟','運動','閱讀','電影','旅遊','交友','唱歌','電商','做生意','電腦','AI','寵物','學技能','一個人安靜','其他'],
  'zh-CN': ['经济','运动','阅读','电影','旅游','交友','唱歌','电商','做生意','电脑','AI','宠物','学技能','一个人安静','其他'],
  'en': ['Economy','Sports','Reading','Movie','Travel','Friendship','Singing','E-commerce','Business','Computer','AI','Pets','Learning Skills','Quiet time alone','Other'],
  'ja': ['経済','スポーツ','読書','映画','旅行','友達','カラオケ','EC','ビジネス','パソコン','AI','ペット','スキル学習','一人で静かに過ごす','その他'],
  'ko': ['경제','스포츠','독서','영화','여행','친구 사귀기','노래 부르기','전자상거래','사업','컴퓨터','AI','애완동물','기술 배우기','혼자 조용히 있기','기타'],
  'th': ['เศรษฐกิจ','กีฬา','การอ่าน','ภาพยนตร์','การเดินทาง','มิตรภาพ','การร้องเพลง','อีคอมเมิร์ซ','ธุรกิจ','คอมพิวเตอร์','AI','สัตว์เลี้ยง','การเรียนรู้ทักษะ','เวลาเงียบๆคนเดียว','อื่นๆ'],
  'vi': ['Kinh tế','Thể thao','Đọc sách','Phim ảnh','Du lịch','Tình bạn','Ca hát','Thương mại điện tử','Kinh doanh','Máy tính','AI','Thú cưng','Học kỹ năng','Ở một mình yên tĩnh','Khác'],
  'ms': ['Ekonomi','Sukan','Membaca','Filem','Melancong','Persahabatan','Menyanyi','E-dagang','Perniagaan','Komputer','AI','Haiwan Peliharaan','Belajar Kemahiran','Masa sunyi bersendirian','Lain-lain'],
  'la': ['Oeconomia','Ludi','Lectio','Pellicula','Iter','Amicitia','Cantus','E-commercium','Negotium','Computatrum','AI','Animalia Domestica','Discere Artes','Tempus quietum solus','Aliud'],
};

// 將常數移到組件外部以避免 HMR 問題
const COUNTRY_OPTIONS: Record<string, string[]> = {
  'zh-TW': ['台灣','中國大陸','日本','韓國','馬來西亞','新加坡','印尼','越南','菲律賓','英國','法國','德國','美國','加拿大','非洲','歐洲','南美洲','中東','其他'],
  'zh-CN': ['台湾','中国大陆','日本','韩国','马来西亚','新加坡','印尼','越南','菲律宾','英国','法国','德国','美国','加拿大','非洲','欧洲','南美洲','中东','其他'],
  'en': ['Taiwan','China','Japan','Korea','Malaysia','Singapore','Indonesia','Vietnam','Philippines','UK','France','Germany','USA','Canada','Africa','Europe','South America','Middle East','Other'],
  'ja': ['台湾','中国','日本','韓国','マレーシア','シンガポール','インドネシア','ベトナム','フィリピン','イギリス','フランス','ドイツ','アメリカ','カナダ','アフリカ','ヨーロッパ','南アメリカ','中東','その他'],
  'ko': ['대만','중국','일본','한국','말레이시아','싱가포르','인도네시아','베트남','필리핀','영국','프랑스','독일','미국','캐나다','아프리카','유럽','남아메리카','중동','기타'],
  'th': ['ไต้หวัน','จีน','ญี่ปุ่น','เกาหลี','มาเลเซีย','สิงคโปร์','อินโดนีเซีย','เวียดนาม','ฟิลิปปินส์','สหราชอาณาจักร','ฝรั่งเศส','เยอรมนี','สหรัฐอเมริกา','แคนาดา','แอฟริกา','ยุโรป','อเมริกาใต้','ตะวันออกกลาง','อื่นๆ'],
  'vi': ['Đài Loan','Trung Quốc','Nhật Bản','Hàn Quốc','Malaysia','Singapore','Indonesia','Việt Nam','Philippines','Anh','Pháp','Đức','Mỹ','Canada','Châu Phi','Châu Âu','Nam Mỹ','Trung Đông','Khác'],
  'ms': ['Taiwan','China','Jepun','Korea','Malaysia','Singapura','Indonesia','Vietnam','Filipina','UK','Perancis','Jerman','AS','Kanada','Afrika','Eropah','Amerika Selatan','Timur Tengah','Lain-lain'],
  'la': ['Taivania','Sina','Iaponia','Corea','Malaisia','Singapura','Indonesia','Vietnamia','Philippinae','UK','Gallia','Germania','USA','Canada','Africa','Europa','America Meridionalis','Oriens Medius','Aliud'],
};

const EVENT_TYPE_OPTIONS: Record<string, string[]> = {
  'zh-TW': ["經濟事件", "毒品濫用", "暴力事件", "家暴加害", "家暴受害", "幫派背景", "詐欺相關", "竊盜前科", "性別/身體創傷", "未成年犯罪", "長期失業 / 社會邊緣", "其他"],
  'zh-CN': ["经济事件", "毒品滥用", "暴力事件", "家暴加害", "家暴受害", "帮派背景", "诈欺相关", "窃盗前科", "性别/身体创伤", "未成年犯罪", "长期失业 / 社会边缘", "其他"],
  'en': ["Economic Incident", "Drug Abuse", "Violent Incident", "Domestic Violence Perpetrator", "Domestic Violence Victim", "Gang Affiliation", "Fraud-related", "Theft Record", "Gender/Physical Trauma", "Juvenile Delinquency", "Long-term Unemployed / Socially Marginalized", "Other"],
  'ja': ["経済事件", "薬物乱用", "暴力事件", "DV加害", "DV被害", "ギャング組織所属", "詐欺関連", "窃盗前科", "ジェンダー・身体的トラウマ", "未成年犯罪", "長期失業・社会的疎外", "その他"],
  'ko': ["경제 사건", "약물 남용", "폭력 사건", "가정 폭력 가해자", "가정 폭력 피해자", "조직 폭력배 배경", "사기 관련", "절도 전과", "성별/신체적 트라우마", "미성년 범죄", "장기 실업/사회적 소외", "기타"],
  'th': ["เหตุการณ์ทางเศรษฐกิจ", "การใช้ยาเสพติด", "เหตุการณ์รุนแรง", "ผู้กระทำความรุนแรงในครอบครัว", "เหยื่อความรุนแรงในครอบครัว", "ประวัติแก๊ง", "เกี่ยวข้องกับการฉ้อโกง", "ประวัติการลักขโมย", "การบาดเจ็บทางเพศ/ร่างกาย", "การกระทำผิดของเยาวชน", "ว่างงานระยะยาว / ถูกกีดกันทางสังคม", "อื่นๆ"],
  'vi': ["Sự cố kinh tế", "Lạm dụng ma túy", "Vụ việc bạo lực", "Thủ phạm bạo lực gia đình", "Nạn nhân bạo lực gia đình", "Lý lịch băng đảng", "Liên quan đến gian lận", "Tiền án trộm cắp", "Tổn thương giới tính/thể chất", "Phạm pháp vị thành niên", "Thất nghiệp dài hạn / Bên lề xã hội", "Khác"],
  'ms': ["Insiden Ekonomi", "Penyalahgunaan Dadah", "Insiden Keganasan", "Pelaku Keganasan Rumah Tangga", "Mangsa Keganasan Rumah Tangga", "Latar Belakang Geng", "Berkaitan Penipuan", "Rekod Curi", "Trauma Jantina/Fizikal", "Kenakalan Remaja", "Pengangguran Jangka Panjang / Terpinggir Sosial", "Lain-lain"],
  'la': ["Casus Oeconomicus", "Abusus Medicamentorum", "Casus violentus", "Perpetrator Violentiae Domesticae", "Victima Violentiae Domesticae", "Consociatio Gregis", "Ad Fraudem Pertinens", "Furtum Record", "Trauma Genus/Corporale", "Delinquentia Iuvenilis", "Longum Tempus Inops / Socialiter Marginatus", "Aliud"],
};

const IMPROVEMENT_OPTIONS: Record<string, string[]> = {
  'zh-TW': ['人際','鬥志','習慣','工作','情緒','自律','其他'],
  'zh-CN': ['人际','斗志','习惯','工作','情绪','自律','其他'],
  'en': ['Interpersonal','Motivation','Habits','Work','Emotions','Self-discipline','Other'],
  'ja': ['人間関係','闘志','習慣','仕事','感情','自己規律','その他'],
  'ko': ['대인관계','투지','습관','업무','감정','자기관리','기타'],
  'th': ['ความสัมพันธ์ระหว่างบุคคล','แรงจูงใจ','นิสัย','การงาน','อารมณ์','การมีวินัยในตนเอง','อื่นๆ'],
  'vi': ['Quan hệ giữa các cá nhân','Ý chí chiến đấu','Thói quen','Công việc','Cảm xúc','Kỷ luật tự giác','Khác'],
  'ms': ['Antara peribadi','Semangat juang','Tabiat','Kerja','Emosi','Disiplin diri','Lain-lain'],
  'la': ['Interpersonalis','Animus','Consuetudines','Opus','Affectus','Disciplina sui','Aliud'],
};

const ageRanges = ["18-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-64", "65-69", "70+"];

function validateEmail(email: string) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email); }
function validatePassword(pw: string) { return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pw); }
function validateNickname(nick: string) {
  // 暱稱必填，不限制長度
  if (!nick || nick.trim() === '') return false;
  return true;
}
function validateAge(age: string) { return ageRanges.includes(age); }

function renderRestarterRole(role: string) {
  if (!role) return null;
  const match = role.match(/^(Restarter™)(.*)$/);
  if (!match) return role;
  return (
    <span>
      <span style={{ color: '#fff', fontWeight: 700 }}>Restarter™</span>
      <span style={{ color: '#ffd700', fontWeight: 700 }}>{match[2]}</span>
    </span>
  );
}

type LangKey = keyof typeof TEXT;

function LoginModal({ t, setShowLogin, navigate, setShowReset }: { t: any, setShowLogin: (show: boolean) => void, navigate: any, setShowReset: (show: boolean) => void }) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      await userCred.user.reload();
      setShowLogin(false);
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('帳號或密碼錯誤，請重新確認');
      } else if (err.code === 'auth/user-disabled') {
        setError('此帳號已被停用，請聯絡客服');
      } else {
        setError(err.message || '登入失敗，請稍後再試');
      }
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
      <div style={{ background: 'white', padding: 32, borderRadius: 16, width: '90%', maxWidth: 400, position: 'relative', boxShadow: '0 8px 32px #0000004d' }}>
        <button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: '#888' }}>&times;</button>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: 24 }}>{t.login}</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input type="email" autoComplete="off" placeholder={t.email} value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="reg-input" required />
            <input type="password" autoComplete="off" placeholder={t.password} value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className="reg-input" required />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: 24, background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: 'white', border: 'none', borderRadius: 8, padding: '14px 0', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>
            {t.login}
          </button>
          <div style={{ textAlign:'right', marginTop:8 }}>
            <span href="#" style={{ color:'#6B5BFF', fontSize:14, textDecoration:'underline', cursor:'pointer' }} onClick={e=>{e.preventDefault(); setShowReset(true);}}>忘記密碼？</span>
          </div>
        </form>
      </div>
    </div>
  );
}

const unifiedButtonStyle = {
  border: 'none',
  borderRadius: 28,
  padding: 0,
  fontSize: 16,
  fontWeight: 800,
  cursor: 'pointer',
  boxShadow: '0 2px 12px #a777e355',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  width: '100%',
  height: '40px',
};
const unifiedIconStyle = { width: 18, height: 18, marginRight: 6, verticalAlign: 'middle' };

// 新增：圖片壓縮函數
function compressImage(file: File, maxSize = 256, quality = 0.7): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = e => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > h) {
          if (w > maxSize) { h *= maxSize / w; w = maxSize; }
        } else {
          if (h > maxSize) { w *= maxSize / h; h = maxSize; }
        }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        canvas.toBlob(blob => {
          if (!blob) return reject(new Error('壓縮失敗'));
          resolve(new File([blob], file.name, { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { lang, setLang } = useLanguage();
  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  // 新增：已登入自動導向首頁
  useEffect(() => {
    import('firebase/auth').then(({ getAuth }) => {
      const auth = getAuth();
      if (auth.currentUser) {
        navigate('/');
      }
    });
  }, [navigate]);

  // 處理 redirect 登入結果
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const { getRedirectResult } = await import('firebase/auth');
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Redirect 登入成功，user.uid:', result.user.uid);
          
          // 強制 reload user，避免快取
          await result.user.reload();
          console.log('user reload 完成');
          
          // 檢查 Firestore 是否有完整個人資料
          const userDoc = await getDoc(doc(db, 'users', result.user.uid));
          console.log('Firestore 查詢結果:', {
            exists: userDoc.exists(),
            data: userDoc.data(),
            completed: userDoc.data()?.completed
          });
          
          if (!userDoc.exists() || !userDoc.data() || !userDoc.data().completed) {
            console.log('導向 /CompleteProfile');
            navigate('/CompleteProfile');
          } else {
            console.log('導向首頁 /');
            navigate('/');
          }
        }
      } catch (error) {
        console.error('處理 redirect 結果時發生錯誤:', error);
      }
    };
    
    handleRedirectResult();
  }, [navigate]);

  const showNotice = params.get('needProfile') === '1';
  const t = TEXT[lang];
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState('');

  const [improvement, setImprovement] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loadingDot, setLoadingDot] = useState(0);
  const [nicknameCheck, setNicknameCheck] = useState<'idle'|'checking'|'ok'|'exists'|'invalid'>('idle');
  const [nicknameCheckMsg, setNicknameCheckMsg] = useState('');
  const nicknameInputRef = useRef<HTMLInputElement>(null);
  const ageInputRef = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingDot(d => (d + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, [loading]);

  const [slowNetwork, setSlowNetwork] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [resendingCode, setResendingCode] = useState(false);


  const handleEmailVerification = async () => {
    console.log('按鈕被點擊！驗證碼:', verificationCode);
    
    if (!verificationCode) {
      setError('請輸入驗證碼');
      return;
    }
    
    console.log('前端發送驗證碼:', verificationCode);
    console.log('前端發送 email:', email);
    
    // 設置驗證中狀態，防止重複提交
    setLoading(true);
    setError('');
    
    try {
      const registrationData = {
        nickname,
        password,
        gender,
        country,
        region,
        age,
        interest,
        improvement
      };

      const response = await fetch(getApiUrl('/email-verification/verify-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          code: verificationCode 
        })
      });
      
      console.log('驗證 API 回應狀態:', response.status);
      const data = await response.json();
      console.log('驗證 API 回應資料:', data);
      
      if (data.success) {
        // 驗證碼正確，直接完成註冊
        await completeRegistration();
      } else {
        setLoading(false);
        setError(data.error || '驗證失敗');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || '驗證失敗，請稍後再試');
    }
  };

  const handleResendCode = async () => {
    setResendingCode(true);
    setError('');
    
    try {
      const registrationData = {
        nickname,
        password,
        gender,
        country,
        region,
        age,
        interest,
        improvement
      };

      console.log('重發驗證碼到:', email);
      const response = await fetch(getApiUrl('/email-verification/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, registrationData })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerificationCode(''); // 清空舊驗證碼
        setError('已重新發送驗證碼，請輸入新的驗證碼');
        setShowEmailVerification(true); // 確保顯示驗證碼輸入界面
        setShowConfirmation(false); // 確保隱藏舊的確認界面
      } else {
        setError(data.error || '重發驗證碼失敗');
      }
    } catch (err: any) {
      console.error('重發驗證碼錯誤:', err);
      setError('重發驗證碼失敗，請稍後再試');
    } finally {
      setResendingCode(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSlowNetwork(false);
    let slowTimer: any = setTimeout(() => setSlowNetwork(true), 1500);
    
    try {
      // 頭像不再是必填項，移除驗證
      if (!gender) { setError(t.errorGender); return; }
      if (!validateEmail(email)) { setError(t.errorEmailFormat); return; }
      if (!validatePassword(password)) { setError(t.errorPasswordFormat); return; }
      if (!validateNickname(nickname)) { setError(t.errorNicknameFormat); return; }
      if (!age) { setError(t.errorAgeFormat); return; }
      if (!country) { setError(t.errorCountry); return; }
      
      // 發送確認郵件
      setSendingEmail(true);
      
      const registrationData = {
        nickname,
        password,
        gender,
        country,
        region,
        age,
        interest,
        improvement
      };

      // 發送 email 驗證碼
      console.log('正在發送 email 驗證碼到:', email);
      const emailResponse = await fetch(getApiUrl('/email-verification/send-code'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, registrationData })
      });
      
      console.log('Email API 回應狀態:', emailResponse.status);
      const emailData = await emailResponse.json();
      console.log('Email API 回應資料:', emailData);
      
      if (emailData.success) {
        setEmailSent(true);
        setShowEmailVerification(true);
        setShowConfirmation(false); // 確保隱藏舊的確認界面
        setVerificationCode(''); // 清空驗證碼輸入框
        setSendingEmail(false);
        clearTimeout(slowTimer);
        setSlowNetwork(false);
        setError(''); // 清空錯誤訊息
      } else {
        throw new Error(emailData.error || '生成驗證碼失敗');
      }
    } catch (err: any) {
      console.error('註冊錯誤:', err);
      setError(err.message || '註冊失敗，請稍後再試');
      setSendingEmail(false);
      clearTimeout(slowTimer);
      setSlowNetwork(false);
    }
  };

  const completeRegistration = async () => {
    setLoading(true);
    let slowTimer: any = setTimeout(() => setSlowNetwork(true), 1500);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // 先設 displayName
      await updateProfile(userCredential.user, { displayName: nickname });
      // 上傳頭像到 Storage
      let avatarDownloadUrl = '';
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${userCredential.user.uid}/${avatarFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, avatarFile);
        let uploadError: any = null;
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed', null, (err) => {
              uploadError = err;
              reject(err);
            }, async () => {
              avatarDownloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve();
            });
          }),
          new Promise<void>((_, reject) => setTimeout(() => {
            uploadError = new Error('頭像上傳逾時，請檢查網路或稍後再試');
            reject(uploadError);
          }, 10000))
        ]).catch((err) => { throw uploadError || err; });
        // 新增：同步更新 Firebase Auth 的 photoURL
        await updateProfile(userCredential.user, { photoURL: avatarDownloadUrl });
      }
      // 寫入 Firestore profiles collection
      await setDoc(doc(db, 'profiles', userCredential.user.uid), {
        nickname,
        email,
        avatar: avatarDownloadUrl || '', // 如果沒有頭像，使用空字符串
        gender,
        country,
        region,
        age,
        interest,
        improvement,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      localStorage.removeItem('aiAvatar');
      localStorage.removeItem('avatarWelcomed');
      setLoading(false);
      clearTimeout(slowTimer);
      setSlowNetwork(false);
      navigate('/');
    } catch (err: any) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError') || err?.message?.includes('ECONNREFUSED')) {
        setError('伺服器連線失敗，請稍後再試或聯絡管理員');
      } else {
        setError(err?.message || '註冊失敗，請稍後再試');
      }
      setLoading(false);
      clearTimeout(slowTimer);
      setSlowNetwork(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      try {
        const compressed = await compressImage(file);
        setAvatarFile(compressed);
        setAvatarUrl(URL.createObjectURL(compressed));
      } catch {
        setAvatarFile(file);
        setAvatarUrl(URL.createObjectURL(file));
      }
    } else {
      setAvatarFile(null);
      setAvatarUrl('');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('開始 Google 登入...');
      setLoading(true);
      setSlowNetwork(false);
      let slowTimer: any = setTimeout(() => setSlowNetwork(true), 1500);
      
      // 手機版特殊處理
      const isMobile = window.innerWidth <= 768;
      console.log('是否為手機版:', isMobile);
      
      let result;
      if (isMobile) {
        // 手機版使用原本的簡單邏輯
        result = await signInWithPopup(auth, provider);
      } else {
        // 電腦版使用原本的簡單邏輯
        result = await signInWithPopup(auth, provider);
        clearTimeout(slowTimer);
        setSlowNetwork(false);
        setLoading(false);
        navigate('/');
        return;
      }
      
      clearTimeout(slowTimer);
      setSlowNetwork(false);
      setLoading(false);
      
      console.log('Google 登入成功，user.uid:', result.user.uid);
      
      // 手機版和電腦版都使用簡單邏輯，直接導向首頁
      navigate('/');
    } catch (error) {
      setLoading(false);
      setSlowNetwork(false);
      console.error('Google 登入錯誤:', error);
      
      // 手機版特殊錯誤處理
      const isMobile = window.innerWidth <= 768;
      let errorMessage = 'Google 登入失敗：' + (error as any).message;
      
      // 根據錯誤類型提供更詳細的訊息
      if ((error as any).code === 'auth/popup-closed-by-user') {
        errorMessage = '登入視窗被關閉，請重新嘗試';
      } else if ((error as any).code === 'auth/popup-blocked') {
        errorMessage = '登入視窗被瀏覽器阻擋，請允許彈出視窗後重新嘗試';
      } else if ((error as any).code === 'auth/network-request-failed') {
        errorMessage = '網路連線失敗，請檢查網路後重新嘗試';
      } else if ((error as any).code === 'auth/too-many-requests') {
        errorMessage = '登入嘗試過於頻繁，請稍後再試';
      }
      
      console.log('Google 登入錯誤代碼:', (error as any).code);
      console.log('Google 登入錯誤訊息:', errorMessage);
      
      alert(errorMessage);
    }
  };

  const handleAppleLogin = async () => {
    const provider = new OAuthProvider('apple.com');
    try {
      console.log('開始 Apple 登入...');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Apple 登入成功，user.uid:', user.uid);
      // 強制 reload user，避免快取
      await user.reload();
      console.log('user reload 完成');
      // 檢查 Firestore 是否有完整個人資料（必須有文件且 completed 為 true 才能進首頁）
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('Firestore 查詢結果:', {
        exists: userDoc.exists(),
        data: userDoc.data(),
        completed: userDoc.data()?.completed
      });
      if (!userDoc.exists() || !userDoc.data() || !userDoc.data().completed) {
        console.log('導向 /CompleteProfile');
        navigate('/CompleteProfile');
      } else {
        console.log('導向首頁 /');
        navigate('/');
      }
    } catch (error) {
      console.error('Apple 登入錯誤:', error);
      
      let errorMessage = 'Apple 登入失敗：' + (error as any).message;
      
      // 根據錯誤類型提供更詳細的訊息
      if ((error as any).code === 'auth/popup-closed-by-user') {
        errorMessage = '登入視窗被關閉，請重新嘗試';
      } else if ((error as any).code === 'auth/popup-blocked') {
        errorMessage = '登入視窗被瀏覽器阻擋，請允許彈出視窗後重新嘗試';
      } else if ((error as any).code === 'auth/network-request-failed') {
        errorMessage = '網路連線失敗，請檢查網路後重新嘗試';
      } else if ((error as any).code === 'auth/too-many-requests') {
        errorMessage = '登入嘗試過於頻繁，請稍後再試';
      }
      
      console.log('Apple 登入錯誤代碼:', (error as any).code);
      console.log('Apple 登入錯誤訊息:', errorMessage);
      
      alert(errorMessage);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Email 登入成功！');
    } catch (error) {
      alert('Email 登入失敗：' + (error as any).message);
    }
  };

  // 移除舊的 handleEmailRegister 函數，現在使用 handleRegister 進行 email 驗證

  async function handleNicknameBlur() {
    const nickname = nicknameInputRef.current?.value?.trim();
    if (!nickname) {
      setNicknameCheck('invalid');
      setNicknameCheckMsg('請輸入暱稱');
      setTimeout(() => { nicknameInputRef.current?.focus(); }, 100);
      return;
    }
    setNicknameCheck('ok');
    setNicknameCheckMsg('你的名稱非常好👍');
    setTimeout(() => { ageInputRef.current?.focus(); }, 200);
  }

  const isRegisterPage = location.pathname === '/register';
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');
  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>
      {showNotice && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 22, color: '#374151', fontWeight: 600, textAlign: 'center' }}>
          {PROFILE_NOTICE[lang] || PROFILE_NOTICE['zh-TW']}
        </div>
      )}
      <div style={{ position: 'relative' }}>

        <div style={{ minHeight: '100vh', background: `url('/city-blur.jpg') center/cover no-repeat`, position: 'relative', display: 'flex', flexDirection: 'column' }}>
          {/* 手機版頂部佈局優化 */}
          {window.innerWidth <= 768 ? (
            <>
              {/* 手機版：返回按鈕在左上角 */}
              <button 
                onClick={() => window.history.back()}
                style={{
                  position: 'fixed',
                  top: 16,
                  left: 16,
                  zIndex: 1000,
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  height: '36px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                ← {lang === 'zh-TW' ? '返回' : 
                    lang === 'zh-CN' ? '返回' : 
                    lang === 'en' ? 'Back' : 
                    lang === 'ja' ? '戻る' : 
                    lang === 'ko' ? '돌아가기' : 
                    lang === 'vi' ? 'Quay Lại' : 
                    lang === 'th' ? 'กลับ' : 
                    lang === 'la' ? 'Regredi' : 
                    lang === 'ms' ? 'Kembali' : 'Back'}
              </button>
              
              {/* 手機版：繁中按鈕在右上角 */}
              <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
                <LanguageSelector style={{ 
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  width: '60px',
                  minWidth: '60px',
                  maxWidth: '60px',
                  height: '36px',
                  cursor: 'pointer'
                }} />
              </div>
              
              {/* 手機版：標語對齊LOGO中的L */}
              <div style={{ position: 'fixed', top: 60, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: 18, 
                  color: '#ffd700', 
                  letterSpacing: 1, 
                  textShadow: '0 2px 8px #23294688', 
                  whiteSpace: 'nowrap', 
                  textAlign: 'left',
                  lineHeight: '1.2',
                  marginLeft: '8px'
                }}>{SLOGAN2[lang]}</span>
              </div>
            </>
          ) : (
            <>
              {/* 桌面版：返回按鈕在左上角 */}
              <button 
                onClick={() => window.history.back()}
                style={{
                  position: 'fixed',
                  top: 24,
                  left: 24,
                  zIndex: 1000,
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {lang === 'zh-TW' ? '返回' : 
                    lang === 'zh-CN' ? '返回' : 
                    lang === 'en' ? 'Back' : 
                    lang === 'ja' ? '戻る' : 
                    lang === 'ko' ? '돌아가기' : 
                    lang === 'vi' ? 'Quay Lại' : 
                    lang === 'th' ? 'กลับ' : 
                    lang === 'la' ? 'Regredi' : 
                    lang === 'ms' ? 'Kembali' : 'Back'}
              </button>
              
              {/* 桌面版：標語對齊LOGO中的L */}
              <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
                <span style={{ 
                  fontWeight: 900, 
                  fontSize: 24, 
                  color: '#ffd700', 
                  letterSpacing: 2, 
                  textShadow: '0 2px 8px #23294688', 
                  whiteSpace: 'nowrap', 
                  textAlign: 'left',
                  marginLeft: '12px'
                }}>{SLOGAN2[lang]}</span>
              </div>
              
              {/* 桌面版：繁中下拉選單在右上角 */}
              <select
                value={(window as any).lang || 'zh-TW'}
                onChange={(e) => {
                  const newLang = e.target.value;
                  (window as any).lang = newLang;
                  localStorage.setItem('lang', newLang);
                  window.location.reload();
                }}
                style={{
                  position: 'fixed',
                  top: 24,
                  right: 120,
                  zIndex: 10001,
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  color: '#667eea',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  width: '80px',
                  minWidth: '80px',
                  maxWidth: '80px',
                  outline: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#667eea';
                  e.currentTarget.style.color = '#fff';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <option value="zh-TW">繁中</option>
                <option value="zh-CN">简中</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
                <option value="vi">Tiếng Việt</option>
                <option value="th">ไทย</option>
                <option value="la">Latin</option>
                <option value="ms">Bahasa Melayu</option>
              </select>
            </>
          )}
          {/* 響應式佈局：桌面版三欄，手機版單欄 */}
          <div style={{ 
            display: 'flex', 
            flex: 1, 
            minHeight: '100vh', 
            alignItems: 'stretch', 
            justifyContent: 'center', 
            width: '100%', 
            marginTop: window.innerWidth <= 768 ? 120 : 60,
            flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
          }}>
            {/* Left Hero Text - 桌面版顯示 */}
            <div style={{ 
              flex: 1, 
              display: window.innerWidth <= 768 ? 'none' : 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              background: 'rgba(60,40,20,0.18)', 
              padding: '0 12px', 
              minHeight: 'calc(100vh - 60px)', 
              boxSizing: 'border-box', 
              justifyContent: 'space-between' 
            }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center', paddingTop: 78 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, textShadow: '0 2px 8px #23294688' }}>
                        {renderRestarterRole(restarterRoleLeft[lang])}
                    </div>
                </div>
                <img src="/left-hero.png" alt="left hero" style={{ width: 300, maxWidth: '98%', objectFit: 'contain' }} />
                <div style={{ paddingBottom: 80, textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: '12px 0 8px' }}>
                      {t.heroLeftTop}<br/>
                      {t.heroLeftMain}<br/>
                      {t.heroLeftSub}
                    </div>
                    <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 18 }}>{t.heroLeftYellow}</div>
                </div>
            </div>
            
            {/* Center Registration Form */}
            {showLogin && <LoginModal t={t} setShowLogin={setShowLogin} navigate={navigate} setShowReset={setShowReset} />}
            <div style={{ 
              flex: window.innerWidth <= 768 ? '1' : '0 1 500px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              padding: window.innerWidth <= 768 ? '10px' : '20px 0',
              width: window.innerWidth <= 768 ? '100%' : 'auto'
            }}>
              <form onSubmit={handleRegister} style={{ 
                background: '#ffffffcc', 
                borderRadius: 20, 
                padding: window.innerWidth <= 768 ? '20px 16px' : '24px 32px', 
                width: '100%', 
                maxWidth: window.innerWidth <= 768 ? '100%' : 500, 
                boxShadow: '0 8px 32px #0000004d', 
                position: 'relative', 
                boxSizing: 'border-box',
                margin: window.innerWidth <= 768 ? '0 10px' : '0'
              }}>
                <img src="/ctx-logo.png" alt="Logo" style={{ 
                  width: window.innerWidth <= 768 ? 60 : 100, 
                  height: window.innerWidth <= 768 ? 60 : 100, 
                  position: 'absolute', 
                  top: 5, 
                  left: 5, 
                  zIndex: 0, 
                  opacity: 1 
                }} />
                <div style={{position: 'relative', zIndex: 1}}>
                  <div style={{ 
                    width: '100%', 
                    textAlign: 'center', 
                    fontWeight: 900, 
                    fontSize: window.innerWidth <= 768 ? 20 : 26, 
                    color: '#ffd700', 
                    marginBottom: 8, 
                    textShadow: '0 2px 4px #00000055' 
                  }}>{t.formTopSlogan}</div>
                  <h2 style={{ 
                    textAlign: 'center', 
                    color: '#333', 
                    marginBottom: 16, 
                    fontSize: window.innerWidth <= 768 ? 24 : 28, 
                    fontWeight: 800 
                  }}>{t.title}</h2>
                  {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                  {showEmailVerification && (
                    <div style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                      color: 'white', 
                      padding: '16px', 
                      borderRadius: '12px', 
                      marginBottom: '1rem',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                      <div style={{ fontSize: '20px', marginBottom: '8px' }}>📧</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>請輸入驗證碼</div>
                      <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                        驗證碼已發送到 {email}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="請輸入 6 位數驗證碼"
                            disabled={loading}
                            style={{
                              width: '150px',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '16px',
                              textAlign: 'center',
                              opacity: loading ? 0.6 : 1,
                              cursor: loading ? 'not-allowed' : 'text'
                            }}
                            maxLength={6}
                          />
                          <button
                            type="button"
                            onClick={handleEmailVerification}
                            disabled={!verificationCode || verificationCode.length !== 6 || loading}
                            style={{
                              background: loading ? '#6b7280' : (verificationCode && verificationCode.length === 6 ? '#10b981' : '#6b7280'),
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              cursor: (verificationCode && verificationCode.length === 6 && !loading) ? 'pointer' : 'not-allowed',
                              transition: 'all 0.2s ease',
                              transform: (verificationCode && verificationCode.length === 6 && !loading) ? 'scale(1)' : 'scale(1)',
                              boxShadow: (verificationCode && verificationCode.length === 6 && !loading) ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                            }}
                            onMouseEnter={(e) => {
                              if (verificationCode && verificationCode.length === 6 && !loading) {
                                e.currentTarget.style.background = '#059669';
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (verificationCode && verificationCode.length === 6 && !loading) {
                                e.currentTarget.style.background = '#10b981';
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                              }
                            }}
                            onMouseDown={(e) => {
                              if (verificationCode && verificationCode.length === 6 && !loading) {
                                e.currentTarget.style.transform = 'scale(0.95)';
                              }
                            }}
                            onMouseUp={(e) => {
                              if (verificationCode && verificationCode.length === 6 && !loading) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }
                            }}
                          >
                            {loading ? '驗證中...' : '驗證並註冊'}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={resendingCode}
                          style={{
                            background: resendingCode ? '#6b7280' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: resendingCode ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                            transform: resendingCode ? 'scale(1)' : 'scale(1)',
                            boxShadow: resendingCode ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.3)'
                          }}
                          onMouseEnter={(e) => {
                            if (!resendingCode) {
                              e.currentTarget.style.background = '#2563eb';
                              e.currentTarget.style.transform = 'scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!resendingCode) {
                              e.currentTarget.style.background = '#3b82f6';
                              e.currentTarget.style.transform = 'scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                            }
                          }}
                          onMouseDown={(e) => {
                            if (!resendingCode) {
                              e.currentTarget.style.transform = 'scale(0.95)';
                            }
                          }}
                          onMouseUp={(e) => {
                            if (!resendingCode) {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }
                          }}
                        >
                          {resendingCode ? '重發中...' : '重發驗證碼'}
                        </button>
                      </div>
                    </div>
                  )}
                  

                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: '12px', 
                    width: '100%', 
                    minWidth: 0 
                  }}>
                    {/* 隱藏的假輸入框來防止 Chrome 密碼提示 */}
                    <input type="text" style={{ display: 'none' }} autoComplete="username" />
                    <input type="password" style={{ display: 'none' }} autoComplete="current-password" />
                    <input type="email" autoComplete="new-password" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} style={{ gridColumn: '1 / -1', width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }} className="reg-input" required/>
                    <input type="password" autoComplete="new-password" placeholder={t.password} value={password} onChange={e => setPassword(e.target.value)} style={{ gridColumn: '1 / -1', width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }} className="reg-input" required/>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder={t.nickname}
                      value={nickname}
                      onChange={e => { setNickname(e.target.value); setNicknameCheck('idle'); setNicknameCheckMsg(''); }}
                      onBlur={handleNicknameBlur}
                      className="reg-input"
                      style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', color: '#888' }}
                      required
                      ref={nicknameInputRef}
                    />
                    {nicknameCheckMsg && (
                      <div style={{ gridColumn: '1 / -1', color: nicknameCheck==='ok' ? '#1a7f1a' : (nicknameCheck==='invalid'||nicknameCheck==='exists' ? 'red' : '#333'), fontSize: 14, marginTop: -8, marginBottom: 4 }}>{nicknameCheckMsg}</div>
                    )}
                    <select value={age} onChange={e => setAge(e.target.value)} className="reg-input" style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', color: age ? '#333' : '#888', background: '#fff' }} required>
                      <option value="" style={{color:'#888'}}>{t.selectAge}</option>
                      {ageRanges.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <select value={country} onChange={e => setCountry(e.target.value)} className="reg-input" style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', color: country ? '#333' : '#888', background: '#fff' }} required>
                      <option value="" style={{color:'#888'}}>{t.country}</option>
                      {(COUNTRY_OPTIONS[lang] || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="text" placeholder={t.city} value={region} onChange={e => setRegion(e.target.value)} className="reg-input" style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }} />
                    <select value={interest} onChange={e => setInterest(e.target.value)} className="reg-input" style={{ width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', color: interest ? '#333' : '#888', background: '#fff' }}>
                      <option value="" style={{color:'#888'}}>{t.interest}</option>
                      {(INTEREST_OPTIONS[lang] || []).map(i => <option key={i} value={i}>{i}</option>)}
                    </select>

                    <select value={improvement} onChange={e => setImprovement(e.target.value)} className="reg-input" style={{ gridColumn: '1 / -1', width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden', color: improvement ? '#333' : '#888', background: '#fff' }}>
                      <option value="" style={{color:'#888'}}>{t.whatToImprove}</option>
                      {(IMPROVEMENT_OPTIONS[lang] || []).map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                    {/* 頭像上傳區塊 */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
                      <label htmlFor="avatar-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: '#eee', border: '2px solid #b6b6f6', marginBottom: 4 }}>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 32 }}>+</span>
                          )}
                        </div>
                        <span style={{ color: '#6B5BFF', fontWeight: 700, fontSize: 15 }}>{t.uploadAvatar} <span style={{ color: '#666', fontWeight: 400, fontSize: 12 }}>{t.uploadAvatarOptional}</span></span>
                        <input id="avatar-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setAvatarFile(e.target.files[0]);
                            const reader = new FileReader();
                            reader.onload = ev => setAvatarUrl(ev.target?.result as string);
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }} />
                      </label>
                    </div>
                    {/* 性別欄位 */}
                    <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center', marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, color: '#6B5BFF', fontSize: 15 }}>{t.genderRequired}</span>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input type="radio" name="gender" value="male" checked={gender === 'male'} onChange={() => setGender('male')} required />
                        <span>{t.male}</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input type="radio" name="gender" value="female" checked={gender === 'female'} onChange={() => setGender('female')} required />
                        <span>{t.female}</span>
                      </label>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
                    gap: 8, 
                    margin: '16px 0 8px 0' 
                  }}>
                    {showConfirmation ? (
                      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                          <p style={{ color: '#6B5BFF', fontWeight: 600, marginBottom: '4px' }}>📧 確認郵件已發送到您的 email</p>
                          <p style={{ color: '#666', fontSize: '14px' }}>請檢查您的收件匣並點擊確認連結完成註冊</p>
                        </div>
                        <div style={{ 
                          background: '#f8f9ff', 
                          padding: '16px', 
                          borderRadius: '8px', 
                          border: '1px solid #e0e7ff',
                          textAlign: 'center'
                        }}>
                          <p style={{ color: '#6B5BFF', fontWeight: 600, marginBottom: '8px' }}>📬 請查看您的 email</p>
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                            我們已發送確認郵件到：<strong>{email}</strong>
                          </p>
                          <p style={{ color: '#666', fontSize: '12px' }}>
                            點擊郵件中的「✅ 確認註冊」按鈕即可完成註冊
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setShowConfirmation(false);
                            setError('');
                          }}
                          style={{
                            ...unifiedButtonStyle,
                            background: '#f5f5f5',
                            color: '#666',
                            border: '1px solid #ddd',
                            width: '120px'
                          }}
                        >
                          🔄 重新發送
                        </button>
                      </div>
                    ) : (
                      <button type="submit" disabled={loading || sendingEmail} style={{ ...unifiedButtonStyle, background: 'linear-gradient(90deg, #6e8efb, #a777e3)', color: 'white', opacity: (loading || sendingEmail) ? 0.6 : 1, cursor: (loading || sendingEmail) ? 'not-allowed' : 'pointer' }}>
                        {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                            {t.registering}{'.'.repeat(loadingDot + 1)}
                          </span>
                        ) : sendingEmail ? (
                          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
                            註冊中...
                          </span>
                        ) : (
                          <span style={{marginRight: 10}}>🚀</span>
                        )}
                        {!loading && !sendingEmail && t.register}
                      </button>
                    )}
                    <button type="button" onClick={() => setShowLogin(true)} disabled={loading} style={{ ...unifiedButtonStyle, background: 'linear-gradient(90deg, #89f7fe, #66a6ff)', color: 'white', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      <span style={{marginRight: 10}}>🔑</span>{t.login}
                    </button>
                    <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{ ...unifiedButtonStyle, background: '#fff', color: '#333', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={unifiedIconStyle} />
                      {t.googleLogin}
                    </button>
                    <button type="button" onClick={handleAppleLogin} disabled={loading} style={{ ...unifiedButtonStyle, background: '#000', color: '#fff', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" style={{ ...unifiedIconStyle, filter: 'invert(1)' }} />
                      {t.appleLogin}
                    </button>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: 24, 
                    gap: 8,
                    flexDirection: 'row',
                    textAlign: 'center',
                    fontSize: 12,
                    flexWrap: 'nowrap',
                    overflow: 'hidden'
                  }}>
                                          <span onClick={() => navigate("/privacy-policy")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontSize: 12, flex: 1, textAlign: 'center', whiteSpace: 'nowrap', padding: "4px 8px", cursor: "pointer" }}>{t.privacy || '隱私權政策'}</span>
                    <span style={{ color: '#666', fontSize: 12 }}>/</span>
                    <button type="button" onClick={() => navigate('/terms')} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: 12, flex: 1, textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {t.terms}
                    </button>
                    <span style={{ color: '#666', fontSize: 12 }}>/</span>
                                          <span onClick={() => navigate("/data-deletion")} style={{ color: '#6B5BFF', textDecoration: 'underline', fontSize: 12, flex: 1, textAlign: 'center', whiteSpace: 'nowrap', padding: "4px 8px", cursor: "pointer" }}>{t.deletion || '資料刪除說明'}</span>
                  </div>
                </div>
              </form>
            </div>
            
            {/* Right Hero Text - 桌面版顯示 */}
            <div style={{ 
              flex: 1, 
              display: window.innerWidth <= 768 ? 'none' : 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              background: 'rgba(60,40,20,0.18)', 
              padding: '0 12px', 
              minHeight: 'calc(100vh - 60px)', 
              boxSizing: 'border-box', 
              justifyContent: 'space-between' 
            }}>
                <div style={{ position: 'relative', width: '100%', textAlign: 'center', paddingTop: 78 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, textShadow: '0 2px 8px #23294688' }}>
                        {renderRestarterRole(restarterRoleRight[lang])}
                    </div>
                </div>
                <img src="/right-hero.png" alt="right hero" style={{ width: 280, maxWidth: '98%', objectFit: 'contain' }} />
                <div style={{ paddingBottom: 80, textAlign: 'center' }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 22, margin: '12px 0 8px' }}>{t.heroRightMain}</div>
                    <div style={{ color: '#ffd700', fontWeight: 700, fontSize: 18 }}>{t.heroRightYellow}</div>
                </div>
            </div>
          </div>
          <div style={{ position: 'fixed', bottom: 10, left: 36, color: '#fff', textShadow: '0 1px 2px #000', fontSize: 14, zIndex: 10 }}>
            CTX Goodlife Copyright 2025
          </div>
        </div>
      </div>
      {showReset && (
        <div style={{ position:'fixed', left:0, top:0, width:'100vw', height:'100vh', background:'rgba(40,40,80,0.18)', zIndex: 10000, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:18, boxShadow:'0 4px 24px #6B5BFF33', padding:28, minWidth:280, maxWidth:340, width:'90vw', position:'relative', display:'flex', flexDirection:'column', gap:12 }}>
            <button type="button" onClick={()=>setShowReset(false)} style={{ position:'absolute', top:10, right:12, background:'none', border:'none', fontSize:22, color:'#888', cursor:'pointer', fontWeight:700 }}>×</button>
            <div style={{ fontWeight:800, fontSize:18, color:'#6B5BFF', textAlign:'center', marginBottom:2 }}>重設密碼</div>
            <input type="email" value={resetEmail} onChange={e=>setResetEmail(e.target.value)} placeholder="請輸入註冊時的 email" style={{ border:'1px solid #e0e7ff', borderRadius:8, padding:'6px 10px', fontSize:15 }} />
            <button onClick={async()=>{
              setResetMsg('');
              try {
                await sendPasswordResetEmail(auth, resetEmail);
                setResetMsg('已寄出密碼重設信，請到信箱收信！');
              } catch {
                setResetMsg('發送失敗，請確認 email 是否正確');
              }
            }} style={{ background:'linear-gradient(90deg, #6e8efb, #a777e3)', color:'#fff', border:'none', borderRadius:14, padding:'6px 18px', fontWeight:700, fontSize:15, cursor:'pointer', alignSelf:'center' }}>發送重設信</button>
            {resetMsg && <div style={{ color:'#6B5BFF', fontWeight:700, textAlign:'center', marginTop:8 }}>{resetMsg}</div>}
          </div>
        </div>
      )}
      {slowNetwork && <div style={{color:'#ff9800',textAlign:'center',marginTop:8,fontWeight:600}}>網路較慢，請耐心等候...</div>}
    </div>
  );
}

export { COUNTRY_OPTIONS, INTEREST_OPTIONS, EVENT_TYPE_OPTIONS, ageRanges };