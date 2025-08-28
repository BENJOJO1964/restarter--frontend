import React, { createContext, useContext, useState, ReactNode } from 'react';
import VideoReactionPlayer, { VideoReactionType } from './VideoReactionPlayer';

interface VideoReactionContextProps {
  setVideoReaction: (type: VideoReactionType|null) => void;
}

const VideoReactionContext = createContext<VideoReactionContextProps>({ setVideoReaction: () => {} });

export function useVideoReaction() {
  return useContext(VideoReactionContext);
}

export function VideoReactionProvider({ children }: { children: ReactNode }) {
  const [videoReaction, setVideoReaction] = useState<VideoReactionType|null>(null);
  return (
    <VideoReactionContext.Provider value={{ setVideoReaction }}>
      {children}
      {videoReaction && (
        <VideoReactionPlayer
          reactionType={videoReaction}
          onEnd={() => setVideoReaction(null)}
        />
      )}
    </VideoReactionContext.Provider>
  );
} 