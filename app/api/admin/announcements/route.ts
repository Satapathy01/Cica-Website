import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      announcements: data ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load announcements.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("announcements")
      .insert({
        message: body.message,
        display_order: body.display_order ?? 1,
        is_active: body.is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Announcement created successfully.",
      announcement: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create announcement.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("announcements")
      .update({
        message: body.message,
        display_order: body.display_order,
        is_active: body.is_active,
      })
      .eq("id", body.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Announcement updated successfully.",
      announcement: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update announcement.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Announcement deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete announcement.",
      },
      {
        status: 500,
      }
    );
  }
}