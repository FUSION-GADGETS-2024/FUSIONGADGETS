import { Metadata } from 'next';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { generateBreadcrumbStructuredData } from '@/lib/seo';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

// Pure SSG - No hydration needed
export const metadata: Metadata = {
  title: 'Contact Us | Fusion Gadgets',
  description: 'Get in touch with Fusion Gadgets. We are here to help with your questions about products, orders, and more.',
  keywords: ['contact fusion gadgets', 'customer support', 'help', 'reach us'],
  openGraph: {
    title: 'Contact Us | Fusion Gadgets',
    description: 'Get in touch with Fusion Gadgets. We are here to help.',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact' },
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-foreground mb-8">Contact Us</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Get in Touch</h2>
                <p className="text-text-secondary mb-8">
                  Have a question or need assistance? We're here to help. Reach out to us through 
                  any of the following channels.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">Email</h3>
                      <a href="mailto:support@fusiongadgets.com" className="text-text-secondary hover:text-foreground transition-colors">
                        support@fusiongadgets.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">Phone</h3>
                      <a href="tel:+911234567890" className="text-text-secondary hover:text-foreground transition-colors">
                        +91 123 456 7890
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">Address</h3>
                      <p className="text-text-secondary">
                        123 Tech Park, Sector 5<br />
                        Mumbai, Maharashtra 400001<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">Business Hours</h3>
                      <p className="text-text-secondary">
                        Monday - Saturday: 9:00 AM - 8:00 PM<br />
                        Sunday: 10:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQ Section */}
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">How can I track my order?</h3>
                    <p className="text-text-secondary text-sm">
                      Once your order is shipped, you'll receive a tracking number via email. 
                      You can also track your order from your account dashboard.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">What is your return policy?</h3>
                    <p className="text-text-secondary text-sm">
                      We offer a 30-day return policy for all products in their original condition. 
                      Please visit our refund policy page for more details.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Do you offer warranty?</h3>
                    <p className="text-text-secondary text-sm">
                      Yes, all products come with manufacturer warranty. The warranty period varies 
                      by product and is mentioned on the product page.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">What payment methods do you accept?</h3>
                    <p className="text-text-secondary text-sm">
                      We accept all major credit/debit cards, UPI, net banking, and cash on delivery 
                      for eligible orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
