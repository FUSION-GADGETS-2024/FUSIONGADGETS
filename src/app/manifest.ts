import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fusion Gadgets - Premium Tech Store',
    short_name: 'Fusion Gadgets',
    description: 'Discover the latest in premium technology with Fusion Gadgets. Shop laptops, smartphones, headphones, and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    orientation: 'portrait-primary',
    categories: ['shopping', 'technology', 'electronics'],
    lang: 'en-US',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/favicon.ico',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/favicon.ico',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    screenshots: [
      {
        src: '/assets/hero-bg.jpg',
        sizes: '1200x630',
        type: 'image/jpeg',
        form_factor: 'wide',
        label: 'Fusion Gadgets Homepage',
      },
    ],
  };
}