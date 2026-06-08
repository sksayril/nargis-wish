import React, { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import "./AudioPlayer.css";

// Frequency map for notes
const NOTES: { [key: string]: number } = {
  C3: 130.81,
  F3: 174.61,
  G3: 196.00,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
};

// Happy Birthday melody notes and durations (in beats)
const MELODY = [
  { note: "C4", duration: 0.5, delay: 0 },
  { note: "C4", duration: 0.5, delay: 0.5 },
  { note: "D4", duration: 1.0, delay: 1.0 },
  { note: "C4", duration: 1.0, delay: 2.0 },
  { note: "F4", duration: 1.0, delay: 3.0 },
  { note: "E4", duration: 2.0, delay: 4.0 },

  { note: "C4", duration: 0.5, delay: 6.5 },
  { note: "C4", duration: 0.5, delay: 7.0 },
  { note: "D4", duration: 1.0, delay: 7.5 },
  { note: "C4", duration: 1.0, delay: 8.5 },
  { note: "G4", duration: 1.0, delay: 9.5 },
  { note: "F4", duration: 2.0, delay: 10.5 },

  { note: "C4", duration: 0.5, delay: 13.0 },
  { note: "C4", duration: 0.5, delay: 13.5 },
  { note: "C5", duration: 1.0, delay: 14.0 },
  { note: "A4", duration: 1.0, delay: 15.0 },
  { note: "F4", duration: 1.0, delay: 16.0 },
  { note: "E4", duration: 1.0, delay: 17.0 },
  { note: "D4", duration: 2.0, delay: 18.0 },

  { note: "Bb4", duration: 0.5, delay: 20.5 },
  { note: "Bb4", duration: 0.5, delay: 21.0 },
  { note: "A4", duration: 1.0, delay: 21.5 },
  { note: "F4", duration: 1.0, delay: 22.5 },
  { note: "G4", duration: 1.0, delay: 23.5 },
  { note: "F4", duration: 2.5, delay: 24.5 },
];

// Accompaniment bass line notes to play on measure starts
const BASS = [
  { note: "C3", delay: 0 },
  { note: "C3", delay: 3 },
  { note: "G3", delay: 6.5 },
  { note: "C3", delay: 9.5 },
  { note: "C3", delay: 13 },
  { note: "F3", delay: 16 },
  { note: "G3", delay: 20.5 },
  { note: "C3", delay: 23.5 },
];

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, setIsPlaying }) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loopTimeoutRef = useRef<number | null>(null);
  const scheduledNodesRef = useRef<AudioNode[]>([]);
  const tempo = 120; // Beats per minute
  const beatDuration = 60 / tempo; // Duration of one beat in seconds
  const totalSongBeats = 28; // Total beats before repeating

  const playChime = (ctx: AudioContext, freq: number, startTime: number, duration: number, isBass = false) => {
    if (!freq) return;

    // Create oscillator
    const osc = ctx.createOscillator();
    // Triangle wave gives a soft, warm music box feel
    osc.type = isBass ? "sine" : "triangle";
    osc.frequency.value = freq;

    // Create gain node for volume envelope
    const gain = ctx.createGain();
    
    // Music Box pluck envelope
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(isBass ? 0.25 : 0.15, startTime + 0.01); // Attack
    gain.gain.exponentialRampToValueAtTime(0.005, startTime + duration); // Decay & Sustain

    // Lowpass filter to soften the chime
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = isBass ? 300 : 1200;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    // Keep track of active nodes so we can cancel them on mute
    scheduledNodesRef.current.push(osc, gain, filter);

    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const scheduleSong = (ctx: AudioContext, startOffset: number) => {
    const songDurationInSeconds = totalSongBeats * beatDuration;

    // Schedule melody
    MELODY.forEach((item) => {
      const noteFreq = NOTES[item.note];
      const noteStart = startOffset + item.delay * beatDuration;
      const noteDur = item.duration * beatDuration * 1.5; // Let notes ring out a bit
      playChime(ctx, noteFreq, noteStart, noteDur, false);
    });

    // Schedule bass accompaniment
    BASS.forEach((item) => {
      const bassFreq = NOTES[item.note];
      const bassStart = startOffset + item.delay * beatDuration;
      const bassDur = 2.5 * beatDuration; // long bass notes
      playChime(ctx, bassFreq, bassStart, bassDur, true);
    });

    // Schedule loop
    loopTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying && audioCtxRef.current) {
        scheduleSong(audioCtxRef.current, audioCtxRef.current.currentTime);
      }
    }, songDurationInSeconds * 1000);
  };

  const stopSong = () => {
    // Clear loop timer
    if (loopTimeoutRef.current) {
      clearTimeout(loopTimeoutRef.current);
      loopTimeoutRef.current = null;
    }
    // Cancel/disconnect all scheduled nodes
    scheduledNodesRef.current.forEach((node) => {
      try {
        if ("stop" in node) {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch (e) {
        // Node might have already finished playing
      }
    });
    scheduledNodesRef.current = [];
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSong();
      setIsPlaying(false);
    } else {
      initAudio();
      if (audioCtxRef.current) {
        setIsPlaying(true);
        scheduleSong(audioCtxRef.current, audioCtxRef.current.currentTime + 0.1);
      }
    }
  };

  // Listen to external isPlaying trigger (e.g. from parent component starting the app)
  useEffect(() => {
    if (isPlaying) {
      initAudio();
      if (audioCtxRef.current && scheduledNodesRef.current.length === 0) {
        scheduleSong(audioCtxRef.current, audioCtxRef.current.currentTime + 0.1);
      }
    } else {
      stopSong();
    }

    return () => stopSong();
  }, [isPlaying]);

  return (
    <button className={`music-toggle ${isPlaying ? "playing" : "muted"}`} onClick={togglePlayback} aria-label="Toggle Music">
      {isPlaying ? <Volume2 size={20} className="glow-icon" /> : <VolumeX size={20} />}
      <span className="tooltip">{isPlaying ? "Mute Music" : "Play Music"}</span>
    </button>
  );
};
