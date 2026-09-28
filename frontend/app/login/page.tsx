'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAdmin } from '@/lib/api'; // Use the shared API logic
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import Logo from '@/components/site/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginAdmin(formData);

      toast.success('Logged in successfully!');

      // Refresh to update server-side auth state before redirecting
      router.refresh();

      setTimeout(() => {
        router.push('/admin/properties/all');
      }, 800);
    } catch (err: any) {
      toast.error(err.message || 'Unable to connect to the server.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="on-dark relative hidden overflow-hidden bg-ink p-12 lg:flex lg:flex-col lg:justify-between">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/20" />
        <Logo inverted className="relative" />
        <div className="relative">
          <h1 className="text-6xl leading-[0.9] font-extrabold text-white">
            Manage your<br /><span className="text-gradient">listings.</span>
          </h1>
          <p className="mt-4 max-w-sm text-white/70">Properties, hero slides and team, all in one place.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <Logo className="mb-12 lg:hidden" />
          <h2 className="text-4xl font-extrabold">Welcome back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to the Ground Link admin.</p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@groundlink.sb"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <ArrowRight />
                </>
              )}
            </Button>
          </form>

          <Link href="/" className="mt-10 inline-block text-sm text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
