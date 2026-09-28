import Link from "next/link";
import { ArrowUpRight, Bath, Bed, MapPin, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/StatusBadge";
import { Property, getImageUrl } from "@/lib/api";
import { formatListingPrice } from "@/lib/format";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const mainImage = property.image || property.images?.[0];
  const isLand = property.type.toLowerCase() === 'land';

  const specs = [
    !isLand && property.bedrooms !== undefined && { icon: Bed, label: `${property.bedrooms} bd` },
    !isLand && property.bathrooms !== undefined && { icon: Bath, label: `${property.bathrooms} ba` },
    property.landArea !== undefined && property.landArea > 0 && { icon: Square, label: `${property.landArea.toLocaleString()} m²` },
  ].filter(Boolean) as { icon: typeof Bed; label: string }[];

  return (
    <Link
      href={`/properties/${property._id}`}
      className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted">
        <img
          src={getImageUrl(mainImage)}
          alt={property.title}
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <StatusBadge status={property.status} className="shadow-sm" />
            {property.featured && <Badge variant="glass" className="shadow-sm">Featured</Badge>}
          </div>
          <span className="grid size-9 translate-y-1 place-items-center rounded-full bg-white text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>

      <div className="px-1 pt-4">
        <p className="font-display text-2xl font-bold tracking-tight">{formatListingPrice(property)}</p>
        <h3 className="mt-1 line-clamp-1 font-sans text-base font-semibold tracking-normal transition-colors group-hover:text-primary">
          {property.title}
        </h3>
        <p className="mt-1 flex items-center gap-1 truncate text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          {property.location}{property.province ? `, ${property.province}` : ''}
        </p>

        {specs.length > 0 && (
          <div className="mt-3 flex items-center gap-4 border-t pt-3 text-sm font-medium text-foreground/80">
            {specs.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className="size-4 text-muted-foreground" />
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
