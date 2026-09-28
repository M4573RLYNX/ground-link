import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchProperties } from '@/lib/api';
import PropertyCard from '@/components/PropertyCard';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import HeroSearch from '@/components/HeroSearch';
import { Button } from '@/components/ui/button';

const VALID_TYPES = ['house', 'land', 'apartment', 'commercial'];

// Title, blurb and hero image per property type
const typeMeta: Record<string, { title: string; desc: string; image: string }> = {
  house: {
    title: "Homes",
    desc: "Premium residences and family homes on Honiara's most sought-after ridges.",
    image: "https://images.unsplash.com/photo-1664780476492-fbb9fd277ce8?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  land: {
    title: "Land",
    desc: "Investment-ready plots and beachfront acreage with verified titles across the provinces.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop"
  },
  apartment: {
    title: "Apartments",
    desc: "Modern apartments and multi-family units for professionals and expats.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1935&auto=format&fit=crop"
  },
  commercial: {
    title: "Commercial",
    desc: "Offices, retail and industrial lots for your next venture.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
  }
};

export default async function PropertyTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const decodedType = decodeURIComponent(type).toLowerCase();

  if (!VALID_TYPES.includes(decodedType)) {
    return notFound();
  }

  const allProperties = await fetchProperties();
  const filteredProperties = allProperties.filter(
    (p) => p.type.toLowerCase() === decodedType && p.status !== 'withdrawn'
  );

  const meta = typeMeta[decodedType];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader overlay />

      <section className="on-dark relative overflow-hidden bg-ink pt-40 pb-32">
        <img src={meta.image} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/50" />

        <div className="container-page relative">
          <p className="eyebrow mb-4 text-white/80">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'listing' : 'listings'}
          </p>
          <h1 className="text-6xl font-extrabold text-white md:text-8xl">
            {meta.title}<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">{meta.desc}</p>
        </div>
      </section>

      <section className="container-page relative z-10 -mt-12">
        <HeroSearch tabs initialValues={{ type: decodedType.charAt(0).toUpperCase() + decodedType.slice(1) }} />
      </section>

      <main className="container-page grow py-16">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card py-24 text-center">
            <h3 className="text-2xl font-bold">Nothing listed here right now</h3>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Tell us what you&apos;re looking for and we&apos;ll let you know when something comes up.
            </p>
            <Button asChild className="mt-6">
              <Link href="/contact#message">Get notified</Link>
            </Button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
