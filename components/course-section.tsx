"use client";

import { useEffect, useState } from "react";
import { Course } from "./course-card";
import { CourseCarousel } from "./course-carousel";
import { CourseModal } from "./course-modal";

export function CourseSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch("/api/admin/courses", {
          cache: "no-store",
        });

        if (!response.ok) {
          console.error("Failed to load courses");
          return;
        }

        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadCourses();
  }, []);

  return (
    <>
      <section
        id="courses"
        className="bg-slate-50 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
              Our Courses
            </h2>

            <p className="mt-4 text-lg text-slate-600">
              Professional Computer Education Programs
            </p>

          </div>

          <CourseCarousel
            courses={courses}
            onSelect={setSelectedCourse}
          />

        </div>
      </section>

      <CourseModal
        open={selectedCourse !== null}
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}