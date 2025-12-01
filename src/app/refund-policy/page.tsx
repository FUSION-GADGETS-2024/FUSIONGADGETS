import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { generateBreadcrumbStructuredData } from '@/lib/seo';

// Pure SSG - No hydration needed
export const metadata: Metadata = {
  title: 'Refund Policy | Fusion Gadgets',
  description: 'Learn about our refund and return policy at Fusion Gadgets. We offer hassle-free returns within 30 days of purchase.',
  keywords: ['refund policy', 'return policy', 'fusion gadgets returns'],
  openGraph: {
    title: 'Refund Policy | Fusion Gadgets',
    description: 'Learn about our refund and return policy at Fusion Gadgets.',
  },
  alternates: {
    canonical: '/refund-policy',
  },
};

export default function RefundPolicyPage() {
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Refund Policy', url: '/refund-policy' },
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
            <h1 className="text-3xl font-semibold text-foreground mb-8">Refund Policy</h1>
            
            <div className="prose prose-neutral max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">30-Day Return Policy</h2>
                <p className="text-text-secondary leading-relaxed">
                  At Fusion Gadgets, we want you to be completely satisfied with your purchase. 
                  If you're not happy with your order, you can return it within 30 days of delivery 
                  for a full refund or exchange.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Eligibility for Returns</h2>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Product must be in its original, unused condition</li>
                  <li>• All original packaging, tags, and accessories must be included</li>
                  <li>• Product must not be damaged due to misuse or negligence</li>
                  <li>• Return request must be initiated within 30 days of delivery</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">How to Initiate a Return</h2>
                <ol className="space-y-2 text-text-secondary list-decimal list-inside">
                  <li>Log in to your account and go to Order History</li>
                  <li>Select the order containing the item you wish to return</li>
                  <li>Click on "Request Return" and select the reason</li>
                  <li>Our team will review your request within 24-48 hours</li>
                  <li>Once approved, you'll receive pickup instructions</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Refund Process</h2>
                <p className="text-text-secondary leading-relaxed mb-4">
                  Once we receive and inspect the returned item, we'll process your refund within 
                  5-7 business days. The refund will be credited to your original payment method.
                </p>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Credit/Debit Card: 5-7 business days</li>
                  <li>• UPI: 2-3 business days</li>
                  <li>• Net Banking: 5-7 business days</li>
                  <li>• Cash on Delivery: Bank transfer within 7-10 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Non-Returnable Items</h2>
                <p className="text-text-secondary leading-relaxed">
                  The following items cannot be returned:
                </p>
                <ul className="space-y-2 text-text-secondary mt-2">
                  <li>• Products with broken seals or tampered packaging</li>
                  <li>• Personalized or customized items</li>
                  <li>• Items marked as "Final Sale" or "Non-Returnable"</li>
                  <li>• Software licenses and digital products</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-text-secondary leading-relaxed">
                  If you have any questions about our refund policy, please contact our customer 
                  support team at{' '}
                  <a href="mailto:support@fusiongadgets.com" className="text-foreground hover:underline">
                    support@fusiongadgets.com
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
