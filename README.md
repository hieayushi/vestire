"# VESTIRE — Clothing Store Demo Website

A fully responsive, production-quality clothing boutique website built with **HTML + CSS + Bootstrap 5 + Vanilla JavaScript**. Includes a password-protected admin panel where the owner can add/edit/delete products and customise the homepage hero — all changes persist in the browser via `localStorage`. **No backend required** — deploys for free on GitHub Pages.

---

## What's inside

```
website/
├── index.html        ← Homepage (hero, categories, featured, story, newsletter)
├── shop.html         ← Full catalog with filters + sort
├── cart.html         ← Shopping cart with quantity controls + checkout demo
├── admin.html        ← Admin login + dashboard (products, hero, settings)
├── css/
│   └── style.css     ← All custom styling
├── js/
│   ├── data.js       ← Default products, hero defaults, localStorage helpers
│   ├── main.js       ← Homepage / shop / cart logic
│   └── admin.js      ← Admin dashboard logic
└── README.md         ← This file
```

## Features

- **Storefront**
  - Editorial-style homepage with hero, categories, featured products, brand story, testimonial, newsletter
  - Shop page with category filters & price/newest sorting
  - Add-to-cart with quantity controls, live cart badge, demo checkout flow
  - Mobile-first, fully responsive

- **Admin Panel** (`/admin.html`)
  - Password-protected (default: `admin123`)
  - **Products tab** — add / edit / delete with name, category, price, image URL, description, tag
  - **Homepage tab** — change hero eyebrow, headline, subtitle, image, caption (with live preview)
  - **Settings tab** — change admin password, reset content to defaults
  - All changes saved instantly to browser `localStorage`

- **Demo-ready**
  - 8 pre-loaded sample products across Women / Men / Accessories
  - Free Unsplash imagery
  - Works offline once loaded

---

## Default Admin Login

| Field    | Value      |
|----------|------------|
| URL      | `/admin.html` |
| Password | `admin123` |

> The password can be changed in **Settings** tab after login.

---

## How to deploy on GitHub Pages (step-by-step, FREE)

### 1. Create a GitHub account
If you don't have one, sign up at [github.com](https://github.com).

### 2. Create a new repository
- Click **+** (top-right) → **New repository**
- Repository name: `vestire` (or whatever brand name you want — this becomes your URL)
- Set **Public**
- Check **Add a README file**
- Click **Create repository**

### 3. Upload the website files
**Option A — via web (easiest, no software):**
1. Open your new repo on github.com
2. Click **Add file → Upload files**
3. Drag in **all the contents of the `website` folder** (i.e. `index.html`, `shop.html`, `cart.html`, `admin.html`, the `css/` folder, and the `js/` folder)
4. Scroll down → **Commit changes**

**Option B — via Git command line:**
```bash
git clone https://github.com/YOUR-USERNAME/vestire.git
cd vestire
# Copy all files from the website/ folder here
git add .
git commit -m \"Initial site\"
git push origin main
```

### 4. Enable GitHub Pages
1. In your repo, go to **Settings → Pages** (left sidebar)
2. Under **Branch**, select `main` and the folder `/ (root)`
3. Click **Save**
4. Wait ~30–60 seconds. GitHub will show a green banner with your URL:

   ```
   https://YOUR-USERNAME.github.io/vestire/
   ```

### 5. Share with clients
Send the URL above. The admin panel is at:
```
https://YOUR-USERNAME.github.io/vestire/admin.html
```

---

## Customising for each client

Want to give each client a different look? Easiest workflow:

1. **Re-brand**: open `index.html`, `shop.html`, `cart.html`, `admin.html` and find/replace `VESTIRE` with the client's brand name. Update the page `<title>` tags.
2. **Colors**: edit the top of `css/style.css` — only ~6 CSS variables to change:
   ```css
   --bg: #f6f1ea;       /* background */
   --ink: #1a1a1a;      /* text */
   --accent: #b5552d;   /* highlight color */
   --accent-2: #7a7458; /* secondary */
   ```
3. **Default products**: edit `DEFAULT_PRODUCTS` in `js/data.js` to match the client's catalog.
4. Push to a **new GitHub repo per client** (e.g. `aanya-fashion`, `local-boutique`) — each gets its own URL.

---

## Note on persistence

Because the site is static (perfect for GitHub Pages = free), admin changes are saved in the **visitor's browser**, not on a server. That means:
- Changes the admin makes on their device persist on their device.
- Other visitors will see the *default* products until you push code changes.

For each client demo, you have two options:
1. **Quick demo**: log in to admin, customise products on your laptop, walk them through it.
2. **Production-ready**: after they sign on, edit `DEFAULT_PRODUCTS` in `data.js` with their real catalog and push to GitHub — every visitor sees the real data.

If they later want a real database (so any visitor sees the same admin-managed products from anywhere), let me know — we can upgrade to a backend version.

---

## Local preview

Just open `index.html` in your browser — no server needed.

For best results (so images and Bootstrap CDN load consistently), use a tiny local server:
```bash
cd website
python -m http.server 8080
# then open http://localhost:8080
```

---

Made with care · Ready to ship.
"
