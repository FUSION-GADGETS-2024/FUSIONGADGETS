import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { generateBreadcrumbStructuredData } from '@/lib/seo';

// Pure SSG - No hydration needed
export const metadata: Metadata = {
  title: 'About Us | Fusion Gadgets',
  description: 'Learn about Fusion Gadgets - your trusted destination for premium technology products. Discover our story, mission, and commitment to quality.',
  keywords: ['about fusion gadgets', 'tech store', 'premium gadgets', 'our story'],
  openGraph: {
    title: 'About Us | Fusion Gadgets',
    description: 'Learn about Fusion Gadgets - your trusted destination for premium technology products.',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      
      <div className="min-h-screen bg-background">
        <Header isStatic />
        
        <main className="container mx-auto px-8 pt-24 pb-24">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold text-foreground mb-8">About Fusion Gadgets</h1>
            
            <div className="prose prose-neutral max-w-none">
              <section className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">Our Story</h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Founded with a passion for technology and innovation, Fusion Gadgets has grown to become 
                  one of India's most trusted destinations for premium tech products. We believe that 
                  everyone deserves access to cutting-edge technology that enhances their daily lives.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Our journey began with a simple mission: to curate the finest selection of gadgets 
                  and deliver them with exceptional service. Today, we continue to uphold these values 
                  while expanding our offerings to meet the evolving needs of tech enthusiasts.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
                <p className="text-text-secondary leading-relaxed">
                  To provide our customers with premium technology products that combine innovation, 
                  quality, and value. We strive to make the latest gadgets accessible while ensuring 
                  an exceptional shopping experience from browsing to delivery.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-xl font-semibold text-foreground mb-4">Why Choose Us</h2>
                <ul className="space-y-3 text-text-secondary">
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold">✓</span>
                    <span>Authentic products with manufacturer warranty</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold">✓</span>
                    <span>Free shipping on all orders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold">✓</span>
                    <span>30-day hassle-free returns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold">✓</span>
                    <span>Dedicated customer support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-success font-bold">✓</span>
                    <span>Secure payment options</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-text-secondary leading-relaxed">
                  Have questions or need assistance? Our team is here to help. Reach out to us at{' '}
                  <a href="mailto:support@fusiongadgets.com" className="text-foreground hover:underline">
                    support@fusiongadgets.com
                  </a>{' '}
                  or call us at{' '}
                  <a href="tel:+911234567890" className="text-foreground hover:underline">
                    +91 123 456 7890
                  </a>
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
