'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Logo from '@/components/site/Logo';
import { cn } from '@/lib/utils';

// Three jobs, three links: renters, buyers, and people who need a service (selling, surveying)
const navLinks = [
  { name: 'Rent', href: '/rent' },
  { name: 'Buy', href: '/buy' },
  { name: 'Services', href: '/services' },
];

/**
 * One header for every public page.
 * `overlay` starts transparent over a dark hero and turns solid on scroll.
 */
export default function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = overlay && !scrolled;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-100 transition-colors duration-300',
        transparent
          ? 'bg-transparent'
          : 'border-b border-border/70 bg-background/85 backdrop-blur-xl'
      )}
    >
      <nav className="container-page flex h-18 items-center justify-between">
        <Logo inverted={transparent} />

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  transparent
                    ? 'text-white/85 hover:bg-white/15 hover:text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  active && (transparent ? 'text-white' : 'text-foreground')
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="group hidden md:inline-flex">
            <Link href="/contact">
              Contact us
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn('md:hidden', transparent && 'text-white hover:bg-white/15 hover:text-white')}
                aria-label="Open menu"
              >
                <Menu className="size-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full border-none bg-background p-0 sm:max-w-sm">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="flex h-full flex-col p-6 pt-16">
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="font-display py-2 text-4xl font-extrabold tracking-tight transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-3 border-t pt-6">
                  <Button asChild size="lg">
                    <Link href="/contact" onClick={() => setOpen(false)}>
                      Contact us <ArrowRight />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/services#sell" onClick={() => setOpen(false)}>Sell your property</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
