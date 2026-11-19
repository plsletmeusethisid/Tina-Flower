# Tina Flower Atelier | Vercel edition

A Vercel-ready **Next.js 15 + React 19 + TypeScript** adaptation of the latest Tina Flower Atelier storefront. This edition is **not** the unmodified Higgsfield repo: the Higgsfield original uses TanStack Start, Cloudflare Workers and D1. The Vercel edition ports the customer-facing pages, bilingual content and styling into Next.js, and replaces the D1 inquiry endpoint with provider-neutral server logic.

## Features

- Fully separated **English** (`/en`) and **Korean** (`/ko`) page routes. No English/Korean mixing in the navigation, headings, product copy, FAQs or inquiry interface.
- Responsive language toggle in the desktop header and mobile drawer, retaining the active page and query parameters.
- Cinematic scroll-controlled hero, plus image fallback and reduced-motion support.
- Six original floral/product images, optimized to WebP and bundled locally.
- Homepage, collection index, six collection details, six product details, event styling, studio story, contact page, FAQs, and custom order form.
- Server-side inquiry validation, bilingual errors, honeypot spam trap, optional rate limiting via Upstash, and optional Resend/Supabase integrations.
- SEO sitemap containing both language versions, responsive layouts, and localized page headings.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open **http://localhost:3000** (redirects to `/en`) or **http://localhost:3000/ko**.

The site itself runs without an inquiry service configured. The inquiry form will return a clear configuration error until you set up one or both providers below. No false success message is shown.

## 2. Deploy to Vercel

1. Unzip this project and push the **project root** to GitHub.
2. In Vercel, select **Add New → Project**, import that repository, and choose the **Next.js** framework preset.
3. Keep the build command `npm run build` and output settings at the defaults. Do **not** use the Cloudflare/Higgsfield runtime or a custom build command.
4. Add the environment variables from `.env.example` in **Project → Settings → Environment Variables**. At minimum, set `NEXT_PUBLIC_SITE_URL` to your real public `https://...` URL for canonical metadata and sitemap accuracy.
5. Deploy and test `/en`, `/ko`, the language toggle, products, scrolling, and the inquiry form.

> If you change environment variables, redeploy so that values prefixed `NEXT_PUBLIC_` are embedded in the client-side build.

## 3. Hero video

The completed Higgsfield **16:9 H.264 hero video** is referenced through the `NEXT_PUBLIC_HERO_VIDEO_URL` setting (the source URL is included in `.env.example`). Since it is served by Higgsfield's media CDN, you should **self-host the MP4 for long-term production**:

1. Download the [original generated hero MP4](https://d2ol7oe51mr4n9.cloudfront.net/user_3MHCvg3WmNVPZ7oePdns6p0iGyl/7d71c03d-2380-43a1-83f3-662f4b3bb7a4.mp4).
2. Save it at `public/videos/hero-desktop.mp4`.
3. Set `NEXT_PUBLIC_HERO_VIDEO_URL=/videos/hero-desktop.mp4` and redeploy.

The archive **includes the product images, static hero posters and a small locally generated fallback video**, but not the original Higgsfield MP4 binary. Until the MP4 is self-hosted, video playback depends on the source CDN remaining available. If the original MP4 cannot load, the bundled **hero-fallback.mp4** (a gently animated version of the poster) is used. If video fails entirely, the included flower poster remains visible.

For a future 9:16 mobile film, update `src/components/ScrollScrub.tsx` to select a separate mobile video. The current version uses portrait photo fallback and responsive video cropping on mobile.

## 4. Inquiry handling (required before public launch)

This is an inquiry-based storefront, **not a shopping cart or checkout**. It does not charge customers or claim confirmed orders.

The API route at `src/app/api/inquiries/route.ts` supports:

### Option A: Resend email notifications

In Vercel environment variables configure:

```env
RESEND_API_KEY=your_resend_api_key
INQUIRY_FROM_EMAIL=orders@your-verified-domain.com
INQUIRY_TO_EMAIL=your-shop-inbox@example.com
```

Verify your sending domain with Resend. On success, the server emails the inquiry to the shop inbox and uses the customer address as `reply_to`.

### Option B: Supabase database storage

1. Create a Supabase project and run the included `supabase.sql` in its SQL Editor.
2. Set these **server-side** variables in Vercel:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
```

**Never** use `NEXT_PUBLIC_` for the service role key and **never** commit secrets.

You may configure both providers. The API returns success only if at least one succeeds, with its `delivery.saved` and `delivery.emailed` fields indicating the outcome. If no provider is configured or both fail, it returns an error.

### Recommended: Distributed rate limiting

For production, connect Upstash Redis:

```env
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

The app includes a simple in-process fallback for development, but **memory is not a reliable distributed rate limit on Vercel**. Configure Upstash or another centralized limiter before allowing significant traffic.

## 5. Editing products and text

- `src/floral/catalog.ts`: six products and collections, with English/Korean names, summaries, full descriptions, and image paths.
- `src/floral/Home.tsx`: homepage sections.
- `src/floral/Pages.tsx`: other pages, FAQs and marketing text.
- `src/floral/layout.tsx`: header, navigation, language switcher, footer and CTA.
- `src/floral/OrderForm.tsx`: inquiry UI.
- `src/floral/i18n.tsx`: locale context, translation helper and localized link creation.
- `src/components/ScrollScrub.tsx`: scroll-film logic.
- `src/app/globals.css`: visual design and responsive styles.

No product prices, physical address, business phone number, customer testimonials or delivery guarantees are fabricated. Add verified business data when available. The corporate ribbon reference photo includes third-party text; confirm permission to use it commercially.

## 6. Checks

```bash
npm run check
npm run typecheck
npm run build
```

`npm run check` checks assets/routes without installing test frameworks. The Next.js production build should be performed once dependencies are installed in a network-connected environment (or by Vercel during deployment).

### Differences from Higgsfield hosting

| Original Higgsfield site | Vercel edition |
|---|---|
| TanStack Start + Cloudflare Worker | Next.js App Router on Vercel |
| Cloudflare D1 inquiry persistence | Supabase and/or Resend, configurable |
| `/...?lang=ko` language mode | `/ko/...` language routes, middleware redirects legacy query URLs |
| Higgsfield scroll-film controller | Portable scroll-linked video seeking and GSAP section effects |
| Higgsfield-hosted media | Local WebP photos; original video CDN or self-hosted MP4 |

This is an independently deployable adaptation, not a byte-for-byte export of Higgsfield's managed scroll engine.
