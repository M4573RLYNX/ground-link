'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchProperty, updateProperty, Property, getImageUrl } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Trash2 } from 'lucide-react';
import PageHeader from '@/components/admin/PageHeader';
import PropertyFields, { PhotoDropzone } from '@/components/admin/PropertyFields';

export default function EditPropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // Existing images from property
  const [deletedImages, setDeletedImages] = useState<string[]>([]); // Deleted images from property

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'house',
    featured: false,
    location: '',
    province: '',
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

  // Load existing property
  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data: Property = await fetchProperty(id);
        setFormData({
          title: data.title,
          description: data.description || '',
          price: data.price.toString(),
          type: data.type,
          featured: data.featured,
          location: data.location || '',
          province: data.province || '',
          address: data.address || '',
          lat: data.coordinates?.lat?.toString() || '',
          lng: data.coordinates?.lng?.toString() || '',
          bedrooms: data.bedrooms?.toString() || '',
          bathrooms: data.bathrooms?.toString() || '',
          landArea: data.landArea?.toString() || '',
          buildingArea: data.buildingArea?.toString() || '',
          status: data.status,
          yearBuilt: data.yearBuilt?.toString() || '',
          features: data.features?.join(', ') || '',
          videoUrl: data.videoUrl || '',
          agentName: data.agent?.name || '',
          agentPhone: data.agent?.phone || '',
          agentEmail: data.agent?.email || '',
        });

        // Set existing images for gallery
        setExistingImages(data.images || []);
      } catch (err) {
        toast.error('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

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

  const handleDeleteImage = (imagePath: string) => {
    // Remove from existing images
    setExistingImages(existingImages.filter(img => img !== imagePath));
    // Add to deleted list
    setDeletedImages([...deletedImages, imagePath]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    imageFiles.forEach(file => {
      data.append('images', file);
    });

    // Append deleted images array
    if (deletedImages.length > 0) {
      data.append('deletedImages', deletedImages.join(','));
    }

    try {
      await updateProperty(id, data);
      toast.success('Property updated successfully!');
      router.push('/admin/properties/all');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update property');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" /> Loading property…
      </div>
    );
  }

  const photos = (
    <div className="space-y-5">
      {existingImages.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existingImages.map((img, i) => (
            <div key={img} className="group relative aspect-square overflow-hidden rounded-xl bg-muted">
              <Image src={getImageUrl(img)} alt={`Property image ${i + 1}`} fill className="object-cover" />
              {i === 0 && (
                <span className="absolute bottom-2 left-2 rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold text-ink-foreground">Cover</span>
              )}
              <Button
                type="button"
                variant="destructive"
                size="icon-xs"
                className="absolute top-2 right-2 opacity-90 shadow-sm md:opacity-0 md:group-hover:opacity-100"
                onClick={() => handleDeleteImage(img)}
                title="Remove image"
              >
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
      )}
      <PhotoDropzone files={imageFiles} onChange={handleImageChange} hint="Up to 10 new images, added after the existing ones" />
    </div>
  );

  return (
    <div>
      <PageHeader title="Edit property" description={formData.title} />

      <form onSubmit={handleSubmit}>
        <PropertyFields
          values={formData}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onFeaturedChange={handleSwitch}
          photos={photos}
        />

        <div className="sticky bottom-0 -mx-4 mt-4 flex items-center justify-end gap-2 border-t bg-background/90 px-4 py-4 backdrop-blur-xl lg:-mx-8 lg:px-8">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? <><Loader2 className="animate-spin" /> Saving…</> : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
