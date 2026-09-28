import Link from 'next/link';
import Logo from '@/components/site/Logo';
import { PROPERTY_TYPES } from '@/lib/format';

export default function SiteFooter() {
  return (
    <footer className="on-dark mt-auto bg-ink-glow text-ink-foreground">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverted />
          <p className="mt-5 max-w-sm text-ink-foreground/60">
            Verified homes, land and commercial space across Honiara and the Solomon Islands.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground/40">Browse</p>
          <ul className="mt-4 space-y-2.5">
            {PROPERTY_TYPES.map((type) => (
              <li key={type}>
                <Link href={`/types/${type.toLowerCase()}`} className="text-ink-foreground/80 transition-colors hover:text-primary">
                  {type}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground/40">Ground Link</p>
          <ul className="mt-4 space-y-2.5">
            {[
              { name: 'Homes for rent', href: '/rent' },
              { name: 'Property for sale', href: '/buy' },
              { name: 'Sell your property', href: '/services#sell' },
              { name: 'Land survey', href: '/services#survey' },
              { name: 'About & contact', href: '/contact' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-foreground/80 transition-colors hover:text-primary">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col justify-between gap-2 py-6 text-sm text-ink-foreground/50 sm:flex-row">
          <p>© {new Date().getFullYear()} Ground Link. All rights reserved.</p>
          <p>
            Honiara, Solomon Islands ·{' '}
            <Link href="/login" className="transition-colors hover:text-ink-foreground">Agent sign in</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
