"use server"

import type { ActionResult } from "@/lib/action-result"
import { createClient } from "@/lib/supabase/server"
import { tokenSchema, type TokenFormValues } from "@/lib/validations/auth"

type TokenField = keyof TokenFormValues

const ADSTERRA_DOMAINS_ENDPOINT =
  "https://api3.adsterratools.com/publisher/domains.json"

export async function validateAdsterraToken(
  formData: FormData
): Promise<ActionResult<TokenField>> {
  const result = tokenSchema.safeParse({ token: formData.get("token") })

  if (!result.success) {
    return {
      success: false,
      message: "Please enter an Adsterra publisher token.",
      fieldErrors: result.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    return {
      success: false,
      message: "Your session has expired. Please sign in again.",
      redirectTo: "/signin",
    }
  }

  try {
    const response = await fetch(ADSTERRA_DOMAINS_ENDPOINT, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": result.data.token,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    })

    if (response.ok) {
      return {
        success: true,
        message: "The Adsterra publisher token is valid.",
      }
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: "This Adsterra publisher token is invalid or expired.",
      }
    }

    if (response.status === 429) {
      return {
        success: false,
        message: "Adsterra is rate limiting requests. Please try again shortly.",
      }
    }

    return {
      success: false,
      message: "Adsterra could not validate the token right now.",
    }
  } catch {
    return {
      success: false,
      message: "Adsterra is unavailable. Please try again later.",
    }
  }
}
