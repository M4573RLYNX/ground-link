'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchProperty, getImageUrl, Property } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Bath, Bed, Calendar, Check, ExternalLink, Mail, MapPin, Pencil, Phone, Ruler } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/StatusBadge';

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
});

export default function AdminPropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProperty(id);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load property');
        toast.error('Could not load property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !property) {
    return (
      <div className="rounded-2xl border bg-card py-16 text-center">
        <h2 className="text-2xl font-bold">Couldn&apos;t load property</h2>
        <p className="mt-2 mb-6 text-muted-foreground">{error || 'Property not found'}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft /> Go back
        </Button>
      </div>
    );
  }

  const mainImage = property.images?.[0] || property.image;
  const hasCoords = property.coordinates?.lat && property.coordinates?.lng;

  const specs = [
    property.bedrooms !== undefined && { icon: Bed, value: property.bedrooms, label: 'Bedrooms' },
    property.bathrooms !== undefined && { icon: Bath, value: property.bathrooms, label: 'Bathrooms' },
    !!property.landArea && { icon: Ruler, value: `${property.landArea} m²`, label: 'Land area' },
    !!property.yearBuilt && { icon: Calendar, value: property.yearBuilt, label: 'Year built' },
  ].filter(Boolean) as { icon: typeof Bed; value: string | number; label: string }[];

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4 -ml-3 text-muted-foreground" onClick={() => router.back()}>
        <ArrowLeft /> Back
      </Button>

      <PageHeader
        title={property.title}
        description={
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            {property.address || property.location}, {property.province || 'Solomon Islands'}
          </span>
        }
        actions={
          <>
            <Button variant="outline" onClick={() => window.open(`/properties/${id}`, '_blank')}>
              <ExternalLink /> View live
            </Button>
            <Button onClick={() => router.push(`/admin/properties/${id}/edit`)}>
              <Pencil /> Edit
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="aspect-video overflow-hidden rounded-2xl bg-muted">
            <img src={getImageUrl(mainImage)} alt={property.title} className="size-full object-cover" />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {specs.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {specs.map(({ icon: Icon, value, label }) => (
                    <div key={label} className="rounded-2xl border bg-card p-4">
                      <Icon className="mb-2 size-5 text-primary" />
                      <p className="font-display text-2xl font-bold">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <h2 className="mb-3 text-xl font-bold">Description</h2>
                <p className="leading-relaxed whitespace-pre-wrap text-foreground/75">
                  {property.description || 'No description provided.'}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features">
              {property.features?.length ? (
                <ul className="flex flex-wrap gap-2">
                  {property.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium">
                      <Check className="size-4 text-primary" strokeWidth={3} />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No features listed for this property.</p>
              )}
            </TabsContent>

            <TabsContent value="location" className="space-y-4">
              {hasCoords && (
                <p className="font-mono text-sm text-muted-foreground">
                  {property.coordinates?.lat.toFixed(6)}, {property.coordinates?.lng.toFixed(6)}
                </p>
              )}
              {hasCoords && property.coordinates ? (
                <div className="h-96 overflow-hidden rounded-2xl border">
                  <PropertyMap coordinates={property.coordinates} title={property.title} />
                </div>
              ) : (
                <div className="grid h-64 place-items-center rounded-2xl border border-dashed bg-card text-muted-foreground">
                  No coordinates set for this property
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:h-fit">
          <div className="overflow-hidden rounded-2xl border bg-card">
            <div className="bg-ink p-5 text-ink-foreground">
              <p className="text-sm text-ink-foreground/60">Price</p>
              <p className="font-display text-3xl font-extrabold">{formatPrice(property.price)}</p>
            </div>
            <div className="flex flex-wrap gap-2 p-5">
              <StatusBadge status={property.status} />
              <Badge variant="muted" className="capitalize">{property.type}</Badge>
              {property.featured && <Badge variant="soft">Featured</Badge>}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <h3 className="mb-4 text-lg font-bold">Listing agent</h3>
            {property.agent && property.agent.name ? (
              <div className="space-y-2.5 text-sm">
                <p className="text-base font-semibold">{property.agent.name}</p>
                {property.agent.phone && (
                  <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground">
                    <Phone className="size-4" /> {property.agent.phone}
                  </a>
                )}
                {property.agent.email && (
                  <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2.5 break-all text-muted-foreground hover:text-foreground">
                    <Mail className="size-4" /> {property.agent.email}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No agent information available</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-2/3" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}
