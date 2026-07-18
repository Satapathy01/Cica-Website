"use client";

import Image from "next/image";
import { Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface Course {
  id: string;
  title: string;
  duration: string;
  eligibility: string;
  description: string;
  imageUrl: string;
  contents: {
    id: string;
    title: string;
  }[];
  isActive: boolean;
}

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

export function CourseCard({
  course,
  onClick,
}: CourseCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      onClick={() => onClick(course)}
      className="group cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-all hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={course.imageUrl || "/images/New Building"}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">

        <h3 className="text-2xl font-bold text-slate-900">
          {course.title}
        </h3>

        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-5 w-5 text-blue-600" />

          <span className="font-medium">
            {course.duration}
          </span>
        </div>

        <button
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl bg-blue-600 px-5 py-3
            font-semibold text-white
            transition-all
            hover:bg-blue-700
          "
        >
          View Course

          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

      </div>
    </motion.div>
  );
}