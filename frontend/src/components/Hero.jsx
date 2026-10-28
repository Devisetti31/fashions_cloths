import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Play, Pause } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import './Hero.css';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef(null);

  // Check prefers-reduced-motion to respect user accessibility preferences
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches && videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  // Ensure video is muted for reliable browser autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }
  }, []);

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <section 
      className="hero-section relative w-full overflow-hidden flex items-center justify-center" 
      aria-labelledby="hero-main-title"
    >
      {/* Background Video with required HTML5 attributes */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          className="hero-video-player absolute inset-0 w-full h-full object-cover"
          src="https://www.pexels.com/download/video/4265083/"
          autoPlay
          loop
          muted
          playsInline
          poster={BUSINESS_CONFIG.media.heroPosterUrl}
          onError={() => setVideoFailed(true)}
          title="ES ETHNIC STYLES Background Video"
        >
          <source src="https://www.pexels.com/download/video/4265083/" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src={BUSINESS_CONFIG.media.heroPosterUrl}
          alt="ES ETHNIC STYLES Haute Ethnic Couture Campaign"
          className="hero-video-player absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Dark overlay for text contrast and readability */}
      <div 
        className="hero-overlay absolute inset-0 bg-black/40" 
        aria-hidden="true" 
      />

      {/* Centered Text Container sitting above video and overlay (z-10) */}
      <div className="hero-content relative z-10 w-full max-w-4xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center">
        {/* Luxury Brand Badge */}
        <div className="hero-brand-pill">
          <Sparkles size={14} className="hero-sparkle-icon" aria-hidden="true" />
          <span>Artisanal Couture &amp; Master Handlooms</span>
        </div>

        {/* Main Hero Title */}
        <h1 id="hero-main-title" className="hero-title">
          Where Heritage Meets <span className="hero-title-italic">Modern Grace</span>
        </h1>

        {/* Official Tagline Bar */}
        <div className="hero-tagline-bar">
          {BUSINESS_CONFIG.tagline}
        </div>

        {/* Subtitle / Lead Paragraph */}
        <p className="hero-lead">
          Explore authentic Varanasi brocades, handloom Kanchipuram silks, and bespoke bridal
          lehengas tailored for your most cherished celebrations.
        </p>

        {/* Call to Action Group */}
        <div className="hero-cta-group">
          <Link to="/shop" className="btn btn-gold hero-cta-btn">
            <span>Shop Collection</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/category/festive-wear" className="btn btn-outline-ivory hero-cta-btn">
            <span>Festive Wear</span>
          </Link>
        </div>

        {/* Value Perks Row */}
        <div className="hero-perks-row">
          <div className="hero-perk">
            <span className="hero-perk-dot" />
            <span>100% Silk Mark Certified</span>
          </div>
          <div className="hero-perk">
            <span className="hero-perk-dot" />
            <span>500+ Guild Weavers</span>
          </div>
          <div className="hero-perk">
            <span className="hero-perk-dot" />
            <span>Bespoke Made-to-Measure</span>
          </div>
        </div>
      </div>

      {/* Accessible Video Play/Pause Toggle */}
      {!videoFailed && (
        <button
          type="button"
          className="hero-video-toggle-btn absolute bottom-6 right-6 z-20"
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause promotional video' : 'Play promotional video'}
          title={isPlaying ? 'Pause video playback' : 'Play video playback'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          <span className="hero-toggle-label">{isPlaying ? 'Pause' : 'Play'}</span>
        </button>
      )}
    </section>
  );
}
