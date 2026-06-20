import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const adsterraSchema = z.object({
  token: z.string().min(1, "Token is required"),
  action: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = adsterraSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid data", details: result.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const apiKey = process.env.ADSTERRA_API_KEY;
    if (!apiKey) {
      console.error("Adsterra API Key is missing");
      return NextResponse.json(
        { error: "Server configuration incomplete" },
        { status: 500 },
      );
    }

    const adsterraResponse = await fetch(
      "https://api.adsterra.com/v2/validate-token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          token: result.data.token,
          user_id: user.id,
          action: result.data.action || "validate",
        }),
      },
    );

    if (!adsterraResponse.ok) {
      const errorText = await adsterraResponse.text();
      console.error("Adsterra API error:", adsterraResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to connect to Adsterra service" },
        { status: adsterraResponse.status },
      );
    }

    const data = await adsterraResponse.json();

    try {
      await supabase.from("api_logs").insert({
        user_id: user.id,
        endpoint: "/api/adsterra",
        request: result.data,
        response: data,
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Failed to log API call:", logError);
    }

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Adsterra API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
