# Website UI kit — Architect Lab

A forward design for the Architect Lab marketing site, composed entirely from the system's primitives (`Button`, `Logo`, `Card`, `Tag`, `GradientRule`, `Eyebrow`, `Input`).

> **Note:** the source repo (`github.com/Fox-Morphaius/Architect-Lab-WebSite`) was a placeholder with no production UI. This kit is an original design built from the brand charter, not a recreation of an existing site. Treat it as a proposed direction to validate, not canon.

## Files
- `index.html` — entry. Loads `styles.css`, the DS bundle, React, Babel and Lucide, then mounts `site.jsx`. Interactive: the "Request access" form validates an email and prints a terminal confirmation.
- `site.jsx` — all sections in one file: `Nav`, `Hero`, `Pillars` (Design/Build/Protect), `Tracks` (AI / Cybersecurity), `Mentors`, `Join`, `Footer`, `App`.

## Sections
- **Hero** — blueprint grid + faint spectrum glow, clipped-spectrum headline with the magenta `_` cursor, terminal `git clone` cartouche.
- **Method** — three accent cards for the Design → Build → Protect loop.
- **Programs** — two blueprint cards, one per track, with chip tags.
- **Join** — interactive terminal-style access request.

## Icons
Lucide (open-source, 1.5–2px stroke) via CDN — the documented substitute set. Swap if a bespoke icon set is commissioned.
