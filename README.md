# FCP Sunrise Travel & Tours Inc. Website

Modern, production-ready travel agency website built with HTML, CSS, JavaScript, Three.js, GSAP, Swiper, AOS, Node.js, Express, Nodemailer, and MongoDB.

## Brand
- Primary Blue: `#1498cc`
- Sunrise Yellow: `#ffdf00`
- Tagline: **Creating Memories. Breaking the Distance.**

## Pages
- `index.html` – homepage with hero video, loader, counters, package slider, and interactive 3D globe
- `destinations.html` – destination explorer cards
- `services.html` – services and online services glassmorphism grid
- `booking.html` – airline booking mock search/results
- `contact.html` – inquiry form

## Backend
- `server.js` provides `/api/inquiry` endpoint
- Stores inquiries in MongoDB (if configured)
- Sends email via Nodemailer to `fcpsunrise@gmail.com`

## Local Run
```bash
npm install
npm start
```
Then open `http://localhost:3000`.

## GitHub Pages Deployment
This project is static-first and deployable with GitHub Pages. The contact form falls back to `mailto:` when backend is unavailable.

## Structure
```
index.html
destinations.html
services.html
booking.html
contact.html
css/style.css
js/script.js
js/map.js
js/animations.js
assets/images/
assets/videos/
assets/logo/
server.js
package.json
.env.example
README.md
```
