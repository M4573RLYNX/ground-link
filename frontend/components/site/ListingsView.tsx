import Link from 'next/link';
import { ArrowRight, CalendarCheck, FileCheck2, KeyRound, MessageCircle, Ruler, Scale } from 'lucide-react';
import { fetchProperties, Property } from '@/lib/api';
import { Deal, matchesBudget, matchesDeal } from '@/lib/format';
import PropertyCard from '@/components/PropertyCard';
import HeroSearch from '@/components/HeroSearch';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Params = { [key: string]: string | string[] | undefined };

const single = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const copy: Record<Deal, { eyebrow: string; title: string; blurb: string }> = {
  rent: {
    eyebrow: 'For rent',
    title: 'Find a place to live.',
    blurb: 'Houses and apartments ready to move into. Message us on WhatsApp and we’ll arrange a viewing.',
  },
  buy: {
    eyebrow: 'For sale',
    title: 'Buy land or a home.',
    blurb: 'Homes, land and commercial property. We check the title on every listing before it goes live.',
  },
};

/** Short, deal-specific "how it works" so first-timers know what happens after they find something */
const steps: Record<Deal, { icon: typeof KeyRound; title: string; desc: string }[]> = {
  rent: [
    { icon: MessageCircle, title: 'Message us', desc: 'Tap WhatsApp on any listing. We usually reply within 2 hours.' },
    { icon: CalendarCheck, title: 'View it', desc: 'We book a viewing at a time that suits you, weekdays or Saturday.' },
    { icon: KeyRound, title: 'Move in', desc: 'Sign the lease, pay the bond, and pick up the keys.' },
  ],
  buy: [
    { icon: FileCheck2, title: 'Title checked', desc: 'We confirm ownership and the land register before a listing goes live.' },
    { icon: Ruler, title: 'Survey on request', desc: 'Our surveyors can peg the boundaries before you commit.' },
    { icon: Scale, title: 'Offer to transfer', desc: 'We walk you through the offer, the deposit and the title transfer.' },
  ],
};

export default async function ListingsView({ deal, searchParams }: { deal?: Deal; searchParams: Params }) {
  let all: Property[] = [];
  try {
    all = await fetchProperties();
  } catch (error) {
    console.error('Failed to load properties:', error);
  }

  const values = {
    type: single(searchParams.type),
    location: single(searchParams.location),
    price: single(searchParams.price),
    beds: single(searchParams.beds),
  };
  const minBeds = Number(values.beds) || 0;
  const q = values.location?.toLowerCase();

  const results = all.filter((p) => {
    if (deal ? !matchesDeal(p, deal) : p.status === 'withdrawn') return false;
    if (values.type && p.type.toLowerCase() !== values.type.toLowerCase()) return false;
    if (q && !p.location.toLowerCase().includes(q) && !p.province?.toLowerCase().includes(q)) return false;
    if (deal && !matchesBudget(p.price, deal, values.price)) return false;
    if (minBeds && (p.bedrooms ?? 0) < minBeds) return false;
    return true;
  });

  const filtered = Boolean(values.type || values.location || values.price || values.beds);
  const head = deal ? copy[deal] : { eyebrow: 'Listings', title: 'All properties.', blurb: '' };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="border-b bg-card bg-page-glow pt-32 pb-10">
        <div className="container-page">
          <p className="eyebrow mb-3">{head.eyebrow}</p>
          <h1 className="text-5xl font-extrabold md:text-7xl">{head.title}</h1>
          {head.blurb && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{head.blurb}</p>}
          <div className="mt-8">
            <HeroSearch
              key={deal ?? 'all'}
              deal={deal ?? 'buy'}
              tabs
              initialValues={values}
              className="[&_form]:shadow-lg [&_form]:shadow-black/5"
            />
          </div>
        </div>
      </section>

      <main className="container-page grow py-12">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">
            <span className="font-display text-lg font-bold text-foreground">{results.length}</span>{' '}
            {results.length === 1 ? 'property' : 'properties'} {deal === 'rent' ? 'for rent' : deal === 'buy' ? 'for sale' : 'listed'}
          </p>
          {filtered && (
            <Link href={deal ? `/${deal}` : '/properties'} className="text-sm font-semibold text-primary hover:underline">
              Clear filters
            </Link>
          )}
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-20 text-center">
            <h3 className="text-2xl font-bold">Nothing matches yet</h3>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              {deal === 'rent'
                ? 'Most rentals go before they reach the website. Tell us what you need and we’ll let you know when something comes up.'
                : 'Try a wider budget or another area, or tell us what you’re after and we’ll look for it.'}
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link href={`/contact?topic=${deal === 'rent' ? 'rent' : 'buy'}#message`}>
                Tell us what you need <ArrowRight />
              </Link>
            </Button>
          </div>
        )}

        {deal && (
          <section className="mt-20 rounded-3xl bg-soft-gradient p-6 md:p-10">
            <h2 className="text-2xl font-bold md:text-3xl">
              {deal === 'rent' ? 'Renting with Ground Link' : 'Buying with Ground Link'}
            </h2>
            <ol className="mt-6 grid gap-6 md:grid-cols-3">
              {steps[deal].map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl bg-card text-primary ring-1 ring-border')}>
                    <s.icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-semibold">
                      <span className="text-muted-foreground">{i + 1}.</span> {s.title}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
