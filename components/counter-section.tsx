"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { BookOpen, GraduationCap, Users } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

export function CounterSection() {
  const [stats, setStats] = useState([
    {
      title: "Courses",
      value: 0,
      suffix: "+",
      icon: BookOpen,
      color: "text-blue-600",
      border: "border-blue-500",
    },
    {
      title: "Enrolled",
      value: 0,
      suffix: "+",
      icon: Users,
      color: "text-emerald-600",
      border: "border-emerald-500",
    },
    {
      title: "Passouts",
      value: 0,
      suffix: "+",
      icon: GraduationCap,
      color: "text-violet-600",
      border: "border-violet-500",
    },
  ]);

  useEffect(() => {
    const loadCounter = async () => {
      try {
        const response = await fetch("/api/admin/counter", {
          cache: "no-store",
        });

        if (!response.ok) return;

        const data = await response.json();

        setStats([
          {
            title: "Courses",
            value: data.courses,
            suffix: "+",
            icon: BookOpen,
            color: "text-blue-600",
            border: "border-blue-500",
          },
          {
            title: "Enrolled",
            value: data.enrolled,
            suffix: "+",
            icon: Users,
            color: "text-emerald-600",
            border: "border-emerald-500",
          },
          {
            title: "Passouts",
            value: data.passouts,
            suffix: "+",
            icon: GraduationCap,
            color: "text-violet-600",
            border: "border-violet-500",
          },
        ]);
      } catch (error) {
        console.error("Failed to load counter", error);
      }
    };

    loadCounter();
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section
      ref={ref}
      id="counter"
      className="bg-gradient-to-b from-white to-slate-50 py-16"
    >
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.03,
                }}
                className={`rounded-3xl border-t-4 ${item.border}
                bg-white p-6 shadow-lg transition-all duration-300`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`mb-4 rounded-full bg-slate-100 p-4 ${item.color}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <h2 className="text-2xl font-bold md:text-5xl">
                    {inView && (
                      <CountUp
                        end={item.value}
                        duration={2}
                        suffix={item.suffix}
                      />
                    )}
                  </h2>

                  <p className="mt-2 text-center text-xs font-medium text-slate-600 md:text-lg">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}