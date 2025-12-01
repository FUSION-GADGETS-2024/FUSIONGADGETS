'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth/index";
import { ProfileSkeleton } from "./profile-skeleton";
import { toast } from "sonner";
import { User, Loader2 } from "lucide-react";

export function ProfileContent() {
    const { user, profile, loading, updateProfile } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login?returnUrl=/profile');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (profile) {
            setName(profile.name || '');
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
        }
    }, [profile]);

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return (
            <div className="max-w-2xl mx-auto text-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-text-tertiary mx-auto" />
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProfile({ name, phone: phone || undefined });
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center">
                    <User className="h-8 w-8 text-text-secondary" />
                </div>
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        {profile?.name || user?.user_metadata?.name || 'User'}
                    </h1>
                    <p className="text-text-secondary">{profile?.email || user?.email}</p>
                    {profile?.user_code && (
                        <p className="text-xs text-text-tertiary">ID: {profile.user_code}</p>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}