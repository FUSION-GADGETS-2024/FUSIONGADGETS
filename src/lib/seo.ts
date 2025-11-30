// SEO metadata utilities and structured data generators
import { Metadata } from 'next';
import { Product, Category, MetadataConfig } from './types';

const SITE_NAME = 'Fusion Gadgets';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://fusion-gadgets.com';
const DEFAULT_IMAGE = `${SITE_URL}/assets/hero-bg.jpg`;

// Base metadata configuration
export const baseMetadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} - Premium Tech Gadgets & Electronics`,
  },
  description: 'Discover premium tech gadgets and electronics at Fusion Gadgets. Shop laptops, audio equipment, wearables, tablets, and accessories with fast shipping and warranty.',
  keywords: ['tech gadgets', 'electronics', 'laptops', 'headphones', 'smartwatch', 'tablets', 'accessories'],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Premium Tech Gadgets & Electronics`,
    description: 'Discover premium tech gadgets and electronics at Fusion Gadgets. Shop laptops, audio equipment, wearables, tablets, and accessories with fast shipping and warranty.',
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Premium Tech Gadgets`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Premium Tech Gadgets & Electronics`,
    description: 'Discover premium tech gadgets and electronics at Fusion Gadgets.',
    images: [DEFAULT_IMAGE],
    creator: '@fusiongadgets',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Generate metadata for product pages
export function generateProductMetadata(product: Product): Metadata {
  const title = `${product.name} - ${product.brand} | ${SITE_NAME}`;
  const description = `${product.description} Shop now with fast shipping and warranty. Price: $${product.price.toFixed(2)}`;
  const url = `${SITE_URL}/products/${product.slug}`;
  const image = product.images[0]?.url || DEFAULT_IMAGE;
  
  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.brand.toLowerCase(),
      product.category.toLowerCase(),
      'buy online',
      'fast shipping',
      'warranty',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'USD',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:brand': product.brand,
      'product:category': product.category,
    },
  };
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: Category): Metadata {
  const title = `${category.name} - ${category.description} | ${SITE_NAME}`;
  const description = `Shop ${category.name.toLowerCase()} at ${SITE_NAME}. ${category.description} Find the best deals with fast shipping and warranty.`;
  const url = `${SITE_URL}/categories/${category.slug}`;
  
  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      category.slug,
      'shop online',
      'best deals',
      'fast shipping',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      images: [
        {
          url: category.image,
          width: 1200,
          height: 600,
          alt: `${category.name} - ${SITE_NAME}`,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category.image],
    },
  };
}

// Generate structured data for products (JSON-LD)
export function generateProductStructuredData(product: Product): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    sku: product.id,
    mpn: product.id,
    image: product.images.map(img => img.url),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    aggregateRating: product.reviewCount && product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: product.reviewCount && product.reviewCount > 0 ? {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: 'Verified Customer',
      },
    } : undefined,
  };
}

// Generate structured data for organization
export function generateOrganizationStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: 'Premium tech gadgets and electronics retailer',
    sameAs: [
      'https://twitter.com/fusiongadgets',
      'https://facebook.com/fusiongadgets',
      'https://instagram.com/fusiongadgets',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-800-FUSION',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}

// Generate structured data for website
export function generateWebsiteStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Premium tech gadgets and electronics',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Generate enhanced product structured data with more schema types
export function generateEnhancedProductStructuredData(product: Product): object {
  const baseProductData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    category: product.category,
    sku: product.id,
    mpn: product.id,
    gtin: product.id, // Global Trade Item Number
    image: product.images.map(img => ({
      '@type': 'ImageObject',
      url: img.url,
      width: img.width,
      height: img.height,
      caption: img.alt,
    })),
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'USD',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'US',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: product.reviewCount && product.reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    review: product.reviewCount && product.reviewCount > 0 ? {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: product.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: 'Verified Customer',
      },
      reviewBody: `Great ${product.category.toLowerCase()} from ${product.brand}. Highly recommended!`,
    } : undefined,
  };

  // Add specifications if available
  if (product.specifications && product.specifications.length > 0) {
    baseProductData['additionalProperty'] = product.specifications.map(spec => ({
      '@type': 'PropertyValue',
      name: spec.name,
      value: spec.value,
    }));
  }

  return baseProductData;
}

