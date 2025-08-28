import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // 可以發送到錯誤追蹤服務
    // this.logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😔</div>
        <h1 style={{ 
          color: '#6B5BFF', 
          fontSize: '1.5rem', 
          marginBottom: '16px',
          fontWeight: 'bold'
        }}>
          哎呀！出現了一些問題
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1rem', 
          marginBottom: '24px',
          lineHeight: '1.5'
        }}>
          我們正在努力修復這個問題。請稍後再試，或者刷新頁面。
        </p>
        
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #6B5BFF 0%, #23c6e6 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            刷新頁面
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              background: '#fff',
              color: '#6B5BFF',
              border: '2px solid #6B5BFF',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            返回上頁
          </button>
        </div>

        <div style={{ 
          fontSize: '0.9rem', 
          color: '#999',
          borderTop: '1px solid #eee',
          paddingTop: '16px'
        }}>
          <p>如果問題持續存在，請聯繫我們的支援團隊</p>
          <p>錯誤代碼: {error?.name || 'UNKNOWN'}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
