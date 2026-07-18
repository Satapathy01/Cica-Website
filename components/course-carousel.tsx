"use client";

import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Course, CourseCard } from "@/components/course-card";

interface CourseCarouselProps {
  courses: Course[];
  onSelect: (course: Course) => void;
}

export function CourseCarousel({
  courses,
  onSelect,
}: CourseCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
  });

  const autoplay = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      autoplay();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi, autoplay]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {courses.map((course) => (
          <div
            key={course.id}
            className="min-w-0 flex-[0_0_100%] px-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
          >
            <CourseCard
              course={course}
              onClick={onSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}