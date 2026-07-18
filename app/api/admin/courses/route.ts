import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "courses.json");

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

async function readCourses(): Promise<Course[]> {
  try {
    const data = await fs.readFile(filePath, "utf8");

    if (!data.trim()) {
      return [];
    }

    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeCourses(courses: Course[]) {
  await fs.writeFile(
    filePath,
    JSON.stringify(courses, null, 2),
    "utf8"
  );
}

/* ===========================
   GET
=========================== */

export async function GET() {
  try {
    const courses = await readCourses();

    return NextResponse.json(courses);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to load courses." },
      { status: 500 }
    );
  }
}

/* ===========================
   POST
=========================== */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const courses = await readCourses();

    const newCourse: Course = {
      id: crypto.randomUUID(),
      ...body,
    };

    courses.push(newCourse);

    await writeCourses(courses);

    return NextResponse.json(newCourse);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to create course." },
      { status: 500 }
    );
  }
}

/* ===========================
   PUT
=========================== */

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const courses = await readCourses();

    const index = courses.findIndex(
      (course) => course.id === body.id
    );

    if (index === -1) {
      return NextResponse.json(
        { message: "Course not found." },
        { status: 404 }
      );
    }

    courses[index] = {
      ...courses[index],
      ...body,
    };

    await writeCourses(courses);

    return NextResponse.json(courses[index]);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update course." },
      { status: 500 }
    );
  }
}

/* ===========================
   DELETE
=========================== */

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const courses = await readCourses();

    const updatedCourses = courses.filter(
      (course) => course.id !== id
    );

    await writeCourses(updatedCourses);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to delete course." },
      { status: 500 }
    );
  }
}