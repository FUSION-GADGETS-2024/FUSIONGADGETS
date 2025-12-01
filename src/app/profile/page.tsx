import { Metadata } from 'next';
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProfileContent } from "./profile-content";
import { ProfileSkeleton } from "./profile-skeleton";

// Hybrid rendering - Server for layout, Client for user data
export const metadata: Metadata = {
  title: 'My Profile | Fusion Gadgets',
  description: 'Manage your account settings and preferences',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16 bg-background">
        <div className="container mx-auto px-8 py-16">
          <h1 className="text-2xl font-semibold text-foreground mb-8">My Profile</h1>
          
          {/* Profile Content - Client Component with Suspense */}
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
