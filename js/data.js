/* =========================================================
   data.js — default content + localStorage helpers
   ========================================================= */

const STORAGE_KEYS = {
  products: 'vestire.products.v3',
  hero: 'vestire.hero.v3',
  cart: 'vestire.cart.v3',
  pw: 'vestire.pw.v3',
  session: 'vestire.session.v3'
};

const DEFAULT_PASSWORD = 'admin123';

const DEFAULT_HERO = {
  eyebrow: 'Festive · Heritage 26',
  title: 'Elegance in tradition.<br/><em>Modern silhouettes.</em>',
  subtitle: 'A curated collection of contemporary Indian garments — premium handloom cottons, heritage linens, and timeless silhouettes.',
  image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?w=1100&q=80',
  caption: 'Look 01 — Handwoven Chanderi Silk'
};

const DEFAULT_PRODUCTS = [
  { id: 'p01', name: 'Floral Anarkali Set', category: 'Women', price: 4890, tag: 'Best seller',
    image: 'https://images.unsplash.com/photo-1608962714006-29d0b27e8a00?w=900&q=80',
    desc: 'Graceful floral printed georgette Anarkali with cotton lining and matching dupatta.' },
  { id: 'p02', name: 'Silk Banarasi Saree', category: 'Women', price: 6490, tag: 'New',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&q=80',
    desc: 'Handwoven pure Banarasi silk saree with intricate zari work. A festive masterpiece.' },
  { id: 'p03', name: 'Pastel Chanderi Kurti', category: 'Women', price: 2990, tag: '',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&q=80',
    desc: 'Breathable hand-spun Chanderi cotton kurti with delicate gold embroidery.' },
  { id: 'p04', name: 'Royal Sherwani Jacket', category: 'Men', price: 7990, tag: 'New',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&q=80',
    desc: 'Structured raw silk sherwani jacket in rich ivory with heritage brass buttons.' },
  { id: 'p05', name: 'Classic Linen Kurta', category: 'Men', price: 3290, tag: '',
    image: 'https://images.unsplash.com/photo-1605518216992-6ca5ff4e061e?w=900&q=80',
    desc: 'Premium pure linen kurta with mandarin collar, cut for a relaxed fit.' },
  { id: 'p06', name: 'Handcrafted Nehru Jacket', category: 'Men', price: 3890, tag: 'Popular',
    image: 'https://images.unsplash.com/photo-1597983073492-748ff57aa4c7?w=900&q=80',
    desc: 'Tussar silk blend Nehru jacket in textured beige. Perfect for smart festive layering.' },
  { id: 'p07', name: 'Embroidered Lehenga Choli', category: 'Children', price: 2490, tag: 'New',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80',
    desc: 'Vibrant mirror-work embroidered lehenga choli for girls. Perfect for festivals and celebrations.' },
  { id: 'p08', name: 'Printed Cotton Kurta Set', category: 'Children', price: 1490, tag: '',
    image: 'https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=900&q=80',
    desc: 'Soft breathable cotton printed kurta-pyjama set for boys. Easy everyday wear.' }
];

const DEFAULT_CATEGORIES = [
  { name: 'Women',    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
  { name: 'Men',      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&q=80' },
  { name: 'Children', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&q=80' }
];

/* ---------- generic storage helpers ---------- */
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- domain helpers ---------- */
function getProducts() { return loadJSON(STORAGE_KEYS.products, DEFAULT_PRODUCTS); }
function setProducts(list) { saveJSON(STORAGE_KEYS.products, list); }

function getHero() { return loadJSON(STORAGE_KEYS.hero, DEFAULT_HERO); }
function setHero(h) { saveJSON(STORAGE_KEYS.hero, h); }

function getCart() { return loadJSON(STORAGE_KEYS.cart, []); }
function setCart(c) { saveJSON(STORAGE_KEYS.cart, c); }

function getPassword() { return localStorage.getItem(STORAGE_KEYS.pw) || DEFAULT_PASSWORD; }
function setPassword(p) { localStorage.setItem(STORAGE_KEYS.pw, p); }

function isLoggedIn() { return sessionStorage.getItem(STORAGE_KEYS.session) === '1'; }
function login() { sessionStorage.setItem(STORAGE_KEYS.session, '1'); }
function logout() { sessionStorage.removeItem(STORAGE_KEYS.session); }

function resetAll() {
  localStorage.removeItem(STORAGE_KEYS.products);
  localStorage.removeItem(STORAGE_KEYS.hero);
}

function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function uid() {
  return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

