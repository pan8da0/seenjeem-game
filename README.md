# For Leen 🤍

A one-scroll, cinematic birthday website made for Leen (Lolo). Built with
Vite, React and TypeScript. No backend, no analytics, no trackers — just a
static site meant to be opened, read, and kept.

## Development

```bash
npm install
npm run dev
```

Opens the site locally with hot reload, usually at `http://localhost:5173`.

## Production build

```bash
npm run build
```

Type-checks the project and builds the static site into `dist/`.

## Preview the production build

```bash
npm run preview
```

Serves the contents of `dist/` locally so you can sanity-check the real
build before deploying.

## Where things live

### Text

All the emotional copy — the intro, every chapter's lines, the bridges
between chapters, and the final letter — lives in one file:

- `src/data/content.ts`

Edit the strings there; the components just render whatever is in this
file, in order.

### Photos

Photos are organized by category, matching the site's chapters:

```
src/assets/images/
  funny/       -> Chapter 01, Chaos
  childhood/   -> Chapter 02, Little You
  us/          -> Chapter 03, Us
  her/         -> Chapter 04, You (and the closing photo in Chapter 05)
```

**To add a photo:** drop the image file into the right category folder,
then run:

```bash
npm run optimize-images
```

This generates a resized, web-friendly copy in `src/assets/images-web/`
and records its dimensions in `src/data/imageDimensions.generated.json` so
the page can reserve the right amount of space before the image loads (no
layout jump). **Your original file in `src/assets/images/` is never
modified, cropped, or renamed** — the script only ever writes into
`images-web/` and the generated JSON. Run it again any time you add or
remove a photo.

New photos show up automatically with a neutral caption. If you want to
give a specific photo a caption, a rotation (for the Chapter 01 scrapbook
look), a custom crop focus, or mark it as the "featured" photo in its
chapter, add an entry for it in the `overrides` table in:

- `src/data/images.ts`

Every photo entry there is optional — nothing breaks if a photo isn't
listed, and nothing breaks if a whole category is empty (the chapter just
shows a small placeholder note instead of a photo grid).

**Currently empty:** `funny/` and `her/` have no photos yet. The site
still works and looks intentional without them — add photos + re-run
`npm run optimize-images` whenever they're ready, no code changes needed.

### Music

Drop an audio file at:

```
src/assets/music/background.mp3
```

(`.m4a` and `.ogg` also work.) It's picked up automatically — the small
`♪` control appears in the bottom-left corner, and playback starts, muted
by nothing but the browser's autoplay rules, the moment "Open your gift"
is pressed. No file → the site works exactly the same, just silently, and
the music control simply doesn't render.

Volume is set in `src/data/music.ts` (defaults to a gentle 0.3, dipping to
0.14 near the ending chapter).

### Design tokens (colors, fonts, spacing)

- `src/styles/theme.css` — the palette for each chapter, spacing scale,
  timing/easing variables.
- `src/styles/fonts.css` — the three self-hosted typefaces (Cormorant
  Garamond, Inter, Caveat).

## Project structure

```
src/
  components/   reusable pieces (photo frames, music toggle, letter reveal…)
  sections/     one file per chapter (Chapter01Chaos.tsx, etc.) + FinalMoment
  data/         content.ts, images.ts, music.ts — all editable content
  context/      the small app-wide state (has the gift been opened, music, active chapter)
  hooks/        scroll-reveal, chapter-tracking, reduced-motion helpers
  styles/       design tokens, global reset, chapter background/transition CSS
  assets/       fonts, and images/ (originals) + images-web/ (generated, optimized)
scripts/
  optimize-images.py   generates src/assets/images-web/ from src/assets/images/
```

## Notes on the photos already in the site

The **childhood** and **us** photos currently in the site were extracted
from PDFs you provided (screenshots of a phone photo album, and a set of
trip photos, respectively). They are used as-is — unrotated/uncropped
beyond what was necessary to correct a few photos that were saved sideways
with no orientation metadata (fixed losslessly, pixels only rotated, never
recompressed or cropped). Nothing was retouched, re-cropped, or replaced.

## Deploying to GitHub Pages

The project builds with relative asset paths (`base: "./"` in
`vite.config.ts`), so it works whether it's hosted at the root of a domain
or under a GitHub Pages project subpath like
`https://username.github.io/repo-name/`.

A manual deployment workflow is included at
`.github/workflows/deploy.yml`. It does **not** run automatically — it
only runs when you trigger it yourself. To deploy:

1. In the repo on GitHub, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Go to the **Actions** tab, select **Deploy to GitHub Pages**, and click
   **Run workflow**.
3. Once it finishes, the site's URL will be shown in the workflow run
   summary (and under Settings → Pages).

You can also build locally and deploy the `dist/` folder to any static
host (Netlify, Vercel, S3, etc.) — nothing about this project is specific
to GitHub Pages.

## Privacy

No analytics, no trackers, no ads, no cookies, no third-party embeds at
runtime. Fonts are self-hosted (downloaded once at build time, not fetched
from Google's CDN by visitors). The page is marked `noindex, nofollow` so
it doesn't show up in search results.
