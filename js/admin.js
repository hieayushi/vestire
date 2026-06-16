"/* =========================================================
   admin.js — login, products CRUD, hero editor, settings
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn()) showDashboard();
  else showLogin();

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // tabs
  document.querySelectorAll('.admin-link[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  // products
  document.getElementById('newProductBtn').addEventListener('click', () => openProductModal());
  document.getElementById('saveProductBtn').addEventListener('click', saveProduct);

  // hero
  document.getElementById('heroForm').addEventListener('submit', saveHero);
  ['heroEyebrow','heroTitle','heroSubtitle','heroImageUrl','heroCaption'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateHeroPreview);
  });

  // settings
  document.getElementById('pwForm').addEventListener('submit', changePassword);
  document.getElementById('resetBtn').addEventListener('click', handleReset);
});

/* ---------- Auth ---------- */
function showLogin() {
  document.getElementById('loginView').classList.remove('d-none');
  document.getElementById('dashView').classList.add('d-none');
}
function showDashboard() {
  document.getElementById('loginView').classList.add('d-none');
  document.getElementById('dashView').classList.remove('d-none');
  renderProducts();
  loadHeroForm();
  updateHeroPreview();
}

function handleLogin(e) {
  e.preventDefault();
  const val = document.getElementById('pwInput').value;
  const err = document.getElementById('loginError');
  if (val === getPassword()) {
    err.classList.add('d-none');
    login();
    showDashboard();
  } else {
    err.classList.remove('d-none');
  }
}
function handleLogout(e) {
  e.preventDefault();
  logout();
  showLogin();
  document.getElementById('pwInput').value = '';
}

/* ---------- Tabs ---------- */
function switchTab(name) {
  document.querySelectorAll('.admin-link[data-tab]').forEach(l => {
    l.classList.toggle('active', l.dataset.tab === name);
  });
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.classList.toggle('d-none', t.id !== `tab-${name}`);
  });
}

/* ---------- Products CRUD ---------- */
function renderProducts() {
  const list = getProducts();
  const tbody = document.getElementById('productsBody');
  tbody.innerHTML = list.map(p => `
    <tr data-testid=\"row-${p.id}\">
      <td><img src=\"${p.image}\" class=\"row-thumb\" alt=\"\"/></td>
      <td><strong>${p.name}</strong><br/><small class=\"text-muted\">${p.desc || ''}</small></td>
      <td>${p.category}</td>
      <td>${formatPrice(p.price)}</td>
      <td class=\"text-end\">
        <button class=\"action-btn\" data-edit=\"${p.id}\" data-testid=\"edit-${p.id}\"><i class=\"fa-solid fa-pen\"></i> Edit</button>
        <button class=\"action-btn delete\" data-del=\"${p.id}\" data-testid=\"del-${p.id}\"><i class=\"fa-solid fa-trash\"></i></button>
      </td>
    </tr>`).join('') || `<tr><td colspan=\"5\" class=\"text-center text-muted py-5\">No products yet. Click \"New product\" to add one.</td></tr>`;

  tbody.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => openProductModal(b.dataset.edit)));
  tbody.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => deleteProduct(b.dataset.del)));

  // stats
  document.getElementById('statCount').textContent = list.length;
  document.getElementById('statCats').textContent = new Set(list.map(p => p.category)).size;
  const avg = list.length ? Math.round(list.reduce((s, x) => s + Number(x.price), 0) / list.length) : 0;
  document.getElementById('statAvg').textContent = formatPrice(avg);
}

let editingId = null;
function openProductModal(id) {
  editingId = id || null;
  const modal = new bootstrap.Modal(document.getElementById('productModal'));
  document.getElementById('productModalTitle').textContent = id ? 'Edit product' : 'New product';
  document.getElementById('productForm').reset();
  document.getElementById('prodId').value = '';

  if (id) {
    const p = getProducts().find(x => x.id === id);
    if (p) {
      document.getElementById('prodId').value = p.id;
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodPrice').value = p.price;
      document.getElementById('prodCategory').value = p.category;
      document.getElementById('prodTag').value = p.tag || '';
      document.getElementById('prodImage').value = p.image;
      document.getElementById('prodDesc').value = p.desc || '';
    }
  }
  modal.show();
}

function saveProduct() {
  const form = document.getElementById('productForm');
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const id = document.getElementById('prodId').value || uid();
  const data = {
    id,
    name: document.getElementById('prodName').value.trim(),
    price: Number(document.getElementById('prodPrice').value),
    category: document.getElementById('prodCategory').value,
    tag: document.getElementById('prodTag').value.trim(),
    image: document.getElementById('prodImage').value.trim(),
    desc: document.getElementById('prodDesc').value.trim()
  };
  let list = getProducts();
  const idx = list.findIndex(x => x.id === id);
  if (idx >= 0) list[idx] = data;
  else list.unshift(data);
  setProducts(list);
  bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
  renderProducts();
  toast(editingId ? 'Product updated' : 'Product added', 'success');
}

function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  setProducts(getProducts().filter(x => x.id !== id));
  renderProducts();
  toast('Product deleted', 'success');
}

/* ---------- Hero ---------- */
function loadHeroForm() {
  const h = getHero();
  document.getElementById('heroEyebrow').value = h.eyebrow || '';
  document.getElementById('heroTitle').value = h.title || '';
  document.getElementById('heroSubtitle').value = h.subtitle || '';
  document.getElementById('heroImageUrl').value = h.image || '';
  document.getElementById('heroCaption').value = h.caption || '';
}

function updateHeroPreview() {
  document.getElementById('heroPreviewImg').src = document.getElementById('heroImageUrl').value || '';
  document.getElementById('heroPreviewEyebrow').textContent = document.getElementById('heroEyebrow').value;
  document.getElementById('heroPreviewTitle').innerHTML = document.getElementById('heroTitle').value;
  document.getElementById('heroPreviewSub').textContent = document.getElementById('heroSubtitle').value;
}

function saveHero(e) {
  e.preventDefault();
  const data = {
    eyebrow: document.getElementById('heroEyebrow').value.trim(),
    title: document.getElementById('heroTitle').value.trim(),
    subtitle: document.getElementById('heroSubtitle').value.trim(),
    image: document.getElementById('heroImageUrl').value.trim(),
    caption: document.getElementById('heroCaption').value.trim()
  };
  setHero(data);
  const msg = document.getElementById('heroSaved');
  msg.classList.remove('d-none');
  setTimeout(() => msg.classList.add('d-none'), 2200);
  toast('Hero updated — view the homepage to see changes', 'success');
}

/* ---------- Settings ---------- */
function changePassword(e) {
  e.preventDefault();
  const cur = document.getElementById('curPw').value;
  const nw = document.getElementById('newPw').value;
  const msg = document.getElementById('pwMsg');
  if (cur !== getPassword()) {
    msg.textContent = 'Current password is wrong.';
    msg.className = 'ms-3 small text-danger';
    return;
  }
  setPassword(nw);
  document.getElementById('pwForm').reset();
  msg.textContent = 'Password updated ✓';
  msg.className = 'ms-3 small text-success';
  toast('Password changed', 'success');
}

function handleReset() {
  if (!confirm('Reset all products & homepage to default? Your custom data will be lost.')) return;
  resetAll();
  renderProducts();
  loadHeroForm();
  updateHeroPreview();
  toast('All content reset to defaults', 'success');
}

/* ---------- Toast ---------- */
function toast(msg, type) {
  const stack = document.getElementById('toastStack');
  const t = document.createElement('div');
  t.className = 'toast-item ' + (type || '');
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
"
