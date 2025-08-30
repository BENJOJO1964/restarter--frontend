import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
  displayName?: string;
  email?: string;
  photoURL?: string;
  skills: string[];
  experience: string;
  education: string;
  careerGoals: string;
  interests: string[];
  languages: string[];
  location?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';

  const [profile, setProfile] = useState<UserProfile>({
    skills: [],
    experience: '',
    education: '',
    careerGoals: '',
    interests: [],
    languages: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showOtherLanguages, setShowOtherLanguages] = useState(false);
  const [otherLanguages, setOtherLanguages] = useState('');

  // 預設技能選項
  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Git', 'TypeScript', 'Vue.js', 'Angular', 'PHP', 'Ruby',
    'Swift', 'Kotlin', 'Flutter', 'React Native', 'UI/UX Design', 'Project Management',
    'Data Analysis', 'Machine Learning', 'DevOps', 'Cybersecurity', 'Content Writing',
    'Digital Marketing', 'Sales', 'Customer Service', 'Leadership', 'Communication'
  ];

  // 預設興趣選項
  const interestOptions = [
    'Technology', 'Healthcare', 'Education', 'Finance', 'Entertainment', 'Sports',
    'Travel', 'Food', 'Fashion', 'Art', 'Music', 'Reading', 'Gaming', 'Fitness',
    'Environment', 'Social Impact', 'Innovation', 'Research', 'Teaching', 'Mentoring'
  ];

  // 語言選項
  const languageOptions = [
    '中文', 'English', '日本語', '한국어', 'ไทย', 'Tiếng Việt', 'Bahasa Melayu', 'Lao', '其他'
  ];

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfile({
          displayName: user.displayName || userData.displayName || '',
          email: user.email || userData.email || '',
          photoURL: user.photoURL || userData.photoURL || '',
          skills: userData.skills || [],
          experience: userData.experience || '',
          education: userData.education || '',
          careerGoals: userData.careerGoals || '',
          interests: userData.interests || [],
          languages: userData.languages || [],
          location: userData.location || '',
          phone: userData.phone || '',
          linkedin: userData.linkedin || '',
          portfolio: userData.portfolio || ''
        });
      } else {
        // 如果Firestore中沒有用戶資料，使用Firebase Auth的資料
        setProfile({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
          skills: [],
          experience: '',
          education: '',
          careerGoals: '',
          interests: [],
          languages: [],
          location: '',
          phone: '',
          linkedin: '',
          portfolio: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // 錯誤時也使用Firebase Auth的資料
      setProfile({
        displayName: user.displayName || '',
        email: user.email || '',
        photoURL: user.photoURL || '',
        skills: [],
        experience: '',
        education: '',
        careerGoals: '',
        interests: [],
        languages: [],
        location: '',
        phone: '',
        linkedin: '',
        portfolio: ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        updatedAt: new Date()
      }, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    if (language === '其他') {
      setShowOtherLanguages(!showOtherLanguages);
      return;
    }
    
    setProfile(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleOtherLanguagesChange = (value: string) => {
    setOtherLanguages(value);
    // 將其他語言添加到profile中
    const otherLangList = value.split(',').map(lang => lang.trim()).filter(lang => lang);
    setProfile(prev => ({
      ...prev,
      languages: [
        ...prev.languages.filter(lang => lang !== '其他'),
        ...otherLangList
      ]
    }));
  };

  // 移除登入檢查，讓未登入用戶也可以查看和體驗功能

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7faff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 18, color: '#6B5BFF' }}>載入中...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7faff', padding: 0 }}>
      {/* 左上角返回首頁按鈕 */}
      <button onClick={() => navigate('/')} style={{ position: 'absolute', top: 24, left: 24, zIndex: 10, background: '#fff', border: '1.5px solid #6B5BFF', color: '#6B5BFF', borderRadius: 8, padding: '6px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px #0001' }}>← 返回首頁</button>
      
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* 功能按鈕 - 移到白色卡片區外上方 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
          <button 
            onClick={() => navigate('/resume-builder')} 
            style={{ 
              background: '#00CFFF', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: 16, 
              padding: '12px 24px', 
              borderRadius: 10, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px #00CFFF33'
            }}
          >
            📄 生成簡歷
          </button>
          <button 
            onClick={() => navigate('/job-finder')} 
            style={{ 
              background: '#6B5BFF', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: 16, 
              padding: '12px 24px', 
              borderRadius: 10, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px #6B5BFF33'
            }}
          >
            🔍 尋找工作
          </button>
          <button 
            onClick={() => navigate('/resources')} 
            style={{ 
              background: '#FF6B9D', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: 16, 
              padding: '12px 24px', 
              borderRadius: 10, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px #FF6B9D33'
            }}
          >
            📚 探索資源
          </button>
          <button 
            onClick={() => navigate('/success-stories')} 
            style={{ 
              background: '#4CAF50', 
              color: '#fff', 
              fontWeight: 700, 
              fontSize: 16, 
              padding: '12px 24px', 
              borderRadius: 10, 
              border: 'none', 
              cursor: 'pointer',
              boxShadow: '0 2px 8px #4CAF5033'
            }}
          >
            ✨ 成功故事
          </button>
        </div>

        {/* 個人資料卡片 */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ececff', background: '#eee', marginRight: 24 }} />
            ) : (
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: '#6B5BFF', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 'bold', border: '2px solid #ececff', marginRight: 24 }}>
                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#6B5BFF', marginBottom: 8 }}>{profile.displayName || '用戶'}</div>
              <div style={{ fontSize: 16, color: '#888', marginBottom: 8 }}>{profile.email}</div>
              {profile.location && <div style={{ fontSize: 14, color: '#666' }}>📍 {profile.location}</div>}
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {isEditing ? (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={saveProfile} style={{ background: '#00CFFF', color: '#fff', fontWeight: 700, fontSize: 16, padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>儲存</button>
                  <button onClick={() => setIsEditing(false)} style={{ background: '#f0f0f0', color: '#666', fontWeight: 700, fontSize: 16, padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>取消</button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} style={{ background: '#6B5BFF', color: '#fff', fontWeight: 700, fontSize: 16, padding: '8px 24px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>編輯資料</button>
              )}
            </div>
          </div>

          {/* 基本資訊 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 16 }}>基本資訊</h3>
              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    type="text"
                    placeholder="姓名"
                    value={profile.displayName || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  />
                  <input
                    type="text"
                    placeholder="電話"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  />
                  <input
                    type="text"
                    placeholder="所在地"
                    value={profile.location || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn"
                    value={profile.linkedin || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  />
                  <input
                    type="text"
                    placeholder="作品集連結"
                    value={profile.portfolio || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, portfolio: e.target.value }))}
                    style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {profile.phone && <div style={{ fontSize: 14, color: '#666' }}>📞 {profile.phone}</div>}
                  {profile.linkedin && <div style={{ fontSize: 14, color: '#666' }}>💼 <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#6B5BFF' }}>LinkedIn</a></div>}
                  {profile.portfolio && <div style={{ fontSize: 14, color: '#666' }}>🎨 <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: '#6B5BFF' }}>作品集</a></div>}
                </div>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#333', marginBottom: 16 }}>語言能力</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {languageOptions.map(lang => (
                  <button
                    key={lang}
                    onClick={() => isEditing && handleLanguageToggle(lang)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: '1px solid #ddd',
                      background: profile.languages.includes(lang) ? '#6B5BFF' : '#fff',
                      color: profile.languages.includes(lang) ? '#fff' : '#666',
                      fontSize: 12,
                      cursor: isEditing ? 'pointer' : 'default',
                      opacity: isEditing ? 1 : 0.8
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              {/* 其他語言輸入框 */}
              {showOtherLanguages && isEditing && (
                <div style={{ marginTop: 12 }}>
                  <input
                    type="text"
                    placeholder="請輸入其他語言，用逗號分隔（例如：法語,德語,西班牙語）"
                    value={otherLanguages}
                    onChange={(e) => handleOtherLanguagesChange(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      border: 'none', 
                      borderBottom: '2px solid #6B5BFF', 
                      borderRadius: 0, 
                      fontSize: 14,
                      background: 'transparent',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 技能與經驗 */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 24 }}>技能與經驗</h3>
          
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 12 }}>技能專長</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => isEditing && handleSkillToggle(skill)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 16,
                    border: '1px solid #ddd',
                    background: profile.skills.includes(skill) ? '#00CFFF' : '#fff',
                    color: profile.skills.includes(skill) ? '#fff' : '#666',
                    fontSize: 12,
                    cursor: isEditing ? 'pointer' : 'default',
                    opacity: isEditing ? 1 : 0.8
                  }}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 12 }}>工作經驗</h4>
            {isEditing ? (
              <textarea
                placeholder="請描述您的工作經驗..."
                value={profile.experience}
                onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                style={{ width: '100%', minHeight: 100, padding: '12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
              />
            ) : (
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                {profile.experience || '尚未填寫工作經驗'}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 12 }}>教育背景</h4>
            {isEditing ? (
              <textarea
                placeholder="請描述您的教育背景..."
                value={profile.education}
                onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                style={{ width: '100%', minHeight: 80, padding: '12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
              />
            ) : (
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                {profile.education || '尚未填寫教育背景'}
              </div>
            )}
          </div>

          <div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 12 }}>職業目標</h4>
            {isEditing ? (
              <textarea
                placeholder="請描述您的職業目標..."
                value={profile.careerGoals}
                onChange={(e) => setProfile(prev => ({ ...prev, careerGoals: e.target.value }))}
                style={{ width: '100%', minHeight: 80, padding: '12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
              />
            ) : (
              <div style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
                {profile.careerGoals || '尚未設定職業目標'}
  </div>
)}
          </div>
        </div>

        {/* 興趣與偏好 */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 24 }}>興趣與偏好</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {interestOptions.map(interest => (
              <button
                key={interest}
                onClick={() => isEditing && handleInterestToggle(interest)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 16,
                  border: '1px solid #ddd',
                  background: profile.interests.includes(interest) ? '#FF6B9D' : '#fff',
                  color: profile.interests.includes(interest) ? '#fff' : '#666',
                  fontSize: 12,
                  cursor: isEditing ? 'pointer' : 'default',
                  opacity: isEditing ? 1 : 0.8
                }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
} 