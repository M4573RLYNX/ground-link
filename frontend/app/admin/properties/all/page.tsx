'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Property, getImageUrl } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/StatusBadge';

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch properties');

      const data = await res.json();
      setProperties(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Property deleted');
      setProperties(properties.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/properties/${id}/edit`);
  };

  const handleView = (id: string) => {
    router.push(`/properties/${id}`);
  };

  const q = query.trim().toLowerCase();
  const visible = q
    ? properties.filter((p) =>
        [p.title, p.location, p.type, p.province].some((v) => v?.toLowerCase().includes(q))
      )
    : properties;

  return (
    <div>
      <PageHeader
        title="Properties"
        description={loading ? 'Loading…' : `${properties.length} listings in total`}
        actions={
          <Button onClick={() => router.push('/admin/properties/new')}>
            <Plus /> Add property
          </Button>
        }
      />

      {error ? (
        <div className="rounded-2xl border bg-card py-16 text-center">
          <h2 className="text-2xl font-bold">Couldn&apos;t load properties</h2>
          <p className="mt-2 mb-6 text-muted-foreground">{error}</p>
          <Button onClick={fetchProperties}>Try again</Button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card py-20 text-center">
          <p className="font-display text-2xl font-bold">No properties yet</p>
          <Button className="mt-6" onClick={() => router.push('/admin/properties/new')}>
            <Plus /> Add your first property
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border bg-card">
          <div className="p-4">
            <div className="relative max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search title, location, type…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader className="border-t bg-muted/50">
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {visible.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(property.image || property.images?.[0])}
                        alt=""
                        className="size-11 shrink-0 rounded-lg bg-muted object-cover"
                      />
                      <div className="min-w-0">
                        <p className="max-w-72 truncate font-semibold">{property.title}</p>
                        {property.featured && (
                          <Badge variant="soft" className="mt-0.5">Featured</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{property.type}</TableCell>
                  <TableCell className="font-medium">{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <StatusBadge status={property.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{property.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => handleView(property._id)} title="View on public site">
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(property._id)} title="Edit">
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(property._id)}
                      title="Delete"
                    >
                      <Trash2 />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {visible.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                    No properties match &ldquo;{query}&rdquo;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
