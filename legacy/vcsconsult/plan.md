# Vishwamedha Consultancy Services Website Plan

## Product direction
A premium one-page corporate website for Vishwamedha Consultancy Services (VCS), designed for senior decision-makers across quality, HR, engineering, manufacturing, aerospace and defence, laboratories, healthcare and education. The site communicates trust, quality, expertise, professionalism, engineering and continuous improvement without inventing credentials, statistics, client numbers or contact details.

## Design system

- **Design Movement:** Executive editorial / Swiss Internationalist consulting design with technical-industrial cues.
- **Core Principles:** 1) calm authority through generous whitespace and strong type; 2) precision through thin rules, numbered sections and grid-aligned geometry; 3) human capability through restrained photography and direct language; 4) evidence over hype through transparent placeholders and scannable service detail.
- **Color Philosophy:** Deep navy anchors trust and engineering rigor. Warm paper and white surfaces keep the interface readable. Restrained gold is used like a quality seal for key accents; teal signals capability, systems thinking and forward motion.
- **Layout Paradigm:** A left-rail editorial rhythm with oversized section numbers, asymmetrical two-column stories, full-bleed visual bands and staggered cards instead of a centered template grid.
- **Signature Elements:** gold vertical measurement ticks; teal “signal” lines and orbit dots; large monospaced section indices paired with serif editorial headlines.
- **Interaction Philosophy:** Every interaction should feel deliberate and useful. Cards reveal a slight lift and edge accent, nav links use an underline sweep, and form feedback is calm and explicit.
- **Animation:** Small reveal-on-scroll transitions, slow ambient hero line movement, a rotating orbital ring and hover-only micro motion. No autoplay carousels or distracting loops.
- **Typography System:** `Manrope` for navigation, labels, metadata and body copy; `DM Serif Display` for high-impact headlines and section intros; `IBM Plex Mono` for indices, eyebrow labels and technical details. Hierarchy is high contrast with tight display leading and generous body leading.
- **Brand Essence:** A disciplined consultancy helping organizations strengthen quality systems, people capability and technology readiness. Personality: exacting, grounded, forward-looking.
- **Brand Voice:** Clear, executive-friendly and practical; confident without inflated claims. Example lines: “Structure creates room for better decisions.” and “Capability is built in the everyday systems people trust.”
- **Wordmark & Logo:** A compact VCS monogram formed from three stepped vertical bars, suggesting quality, people and technology moving toward a common standard; paired with a small uppercase wordmark.
- **Signature Brand Color:** `#C7A86B`, a muted brass-gold used sparingly for the VCS monogram, rule markers and primary action emphasis.

## Implementation approach

- Use a dependency-light Node static server on port 3000 so Preview is fast and the site remains easy to hand off.
- Keep the page in `public/index.html`, `public/styles.css` and `public/script.js` with `public/images/` for generated visual assets.
- Serve `public/manus-routes.json` as a static route manifest for the single `/` route.
- Use accessible semantic sections, explicit form labels, keyboard-friendly navigation, and responsive breakpoints for desktop, tablet and mobile.
- Use generated hero and section photography as local project assets; use CSS geometry and icon-like motifs for industry cards so the site does not look like a generic stock-photo template.
- Use placeholders for founder/contact data until VCS supplies verified information.

## Project structure

- `server.js` — minimal static HTTP server honoring `PORT` and serving the public directory.
- `package.json` — start script and project metadata.
- `public/index.html` — page structure, content, navigation, forms and footer.
- `public/styles.css` — palette, typography, responsive layout, animation and component styling.
- `public/script.js` — menu toggle, intersection-reveal behavior, active nav state and non-submitting contact feedback.
- `public/manus-routes.json` — declared page route set.
- `public/images/` — generated visual assets.
- `TODO.md` — acceptance outcomes carried from the brief.
