import React, { useEffect, useState } from "react";
import "./CosmicZoom.css";

interface CosmicZoomProps {
  onComplete: () => void;
}

const steps = [
  {
    id: "universe",
    title: "The Universe",
    subtitle: "In the infinite canvas of the cosmos...",
    duration: 3500,
  },
  {
    id: "galaxy",
    title: "Milky Way Galaxy",
    subtitle: "Among billions of swirling stars...",
    duration: 3500,
  },
  {
    id: "solarsystem",
    title: "The Solar System",
    subtitle: "Steering towards a warm, bright sun...",
    duration: 3500,
  },
  {
    id: "earth",
    title: "Planet Earth",
    subtitle: "A beautiful blue harbor of life...",
    duration: 3500,
  },
  {
    id: "india",
    title: "India",
    subtitle: "Descending into a vibrant land of dreams...",
    duration: 3500,
  },
  {
    id: "westbengal",
    title: "Khanyan, West Bengal",
    subtitle: "Descending to the very home where Nargis grew up...",
    duration: 3500,
  },
  {
    id: "portal",
    title: "9th July 2003",
    subtitle: "The universe welcomed Nargis! ✨",
    duration: 3000,
  },
];

export const CosmicZoom: React.FC<CosmicZoomProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete();
      return;
    }

    const duration = steps[currentStep].duration;
    const zoomStartOffset = duration - 800;

    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, zoomStartOffset);

    const nextStepTimer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsZooming(false);
    }, duration);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(nextStepTimer);
    };
  }, [currentStep, onComplete]);

  if (currentStep >= steps.length) return null;

  const step = steps[currentStep];

  return (
    <div className={`cosmic-container ${isZooming ? "zooming" : ""}`}>
      {/* Background Starfield */}
      <div className="starfield">
        <div className="stars stars-small"></div>
        <div className="stars stars-medium"></div>
        <div className="stars stars-large"></div>
      </div>

      {/* Cosmic Viewport */}
      <div className="cosmic-viewport">
        {step.id === "universe" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 100 100" className="cosmic-svg">
              <defs>
                <radialGradient id="space-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.35)" />
                  <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="nebula-purple" cx="35%" cy="45%" r="35%">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.4)" />
                  <stop offset="60%" stopColor="rgba(139, 92, 246, 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <radialGradient id="nebula-pink" cx="65%" cy="55%" r="35%">
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 0.35)" />
                  <stop offset="60%" stopColor="rgba(244, 63, 94, 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              {/* Nebula clouds */}
              <circle cx="50" cy="50" r="48" fill="url(#space-glow)" />
              <circle cx="35" cy="45" r="35" fill="url(#nebula-purple)" />
              <circle cx="65" cy="55" r="35" fill="url(#nebula-pink)" />
              
              {/* Stars & Star clusters */}
              <circle cx="20" cy="30" r="1.5" className="pulse-slow" fill="#fff" opacity="0.8" />
              <circle cx="80" cy="25" r="1.2" className="pulse-fast" fill="#fff" opacity="0.9" />
              <circle cx="25" cy="75" r="1" className="pulse-slow" fill="#fff" opacity="0.6" />
              <circle cx="75" cy="70" r="1.8" className="pulse-fast" fill="#fff" opacity="0.8" />
              <circle cx="50" cy="35" r="1" className="pulse-slow" fill="#fff" opacity="0.7" />
              <circle cx="45" cy="65" r="1.5" className="pulse-fast" fill="#fff" opacity="0.85" />
              
              {/* Tiny glowing galaxy disks */}
              <ellipse cx="30" cy="55" rx="4" ry="1.5" fill="rgba(255,255,255,0.7)" transform="rotate(-15 30 55)" className="pulse-slow" />
              <ellipse cx="68" cy="40" rx="3" ry="1" fill="rgba(255,255,255,0.6)" transform="rotate(25 68 40)" className="pulse-fast" />
              
              {/* Deep space dust particles */}
              <circle cx="40" cy="20" r="0.5" fill="#fff" opacity="0.5" />
              <circle cx="60" cy="80" r="0.6" fill="#fff" opacity="0.4" />
              <circle cx="15" cy="60" r="0.5" fill="#fff" opacity="0.6" />
              <circle cx="85" cy="50" r="0.7" fill="#fff" opacity="0.5" />
            </svg>
          </div>
        )}

        {step.id === "galaxy" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 100 100" className="cosmic-svg rotating-galaxy">
              <defs>
                <radialGradient id="galaxy-core" cx="50%" cy="50%" r="40%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#ec4899" />
                  <stop offset="70%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="40" fill="url(#galaxy-core)" />
              {/* Spiral arms */}
              <path d="M50 50 Q60 35 80 40 T90 60" fill="none" stroke="rgba(236, 72, 153, 0.6)" strokeWidth="2" strokeLinecap="round" />
              <path d="M50 50 Q40 65 20 60 T10 40" fill="none" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" strokeLinecap="round" />
              <path d="M50 50 Q65 60 70 80 T50 90" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M50 50 Q35 40 30 20 T50 10" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1.5" strokeLinecap="round" />
              {/* Stars in spiral */}
              <circle cx="65" cy="40" r="0.8" fill="#fff" />
              <circle cx="75" cy="48" r="0.6" fill="#fff" />
              <circle cx="35" cy="60" r="0.8" fill="#fff" />
              <circle cx="25" cy="52" r="0.5" fill="#fff" />
              <circle cx="50" cy="50" r="5" fill="#fff" opacity="0.3" className="glow-bright" />
            </svg>
          </div>
        )}

        {step.id === "solarsystem" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 100 100" className="cosmic-svg">
              {/* Sun */}
              <circle cx="50" cy="50" r="9" fill="#eab308" className="glow-sun" />
              {/* Orbits */}
              <ellipse cx="50" cy="50" rx="20" ry="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <ellipse cx="50" cy="50" rx="32" ry="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
              <ellipse cx="50" cy="50" rx="44" ry="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              {/* Planets */}
              <circle cx="68" cy="44" r="1.5" fill="#f97316" /> {/* Mars */}
              <circle cx="30" cy="56" r="2.5" fill="#3b82f6" className="pulse-slow" /> {/* Earth */}
              <circle cx="50" cy="50" r="11" fill="none" stroke="rgba(234, 179, 8, 0.2)" strokeWidth="2" />
              {/* Mercury & Venus */}
              <circle cx="42" cy="45" r="1" fill="#9ca3af" />
              <circle cx="58" cy="56" r="2" fill="#fb923c" />
            </svg>
          </div>
        )}

        {step.id === "earth" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 100 100" className="cosmic-svg earth-globe">
              <defs>
                <radialGradient id="earth-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="70%" stopColor="#1e3a8a" />
                  <stop offset="90%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <clipPath id="globe-clip">
                  <circle cx="50" cy="50" r="35" />
                </clipPath>
              </defs>
              {/* Atmosphere Glow */}
              <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="2" className="pulse-slow" />
              <circle cx="50" cy="50" r="35" fill="url(#earth-glow)" />
              {/* Continents (Simplified Outline) */}
              <g clipPath="url(#globe-clip)" className="continents">
                {/* Asia/Europe */}
                <path d="M35 25 C45 20 60 22 70 30 C75 35 72 45 65 48 C62 50 63 55 58 58 C53 60 48 55 45 50 C40 48 35 48 33 40 Z" fill="#22c55e" opacity="0.85" />
                {/* Africa */}
                <path d="M15 45 C25 40 32 45 35 55 C38 65 32 75 25 78 C20 78 18 72 15 65 C12 58 12 50 15 45 Z" fill="#22c55e" opacity="0.8" />
                {/* Australia */}
                <path d="M72 65 C78 62 85 65 83 72 C80 75 75 75 72 72 Z" fill="#22c55e" opacity="0.8" />
                {/* India Marker */}
                <circle cx="53" cy="43" r="2" fill="#ef4444" className="pulse-fast glow-bright" />
              </g>
            </svg>
          </div>
        )}

        {step.id === "india" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 120 120" className="cosmic-svg map-india">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {/* Simplified India Map Path */}
              <path
                d="M58 20 L62 25 L65 30 L62 38 L68 40 L72 38 L76 43 L72 48 L75 52 L82 50 L86 54 L92 56 L88 62 L82 60 L78 62 L78 68 L76 72 L70 78 L65 86 L60 95 L58 100 L56 95 L52 88 L48 84 L46 76 L48 70 L42 66 L38 68 L34 65 L28 62 L26 56 L30 52 L36 50 L42 46 L45 42 L46 36 L52 32 L54 26 Z"
                fill="rgba(59, 130, 246, 0.15)"
                stroke="#3b82f6"
                strokeWidth="1.5"
                filter="url(#glow)"
                className="india-path"
              />
              {/* West Bengal Region Highlight */}
              <path
                d="M74 62 L78 62 L78 68 L76 72 L72 78 L71 74 L73 68 Z"
                fill="rgba(236, 72, 153, 0.4)"
                stroke="#ec4899"
                strokeWidth="1"
                className="pulse-slow"
              />
              {/* Pulsing Pin on West Bengal */}
              <circle cx="74" cy="68" r="2.5" fill="#ec4899" className="pulse-fast" />
            </svg>
          </div>
        )}

        {step.id === "westbengal" && (
          <div className="cosmic-stage fade-in">
            <svg viewBox="0 0 100 100" className="cosmic-svg map-wb">
              {/* Zoomed West Bengal outline */}
              <path
                d="M48 10 L52 15 L50 20 L55 25 L53 30 L58 35 L52 40 L50 48 L46 52 L54 58 L52 64 L56 70 L58 78 L52 82 L48 90 L42 85 L44 75 L38 72 L36 65 L42 60 L40 54 L44 48 L42 40 L45 35 L40 30 L44 20 L40 15 Z"
                fill="rgba(236, 72, 153, 0.1)"
                stroke="#ec4899"
                strokeWidth="1.5"
                className="wb-path"
              />
              {/* Glowing location locator and pulse rings */}
              <g transform="translate(49, 56)">
                <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(236,72,153,0.3)" strokeWidth="0.5" className="zoom-ring-1" />
                <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(236,72,153,0.15)" strokeWidth="0.5" className="zoom-ring-2" />
                <circle cx="0" cy="0" r="4" fill="#ec4899" className="pulse-fast" />
                <path d="M-6 -15 L6 -15 L0 -3 Z" fill="#ec4899" className="wb-marker-arrow" />
                {/* Neon Glowing Text Label for Khanyan */}
                <text x="8" y="-4" fill="#ffffff" fontSize="4.5" fontWeight="bold" letterSpacing="0.2" className="wb-location-label">Khanyan</text>
              </g>
            </svg>
          </div>
        )}

        {step.id === "portal" && (
          <div className="cosmic-stage fade-in portal-stage">
            <div className="glowing-portal">
              <div className="portal-ring ring-1"></div>
              <div className="portal-ring ring-2"></div>
              <div className="portal-ring ring-3"></div>
              <div className="portal-core">
                <span className="portal-date">23</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Overlay */}
      <div className="cosmic-info">
        <h2 className="step-title">{step.title}</h2>
        <p className="step-subtitle">{step.subtitle}</p>

        {/* Navigation Indicator dots */}
        <div className="step-dots">
          {steps.map((_, idx) => (
            <div key={idx} className={`dot ${idx === currentStep ? "active" : ""} ${idx < currentStep ? "completed" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
