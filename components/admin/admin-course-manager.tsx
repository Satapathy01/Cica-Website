"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface CourseContent {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  duration: string;
  eligibility: string;
  description: string;
  imageUrl: string;
  contents: CourseContent[];
  isActive: boolean;
}

interface AdminCourseManagerProps {
  apiRequest: <T>(
    url: string,
    init?: RequestInit
  ) => Promise<T>;

  addToast: (
    type: "success" | "error",
    message: string
  ) => void;

  requestConfirm: (config: {
    title: string;
    message: string;
    confirmLabel: string;
    action: () => Promise<void> | void;
  }) => void;
}

export function AdminCourseManager({
  apiRequest,
  addToast,
  requestConfirm,
}: AdminCourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");

  const [duration, setDuration] = useState("");
  const [customDuration, setCustomDuration] = useState("");

  const [eligibility, setEligibility] = useState("");
  const [customEligibility, setCustomEligibility] = useState("");

  const [description, setDescription] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [contents, setContents] = useState<CourseContent[]>([
    {
      id: crypto.randomUUID(),
      title: "",
    },
  ]);

  const durationOptions = [
    "3 Months",
    "3-4 Months",
    "6 Months",
    "9 Months",
    "1 Year",
    "Custom",
  ];

  const eligibilityOptions = [
    "Any",
    "8th Pass",
    "10th Pass",
    "+2 Pass",
    "Graduation or +3 equivalent",
    "Custom",
  ];
  const addContent = () => {
  setContents((prev) => [
    ...prev,
    {
      id: crypto.randomUUID(),
      title: "",
    },
  ]);
};

const updateContent = (
  id: string,
  value: string
) => {
  setContents((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            title: value,
          }
        : item
    )
  );
};

