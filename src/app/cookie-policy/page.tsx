import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";
import { generateBreadcrumbStructuredData, generateArticleStructuredData } from "@/lib/seo";

// SEO metadata for Cookie Policy page
export const metadata: Metadata = {
  title: "Cookie Policy - FUSION GADGETS",
  description: "Learn about how FUSION GADGETS uses cookies to improve your browsing experience and provide personalized services on our website.",
  keywords: ["cookie policy", "cookies", "website cookies", "FUSION GADGETS", "privacy", "tracking"],
  alternates: {
    canonical: "/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy - FUSION GADGETS",
    description: "Learn about how FUSION GADGETS uses cookies to improve your browsing experience and provide personalized services.",
    url: "/cookie-policy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - FUSION GADGETS",
    description: "Learn about how FUSION GADGETS uses cookies to improve your browsing experience and provide personalized services.",
  },
};

export default function CookiePolicyPage() {
  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Cookie Policy', url: '/cookie-policy' },
  ]);

  const articleStructuredData = generateArticleStructuredData(
    'Cookie Policy - FUSION GADGETS',
    'Learn about how FUSION GADGETS uses cookies to improve your browsing experience and provide personalized services.',
    '/cookie-policy'
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
            <h1 className="text-3xl font-semibold mb-8">Cookie Policy</h1>
            
            <p className="text-text-secondary mb-6">Last updated: January 2024</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
              <p className="text-text-secondary leading-relaxed">
                Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Essential Cookies</h3>
                <p className="text-text-secondary leading-relaxed">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Performance Cookies</h3>
                <p className="text-text-secondary leading-relaxed">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us improve how our website works.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Functionality Cookies</h3>
                <p className="text-text-secondary leading-relaxed">
                  These cookies allow our website to remember choices you make and provide enhanced, personalized features.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Targeting Cookies</h3>
                <p className="text-text-secondary leading-relaxed">
                  These cookies record your visit to our website, the pages you have visited, and the links you have followed to deliver advertising that is more relevant to you.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p className="text-text-secondary leading-relaxed mb-4">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
              </p>
              <p className="text-text-secondary leading-relaxed">
                However, if you do this, you may have to manually adjust some preferences every time you visit our site and some services and functionalities may not work.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p className="text-text-secondary leading-relaxed">
                We may also use third-party cookies from partners such as analytics providers and advertising networks. These cookies are subject to the respective privacy policies of these external services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-text-secondary leading-relaxed">
                If you have questions about our Cookie Policy, please contact us at privacy@fusiongadgets.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}