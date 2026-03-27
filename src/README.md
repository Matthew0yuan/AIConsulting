# Source Guide

This file explains the purpose of each function, content block, and styling area so another developer can safely modify the site.

## Files

- [src/App.jsx](C:/Users/inkay/Desktop/AICompany/src/App.jsx): page content and JSX layout
- [src/main.jsx](C:/Users/inkay/Desktop/AICompany/src/main.jsx): React bootstrap file
- [src/styles.css](C:/Users/inkay/Desktop/AICompany/src/styles.css): all visual styling, layout, and animation

## `App.jsx` overview

`App.jsx` is a single React component file with two responsibilities:

1. Store the page content in reusable arrays
2. Render the landing page sections using that content

## Data blocks in `App.jsx`

### `services`

Used by the services section.

Each item contains:

- `title`: service headline
- `description`: supporting copy

Rendered in the `.service-grid` section.

### `metrics`

Used in the hero section.

Each item contains:

- `value`: large metric number or stat
- `label`: short explanation below the metric

Rendered in `.metric-row`.

### `cases`

Used by the demo case study section.

Each item contains:

- `name`: client or project name
- `category`: short label shown at the top of the card
- `summary`: case study summary
- `outcome`: highlighted result metric

Rendered in `.cases-grid`.

### `process`

Used by the process/timeline section.

Each item contains:

- `step`: step number
- `title`: phase name
- `copy`: description of the phase

Rendered in `.timeline`.

### `signalCards`

Used inside the hero visual block.

These are the floating labels on the right side of the orbital animation.

If these become too long, the hero layout may feel crowded, so keep them short.

## Main function in `App.jsx`

### `App()`

This is the only React component in the file.

Responsibilities:

- tracks pointer movement with `useState`
- updates `--spotlight-x` and `--spotlight-y`
- renders all website sections

### Pointer glow logic

Inside `useEffect`, the component listens for `pointermove`:

- `clientX` and `clientY` are converted into percentages
- those values are passed into inline CSS variables
- `styles.css` uses those variables to create the moving radial glow background

If the pointer effect is not wanted later, remove:

- the `pointer` state
- the `useEffect` event listener
- the inline `style` prop on `.page-shell`
- the matching radial background in `body`

## JSX section map

### Header

Classes:

- `.topbar`
- `.brand-lockup`
- `.nav-links`

Purpose:

- site branding
- anchor navigation to page sections

### Hero

Classes:

- `.hero`
- `.hero-copy`
- `.hero-visual`
- `.metric-row`

Purpose:

- explain the company positioning
- show CTA buttons
- show proof metrics
- display the main animated visual

### Hero animated visual

Classes:

- `.orbital-core`
- `.orbital-ring`
- `.core-panel`
- `.floating-stack`
- `.signal-card`

Purpose:

- create the tech-style motion piece on the right side of the hero

Important note:

This block uses absolute positioning. If the hero layout changes, this is the first area to check.

### Logo band

Class:

- `.logo-band`

Purpose:

- show short positioning phrases between the hero and the rest of the page

### Services section

Classes:

- `.section`
- `.section-heading`
- `.service-grid`
- `.glass-card`

Purpose:

- present the three main offerings

### Demo cases section

Classes:

- `.section-cases`
- `.cases-grid`
- `.case-card`

Purpose:

- provide example consulting outcomes

### Process section

Classes:

- `.process-section`
- `.timeline`
- `.timeline-card`

Purpose:

- explain the delivery model in three steps

### Contact / CTA section

Classes:

- `.cta-panel`
- `.cta-actions`

Purpose:

- provide the final call to action
- keep the email address highly visible

## `styles.css` overview

`styles.css` is organized by responsibility.

## CSS section map

### Global foundation

Includes:

- `:root`
- `*`
- `html`
- `body`
- `a`
- `button`
- `#root`

Purpose:

- design tokens
- page background
- default typography and spacing behavior

### Page shell and background effects

Includes:

- `.page-shell`
- `.ambient-grid`

Purpose:

- handle the fixed grid texture and page overflow

### Header styling

Includes:

- `.topbar`
- `.brand-lockup`
- `.brand-mark`
- `.nav-links`

Purpose:

- sticky navigation
- brand presentation
- hover underline effect

### Hero layout

Includes:

- `.hero`
- `.hero-copy`
- `.hero-visual`
- `.hero-text`
- `.hero-actions`
- `.metric-row`

Purpose:

- split the hero into copy and visual columns
- align the hero content and spacing

### Animated hero visual

Includes:

- `.orbital-core`
- `.orbital-ring`
- `.ring-one`
- `.ring-two`
- `.ring-three`
- `.core-panel`
- `.floating-stack`
- `.signal-card`
- `.signal-dot`

Purpose:

- create the animated orbital look
- position the signal cards around the hero graphic

### Content sections

Includes:

- `.section`
- `.section-heading`
- `.service-grid`
- `.cases-grid`
- `.timeline`
- `.glass-card`
- `.case-card`
- `.timeline-card`
- `.cta-panel`

Purpose:

- control spacing between sections
- define the card layouts
- style the CTA block

### Animations

Includes:

- `@keyframes spin`
- `@keyframes float`
- `@keyframes slideUp`

Purpose:

- ring rotation
- floating center panel motion
- staggered signal card entrance

### Responsive rules

Includes:

- `@media (max-width: 980px)`
- `@media (max-width: 720px)`
- `@media (prefers-reduced-motion: reduce)`

Purpose:

- stack the layout on tablet/mobile
- reduce visual density on small screens
- support users who prefer reduced motion

## Safe change checklist

When editing this project:

1. Change data arrays first if it is only a content update.
2. Change JSX only when the structure itself needs to change.
3. Update matching CSS selectors if you rename a class in JSX.
4. Run `npm run build` after layout or animation changes.
5. Re-check the hero layout on mobile after touching `.hero-visual`, `.orbital-core`, or `.floating-stack`.

## Suggested future refactor

If this page grows, split `App.jsx` into smaller components:

- `HeroSection.jsx`
- `ServicesSection.jsx`
- `CasesSection.jsx`
- `ProcessSection.jsx`
- `CtaSection.jsx`

At that point, each component can have its own local README or colocated notes if the team wants deeper documentation.
