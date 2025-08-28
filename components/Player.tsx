import React, { useRef } from 'react';

export default function Player({ audio }: { audio: Blob|null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  if (!audio) return null;
  const url = URL.createObjectURL(audio);
  return (
    <div>
      <audio ref={audioRef} src={url} controls />
    </div>
  );
}
