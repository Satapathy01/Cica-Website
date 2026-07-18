import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image selected." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDirectory = path.join(
      process.cwd(),
      "public",
      "uploads",
      "courses"
    );

    await fs.mkdir(uploadDirectory, {
      recursive: true,
    });

    const extension = path.extname(file.name);

    const fileName =
      `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const filePath = path.join(
      uploadDirectory,
      fileName
    );

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      imageUrl: `/uploads/courses/${fileName}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Image upload failed.",
      },
      {
        status: 500,
      }
    );
  }
}