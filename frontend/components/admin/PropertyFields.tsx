'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/admin/FormSection';

export interface PropertyFormValues {
  title: string;
  description: string;
  price: string;
  type: string;
  featured: boolean;
  location: string;
  province: string;
  address: string;
  lat: string;
  lng: string;
  bedrooms: string;
  bathrooms: string;
  landArea: string;
  buildingArea: string;
  status: string;
  yearBuilt: string;
  features: string;
  videoUrl: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
}

const TYPES = ['house', 'land', 'apartment', 'condo', 'commercial', 'villa', 'beachfront', 'other'];
const STATUSES = [
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'under-offer', label: 'Under Offer' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

interface PropertyFieldsProps {
  values: PropertyFormValues;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onFeaturedChange: (checked: boolean) => void;
  /** Photo management differs between create and edit, so each page supplies its own. */
  photos: React.ReactNode;
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className ? `space-y-2 ${className}` : 'space-y-2'}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export default function PropertyFields({ values, onChange, onSelectChange, onFeaturedChange, photos }: PropertyFieldsProps) {
  return (
    <>
      <FormSection title="Basics" description="What buyers see first on the listing card." className="grid gap-5 md:grid-cols-2">
        <Field label="Title *" className="md:col-span-2">
          <Input name="title" required value={values.title} onChange={onChange} placeholder="3-bedroom home with ocean view" />
        </Field>
        <Field label="Price (SBD) *">
          <Input name="price" type="number" required value={values.price} onChange={onChange} />
        </Field>
        <Field label="Type *">
          <Select value={values.type} onValueChange={(v) => onSelectChange('type', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status *">
          <Select value={values.status} onValueChange={(v) => onSelectChange('status', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-4 py-3">
          <span>
            <span className="block text-sm font-semibold">Featured</span>
            <span className="block text-xs text-muted-foreground">Pin to the homepage</span>
          </span>
          <Switch checked={values.featured} onCheckedChange={onFeaturedChange} />
        </label>
      </FormSection>

      <FormSection title="Description" description="Tell the story. Short paragraphs read best.">
        <Textarea name="description" rows={7} value={values.description} onChange={onChange} />
      </FormSection>

      <FormSection title="Location" description="Coordinates power the map on the listing page." className="grid gap-5 md:grid-cols-2">
        <Field label="Location">
          <Input name="location" value={values.location} onChange={onChange} />
        </Field>
        <Field label="Province">
          <Input name="province" value={values.province} onChange={onChange} />
        </Field>
        <Field label="Full address" className="md:col-span-2">
          <Input name="address" value={values.address} onChange={onChange} />
        </Field>
        <Field label="Latitude">
          <Input name="lat" type="number" step="any" value={values.lat} onChange={onChange} />
        </Field>
        <Field label="Longitude">
          <Input name="lng" type="number" step="any" value={values.lng} onChange={onChange} />
        </Field>
      </FormSection>

      <FormSection title="Specifications" description="Leave blank anything that doesn't apply." className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        <Field label="Bedrooms">
          <Input name="bedrooms" type="number" value={values.bedrooms} onChange={onChange} />
        </Field>
        <Field label="Bathrooms">
          <Input name="bathrooms" type="number" value={values.bathrooms} onChange={onChange} />
        </Field>
        <Field label="Year built">
          <Input name="yearBuilt" type="number" value={values.yearBuilt} onChange={onChange} />
        </Field>
        <Field label="Land area (m²)">
          <Input name="landArea" type="number" value={values.landArea} onChange={onChange} />
        </Field>
        <Field label="Building area (m²)">
          <Input name="buildingArea" type="number" value={values.buildingArea} onChange={onChange} />
        </Field>
      </FormSection>

      <FormSection title="Features & media" className="grid gap-5">
        <Field label="Features (comma separated)">
          <Input name="features" value={values.features} onChange={onChange} placeholder="ocean view, generator, solar, fenced" />
        </Field>
        <Field label="Video URL">
          <Input name="videoUrl" value={values.videoUrl} onChange={onChange} placeholder="https://" />
        </Field>
      </FormSection>

      <FormSection title="Photos" description="The first photo is used as the cover image.">
        {photos}
      </FormSection>

      <FormSection title="Agent" description="Shown on the listing's contact card." className="grid gap-5 md:grid-cols-3">
        <Field label="Name">
          <Input name="agentName" value={values.agentName} onChange={onChange} />
        </Field>
        <Field label="Phone">
          <Input name="agentPhone" value={values.agentPhone} onChange={onChange} />
        </Field>
        <Field label="Email">
          <Input name="agentEmail" type="email" value={values.agentEmail} onChange={onChange} />
        </Field>
      </FormSection>
    </>
  );
}

/** Drop-zone style file input used on both create and edit. */
export function PhotoDropzone({
  files,
  onChange,
  hint,
}: {
  files: File[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hint: string;
}) {
  return (
    <div>
      <label className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors hover:border-primary hover:bg-primary/5">
        <input type="file" multiple accept="image/*" onChange={onChange} className="absolute inset-0 cursor-pointer opacity-0" />
        <span className="font-semibold">Click or drop photos here</span>
        <span className="text-sm text-muted-foreground">{hint}</span>
      </label>
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {files.map((file, i) => (
            <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{file.name}</span>
          ))}
        </div>
      )}
    </div>
  );
}
