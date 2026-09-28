'use client'; 

import dynamic from 'next/dynamic';

// We move the dynamic import HERE
const PropertyMap = dynamic(() => import('./PropertyMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted animate-pulse rounded-2xl flex items-center justify-center text-muted-foreground">
      Loading Map...
    </div>
  ) 
});

interface MapWrapperProps {
  coordinates: { lat: number; lng: number };
  title: string;
}

export default function MapWrapper({ coordinates, title }: MapWrapperProps) {
  return (
    <div className="h-full w-full">
      <PropertyMap coordinates={coordinates} title={title} />
    </div>
  );
}