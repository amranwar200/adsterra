import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up",
}

export default function SignUpPage() {
  return <SignUpForm />
}
