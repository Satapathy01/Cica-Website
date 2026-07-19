import { fallbackHeroSlides } from "@/lib/constants";
import { GalleryImage, HeroSlide } from "@/lib/types";

export async function getDynamicImages(
  fallback: GalleryImage[]
): Promise<GalleryImage[]> {
  return fallback;
}

export async function getDynamicHero(
  fallback: HeroSlide[]
): Promise<HeroSlide[]> {
  return fallback;
}

export function getFallbackHero() {
  return fallbackHeroSlides;
}