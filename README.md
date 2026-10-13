# sion king — monochrome portfolio

The approved redesign: pure black, lowercase Courier New monospace typography, an ASCII portrait on home, three original project graphics and descriptions, and an animated ASCII Lain dance. There are no gradients.

## Preview

Run `node serve.mjs` in this folder, then open http://127.0.0.1:4173. No install or build is required. To use another port in PowerShell: `$env:PORT='4186'; node serve.mjs`.

## Deploy to the existing Vercel project

Root files and `dist/` are synchronized. Keep the existing static deployment settings and deploy `dist/`. Copy this package's contents into the repository, preserving its `.git` folder, then commit and push to the branch Vercel watches. This package has not been published automatically.

## Editing

- `index.html`: home links, introduction, and complete about text.
- `styles.css`: responsive layout, black palette, and monospace typography.
- `portfolio.js`: original project descriptions and resource links; carousel behavior.
- `project-ascii.js` and `assets/project-ascii-data.js`: original project artwork and chart data.
- `assets/portrait-ascii.txt`: selectable ASCII portrait, also embedded in `index.html`. Converted from the approved artwork; text rendering approximates its appearance.
- `about-art.js` and `assets/lain-ascii-frames.js`: eight real ASCII animation frames, pause control, and reduced-motion support. Source: https://pin.it/6rqYlfsq9 (original GIF retained locally).
- `site-ui.js`: responsive character sizing and navigation alignment beneath the fixed header.
- Email links open Gmail compose addressed to sionjking@gmail.com. Gmail sign-in may be required.

After editing, copy changed files into `dist/` as well. All required assets are local. Existing résumé and project PDFs are preserved. CSS displays text in lowercase without changing external URLs or document contents.

The former Supabase scatterplot is no longer loaded. Its database was not modified or deleted. Old backend files remain for recovery but are not required by this redesign.
