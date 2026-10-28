# ES ETHNIC STYLES

> **Timeless Tradition, Modern You**

**ES ETHNIC STYLES** is a high-end luxury Indian ethnic fashion e-commerce platform. The project unites authentic artisanal handloom couture (Banarasi brocades, Kanchipuram silks, Lucknowi chikankari, and bespoke bridal lehengas) with contemporary tailoring and modern full-stack web architecture.

---

## Brand Palette & Aesthetics

- **Blush Pink:** `#F4B9C4`
- **Antique Gold:** `#B88A45`
- **Burgundy:** `#4A171C`
- **Ivory:** `#FFFCF8`
- **Primary Text:** `#292326`
- **Muted Text:** `#766A6D`

**Design Language:** Editorial fashion composition, regal typography pairing (Cormorant Garamond serif headings with Plus Jakarta Sans body), thin antique-gold borders, generous whitespace, accessible focus indicators, and mobile-first responsiveness.

---

## Project Structure

```text
es-ethnic-styles/
├── frontend/                     # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.svg           # Brand monogram favicon
│   │   └── images/               # Official brand logo & image assets
│   │       └── README.txt        # Logo placement instructions
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AnnouncementBar.jsx / .css
│   │   │   ├── Header.jsx / .css
│   │   │   ├── Hero.jsx / .css
│   │   │   ├── CategoryGrid.jsx / .css
│   │   │   ├── ProductCard.jsx / .css
│   │   │   ├── FeaturedProducts.jsx / .css
│   │   │   ├── EditorialShowcase.jsx / .css
│   │   │   ├── BrandStory.jsx / .css
│   │   │   ├── Features.jsx / .css
│   │   │   ├── Newsletter.jsx / .css
│   │   │   ├── CartDrawer.jsx / .css
│   │   │   ├── QuickViewModal.jsx / .css
│   │   │   ├── SearchModal.jsx / .css
│   │   │   ├── AccountModal.jsx
│   │   │   ├── SystemHealthModal.jsx / .css
│   │   │   ├── Toast.jsx / .css
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── Footer.jsx / .css
│   │   ├── context/
│   │   │   └── ShopContext.jsx   # Cart & Wishlist state with LocalStorage
│   │   ├── data/
│   │   │   └── products.js       # Curated local demo catalog (Phase 2)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx      # Search, filter, sort discovery
│   │   │   ├── CategoryPage.jsx  # /category/:category
│   │   │   ├── ProductDetailPage.jsx # /product/:id (variants & validation)
│   │   │   ├── WishlistPage.jsx  # /wishlist
│   │   │   ├── CartPage.jsx      # /cart (full shopping bag & demo checkout)
│   │   │   ├── AboutPage.jsx     # /about
│   │   │   └── NotFoundPage.jsx  # Branded 404
│   │   ├── services/
│   │   │   ├── api.js            # Backend health communication
│   │   │   └── productService.js # Product service layer (ready for Phase 3)
│   │   ├── styles/
│   │   │   ├── variables.css     # Brand design tokens & colors
│   │   │   └── index.css         # CSS reset, utilities, typography
│   │   ├── test/                 # Vitest test suite
│   │   │   ├── setup.js
│   │   │   └── App.test.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                      # FastAPI + SQLite Backend
│   ├── alembic/                  # Database migration management
│   │   ├── env.py
│   │   └── versions/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── health.py     # GET /api/v1/health
│   │   │       └── __init__.py
│   │   ├── core/
│   │   │   └── config.py         # Pydantic Settings & CORS
│   │   ├── db/
│   │   │   └── session.py        # SQLAlchemy 2.x session & get_db
│   │   ├── models/
│   │   │   └── base.py           # DeclarativeBase foundation
│   │   ├── schemas/
│   │   │   └── health.py         # Sanitized health response schema
│   │   ├── services/
│   │   └── main.py               # FastAPI application startup & routes
│   ├── tests/                    # Pytest test suite
│   │   ├── conftest.py           # Isolated in-memory DB & TestClient
│   │   └── test_health.py
│   ├── alembic.ini
│   └── requirements.txt
│
├── .env.example                  # Environment configuration template
├── .gitignore                    # Comprehensive ignores for Python, Node, DB
└── README.md
```

---

## Prerequisites

- **Python:** 3.11+
- **Node.js:** v20+ (Verified on v24.15.0)
- **npm:** 10+ (Verified on 11.12.1)
- **Git:** 2.40+

