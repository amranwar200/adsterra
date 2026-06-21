import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react"
import Link from "next/link"

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

export default async function Home() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const isSignedIn = Boolean(data?.claims)

  return (
    <main className="flex min-h-svh flex-1 items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-2xl overflow-hidden">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Publisher / Access
          </div>
          <div className="flex flex-col gap-2">
            <CardTitle className="max-w-lg text-4xl leading-tight tracking-tight sm:text-5xl">
              Validate publisher access without exposing credentials.
            </CardTitle>
            <CardDescription className="max-w-xl text-base leading-7">
              Sign in to securely check an Adsterra publisher API token. Tokens are
              validated server-side and are never stored.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-2xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            <KeyRound className="size-5 shrink-0" aria-hidden="true" />
            The token travels only between this server and Adsterra for validation.
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3 sm:flex-row">
          {isSignedIn ? (
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open dashboard
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/signin">
                  Sign in
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup">Create account</Link>
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </main>
  )
}
