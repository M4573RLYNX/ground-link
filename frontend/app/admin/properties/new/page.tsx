'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import PropertyFields, { PhotoDropzone } from '@/components/admin/PropertyFields';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'house',
    featured: false,
    location: 'Honiara',
    province: 'Guadalcanal',
    address: '',
    lat: '',
    lng: '',
    bedrooms: '',
    bathrooms: '',
    landArea: '',
    buildingArea: '',
    status: 'for-sale',
    yearBuilt: '',
    features: '',
    videoUrl: '',
    agentName: '',
    agentPhone: '',
    agentEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    // Multiple images
    imageFiles.forEach(file => {
      data.append('images', file);
    });

    try {
      await createProperty(data);
      toast.success('Property created successfully!');
      router.push('/admin/properties/all');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add property" description="Create a new listing. It goes live as soon as you save." />

      <form onSubmit={handleSubmit}>
        <PropertyFields
          values={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onFeaturedChange={handleSwitch}
          photos={<PhotoDropzone files={imageFiles} onChange={handleImageChange} hint="Up to 10 images" />}
        />

        <div className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading} size="lg">
            {loading ? <><Loader2 className="animate-spin" /> Creating…</> : 'Create property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
