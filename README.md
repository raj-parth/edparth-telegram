# 🎓 EdParth — Official Educational Channels Hub

A high-performance, retro-modern editorial Telegram channels directory website for **EdParth**, featuring an Awwwards-grade visual identity (`Big Shoulders Display` + `Plus Jakarta Sans`) and a rich color palette (Pine Green `#054d3f`, Vintage Mustard `#f8cc49`, Midnight Navy `#0f1040`, and Dusty Rose `#ecc0bd`).

---

## 📌 Included Channels

1. **EdParth (MAIN)** — `https://t.me/EdParth`
2. **EdParth Books & Notes** — `https://t.me/edparthbooks`
3. **MISSION 100 JEE 2027 PW** — `https://t.me/Arjuna32027`
4. **EDPARTH - Ethical Hacking & Cyber Security** — `https://t.me/edparthhacking`
5. **CODE WITH HARRY** — `https://t.me/+XaQDzN1vxcM1MWQ9`

---

## 📁 Project Structure

```
d:/telegramchannelwebsite/
├── index.html            # Core landing directory with Open Graph & SEO tags
├── 404.html              # Custom themed 404 page for broken routes
├── robots.txt            # Search engine crawling rules
├── sitemap.xml           # XML sitemap for Google indexing
├── netlify.toml          # Production security headers (CSP, HSTS, X-Frame-Options)
├── assets/               # Local high-res assets & icons
│   ├── edparth_icon.jpg  # 1:1 brand emblem mark
│   ├── favicon.png       # Browser tab favicon
│   ├── edparth_logo.svg  # Scalable vector logo
│   ├── edparth.jpg       # EdParth Official cover & avatar
│   ├── edparthbooks.jpg  # Books & Notes channel image
│   ├── arjuna.jpg        # Arjuna PW channel image
│   ├── edparthhacking.jpg # Ethical Hacking channel image
│   └── codewithharry.jpg # Code With Harry channel image
├── css/
│   └── style.css         # Complete Awwwards poster styling & responsive design
├── js/
│   ├── channels-data.js  # Clean data layer with channel links & metadata
│   └── app.js            # Live search, category filtering, copy link, and popup
└── README.md             # Documentation & deployment guide
```

---

## 🛡️ Security Audit & Hardening Configured

The website is hardened for production via `netlify.toml`:
* **Content Security Policy (CSP):** Restricts script, style, and image sources to prevent XSS.
* **X-Frame-Options (DENY):** Completely prevents clickjacking and unauthorized iframe embedding.
* **X-Content-Type-Options (nosniff):** Disables MIME type sniffing attacks.
* **Referrer-Policy:** Strict cross-origin security prevents URL parameter leaks.
* **Permissions-Policy:** Locks down unnecessary browser sensors and APIs.
* **HSTS (HTTP Strict Transport Security):** Enforces HTTPS encryption.
* **Safe External Links:** Every external Telegram link uses `rel="noopener noreferrer"`.
* **Input Sanitization:** All user inputs and query filters are escaped with `escapeHtml()` and `escapeAttr()`.

---

## 🚀 Deployment Instructions for Netlify

### Option 1: Drag & Drop (Instant 30-Second Deploy)
1. Go to **[https://app.netlify.com](https://app.netlify.com)** and log in.
2. Navigate to the **Sites** tab.
3. Drag & drop the entire **`d:\telegramchannelwebsite`** folder into the upload zone.
4. Your website is instantly live with free HTTPS on an address like `https://edparth.netlify.app`.

### Option 2: Via Git & GitHub
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete EdParth directory website"
   git remote add origin https://github.com/<your-username>/edparth-hub.git
   git push -u origin main
   ```
2. In Netlify, click **"Add new site"** → **"Import an existing project"** → Choose GitHub and select your repository.
3. Netlify will automatically detect `netlify.toml` and deploy updates automatically whenever you push code!
