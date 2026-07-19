import { HeroContent } from "@/lib/types";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

interface HeroContentRow {
  id: number;
  title: string;
  subtitle: string;
  primary_button_text: string;
  primary_button_link: string;
  secondary_button_text: string;
  secondary_button_link: string;
  autoplay: boolean;
  autoplay_speed: number;
  overlay_opacity: number;
}

const PRIMARY_HERO_CONTENT_ID = 1;

const HERO_COLUMNS = `
id,
title,
subtitle,
primary_button_text,
primary_button_link,
secondary_button_text,
secondary_button_link,
autoplay,
autoplay_speed,
overlay_opacity
`;

function toHeroContent(
  row: HeroContentRow
): HeroContent {
  return {
    id: row.id,

    title: row.title,

    subtitle: row.subtitle,

    primaryButtonText:
      row.primary_button_text,

    primaryButtonLink:
      row.primary_button_link,

    secondaryButtonText:
      row.secondary_button_text,

    secondaryButtonLink:
      row.secondary_button_link,

    autoplay: row.autoplay,

    autoplaySpeed:
      row.autoplay_speed,

    overlayOpacity:
      Number(row.overlay_opacity)
  };
}

function formatError(
  scope: string,
  message?: string
) {
  return new Error(
    message
      ? `${scope}: ${message}`
      : scope
  );
}

export async function getHeroContent(): Promise<HeroContent> {
  const supabase =
    getSupabaseAdminClient();

  const { data, error } =
    await supabase
      .from("hero_settings")
      .select(HERO_COLUMNS)
      .eq("id", PRIMARY_HERO_CONTENT_ID)
      .maybeSingle();

  if (error) {
    throw formatError(
      "Failed to fetch hero content",
      error.message
    );
  }

  if (!data) {
    return {
      id: 1,

      title: "Welcome to CICA Institute",

      subtitle:
        "Empowering Future Professionals",

      primaryButtonText:
        "Apply Now",

      primaryButtonLink:
        "/apply",

      secondaryButtonText:
        "Explore Courses",

      secondaryButtonLink:
        "/courses",

      autoplay: true,

      autoplaySpeed: 5000,

      overlayOpacity: 0.4
    };
  }

  return toHeroContent(
    data as HeroContentRow
  );
}

export async function updateHeroContent(
  content: Omit<HeroContent, "id">
): Promise<HeroContent> {
  const supabase =
    getSupabaseAdminClient();

  const { data, error } =
    await supabase
      .from("hero_settings")
      .upsert(
        {
          id: PRIMARY_HERO_CONTENT_ID,

          title: content.title.trim(),

          subtitle:
            content.subtitle.trim(),

          primary_button_text:
            content.primaryButtonText.trim(),

          primary_button_link:
            content.primaryButtonLink.trim(),

          secondary_button_text:
            content.secondaryButtonText.trim(),

          secondary_button_link:
            content.secondaryButtonLink.trim(),

          autoplay:
            content.autoplay,

          autoplay_speed:
            content.autoplaySpeed,

          overlay_opacity:
            content.overlayOpacity
        },
        {
          onConflict: "id"
        }
      )
      .select(HERO_COLUMNS)
      .single();

  if (error) {
    throw formatError(
      "Failed to update hero content",
      error.message
    );
  }

  return toHeroContent(
    data as HeroContentRow
  );
}