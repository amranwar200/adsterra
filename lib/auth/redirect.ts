import type { SafeRedirect } from "@/lib/action-result"

const allowedProtectedRedirects = new Set<SafeRedirect>(["/dashboard", "/token"])

export function getSafeRedirect(
  value: FormDataEntryValue | string | null | undefined,
  fallback: SafeRedirect = "/dashboard"
): SafeRedirect {
  return typeof value === "string" && allowedProtectedRedirects.has(value as SafeRedirect)
    ? (value as SafeRedirect)
    : fallback
}
