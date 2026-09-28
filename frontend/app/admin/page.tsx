'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Eye, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Property, getImageUrl } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import PageHeader from '@/components/admin/PageHeader';
import StatusBadge from '@/components/StatusBadge';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    featured: 0,
    forSale: 0,
    forRent: 0,
  });
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch data');

      const properties: Property[] = await res.json();

      // Calculate stats
      setStats({
        total: properties.length,
        featured: properties.filter(p => p.featured).length,
        forSale: properties.filter(p => p.status === 'for-sale').length,
        forRent: properties.filter(p => p.status === 'for-rent').length,
      });

      // Show latest 5 properties
      setRecentProperties(properties.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total listings', value: stats.total, className: 'bg-ink text-ink-foreground border-ink' },
    { label: 'Featured', value: stats.featured, className: 'bg-primary text-primary-foreground border-primary' },
    { label: 'For sale', value: stats.forSale, className: 'bg-card' },
    { label: 'For rent', value: stats.forRent, className: 'bg-card' },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back. Here's what's live on Ground Link."
        actions={
          <Button onClick={() => router.push('/admin/properties/new')}>
            <Plus /> Add property
          </Button>
        }
      />

      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={cn('rounded-2xl border p-5 md:p-6', card.className)}>
            <p className="text-sm font-medium opacity-70">{card.label}</p>
            {loading ? (
              <Skeleton className="mt-3 h-12 w-16 bg-current/10" />
            ) : (
              <p className="mt-2 font-display text-5xl font-extrabold tracking-tight md:text-6xl">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card">
        <div className="flex items-center justify-between p-5 md:px-6">
          <h2 className="text-xl font-bold">Recent properties</h2>
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/properties/all')}>
            View all <ArrowRight />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3 px-5 pb-5 md:px-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recentProperties.length === 0 ? (
          <p className="border-t py-12 text-center text-muted-foreground">No properties yet</p>
        ) : (
          <Table>
            <TableHeader className="border-t bg-muted/50">
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProperties.map((prop) => (
                <TableRow key={prop._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(prop.image || prop.images?.[0])}
                        alt=""
                        className="size-10 shrink-0 rounded-lg bg-muted object-cover"
                      />
                      <span className="max-w-64 truncate font-semibold">{prop.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{prop.type}</TableCell>
                  <TableCell className="font-medium">{formatPrice(prop.price)}</TableCell>
                  <TableCell>
                    <StatusBadge status={prop.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/properties/${prop._id}`)} title="View on site">
                      <Eye />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/admin/properties/${prop._id}/edit`)} title="Edit">
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
