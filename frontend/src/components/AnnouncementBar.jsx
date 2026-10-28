import React from 'react';
import { Sparkles } from 'lucide-react';
import './AnnouncementBar.css';

export default function AnnouncementBar({
  message = 'Curated Haute Couture & Master Handlooms — Timeless Tradition, Modern You',
  demoLabel = 'Demo Storefront',
}) {
  return (
    <div className="announcement-bar" role="region" aria-label="Store Announcement">
      <div className="announcement-inner">
        <Sparkles size={12} className="announcement-sparkle" aria-hidden="true" />
        <span>{message}</span>
        {demoLabel && <span className="announcement-demo-badge">{demoLabel}</span>}
        <Sparkles size={12} className="announcement-sparkle" aria-hidden="true" />
      </div>
    </div>
  );
}
