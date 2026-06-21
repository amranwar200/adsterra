import type { Metadata } from "next"

import { SignInForm } from "@/components/auth/signin-form"

export const metadata: Metadata = {
  title: "Sign In",
}

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams

  return <SignInForm nextPath={next} />
}
