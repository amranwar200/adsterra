import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { TokenForm } from "@/components/auth/token-form"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Verify Token",
}

export default async function TokenPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/signin?next=/token")
  }

  return <TokenForm />
}
