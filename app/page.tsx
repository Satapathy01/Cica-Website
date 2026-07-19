import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { AnnouncementBar } from "@/components/admin/announcement-bar";
import { HeroSection } from "@/components/hero-section";
import { NoticeBoard } from "@/components/notice-board";
import { CounterSection } from "@/components/counter-section";
import { CourseSection } from "@/components/course-section";

import { listNotices } from "@/lib/events-notices-service";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const notices = (await listNotices()).slice(0, 4);

  return (
    <>
      {/* Top Announcement */}
      <AnnouncementBar />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Notice Board */}
      <NoticeBoard initialNotices={notices} />

      {/* Counter */}
      <CounterSection />

      {/* Courses */}
      <CourseSection />

      <main id="main-content">
        {/* Future Homepage Sections */}

        {/* Running Course Cards */}

        {/* Course Details */}

        {/* Google Map */}

        {/* Gallery */}

        {/* Testimonials */}

        {/* Contact */}
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </>
  );
}