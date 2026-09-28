import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Bath, Bed, Building, Calendar, Check, ChevronLeft, Layers, Mail, MapPin, Phone, Ruler } from 'lucide-react';
import { fetchProperty, getImageUrl } from '@/lib/api';
import { formatPrice, isRental } from '@/lib/format';
import { SITE_CONTACT } from '@/lib/site';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import MapWrapper from '@/components/MapWrapper';
import WhatsAppButton from '@/components/WhatsAppButton';
import ShareButton from '@/components/ShareButton';

const OFFICE_PHONE = SITE_CONTACT.whatsapp;
const OFFICE_EMAIL = SITE_CONTACT.email;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await fetchProperty(id);

  if (!property) {
    return {
      title: 'Property Not Found | Ground Link',
    };
  }

  const imageUrl = getImageUrl(property.image || property.images?.[0]);

  return {
    title: `${property.title} | Ground Link Real Estate`,
    description: property.description?.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description,
      url: `https://groundlink.com.sb/properties/${id}`,
      siteName: 'Ground Link Solomon Islands',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: property.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: property.title,
      description: property.description,
      images: [imageUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await fetchProperty(id);

  if (!property) notFound();

  const images = property.images || [];
  const mainImage = images[0] || property.image || '/placeholder-property.jpg';
  const displayImages = images.length > 0 ? images.slice(0, 5) : [mainImage];
  const remainingImagesCount = images.length - 5;

  const isLand = property.type.toLowerCase() === 'land';
  const place = `${property.address || property.location}, ${property.province || 'Solomon Islands'}`;
  const rental = isRental(property.status);

  const keyFacts = [
    !isLand && property.bedrooms !== undefined && { icon: Bed, value: property.bedrooms, label: 'Bedrooms' },
    !isLand && property.bathrooms !== undefined && { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
    { icon: Ruler, value: property.landArea ? `${property.landArea.toLocaleString()} m²` : '—', label: 'Land area' },
  ].filter(Boolean) as { icon: typeof Bed; value: string | number; label: string }[];

  const details = [
    property.buildingArea !== undefined && property.buildingArea > 0 && { icon: Layers, label: 'Building area', value: `${property.buildingArea} m²` },
    property.yearBuilt !== undefined && property.yearBuilt > 0 && { icon: Calendar, label: 'Year built', value: property.yearBuilt },
    { icon: Building, label: 'Property type', value: property.type },
  ].filter(Boolean) as { icon: typeof Bed; label: string; value: string | number }[];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container-page grow pt-28 pb-24">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="ghost" className="-ml-3 text-muted-foreground">
            <Link href={rental ? '/rent' : '/buy'}>
              <ChevronLeft /> {rental ? 'All rentals' : 'All properties for sale'}
            </Link>
          </Button>
          <ShareButton title={property.title} />
        </div>

        {/* Title */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <StatusBadge status={property.status} />
            <Badge variant="muted" className="capitalize">{property.type}</Badge>
            {property.featured && <Badge variant="soft">Featured</Badge>}
          </div>
          <h1 className="max-w-4xl text-4xl font-extrabold md:text-6xl">{property.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-lg text-muted-foreground">
            <MapPin className="size-5 text-primary" />
            {place}
          </p>
        </div>

        {/* Gallery */}
        <div className="mb-12 grid grid-cols-1 gap-2 overflow-hidden rounded-3xl md:h-[62vh] md:grid-cols-4 md:grid-rows-2">
          <div className="relative aspect-4/3 overflow-hidden bg-muted md:col-span-2 md:row-span-2 md:aspect-auto">
            <img src={getImageUrl(displayImages[0])} alt={property.title} className="size-full object-cover" />
          </div>

          {displayImages.slice(1, 5).map((img, index) => (
            <div key={index} className="relative hidden overflow-hidden bg-muted md:block">
              <img
                src={getImageUrl(img)}
                alt={`${property.title} - View ${index + 2}`}
                className="size-full object-cover transition-transform duration-700 ease-out hover:scale-105"
              />
              {index === 3 && remainingImagesCount > 0 && (
                <div className="absolute inset-0 grid place-items-center bg-black/50">
                  <span className="font-display text-3xl font-bold text-white">+{remainingImagesCount}</span>
                </div>
              )}
            </div>
          ))}

          {displayImages.length < 2 && (
            <div className="hidden place-items-center bg-muted text-muted-foreground md:col-span-2 md:row-span-2 md:grid">
              More photos coming soon
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Main column */}
          <div className="space-y-14 lg:col-span-8">
            {/* Key facts */}
            <div className="grid auto-cols-fr grid-flow-col divide-x rounded-2xl border bg-card">
              {keyFacts.map(({ icon: Icon, value, label }) => (
                <div key={label} className="p-5 md:p-6">
                  <Icon className="mb-3 size-5 text-primary" />
                  <p className="font-display text-2xl font-bold md:text-3xl">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <section>
              <h2 className="mb-4 text-3xl font-bold">About this property</h2>
              <div className="space-y-4 text-lg leading-relaxed text-foreground/75">
                {property.description?.split('\\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-6 text-3xl font-bold">Details</h2>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4 rounded-2xl bg-muted p-4">
                    <Icon className="size-5 text-muted-foreground" />
                    <div>
                      <dt className="text-sm text-muted-foreground">{label}</dt>
                      <dd className="font-semibold capitalize">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>

            {property.features && property.features.length > 0 && (
              <section>
                <h2 className="mb-6 text-3xl font-bold">What&apos;s included</h2>
                <ul className="flex flex-wrap gap-2">
                  {property.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 font-medium">
                      <Check className="size-4 text-primary" strokeWidth={3} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.coordinates && (
              <section>
                <h2 className="mb-2 text-3xl font-bold">Location</h2>
                <p className="mb-6 text-muted-foreground">{place}</p>
                <div className="h-[420px] overflow-hidden rounded-2xl border">
                  <MapWrapper coordinates={property.coordinates} title={property.title} />
                </div>
              </section>
            )}
          </div>

          {/* Sticky contact card */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 overflow-hidden rounded-3xl border bg-card">
              <div className="on-dark bg-ink-glow p-6 text-ink-foreground">
                <p className="text-sm text-ink-foreground/60">{rental ? 'Rent' : 'Asking price'}</p>
                <p className="font-display text-4xl font-extrabold">
                  {formatPrice(property.price)}
                  {rental && <span className="ml-1 text-lg font-semibold text-ink-foreground/60">/ month</span>}
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-full bg-primary/10 font-display text-lg font-bold text-primary">
                    {property.agent?.name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Listed by</p>
                    <p className="font-semibold">{property.agent?.name || 'Ground Link Agent'}</p>
                  </div>
                </div>

                <WhatsAppButton
                  phone={OFFICE_PHONE}
                  title={property.title}
                  id={property._id}
                  rental={rental}
                  label={rental ? 'Book a viewing on WhatsApp' : 'Enquire on WhatsApp'}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="lg">
                    <a href={`tel:${property.agent?.phone || `+${OFFICE_PHONE}`}`}>
                      <Phone /> Call
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href={`mailto:${property.agent?.email || OFFICE_EMAIL}?subject=${encodeURIComponent(property.title)}`}>
                      <Mail /> Email
                    </a>
                  </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">Ref: {property._id}</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
