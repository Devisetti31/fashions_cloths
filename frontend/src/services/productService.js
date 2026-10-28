import { PRODUCTS, CATEGORIES } from '../data/products';

/**
 * Service layer for product data discovery and retrieval.
 * Connects to FastAPI endpoints (e.g., /api/v1/products) with fallback to curated catalog.
 */

export function adaptApiProduct(item) {
  if (!item) return null;

  // Extract images: prioritize images array if present, fallback to primary_image
  const images = (item.images && item.images.length > 0)
    ? item.images
        .slice()
        .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
        .map((img) => (typeof img === 'string' ? img : img.image_url))
        .filter(Boolean)
    : [item.primary_image].filter(Boolean);

  // Extract sizes from variants
  const sizes = (item.variants && item.variants.length > 0)
    ? [...new Set(item.variants.map((v) => v.size).filter(Boolean))]
    : (item.sizes || ['Free Size']);

  // Extract colors from variants
  const colors = (item.variants && item.variants.length > 0)
    ? item.variants
        .filter((v) => v.color)
        .map((v) => ({ name: v.color, hex: '#4A171C' }))
        .filter((col, idx, arr) => arr.findIndex((c) => c.name === col.name) === idx)
    : (item.colors || [{ name: 'Default', hex: '#4A171C' }]);

  const categoryLabels = {
    1: 'Sarees',
    2: 'Kurtis',
    3: 'Lehengas',
    4: 'Salwar Suits',
    5: 'Festive Wear',
    6: 'New Arrivals',
  };

  const parsedPrice = typeof item.price === 'string' ? parseFloat(item.price) : Number(item.price || 0);
  const parsedComparePrice = item.compare_at_price
    ? (typeof item.compare_at_price === 'string' ? parseFloat(item.compare_at_price) : Number(item.compare_at_price))
    : null;

  // Match with static product by SKU or name if available to maintain image galleries & reviews
  const matchedStatic = PRODUCTS.find(
    (p) => (item.sku && p.sku === item.sku) || (item.name && p.name.toLowerCase() === item.name.toLowerCase())
  );

  const finalId = matchedStatic ? matchedStatic.id : (item.slug || String(item.id));
  const finalImages = images.length > 0 ? images : (matchedStatic ? matchedStatic.images : ['/images/placeholder.jpg']);

  return {
    id: finalId,
    dbId: item.id,
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    category: item.category?.slug || (item.category_id ? String(item.category_id) : 'new-arrivals'),
    categoryLabel: item.category?.name || categoryLabels[item.category_id] || (matchedStatic?.categoryLabel || 'New Arrivals'),
    price: parsedPrice,
    originalPrice: parsedComparePrice || matchedStatic?.originalPrice || null,
    isSale: Boolean(parsedComparePrice && parsedComparePrice > parsedPrice),
    isNew: true,
    isFeatured: Boolean(item.is_featured),
    rating: item.rating || matchedStatic?.rating || 4.9,
    reviewsCount: item.reviewsCount || matchedStatic?.reviewsCount || 18,
    description: item.description,
    fabric: item.fabric || matchedStatic?.fabric || 'Pure Silk Handloom',
    craft: item.craft || matchedStatic?.craft || 'Artisanal Handloom Craft',
    sizes: sizes.length > 0 ? sizes : (matchedStatic?.sizes || ['Free Size']),
    colors: colors.length > 0 ? colors : (matchedStatic?.colors || [{ name: 'Default', hex: '#4A171C' }]),
    images: finalImages,
    primary_image: item.primary_image || finalImages[0],
    details: item.details || matchedStatic?.details || [],
    created_at: item.created_at,
    variants: item.variants || [],
  };
}

/**
 * Fetch New Arrivals directly from FastAPI ordered by creation date (newest first).
 */
export async function fetchNewArrivals(options = {}) {
  const { page = 1, pageSize = 50 } = options;
  try {
    const res = await fetch(`/api/v1/products?sort=newest&page=${page}&page_size=${pageSize}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }
    const data = await res.json();
    if (data && Array.isArray(data.items)) {
      return {
        products: data.items.map(adaptApiProduct),
        total: data.total,
        page: data.page,
        totalPages: data.total_pages,
        isFromApi: true,
      };
    }
    throw new Error('Invalid API response shape');
  } catch (err) {
    // Graceful fallback when backend is unreachable (e.g. offline tests)
    const localNew = PRODUCTS.filter((p) => p.isNew);
    const sortedFallback = localNew.length > 0 ? localNew : PRODUCTS.slice(0, 8);
    return {
      products: sortedFallback,
      total: sortedFallback.length,
      page: 1,
      totalPages: 1,
      isFromApi: false,
    };
  }
}

export async function getProducts(options = {}) {
  const { category, search, sort, limit, isFeatured, isNew } = options;

  let results = [...PRODUCTS];

  // Filter by category
  if (category && category !== 'all') {
    if (category === 'new-arrivals') {
      results = results.filter((p) => p.isNew);
    } else {
      results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
  }

  // Filter by search query
  if (search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
  }

  // Filter by featured
  if (isFeatured) {
    results = results.filter((p) => p.isFeatured);
  }

  // Filter by new
  if (isNew) {
    results = results.filter((p) => p.isNew);
  }

  // Sort results
  if (sort) {
    switch (sort) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
  }

  // Limit results
  if (limit && limit > 0) {
    results = results.slice(0, limit);
  }

  return results;
}

export async function getProductById(id) {
  if (!id) return null;
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id || String(p.id) === String(id));
  return product || null;
}

export async function getCategories() {
  return [...CATEGORIES];
}

export async function getCategoryBySlug(slug) {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getRelatedProducts(currentId, category, limit = 4) {
  return PRODUCTS.filter((p) => p.id !== currentId && p.category === category).slice(0, limit);
}
