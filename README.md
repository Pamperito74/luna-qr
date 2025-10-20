# QR Code Generator – Private & High-Resolution

![QR Generator](public/placeholder.png)

![Node.js](https://img.shields.io/badge/Node.js-v18.x-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Build](https://img.shields.io/badge/Build-Pass-brightgreen)

A **high-resolution, privacy-first QR code generator**. Self-hosted and fully static frontend with Node.js backend — generates clean QR codes without tracking or collecting any user data.

---

## 🌟 Features

* ✅ High-resolution QR codes (1920×1920 px)
* ✅ Pixel-perfect rendering with `image-rendering: pixelated`
* ✅ Download QR codes as PNG
* ✅ Privacy-safe: no tracking or analytics
* ✅ Responsive for mobile and desktop
* ✅ Optional donation buttons

---

## 🚀 Demo

> Replace with your live URL:
> `https://yourdomain.com`

---

## 📸 Screenshot

![Screenshot](public/placeholder.png)

---

## 🛠 Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/qr-generator.git
cd qr-generator
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the server**

```bash
node server.js
```

4. Open your browser at `http://localhost:3000`

---

## 🗂 Project Structure

```
qr-generator/
├─ public/
│  ├─ index.html       # Main page
│  ├─ style.css        # Styles
│  ├─ placeholder.png  # Placeholder QR
│  └─ favicon.png      # Tab icon
├─ server.js           # Express + QR code generator
├─ package.json
└─ README.md
```

---

## ⚡ Usage

1. Enter a URL, email, or text
2. Click ⚙️ **Generate**
3. QR code appears in high resolution
4. Click ⬇️ **Download** to save

Clear input with 🧹 **Clear** button — returns placeholder image.

---

## 🛡 Privacy & Security

* No tracking of input or scans
* No analytics or cookies
* Generates clean QR codes **directly on the server**

> Unlike many QR generators online, this ensures your data is private and safe.

---

## 🔍 SEO & Indexing Tips

1. Publicly accessible site
2. Descriptive `<title>` and `<meta>` in `index.html`:

```html
<title>Private QR Code Generator – No Tracking, Fast & Secure</title>
<meta name="description" content="Generate clean, private QR codes instantly. No tracking, no data collection — just a safe, fast QR code generator on your own server.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://yourdomain.com/">
```

3. Add `robots.txt` and `sitemap.xml` for faster indexing
4. Submit to [Google Search Console](https://search.google.com/search-console/)

---

## 🎨 Favicon

Place your favicon in `public/` and link in `<head>`:

```html
<link rel="icon" type="image/png" href="favicon.png" />
```

---

## 📦 Dependencies

* [Node.js](https://nodejs.org/)
* [Express](https://www.npmjs.com/package/express)
* [qrcode](https://www.npmjs.com/package/qrcode)

Install via npm:

```bash
npm install express qrcode
```

---

## 📝 License

MIT License – free to use and modify.
