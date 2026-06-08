import React, { useState, useCallback } from "react";
import { Sparkles, Calendar, Heart } from "lucide-react";
import { CosmicZoom } from "./components/CosmicZoom";
import { MemoryLane } from "./components/MemoryLane";
import { BirthdayCake } from "./components/BirthdayCake";
import { AudioPlayer } from "./components/AudioPlayer";
import "./App.css";

type Phase = "preloader" | "cosmic" | "album" | "climax";

export const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("preloader");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const startJourney = () => {
    setIsMusicPlaying(true);
    setPhase("cosmic");
  };

  const handleCosmicComplete = useCallback(() => {
    setPhase("album");
  }, []);

  const handleAlbumComplete = useCallback(() => {
    setPhase("climax");
  }, []);

  return (
    <div className="app-container">
      {/* Global Audio Controller (Fixed position top right) */}
      {phase !== "preloader" && (
        <AudioPlayer isPlaying={isMusicPlaying} setIsPlaying={setIsMusicPlaying} />
      )}

      {/* PHASE 1: Preloader Screen */}
      {phase === "preloader" && (
        <div className="preloader-screen">
          {/* Parallax space background */}
          <div className="space-bg">
            <div className="nebula"></div>
            <div className="ambient-particles"></div>
          </div>

          <div className="preloader-content fade-in">
            <div className="preloader-card">
              <div className="decor-icon-wrapper">
                <Calendar size={32} className="calendar-icon" />
              </div>

              <span className="celebration-badge">
                <Sparkles size={12} /> Upcoming Milestone
              </span>

              <h1 className="hero-heading">
                <span className="cursive-name">Nargis's</span><br />
                <span className="accent-text">23rd Birthday</span>
              </h1>

              <p className="hero-sub">
                Born on 9th July 2003. Join the universe in celebrating 23 golden cycles around the sun.
              </p>



              {/* Launch Button */}
              <button className="launch-btn pulse-glow" onClick={startJourney}>
                <span className="btn-glow-layer"></span>
                <span className="btn-content">
                  Unveil The Cosmos <Heart size={16} className="btn-heart" />
                </span>
                {/* Button Tap Guide Overlay */}
                <div className="btn-tap-guide">
                  <div className="btn-tap-ring"></div>
                  <div className="btn-tap-hand">👆</div>
                </div>
              </button>
              <span className="button-tap-caption">♫ Tap to activate music box & start journey</span>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: Cosmic Zoom Intro */}
      {phase === "cosmic" && (
        <CosmicZoom onComplete={handleCosmicComplete} />
      )}

      {/* PHASE 3: Memory Lane Album */}
      {phase === "album" && (
        <MemoryLane onComplete={handleAlbumComplete} />
      )}

      {/* PHASE 4: Climax Birthday Celebration */}
      {phase === "climax" && (
        <BirthdayCake />
      )}
    </div>
  );
};

export default App;
