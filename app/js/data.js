"/* =========================================================
   data.js — default content + localStorage helpers
   ========================================================= */

const STORAGE_KEYS = {
  products: 'vestire.products.v1',
  hero: 'vestire.hero.v1',
  cart: 'vestire.cart.v1',
  pw: 'vestire.pw.v1',
  session: 'vestire.session.v1'
};

const DEFAULT_PASSWORD = 'admin123';

const DEFAULT_HERO = {
  eyebrow: 'Spring · Summer 26',
  title: 'Quietly bold.<br/><em>Effortlessly worn.</em>',
  subtitle: 'A capsule of considered pieces — soft tailoring, breathable linens, and timeless silhouettes designed for the way you actually live.',
  image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1100&q=80',
  caption: 'Look 04 — The Linen Set'
};

const DEFAULT_PRODUCTS = [
  { id: 'p01', name: 'Linen Wrap Dress', category: 'Women', price: 4290, tag: 'New',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=900&q=80',
    desc: 'Lightweight European linen, hand-finished seams. Cut for everyday ease.' },
  { id: 'p02', name: 'Cotton Pleated Trouser', category: 'Women', price: 3490, tag: '',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&q=80',
    desc: 'High-rise, soft pleat front, tapered through the leg.' },
  { id: 'p03', name: 'Oversized Poplin Shirt', category: 'Women', price: 2890, tag: 'Best seller',
    image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&q=80',
    desc: 'Crisp organic cotton poplin with a relaxed drop shoulder.' },
  { id: 'p04', name: 'Merino Crewneck', category: 'Men', price: 3990, tag: '',
    image: 'https://images.unsplash.com/photo-1602810316693-3667c854239a?w=900&q=80',
    desc: 'Fine 18.5-micron merino. Soft, breathable, all-season.' },
  { id: 'p05', name: 'Wide-Leg Chino', category: 'Men', price: 3690, tag: 'New',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=900&q=80',
    desc: 'Heavyweight cotton twill, washed for vintage softness.' },
  { id: 'p06', name: 'Linen Camp Shirt', category: 'Men', price: 2790, tag: '',
    image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=900&q=80',
    desc: 'Open collar, boxy fit, mother-of-pearl buttons.' },
  { id: 'p07', name: 'Woven Leather Belt', category: 'Accessories', price: 1490, tag: '',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900&q=80',
    desc: 'Italian vegetable-tanned leather, brass hardware.' },
  { id: 'p08', name: 'Silk Neck Scarf', category: 'Accessories', price: 1290, tag: 'New',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=900&q=80',
    desc: 'Hand-rolled edges, watercolour botanical print.' }
];

const DEFAULT_CATEGORIES = [
  { name: 'Women', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' },
  { name: 'Men',   image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1611923134239-b9be5816e23d?w=800&q=80' }
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
"
