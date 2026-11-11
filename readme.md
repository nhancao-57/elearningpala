# Pala eLearning starter

Open index.html with VS Code Live Server. No extra server is needed.
Use Live Server rather than file:// so main.js can fetch the shared partials.

Run npm run watch:css while editing, or npm run build:css for a single build.
If PowerShell blocks npm.ps1, use npm.cmd instead of npm.
Run npm install first on a fresh checkout.

- index.html: page content and fallback header/footer.
- main.js: loads _header-nav.html and _footer-content.html, then initialises
  mobile learning navigation and theme controls.
- src/input.css: Tailwind entry, brand colours, and class-based dark mode.
- styles.css: component styles imported into the Tailwind build.
- src/output.css: generated CSS; do not edit directly.

Theme follows the system until changed; the preference is saved locally.
The interface uses Vietnamese, without a language switcher or translation runtime.
Inter falls back to the system font until local font files are provided.

The header links to Exercises and My learning sections. The learner identity is
a demo placeholder until authentication is implemented. Exercises and activity
are empty states; no sample results or login state are stored.
The footer retains main-website links which do not yet exist in this starter.
The copied 404.html still depends on main-site assets
and scripts and has not been migrated.
