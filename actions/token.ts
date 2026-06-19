"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveToken(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "يجب تسجيل الدخول أولاً" };
  }

  const token = formData.get("token") as string;

  const { error } = await supabase.from("tokens").insert({
    user_id: user.id,
    token: token,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/token");
  return { success: true };
}

export async function getTokens() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("tokens")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}
