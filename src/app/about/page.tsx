import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Truck, Award, Users } from "lucide-react";
import { Metadata } from "next";
import { generateBreadcrumbStructuredData, generateOrganizationStructuredData, generateLocalBusinessStructuredData } from "@/lib/seo";

// SEO metadata for About page
export const metadata: Metadata = {
  title: "About Premium Tech - Our Story & Values",
  description: "Learn about Premium Tech's mission to provide professionals with the highest quality technology products. Founded in 2020, we serve thousands of professionals worldwide.",
  keywords: ["about premium tech", "company story", "technology experts", "professional tools", "quality products"],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Premium Tech - Our Story & Values",
    description: "Learn about Premium Tech's mission to provide professionals with the highest quality technology products.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Premium Tech - Our Story & Values",
    description: "Learn about Premium Tech's mission to provide professionals with the highest quality technology products.",
  },
};

export default function AboutPage() {
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'About', url: '/about' },
  ]);

  const organizationStructuredData = generateOrganizationStructuredData();
  const localBusinessStructuredData = generateLocalBusinessStructuredData();

  return (
    <div className="min-h-screen bg-background">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessStructuredData),
        }}
      />
      
      <Header isStatic={true} />
      
      <main className="container mx-auto px-8 pt-24 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-3xl font-semibold text-foreground mb-4 tracking-tight">About Premium Tech</h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            We believe in providing professionals with the highest quality technology products that enhance productivity and inspire excellence.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Premium Quality</h3>
            <p className="text-sm text-text-secondary">Only the finest products from trusted brands</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">2-Year Warranty</h3>
            <p className="text-sm text-text-secondary">Comprehensive coverage on all products</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Free Shipping</h3>
            <p className="text-sm text-text-secondary">Fast, reliable delivery worldwide</p>
          </div>

          <div className="text-center">
            <div className="h-12 w-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">Expert Support</h3>
            <p className="text-sm text-text-secondary">Dedicated team ready to assist</p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-surface border border-border rounded-xl p-12 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-6">Our Story</h2>
          <div className="space-y-4 text-sm text-text-secondary leading-relaxed">
            <p>
              Founded in 2020, Premium Tech was born from a simple belief: professionals deserve technology that matches their ambition. We saw a market flooded with products, but lacking in genuine quality and thoughtful curation.
            </p>
            <p>
              Our team of technology experts carefully evaluates every product we offer, ensuring it meets our rigorous standards for performance, design, and reliability. We partner directly with leading manufacturers to bring you the latest innovations at competitive prices.
            </p>
            <p>
              Today, we serve thousands of professionals worldwide who trust us to deliver the tools they need to excel in their work. From creative studios to corporate offices, our products power the world's most ambitious projects.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}