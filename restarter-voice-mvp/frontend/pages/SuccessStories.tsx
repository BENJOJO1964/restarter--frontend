import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

interface SuccessStory {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  content: string;
  category: string;
  tags: string[];
  beforeJob: string;
  afterJob: string;
  transitionTime: string;
  keyFactors: string[];
  advice: string;
  createdAt: Date;
  likes: number;
  isAnonymous: boolean;
}

export default function SuccessStories() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';
  
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareForm, setShowShareForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 分享故事表單狀態
  const [shareFormData, setShareFormData] = useState({
    title: '',
    content: '',
    category: '',
    beforeJob: '',
    afterJob: '',
    transitionTime: '',
    keyFactors: '',
    advice: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set());

  // 模擬成功故事數據
  const mockStories: SuccessStory[] = [
    {
      id: '1',
      title: '從傳統製造業到科技新創的轉變',
      author: '張小明',
      content: '我在傳統製造業工作了10年，一直想要轉換到科技產業。通過Restarter平台的技能評估和職涯規劃，我發現自己對數據分析很有興趣。經過6個月的學習和實習，我成功轉換到一家科技新創公司擔任數據分析師。',
      category: '製造業轉科技',
      tags: ['數據分析', 'Python', 'SQL', '製造業'],
      beforeJob: '製造業工程師',
      afterJob: '數據分析師',
      transitionTime: '6個月',
      keyFactors: ['技能評估', '線上學習', '實習經驗', '網路建立'],
      advice: '不要害怕從零開始，找到自己的興趣點，然後專注學習。',
      createdAt: new Date('2024-01-15'),
      likes: 45,
      isAnonymous: false
    },
    {
      id: '2',
      title: '從會計師到UX設計師的華麗轉身',
      author: '李美玲',
      content: '作為一名會計師，我發現自己對設計和用戶體驗越來越感興趣。通過Restarter的職業諮詢，我了解到UX設計師的工作內容和技能要求。我開始學習設計工具和用戶研究方法，最終成功轉換到一家電商公司擔任UX設計師。',
      category: '會計轉設計',
      tags: ['UX設計', 'Figma', '用戶研究', '會計'],
      beforeJob: '會計師',
      afterJob: 'UX設計師',
      transitionTime: '8個月',
      keyFactors: ['興趣探索', '技能學習', '作品集建立', '面試準備'],
      advice: '找到你的熱情所在，然後勇敢地追求它。',
      createdAt: new Date('2024-01-10'),
      likes: 32,
      isAnonymous: false
    },
    {
      id: '3',
      title: '從銷售到產品經理的職涯轉換',
      author: '王建國',
      content: '我在銷售領域工作了5年，雖然業績不錯，但想要更深入地參與產品開發。通過Restarter的職涯規劃，我了解到產品經理需要的能力。我開始學習產品管理、數據分析和用戶研究，最終成功轉換到一家SaaS公司擔任產品經理。',
      category: '銷售轉產品',
      tags: ['產品管理', '數據分析', '用戶研究', '銷售'],
      beforeJob: '銷售經理',
      afterJob: '產品經理',
      transitionTime: '12個月',
      keyFactors: ['技能轉換', '行業了解', '專案經驗', '領導能力'],
      advice: '利用你現有的技能和經驗，找到與新職位的連接點。',
      createdAt: new Date('2024-01-05'),
      likes: 28,
      isAnonymous: false
    },
    {
      id: '4',
      title: '從教師到軟體工程師的轉變',
      author: '陳雅婷',
      content: '作為一名中學教師，我發現自己對程式設計很有興趣。通過Restarter的AI助手，我了解到軟體開發的工作內容和學習路徑。我開始自學程式設計，參加線上課程，最終成功轉換到一家教育科技公司擔任前端工程師。',
      category: '教育轉科技',
      tags: ['前端開發', 'JavaScript', 'React', '教育'],
      beforeJob: '中學教師',
      afterJob: '前端工程師',
      transitionTime: '10個月',
      keyFactors: ['自學能力', '線上課程', '專案實作', '教育背景'],
      advice: '你的教育背景是寶貴的資產，可以幫助你更好地理解用戶需求。',
      createdAt: new Date('2024-01-01'),
      likes: 56,
      isAnonymous: false
    },
    {
      id: '5',
      title: '從餐飲服務員到前端工程師的轉變',
      author: '林志明',
      content: '我在餐廳工作了3年，每天面對客人讓我學會了溝通技巧。通過Restarter的技能評估，我發現自己對網頁設計很有興趣。我開始學習HTML、CSS、JavaScript，最終成功轉換到一家電商公司擔任前端工程師。',
      category: '餐飲業轉科技',
      tags: ['前端開發', 'HTML', 'CSS', 'JavaScript', '餐飲'],
      beforeJob: '餐飲服務員',
      afterJob: '前端工程師',
      transitionTime: '8個月',
      keyFactors: ['溝通技巧', '自學能力', '專案實作', '服務經驗'],
      advice: '服務業的經驗教會了我如何理解用戶需求，這在前端開發中非常重要。',
      createdAt: new Date('2023-12-25'),
      likes: 38,
      isAnonymous: false
    },
    {
      id: '6',
      title: '從會計師到數位行銷專員的轉換',
      author: '黃美華',
      content: '作為會計師，我對數字很敏感，但想要更創意的工作。通過Restarter的職涯諮詢，我了解到數位行銷需要數據分析能力。我開始學習Google Analytics、Facebook廣告等工具，最終成功轉換到一家行銷公司。',
      category: '會計轉行銷',
      tags: ['數位行銷', 'Google Analytics', 'Facebook廣告', '會計'],
      beforeJob: '會計師',
      afterJob: '數位行銷專員',
      transitionTime: '6個月',
      keyFactors: ['數據分析能力', '行銷工具學習', '實務操作', '會計背景'],
      advice: '會計的邏輯思維和數據分析能力在行銷領域非常有用。',
      createdAt: new Date('2023-12-20'),
      likes: 42,
      isAnonymous: false
    },
    {
      id: '7',
      title: '從客服專員到產品經理的轉變',
      author: '張偉傑',
      content: '我在客服部門工作了4年，每天處理客戶問題讓我深入了解用戶痛點。通過Restarter的職涯規劃，我發現產品經理需要的就是這種用戶洞察。我開始學習產品管理、數據分析，最終成功轉換到一家SaaS公司。',
      category: '客服轉行銷',
      tags: ['產品管理', '用戶研究', '數據分析', '客服'],
      beforeJob: '客服專員',
      afterJob: '產品經理',
      transitionTime: '9個月',
      keyFactors: ['用戶洞察', '溝通能力', '問題解決', '客服經驗'],
      advice: '客服經驗讓我學會了從用戶角度思考問題，這是產品經理最重要的能力。',
      createdAt: new Date('2023-12-15'),
      likes: 35,
      isAnonymous: false
    },
    {
      id: '8',
      title: '從平面設計師到UI設計師的轉換',
      author: '王雅文',
      content: '我原本是平面設計師，主要做印刷品設計。通過Restarter的技能評估，我發現UI設計需要更多互動思維。我開始學習Figma、Sketch等工具，了解用戶體驗設計，最終成功轉換到一家科技公司。',
      category: '平面轉UI',
      tags: ['UI設計', 'Figma', 'Sketch', '平面設計'],
      beforeJob: '平面設計師',
      afterJob: 'UI設計師',
      transitionTime: '5個月',
      keyFactors: ['設計基礎', '工具學習', '互動思維', '作品集建立'],
      advice: '平面設計的基礎對UI設計很有幫助，重點是要學會互動思維。',
      createdAt: new Date('2023-12-10'),
      likes: 29,
      isAnonymous: false
    },
    {
      id: '9',
      title: '從基層員工到部門主管的晉升',
      author: '李建國',
      content: '我在公司工作了5年，從基層做起。通過Restarter的領導力培訓，我學會了團隊管理、專案規劃等技能。我主動承擔更多責任，帶領團隊完成重要專案，最終成功晉升為部門主管。',
      category: '基層轉主管',
      tags: ['領導力', '團隊管理', '專案規劃', '晉升'],
      beforeJob: '基層員工',
      afterJob: '部門主管',
      transitionTime: '18個月',
      keyFactors: ['主動承擔', '領導力培訓', '專案經驗', '團隊合作'],
      advice: '主動承擔責任，展現領導潛力，是晉升的關鍵。',
      createdAt: new Date('2023-12-05'),
      likes: 48,
      isAnonymous: false
    },
    {
      id: '10',
      title: '從上班族到創業者的轉變',
      author: '陳志豪',
      content: '我在大公司工作了8年，一直想要創業。通過Restarter的創業諮詢，我了解到創業需要的技能和準備。我利用下班時間學習創業知識，最終辭職創立了自己的電商公司。',
      category: '上班族轉創業',
      tags: ['創業', '電商', '風險管理', '上班族'],
      beforeJob: '上班族',
      afterJob: '創業者',
      transitionTime: '24個月',
      keyFactors: ['創業準備', '技能學習', '風險評估', '資金規劃'],
      advice: '創業需要充分準備，不要衝動辭職，先做好規劃和準備。',
      createdAt: new Date('2023-11-30'),
      likes: 67,
      isAnonymous: false
    }
  ];

  const categories = [
    { value: 'all', label: '全部故事' },
    // 傳統產業轉科技（最常見）
    { value: '製造業轉科技', label: '製造業轉科技' },
    { value: '服務業轉科技', label: '服務業轉科技' },
    { value: '餐飲業轉科技', label: '餐飲業轉科技' },
    { value: '零售業轉科技', label: '零售業轉科技' },
    { value: '物流業轉科技', label: '物流業轉科技' },
    
    // 專業領域轉換
    { value: '會計轉設計', label: '會計轉設計' },
    { value: '會計轉行銷', label: '會計轉行銷' },
    { value: '會計轉人資', label: '會計轉人資' },
    { value: '法律轉科技', label: '法律轉科技' },
    { value: '醫療轉科技', label: '醫療轉科技' },
    { value: '護理轉科技', label: '護理轉科技' },
    
    // 銷售相關轉換
    { value: '銷售轉產品', label: '銷售轉產品' },
    { value: '銷售轉行銷', label: '銷售轉行銷' },
    { value: '銷售轉客服', label: '銷售轉客服' },
    { value: '業務轉管理', label: '業務轉管理' },
    
    // 教育相關轉換
    { value: '教育轉科技', label: '教育轉科技' },
    { value: '教育轉行銷', label: '教育轉行銷' },
    { value: '教育轉人資', label: '教育轉人資' },
    { value: '教育轉客服', label: '教育轉客服' },
    
    // 技術領域轉換
    { value: '前端轉後端', label: '前端轉後端' },
    { value: '後端轉全端', label: '後端轉全端' },
    { value: '測試轉開發', label: '測試轉開發' },
    { value: '運維轉開發', label: '運維轉開發' },
    
    // 設計相關轉換
    { value: '平面轉UI', label: '平面轉UI' },
    { value: 'UI轉UX', label: 'UI轉UX' },
    { value: '設計轉產品', label: '設計轉產品' },
    { value: '設計轉行銷', label: '設計轉行銷' },
    
    // 管理相關轉換
    { value: '技術轉管理', label: '技術轉管理' },
    { value: '基層轉主管', label: '基層轉主管' },
    { value: '主管轉創業', label: '主管轉創業' },
    { value: '員工轉老闆', label: '員工轉老闆' },
    
    // 創業相關
    { value: '上班族轉創業', label: '上班族轉創業' },
    { value: '自由工作者轉創業', label: '自由工作者轉創業' },
    { value: '副業轉正職', label: '副業轉正職' },
    
    // 年齡相關轉換
    { value: '中年轉職', label: '中年轉職' },
    { value: '高齡轉職', label: '高齡轉職' },
    { value: '畢業生轉職', label: '畢業生轉職' },
    
    // 其他實用轉換
    { value: '客服轉行銷', label: '客服轉行銷' },
    { value: '人資轉行銷', label: '人資轉行銷' },
    { value: '行政轉專案', label: '行政轉專案' },
    { value: '助理轉專員', label: '助理轉專員' },
    { value: '專員轉主管', label: '專員轉主管' },
    { value: '其他轉換', label: '其他轉換' }
  ];

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      // 模擬API調用
      setStories(mockStories);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStories = stories.filter(story => {
    const matchesCategory = selectedCategory === 'all' || story.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleShareStory = () => {
    // 直接開啟分享故事表單
    setShowShareForm(true);
  };

  const handleViewStoryDetail = (story: SuccessStory) => {
    setSelectedStory(story);
    setShowStoryDetail(true);
  };

  const handleLikeStory = (storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? { ...story, likes: likedStories.has(storyId) ? story.likes - 1 : story.likes + 1 }
          : story
      )
    );
    
    setLikedStories(prev => {
      const newLikedStories = new Set(prev);
      if (newLikedStories.has(storyId)) {
        newLikedStories.delete(storyId);
      } else {
        newLikedStories.add(storyId);
      }
      return newLikedStories;
    });
  };

  // 分享故事表單組件
  const ShareStoryForm = ({ onClose }: { onClose: () => void }) => {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        // 模擬提交
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 創建新故事
        const newStory: SuccessStory = {
          id: String(Date.now()),
          title: shareFormData.title,
          author: user?.displayName || '匿名用戶',
          content: shareFormData.content,
          category: shareFormData.category,
          tags: shareFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          beforeJob: shareFormData.beforeJob,
          afterJob: shareFormData.afterJob,
          transitionTime: shareFormData.transitionTime,
          keyFactors: shareFormData.keyFactors.split(',').map(factor => factor.trim()).filter(factor => factor),
          advice: shareFormData.advice,
          createdAt: new Date(),
          likes: 0,
          isAnonymous: false
        };
        
        // 添加到故事列表
        setStories(prev => [newStory, ...prev]);
        
        // 重置表單
        setShareFormData({
          title: '',
          content: '',
          category: '',
          beforeJob: '',
          afterJob: '',
          transitionTime: '',
          keyFactors: '',
          advice: '',
          tags: ''
        });
        
        onClose();
        alert('故事分享成功！');
      } catch (error) {
        alert('分享失敗，請重試');
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
              故事標題 *
            </label>
            <input
              type="text"
              required
              value={shareFormData.title}
              onChange={(e) => setShareFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="例如：從製造業到科技新創的轉變"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
              故事分類 *
            </label>
            <select
              required
              value={shareFormData.category}
              onChange={(e) => setShareFormData(prev => ({ ...prev, category: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            >
              <option value="">請選擇分類</option>
              {categories.filter(cat => cat.value !== 'all').map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
              轉換前職位 *
            </label>
            <input
              type="text"
              required
              value={shareFormData.beforeJob}
              onChange={(e) => setShareFormData(prev => ({ ...prev, beforeJob: e.target.value }))}
              placeholder="例如：製造業工程師"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
              轉換後職位 *
            </label>
            <input
              type="text"
              required
              value={shareFormData.afterJob}
              onChange={(e) => setShareFormData(prev => ({ ...prev, afterJob: e.target.value }))}
              placeholder="例如：數據分析師"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            />
          </div>
          
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
              轉換時間 *
            </label>
            <input
              type="text"
              required
              value={shareFormData.transitionTime}
              onChange={(e) => setShareFormData(prev => ({ ...prev, transitionTime: e.target.value }))}
              placeholder="例如：6個月"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
            故事內容 *
          </label>
          <textarea
            required
            value={shareFormData.content}
            onChange={(e) => setShareFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="請詳細描述您的職涯轉換過程、遇到的挑戰、學習的內容等..."
            rows={6}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
            關鍵成功因素
          </label>
          <input
            type="text"
            value={shareFormData.keyFactors}
            onChange={(e) => setShareFormData(prev => ({ ...prev, keyFactors: e.target.value }))}
            placeholder="例如：技能評估,線上學習,實習經驗,網路建立 (用逗號分隔)"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
          />
        </div>

        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
            給其他用戶的建議
          </label>
          <textarea
            value={shareFormData.advice}
            onChange={(e) => setShareFormData(prev => ({ ...prev, advice: e.target.value }))}
            placeholder="請分享您的心得和建議，幫助其他想要轉職的用戶..."
            rows={3}
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14, resize: 'vertical' }}
          />
        </div>

        <div>
          <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>
            標籤
          </label>
          <input
            type="text"
            value={shareFormData.tags}
            onChange={(e) => setShareFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="例如：數據分析,Python,SQL,製造業 (用逗號分隔)"
            style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 16 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              color: '#666',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            取消
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              background: isSubmitting ? '#ccc' : '#6B5BFF',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? '分享中...' : '分享故事'}
          </button>
        </div>
      </form>
    );
  };

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
      
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 20px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#6B5BFF', marginBottom: 12 }}>成功故事</h1>
          <p style={{ fontSize: 16, color: '#666', maxWidth: 600, margin: '0 auto' }}>
            看看其他用戶如何成功轉換職業，獲得靈感和動力
          </p>
        </div>

        {/* 篩選和搜尋 */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333' }}>篩選故事</h3>
            <button
              onClick={handleShareStory}
              style={{
                background: '#6B5BFF',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ✨ 分享我的成功故事
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* 分類篩選 */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>故事分類</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* 搜尋 */}
            <div>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#555', marginBottom: 8, display: 'block' }}>搜尋故事</label>
              <input
                type="text"
                placeholder="搜尋標題、內容或標籤..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
              />
            </div>
          </div>
        </div>

        {/* 故事列表 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333' }}>
              成功故事 ({filteredStories.length})
            </h2>
          </div>

          {filteredStories.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '60px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: '#333' }}>沒有找到符合條件的故事</div>
              <div style={{ fontSize: 14, color: '#666' }}>請嘗試調整篩選條件或搜尋關鍵字</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
              {filteredStories.map(story => (
                <div key={story.id} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '24px' }}>
                  {/* 故事標題和作者 */}
                  <div style={{ marginBottom: 16 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>{story.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6B5BFF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
                        {story.author.charAt(0)}
                      </div>
                      <span style={{ fontSize: 14, color: '#666' }}>{story.author}</span>
                      <span style={{ fontSize: 12, color: '#888' }}>• {story.createdAt.toLocaleDateString()}</span>
                    </div>
                    <span style={{ 
                      background: '#E8F5E8', 
                      color: '#4CAF50', 
                      padding: '4px 8px', 
                      borderRadius: 12, 
                      fontSize: 11, 
                      fontWeight: 600 
                    }}>
                      {story.category}
                    </span>
                  </div>

                  {/* 轉換資訊 */}
                  <div style={{ background: '#f8f9fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>轉換前</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{story.beforeJob}</div>
                      </div>
                      <div style={{ fontSize: 20, color: '#6B5BFF' }}>→</div>
                      <div style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>轉換後</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{story.afterJob}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12, color: '#666' }}>
                      轉換時間：{story.transitionTime}
                    </div>
                  </div>

                  {/* 故事內容 */}
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 16 }}>
                    {story.content}
                  </p>

                  {/* 關鍵因素 */}
                  <div style={{ marginBottom: 16 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 8 }}>關鍵成功因素：</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {story.keyFactors.map(factor => (
                        <span
                          key={factor}
                          style={{
                            padding: '4px 8px',
                            borderRadius: 12,
                            background: '#E3F2FD',
                            color: '#1976D2',
                            fontSize: 11,
                            fontWeight: 500
                          }}
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 建議 */}
                  <div style={{ background: '#FFF3E0', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#E65100', marginBottom: 4 }}>💡 建議</div>
                    <div style={{ fontSize: 13, color: '#666', fontStyle: 'italic' }}>"{story.advice}"</div>
                  </div>

                  {/* 標籤 */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                    {story.tags.map(tag => (
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
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 互動按鈕 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      onClick={() => handleLikeStory(story.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: likedStories.has(story.id) ? '#ff4757' : '#666',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'color 0.2s ease'
                      }}
                    >
                      {likedStories.has(story.id) ? '❤️' : '🤍'} {story.likes} 個讚
                    </button>
                    <button
                      onClick={() => handleViewStoryDetail(story)}
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
                      查看詳情
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 分享故事表單彈窗 */}
      {showShareForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '32px', maxWidth: 800, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333' }}>分享你的成功故事</h2>
              <button
                onClick={() => setShowShareForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#888',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <ShareStoryForm onClose={() => setShowShareForm(false)} />
          </div>
        </div>
      )}

      {/* 故事詳情彈窗 */}
      {showStoryDetail && selectedStory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 18, padding: '32px', maxWidth: 900, width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333' }}>故事詳情</h2>
              <button
                onClick={() => setShowStoryDetail(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#888',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* 故事標題和作者 */}
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 8 }}>{selectedStory.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#666' }}>
                  <span>作者：{selectedStory.author}</span>
                  <span>•</span>
                  <span>{selectedStory.createdAt.toLocaleDateString('zh-TW')}</span>
                  <span>•</span>
                  <span style={{ background: '#E3F2FD', color: '#1976D2', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>
                    {selectedStory.category}
                  </span>
                </div>
              </div>

              {/* 轉換資訊 */}
              <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 20 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 16 }}>職涯轉換資訊</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>轉換前</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{selectedStory.beforeJob}</div>
                  </div>
                  <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 24, color: '#6B5BFF' }}>→</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>轉換後</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>{selectedStory.afterJob}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 14, color: '#666' }}>
                  轉換時間：{selectedStory.transitionTime}
                </div>
              </div>

              {/* 故事內容 */}
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12 }}>詳細故事</h4>
                <div style={{ fontSize: 15, color: '#333', lineHeight: 1.8, background: '#fafafa', padding: 20, borderRadius: 8 }}>
                  {selectedStory.content}
                </div>
              </div>

              {/* 關鍵成功因素 */}
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12 }}>關鍵成功因素</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedStory.keyFactors.map(factor => (
                    <span
                      key={factor}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 16,
                        background: '#E3F2FD',
                        color: '#1976D2',
                        fontSize: 13,
                        fontWeight: 500
                      }}
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              </div>

              {/* 建議 */}
              <div style={{ background: '#FFF3E0', borderRadius: 12, padding: 20 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#E65100', marginBottom: 8 }}>💡 給其他用戶的建議</h4>
                <div style={{ fontSize: 15, color: '#333', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{selectedStory.advice}"
                </div>
              </div>

              {/* 標籤 */}
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 12 }}>相關標籤</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedStory.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        background: '#f0f0f0',
                        color: '#666',
                        fontSize: 12,
                        fontWeight: 500
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 互動資訊 */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, borderTop: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#666' }}>
                  <button
                    onClick={() => handleLikeStory(selectedStory.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: likedStories.has(selectedStory.id) ? '#ff4757' : '#666',
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {likedStories.has(selectedStory.id) ? '❤️' : '🤍'} {selectedStory.likes} 個讚
                  </button>
                </div>
                <button
                  onClick={() => setShowStoryDetail(false)}
                  style={{
                    background: '#6B5BFF',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
