"use client";

import { useEffect, useState } from "react";

interface StatisticsData {
  courses: number;
  enrolled: number;
  passouts: number;
}

export function AdminStatistics() {
  const [courses, setCourses] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  const [passouts, setPassouts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const response = await fetch("/api/admin/statistics");

        if (!response.ok) {
          throw new Error("Failed to load statistics.");
        }

        const data: StatisticsData = await response.json();

        setCourses(data.courses);
        setEnrolled(data.enrolled);
        setPassouts(data.passouts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/admin/statistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courses,
          enrolled,
          passouts,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save statistics.");
      }

      alert("Statistics updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Unable to save statistics.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow">
        <p className="text-slate-500">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          Website Statistics
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block font-medium">
            Courses
          </label>

          <input
            type="number"
            value={courses}
            onChange={(e) =>
              setCourses(Number(e.target.value))
            }
            className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Currently Enrolled
          </label>

          <input
            type="number"
            value={enrolled}
            onChange={(e) =>
              setEnrolled(Number(e.target.value))
            }
            className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Passouts
          </label>

          <input
            type="number"
            value={passouts}
            onChange={(e) =>
              setPassouts(Number(e.target.value))
            }
            className="w-full rounded-lg border border-slate-300 p-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}