"use client";

import { Share2 } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  className?: string;
}

export default function ShareButton({ title, className }: ShareButtonProps) {
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this property on Ground Link: ${title}`,
      url: window.location.href,
    };

    try {
      // Native share sheet on mobile/Safari, clipboard everywhere else
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <Button variant="outline" onClick={handleShare} className={cn(className)}>
      <Share2 /> Share
    </Button>
  );
}
