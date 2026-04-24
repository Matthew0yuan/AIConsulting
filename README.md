# Velix AI(A demo frontend project)
This is a demo frontend project

https://verlixai.com/

React + Vite landing page for `Velix AI`, an AI consulting company website with a tech-style hero, animated visuals, and demo case studies.

## Stack

- React 18
- Vite 5
- Plain CSS

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Project structure

```text
.
|- index.html
|- package.json
|- vite.config.js
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- styles.css
```

## Where to edit things

- Main page structure: [src/App.jsx](C:/Users/inkay/Desktop/AICompany/src/App.jsx)
- Page styling and animations: [src/styles.css](C:/Users/inkay/Desktop/AICompany/src/styles.css)
- App entry point: [src/main.jsx](C:/Users/inkay/Desktop/AICompany/src/main.jsx)

## Quick editing guide

### Change text content

Most visible content is stored near the top of `src/App.jsx` inside arrays:

- `services`: service cards
- `metrics`: hero statistics
- `cases`: demo case studies
- `process`: process timeline cards
- `signalCards`: floating hero labels

Update those arrays first before changing JSX markup.

### Change sections

The page is rendered in this order:

1. Top navigation
2. Hero
3. Logo band / positioning band
4. Services
5. Demo cases
6. Process
7. CTA / contact block

If a designer or engineer wants to add or remove a section, edit the JSX in `App.jsx` and then add matching styles in `styles.css`.

### Change layout

The main layout rules live in:

- `.topbar`
- `.hero`
- `.service-grid`
- `.cases-grid`
- `.timeline`
- `.cta-panel`

### Change animation

The visual motion is mainly controlled by:

- `@keyframes spin`
- `@keyframes float`
- `@keyframes slideUp`
- `.orbital-ring`
- `.core-panel`
- `.signal-card`

## Notes for other developers

- This project currently uses a single-page architecture. There is no router.
- The site is intentionally data-driven at the top of `App.jsx`, so content updates are easy.
- The pointer-based background glow is handled inline through CSS custom properties passed from React.
- If you split this into components later, a good first refactor would be:
  - `Hero`
  - `ServicesSection`
  - `CasesSection`
  - `ProcessSection`
  - `CtaSection`

## Extra source documentation

For a more detailed explanation of each function, content block, and styling area, see [src/README.md](C:/Users/inkay/Desktop/AICompany/src/README.md).
