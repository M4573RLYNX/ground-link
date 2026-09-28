import type { Metadata } from 'next';
import ListingsView from '@/components/site/ListingsView';

export const metadata: Metadata = { title: 'Property & Land for Sale | Ground Link' };

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ListingsView deal="buy" searchParams={await searchParams} />;
}
