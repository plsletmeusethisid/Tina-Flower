# Vercel Build Fix — CSS pipeline

## Cause

The original Vercel edition accidentally included a `postcss.config.mjs` enabling `tailwindcss` and `autoprefixer`, and a `tailwind.config.ts`, but neither package was installed. The website uses regular CSS in `src/app/globals.css`, so the custom PostCSS/Tailwind configuration was unnecessary. This misconfiguration can cause `next build` to fail during CSS loader processing.

## Changes

- Deleted `postcss.config.mjs`.
- Deleted `tailwind.config.ts`.
- Left the site's regular CSS, components, images, animations, routes, and inquiry API untouched.

Next.js can process the regular CSS without these custom plugins.

## Deploy

1. Push this corrected project to the GitHub repository connected to Vercel. Alternatively, delete both configuration files directly in GitHub and commit the deletion.
2. In Vercel, leave Framework Preset = Next.js, Build Command = `npm run build`, and Output Directory at its default.
3. Redeploy the most recent commit.

## Checks completed

- `npm run check`: passed (asset and page-route checks).
- TypeScript/TSX syntax parsing: 26 files, no syntax errors.
- CSS stylesheet parsing: no parser errors.
- Full `npm run build`: **not run**, because dependency installation timed out in the execution environment. Verify the final Vercel build log after redeployment.

If the next deployment still fails, share the **first error line above the webpack stack trace**, because that is the specific error message needed to diagnose any additional build issue.
