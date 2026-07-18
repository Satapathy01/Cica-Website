import { NextResponse } from "next/server";

let statistics = {
  courses: 15,
  enrolled: 850,
  passouts: 1200,
};

export async function GET() {
  return NextResponse.json(statistics);
}

export async function POST(request: Request) {
  const body = await request.json();

  statistics = {
    courses: Number(body.courses),
    enrolled: Number(body.enrolled),
    passouts: Number(body.passouts),
  };

  return NextResponse.json({
    success: true,
  });
}