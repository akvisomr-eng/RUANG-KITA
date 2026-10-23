import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'RUANGKITA — Virtual Podcast Studio',
    short_name: 'RUANGKITA',
    description: 'Studio podcast virtual untuk kreator, komunitas, dan tim.',
    lang: 'id',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#101b1a',
    theme_color: '#173c37',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