---

## Windows PowerShell Setup Instructions

### 1. Backend Setup

Open a Windows PowerShell terminal in the repository root:

```powershell
# Navigate to backend
cd backend

# Create virtual environment (.venv)
python -m venv .venv

# Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

# Run backend automated tests
pytest -v

# Start FastAPI server on localhost:8000
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Once started, the backend is accessible at:
- **API Root:** `http://127.0.0.1:8000/`
- **Sanitized Health Endpoint:** `http://127.0.0.1:8000/api/v1/health`
- **Interactive OpenAPI Documentation:** `http://127.0.0.1:8000/docs`

### 2. Frontend Setup

In a second Windows PowerShell terminal:

```powershell
# Navigate to frontend
cd frontend

# Install npm dependencies
npm install

# Run Vitest unit tests
npm test

# Build production bundle
npm run build

# Start Vite development server
npm run dev
```

The customer storefront will be running at `http://localhost:3000/`.

---

## Storefront Routes (Phase 2)

| Route | Description |
| :--- | :--- |
| `/` | **Homepage:** Announcement bar, Hero, 6 Category cards, Featured Products with Quick View, Editorial Bridal Vault, Brand Story, Pillars, and Newsletter. |
| `/shop` | **The Complete Boutique:** Full catalog discovery, instant name/fabric search, category pills, price sorting, empty state, and filter resets. |
| `/category/:category` | **Category Collection:** Dynamic filtered views for `sarees`, `kurtis`, `lehengas`, `salwar-suits`, `festive-wear`, and `new-arrivals`. |
| `/product/:id` | **Product Detail Page:** High-res image gallery, required size variant selector with validation, color picker, quantity adjuster, Add-to-Bag, Wishlist toggle, and craft accordions. |
| `/wishlist` | **My Saved Heirlooms:** Grid of all items bookmarked by the customer with immediate state changes and move-to-bag capabilities. |
| `/cart` | **Shopping Bag:** Review selected items, adjust quantities, apply demo discount codes (`WELCOME10`), review order summary, and simulate demo checkout. |
| `/about` | **About the Atelier:** Brand ethos, handloom weaver partnerships, Silk Mark certification, and bespoke sizing philosophy. |
| `*` | **Branded 404 Page:** Graceful error boundary preventing blank screens and guiding patrons back to the collections. |

---

## Verified Test & Build Results

### Backend Test Suite (`pytest`):
```text
tests/test_health.py::test_health_check_success PASSED
tests/test_health.py::test_root_endpoint PASSED
tests/test_health.py::test_docs_available PASSED
tests/test_health.py::test_health_check_database_failure PASSED

4 passed in 0.21s
```

### Frontend Test Suite (`vitest`):
```text
✓ src/test/App.test.jsx (7 tests)
  ✓ renders official brand name and tagline in header and hero
  ✓ renders official brand logo with accessible alt text
  ✓ renders navigation links for all required collections
  ✓ renders the 6 required category cards on the homepage
  ✓ allows toggling an item in wishlist with immediate state update
  ✓ navigates to shop page and displays products
  ✓ renders branded 404 not-found page for non-existent routes

7 passed in 1.28s
```

### Production Build (`vite build`):
```text
dist/index.html                   1.25 kB │ gzip:  0.66 kB
dist/assets/index-DaF_oqSl.css   56.01 kB │ gzip:  9.31 kB
dist/assets/index-LqJaEp4a.js   286.73 kB │ gzip: 85.59 kB
✓ built in 5.33s
```

---

## Official Brand Logo Note

The application is pre-configured to automatically display the official user-supplied brand logo at:
`frontend/public/images/logo.png` (or `logo.jpg`).

When the image file is placed in this directory, it will immediately display in the Header and Footer. While awaiting file transfer, the application renders a graceful handcrafted burgundy-and-gold typographic monogram (`ES`) without disrupting layout or aesthetics.

---

## Phase 3: Next Step

**Phase 3: Database & Backend Integration**
- Implement database tables for Products, Categories, Customer Accounts, and Orders via SQLAlchemy 2.x and Alembic migrations.
- Create FastAPI endpoints (`/api/v1/products`, `/api/v1/categories`, `/api/v1/orders`).
- Replace `frontend/src/data/products.js` with live data fetched via `productService.js`.
- Add backend order creation, cart persistence, and checkout fulfillment.
