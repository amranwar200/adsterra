import type { Metadata } from "next"

import { TokenForm } from "@/components/auth/token-form"

export const metadata: Metadata = {
  title: "Verify Token",
}

export default function TokenPage() {
  return <TokenForm />
}
