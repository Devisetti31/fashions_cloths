"""Idempotent seed script for ES ETHNIC STYLES development database.

Populates categories, illustrative demo products, sizes, variants, and gallery images.
Can be executed repeatedly without creating duplicates.
Command: python -m app.db.seed
"""

import sys
import os
from decimal import Decimal
from typing import List, Dict, Any

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import select
from app.db.session import SessionLocal, engine
from app.models.category import Category
from app.models.product import Product, ProductVariant, ProductImage


SEED_CATEGORIES: List[Dict[str, Any]] = [
    {
        "name": "Sarees",
        "slug": "sarees",
        "description": "Timeless drape traditions woven with pure mulberry silk, antique gold zari, and heritage Varanasi craftsmanship.",
        "image_url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
    {
        "name": "Kurtis",
        "slug": "kurtis",
        "description": "Contemporary silhouettes adorned with delicate Chikankari embroidery, gota patti accents, and breathable fabrics.",
        "image_url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
    {
        "name": "Lehengas",
        "slug": "lehengas",
        "description": "Bespoke bridal and sangeet skirts tailored with voluminous flares, raw silk textures, and metallic zardozi artistry.",
        "image_url": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
    {
        "name": "Salwar Suits",
        "slug": "salwar-suits",
        "description": "Classic three-piece celebratory sets combining flowing kurtas, tailored bottoms, and statement hand-painted dupattas.",
        "image_url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
    {
        "name": "Festive Wear",
        "slug": "festive-wear",
        "description": "Radiant festive edits illuminated by antique foil work, jewel tones, and opulent metallic thread highlights.",
        "image_url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
    {
        "name": "New Arrivals",
        "slug": "new-arrivals",
        "description": "Our latest curated expressions celebrating the harmonious blend of timeless Indian tradition and modern tailoring.",
        "image_url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
        "is_active": True,
    },
]

SEED_PRODUCTS: List[Dict[str, Any]] = [
    {
        "name": "Royal Crimson Banarasi Katan Silk Saree",
        "slug": "royal-crimson-banarasi-katan-silk-saree",
        "category_slug": "sarees",
        "sku": "ES-SR-01-CRIMSON",
        "price": Decimal("18500.00"),
        "compare_at_price": Decimal("22000.00"),
        "primary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
        "description": "Woven with pure mulberry Katan silk by heritage Varanasi master artisans, featuring intricate floral jangla work in antique gold zari. Accompanied by a coordinated unstitched brocade blouse piece.",
        "fabric": "100% Pure Katan Mulberry Silk with Certified Gold Zari",
        "craft": "Varanasi Handloom Kadwa Weave",
        "details": [
            "Silk Mark Certified authenticity",
            "Heavy pallu with intricate antique gold motifs",
            "Dry clean only recommended for heirloom longevity",
            "Includes premium velvet dust protection bag",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "Free Size (5.5m + 0.8m Blouse)", "color": "Crimson Red", "sku": "ES-SR-01-CRIMSON-FS", "stock": 10},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Gilded Zari Embroidered Velvet Bridal Lehenga",
        "slug": "gilded-zari-embroidered-velvet-bridal-lehenga",
        "category_slug": "lehengas",
        "sku": "ES-LH-01-WINE",
        "price": Decimal("68000.00"),
        "compare_at_price": Decimal("78000.00"),
        "primary_image": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85",
        "description": "A masterpiece bridal ensemble in regal burgundy micro-velvet, embellished with dabka, nakshi, and antique sequin zardozi embroidery. Paired with a hand-embroidered sweetheart blouse and double organza dupatta.",
        "fabric": "Royal Micro-Velvet Skirt with Pure Silk Organza Dupatta",
        "craft": "Handcrafted Zardozi & Dabka Needlework",
        "details": [
            "16-kalidar panel construction for grand sweeping flare",
            "Can-can and double canvas lining built in",
            "Custom waist and blouse tailoring available on request",
            "Complimentary virtual styling consultation",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Burgundy Wine", "sku": "ES-LH-01-WINE-XS", "stock": 3},
            {"size": "S", "color": "Burgundy Wine", "sku": "ES-LH-01-WINE-S", "stock": 5},
            {"size": "M", "color": "Burgundy Wine", "sku": "ES-LH-01-WINE-M", "stock": 6},
            {"size": "L", "color": "Burgundy Wine", "sku": "ES-LH-01-WINE-L", "stock": 4},
            {"size": "XL", "color": "Burgundy Wine", "sku": "ES-LH-01-WINE-XL", "stock": 2},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Ivory & Blush Chikankari Georgette Anarkali",
        "slug": "ivory-blush-chikankari-georgette-anarkali",
        "category_slug": "kurtis",
        "sku": "ES-KT-01-IVORY",
        "price": Decimal("12500.00"),
        "compare_at_price": None,
        "primary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85",
        "description": "Delicate Lucknowi Chikankari hand-embroidery rendered on airy viscose georgette with subtle mukaish metallic dots. Flowing calf-length silhouette designed for celebratory occasions.",
        "fabric": "Pure Viscose Georgette with Cotton Mulmul Slip",
        "craft": "Authentic Lucknowi Shadow & Murri Chikankari",
        "details": [
            "Hand-finished hem with pearl scallop edging",
            "Includes tonal modal slip",
            "Gentle hand wash or dry clean",
            "Breathable, lightweight summer elegance",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Ivory Blush", "sku": "ES-KT-01-IVORY-XS", "stock": 4},
            {"size": "S", "color": "Ivory Blush", "sku": "ES-KT-01-IVORY-S", "stock": 8},
            {"size": "M", "color": "Ivory Blush", "sku": "ES-KT-01-IVORY-M", "stock": 10},
            {"size": "L", "color": "Ivory Blush", "sku": "ES-KT-01-IVORY-L", "stock": 6},
            {"size": "XL", "color": "Ivory Blush", "sku": "ES-KT-01-IVORY-XL", "stock": 3},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Emerald Green Chanderi Silk Festive Suit Set",
        "slug": "emerald-green-chanderi-silk-festive-suit-set",
        "category_slug": "salwar-suits",
        "sku": "ES-ST-01-EMERALD",
        "price": Decimal("14800.00"),
        "compare_at_price": Decimal("16500.00"),
        "primary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
        "description": "Rich jewel-toned Chanderi silk straight kurta adorned with antique gold marodi embroidery on the neckline, paired with scalloped silk pants and a handwoven organza dupatta.",
        "fabric": "Fine Chanderi Silk Kurta & Pants with Organza Dupatta",
        "craft": "Rajasthan Marodi Needle Embroidery",
        "details": [
            "Three-piece set: Kurta, straight trousers, and dupatta",
            "Scalloped borders with metallic gota patti lace",
            "Side pockets tailored into trousers",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "S", "color": "Emerald Forest", "sku": "ES-ST-01-EMERALD-S", "stock": 4},
            {"size": "M", "color": "Emerald Forest", "sku": "ES-ST-01-EMERALD-M", "stock": 6},
            {"size": "L", "color": "Emerald Forest", "sku": "ES-ST-01-EMERALD-L", "stock": 5},
            {"size": "XL", "color": "Emerald Forest", "sku": "ES-ST-01-EMERALD-XL", "stock": 2},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Antique Gold Tissue Handloom Saree",
        "slug": "antique-gold-tissue-handloom-saree",
        "category_slug": "sarees",
        "sku": "ES-SR-02-GOLD",
        "price": Decimal("24500.00"),
        "compare_at_price": None,
        "primary_image": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85",
        "description": "Spun from pure metallic gold tissue yarns and soft silk warp, giving a fluid ethereal shimmer. Finished with a subtle self-color woven temple border.",
        "fabric": "Tissue Silk with Gold Metallic Weft",
        "craft": "Handloom Metallic Tissue Weave",
        "details": [
            "Ultra-lightweight drape with regal luminescence",
            "Complimentary matching running blouse fabric",
            "Silk Mark Certified product",
        ],
        "is_featured": False,
        "is_active": True,
        "variants": [
            {"size": "Free Size (5.5m + 0.8m Blouse)", "color": "Antique Gold", "sku": "ES-SR-02-GOLD-FS", "stock": 8},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Rose Quartz Raw Silk Sangeet Lehenga",
        "slug": "rose-quartz-raw-silk-sangeet-lehenga",
        "category_slug": "lehengas",
        "sku": "ES-LH-02-ROSE",
        "price": Decimal("49500.00"),
        "compare_at_price": Decimal("56000.00"),
        "primary_image": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85",
        "description": "A romantic blush and rose quartz silk lehenga adorned with floral resham threadwork, micro pearls, and gold sequins.",
        "fabric": "Heavy Raw Silk Skirt with Silk Net Dupatta",
        "craft": "Resham Threadwork & Micro-Sequin Embellishment",
        "details": [
            "Padded blouse cups with concealed side zipper",
            "Drawstring waist with handcrafted latkan tassels",
            "Perfect for Sangeet, Mehendi, and reception festivities",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Rose Quartz", "sku": "ES-LH-02-ROSE-XS", "stock": 2},
            {"size": "S", "color": "Rose Quartz", "sku": "ES-LH-02-ROSE-S", "stock": 5},
            {"size": "M", "color": "Rose Quartz", "sku": "ES-LH-02-ROSE-M", "stock": 4},
            {"size": "L", "color": "Rose Quartz", "sku": "ES-LH-02-ROSE-L", "stock": 3},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Midnight Burgundy Zardozi Velvet Kurta Ensemble",
        "slug": "midnight-burgundy-zardozi-velvet-kurta-ensemble",
        "category_slug": "festive-wear",
        "sku": "ES-FW-01-BURGUNDY",
        "price": Decimal("19800.00"),
        "compare_at_price": Decimal("23500.00"),
        "primary_image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
        "description": "Decadent velvet kurta in our signature burgundy shade, featuring hand-cut antique gold zardozi motifs across yoke and sleeves.",
        "fabric": "Signature Silk Velvet with Silk Brocade",
        "craft": "Heritage Zardozi & Tilla Hand Needlework",
        "details": [
            "Opulent plush velvet texture with subtle sheen",
            "Straight comfort fit with high side slits",
            "Includes gold tissue piping on all borders",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Signature Burgundy", "sku": "ES-FW-01-BURGUNDY-XS", "stock": 3},
            {"size": "S", "color": "Signature Burgundy", "sku": "ES-FW-01-BURGUNDY-S", "stock": 6},
            {"size": "M", "color": "Signature Burgundy", "sku": "ES-FW-01-BURGUNDY-M", "stock": 5},
            {"size": "L", "color": "Signature Burgundy", "sku": "ES-FW-01-BURGUNDY-L", "stock": 4},
            {"size": "XL", "color": "Signature Burgundy", "sku": "ES-FW-01-BURGUNDY-XL", "stock": 2},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Peacock Teal Handloom Kanjeevaram Silk Saree",
        "slug": "peacock-teal-handloom-kanjeevaram-silk-saree",
        "category_slug": "sarees",
        "sku": "ES-SR-03-TEAL",
        "price": Decimal("32000.00"),
        "compare_at_price": Decimal("36000.00"),
        "primary_image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85",
        "description": "An authentic South Indian Kanchipuram weave exhibiting contrasting rich peacock teal body and vermillion gold zari borders.",
        "fabric": "Pure Mulberry Silk (Heavy 4-Ply)",
        "craft": "Authentic Korvai Handloom Technique",
        "details": [
            "Pure Silk Mark certified with GI tagged authenticity",
            "Contrasting heavy zari pallu with rudraksha motifs",
            "Includes matching unstitched blouse material",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "Free Size (5.5m + 0.8m Blouse)", "color": "Peacock Teal", "sku": "ES-SR-03-TEAL-FS", "stock": 7},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Pastel Peach Gota Patti Muslin Kurti Set",
        "slug": "pastel-peach-gota-patti-muslin-kurti-set",
        "category_slug": "kurtis",
        "sku": "ES-KT-02-PEACH",
        "price": Decimal("8900.00"),
        "compare_at_price": None,
        "primary_image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85",
        "description": "Featherlight pure muslin kurti embellished with Jaipur gota patti ribbons on neck and sleeve cuffs. Accompanied by cotton cigarette trousers.",
        "fabric": "Pure Cotton Muslin with Cotton Mulmul",
        "craft": "Jaipur Hand-Appliqué Gota Patti Work",
        "details": [
            "Ideal for daytime poojas, haldi ceremonies, and brunch",
            "Breathable organic natural dyes",
            "Easy comfort fit with delicate keyhole neckline",
        ],
        "is_featured": False,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Pastel Peach", "sku": "ES-KT-02-PEACH-XS", "stock": 5},
            {"size": "S", "color": "Pastel Peach", "sku": "ES-KT-02-PEACH-S", "stock": 7},
            {"size": "M", "color": "Pastel Peach", "sku": "ES-KT-02-PEACH-M", "stock": 9},
            {"size": "L", "color": "Pastel Peach", "sku": "ES-KT-02-PEACH-L", "stock": 4},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Blush Pink Organza Floral Embroidered Anarkali Suit",
        "slug": "blush-pink-organza-floral-embroidered-anarkali-suit",
        "category_slug": "salwar-suits",
        "sku": "ES-ST-02-BLUSH",
        "price": Decimal("16200.00"),
        "compare_at_price": Decimal("19000.00"),
        "primary_image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
        "description": "Dreamy blush pink sheer organza anarkali featuring hand-painted floral motifs enriched with fine resham and sequin highlights.",
        "fabric": "Pure Sheer Silk Organza over Taffeta Silk",
        "craft": "Botanical Hand-Painting with Resham Detailing",
        "details": [
            "Layered skirt construction with dynamic motion",
            "Artisanal hand-painted floral vignettes",
            "Dry clean only",
        ],
        "is_featured": False,
        "is_active": True,
        "variants": [
            {"size": "S", "color": "Blush Pink", "sku": "ES-ST-02-BLUSH-S", "stock": 4},
            {"size": "M", "color": "Blush Pink", "sku": "ES-ST-02-BLUSH-M", "stock": 6},
            {"size": "L", "color": "Blush Pink", "sku": "ES-ST-02-BLUSH-L", "stock": 5},
            {"size": "XL", "color": "Blush Pink", "sku": "ES-ST-02-BLUSH-XL", "stock": 2},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Mustard Marigold Raw Silk Festive Kurta Set",
        "slug": "mustard-marigold-raw-silk-festive-kurta-set",
        "category_slug": "festive-wear",
        "sku": "ES-FW-02-YELLOW",
        "price": Decimal("13500.00"),
        "compare_at_price": Decimal("15500.00"),
        "primary_image": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85",
        "description": "Bright festive yellow raw silk kurti with heritage pita and sitara embroidery on the collar. Paired with wide-leg culottes and a contrasting hot pink bandhani dupatta.",
        "fabric": "Raw Silk Kurta & Pants with Bandhani Silk Dupatta",
        "craft": "Kutch Bandhani Tie-Dye & Pita Work",
        "details": [
            "Vibrant auspicious palette for Haldi and Diwali festivities",
            "Hand-knotted authentic Bandhani dots on dupatta",
            "Tailored with side pockets",
        ],
        "is_featured": False,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Marigold Yellow", "sku": "ES-FW-02-YELLOW-XS", "stock": 3},
            {"size": "S", "color": "Marigold Yellow", "sku": "ES-FW-02-YELLOW-S", "stock": 6},
            {"size": "M", "color": "Marigold Yellow", "sku": "ES-FW-02-YELLOW-M", "stock": 8},
            {"size": "L", "color": "Marigold Yellow", "sku": "ES-FW-02-YELLOW-L", "stock": 4},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
    {
        "name": "Deep Plum Brocade Royal Festive Lehenga",
        "slug": "deep-plum-brocade-royal-festive-lehenga",
        "category_slug": "lehengas",
        "sku": "ES-LH-03-PLUM",
        "price": Decimal("52000.00"),
        "compare_at_price": None,
        "primary_image": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85",
        "description": "Woven with high-density gold zari brocade on deep plum silk, inspired by Mughal palace architecture. Features a structured sweetheart corset blouse.",
        "fabric": "Pure Silk Brocade with Metallic Weft",
        "craft": "Varanasi Architectural Brocade Weave",
        "details": [
            "Structured corset-style blouse with boning support",
            "Heirloom quality fabric that retains form and luster",
            "Complimentary custom blouse padding and sleeve alterations",
        ],
        "is_featured": True,
        "is_active": True,
        "variants": [
            {"size": "XS", "color": "Deep Plum", "sku": "ES-LH-03-PLUM-XS", "stock": 2},
            {"size": "S", "color": "Deep Plum", "sku": "ES-LH-03-PLUM-S", "stock": 4},
            {"size": "M", "color": "Deep Plum", "sku": "ES-LH-03-PLUM-M", "stock": 5},
            {"size": "L", "color": "Deep Plum", "sku": "ES-LH-03-PLUM-L", "stock": 3},
        ],
        "images": [
            {"url": "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1000&q=85", "is_primary": True, "order": 0},
            {"url": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85", "is_primary": False, "order": 1},
        ],
    },
]


def seed_database() -> None:
    """Populate database idempotently."""
    db = SessionLocal()
    try:
        print("[SEED] Starting database seeding...")
        category_map = {}

        # 1. Seed Categories
        for cat_data in SEED_CATEGORIES:
            existing = db.execute(
                select(Category).where(Category.slug == cat_data["slug"])
            ).scalar_one_or_none()

            if not existing:
                category = Category(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    description=cat_data["description"],
                    image_url=cat_data["image_url"],
                    is_active=cat_data["is_active"],
                )
                db.add(category)
                db.flush()
                category_map[cat_data["slug"]] = category
                print(f"[SEED] Created Category: {category.name} ({category.slug})")
            else:
                category_map[cat_data["slug"]] = existing
                print(f"[SEED] Category already exists: {existing.name} ({existing.slug})")

        db.commit()

        # 2. Seed Products
        for prod_data in SEED_PRODUCTS:
            category = category_map.get(prod_data["category_slug"])
            if not category:
                print(f"[SEED] WARNING: Category {prod_data['category_slug']} not found. Skipping {prod_data['name']}")
                continue

            existing_prod = db.execute(
                select(Product).where(Product.sku == prod_data["sku"])
            ).scalar_one_or_none()

            if not existing_prod:
                product = Product(
                    name=prod_data["name"],
                    slug=prod_data["slug"],
                    category_id=category.id,
                    sku=prod_data["sku"],
                    price=prod_data["price"],
                    compare_at_price=prod_data["compare_at_price"],
                    primary_image=prod_data["primary_image"],
                    description=prod_data["description"],
                    fabric=prod_data["fabric"],
                    craft=prod_data["craft"],
                    details=prod_data["details"],
                    is_featured=prod_data["is_featured"],
                    is_active=prod_data["is_active"],
                )
                db.add(product)
                db.flush()

                # Add Variants
                for v in prod_data.get("variants", []):
                    variant = ProductVariant(
                        product_id=product.id,
                        size=v["size"],
                        color=v.get("color"),
                        sku=v["sku"],
                        stock_quantity=v["stock"],
                        is_active=True,
                    )
                    db.add(variant)

                # Add Images
                for img in prod_data.get("images", []):
                    image = ProductImage(
                        product_id=product.id,
                        image_url=img["url"],
                        alt_text=f"{product.name} photo",
                        display_order=img["order"],
                        is_primary=img["is_primary"],
                    )
                    db.add(image)

                db.flush()
                print(f"[SEED] Created Product: {product.name} (SKU: {product.sku})")
            else:
                print(f"[SEED] Product already exists: {existing_prod.name} (SKU: {existing_prod.sku})")

        db.commit()
        print("[SEED] Seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"[SEED] ERROR during database seeding: {str(e)}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
