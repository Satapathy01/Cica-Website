"use client";

import { GallerySlideshow } from "@/components/gallery-slideshow";
import { GalleryDisplayMode, GalleryImage } from "@/lib/types";

interface GalleryModeRendererProps {
  mode: GalleryDisplayMode;
  images: GalleryImage[];
}

export function GalleryModeRenderer({
  images,
}: GalleryModeRendererProps) {
  return <GallerySlideshow initialImages={images} />;
}