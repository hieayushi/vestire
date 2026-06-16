"/* =========================================================
   main.js — homepage, shop, cart pages
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('copyYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateCartBadge();

  // route by page
  if (document.getElementById('featuredGrid')) renderHomePage();
  if (document.getElementById('shopGrid')) renderShopPage();
  if (document.getElementById('cartItems')) renderCartPage();

  // newsletter
  const nl = document.getElementById('newsletterForm');
  if (nl) {
    nl.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = document.getElementById('newsletterNote') || document.querySelector('[data-testid=\"newsletter-note\"]');
      if (note) note.textContent = 'Thanks! Check your inbox for 10% off.';
      nl.reset();
    });
  }
});

/* ---------- Homepage ---------- */
function renderHomePage() {
  const hero = getHero();
  const heroImg = document.getElementById('heroImage');
  if (heroImg) heroImg.src = hero.image;
  const titleEl = document.querySelector('[data-testid=\"hero-title\"]');
  const subEl = document.querySelector('[data-testid=\"hero-subtitle\"]');
  const eyebrowEl = document.querySelector('[data-testid=\"hero-eyebrow\"]');
  const tagEl = document.querySelector('.hero-tag');
  if (titleEl) titleEl.innerHTML = hero.title;
  if (subEl) subEl.textContent = hero.subtitle;
  if (eyebrowEl) eyebrowEl.textContent = hero.eyebrow;
  if (tagEl && hero.caption) tagEl.textContent = hero.caption;

  // Categories
  const catsGrid = document.getElementById('categoriesGrid');
  if (catsGrid) {
    catsGrid.innerHTML = DEFAULT_CATEGORIES.map(c => `
      <div class=\"col-md-4\">
        <a href=\"shop.html?cat=${encodeURIComponent(c.name)}\" class=\"cat-card d-block\" data-testid=\"cat-card-${c.name.toLowerCase()}\">
          <img src=\"${c.image}\" alt=\"${c.name}\"/>
          <div class=\"cat-card-overlay\"></div>
          <div class=\"cat-card-label\">
            <h4>${c.name}</h4>
            <span class=\"arrow\"><i class=\"fa-solid fa-arrow-right\"></i></span>
          </div>
        </a>
      </div>`).join('');
  }

  // Featured (first 4 products)
  const featured = document.getElementById('featuredGrid');
  if (featured) {
    const products = getProducts().slice(0, 4);
    featured.innerHTML = products.map(p => productCardHtml(p, 'col-md-6 col-lg-3')).join('');
    attachAddToCartHandlers(featured);
  }
}

/* ---------- Shop page ---------- */
function renderShopPage() {
  const params = new URLSearchParams(window.location.search);
  const activeCat = params.get('cat') || 'All';
  const products = getProducts();
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  // Title
  const titleEl = document.getElementById('shopTitle');
  const subEl = document.getElementById('shopSubtitle');
  if (activeCat !== 'All' && titleEl) {
    titleEl.textContent = activeCat;
    subEl.textContent = `Explore our curated ${activeCat.toLowerCase()} edit.`;
  }

  // Pills
  const pillsEl = document.getElementById('filterPills');
  pillsEl.innerHTML = categories.map(c => `
    <button class=\"filter-pill ${c === activeCat ? 'active' : ''}\" data-cat=\"${c}\" data-testid=\"pill-${c.toLowerCase()}\">${c}</button>
  `).join('');
  pillsEl.querySelectorAll('.filter-pill').forEach(b => {
    b.addEventListener('click', () => {
      const cat = b.dataset.cat;
      const url = new URL(window.location.href);
      if (cat === 'All') url.searchParams.delete('cat');
      else url.searchParams.set('cat', cat);
      window.location.href = url.toString();
    });
  });

  // Sort
  const sortEl = document.getElementById('sortSelect');
  sortEl.addEventListener('change', () => renderGrid());

  function renderGrid() {
    let list = getProducts();
    if (activeCat !== 'All') list = list.filter(p => p.category === activeCat);
    const sortVal = sortEl.value;
    if (sortVal === 'low') list.sort((a,b) => a.price - b.price);
    if (sortVal === 'high') list.sort((a,b) => b.price - a.price);
    if (sortVal === 'newest') list.reverse();

    const grid = document.getElementById('shopGrid');
    const empty = document.getElementById('emptyState');
    if (!list.length) {
      grid.innerHTML = '';
      empty.classList.remove('d-none');
      return;
    }
    empty.classList.add('d-none');
    grid.innerHTML = list.map(p => productCardHtml(p, 'col-6 col-md-4 col-lg-3')).join('');
    attachAddToCartHandlers(grid);
  }
  renderGrid();
}

