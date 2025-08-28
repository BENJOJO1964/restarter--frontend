import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VideoIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [hasWatched, setHasWatched] = useState(false);

  useEffect(() => {
    // 檢查是否已經看過視頻
    const watched = localStorage.getItem('restarter-video-watched');
    if (watched === 'true') {
      navigate('/home');
      return;
    }

    // 設置視頻事件監聽
    const video = videoRef.current;
    if (video) {
      const handleVideoEnd = () => {
        localStorage.setItem('restarter-video-watched', 'true');
        setHasWatched(true);
        navigate('/home');
      };

      const handleVideoError = () => {
        // 如果視頻加載失敗，直接跳轉到首頁
        localStorage.setItem('restarter-video-watched', 'true');
        navigate('/home');
      };

      video.addEventListener('ended', handleVideoEnd);
      video.addEventListener('error', handleVideoError);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
        video.removeEventListener('error', handleVideoError);
      };
    }
  }, [navigate]);

  // 如果已經看過視頻，不渲染任何內容
  if (hasWatched) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <video
        ref={videoRef}
        src="/videos/Restarter-cn.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
        autoPlay
        muted
        playsInline
        controls={false}
      />
    </div>
  );
} 