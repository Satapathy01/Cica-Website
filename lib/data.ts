import {
  ContactMessage,
  ContactSettings,
  DocumentItem,
  GalleryDisplayConfig,
  GalleryImage,
  HeroSlide,
  NavConfig
} from "@/lib/types";
import { readJsonFile } from "@/lib/file-store";
import { fallbackHeroSlides, navigationLinks } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

export async function getEvents() {
  try {
    const { listEvents } = await import("@/lib/events-notices-service");
    return await listEvents();
  } catch {
    return [];
  }
}

export async function getNotices() {
  try {
    const { listNotices } = await import("@/lib/events-notices-service");
    return await listNotices();
  } catch {
    return [];
  }
}

export async function getGalleryImages() {
  return readJsonFile<GalleryImage[]>("gallery.json", []);
}

export async function getHeroSlides() {
  return readJsonFile<HeroSlide[]>("hero.json", fallbackHeroSlides);
}

export async function getHeroContent() {
  try {
    const { getHeroContent } = await import(
      "@/lib/hero-content-service"
    );

    return await getHeroContent();
  } catch {
    return {
      id: 1,

      title: "Welcome to CICA Institute",

      subtitle: "Empowering Future Professionals",

      primaryButtonText: "Apply Now",

      primaryButtonLink: "/apply",

      secondaryButtonText: "Explore Courses",

      secondaryButtonLink: "/courses",

      autoplay: true,

      autoplaySpeed: 5000,

      overlayOpacity: 0.4
    };
  }
}

export async function getPublicGalleryImages() {
  try {
    const { listGalleryImages } = await import("@/lib/gallery-service");
    const images = await listGalleryImages();

    if (images.length > 0) {
      return images;
    }
  } catch {
    // Fall through to static/local fallback data.
  }

  try {
    const fallbackImages = await getGalleryImages();
    const { getDynamicImages } = await import("@/lib/media-provider");
    return getDynamicImages(fallbackImages);
  } catch {
    return [];
  }
}

export async function getGalleryDisplayConfig(): Promise<GalleryDisplayConfig> {
  try {
    const { getGalleryDisplayConfig } = await import(
      "@/lib/gallery-display-service"
    );
    return await getGalleryDisplayConfig();
  } catch {
    const fallback: GalleryDisplayConfig = {
      mode: "grid"
    };

    const config = await readJsonFile<GalleryDisplayConfig>(
      "gallery-display.json",
      fallback
    );

    return {
      mode: config.mode === "slideshow" ? "slideshow" : "grid"
    };
  }
}

export async function getDocuments() {
  try {
    const { listDocuments } = await import("@/lib/documents-service");
    return await listDocuments();
  } catch {
    return [] as DocumentItem[];
  }
}

export async function getStaffMembers() {
  try {
    const { listTeacherStaffMembers } = await import("@/lib/course-service");
    return await listTeacherStaffMembers();
  } catch {
    return [];
  }
}

export async function getContactSettings() {
  const fallback: ContactSettings = {
    schoolName: siteConfig.name,
    address: siteConfig.contact.address,
    city: "Puri",
    state: "Odisha",
    postalCode: "752001",

    phone: siteConfig.contact.phone,
    email: siteConfig.contact.email,

    alternatePhone: "",
    website: "",
    facebook: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
    googleMapEmbed: "",
    officeHours: "",

    latitude: undefined,
    longitude: undefined
  };

  return readJsonFile<ContactSettings>(
    "contact-settings.json",
    fallback
  );
}

export async function getContactMessages() {
  return readJsonFile<ContactMessage[]>("messages.json", []);
}

export async function getNavConfig() {
  const defaultConfig = navigationLinks.reduce((acc, link) => {
    const key = link.href.replace("#", "") as keyof NavConfig;
    acc[key] = true;
    return acc;
  }, {} as NavConfig);

  return readJsonFile<NavConfig>(
    "nav-config.json",
    defaultConfig
  );
}