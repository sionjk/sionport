# Sion portfolio — complete website

Prepared October 9, 2026.

The complete ZIP includes all website source files, the production dist folder, fonts, images, both PDFs, the Supabase setup script, and the local preview server. It includes all prior visual improvements plus the final About hover glow. It excludes Git history and temporary working files.

## Upload and deploy

1. Extract sionport-complete-subtle-glow.zip into a folder.
2. Copy its contents into your existing sionport repository, replacing matching files. Keep the folder structure, including dist and assets. Upload the extracted files, not the ZIP itself.
3. Commit and push to your deployment branch (main for your existing site).
4. Keep your existing working Vercel project settings. The production website is in dist; there is no installation or build step. If importing a new project, use Other as the framework, leave the build command empty, and use dist as the output directory with the repository root as the root directory.
5. After Vercel finishes, check the public production URL, Projects navigation, About glow, and both PDF links.

No new secrets, dependencies, database changes, or Supabase setup are required for this visual update. The existing public Supabase configuration is included. Do not rerun setup.sql just for the glow.

This archive already includes the changes from PR #1 and the newer glow. You do not need to merge PR #1 separately to obtain those changes. No GitHub or production update was performed for this final request.

## Local preview

From the extracted folder, run:

```sh
node serve.mjs
```

Then open http://127.0.0.1:4173. Node.js is only needed for this local preview; production serves static files.

## Final review

No deployment blockers found in the tested flows.

- All three About points glow; hovering a numbered bio label lights the corresponding point. The labels also support keyboard focus.
- Desktop and 390px/320px mobile layouts checked without horizontal overflow.
- Projects navigation lands approximately 24px from the viewport top.
- Carousel button and keyboard navigation, Halo event label, and PDF image preview checked.
- Live distribution connected and showed existing data. The earlier end-to-end save/sync/reload check passed; no additional point was added for this final visual-only change.
- No duplicate IDs or broken loaded images found; checked local assets exist.
- JavaScript syntax and whitespace checks passed; root/production copies match.
- Complete archive extracted and compared against the packaged source files.

Browser checks used the Codex in-app browser. A full accessibility audit, load testing, and Safari/Firefox testing were not performed.

Final refinement: the glow uses a muted neutral tint, lower opacity, and a smaller radius for a subtle highlight.
