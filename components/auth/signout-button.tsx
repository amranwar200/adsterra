"use client"

import { LogOut, LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

import { signOut } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSignOut() {
    startTransition(async () => {
      try {
        const result = await signOut()

        if (!result.success) {
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        router.replace(result.redirectTo ?? "/signin")
        router.refresh()
      } catch {
        toast.error("Unable to sign out. Please try again.")
      }
    })
  }

  return (
    <Button variant="outline" onClick={handleSignOut} disabled={isPending}>
      {isPending ? (
        <LoaderCircle className="animate-spin" data-icon="inline-start" />
      ) : (
        <LogOut data-icon="inline-start" />
      )}
      {isPending ? "Signing out" : "Sign out"}
    </Button>
  )
}
