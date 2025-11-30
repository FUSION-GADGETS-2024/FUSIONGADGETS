import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { generateBreadcrumbStructuredData, generateArticleStructuredData } from "@/lib/seo";

// SEO metadata for Privacy Policy page
export const metadata: Metadata = {
  title: "Privacy Policy - FUSION GADGETS",
  description: "Read FUSION GADGETS' Privacy Policy to understand how we collect, use, and protect your personal information when you use our website and services.",
  keywords: ["privacy policy", "data protection", "personal information", "FUSION GADGETS", "user privacy"],
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - FUSION GADGETS",
    description: "Read FUSION GADGETS' Privacy Policy to understand how we collect, use, and protect your personal information.",
    url: "/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - FUSION GADGETS",
    description: "Read FUSION GADGETS' Privacy Policy to understand how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPolicyPage() {
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy' },
  ]);

  const articleStructuredData = generateArticleStructuredData(
    'Privacy Policy - FUSION GADGETS',
    'Read FUSION GADGETS\' Privacy Policy to understand how we collect, use, and protect your personal information.',
    '/privacy-policy'
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
            <h1 className="text-3xl font-semibold mb-8">Privacy Policy</h1>
            
            <p className="text-text-secondary mb-6">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-text-secondary leading-relaxed">
                FUSION GADGETS ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Name and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information</li>
                <li>Order history and preferences</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-text-secondary space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about products and services</li>
                <li>Improve our website and customer service</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-text-secondary leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-text-secondary leading-relaxed">
                You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-text-secondary leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at privacy@fusiongadgets.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}