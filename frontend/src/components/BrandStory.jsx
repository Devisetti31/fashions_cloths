import React from 'react';
import { Feather, Heart, Sparkles } from 'lucide-react';
import './BrandStory.css';

export default function BrandStory() {
  return (
    <section id="story" className="brand-story-section" aria-labelledby="brand-story-title">
      <div className="brand-story-container">
        <div className="brand-story-pretitle">The Philosophy of ES ETHNIC STYLES</div>
        <h2 id="brand-story-title" className="brand-story-heading">
          Where Heritage Breathes New Life
        </h2>
        <div className="brand-story-tagline-accent">
          &ldquo;Timeless Tradition, Modern You&rdquo;
        </div>
        <div className="gold-divider">
          <span className="gold-diamond" />
        </div>

        <div className="brand-story-paragraphs">
          <p>
            At <strong>ES ETHNIC STYLES</strong>, our identity is anchored in the profound legacy of
            Indian handloom craftsmanship. We believe that ethnic fashion is not a relic of the past,
            but a living art form—reimagined through refined silhouettes, thoughtful drapes, and
            graceful modern palettes.
          </p>
          <p>
            From the hand-twisted zari weaves of Varanasi and the regal Korvai borders of
            Kanchipuram to the ethereal gossamer drapes of Chanderi and the delicate shadow-work of
            Lucknow, each silhouette celebrates authentic artisans while speaking fluently to contemporary
            lifestyles.
          </p>
        </div>

        <div className="brand-story-pillars">
          <div className="story-pillar-card">
            <div className="story-pillar-icon" aria-hidden="true">
              <Feather size={20} />
            </div>
            <h3 className="story-pillar-title">Authentic Handlooms</h3>
            <p className="story-pillar-text">
              Direct curation with master weaver clusters, preserving centuries-old indigenous techniques.
            </p>
          </div>

          <div className="story-pillar-card">
            <div className="story-pillar-icon" aria-hidden="true">
              <Heart size={20} />
            </div>
            <h3 className="story-pillar-title">Ethical Craft</h3>
            <p className="story-pillar-text">
              Fair-trade values honoring the weaver families whose dedication brings these heirlooms to life.
            </p>
          </div>

          <div className="story-pillar-card">
            <div className="story-pillar-icon" aria-hidden="true">
              <Sparkles size={20} />
            </div>
            <h3 className="story-pillar-title">Modern Silhouettes</h3>
            <p className="story-pillar-text">
              Designed with contemporary cuts, lightweight linings, and effortless elegance for today’s patron.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
