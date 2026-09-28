import ListingsView from '@/components/site/ListingsView';

export default async function PropertiesListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return <ListingsView searchParams={await searchParams} />;
}
