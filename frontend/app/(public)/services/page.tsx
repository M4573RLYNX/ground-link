import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Camera,
  Check,
  ClipboardList,
  FileText,
  Handshake,
  KeyRound,
  LandPlot,
  MapPinned,
  Mountain,
  Ruler,
  Scale,
  Split,
  Tags,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export const metadata: Metadata = { title: 'Services: Selling, Rentals & Land Survey | Ground Link' };

const jump = [
  { label: 'Sell a property', href: '#sell', icon: Tags },
  { label: 'Rent out a property', href: '#rentals', icon: KeyRound },
  { label: 'Land survey', href: '#survey', icon: Ruler },
  { label: 'Valuation', href: '#valuation', icon: Scale },
];

const sellSteps = [
  { icon: Scale, title: 'Free price estimate', desc: 'We visit, compare recent sales nearby, and agree an asking price with you.' },
  { icon: Camera, title: 'Photos & listing', desc: 'Professional photos, a clear write-up, and a listing on Ground Link and our buyer network.' },
  { icon: Handshake, title: 'Buyers & offers', desc: 'We screen enquiries, run viewings and negotiate offers on your behalf.' },
  { icon: FileText, title: 'Transfer', desc: 'We coordinate the paperwork through to title transfer and settlement.' },
];

const surveyTypes = [
  { icon: MapPinned, title: 'Boundary survey & pegging', desc: 'Locate and re-mark your boundaries before you build, fence, buy or sell.' },
  { icon: Split, title: 'Subdivision survey', desc: 'Split a parcel into lots, with plans prepared for approval.' },
  { icon: Mountain, title: 'Topographic survey', desc: 'Levels and site features for architects, engineers and builders.' },
  { icon: LandPlot, title: 'Customary land mapping', desc: 'GPS mapping of customary boundaries to support land recording and family agreements.' },
];

const surveySteps = [
  'Tell us about the land and share any title or plan you have',
  'We quote and book a site visit',
  'Our team carries out the fieldwork and pegs the boundaries',
  'You receive a survey plan and report',
];

export default function ServicesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Intro */}
      <section className="bg-page-glow pt-36 pb-12 md:pt-44">
        <div className="container-page">
          <p className="eyebrow mb-4">Services</p>
          <h1 className="max-w-4xl text-5xl leading-[0.95] font-extrabold md:text-7xl">
            Selling, letting or surveying? <span className="text-gradient">We handle it.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-muted-foreground">
            One local team for property sales, rental management and land surveying across the Solomon Islands.
          </p>

          <nav aria-label="Services" className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
            {jump.map((j) => (
              <a
                key={j.href}
                href={j.href}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-4 font-semibold transition-colors hover:border-primary hover:text-primary md:p-5"
              >
                <j.icon className="size-5 shrink-0 text-primary" />
                {j.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Sell */}
      <section id="sell" className="scroll-mt-24 py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow mb-3">Sell</p>
            <h2 className="text-4xl font-extrabold md:text-5xl">Sell your home or land.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We price it right, find serious buyers in the Solomons and overseas, and see the sale through to transfer.
            </p>
            <Button asChild size="xl" className="mt-8">
              <Link href="/contact?topic=sell#message">
                Get a free price estimate <ArrowRight />
              </Link>
            </Button>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
            {sellSteps.map((s, i) => (
              <li key={s.title} className="rounded-2xl border bg-card p-6">
                <div className="mb-6 flex items-center justify-between">
                  <s.icon className="size-7 text-primary" strokeWidth={1.75} />
                  <span className="font-display text-sm font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rentals */}
      <section id="rentals" className="scroll-mt-24 py-16 md:py-20">
        <div className="container-page">
          <div className="grid gap-10 rounded-3xl bg-soft-gradient p-8 md:p-14 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3">Rentals</p>
              <h2 className="text-4xl font-extrabold md:text-5xl">Rent out your property.</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We find reliable tenants and can manage the tenancy for you, so you get paid without the phone calls.
              </p>
              <Button asChild size="xl" variant="ink" className="mt-8">
                <Link href="/contact?topic=rent-out#message">
                  List your rental <ArrowRight />
                </Link>
              </Button>
            </div>
            <ul className="space-y-3">
              {[
                'Tenant finding, with checks and references',
                'Written lease and bond handled properly',
                'Monthly rent collection and statements',
                'Repairs arranged with trusted local trades',
                'Regular inspections with photos',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl bg-card p-4 font-medium">
                  <Check className="mt-0.5 size-5 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Land survey */}
      <section id="survey" className="scroll-mt-24 py-16 md:py-20">
        <div className="container-page">
          <div className="on-dark overflow-hidden rounded-3xl bg-ink-glow text-ink-foreground">
            <div className="grid gap-10 p-8 md:p-14 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <p className="eyebrow mb-3">Land survey</p>
                <h2 className="text-4xl font-extrabold md:text-5xl">
                  Know exactly where <span className="text-gradient">your land</span> begins and ends.
                </h2>
                <p className="mt-4 text-lg text-ink-foreground/70">
                  Boundary disputes and unclear plans are the biggest risk in Solomon Islands property. A proper survey
                  protects you before you buy, build, subdivide or sell.
                </p>
                <Button asChild size="xl" className="mt-8">
                  <Link href="/contact?topic=survey#message">
                    Request a survey quote <ArrowRight />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
                {surveyTypes.map((s) => (
                  <div key={s.title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                    <s.icon className="mb-6 size-7 text-primary" strokeWidth={1.75} />
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <p className="mt-2 text-ink-foreground/65">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-8 md:px-14 md:py-10">
              <p className="mb-5 flex items-center gap-2 font-semibold">
                <ClipboardList className="size-5 text-primary" /> How a survey works
              </p>
              <ol className="grid gap-5 md:grid-cols-4">
                {surveySteps.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <span className="text-ink-foreground/80">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Valuation */}
      <section id="valuation" className="scroll-mt-24 py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-8 rounded-3xl border bg-card p-8 md:flex-row md:items-center md:p-14">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Valuation</p>
              <h2 className="text-4xl font-extrabold md:text-5xl">What is it worth?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Written valuations for sales, bank lending, family settlements and insurance, based on local evidence.
              </p>
            </div>
            <Button asChild size="xl" variant="outline" className="self-start md:self-auto">
              <Link href="/contact?topic=valuation#message">
                Book a valuation <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
