import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  contact: string;
  website?: string;
  cost: string;
  rating: number;
  tags: string[];
  image?: string;
}

interface UserProfile {
  skills: string[];
  interests: string[];
  location?: string;
}

export default function Resources() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    interests: []
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 模擬資源數據
  const mockResources: Resource[] = [
    {
      id: '1',
      title: '台北市就業服務站',
      category: '就業服務',
      description: '提供免費的就業諮詢、職涯規劃、技能培訓課程等服務。',
      location: '台北市',
      contact: '02-2341-2345',
      website: 'https://www.taipei.gov.tw',
      cost: '免費',
      rating: 4.5,
      tags: ['就業諮詢', '職涯規劃', '技能培訓']
    },
    {
      id: '2',
      title: '新北市職業訓練中心',
      category: '職業培訓',
      description: '提供各種職業技能培訓課程，包括程式設計、設計、行銷等。',
      location: '新北市',
      contact: '02-2345-6789',
      website: 'https://www.ntpc.gov.tw',
      cost: '部分免費',
      rating: 4.3,
      tags: ['程式設計', '設計', '行銷', '職業培訓']
    },
    {
      id: '3',
      title: '心理諮商中心',
      category: '心理健康',
      description: '專業的心理諮商服務，幫助您處理職涯轉換過程中的心理壓力。',
      location: '台北市',
      contact: '02-2345-1234',
      cost: '收費',
      rating: 4.7,
      tags: ['心理諮商', '壓力管理', '職涯輔導']
    },
    {
      id: '4',
      title: '創業輔導中心',
      category: '創業支援',
      description: '提供創業諮詢、資金申請、商業計劃書撰寫等服務。',
      location: '台北市',
      contact: '02-2345-5678',
      website: 'https://www.sme.gov.tw',
      cost: '免費諮詢',
      rating: 4.2,
      tags: ['創業諮詢', '資金申請', '商業計劃']
    },
    {
      id: '5',
      title: '語言學習中心',
      category: '語言培訓',
      description: '提供英語、日語、韓語等多種語言培訓課程。',
      location: '台北市',
      contact: '02-2345-9012',
      cost: '收費',
      rating: 4.4,
      tags: ['英語', '日語', '韓語', '語言培訓']
    },
    {
      id: '6',
      title: '數位技能培訓中心',
      category: '技能培訓',
      description: '提供AI、大數據、雲端運算等數位技能培訓課程。',
      location: '新北市',
      contact: '02-2345-3456',
      website: 'https://www.digital-skills.org',
      cost: '收費',
      rating: 4.6,
      tags: ['AI', '大數據', '雲端運算', '數位技能']
    },
    {
      id: '7',
      title: '職涯發展協會',
      category: '職涯輔導',
      description: '提供職涯規劃、履歷撰寫、面試技巧等專業輔導服務。',
      location: '台北市',
      contact: '02-2345-7890',
      cost: '會員制',
      rating: 4.1,
      tags: ['職涯規劃', '履歷撰寫', '面試技巧']
    },
    {
      id: '8',
      title: '身心障礙者就業服務中心',
      category: '特殊就業服務',
      description: '專門為身心障礙者提供就業諮詢、技能培訓、工作媒合等服務。',
      location: '台北市',
      contact: '02-2345-2345',
      cost: '免費',
      rating: 4.8,
      tags: ['身心障礙', '就業服務', '技能培訓']
    }
  ];

  const categories = [
    '全部',
    // 汽修相關（最接地氣）
    '汽修服務', '汽車維修', '機車維修', '洗車服務', '汽車美容', '汽修培訓', '汽修諮詢', '汽車保養', '輪胎服務',
    
    // 水電相關
    '水電服務', '水電維修', '水電安裝', '冷氣安裝', '冷氣維修', '水電培訓', '水電諮詢',
    
    // 五金相關
    '五金服務', '五金工具', '五金維修', '五金諮詢', '五金培訓', '五金技術', '五金銷售',
    
    // 工廠相關
    '工廠服務', '工廠管理', '工廠培訓', '工廠諮詢', '工廠技術', '工廠維修', '工廠設備',
    
    // 物流運輸（接地氣）
    '物流服務', '運輸服務', '倉儲服務', '配送服務', '快遞服務', '搬家服務', '貨運服務', '司機培訓', '駕駛培訓', '運輸管理',
    
    // 餐飲服務（接地氣）
    '餐飲服務', '廚藝培訓', '餐飲管理', '小吃培訓', '飲料培訓', '烘焙培訓', '餐飲諮詢', '廚師培訓', '服務員培訓', '外送服務',
    
    // 美容美髮（接地氣）
    '美容美髮', '美容服務', '美髮服務', '美容培訓', '美髮培訓', '美甲服務', '美甲培訓', '理髮服務', '理髮培訓',
    
    // 建築裝潢（接地氣）
    '建築裝潢', '室內設計', '裝潢服務', '油漆服務', '木工服務', '水電安裝', '冷氣安裝',
    
    // 清潔服務（接地氣）
    '清潔服務', '居家清潔', '辦公室清潔', '地毯清潔', '玻璃清潔', '清潔培訓', '清潔諮詢',
    
    // 保全服務（接地氣）
    '保全服務', '安全服務', '警衛服務', '監控服務', '保全培訓', '安全諮詢', '保全管理',
    
    // 就業相關
    '就業服務', '職業培訓', '職涯輔導', '特殊就業服務', '就業諮詢', '就業媒合', '就業輔導', '文員培訓', '會計培訓', '行政培訓',
    
    // 技能培訓
    '技能培訓', '技術培訓', '專業培訓', '語言培訓', '管理培訓', '領導培訓', '溝通培訓',
    
    // 心理健康
    '心理健康', '心理諮商', '心理治療', '精神衛生', '心理輔導', '心理支持', '心理教育',
    
    // 創業支援
    '創業支援', '創業諮詢', '創業培訓', '創業輔導', '創業育成', '創業加速', '創業投資',
    
    // 教育發展
    '成人教育', '終身學習', '社區教育', '推廣教育', '進修教育', '補習教育', '職業教育',
    
    // 金融理財
    '理財諮詢', '投資理財', '財務規劃', '保險諮詢', '退休規劃', '稅務諮詢', '信託服務',
    
    // 法律服務
    '法律諮詢', '法律服務', '法律援助', '法律教育', '法律培訓', '法律研究', '法律支援',
    
    // 醫療健康
    '健康管理', '營養諮詢', '運動健身', '復健治療', '物理治療', '職能治療', '語言治療',
    
    // 社會服務
    '社會服務', '社會工作', '社會福利', '社會救助', '社會關懷', '社會支援', '社會發展',
    
    // 文化藝術
    '文化藝術', '藝術教育', '文化創意', '文創產業', '文化發展', '文化推廣', '文化保存',
    
    // 科技創新
    '科技創新', '研發服務', '技術服務', '創新服務', '創意服務', '設計服務', '工程服務',
    
    // 環境保護
    '環境保護', '環保教育', '環保培訓', '環保諮詢', '環保服務', '環保發展', '環保推廣',
    
    // 農業發展
    '農業技術', '農業推廣', '農業諮詢', '農業服務', '農業發展', '農業培訓', '農業創新',
    
    // 觀光旅遊
    '觀光旅遊', '旅遊服務', '導覽服務', '觀光發展', '旅遊規劃', '觀光諮詢', '旅遊培訓',
    
    // 資訊科技
    '資訊科技', '軟體開發', '網路服務', '數位服務', '科技諮詢', '科技培訓', '科技創新',
    
    // 媒體傳播
    '媒體傳播', '新聞媒體', '廣播電視', '出版印刷', '廣告行銷', '公關服務', '傳播諮詢',
    
    // 其他專業
    '專業諮詢', '顧問服務', '研究發展', '技術服務', '資訊服務', '資料服務', '統計服務'
  ];
  const locations = [
    '全部',
    // 直轄市
    '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
    // 縣市
    '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
    '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
    '台東縣', '澎湖縣', '金門縣', '連江縣'
  ];
  
  // 資源名稱選項 - 大幅擴充
  const resourceNames = [
    // 就業服務類
    '台北市就業服務站', '新北市就業服務站', '桃園市就業服務站', '台中市就業服務站',
    '台南市就業服務站', '高雄市就業服務站', '身心障礙者就業服務中心', '原住民就業服務中心',
    '新住民就業服務中心', '中高齡就業服務中心', '青年就業服務中心', '婦女就業服務中心',
    '退伍軍人就業服務中心', '外籍移工就業服務中心', '就業輔導站', '職業介紹所',
    
    // 職業培訓類
    '新北市職業訓練中心', '桃園市職業訓練中心', '台中市職業訓練中心', '台南市職業訓練中心',
    '高雄市職業訓練中心', '勞動部勞動力發展署', '技能發展中心', '職業訓練學院',
    '技職教育中心', '專業技能培訓中心', '產業人才培訓中心', '職前訓練中心',
    '在職訓練中心', '轉業訓練中心', '技能檢定中心', '職業證照培訓中心',
    
    // 心理健康類
    '心理諮商中心', '心理健康中心', '心理治療中心', '精神衛生中心',
    '心理輔導中心', '心理諮詢中心', '心理衛生中心', '心理復健中心',
    '心理支持中心', '心理關懷中心', '心理援助中心', '心理服務中心',
    '心理教育中心', '心理發展中心', '心理成長中心', '心理療癒中心',
    
    // 創業支援類
    '創業輔導中心', '創業育成中心', '創業加速器', '創業孵化器',
    '創業服務中心', '創業諮詢中心', '創業培訓中心', '創業發展中心',
    '創業支援中心', '創業資源中心', '創業教育中心', '創業學院',
    '創業基金會', '創業協會', '創業聯盟', '創業平台',
    
    // 語言培訓類
    '語言學習中心', '英語培訓中心', '日語培訓中心', '韓語培訓中心',
    '德語培訓中心', '法語培訓中心', '西班牙語培訓中心', '義大利語培訓中心',
    '俄語培訓中心', '阿拉伯語培訓中心', '泰語培訓中心', '越南語培訓中心',
    '印尼語培訓中心', '馬來語培訓中心', '菲律賓語培訓中心', '多語言培訓中心',
    
    // 技能培訓類
    '數位技能培訓中心', 'AI技能培訓中心', '大數據培訓中心', '雲端運算培訓中心',
    '程式設計培訓中心', '網頁設計培訓中心', '平面設計培訓中心', 'UI/UX設計培訓中心',
    '數位行銷培訓中心', '社群媒體培訓中心', 'SEO培訓中心', '內容創作培訓中心',
    '影片剪輯培訓中心', '攝影培訓中心', '動畫製作培訓中心', '3D建模培訓中心',
    
    // 職涯輔導類
    '職涯發展協會', '職涯規劃中心', '職涯諮詢中心', '職涯輔導中心',
    '職涯發展中心', '職涯服務中心', '職涯教育中心', '職涯培訓中心',
    '職涯發展學院', '職涯規劃協會', '職涯諮詢協會', '職涯輔導協會',
    '職涯發展基金會', '職涯服務協會', '職涯教育協會', '職涯培訓協會',
    
    // 特殊就業服務類
    '身心障礙者就業服務中心', '視覺障礙者就業服務中心', '聽覺障礙者就業服務中心',
    '肢體障礙者就業服務中心', '智能障礙者就業服務中心', '精神障礙者就業服務中心',
    '多重障礙者就業服務中心', '自閉症者就業服務中心', '學習障礙者就業服務中心',
    '注意力不足過動症者就業服務中心', '發展遲緩者就業服務中心', '腦性麻痺者就業服務中心',
    '脊髓損傷者就業服務中心', '罕見疾病者就業服務中心', '慢性病者就業服務中心',
    
    // 教育培訓類
    '成人教育中心', '終身學習中心', '社區大學', '空中大學',
    '推廣教育中心', '進修教育中心', '補習教育中心', '職業教育中心',
    '技術教育中心', '專業教育中心', '技能教育中心', '能力教育中心',
    '素質教育中心', '品格教育中心', '生活教育中心', '公民教育中心',
    
    // 金融理財類
    '理財諮詢中心', '投資理財中心', '財務規劃中心', '保險諮詢中心',
    '退休規劃中心', '稅務諮詢中心', '信託服務中心', '基金投資中心',
    '股票投資中心', '期貨投資中心', '外匯投資中心', '房地產投資中心',
    '創業投資中心', '風險投資中心', '天使投資中心', '私募基金中心',
    
    // 法律服務類
    '法律諮詢中心', '法律服務中心', '法律援助中心', '法律教育中心',
    '法律培訓中心', '法律研究中心', '法律發展中心', '法律支援中心',
    '法律關懷中心', '法律保護中心', '法律維權中心', '法律調解中心',
    '法律仲裁中心', '法律鑑定中心', '法律公證中心', '法律顧問中心',
    
    // 醫療健康類
    '健康管理中心', '營養諮詢中心', '運動健身中心', '復健治療中心',
    '物理治療中心', '職能治療中心', '語言治療中心', '心理治療中心',
    '中醫診療中心', '針灸推拿中心', '按摩理療中心', '瑜珈中心',
    '太極拳中心', '氣功中心', '養生保健中心', '預防醫學中心',
    
    // 社會服務類
    '社會服務中心', '社會工作中心', '社會福利中心', '社會救助中心',
    '社會關懷中心', '社會支援中心', '社會發展中心', '社會教育中心',
    '社會培訓中心', '社會諮詢中心', '社會輔導中心', '社會援助中心',
    '社會保護中心', '社會維權中心', '社會調解中心', '社會協調中心',
    
    // 文化藝術類
    '文化藝術中心', '美術館', '博物館', '圖書館',
    '音樂廳', '戲劇院', '電影院', '展覽中心',
    '表演藝術中心', '視覺藝術中心', '表演藝術學院', '藝術教育中心',
    '文化創意中心', '文創產業中心', '文化發展中心', '文化推廣中心',
    
    // 科技創新類
    '科技創新中心', '研發中心', '技術中心', '創新中心',
    '創意中心', '設計中心', '工程中心', '實驗中心',
    '測試中心', '認證中心', '標準中心', '品質中心',
    '專利中心', '智慧財產權中心', '技術轉移中心', '產學合作中心',
    
    // 環境保護類
    '環境保護中心', '環保教育中心', '環保培訓中心', '環保諮詢中心',
    '環保服務中心', '環保發展中心', '環保推廣中心', '環保研究中心',
    '環保監測中心', '環保檢測中心', '環保認證中心', '環保標準中心',
    '環保技術中心', '環保設備中心', '環保材料中心', '環保能源中心',
    
    // 其他專業類
    '專業諮詢中心', '顧問服務中心', '研究發展中心', '技術服務中心',
    '資訊服務中心', '資料服務中心', '統計服務中心', '調查服務中心',
    '評估服務中心', '認證服務中心', '檢驗服務中心', '測試服務中心',
    '監測服務中心', '檢測服務中心', '分析服務中心', '診斷服務中心'
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // 模擬API調用獲取資源數據
    setResources(mockResources);
    setFilteredResources(mockResources);
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, selectedCategory, selectedLocation, searchTerm]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          skills: userData.skills || [],
          interests: userData.interests || [],
          location: userData.location || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // 分類過濾
    if (selectedCategory && selectedCategory !== '全部') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // 地點過濾
    if (selectedLocation && selectedLocation !== '全部') {
      filtered = filtered.filter(resource => resource.location === selectedLocation);
    }

    // 搜尋詞過濾
    if (searchTerm) {
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredResources(filtered);
  };

  const getResourceRelevanceScore = (resource: Resource) => {
    let score = 0;

    // 技能相關度
    const matchingSkills = userProfile.skills.filter(skill => 
      resource.tags.some(tag => tag.toLowerCase().includes(skill.toLowerCase()))
    );
    score += matchingSkills.length * 10;

    // 興趣相關度
    const matchingInterests = userProfile.interests.filter(interest => 
      resource.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase()))
    );
    score += matchingInterests.length * 8;

    // 地點相關度
    if (userProfile.location && resource.location.includes(userProfile.location)) {
      score += 15;
    }

    // 評分加成
    score += resource.rating * 2;

    return score;
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLocation('');
    setSearchTerm('');
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
          }}>本地資源</h1>
          <p style={{ 
            fontSize: window.innerWidth <= 768 ? 14 : 16, 
            color: '#666', 
            maxWidth: 600, 
            margin: '0 auto',
            padding: window.innerWidth <= 768 ? '0 16px' : '0'
          }}>
            發現您附近的職業培訓、心理諮詢、就業服務等資源
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
            
            {/* 搜尋資源 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>搜尋資源</label>
              
              {/* 資源名稱下拉選項 */}
              <select
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, marginBottom: 8 }}
              >
                <option value="">選擇資源名稱...</option>
                {resourceNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              
              {/* 自由搜尋輸入框 */}
              <input
                type="text"
                placeholder="或輸入關鍵字搜尋..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
            </div>

            {/* 分類篩選 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>資源分類</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* 地點篩選 */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>地點</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
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

          {/* 右側：資源列表 */}
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
                推薦資源 ({filteredResources.length})
              </h2>
              <div style={{ 
                fontSize: window.innerWidth <= 768 ? 12 : 14, 
                color: '#666',
                margin: 0
              }}>
                基於您的技能和興趣推薦
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '60px 32px', textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#333' }}>沒有找到符合條件的資源</div>
                <div style={{ fontSize: 14, color: '#666' }}>請嘗試調整篩選條件</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
                {filteredResources
                  .sort((a, b) => getResourceRelevanceScore(b) - getResourceRelevanceScore(a))
                  .map(resource => {
                    const relevanceScore = getResourceRelevanceScore(resource);
                    return (
                      <div key={resource.id} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333' }}>{resource.title}</h3>
                              {relevanceScore > 20 && (
                                <span style={{ 
                                  background: '#4CAF50',
                                  color: '#fff',
                                  padding: '2px 8px',
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 600
                                }}>
                                  推薦
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: 14, color: '#6B5BFF', fontWeight: 600, marginBottom: 8 }}>{resource.category}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                              <span style={{ fontSize: 14, color: '#888' }}>📍 {resource.location}</span>
                              <span style={{ fontSize: 14, color: '#888' }}>💰 {resource.cost}</span>
                              <span style={{ fontSize: 14, color: '#888' }}>⭐ {resource.rating}</span>
                            </div>
                            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 16 }}>
                              {resource.description}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                              {resource.tags.map(tag => (
                                <span
                                  key={tag}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: 12,
                                    background: '#f0f0f0',
                                    color: '#666',
                                    fontSize: 11,
                                    fontWeight: 500
                                  }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 14, color: '#666' }}>
                            📞 {resource.contact}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {resource.website && (
                              <button
                                onClick={() => window.open(resource.website, '_blank')}
                                style={{
                                  background: '#00CFFF',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 6,
                                  padding: '6px 12px',
                                  fontSize: 12,
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                網站
                              </button>
                            )}
                            <button
                              onClick={() => window.open(`tel:${resource.contact}`)}
                              style={{
                                background: '#6B5BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '6px 12px',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              聯絡
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
