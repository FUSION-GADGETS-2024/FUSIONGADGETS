import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { generateBreadcrumbStructuredData, generateArticleStructuredData } from "@/lib/seo";

// SEO metadata for Terms of Service page
export const metadata: Metadata = {
  title: "Terms of Service - FUSION GADGETS",
  description: "Read FUSION GADGETS' Terms of Service to understand the rules and regulations governing the use of our website and services.",
  keywords: ["terms of service", "terms and conditions", "user agreement", "FUSION GADGETS", "website terms"],
  alternates: {
    canonical: "/terms-of-service",
  },
  openGraph: {
    title: "Terms of Service - FUSION GADGETS",
    description: "Read FUSION GADGETS' Terms of Service to understand the rules and regulations governing the use of our website.",
    url: "/terms-of-service",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - FUSION GADGETS",
    description: "Read FUSION GADGETS' Terms of Service to understand the rules and regulations governing the use of our website.",
  },
};

export default function TermsOfServicePage() {
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms-of-service' },
  ]);

  const articleStructuredData = generateArticleStructuredData(
    'Terms of Service - FUSION GADGETS',
    'Read FUSION GADGETS\' Terms of Service to understand the rules and regulations governing the use of our website.',
    '/terms-of-service'
  );

  return (
    <div className="min-h-screen flex flex-col">
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
          __html: JSON.stringify(articleStructuredData),
        }}
      />
      
      <Header isStatic={true} />
      
      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <h1 className="text-3xl font-semibold mb-8">Terms of Service</h1>
            
            <p className="text-text-secondary mb-6">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-text-secondary leading-relaxed">
                By accessing or using FUSION GADGETS, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                Permission is granted to temporarily access the materials on FUSION GADGETS for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Product Information</h2>
              <p className="text-text-secondary leading-relaxed">
                We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Pricing and Payment</h2>
              <p className="text-text-secondary leading-relaxed">
                All prices are in USD and subject to change without notice. We reserve the right to refuse or cancel any order for any reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
              <p className="text-text-secondary leading-relaxed">
                Please refer to our Return Policy for detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-text-secondary leading-relaxed">
                FUSION GADGETS shall not be liable for any damages arising out of the use or inability to use the materials on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-text-secondary leading-relaxed">
                For questions about these Terms of Service, please contact us at legal@fusiongadgets.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}