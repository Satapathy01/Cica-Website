"use client";

import { useEffect, useState } from "react";

interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  display_order: number;
}

export function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const response = await fetch("/api/admin/announcements", {
          cache: "no-store",
        });

        const data = await response.json();

        setAnnouncements(data.announcements ?? []);
      } catch (error) {
        console.error("Failed to load announcements", error);
      }
    };

    loadAnnouncements();
  }, []);

  if (announcements.length === 0) {
    return null;
  }

  return (
    <div className="fixed left-0 top-0 z-40 flex h-12 w-full items-center overflow-hidden bg-green-600 text-white">
      {/* Left Label */}
      <div className="flex items-center gap-2 whitespace-nowrap border-r border-white/30 px-4 font-semibold">
        📢 <span>ANNOUNCEMENTS</span>
      </div>

      {/* Marquee */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap gap-8 px-4 text-sm">
          {[...announcements, ...announcements].map((item, index) => (
            <span key={`${item.id}-${index}`}>
              • {item.message}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}