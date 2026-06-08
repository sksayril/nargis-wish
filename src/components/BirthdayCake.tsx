import React, { useState, useEffect, useRef } from "react";
import "./BirthdayCake.css";

// Interface for balloon objects in the mini-game
interface Balloon {
  id: number;
  x: number; // Percentage from left (0 - 90)
  speed: number; // Speed of floating up
  color: string; // Tailwind-like color palette hex
  size: number; // Diameter in pixels
  bottom: number; // Position from bottom (starts at -100)
}

// Interface for custom falling confetti pieces
interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
}

const BALLOON_COLORS = [
  "#ec4899", // Pink
  "#a855f7", // Purple
  "#3b82f6", // Blue
  "#f43f5e", // Rose
  "#eab308", // Yellow / Gold
  "#06b6d4", // Cyan
];

// CONFETTI SUB-COMPONENT
const Confetti: React.FC = () => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    // Spawn 80 colorful falling paper scraps
    const initialParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % width
      y: -10 - Math.random() * 30, // start above viewport
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      size: Math.random() * 6 + 6, // 6px to 12px
      speedY: Math.random() * 2 + 2, // speed of falling
      speedX: Math.random() * 1.5 - 0.75, // sway speed
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 5 - 2.5,
    }));
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    let frameId: number;
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            y: p.y + p.speedY,
            x: p.x + p.speedX + Math.sin(p.y / 15) * 0.2, // wind sway
            rotation: p.rotation + p.rotationSpeed,
          }))
          .filter((p) => p.y < 110) // keep within screen bounds
      );
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [particles.length]);

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size * (p.id % 2 === 0 ? 1.4 : 0.7)}px`,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: p.id % 3 === 0 ? "50%" : "1px",
          }}
        />
      ))}
    </div>
  );
};

// MAIN BIRTHDAY CAKE COMPONENT
export const BirthdayCake: React.FC = () => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [showCelebrationOverlay, setShowCelebrationOverlay] = useState(false);
  const [poppedCount, setPoppedCount] = useState(0);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const cakeRef = useRef<HTMLDivElement>(null);

  // Microphone detection for blowing candles
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let javascriptNode: ScriptProcessorNode | null = null;
    let stream: MediaStream | null = null;

    const startMicDetection = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContext = new AudioContextClass();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 512;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
          if (!candlesLit) return;
          const array = new Uint8Array(analyser!.frequencyBinCount);
          analyser!.getByteFrequencyData(array);
          let values = 0;
          for (let i = 0; i < array.length; i++) {
            values += array[i];
          }
          const average = values / array.length;
          // Average volume threshold
          if (average > 45) {
            setCandlesLit(false);
            stopMic();
          }
        };
      } catch (e) {
        console.log("Mic detection fallback to tap-to-blow");
      }
    };

    const stopMic = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (javascriptNode) javascriptNode.disconnect();
      if (microphone) microphone.disconnect();
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close();
      }
    };

    if (candlesLit) {
      startMicDetection();
    }

    return () => {
      stopMic();
    };
  }, [candlesLit]);

  // Balloon Spawn Logic (Only after cake is cut)
  useEffect(() => {
    if (!isCakeCut) return;

    // Initial batch
    const initialBalloons = Array.from({ length: 6 }).map((_, i) => createBalloon(i));
    setBalloons(initialBalloons);

    // Spawn loop
    let idCounter = 6;
    const interval = setInterval(() => {
      setBalloons((prev) => {
        const active = prev.filter((b) => b.bottom < 110);
        return [...active, createBalloon(idCounter++)];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isCakeCut]);

  // Balloon physics loop (floating upwards)
  useEffect(() => {
    if (balloons.length === 0) return;

    let frameId: number;
    const animate = () => {
      setBalloons((prev) =>
        prev.map((b) => ({
          ...b,
          bottom: b.bottom + b.speed,
        }))
      );
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [balloons.length]);

  const createBalloon = (id: number): Balloon => {
    return {
      id,
      x: Math.random() * 85 + 5, // 5% to 90%
      speed: Math.random() * 0.4 + 0.35,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      size: Math.random() * 20 + 40,
      bottom: -15,
    };
  };

  const handlePopBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setPoppedCount((prev) => prev + 1);
    playPopSound();
  };

  const playPopSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Drag/Swipe cake slicing handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (candlesLit || isCakeCut) return;
    const touch = e.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipeStartRef.current || candlesLit || isCakeCut) return;
    const touch = e.touches[0];
    const dx = touch.clientX - swipeStartRef.current.x;
    if (Math.abs(dx) > 80) {
      triggerCakeCut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (candlesLit || isCakeCut) return;
    swipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swipeStartRef.current || candlesLit || isCakeCut) return;
    const dx = e.clientX - swipeStartRef.current.x;
    if (Math.abs(dx) > 80) {
      triggerCakeCut();
    }
  };

  const handleMouseUp = () => {
    swipeStartRef.current = null;
  };

  const triggerCakeCut = () => {
    setIsCakeCut(true);
    setShowCelebrationOverlay(true);
    swipeStartRef.current = null;
    playSliceSound();
  };

  const playSliceSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  return (
    <div className="climax-container">
      {/* Confetti Explosion (upon cutting cake) */}
      {isCakeCut && <Confetti />}

      {/* Full-Screen Climax Party Overlay */}
      {showCelebrationOverlay && (
        <div className="celebration-overlay" onClick={() => setShowCelebrationOverlay(false)}>
          <div className="celebration-content">
            <div className="firework fw-1"></div>
            <div className="firework fw-2"></div>
            <div className="firework fw-3"></div>
            <div className="party-emoji-rain"></div>
            <div className="birthday-popup-card" onClick={(e) => e.stopPropagation()}>
              <div className="popup-crown">👑</div>
              <h1 className="popup-name-title">
                Happy Birthday<br />
                <span className="name-highlight">Nargis (Pupu)</span>
              </h1>
              <p className="popup-subtext">Wishing you a year filled with magic and smiles!</p>
              <button className="popup-close-btn" onClick={() => setShowCelebrationOverlay(false)}>
                💖 View Greeting Card & Balloons
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balloon Popping Layer */}
      {isCakeCut && (
        <div className="balloon-layer">
          {balloons.map((b) => (
            <div
              key={b.id}
              className="balloon"
              onClick={() => handlePopBalloon(b.id)}
              style={{
                left: `${b.x}%`,
                bottom: `${b.bottom}%`,
                backgroundColor: b.color,
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                boxShadow: `inset -8px -8px 0 rgba(0,0,0,0.15), 0 10px 20px rgba(0,0,0,0.15)`,
              }}
            >
              <div className="balloon-string"></div>
              <div className="balloon-reflection"></div>
            </div>
          ))}
          <div className="balloon-counter">🎈 Popped: {poppedCount}</div>
        </div>
      )}

      {/* Main Glassmorphic Wishes Card */}
      <div className="wishes-card fade-in">
        <div className="wishes-header">
          <div className="age-tag">23 Years</div>
          <h1 className="birthday-title">Happy Birthday, Nargis! 🎂</h1>
          <p className="birthdate">July 9, 2003 • 2026</p>
        </div>

        {/* Celebratory Banner (Only displays once cake is cut) */}
        {isCakeCut && (
          <div className="congrats-banner fade-in">
            <h2 className="congrats-text">Congratulations! You are 23! 🎉🌟</h2>
            <p className="congrats-sub">May this milestone year bring you infinite joy and success!</p>
          </div>
        )}

        {/* Interactive Cake Segment */}
        <div
          className="cake-stage"
          ref={cakeRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {candlesLit && (
            <div className="instruction-toast">
              🎙️ Blow into mic or TAP candles to extinguish!
            </div>
          )}
          {!candlesLit && !isCakeCut && (
            <div className="instruction-toast slice-prompt">
              ↔️ Swipe across the cake to slice it!
            </div>
          )}
          {isCakeCut && (
            <div className="instruction-toast pop-prompt">
              🎈 Pop the floating balloons!
            </div>
          )}

          {/* Swipe Tutorial Hand Overlay (appears when candles blown out, before slicing) */}
          {!candlesLit && !isCakeCut && (
            <div className="swipe-tutorial">
              <div className="swipe-hand">👉</div>
              <div className="swipe-line"></div>
              <span className="swipe-text">Swipe to Cut</span>
            </div>
          )}

          {/* 3D CSS Cake */}
          <div className={`cake-wrapper ${isCakeCut ? "sliced" : ""}`}>
            {!isCakeCut ? (
              /* UNIFIED CAKE (Renders as a single solid cylinder with no split seam line) */
              <div className="cake-inner unified">
                <div className="cake-top">
                  {/* Frosting dollops */}
                  <div className="dollop dollop-1"></div>
                  <div className="dollop dollop-2"></div>
                  <div className="dollop dollop-3"></div>
                  <div className="dollop dollop-4"></div>
                  <div className="dollop dollop-5"></div>
                  
                  {/* Colorful Sprinkles */}
                  <div className="sprinkle sp-1"></div>
                  <div className="sprinkle sp-2"></div>
                  <div className="sprinkle sp-3"></div>
                  <div className="sprinkle sp-4"></div>
                  <div className="sprinkle sp-5"></div>
                  <div className="sprinkle sp-6"></div>
                </div>
                <div className="cake-side">
                  {/* Strawberry frosting drips */}
                  <div className="cake-drips">
                    <div className="drip drip-1"></div>
                    <div className="drip drip-2"></div>
                    <div className="drip drip-3"></div>
                    <div className="drip drip-4"></div>
                  </div>
                </div>

                {/* Candles sitting on uncut cake */}
                {[1, 2, 3].map((num) => (
                  <div
                    key={num}
                    className={`candle candle-${num} ${!candlesLit ? "blown" : ""}`}
                    onClick={() => candlesLit && setCandlesLit(false)}
                  >
                    {candlesLit && (
                      <div className="flame-container">
                        <div className="flame-core"></div>
                        <div className="flame-aura"></div>
                      </div>
                    )}
                    <div className="candle-wick"></div>
                    <div className="candle-stick"></div>
                  </div>
                ))}

                {/* Tap Tutorial Overlay */}
                {candlesLit && (
                  <div className="tap-tutorial">
                    <div className="tap-indicator tap-1">
                      <div className="tap-ring"></div>
                      <div className="tap-hand">👆</div>
                    </div>
                    <div className="tap-indicator tap-2">
                      <div className="tap-ring"></div>
                      <div className="tap-hand">👆</div>
                    </div>
                    <div className="tap-indicator tap-3">
                      <div className="tap-ring"></div>
                      <div className="tap-hand">👆</div>
                    </div>
                    <span className="tap-text">Tap to Blow</span>
                  </div>
                )}
              </div>
            ) : (
              /* SLICED CAKE halves (split symmetrically via clip-paths, candles move with segments) */
              <>
                {/* Left Sliced Half */}
                <div className="cake-half cake-left-half">
                  <div className="cake-inner">
                    <div className="cake-top">
                      <div className="dollop dollop-1"></div>
                      <div className="dollop dollop-2"></div>
                      <div className="dollop dollop-5"></div>
                      <div className="sprinkle sp-1"></div>
                      <div className="sprinkle sp-2"></div>
                      <div className="sprinkle sp-5"></div>
                    </div>
                    <div className="cake-side">
                      <div className="cake-drips">
                        <div className="drip drip-1"></div>
                        <div className="drip drip-2"></div>
                      </div>
                    </div>

                    {/* Left side candles (stay blown out) */}
                    <div className="candle candle-1 blown">
                      <div className="candle-wick"></div>
                      <div className="candle-stick"></div>
                    </div>
                    <div className="candle candle-2 blown">
                      <div className="candle-wick"></div>
                      <div className="candle-stick"></div>
                    </div>
                  </div>
                </div>

                {/* Right Sliced Half */}
                <div className="cake-half cake-right-half">
                  <div className="cake-inner">
                    <div className="cake-top">
                      <div className="dollop dollop-3"></div>
                      <div className="dollop dollop-4"></div>
                      <div className="sprinkle sp-3"></div>
                      <div className="sprinkle sp-4"></div>
                      <div className="sprinkle sp-6"></div>
                    </div>
                    <div className="cake-side">
                      <div className="cake-drips">
                        <div className="drip drip-3"></div>
                        <div className="drip drip-4"></div>
                      </div>
                    </div>

                    {/* Right side candle (stays blown out) */}
                    <div className="candle candle-3 blown">
                      <div className="candle-wick"></div>
                      <div className="candle-stick"></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Symmetrical non-cut Plate */}
            <div className="cake-plate"></div>
          </div>
        </div>

        {/* Elegant Birthday Letter Card */}
        <div className="card-preview permanent-card">
          <div className="preview-decor top-decor">🌸</div>
          <p className="preview-greeting">
            "Dearest Nargis, on this special day, as you complete 23 beautiful years of life, may your path be brightened with endless joy, love, and laughter. You bring so much warmth and happiness to everyone around you. May this new chapter bring all your dreams to life!"
          </p>
          <div className="preview-sender">— With Love & Blessings 💖</div>
          <div className="preview-decor bottom-decor">🌸</div>
        </div>
      </div>
    </div>
  );
};
