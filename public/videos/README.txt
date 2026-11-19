HERO VIDEO

The project uses the Higgsfield-generated hero video URL by default. For independence from the Higgsfield CDN, download the completed video and save it to:

public/videos/hero-desktop.mp4

Set NEXT_PUBLIC_HERO_VIDEO_URL=/videos/hero-desktop.mp4 in Vercel Environment Variables to use your local copy.

The generated video URL was supplied in .env.example and src/components/ScrollScrub.tsx. This archive does not contain the original binary Higgsfield film because the hosting asset could not be transferred into the artifact runtime. The website always falls back to the included static hero poster if video fails to load.

The included hero-fallback.mp4 is an 8-second locally rendered slow photographic dolly-out, not a Higgsfield export. It plays automatically if the original video URL fails.