const removeContent = (id: string) => {
  setContents((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

const resetForm = () => {
  setEditingId(null);

  setTitle("");

  setDuration("");
  setCustomDuration("");

  setEligibility("");
  setCustomEligibility("");

  setDescription("");

  setImageFile(null);
  setImagePreview("");

  setContents([
    {
      id: crypto.randomUUID(),
      title: "",
    },
  ]);
};

const loadCourses = async () => {
  try {
    const data = await apiRequest<Course[]>(
      "/api/admin/courses"
    );

    setCourses(data);
  } catch (error) {
    console.error(error);

    addToast(
      "error",
      "Failed to load courses."
    );
  }
};

useEffect(() => {
  loadCourses();
}, []);

const editCourse = (course: Course) => {
  setEditingId(course.id);

  setTitle(course.title);

  if (durationOptions.includes(course.duration)) {
    setDuration(course.duration);
    setCustomDuration("");
  } else {
    setDuration("Custom");
    setCustomDuration(course.duration);
  }

  if (
    eligibilityOptions.includes(
      course.eligibility
    )
  ) {
    setEligibility(course.eligibility);
    setCustomEligibility("");
  } else {
    setEligibility("Custom");
    setCustomEligibility(
      course.eligibility
    );
  }

  setDescription(course.description);

  setImagePreview(course.imageUrl);

  setContents(course.contents);
};

const deleteCourse = async (id: string) => {
  requestConfirm({
    title: "Delete Course",
    message:
      "Are you sure you want to delete this course?",
    confirmLabel: "Delete",

    action: async () => {
      try {
        await apiRequest(
          "/api/admin/courses",
          {
            method: "DELETE",
            body: JSON.stringify({
              id,
            }),
          }
        );

        addToast(
          "success",
          "Course deleted successfully."
        );

        loadCourses();
      } catch (error) {
        console.error(error);

        addToast(
          "error",
          "Failed to delete course."
        );
      }
    },
  });
};

const saveCourse = async () => {
  try {

    let imageUrl = imagePreview;

    if (imageFile) {
      const formData = new FormData();

      formData.append("file", imageFile);

      const response = await fetch(
        "/api/admin/course-image",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed.");
      }

      const result = await response.json();

      imageUrl = result.imageUrl;
    }

    await apiRequest("/api/admin/courses", {
      method: "POST",
      body: JSON.stringify({
        title,

        duration:
          duration === "Custom"
            ? customDuration
            : duration,

        eligibility:
          eligibility === "Custom"
            ? customEligibility
            : eligibility,

        description,

        imageUrl,

        contents,

        isActive: true,
      }),
    });

    addToast("success", "Course added successfully.");

    await loadCourses();

    // reset form...

  } catch (error) {
    console.error(error);

    addToast("error", "Failed to save course.");
  }
};
return (
  <div className="space-y-6">

    <div className="rounded-xl border bg-white p-6 shadow">

      <h2 className="text-2xl font-bold">
        {editingId ? "Update Course" : "Add Course"}
      </h2>

      <div className="mt-6 space-y-5">

        {/* Course Name */}
        <input
          placeholder="Course Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border p-3"
        />

        {/* Duration */}
        <div className="space-y-2">

          <label className="font-medium">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Duration
            </option>

            {durationOptions.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

          {duration === "Custom" && (
            <input
              placeholder="Custom Duration"
              value={customDuration}
              onChange={(e) =>
                setCustomDuration(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          )}

        </div>

        {/* Eligibility */}

        <div className="space-y-2">

          <label className="font-medium">
            Eligibility
          </label>

          <select
            value={eligibility}
            onChange={(e) =>
              setEligibility(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Eligibility
            </option>

            {eligibilityOptions.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

          {eligibility === "Custom" && (
            <input
              placeholder="Custom Eligibility"
              value={customEligibility}
              onChange={(e) =>
                setCustomEligibility(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />
          )}

        </div>

        {/* Description */}

        <div className="space-y-2">

          <label className="font-medium">
            Description
          </label>

          <textarea
            rows={5}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />

        </div>

        {/* Image */}

        <div className="space-y-3">

          <label className="font-medium">
            Course Image
          </label>

          <label
            htmlFor="course-image"
            className="flex h-60 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed"
          >

            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <span>
                Click to Upload Image
              </span>
            )}

          </label>

          <input
            id="course-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              setImageFile(file);

              setImagePreview(
                URL.createObjectURL(file)
              );
            }}
          />

        </div>

        {/* Course Contents */}

        <div className="space-y-3">

          <h3 className="text-lg font-semibold">
            Course Contents
          </h3>

          {contents.map((item) => (
            <div
              key={item.id}
              className="flex gap-3"
            >

              <input
                value={item.title}
                onChange={(e) =>
                  updateContent(
                    item.id,
                    e.target.value
                  )
                }
                className="flex-1 rounded-lg border p-3"
                placeholder="Content"
              />

              <button
                onClick={() =>
                  removeContent(item.id)
                }
                className="rounded-lg bg-red-500 px-4 text-white"
              >
                Remove
              </button>

            </div>
          ))}

          <button
            onClick={addContent}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            <Plus size={18} />
            Add Content
          </button>

        </div>

        <div className="flex gap-3">

          <button
            onClick={saveCourse}
            className="flex-1 rounded-lg bg-green-600 py-3 text-white"
          >
            {editingId
              ? "Update Course"
              : "Save Course"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              className="rounded-lg border px-6"
            >
              Cancel
            </button>
          )}

        </div>

      </div>

    </div>
        {/* Existing Courses */}
    <div className="rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Existing Courses
      </h2>

      {courses.length === 0 ? (
        <p className="text-center text-slate-500">
          No courses added yet.
        </p>
      ) : (
        <div className="space-y-4">

          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col gap-4 rounded-xl border p-4 transition hover:shadow-md md:flex-row md:items-center md:justify-between"
            >

              {/* Left */}
              <div className="flex items-center gap-4">

                <img
                  src={
                    course.imageUrl ||
                    "/images/course-placeholder.jpg"
                  }
                  alt={course.title}
                  className="h-24 w-24 rounded-xl border object-cover"
                />

                <div>

                  <h3 className="text-xl font-semibold">
                    {course.title}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    ⏳ {course.duration}
                  </p>

                  <p className="text-sm text-slate-500">
                    🎓 {course.eligibility}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {course.description}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    {course.contents.length} Topics
                  </p>

                </div>

              </div>

              {/* Right */}
              <div className="flex gap-3">

                <button
                  onClick={() => editCourse(course)}
                  className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(course.id)}
                  className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>

  </div>
);
}