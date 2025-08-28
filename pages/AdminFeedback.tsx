import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Feedback {
  id: string;
  content: string;
  userEmail: string;
  userNickname: string;
  userLang: string;
  timestamp: string;
  status: string;
  adminNotes: string;
  source: string;
}

const AdminFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`/api/admin-feedback?adminKey=${adminKey}`);
      setFeedbacks(response.data.feedbacks);
      setLoading(false);
    } catch (error) {
      setError('取得意見列表失敗');
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (adminKey === 'restarter_admin_2024') {
      setIsAuthenticated(true);
      fetchFeedbacks();
    } else {
      setError('管理員密碼錯誤');
    }
  };

  const exportFeedbacks = async () => {
    try {
      const response = await axios.post('/api/admin-feedback/export', { adminKey });
      alert(`意見已匯出，共 ${response.data.totalExported} 條`);
    } catch (error) {
      alert('匯出失敗');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
            管理員登入
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                管理員密碼
              </label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="輸入管理員密碼"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
            >
              登入
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              意見管理系統
            </h1>
            <div className="space-x-4">
              <button
                onClick={fetchFeedbacks}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                重新整理
              </button>
              <button
                onClick={exportFeedbacks}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                匯出意見
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">載入中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                共 {feedbacks.length} 條意見
              </div>
              
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {feedback.userNickname || '匿名用戶'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feedback.userEmail || '未提供 Email'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        {feedback.timestamp}
                      </span>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          feedback.source === 'local' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {feedback.source === 'local' ? '本地儲存' : 'Firebase'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-3 mb-3">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {feedback.content}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>語言: {feedback.userLang}</span>
                    <span>狀態: {feedback.status}</span>
                  </div>
                  
                  {feedback.adminNotes && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-blue-800">
                        <strong>管理員備註:</strong> {feedback.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              
              {feedbacks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  目前沒有意見
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback; 