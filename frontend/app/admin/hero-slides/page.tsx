"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchHeroSlides, createHeroSlide, deleteHeroSlide, updateHeroSlide } from "@/lib/api";
import { HeroSlideData } from "@/components/HeroSlider";
import { Eye, EyeOff, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import PageHeader from "@/components/admin/PageHeader";

export default function HeroSlidesAdmin() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    try {
      setLoading(true);
      const data = await fetchHeroSlides();
      setSlides(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image file first.");

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("isActive", "true");

      await createHeroSlide(formData);
      
      // Reset form
      setFile(null);
      setTitle("");
      setSubtitle("");
      
      toast.success("Slide uploaded");
      await loadSlides();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload slide.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await deleteHeroSlide(id);
      setSlides(slides.filter((s) => s._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete slide.");
    }
  };

  const handleToggleActive = async (slide: HeroSlideData) => {
    try {
      const formData = new FormData();
      formData.append("isActive", String(!slide.isActive));
      const updated = await updateHeroSlide(slide._id, formData);
      setSlides(slides.map(s => s._id === slide._id ? updated : s));
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle visibility.");
    }
  };

  return (
    <div>
      <PageHeader title="Hero slides" description="The rotating background images on the homepage." />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upload */}
        <div>
          <form onSubmit={handleCreate} className="space-y-5 rounded-2xl border bg-card p-5 lg:sticky lg:top-8">
            <h2 className="text-lg font-bold">Add a slide</h2>

            <label className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed text-center transition-colors hover:border-primary hover:bg-primary/5">
              <input
                type="file"
                accept="image/*"
                required
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file ? (
                <span className="px-4 text-sm font-medium break-all">{file.name}</span>
              ) : (
                <>
                  <ImagePlus className="size-7 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Click or drop an image</span>
                </>
              )}
            </label>

            <div className="space-y-2">
              <Label htmlFor="slide-title">Headline tag</Label>
              <Input id="slide-title" placeholder="e.g. Welcome to Solomon Islands" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slide-subtitle">Main text</Label>
              <Input id="slide-subtitle" placeholder="e.g. Find your perfect place." value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            </div>

            <Button type="submit" disabled={isUploading || !file} size="lg" className="w-full">
              {isUploading ? <><Loader2 className="animate-spin" /> Uploading…</> : "Upload slide"}
            </Button>
          </form>
        </div>

        {/* Existing slides */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex h-64 items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" /> Loading slides…
            </div>
          ) : slides.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-card p-16 text-center">
              <h3 className="text-xl font-bold">No slides yet</h3>
              <p className="mt-1 text-muted-foreground">The homepage is using the default fallback image.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {slides.map((slide) => (
                <div key={slide._id} className="overflow-hidden rounded-2xl border bg-card">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || "Slide image"}
                      className={`size-full object-cover transition-opacity ${slide.isActive ? "" : "opacity-40 grayscale"}`}
                    />
                    <span className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${slide.isActive ? "bg-success text-white" : "bg-ink text-ink-foreground"}`}>
                      {slide.isActive ? "Live" : "Hidden"}
                    </span>
                  </div>

                  <div className="space-y-1 p-4">
                    {slide.title && <p className="eyebrow">{slide.title}</p>}
                    <p className="truncate font-semibold">{slide.subtitle || <span className="text-muted-foreground">No main text</span>}</p>
                  </div>

                  <div className="flex gap-2 border-t p-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleToggleActive(slide)}>
                      {slide.isActive ? <><EyeOff /> Hide</> : <><Eye /> Show</>}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(slide._id)}
                      title="Delete slide"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
