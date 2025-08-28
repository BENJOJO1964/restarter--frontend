import React, { useEffect, useRef } from 'react';

// 影片對應 Sora prompt 的 URL 映射（可根據實際影片路徑調整）
const VIDEO_MAP: Record<string, string> = {
  encouragement: '/videos/encouragement.mp4',
  reproach: '/videos/reproach.mp4',
  motivation: '/videos/motivation.mp4',
  disappointment: '/videos/disappointment.mp4',
  joy: '/videos/joy.mp4',
  lost: '/videos/lost.mp4',
  breakthrough: '/videos/breakthrough.mp4',
  clarity: '/videos/clarity.mp4',
  reluctance: '/videos/reluctance.mp4',
  confusion: '/videos/confusion.mp4',
  affection: '/videos/affection.mp4',
  regret: '/videos/regret.mp4',
  admiration: '/videos/admiration.mp4',
  teasing: '/videos/teasing.mp4',
};

export type VideoReactionType = keyof typeof VIDEO_MAP;

export default function VideoReactionPlayer({
  reactionType,
  onEnd,
  style,
  className = '',
  autoPlay = true,
  ...rest
}: {
  reactionType: VideoReactionType;
  onEnd?: () => void;
  style?: React.CSSProperties;
  className?: string;
  autoPlay?: boolean;
  [k: string]: any;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [reactionType, autoPlay]);
  return (
    <div
      className={`video-reaction-player ${className}`}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 3000,
        background: 'rgba(0,0,0,0.32)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      {...rest}
    >
      <video
        ref={videoRef}
        src={VIDEO_MAP[reactionType]}
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          borderRadius: 18,
          boxShadow: '0 8px 32px #0008',
          background: '#000',
        }}
        autoPlay={autoPlay}
        onEnded={onEnd}
        controls={false}
        playsInline
      />
    </div>
  );
} 