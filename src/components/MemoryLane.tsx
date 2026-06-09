import React, { useState } from "react";
import { Heart, Sparkles, ArrowRight } from "lucide-react";
import "./MemoryLane.css";

interface Memory {
  id: number;
  image: string;
  title: string;
  comment: string;
  date: string;
  rotation: number;
  objectPosition?: string;
}

const MEMORIES: Memory[] = [
  {
    id: 1,
    image: "/images/childhood.jpg",
    title: "Innocence & Big Dreams",
    date: "Circa 2008",
    comment: "Little Nargis! With eyes full of wonder, beginning a beautiful journey of 23 years.",
    rotation: -4,
  },
  {
    id: 2,
    image: "/images/friends.jpg",
    title: "Bonds of Togetherness",
    date: "Celebrations",
    comment: "Sharing pure laughter and secrets. Growing up alongside special souls.",
    rotation: 3,
  },
  {
    id: 3,
    image: "/images/family.jpg",
    title: "My Safe Sanctuary",
    date: "The Pillars",
    comment: "Standing proud with family. The unbreakable shield of love that guides you.",
    rotation: -2,
  },
  {
    id: 4,
    image: "/images/mother.jpg",
    title: "Maternal Comfort",
    date: "Warmest Embrace",
    comment: "Fast asleep on mother's shoulder—the safest, warmest place in the universe.",
    rotation: 5,
  },
  {
    id: 5,
    image: "/images/grown_1.jpg",
    title: "Radiant & Confident",
    date: "A Beautiful Smile",
    comment: "Your radiant smile and warm spirit bring joy to everyone who crosses your path.",
    rotation: -3,
  },
  {
    id: 6,
    image: "/images/grown_2.jpg",
    title: "Chasing Horizons",
    date: "Exploring Life",
    comment: "Gazing towards a bright future. May your heart stay brave and your wings fly high.",
    rotation: 4,
  },
  {
    id: 7,
    image: "/images/grown_3.jpg",
    title: "Rivers of Hope",
    date: "Kolkata Diaries",
    comment: "Standing by the majestic Howrah Bridge. Sailing through life with grace and strength.",
    rotation: -4,
  },
  {
    id: 8,
    image: "/images/grown_4.jpg",
    title: "Sassy & Sweet",
    date: "Own Your Style",
    comment: "Rocking the cool sunglasses look! Embracing your unique, sparkling style.",
    rotation: 3,
  },
  {
    id: 9,
    image: "/images/grown_5.jpg",
    title: "A Bright New Dawn",
    date: "23 Years Young",
    comment: "Here's to a beautiful soul. May this year bring you infinite happiness.",
    rotation: -2,
  },
  {
    id: 10,
    image: "/images/grown_6.jpg",
    title: "Under the Shade",
    date: "Summer Days",
    comment: "Posing under the shade of a jackfruit tree. Wearing red with style and grace.",
    rotation: 4,
  },
  {
    id: 11,
    image: "/images/grown_7.jpg",
    title: "Nature's Quiet Grace",
    date: "Serenity",
    comment: "Embodying quiet grace and a peaceful heart, surrounded by nature's green.",
    rotation: -3,
  },
  {
    id: 12,
    image: "/images/grown_8.jpg",
    title: "Festival of Lights",
    date: "Elegant Evenings",
    comment: "Shining under warm festival lights in a gorgeous white and pink lehenga.",
    rotation: 5,
    objectPosition: "center 5%",
  },
  {
    id: 13,
    image: "/images/grown_9.jpg",
    title: "Blooming Smile",
    date: "Sweet Selfie",
    comment: "A lovely selfie with a blooming rose. Your sweet smile lights up the screen.",
    rotation: -2,
  },
  {
    id: 14,
    image: "/images/grown_10.jpg",
    title: "Petals & Leaves",
    date: "Garden Magic",
    comment: "Dressed in red, matching nature's vibrant energy with your own colorful spirit.",
    rotation: 3,
  },
];

