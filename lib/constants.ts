import { DownloadItem, StaffMember } from "@/lib/types";
import type { HeroSlide } from "@/lib/types";

export const navigationLinks = [
  {
    href: "#home",
    label: "Home",
  },
  {
    href: "#notices",
    label: "Notices",
  },
  {
    href: "#courses",
    label: "Courses",
  },
  {
    href: "#contact",
    label: "Contact",
  },
];

export const fallbackHeroSlides: HeroSlide[] = [
  {
    id: "1",
    title: "Welcome to CICA Institute",
    imageUrl: "/hero/hero1.jpg",
    altText: "Welcome to CICA Institute",
    displayOrder: 1,
    isActive: true
  }
];

export const staffMembers: StaffMember[] = [
  {
    id: "staff-1",
    name: "Anita Verma",
    subject: "Mathematics",
    bio: "Guides students with concept-first problem solving and Olympiad readiness.",
    photo:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "staff-2",
    name: "Rahul Sharma",
    subject: "Science",
    bio: "Leads practical, lab-based learning focused on curiosity and experimentation.",
    photo:
      "https://images.unsplash.com/photo-1615109398623-88346a601842?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "staff-3",
    name: "Meera Nair",
    subject: "English",
    bio: "Builds communication confidence through literature circles and debates.",
    photo:
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "staff-4",
    name: "Arjun Menon",
    subject: "Computer Science",
    bio: "Mentors coding clubs and project-based learning for future-ready skills.",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=900&q=80",
  },
];

export const downloadItems: DownloadItem[] = [
  {
    id: "download-1",
    title: "Admission Brochure 2026",
    description: "Admission brochure for the 2026 academic session.",
    category: "Admissions",
    fileUrl: "/downloads/admission-brochure.pdf",
    downloads: 0,
    displayOrder: 1,
    isActive: true,
    createdAt: "2026-02-10",
  },
  {
    id: "download-2",
    title: "Fee Structure 2026-27",
    description: "Fee structure for the 2026–27 academic year.",
    category: "Fees",
    fileUrl: "/downloads/fee-structure.pdf",
    downloads: 0,
    displayOrder: 2,
    isActive: true,
    createdAt: "2026-03-01",
  },
  {
    id: "download-3",
    title: "Transport Routes",
    description: "Bus routes and transport information.",
    category: "Transport",
    fileUrl: "/downloads/transport-routes.pdf",
    downloads: 0,
    displayOrder: 3,
    isActive: true,
    createdAt: "2026-03-15",
  },
];