import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const scheduledRef = useRef(false);

  const stopMusic = useCallback(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime ?? 0);
    }
    scheduledRef.current = false;
  }, []);

  const startMusic = useCallback(() => {
    if (scheduledRef.current) return;

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.07;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Minecraft-ish ambient melody (C major pentatonic)
      const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 261.63, 220.0];
      const noteDuration = 0.9;
      const loopDuration = notes.length * noteDuration;
      const totalLoops = 20;

      for (let loop = 0; loop < totalLoops; loop++) {
        notes.forEach((freq, i) => {
          const startTime = ctx.currentTime + loop * loopDuration + i * noteDuration;

          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = freq;

          noteGain.gain.setValueAtTime(0, startTime);
          noteGain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
          noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + noteDuration * 0.85);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(startTime);
          osc.stop(startTime + noteDuration);
        });
      }

      scheduledRef.current = true;
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        stopMusic();
      } else {
        startMusic();
      }
      return next;
    });
  }, [startMusic, stopMusic]);

  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
    };
  }, []);

  return { isMuted, toggleMute };
}
