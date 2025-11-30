import { MetadataRoute } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/supabase/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusion-gadgets.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  
  // Fetch data from Supabase
  const products = await getAllProducts();
  const categories = await getAllCategories();
  
  // Static pages
  const staticPages = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms-of-service`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.4,
    },
  ];

  // Product pages (ISR - high priority for SEO)
  const productPages = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: product.updatedAt || currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Category pages (if we have individual category pages)
  const categoryPages = categories.map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
  ];
}