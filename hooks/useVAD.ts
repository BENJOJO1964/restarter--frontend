import { useState, useRef, useCallback } from 'react';
import { useMicStatus } from '../components/MicStatusContext';

interface VADOptions {
  onSpeechStart?: () => void;
  onSpeechEnd?: (audio: Blob) => void;
  silenceThreshold?: number; // ms
  fftSize?: number;
  minDecibels?: number;
}

export function useVAD({ 
  onSpeechStart, 
  onSpeechEnd, 
  silenceThreshold = 1000, // 1秒停頓自動結束
  fftSize = 256,
  minDecibels = -70
}: VADOptions) {
  const { setMicOn } = useMicStatus();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    analyserRef.current = null;
    setIsListening(false);
    setIsSpeaking(false);
    setMicOn(false); // Turn off mic icon
  }, [setMicOn]);

  const processAudio = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
    
    // A simple energy threshold check
    const energyThreshold = 5; // This may need tuning
    const speaking = average > energyThreshold;

    if (speaking && !isSpeaking) {
      setIsSpeaking(true);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    } else if (!speaking && isSpeaking) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          setIsSpeaking(false);
          stopListening(); // Stop everything when silence is detected
        }, silenceThreshold);
      }
    }

    if (isListening) {
      requestAnimationFrame(processAudio);
    }
  }, [isSpeaking, isListening, silenceThreshold, stopListening]);

  const startListening = useCallback(async () => {
    if (isListening) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = fftSize;
      analyserRef.current.minDecibels = minDecibels;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstart = () => {
        setMicOn(true); // Turn on mic icon
        onSpeechStart?.();
        requestAnimationFrame(processAudio);
      };

      mediaRecorderRef.current.onstop = () => {
        setMicOn(false); // Ensure mic icon is off
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
            onSpeechEnd?.(audioBlob);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsListening(true);

    } catch (error) {
      console.error("Error starting VAD:", error);
      setMicOn(false); // Ensure icon is off on error
    }
  }, [isListening, onSpeechStart, onSpeechEnd, processAudio, fftSize, minDecibels, setMicOn]);

  return { isSpeaking, isListening, startListening, stopListening };
}
