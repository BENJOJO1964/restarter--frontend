import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedDate: string;
  applyUrl: string;
  logo?: string;
}

interface UserProfile {
  skills: string[];
  experience: string;
  careerGoals: string;
  location?: string;
}

export default function JobFinder() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    experience: '',
    careerGoals: ''
  });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // 模擬職位數據 - 涵蓋各行各業
  const mockJobs: Job[] = [
    {
      id: '1',
      title: '前端開發工程師',
      company: '科技新創公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責開發現代化的Web應用程式，使用React、TypeScript等技術。',
      requirements: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'],
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git'],
      postedDate: '2024-01-15',
      applyUrl: '#'
    },
    {
      id: '2',
      title: '後端開發工程師',
      company: '大型企業',
      location: '新北市',
      type: '全職',
      salary: '月薪 70,000 - 90,000',
      description: '負責開發和維護後端API，使用Node.js、Python等技術。',
      requirements: ['Node.js', 'Python', 'SQL', 'MongoDB'],
      skills: ['Node.js', 'Python', 'SQL', 'MongoDB', 'AWS'],
      postedDate: '2024-01-14',
      applyUrl: '#'
    },
    {
      id: '3',
      title: 'UI/UX設計師',
      company: '設計工作室',
      location: '台北市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責產品界面設計和用戶體驗優化。',
      requirements: ['Figma', 'Adobe創意套件', 'UI/UX設計'],
      skills: ['Figma', 'Adobe創意套件', 'UI/UX設計', '原型設計'],
      postedDate: '2024-01-13',
      applyUrl: '#'
    },
    {
      id: '4',
      title: '數據分析師',
      company: '金融科技公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 65,000 - 85,000',
      description: '負責數據分析和商業洞察，支持業務決策。',
      requirements: ['Python', 'SQL', '數據分析', '機器學習'],
      skills: ['Python', 'SQL', '數據分析', '機器學習', 'Tableau'],
      postedDate: '2024-01-12',
      applyUrl: '#'
    },
    {
      id: '5',
      title: '專案經理',
      company: '顧問公司',
      location: '台中市',
      type: '全職',
      salary: '月薪 80,000 - 100,000',
      description: '負責專案規劃、執行和團隊管理。',
      requirements: ['專案管理', '領導力', '溝通技巧'],
      skills: ['專案管理', '領導力', '溝通技巧', '敏捷開發'],
      postedDate: '2024-01-11',
      applyUrl: '#'
    },
    {
      id: '6',
      title: '數位行銷專員',
      company: '電商平台',
      location: '台北市',
      type: '全職',
      salary: '月薪 45,000 - 65,000',
      description: '負責社群媒體行銷、SEO優化和內容創作。',
      requirements: ['數位行銷', '社群媒體行銷', 'SEO優化'],
      skills: ['數位行銷', '社群媒體行銷', 'SEO優化', '內容創作', 'Google Analytics'],
      postedDate: '2024-01-10',
      applyUrl: '#'
    },
    {
      id: '7',
      title: '會計專員',
      company: '會計師事務所',
      location: '台北市',
      type: '全職',
      salary: '月薪 40,000 - 55,000',
      description: '負責財務報表製作、稅務申報和帳務處理。',
      requirements: ['會計', '簿記', '稅務申報'],
      skills: ['會計', '簿記', '稅務申報', 'Excel', 'QuickBooks'],
      postedDate: '2024-01-09',
      applyUrl: '#'
    },
    {
      id: '8',
      title: '人資專員',
      company: '製造業公司',
      location: '桃園市',
      type: '全職',
      salary: '月薪 45,000 - 60,000',
      description: '負責招募、員工關係和人力資源管理。',
      requirements: ['招募', '員工關係', '人資政策'],
      skills: ['招募', '員工關係', '人資政策', '績效評估', '人資資訊系統'],
      postedDate: '2024-01-08',
      applyUrl: '#'
    },
    {
      id: '9',
      title: '護理師',
      company: '醫院',
      location: '高雄市',
      type: '全職',
      salary: '月薪 50,000 - 70,000',
      description: '負責病人照護、醫療記錄和護理評估。',
      requirements: ['護理', '病人照護', '臨床技能'],
      skills: ['護理', '病人照護', '臨床技能', '病歷管理', 'CPR'],
      postedDate: '2024-01-07',
      applyUrl: '#'
    },
    {
      id: '10',
      title: '英文教師',
      company: '語言學校',
      location: '台中市',
      type: '兼職',
      salary: '時薪 400 - 600',
      description: '負責英語教學、課程規劃和學生評估。',
      requirements: ['教學', '英語', '課程開發'],
      skills: ['教學', '英語', '課程開發', '英語教學', '班級管理'],
      postedDate: '2024-01-06',
      applyUrl: '#'
    },
    {
      id: '11',
      title: '行政助理',
      company: '貿易公司',
      location: '台北市',
      type: '全職',
      salary: '月薪 35,000 - 45,000',
      description: '負責文書處理、會議安排和行政支援。',
      requirements: ['行政支援', '辦公室管理', 'Microsoft Office'],
      skills: ['行政支援', '辦公室管理', 'Microsoft Office', '行程管理', '資料輸入'],
      postedDate: '2024-01-05',
      applyUrl: '#'
    },
    {
      id: '12',
      title: '機械工程師',
      company: '製造業公司',
      location: '台南市',
      type: '全職',
      salary: '月薪 60,000 - 80,000',
      description: '負責機械設計、產品開發和技術支援。',
      requirements: ['機械工程', 'CAD設計', '產品開發'],
      skills: ['機械工程', 'CAD設計', '產品開發', '技術製圖', '品質控制'],
      postedDate: '2024-01-04',
      applyUrl: '#'
    }
  ];

  const jobTypes = ['全職', '兼職', '實習', '遠端'];
  const locations = [
    // 直轄市
    '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
    // 縣市
    '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
    '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
    '台東縣', '澎湖縣', '金門縣', '連江縣'
  ];
  
  // 職位名稱選項 - 重新排序，從基層職位開始
  const jobTitles = [
    // 行政與支援類（基層職位）
    '行政助理', '秘書', '總機', '接待員',
    '文書處理員', '資料輸入員', '檔案管理員', '行程管理員',
    '會議協調員', '活動企劃專員', '公關專員', '法務助理',
    '法務專員', '律師', '法務經理', '智慧財產權專員',
    '專利工程師', '商標專員', '合約管理員', '法規遵循專員',
    
    // 服務與零售類（基層職位）
    '客服專員', '客服代表', '客服經理', '客戶成功經理',
    '客戶關係專員', '客戶支援專員', '技術支援專員', '售後服務專員',
    '零售銷售員', '門市店員', '店長', '區域經理',
    '商品管理員', '庫存管理員', '採購專員', '物流專員',
    '倉儲管理員', '配送員', '司機', '快遞員',
    
    // 餐飲與觀光類（基層職位）
    '廚師', '主廚', '副廚', '廚師助理',
    '服務生', '餐廳經理', '飯店經理', '房務員',
    '櫃檯接待員', '導遊', '領隊', '旅遊顧問',
    '旅行社專員', '飯店業務員', '餐飲業務員', '活動企劃師',
    '婚禮企劃師', '派對企劃師', '展覽企劃師', '會議企劃師',
    
    // 製造與工程類（基層職位）
    '機械工程師', '電機工程師', '電子工程師', '化學工程師',
    '材料工程師', '土木工程師', '結構工程師', '建築師',
    '室內設計師', '景觀設計師', '營建工程師', '機電工程師',
    '製程工程師', '品保工程師', '測試工程師', '維修工程師',
    '設備工程師', '工安工程師', '環保工程師', '能源工程師',
    '太陽能工程師', '風力發電工程師', '核能工程師', '水利工程師',
    
    // 醫療與健康類（基層職位）
    '護理師', '護士', '醫師', '藥師',
    '醫檢師', '放射師', '物理治療師', '職能治療師',
    '語言治療師', '心理師', '諮商師', '營養師',
    '醫事檢驗師', '醫事放射師', '呼吸治療師', '助產師',
    '個案管理師', '護理長', '護理部主任', '醫院行政人員',
    
    // 教育與培訓類（基層職位）
    '英文教師', '中文教師', '數學教師', '物理教師',
    '化學教師', '生物教師', '歷史教師', '地理教師',
    '公民教師', '音樂教師', '美術教師', '體育教師',
    '電腦教師', '程式設計教師', '語言教師', '補習班教師',
    '家教', '線上教師', '企業講師', '培訓講師',
    '教育顧問', '課程開發專員', '教學設計師', '教育科技專員',
    
    // 人力資源類（基層職位）
    '人資專員', '招募專員', '培訓專員', '薪酬專員',
    '績效專員', '員工關係專員', '勞工關係專員', '人資經理',
    '人資長', '組織發展專員', '人才發展專員', '職涯顧問',
    '獵頭顧問', '人資顧問', '勞動法顧問', '職場安全專員',
    
    // 財務與會計類（基層職位）
    '會計專員', '會計師', '審計師', '稅務專員',
    '財務專員', '財務分析師', '財務經理', '財務長',
    '出納', '簿記員', '成本會計', '管理會計',
    '財務規劃師', '投資顧問', '理財顧問', '保險業務員',
    '銀行行員', '證券營業員', '期貨營業員', '基金經理',
    
    // 行銷與業務類（基層職位）
    '數位行銷專員', '社群媒體行銷專員', '內容行銷專員', 'SEO專員',
    'SEM專員', 'Google廣告專員', 'Facebook廣告專員', '電商行銷專員',
    '品牌行銷專員', '活動行銷專員', '公關專員', '媒體專員',
    '業務專員', '業務代表', '業務經理', '客戶經理',
    '銷售專員', '銷售代表', '銷售經理', '通路經理',
    '渠道經理', '區域經理', '大客戶經理', '新客戶開發專員',
    
    // 傳播與媒體類（基層職位）
    '記者', '編輯', '主播', '節目主持人',
    '編劇', '導演', '製片', '攝影師',
    '剪輯師', '音效師', '燈光師', '化妝師',
    '造型師', '服裝師', '道具師', '場務',
    '企劃專員', '文案專員', '廣告專員', '媒體企劃師',
    
    // 設計與創意類（基層職位）
    'UI/UX設計師', '視覺設計師', '平面設計師', '網頁設計師',
    '產品設計師', '工業設計師', '包裝設計師', '標誌設計師',
    '插畫師', '動畫師', '3D建模師', '影片剪輯師',
    '攝影師', '多媒體設計師', '互動設計師', '使用者體驗設計師',
    '資訊架構師', '內容策略師', '創意總監', '藝術總監',
    
    // 數據與分析類（基層職位）
    '數據分析師', '資料科學家', '商業分析師', '市場分析師',
    '財務分析師', '風險分析師', '營運分析師', '產品分析師',
    '用戶分析師', '行為分析師', '統計分析師', '量化分析師',
    '研究分析師', '競爭分析師', '策略分析師', '投資分析師',
    
    // 管理與領導類（中層職位）
    '專案經理', '產品經理', '技術經理', '研發經理',
    '營運經理', '業務經理', '行銷經理', '財務經理',
    '人資經理', '客服經理', '品保經理', '採購經理',
    '物流經理', '供應鏈經理', '法務經理', '資訊經理',
    '總經理', '副總經理', '執行長', '營運長',
    '技術長', '財務長', '行銷長', '人資長',
    
    // 技術開發類（高級職位）
    '前端開發工程師', '後端開發工程師', '全端開發工程師', '軟體工程師',
    '系統工程師', '網路工程師', '資料庫工程師', 'DevOps工程師',
    '雲端工程師', '資安工程師', '區塊鏈工程師', 'AI工程師',
    '機器學習工程師', '深度學習工程師', '演算法工程師', '大數據工程師',
    '行動開發工程師', 'iOS開發工程師', 'Android開發工程師', 'Flutter開發工程師',
    'React Native開發工程師', '遊戲開發工程師', 'Unity開發工程師', 'Unreal開發工程師',
    '嵌入式工程師', '韌體工程師', '硬體工程師', '電機工程師',
    '自動化工程師', 'PLC工程師', 'SCADA工程師', '工業4.0工程師',
    
    // 設計與創意類
    'UI/UX設計師', '視覺設計師', '平面設計師', '網頁設計師',
    '產品設計師', '工業設計師', '包裝設計師', '標誌設計師',
    '插畫師', '動畫師', '3D建模師', '影片剪輯師',
    '攝影師', '多媒體設計師', '互動設計師', '使用者體驗設計師',
    '資訊架構師', '內容策略師', '創意總監', '藝術總監',
    
    // 數據與分析類
    '數據分析師', '資料科學家', '商業分析師', '市場分析師',
    '財務分析師', '風險分析師', '營運分析師', '產品分析師',
    '用戶分析師', '行為分析師', '統計分析師', '量化分析師',
    '研究分析師', '競爭分析師', '策略分析師', '投資分析師',
    
    // 管理與領導類
    '專案經理', '產品經理', '技術經理', '研發經理',
    '營運經理', '業務經理', '行銷經理', '財務經理',
    '人資經理', '客服經理', '品保經理', '採購經理',
    '物流經理', '供應鏈經理', '法務經理', '資訊經理',
    '總經理', '副總經理', '執行長', '營運長',
    '技術長', '財務長', '行銷長', '人資長',
    
    // 行銷與業務類
    '數位行銷專員', '社群媒體行銷專員', '內容行銷專員', 'SEO專員',
    'SEM專員', 'Google廣告專員', 'Facebook廣告專員', '電商行銷專員',
    '品牌行銷專員', '活動行銷專員', '公關專員', '媒體專員',
    '業務專員', '業務代表', '業務經理', '客戶經理',
    '銷售專員', '銷售代表', '銷售經理', '通路經理',
    '渠道經理', '區域經理', '大客戶經理', '新客戶開發專員',
    
    // 財務與會計類
    '會計專員', '會計師', '審計師', '稅務專員',
    '財務專員', '財務分析師', '財務經理', '財務長',
    '出納', '簿記員', '成本會計', '管理會計',
    '財務規劃師', '投資顧問', '理財顧問', '保險業務員',
    '銀行行員', '證券營業員', '期貨營業員', '基金經理',
    
    // 人力資源類
    '人資專員', '招募專員', '培訓專員', '薪酬專員',
    '績效專員', '員工關係專員', '勞工關係專員', '人資經理',
    '人資長', '組織發展專員', '人才發展專員', '職涯顧問',
    '獵頭顧問', '人資顧問', '勞動法顧問', '職場安全專員',
    
    // 醫療與健康類
    '護理師', '護士', '醫師', '藥師',
    '醫檢師', '放射師', '物理治療師', '職能治療師',
    '語言治療師', '心理師', '諮商師', '營養師',
    '醫事檢驗師', '醫事放射師', '呼吸治療師', '助產師',
    '個案管理師', '護理長', '護理部主任', '醫院行政人員',
    
    // 教育與培訓類
    '英文教師', '中文教師', '數學教師', '物理教師',
    '化學教師', '生物教師', '歷史教師', '地理教師',
    '公民教師', '音樂教師', '美術教師', '體育教師',
    '電腦教師', '程式設計教師', '語言教師', '補習班教師',
    '家教', '線上教師', '企業講師', '培訓講師',
    '教育顧問', '課程開發專員', '教學設計師', '教育科技專員',
    
    // 行政與支援類
    '行政助理', '秘書', '總機', '接待員',
    '文書處理員', '資料輸入員', '檔案管理員', '行程管理員',
    '會議協調員', '活動企劃專員', '公關專員', '法務助理',
    '法務專員', '律師', '法務經理', '智慧財產權專員',
    '專利工程師', '商標專員', '合約管理員', '法規遵循專員',
    
    // 製造與工程類
    '機械工程師', '電機工程師', '電子工程師', '化學工程師',
    '材料工程師', '土木工程師', '結構工程師', '建築師',
    '室內設計師', '景觀設計師', '營建工程師', '機電工程師',
    '製程工程師', '品保工程師', '測試工程師', '維修工程師',
    '設備工程師', '工安工程師', '環保工程師', '能源工程師',
    '太陽能工程師', '風力發電工程師', '核能工程師', '水利工程師',
    
    // 服務與零售類
    '客服專員', '客服代表', '客服經理', '客戶成功經理',
    '客戶關係專員', '客戶支援專員', '技術支援專員', '售後服務專員',
    '零售銷售員', '門市店員', '店長', '區域經理',
    '商品管理員', '庫存管理員', '採購專員', '物流專員',
    '倉儲管理員', '配送員', '司機', '快遞員',
    
    // 餐飲與觀光類
    '廚師', '主廚', '副廚', '廚師助理',
    '服務生', '餐廳經理', '飯店經理', '房務員',
    '櫃檯接待員', '導遊', '領隊', '旅遊顧問',
    '旅行社專員', '飯店業務員', '餐飲業務員', '活動企劃師',
    '婚禮企劃師', '派對企劃師', '展覽企劃師', '會議企劃師',
    
    // 傳播與媒體類
    '記者', '編輯', '主播', '節目主持人',
    '編劇', '導演', '製片', '攝影師',
    '剪輯師', '音效師', '燈光師', '化妝師',
    '造型師', '服裝師', '道具師', '場務',
    '企劃專員', '文案專員', '廣告專員', '媒體企劃師',
    
    // 其他專業類
    '翻譯員', '口譯員', '校對員', '文案撰寫員',
    '研究員', '研究助理', '實驗室技術員', '品質管理員',
    'ISO專員', '認證專員', '稽核員', '顧問',
    '創業家', '投資人', '天使投資人', '創投經理',
    '專利代理人', '商標代理人', '會計師事務所合夥人', '律師事務所合夥人'
  ];
  
  // 所有可選技能列表 - 涵蓋各行各業（中文版）
  const allSkills = [
    // 技術類技能
    'React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git',
    'Node.js', 'Python', 'SQL', 'MongoDB', 'AWS',
    'Figma', 'Adobe創意套件', 'UI/UX設計', '原型設計',
    '數據分析', '機器學習', 'Tableau',
    'Vue.js', 'Angular', 'PHP', 'Java', 'C#', 'Go', 'Rust',
    'Docker', 'Kubernetes', 'Linux', 'DevOps', 'CI/CD',
    'GraphQL', 'REST API', '微服務', '雲端運算',
    '行動開發', 'iOS', 'Android', 'Flutter', 'React Native',
    '區塊鏈', '加密貨幣', '網路安全', '網路安全',
    
    // 管理與領導技能
    '專案管理', '領導力', '溝通技巧', '敏捷開發',
    '團隊管理', '策略規劃', '風險管理',
    '預算管理', '利害關係人管理', '變革管理',
    '績效管理', '衝突解決', '談判技巧',
    
    // 行銷與業務技能
    '數位行銷', 'SEO優化', '社群媒體行銷', '內容創作',
    '銷售', '客戶服務', '業務開發', '市場研究',
    '品牌管理', '活動規劃', '公關',
    '電子郵件行銷', 'Google Analytics', 'Facebook廣告', 'Google廣告',
    '網紅行銷', '內容策略', '行銷自動化',
    
    // 財務與會計技能
    '財務分析', '會計', '簿記', '稅務申報',
    '預算規劃', '財務建模', '審計', '成本控制',
    '投資分析', '風險評估', '財務報告',
    'QuickBooks', 'Excel', 'SAP', 'Oracle財務系統',
    
    // 人力資源技能
    '招募', '人才招募', '員工關係',
    '績效評估', '培訓發展', '薪酬福利',
    '人資政策', '勞動法規', '職場安全', '多元包容',
    '人資資訊系統', 'Workday', 'BambooHR',
    
    // 設計與創意技能
    '平面設計', '網頁設計', '標誌設計', '印刷設計',
    '插畫', '攝影', '影片剪輯', '動態圖形',
    '3D建模', '動畫', '字體設計', '色彩理論',
    'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Sketch',
    
    // 醫療與健康技能
    '病人照護', '醫學術語', '臨床技能',
    '護理', '藥學', '醫療帳單', '醫療編碼',
    '醫療管理', '病歷管理', 'HIPAA合規',
    'CPR', '急救', '生命徵象', '藥物管理',
    
    // 教育與培訓技能
    '教學', '課程開發', '學生評估',
    '班級管理', '線上教學', '教育科技',
    '特殊教育', '英語教學', '成人教育',
    '培訓設計', '教學設計', '電子學習',
    
    // 法律與行政技能
    '法律研究', '合約審查', '法律寫作',
    '行政支援', '辦公室管理', '文件管理',
    '行程管理', '差旅安排', '會議協調',
    '資料輸入', '檔案系統', '客戶支援',
    
    // 製造與工程技能
    'CAD設計', '品質控制', '製造流程',
    '機械工程', '電機工程', '土木工程',
    '產品開發', '六標準差', '精實製造',
    '安全規範', '設備維護', '技術製圖',
    
    // 零售與服務技能
    '零售銷售', '庫存管理', '客戶服務',
    '現金處理', 'POS系統', '商品陳列',
    '店面管理', '防損', '視覺商品陳列',
    '餐飲服務', '飯店服務', '觀光旅遊',
    
    // 語言與翻譯技能
    '英語', '中文', '日語', '韓語', '西班牙語', '法語',
    '德語', '義大利語', '葡萄牙語', '俄語', '阿拉伯語',
    '翻譯', '口譯', '校對', '文案撰寫',
    
    // 其他專業技能
    '研究', '資料輸入', 'Microsoft Office', 'Google Workspace',
    '虛擬助理', '活動規劃', '物流', '供應鏈',
    '品質保證', '測試', '文件撰寫', '技術寫作'
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // 初始載入職位數據
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      
      // 構建API請求參數，確保正確編碼
      const params = new URLSearchParams();
      if (searchTerm) params.append('keyword', encodeURIComponent(searchTerm));
      if (selectedLocation) params.append('location', encodeURIComponent(selectedLocation));
      if (selectedType) params.append('jobType', encodeURIComponent(selectedType));
      if (selectedSkills.length > 0) params.append('skills', encodeURIComponent(selectedSkills.join(',')));
      params.append('page', '1');
      params.append('limit', '20');

      const response = await fetch(`/api/jobs/search?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        setJobs(result.data.jobs);
        setFilteredJobs(result.data.jobs);
        console.log('職位數據來源:', result.data.note || '智能生成資料');
      } else {
        console.error('獲取職位失敗:', result.message);
        // 如果API失敗，使用模擬數據
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
      }
    } catch (error) {
      console.error('職位API調用錯誤:', error);
      // 錯誤時使用模擬數據
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
    } finally {
      setIsLoading(false);
    }
  };

  // 當篩選條件改變時，重新獲取職位數據
  useEffect(() => {
    fetchJobs();
  }, [searchTerm, selectedLocation, selectedType, selectedSkills]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          skills: userData.skills || [],
          experience: userData.experience || '',
          careerGoals: userData.careerGoals || '',
          location: userData.location || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 移除filterJobs函數，直接使用API篩選功能

  const getJobMatchScore = (job: Job) => {
    let score = 0;
    const userSkillSet = new Set(userProfile.skills);
    const jobSkillSet = new Set(job.skills);

    // 技能匹配度
    const matchingSkills = userProfile.skills.filter(skill => job.skills.includes(skill));
    score += (matchingSkills.length / job.skills.length) * 50;

    // 地點匹配度
    if (userProfile.location && job.location.includes(userProfile.location)) {
      score += 20;
    }

    // 經驗相關度
    if (userProfile.experience && job.description.toLowerCase().includes(userProfile.experience.toLowerCase())) {
      score += 15;
    }

    // 職業目標相關度
    if (userProfile.careerGoals && job.description.toLowerCase().includes(userProfile.careerGoals.toLowerCase())) {
      score += 15;
    }

    return Math.min(100, Math.round(score));
  };

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLocation('');
    setSelectedType('');
    setSelectedSkills([]);
    // 清除篩選後會自動重新獲取所有職位
  };

  // 處理職位申請
  const handleApplyJob = (job: Job) => {
    // 檢查用戶是否已登入
    if (!user) {
      alert('請先登入後再申請職位');
      navigate('/login');
      return;
    }

    // 顯示申請確認對話框
    const confirmApply = window.confirm(
      `確定要申請「${job.title}」職位嗎？\n\n` +
      `公司：${job.company}\n` +
      `地點：${job.location}\n` +
      `薪資：${job.salary}\n\n` +
      `系統將自動生成您的簡歷並發送申請。`
    );

    if (confirmApply) {
      // 模擬申請流程
      alert('申請已提交！\n\n我們會將您的申請發送給公司，並在24小時內通知您申請狀態。\n\n您也可以在個人資料頁面查看申請記錄。');
      
      // 這裡可以添加實際的申請邏輯：
      // 1. 保存申請記錄到Firebase
      // 2. 發送申請郵件給公司
      // 3. 更新用戶的申請歷史
      
      console.log('職位申請:', {
        userId: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        appliedAt: new Date().toISOString()
      });
    }
  };

  // 移除登入檢查，讓未登入用戶也可以使用

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: '#6B5BFF' }}>載入中...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      {/* 左上角返回按鈕 */}
      <button onClick={() => navigate('/profile')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回個人資料</button>
      
      <div style={{ 
        maxWidth: 1200, 
        margin: '0 auto', 
        padding: window.innerWidth <= 768 ? '80px 16px 20px' : '80px 20px 40px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: window.innerWidth <= 768 ? 24 : 32 }}>
          <h1 style={{ 
            fontSize: window.innerWidth <= 768 ? 24 : 32, 
            fontWeight: 900, 
            color: '#6B5BFF', 
            marginBottom: 12 
          }}>職位搜尋</h1>
          <p style={{ 
            fontSize: window.innerWidth <= 768 ? 14 : 16, 
            color: '#666', 
            maxWidth: 600, 
            margin: '0 auto',
            padding: window.innerWidth <= 768 ? '0 16px' : '0'
          }}>
            基於您的技能和經驗，為您推薦最適合的職位機會
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '300px 1fr', 
          gap: window.innerWidth <= 768 ? 16 : 32,
          flexDirection: window.innerWidth <= 768 ? 'column' : 'row'
        }}>
          {/* 左側：篩選器 */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 18, 
            boxShadow: '0 4px 24px #6B5BFF11', 
            padding: window.innerWidth <= 768 ? '16px' : '24px', 
            height: 'fit-content',
            order: window.innerWidth <= 768 ? 1 : 1
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 20 }}>篩選條件</h3>
            
            {/* 搜尋 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>搜尋職位</label>
              
              {/* 職位名稱下拉選項 */}
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, marginBottom: 8 }}
              >
                <option value="">選擇職位名稱...</option>
                {jobTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              
              {/* 自由搜尋輸入框 */}
              <input
                type="text"
                placeholder="或輸入關鍵字搜尋..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: 'calc(100% - 24px)', 
                  padding: '8px 12px', 
                  border: '1px solid #ddd', 
                  borderRadius: 6, 
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* 地點篩選 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>工作地點</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                <option value="">所有地點</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* 工作類型 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>工作類型</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                <option value="">所有類型</option>
                {jobTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* 技能篩選 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>技能要求</label>
              
              {/* 技能下拉選項框 */}
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value && !selectedSkills.includes(e.target.value)) {
                    setSelectedSkills(prev => [...prev, e.target.value]);
                  }
                }}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, marginBottom: 12 }}
              >
                <option value="">選擇技能...</option>
                {allSkills.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              
              {/* 已選擇的技能標籤 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {selectedSkills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => handleSkillToggle(skill)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      border: '1px solid #6B5BFF',
                      background: '#6B5BFF',
                      color: '#fff',
                      fontSize: 11,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {skill}
                    <span style={{ fontSize: 10 }}>×</span>
                  </button>
                ))}
              </div>
              
              {/* 用戶技能提示 */}
              {userProfile.skills.length > 0 && (
                <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                  您的技能：{userProfile.skills.join(', ')}
                </div>
              )}
            </div>

            {/* 清除篩選 */}
            <button
              onClick={clearFilters}
              style={{
                width: '100%',
                background: '#f0f0f0',
                color: '#666',
                border: 'none',
                borderRadius: 8,
                padding: '8px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              清除所有篩選
            </button>
          </div>

          {/* 右側：職位列表 */}
          <div style={{ 
            order: window.innerWidth <= 768 ? 2 : 2,
            width: '100%',
            overflow: 'hidden'
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
              justifyContent: 'space-between', 
              alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
              marginBottom: 24,
              gap: window.innerWidth <= 768 ? 8 : 0
            }}>
              <h2 style={{ 
                fontSize: window.innerWidth <= 768 ? 20 : 24, 
                fontWeight: 700, 
                color: '#333',
                margin: 0
              }}>
                推薦職位 ({filteredJobs.length})
              </h2>
              <div style={{ 
                fontSize: window.innerWidth <= 768 ? 12 : 14, 
                color: '#666',
                margin: 0
              }}>
                基於您的技能和經驗推薦
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#333' }}>沒有找到符合條件的職位</div>
                <div style={{ fontSize: 14, color: '#666' }}>請嘗試調整篩選條件或更新您的技能檔案</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: window.innerWidth <= 768 ? 12 : 16 }}>
                {filteredJobs
                  .sort((a, b) => getJobMatchScore(b) - getJobMatchScore(a))
                  .map(job => {
                    const matchScore = getJobMatchScore(job);
                    return (
                      <div key={job.id} style={{ 
                        background: '#fff', 
                        borderRadius: 18, 
                        boxShadow: '0 4px 24px #6B5BFF11', 
                        padding: window.innerWidth <= 768 ? '16px' : '24px',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                          justifyContent: 'space-between', 
                          alignItems: window.innerWidth <= 768 ? 'flex-start' : 'flex-start', 
                          marginBottom: 16,
                          gap: window.innerWidth <= 768 ? 12 : 0
                        }}>
                          <div style={{ flex: 1, width: '100%' }}>
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                              alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
                              gap: window.innerWidth <= 768 ? 8 : 12, 
                              marginBottom: 8 
                            }}>
                              <h3 style={{ 
                                fontSize: window.innerWidth <= 768 ? 18 : 20, 
                                fontWeight: 700, 
                                color: '#333',
                                margin: 0
                              }}>{job.title}</h3>
                              <span style={{ 
                                background: matchScore >= 80 ? '#4CAF50' : matchScore >= 60 ? '#FF9800' : '#F44336',
                                color: '#fff',
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontSize: 11,
                                fontWeight: 600
                              }}>
                                {matchScore}% 匹配
                              </span>
                            </div>
                            <div style={{ 
                              fontSize: window.innerWidth <= 768 ? 14 : 16, 
                              color: '#666', 
                              marginBottom: 8 
                            }}>{job.company}</div>
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                              alignItems: window.innerWidth <= 768 ? 'flex-start' : 'center', 
                              gap: window.innerWidth <= 768 ? 4 : 16, 
                              marginBottom: 12 
                            }}>
                              <span style={{ fontSize: window.innerWidth <= 768 ? 12 : 14, color: '#888' }}>📍 {job.location}</span>
                              <span style={{ fontSize: window.innerWidth <= 768 ? 12 : 14, color: '#888' }}>💼 {job.type}</span>
                              <span style={{ fontSize: window.innerWidth <= 768 ? 12 : 14, color: '#888' }}>💰 {job.salary}</span>
                            </div>
                            <p style={{ 
                              fontSize: window.innerWidth <= 768 ? 12 : 14, 
                              color: '#666', 
                              lineHeight: 1.6, 
                              marginBottom: 16 
                            }}>
                              {job.description}
                            </p>
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: window.innerWidth <= 768 ? 4 : 6, 
                              marginBottom: 16 
                            }}>
                              {job.skills.map(skill => (
                                <span
                                  key={skill}
                                  style={{
                                    padding: window.innerWidth <= 768 ? '2px 6px' : '4px 8px',
                                    borderRadius: 12,
                                    background: userProfile.skills.includes(skill) ? '#E8F5E8' : '#f0f0f0',
                                    color: userProfile.skills.includes(skill) ? '#4CAF50' : '#666',
                                    fontSize: window.innerWidth <= 768 ? 10 : 11,
                                    fontWeight: 500
                                  }}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: window.innerWidth <= 768 ? 'row' : 'column', 
                            gap: window.innerWidth <= 768 ? 8 : 8, 
                            alignItems: window.innerWidth <= 768 ? 'flex-start' : 'flex-end',
                            width: window.innerWidth <= 768 ? '100%' : 'auto',
                            justifyContent: window.innerWidth <= 768 ? 'flex-start' : 'flex-end'
                          }}>
                            <div style={{ fontSize: 12, color: '#888' }}>
                              發布於 {job.postedDate}
                              {job.source && (
                                <span style={{ marginLeft: 8, color: '#6B5BFF', fontWeight: 500 }}>
                                  • {job.source}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleApplyJob(job)}
                              style={{
                                background: '#6B5BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#5A4BFF';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#6B5BFF';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              立即申請
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
