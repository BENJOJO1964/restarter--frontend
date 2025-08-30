import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
  skills: string[];
  languages: string[];
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;
  const lang = localStorage.getItem('lang') || 'zh-TW';
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState('');
  const [resumeFormat, setResumeFormat] = useState('modern');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 簡歷格式選項
  const formatOptions = [
    { value: 'modern', label: '現代簡潔', icon: '🎨' },
    { value: 'professional', label: '專業商務', icon: '💼' },
    { value: 'creative', label: '創意設計', icon: '✨' },
    { value: 'minimal', label: '極簡風格', icon: '📄' }
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
        setResumeData(prev => ({
          ...prev,
          personalInfo: {
            name: userData.displayName || user.displayName || '',
            email: userData.email || user.email || '',
            phone: userData.phone || '',
            location: userData.location || '',
            linkedin: userData.linkedin || '',
            portfolio: userData.portfolio || ''
          },
          skills: userData.skills || [],
          languages: userData.languages || [],
          summary: userData.careerGoals || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateResume = async () => {
    if (!user) return;
    
    setIsGenerating(true);
    
    try {
      // 構建提示詞
      const prompt = `請根據以下用戶資料生成一份${formatOptions.find(f => f.value === resumeFormat)?.label}風格的專業簡歷：

個人資料：
姓名：${resumeData.personalInfo.name}
郵箱：${resumeData.personalInfo.email}
電話：${resumeData.personalInfo.phone}
地點：${resumeData.personalInfo.location}
LinkedIn：${resumeData.personalInfo.linkedin}
作品集：${resumeData.personalInfo.portfolio}

職業目標：${resumeData.summary}

技能：${resumeData.skills.join(', ')}

語言：${resumeData.languages.join(', ')}

工作經驗：${resumeData.experience.map(exp => `${exp.title} at ${exp.company} (${exp.duration}): ${exp.description}`).join('\n')}

教育背景：${resumeData.education.map(edu => `${edu.degree} from ${edu.school} (${edu.year})`).join('\n')}

專案經驗：${resumeData.projects.map(proj => `${proj.name}: ${proj.description} (技術: ${proj.technologies.join(', ')})`).join('\n')}

請生成一份HTML格式的簡歷，使用現代化的CSS樣式，確保內容專業、結構清晰，適合${formatOptions.find(f => f.value === resumeFormat)?.label}風格。`;

      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Mode': 'true' // 啟用測試模式
        },
        body: JSON.stringify({
          userId: user.uid, // 添加用戶ID
          messages: [
            {
              sender: 'user',
              text: prompt
            }
          ],
          system_prompt: '你是一個專業的簡歷撰寫專家，擅長根據用戶資料生成各種風格的專業簡歷。'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedResume(data.reply || '生成簡歷失敗');
      } else {
        throw new Error('生成簡歷失敗');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      setGeneratedResume('生成簡歷時發生錯誤，請稍後再試。');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedResume], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${resumeData.personalInfo.name || 'resume'}-${resumeFormat}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        school: '',
        year: '',
        gpa: ''
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }));
  };

  const updateProject = (index: number, field: string, value: string | string[]) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
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
          }}>AI簡歷生成器</h1>
          <p style={{ 
            fontSize: window.innerWidth <= 768 ? 14 : 16, 
            color: '#666', 
            maxWidth: 600, 
            margin: '0 auto',
            padding: window.innerWidth <= 768 ? '0 16px' : '0'
          }}>
            讓AI幫您創建專業的簡歷，展現您的技能和經驗
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
          gap: window.innerWidth <= 768 ? 16 : 32,
          justifyContent: 'center'
        }}>
          {/* 左側：簡歷資料編輯 */}
          <div style={{ 
            background: '#fff', 
            borderRadius: 18, 
            boxShadow: '0 4px 24px #6B5BFF11', 
            padding: window.innerWidth <= 768 ? '20px' : '32px',
            width: '100%',
            maxWidth: window.innerWidth <= 768 ? '100%' : 'none',
            margin: window.innerWidth <= 768 ? '0 auto' : '0'
          }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 24 }}>簡歷資料</h2>
            
            {/* 個人資料 */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555', marginBottom: 16 }}>個人資料</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
                gap: window.innerWidth <= 768 ? 8 : 12 
              }}>
                <input
                  type="text"
                  placeholder="姓名"
                  value={resumeData.personalInfo.name}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, name: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  type="email"
                  placeholder="郵箱"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, email: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  type="tel"
                  placeholder="電話"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, phone: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  type="text"
                  placeholder="地點"
                  value={resumeData.personalInfo.location}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, location: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  type="url"
                  placeholder="LinkedIn"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, linkedin: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  type="url"
                  placeholder="作品集"
                  value={resumeData.personalInfo.portfolio}
                  onChange={(e) => setResumeData(prev => ({ ...prev, personalInfo: { ...prev.personalInfo, portfolio: e.target.value } }))}
                  style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 6, fontSize: 14 }}
                />
              </div>
            </div>

            {/* 職業摘要 */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555', marginBottom: 16 }}>職業摘要</h3>
              <textarea
                placeholder="請描述您的職業目標和專業摘要..."
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                style={{ width: '100%', minHeight: 80, padding: '12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, resize: 'vertical' }}
              />
            </div>

            {/* 工作經驗 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555' }}>工作經驗</h3>
                <button onClick={addExperience} style={{ background: '#00CFFF', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>+ 添加</button>
              </div>
              {resumeData.experience.map((exp, index) => (
                <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>經驗 #{index + 1}</h4>
                    <button onClick={() => removeExperience(index)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 10, cursor: 'pointer' }}>刪除</button>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
                    gap: window.innerWidth <= 768 ? 6 : 8, 
                    marginBottom: 8 
                  }}>
                    <input
                      type="text"
                      placeholder="職位"
                      value={exp.title}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="公司"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="時間"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                  </div>
                  <textarea
                    placeholder="工作描述..."
                    value={exp.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    style={{ width: '100%', minHeight: 60, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, resize: 'vertical' }}
                  />
                </div>
              ))}
            </div>

            {/* 教育背景 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555' }}>教育背景</h3>
                <button onClick={addEducation} style={{ background: '#00CFFF', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>+ 添加</button>
              </div>
              {resumeData.education.map((edu, index) => (
                <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>教育 #{index + 1}</h4>
                    <button onClick={() => removeEducation(index)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 10, cursor: 'pointer' }}>刪除</button>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', 
                    gap: window.innerWidth <= 768 ? 6 : 8, 
                    marginBottom: 8 
                  }}>
                    <input
                      type="text"
                      placeholder="學位"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="學校"
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="年份"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                    <input
                      type="text"
                      placeholder="GPA (可選)"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 專案經驗 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555' }}>專案經驗</h3>
                <button onClick={addProject} style={{ background: '#00CFFF', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>+ 添加</button>
              </div>
              {resumeData.projects.map((proj, index) => (
                <div key={index} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>專案 #{index + 1}</h4>
                    <button onClick={() => removeProject(index)} style={{ background: '#ff4757', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', fontSize: 10, cursor: 'pointer' }}>刪除</button>
                  </div>
                  <input
                    type="text"
                    placeholder="專案名稱"
                    value={proj.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, marginBottom: 8 }}
                  />
                  <textarea
                    placeholder="專案描述..."
                    value={proj.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    style={{ width: '100%', minHeight: 60, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, resize: 'vertical', marginBottom: 8 }}
                  />
                  <input
                    type="text"
                    placeholder="技術棧 (用逗號分隔)"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, marginBottom: 8 }}
                  />
                  <input
                    type="url"
                    placeholder="專案連結 (可選)"
                    value={proj.link || ''}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12 }}
                  />
                </div>
              ))}
            </div>

            {/* 簡歷格式選擇 */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#555', marginBottom: 16 }}>簡歷格式</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                {formatOptions.map(format => (
                  <button
                    key={format.value}
                    onClick={() => setResumeFormat(format.value)}
                    style={{
                      padding: '12px',
                      border: `2px solid ${resumeFormat === format.value ? '#6B5BFF' : '#ddd'}`,
                      borderRadius: 8,
                      background: resumeFormat === format.value ? '#6B5BFF' : '#fff',
                      color: resumeFormat === format.value ? '#fff' : '#333',
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{format.icon}</div>
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 生成按鈕 */}
            <button
              onClick={generateResume}
              disabled={isGenerating}
              style={{
                width: '100%',
                background: isGenerating ? '#ccc' : '#6B5BFF',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '16px',
                fontSize: 18,
                fontWeight: 700,
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px #6B5BFF33'
              }}
            >
              {isGenerating ? '生成中...' : '🚀 生成簡歷'}
            </button>
          </div>

          {/* 右側：生成結果預覽 */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #6B5BFF11', padding: '32px' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#333', marginBottom: 24 }}>簡歷預覽</h2>
            
            {generatedResume ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <button
                    onClick={downloadResume}
                    style={{
                      background: '#00CFFF',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginRight: 12
                    }}
                  >
                    📥 下載HTML
                  </button>
                  <button
                    onClick={() => setGeneratedResume('')}
                    style={{
                      background: '#f0f0f0',
                      color: '#666',
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 16px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    🔄 重新生成
                  </button>
                </div>
                <div
                  style={{
                    border: '1px solid #eee',
                    borderRadius: 8,
                    padding: 20,
                    maxHeight: 600,
                    overflow: 'auto',
                    background: '#fafafa'
                  }}
                  dangerouslySetInnerHTML={{ __html: generatedResume }}
                />
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📄</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>準備生成簡歷</div>
                <div style={{ fontSize: 14 }}>填寫左側資料後點擊生成按鈕</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
