"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface AudioPlayerProps {
  started: boolean;
  musicSrc: string;
  volume?: number;
}

interface FallbackSynth {
  ac: AudioContext;
  master: GainNode;
  timer: NodeJS.Timeout;
}

export function AudioPlayer({
  started,
  musicSrc,
  volume = 0.85,
}: AudioPlayerProps) {
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<FallbackSynth | null>(null);
  const useFallbackRef = useRef(false);

  // Fallback synthesizer with Web Audio API jika file audio tidak dapat diputar
  const startFallback = useCallback(() => {
    if (synthRef.current) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      const ac = new AudioContextClass();
      const master = ac.createGain();
      master.gain.value = muted ? 0 : 0.5;
      master.connect(ac.destination);

      const chords = [
        [220, 261.6, 329.6],
        [174.6, 220, 261.6],
        [261.6, 329.6, 392],
        [196, 246.9, 293.7],
      ];
      const mel = [659.3, 587.3, 523.3, 587.3, 659.3, 784, 659.3, 523.3];
      let step = 0;
      let next = ac.currentTime + 0.1;

      const note = (
        f: number,
        t: number,
        d: number,
        type: OscillatorType,
        g: number
      ) => {
        const o = ac.createOscillator();
        const v = ac.createGain();
        o.type = type;
        o.frequency.value = f;
        v.gain.setValueAtTime(0, t);
        v.gain.linearRampToValueAtTime(g, t + 0.03);
        v.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(v);
        v.connect(master);
        o.start(t);
        o.stop(t + d + 0.05);
      };

      const timer = setInterval(() => {
        while (next < ac.currentTime + 0.6) {
          const bar = Math.floor(step / 8) % chords.length;
          if (step % 8 === 0) {
            chords[bar].forEach((f) => note(f / 2, next, 3.6, "sine", 0.09));
          }
          note(
            mel[step % 8] * (bar % 2 ? 0.75 : 1),
            next,
            1.1,
            "triangle",
            0.07
          );
          next += 0.55;
          step++;
        }
      }, 150);

      synthRef.current = { ac, master, timer };
    } catch {
      // AudioContext failure safely handled
    }
  }, [muted]);

  // Fade-in volume halus
  const fadeTo = useCallback((targetVol: number, ms = 2500) => {
    const audio = audioRef.current;
    if (!audio) return;
    const from = audio.volume;
    const t0 = performance.now();

    const step = (now: number) => {
      const k = Math.min((now - t0) / ms, 1);
      audio.volume = from + (targetVol - from) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  // Mulai memutar musik saat hadiah dibuka
  useEffect(() => {
    if (!started) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    const playPromise = audio.play();

    const onAudioError = () => {
      useFallbackRef.current = true;
      startFallback();
    };

    if (playPromise) {
      playPromise
        .then(() => {
          fadeTo(volume);
        })
        .catch(() => {
          onAudioError();
        });
    }

    audio.addEventListener("error", onAudioError, { once: true });

    const timeout = setTimeout(() => {
      if (audio.readyState === 0 && !useFallbackRef.current) {
        onAudioError();
      }
    }, 2500);

    return () => {
      clearTimeout(timeout);
      audio.removeEventListener("error", onAudioError);
    };
  }, [started, volume, fadeTo, startFallback]);

  // Handle visibility change (pause saat tab diminimalkan/pindah tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      const synth = synthRef.current;

      if (document.hidden) {
        if (audio) audio.pause();
        if (synth && synth.ac.state === "running") synth.ac.suspend();
      } else if (started && !muted) {
        if (!useFallbackRef.current && audio) {
          audio.play().catch(() => {});
        }
        if (synth && synth.ac.state === "suspended") {
          synth.ac.resume();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [started, muted]);

  // Toggle Mute
  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);

    if (audioRef.current) {
      audioRef.current.muted = newMuted;
    }
    if (synthRef.current) {
      synthRef.current.master.gain.value = newMuted ? 0 : 0.5;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        clearInterval(synthRef.current.timer);
        synthRef.current.ac.close().catch(() => {});
      }
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        preload="auto"
        playsInline
      />

      {started && (
        <button
          className="sound"
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Nyalakan musik" : "Matikan musik"}
        >
          <span>{muted ? "🔇" : "🔊"}</span>
        </button>
      )}
    </>
  );
}
