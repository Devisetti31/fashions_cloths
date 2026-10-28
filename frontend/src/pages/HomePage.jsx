import React, { useState } from 'react';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedProducts from '../components/FeaturedProducts';
import EditorialShowcase from '../components/EditorialShowcase';
import BrandStory from '../components/BrandStory';
import Features from '../components/Features';
import Newsletter from '../components/Newsletter';
import QuickViewModal from '../components/QuickViewModal';

export default function HomePage() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts onQuickView={(p) => setQuickViewProduct(p)} />
      <EditorialShowcase />
      <BrandStory />
      <Features />
      <Newsletter />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}
