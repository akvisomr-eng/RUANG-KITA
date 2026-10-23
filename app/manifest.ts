import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'RUANGKITA — Virtual Podcast Studio',
    short_name: 'RUANGKITA',
    description: 'Studio podcast virtual untuk kreator, komunitas, dan tim.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f4f6f4',
    theme_color: '#fbfcfb',
    lang: 'id',
    categories: ['video', 'social', 'productivity'],
  };
}
