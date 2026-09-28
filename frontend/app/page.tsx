import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Building2, ChevronDown, Home, KeyRound, LandPlot, Ruler, Store, Tags } from 'lucide-react';
import { fetchProperties, Property } from '@/lib/api';
import { PROPERTY_TYPES, matchesDeal } from '@/lib/format';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import HeroSearch from '@/components/HeroSearch';
import HeroVideo from '@/components/HeroVideo';

const typeIcons = { House: Home, Land: LandPlot, Apartment: Building2, Commercial: Store };

const popularSearches = [
  { label: 'Houses for rent', href: '/rent?type=House' },
  { label: 'Apartments in Honiara', href: '/rent?type=Apartment&location=Honiara' },
  { label: 'Land for sale', href: '/buy?type=Land' },
  { label: 'Beachfront', href: '/buy?type=Beachfront' },
  { label: 'Land survey', href: '/services#survey' },
];

const paths = [
  {
    icon: KeyRound,
    title: 'Rent a home',
    desc: 'Houses and apartments ready to move into. Book a viewing on WhatsApp.',
    cta: 'Browse rentals',
    href: '/rent',
  },
  {
    icon: Tags,
    title: 'Buy property',
    desc: 'Homes, land and commercial property, with the title checked on every listing.',
    cta: 'Browse for sale',
    href: '/buy',
  },
  {
    icon: Ruler,
    title: 'Sell or survey',
    desc: 'A free price estimate, serious buyers, and land surveys by our own team.',
    cta: 'See our services',
    href: '/services',
  },
];

export default async function LandingPage() {
  let properties: Property[] = [];
  try {
    properties = await fetchProperties();
  } catch (error) {
    console.error('Failed to load data:', error);
  }

  // Featured listings first, then fill with the latest
  const pick = (list: Property[]) => [...list.filter((p) => p.featured), ...list.filter((p) => !p.featured)].slice(0, 3);
  const rentals = properties.filter((p) => matchesDeal(p, 'rent'));
  const forSale = properties.filter((p) => matchesDeal(p, 'buy'));
  const rows = [
    { key: 'rent', eyebrow: 'For rent', title: 'Move in soon.', href: '/rent', all: rentals.length, items: pick(rentals) },
    { key: 'buy', eyebrow: 'For sale', title: 'Own your ground.', href: '/buy', all: forSale.length, items: pick(forSale) },
  ].filter((r) => r.items.length > 0);

  const countByType = (type: string) =>
    properties.filter((p) => p.type.toLowerCase() === type.toLowerCase()).length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader overlay />

      {/* Hero: the search is the centrepiece; copy frames it */}
      <section className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-24">
        <HeroVideo />

        <div className="container-page relative z-10 flex flex-col items-center text-center">
          <h1 className="on-dark max-w-3xl text-4xl leading-[1.02] font-extrabold text-white text-balance md:text-6xl">
            Find your <span className="text-gradient">ground</span> in the Solomon Islands.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
            Search verified homes, land and commercial space from Honiara to Gizo.
          </p>

          <div className="mt-10 w-full animate-in fade-in slide-in-from-bottom-6 fill-mode-both delay-200 duration-700 md:mt-12">
            <HeroSearch variant="hero" deal="rent" tabs />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm animate-in fade-in fill-mode-both delay-500 duration-700">
            <span className="mr-1 font-medium text-white/70">Try:</span>
            {popularSearches.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-foreground"
              >
                {s.label}
              </Link>
            ))}
          </div>

          {properties.length > 0 && (
            <p className="mt-8 text-sm font-medium text-white/65">
              {rentals.length} for rent · {forSale.length} for sale · across{' '}
              {new Set(properties.map((p) => p.province).filter(Boolean)).size} provinces
            </p>
          )}
        </div>

        <a
          href="#featured"
          aria-label="Scroll to featured listings"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full p-2 text-white/70 transition-colors hover:text-white"
        >
          <ChevronDown className="size-6 animate-bounce" />
        </a>
      </section>

      {/* Three ways in: renters, buyers, sellers */}
      <section id="featured" className="scroll-mt-18 py-20 md:py-24">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {paths.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group flex flex-col rounded-2xl border bg-card bg-linear-to-br from-card to-accent/60 p-7 transition-colors hover:border-primary"
            >
              <p.icon className="size-8 text-primary" strokeWidth={1.75} />
              <h2 className="mt-8 text-3xl font-extrabold">{p.title}</h2>
              <p className="mt-2 grow text-muted-foreground">{p.desc}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary">
                {p.cta}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {rows.map((row) => (
        <section key={row.key} className="pb-20 md:pb-28">
          <div className="container-page">
            <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="eyebrow mb-3">{row.eyebrow}</p>
                <h2 className="text-4xl font-extrabold md:text-6xl">{row.title}</h2>
              </div>
              <Button asChild variant="outline" size="lg" className="group self-start md:self-auto">
                <Link href={row.href}>
                  All {row.all} {row.key === 'rent' ? 'rentals' : 'for sale'}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {row.items.map((prop) => (
                <PropertyCard key={prop._id} property={prop} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Categories */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="mb-12">
            <p className="eyebrow mb-3">Browse</p>
            <h2 className="text-4xl font-extrabold md:text-6xl">What are you after?</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {PROPERTY_TYPES.map((type) => {
              const Icon = typeIcons[type];
              const count = countByType(type);
              return (
                <Link
                  key={type}
                  href={`/types/${type.toLowerCase()}`}
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-border transition-all duration-300 hover:bg-ink hover:text-ink-foreground hover:ring-ink md:p-7"
                >
                  <div className="flex items-start justify-between">
                    <Icon className="size-8 text-primary md:size-10" strokeWidth={1.75} />
                    <ArrowUpRight className="size-5 opacity-0 transition-all group-hover:opacity-100 md:size-6" />
                  </div>
                  <div>
                    <p className="font-display text-5xl font-extrabold md:text-7xl">{count}</p>
                    <p className="mt-1 text-lg font-semibold md:text-xl">{type}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 md:pb-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-primary-foreground md:px-16 md:py-20">
            <div className="absolute -right-16 -bottom-24 size-80 rounded-full border-[40px] border-white/10" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-extrabold md:text-6xl">Selling land or a home?</h2>
                <p className="mt-4 text-lg text-primary-foreground/85">
                  Get a free price estimate and reach serious buyers across the Solomon Islands and overseas. Need
                  the boundaries confirmed first? Our surveyors can help.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 self-start md:self-auto">
                <Button asChild size="xl" variant="ink">
                  <Link href="/contact?topic=sell#message">
                    Free price estimate <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="xl" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link href="/services#survey">Land survey</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
