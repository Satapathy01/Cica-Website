import { NextRequest, NextResponse } from "next/server";
import { fallbackHeroSlides } from "@/lib/constants";
import { isAdminAuthorized } from "@/lib/admin-auth";
import {
  getHeroContent,
  updateHeroContent
} from "@/lib/hero-content-service";
import { getDynamicHero } from "@/lib/media-provider";
import { heroContentSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [slides, heroContent] = await Promise.all([
      getDynamicHero(fallbackHeroSlides),
      getHeroContent()
    ]);

    return NextResponse.json({
      slides,
      heroContent
    });
  } catch {
    const slides = await getDynamicHero(fallbackHeroSlides);

    return NextResponse.json({
      slides,
      heroContent: await getHeroContent()
    });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json(
      { message: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const payload = await request.json();

    const parsed =
      heroContentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message:
            parsed.error.issues[0]?.message ??
            "Invalid hero content payload."
        },
        { status: 400 }
      );
    }

    const content =
      await updateHeroContent(parsed.data);

    return NextResponse.json({
      message: "Hero content updated.",
      heroContent: content
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update hero content."
      },
      { status: 500 }
    );
  }
}