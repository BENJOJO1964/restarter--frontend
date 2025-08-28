import React, { useState, useEffect } from 'react';

interface TestModeButtonProps {
  onTestModeChange: (enabled: boolean) => void;
}

const TestModeButton: React.FC<TestModeButtonProps> = ({ onTestModeChange }) => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // 從 localStorage 讀取測試模式狀態
    const savedTestMode = localStorage.getItem('testMode') === 'true';
    setIsTestMode(savedTestMode);
    onTestModeChange(savedTestMode);
  }, [onTestModeChange]);

  const toggleTestMode = () => {
    const newTestMode = !isTestMode;
    setIsTestMode(newTestMode);
    localStorage.setItem('testMode', newTestMode.toString());
    onTestModeChange(newTestMode);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <button
        onClick={toggleTestMode}
        style={{
          background: isTestMode ? '#ff6b6b' : '#4ecdc4',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          transition: 'all 0.3s ease',
          minWidth: '80px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {isTestMode ? '測試模式 ON' : '測試模式 OFF'}
      </button>
      
      {isTestMode && (
        <div
          style={{
            background: 'rgba(255, 107, 107, 0.9)',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '6px',
            fontSize: '10px',
            textAlign: 'center',
            maxWidth: '120px',
            lineHeight: '1.2'
          }}
        >
          語音功能已解鎖
        </div>
      )}
    </div>
  );
};

export default TestModeButton; 