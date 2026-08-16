# Responsive Portfolio — Project 1 (DecodeLabs Full Stack Track)

A mobile-first, responsive personal portfolio built with **pure HTML5, CSS3, and vanilla JavaScript** — no frameworks — as part of the DecodeLabs Full Stack Development internship, Project 1: *Responsive Frontend Interface*.

## 🔗 Live Demo
_Add your GitHub Pages / Netlify link here after deploying._

## ✨ Features
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `article`, `footer`) for accessibility and SEO
- Mobile-first responsive layout using **CSS Grid** (page structure) and **Flexbox** (components)
- Breakpoints at `768px` (tablet) and `1024px` (desktop)
- Fluid typography with `clamp()`
- Accessible mobile navigation (keyboard support, `aria-expanded`, focus states)
- Client-side contact form validation
- Zero dependencies — no build step required

## 🎨 Design System
| Token | Value |
|---|---|
| Moonlit Grey (background) | `#F2F0EA` |
| Mocha Mousse (accent) | `#A5856F` |
| Ethereal Blue (accent) | `#A0D4E0` |
| Blueprint Navy (contrast) | `#1D2A35` |
| Headings | Montserrat |
| Body | Open Sans |
| Data/labels | JetBrains Mono |

## 📁 Project Structure
```
portfolio/
├── index.html      # Semantic page structure
├── style.css        # Mobile-first responsive styling
├── script.js         # Nav toggle, scroll-spy, form validation
└── README.md
```

## 🚀 Running Locally
No build tools needed — just open `index.html` in a browser, or serve it locally:
```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

## 🧭 How to Personalize
1. Replace the name, email, and social links in `index.html`.
2. Swap the three placeholder project cards under `#projects` with real work.
3. Wire up `contact-form` in `script.js` to a real backend or a service like Formspree.
4. Update `README.md`'s live demo link once deployed (GitHub Pages is the fastest option).

## 📦 Deploying to GitHub Pages
1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under "Build and deployment", select **Deploy from a branch**, branch `main`, folder `/root`.
4. Your site will be live at `https://<username>.github.io/<repo-name>/`.

---
Built for the DecodeLabs Internship Program — Full Stack Development, Project 1.