interface MemoryLaneProps {
  onComplete: () => void;
}

export const MemoryLane: React.FC<MemoryLaneProps> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleCardClick = () => {
    if (isExiting) return;

    if (!isFlipped) {
      // Step 1: Flip to reveal the comment
      setIsFlipped(true);
    } else {
      // Step 2: Trigger exit animation
      setIsExiting(true);
      setTimeout(() => {
        if (activeIndex < MEMORIES.length - 1) {
          // Go to next card
          setActiveIndex((prev) => prev + 1);
          setIsFlipped(false);
          setIsExiting(false);
        } else {
          // Complete phase
          onComplete();
        }
      }, 700); // Duration of slide-out animation
    }
  };

  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;

    // Only render active card and next cards in stack
    if (diff < 0) return { display: "none" };

    // Standard stacked card styling
    const scale = 1 - diff * 0.05;
    const translateY = diff * 12;
    const rotate = diff === 0 ? (isFlipped ? 0 : MEMORIES[index].rotation) : MEMORIES[index].rotation;
    const zIndex = 100 - diff;
    const opacity = diff > 2 ? 0 : 1 - diff * 0.3;

    return {
      transform: `translate3d(0, ${translateY}px, 0) scale(${scale}) rotate(${rotate}deg)`,
      zIndex,
      opacity,
      transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease",
    };
  };

  return (
    <div className="memory-container">
      {/* Decorative stars */}
      <div className="sparkles-bg">
        <Sparkles className="sparkle sp-1" size={16} />
        <Sparkles className="sparkle sp-2" size={20} />
        <Sparkles className="sparkle sp-3" size={14} />
      </div>

      <div className="memory-header">
        <span className="memory-badge">Memory Lane</span>
        <h2 className="memory-title">Nargis's Album</h2>
        <p className="memory-desc">
          Tap each Polaroid to uncover the beautiful chapters of her life.
        </p>
      </div>

      {/* Polaroid Deck Container */}
      <div className="polaroid-deck">
        {MEMORIES.map((memory, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={memory.id}
              className={`polaroid-card-wrapper ${isActive && isExiting ? "card-exit" : ""}`}
              style={getCardStyle(index)}
              onClick={isActive ? handleCardClick : undefined}
            >
              <div className={`polaroid-card ${isActive && isFlipped ? "flipped" : ""}`}>
                {/* CARD FRONT: Image */}
                <div className="card-face card-front">
                  <div className="image-frame">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="polaroid-image"
                      style={memory.objectPosition ? { objectPosition: memory.objectPosition } : undefined}
                    />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="polaroid-footer">
                    <span className="polaroid-caption">{memory.title}</span>
                    <div className="footer-details">
                      <span className="polaroid-date">{memory.date}</span>
                      <Heart size={14} className="heart-icon" />
                    </div>
                  </div>
                  {isActive && !isFlipped && (
                    <div className="tap-hint pulse-slow">
                      <span>Tap to Open</span>
                    </div>
                  )}
                </div>

                {/* CARD BACK: Comment & Wish */}
                <div className="card-face card-back">
                  <div className="card-back-content">
                    <Heart size={28} className="back-heart" />
                    <h3 className="back-title">{memory.title}</h3>
                    <span className="back-date">{memory.date}</span>
                    <div className="divider"></div>
                    <p className="back-comment">"{memory.comment}"</p>
                    <div className="divider"></div>
                    <button className="next-btn">
                      {activeIndex === MEMORIES.length - 1 ? "Enter Birthday Bash" : "Next Memory"}
                      <ArrowRight size={16} className="arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Page Progress Indicator */}
      <div className="memory-footer-bar">
        <span className="progress-text">
          Chapter {activeIndex + 1} of {MEMORIES.length}
        </span>
        <div className="bar-container">
          <div
            className="bar-fill"
            style={{ width: `${((activeIndex + (isFlipped ? 0.5 : 0)) / MEMORIES.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
