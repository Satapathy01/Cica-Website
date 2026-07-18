"use client";

import { motion } from "framer-motion";
import { BookOpen, Phone } from "lucide-react";
import { useState } from "react";

const tabs = [
  {
    id: "courses",
    label: "Explore Courses",
    icon: BookOpen,
    href: "#courses",
  },
  {
    id: "contact",
    label: "Contact Us",
    icon: Phone,
    href: "#contact",
  },
];

export function SlidingTabs() {
  const [active, setActive] = useState("courses");

  return (
    <div className="mt-10">
      <div className="inline-flex rounded-full border border-white/20 bg-white/10 p-2 backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <a
              key={tab.id}
              href={tab.href}
              onClick={() => setActive(tab.id)}
              className="relative"
            >
              {isActive && (
                <motion.div
                  layoutId="hero-pill"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 28,
                  }}
                  className="absolute inset-0 rounded-full bg-blue-600"
                />
              )}

              <div className="relative z-10 flex items-center gap-2 px-8 py-4 font-semibold text-white">
                <Icon size={20} />
                {tab.label}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}