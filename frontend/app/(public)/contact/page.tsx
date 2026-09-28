import type { Metadata } from 'next';
import { CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import MapWrapper from '@/components/MapWrapper';
import ContactForm from '@/components/site/ContactForm';
import { SITE_CONTACT, TOPICS, Topic, whatsappLink } from '@/lib/site';

export const metadata: Metadata = { title: 'About & Contact | Ground Link' };

const HONIARA = { lat: -9.4295, lng: 159.9556 };

const channels = [
  { icon: Phone, title: 'Call or WhatsApp', detail: SITE_CONTACT.phoneDisplay, href: `tel:+${SITE_CONTACT.whatsapp}` },
  { icon: Mail, title: 'Email', detail: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}` },
  { icon: MapPin, title: 'Office', detail: SITE_CONTACT.office, href: '#map' },
  { icon: Clock, title: 'Hours', detail: SITE_CONTACT.hours },
];

const pillars = [
  { icon: MapPin, title: 'Local team', desc: 'Based in Honiara, with contacts across the provinces.' },
  { icon: ShieldCheck, title: 'Safe deals', desc: 'We know customary and registered land, so your purchase is protected.' },
  { icon: CheckCircle2, title: 'Checked listings', desc: 'Our team checks every property before it goes on the site.' },
];

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { topic } = await searchParams;
  const initialTopic = typeof topic === 'string' && topic in TOPICS ? (topic as Topic) : undefined;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Intro */}
      <section className="bg-page-glow pt-36 pb-12 md:pt-44">
        <div className="container-page grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4">About &amp; contact</p>
            <h1 className="text-5xl leading-[0.95] font-extrabold md:text-7xl">
              Local people. <span className="text-gradient">Straight answers.</span>
            </h1>
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg text-muted-foreground">
              Ground Link is a Honiara team helping families and investors rent, buy, sell and survey property in the
              Solomon Islands.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#20ba5a]">
                <a href={whatsappLink('Hi Ground Link, ')} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:+${SITE_CONTACT.whatsapp}`}>
                  <Phone /> Call
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="message" className="scroll-mt-24 pb-20">
        <div className="container-page grid items-start gap-10 lg:grid-cols-12">
          <div className="rounded-3xl border bg-card p-6 md:p-10 lg:col-span-7">
            <ContactForm key={initialTopic} initialTopic={initialTopic} />
          </div>

          <div className="space-y-3 lg:col-span-5">
            {channels.map((item) => {
              const body = (
                <>
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{item.title}</p>
                    <p className="truncate font-semibold">{item.detail}</p>
                  </div>
                </>
              );
              const cls = 'flex items-center gap-5 rounded-2xl border bg-card p-5';
              return item.href ? (
                <a key={item.title} href={item.href} className={`${cls} transition-colors hover:border-primary`}>
                  {body}
                </a>
              ) : (
                <div key={item.title} className={cls}>
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 pb-20">
        <div className="container-page">
          <div className="grid gap-12 overflow-hidden on-dark rounded-3xl bg-ink-glow p-8 text-ink-foreground md:p-14 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-6">
              <p className="eyebrow">About us</p>
              <h2 className="text-4xl font-extrabold md:text-5xl">
                Built for the <span className="text-gradient">Hapi Isles.</span>
              </h2>
              <p className="text-lg text-ink-foreground/70">
                Ground Link started with a simple observation: finding verified land and good homes in our own country
                shouldn&apos;t be this hard. We&apos;re not a remote corporation. We&apos;re a local team fixing the
                market from the ground up, with a modern service that respects customary tradition.
              </p>
              <blockquote className="border-l-2 border-primary pl-5 text-ink-foreground/85 italic">
                &ldquo;In the Solomon Islands, property is more than an asset. It&apos;s our legacy.&rdquo;
                <footer className="mt-2 text-sm text-ink-foreground/50 not-italic">The Founder, Ground Link</footer>
              </blockquote>
            </div>
            <div className="grid content-start gap-3">
              {pillars.map((p) => (
                <div key={p.title} className="flex gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                  <p.icon className="size-7 shrink-0 text-primary" strokeWidth={1.75} />
                  <div>
                    <h3 className="text-xl font-bold">{p.title}</h3>
                    <p className="mt-1 text-ink-foreground/65">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="scroll-mt-24 pb-20">
        <div className="container-page">
          <div className="h-[380px] overflow-hidden rounded-3xl border">
            <MapWrapper coordinates={HONIARA} title="Ground Link, Honiara" />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
