# RUANGKITA public podcast hub

A public-facing podcast listener hub is being introduced at `/podcast`, separate from the creator studio at `/`.

## UI scope
- Episode archive with category filters and title search.
- Episode card, audio-player placeholder, and show-note/timestamp disclosure.
- About/story section.
- Editorial article cards for SEO content planning.
- Podcast directory and social profile placeholders.
- Newsletter and contact form UI.
- Testimonials area that explicitly avoids fabricated listener quotes.

## Important integration gates
This first UI layer does not claim that media or forms are operational:
- Episode audio files, canonical episode metadata, and published show notes must be supplied before enabling playback.
- Spotify, Apple Podcasts, YouTube/iTunes, Instagram, X, and LinkedIn links need official URLs.
- Newsletter collection requires a consent-aware provider or backend, validation, abuse protection, and a privacy notice.
- Contact submission requires a verified destination/endpoint, server-side validation, rate limits, and abuse protection.
- Testimonials must be authentic and used with permission.
- About copy and article drafts require editorial review before publication.
- The studio and live media features remain separate; this page does not implement WebRTC or live streaming.

## Verification
Run the repository's standard checks: `npm run test:static`, `npm run typecheck`, `npm run lint`, and `npm run build`. A successful CI run is not equivalent to validating audio playback, email delivery, or form persistence.