// Generate FAQ structured data for product pages
export function generateProductFAQStructuredData(product: Product): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is included with the ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${product.name} comes with all standard accessories, warranty documentation, and user manual. Free shipping is included on all orders.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the warranty on the ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `All ${product.brand} products come with a comprehensive 2-year warranty covering manufacturing defects and normal wear.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long does shipping take?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We offer free shipping on all orders with delivery typically within 2-5 business days. Express shipping options are also available.',
        },
      },
    ],
  };
}

// Generate category collection structured data
export function generateCategoryCollectionStructuredData(category: Category, products: Product[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - ${SITE_NAME}`,
    description: category.description,
    url: `${SITE_URL}/categories/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.name,
          url: `${SITE_URL}/products/${product.slug}`,
          image: product.images[0]?.url,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        },
      })),
    },
  };
}

// Generate local business structured data
export function generateLocalBusinessStructuredData(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: SITE_NAME,
    image: `${SITE_URL}/assets/hero-bg.jpg`,
    url: SITE_URL,
    telephone: '+1-800-FUSION',
    email: 'support@fusion-gadgets.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Tech Street',
      addressLocality: 'San Francisco',
      addressRegion: 'CA',
      postalCode: '94105',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: [
      'https://twitter.com/fusiongadgets',
      'https://facebook.com/fusiongadgets',
      'https://instagram.com/fusiongadgets',
      'https://linkedin.com/company/fusiongadgets',
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'],
    currenciesAccepted: 'USD',
  };
}

// Generate article structured data for blog/content pages
export function generateArticleStructuredData(title: string, description: string, url: string, publishedDate?: Date): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: url,
    datePublished: publishedDate?.toISOString() || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Utility function to create metadata config
export function createMetadataConfig(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    type = 'website',
    product,
  } = config;

  const metadata: Metadata = {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };

  if (product) {
    metadata.other = {
      'product:price:amount': product.price.toString(),
      'product:price:currency': product.currency,
      'product:availability': product.availability,
      'product:brand': product.brand,
      'product:category': product.category,
    };
  }

  return metadata;
}

// Generate comprehensive metadata for static pages
export function generateStaticPageMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const { title, description, keywords = [], url, image = DEFAULT_IMAGE, type = 'website' } = config;
  
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    other: {
      'article:author': SITE_NAME,
      'article:publisher': SITE_URL,
    },
  };
}

// Generate metadata for search/listing pages
export function generateListingPageMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  url: string;
  totalItems?: number;
  category?: string;
}): Metadata {
  const { title, description, keywords = [], url, totalItems, category } = config;
  
  const enhancedDescription = totalItems 
    ? `${description} Browse ${totalItems} products with fast shipping and warranty.`
    : description;
    
  return {
    title,
    description: enhancedDescription,
    keywords: [...keywords, 'shop online', 'fast shipping', 'warranty', 'best deals'],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description: enhancedDescription,
      images: [
        {
          url: DEFAULT_IMAGE,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: SITE_NAME,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: enhancedDescription,
      images: [DEFAULT_IMAGE],
    },
    other: {
      'product:category': category || '',
      'product:count': totalItems?.toString() || '',
    },
  };
}

// Generate canonical URL with proper formatting
export function generateCanonicalUrl(path: string): string {
  // Remove leading slash if present and ensure proper formatting
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;
}

// Generate hreflang alternates for international SEO (future use)
export function generateHreflangAlternates(path: string): Record<string, string> {
  const baseUrl = generateCanonicalUrl(path);
  return {
    'en-US': baseUrl,
    'en': baseUrl,
    'x-default': baseUrl,
  };
}

// Generate JSON-LD script tag for structured data
export function generateStructuredDataScript(data: object): string {
  return JSON.stringify(data, null, 2);
}

// Validate and clean metadata
export function validateMetadata(metadata: Metadata): Metadata {
  const cleaned = { ...metadata };
  
  // Ensure title is not too long (60 characters recommended)
  if (cleaned.title && typeof cleaned.title === 'string' && cleaned.title.length > 60) {
    console.warn(`Title too long (${cleaned.title.length} chars): ${cleaned.title}`);
  }
  
  // Ensure description is not too long (160 characters recommended)
  if (cleaned.description && cleaned.description.length > 160) {
    console.warn(`Description too long (${cleaned.description.length} chars): ${cleaned.description}`);
  }
  
  return cleaned;
}

// Generate meta tags for enhanced SEO
export function generateEnhancedMetaTags(): Record<string, string> {
  return {
    'theme-color': '#ffffff',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': SITE_NAME,
    'application-name': SITE_NAME,
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
  };
}

// Generate Open Graph meta tags for social sharing
export function generateOpenGraphTags(config: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
}): Record<string, string> {
  const { title, description, url, image = DEFAULT_IMAGE, type = 'website' } = config;
  
  return {
    'og:type': type,
    'og:title': title,
    'og:description': description,
    'og:url': url,
    'og:image': image,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': title,
    'og:site_name': SITE_NAME,
    'og:locale': 'en_US',
  };
}

// Generate Twitter Card meta tags
export function generateTwitterCardTags(config: {
  title: string;
  description: string;
  image?: string;
  card?: string;
}): Record<string, string> {
  const { title, description, image = DEFAULT_IMAGE, card = 'summary_large_image' } = config;
  
  return {
    'twitter:card': card,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:creator': '@fusiongadgets',
    'twitter:site': '@fusiongadgets',
  };
}