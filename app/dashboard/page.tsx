import type { Metadata } from "next"
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { SignOutButton } from "@/components/auth/signout-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/signin?next=/dashboard")
  }

  const claims = data.claims
  const fullName =
    typeof claims.user_metadata?.full_name === "string"
      ? claims.user_metadata.full_name
      : null
  const email = claims.email ?? "Signed-in account"

  return (
    <main className="min-h-svh bg-muted/30 px-4 py-8 sm:py-12">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <p className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Authenticated workspace
            </p>
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {fullName ? `Welcome, ${fullName}.` : "Publisher dashboard"}
              </h1>
              <p className="text-muted-foreground">{email}</p>
            </div>
          </div>
          <SignOutButton />
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <KeyRound className="size-5" aria-hidden="true" />
              </div>
              <CardTitle>Validate publisher token</CardTitle>
              <CardDescription>
                Check whether an Adsterra publisher API token is active. The token is
                sent directly to Adsterra and discarded after the request.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild size="lg">
                <Link href="/token">
                  Validate token
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>Your Supabase session is active.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Account
                </span>
                <span className="truncate font-medium">{email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Status
                </span>
                <span className="font-medium">Verified session</span>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}
