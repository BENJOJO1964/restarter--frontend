import React, { useRef, useState } from 'react';

export interface VirtualAvatarProps {
  avatar: string; // Can be 'male', 'female', or a URL to a custom avatar
  videoUrl?: string; // 嘴型動畫影片
  audioUrl?: string; // TTS 語音
  isSpeaking?: boolean;
  onAvatarChange?: (avatar: 'male' | 'female') => void;
  size?: number; // 頭像尺寸，預設 160
}

const AVATAR_IMG = {
  male: '/avatars/male.png',
  female: '/avatars/female.png',
};

export default function VirtualAvatar({ avatar, videoUrl, audioUrl, isSpeaking, onAvatarChange, size = 160 }: VirtualAvatarProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setPlaying(true);
    }
  };
  const handleEnded = () => setPlaying(false);

  const getAvatarSrc = () => {
    if (avatar === 'male' || avatar === 'female') {
      return AVATAR_IMG[avatar];
    }
    return avatar; // Assume it's a URL
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
      <div style={{ position: 'relative', width: size, height: size, marginBottom: 8 }}>
        {videoUrl ? (
          <video src={videoUrl} width={size} height={size} autoPlay muted loop style={{ borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <img src={getAvatarSrc()} width={size} height={size} style={{ borderRadius: '50%', objectFit: 'cover', filter: isSpeaking ? 'brightness(1.1)' : 'none' }} alt="avatar" />
        )}
        {onAvatarChange && (avatar === 'male' || avatar === 'female') && (
            <button onClick={() => onAvatarChange(avatar === 'male' ? 'female' : 'male')} style={{ position: 'absolute', right: 8, bottom: 8, background: '#fff', borderRadius: '50%', border: 'none', width: 36, height: 36, cursor: 'pointer', fontSize: 18 }}>切換</button>
        )}
      </div>
      {audioUrl && (
        <audio ref={audioRef} src={audioUrl} onEnded={handleEnded} />
      )}
      {audioUrl && (
        <button onClick={handlePlay} style={{ padding: '6px 18px', borderRadius: 8, background: '#6c63ff', color: '#fff', border: 'none', fontWeight: 700, fontSize: 16, marginTop: 8 }} disabled={playing}>
          {playing ? '播放中...' : '播放語音'}
        </button>
      )}
    </div>
  );
} 