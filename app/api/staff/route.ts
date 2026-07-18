import { NextResponse } from "next/server";
import { listTeacherStaffMembers } from "@/lib/course-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const staff = await listTeacherStaffMembers();
    return NextResponse.json({ staff });
  } catch {
    return NextResponse.json({ staff: [] });
  }
}
