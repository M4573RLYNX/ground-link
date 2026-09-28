import type { Metadata } from 'next';
import ListingsView from '@/components/site/ListingsView';

export const metadata: Metadata = { title: 'Houses & Apartments for Rent | Ground Link' };

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ListingsView deal="rent" searchParams={await searchParams} />;
}