/* ---------- Product card ---------- */
function productCardHtml(p, colCls) {
  return `
    <div class=\"${colCls}\">
      <div class=\"product-card\" data-testid=\"product-${p.id}\">
        <div class=\"product-image-wrap\">
          ${p.tag ? `<span class=\"product-tag\">${p.tag}</span>` : ''}
          <img src=\"${p.image}\" alt=\"${p.name}\" loading=\"lazy\"/>
          <button class=\"add-to-cart-btn\" data-add=\"${p.id}\" data-testid=\"add-to-cart-${p.id}\">Add to bag</button>
        </div>
        <div class=\"product-meta\">
          <div>
            <p class=\"product-name\">${p.name}</p>
            <span class=\"product-cat\">${p.category}</span>
          </div>
          <span class=\"product-price\">${formatPrice(p.price)}</span>
        </div>
      </div>
    </div>`;
}

function attachAddToCartHandlers(scope) {
  scope.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(btn.dataset.add);
    });
  });
}

/* ---------- Cart ---------- */
function addToCart(productId) {
  const products = getProducts();
  const p = products.find(x => x.id === productId);
  if (!p) return;
  const cart = getCart();
  const existing = cart.find(c => c.id === productId);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 });
  setCart(cart);
  updateCartBadge();
  showToast(`${p.name} added to bag`);
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, x) => s + x.qty, 0);
  document.querySelectorAll('[data-testid=\"cart-count\"]').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

function renderCartPage() {
  const wrap = document.getElementById('cartItems');
  const empty = document.getElementById('emptyCart');
  const summary = document.getElementById('summaryCard');
  const cart = getCart();

  if (!cart.length) {
    wrap.innerHTML = '';
    empty.classList.remove('d-none');
    summary.style.opacity = '.4';
    summary.querySelector('#checkoutBtn').disabled = true;
    document.getElementById('subtotal').textContent = formatPrice(0);
    document.getElementById('total').textContent = formatPrice(0);
    return;
  }

  wrap.innerHTML = cart.map(item => `
    <div class=\"cart-row\" data-testid=\"cart-row-${item.id}\">
      <img src=\"${item.image}\" alt=\"${item.name}\"/>
      <div>
        <p class=\"product-name mb-1\">${item.name}</p>
        <span class=\"product-cat\">${formatPrice(item.price)}</span>
        <div class=\"qty-control\" data-testid=\"qty-${item.id}\">
          <button data-dec=\"${item.id}\" aria-label=\"Decrease\">−</button>
          <span data-qty=\"${item.id}\">${item.qty}</span>
          <button data-inc=\"${item.id}\" aria-label=\"Increase\">+</button>
        </div>
        <br/>
        <button class=\"remove-btn\" data-remove=\"${item.id}\" data-testid=\"remove-${item.id}\">Remove</button>
      </div>
      <div class=\"cart-price-col\">
        <span class=\"product-price\">${formatPrice(item.price * item.qty)}</span>
      </div>
    </div>`).join('');

  // handlers
  wrap.querySelectorAll('[data-inc]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.inc, +1)));
  wrap.querySelectorAll('[data-dec]').forEach(b => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  wrap.querySelectorAll('[data-remove]').forEach(b => b.addEventListener('click', () => removeFromCart(b.dataset.remove)));

  // summary
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('total').textContent = formatPrice(subtotal);

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    setCart([]);
    updateCartBadge();
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
    document.getElementById('successModal').addEventListener('hidden.bs.modal', () => renderCartPage(), { once: true });
  });
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  setCart(cart);
  renderCartPage();
  updateCartBadge();
}

function removeFromCart(id) {
  let cart = getCart().filter(c => c.id !== id);
  setCart(cart);
  renderCartPage();
  updateCartBadge();
}

/* ---------- Toast (lightweight, used on storefront) ---------- */
function showToast(msg) {
  let stack = document.querySelector('.toast-stack');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toast-stack';
    document.body.appendChild(stack);
  }
  const t = document.createElement('div');
  t.className = 'toast-item success';
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}
"
