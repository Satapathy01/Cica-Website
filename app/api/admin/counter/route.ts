import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "data", "counter.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf8");

    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to read counter data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Saving counter:", body);
    console.log("Writing to:", filePath);

    await fs.writeFile(
      filePath,
      JSON.stringify(body, null, 2),
      "utf8"
    );

    return NextResponse.json({
      success: true,
      message: "Counter updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update counter" },
      { status: 500 }
    );
  }
}