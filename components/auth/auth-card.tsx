import Link from "next/link"
import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type AuthCardProps = {
  title: string
  description: string
  footerText: string
  footerHref: string
  footerLabel: string
  children: ReactNode
}

export function AuthCard({
  title,
  description,
  footerText,
  footerHref,
  footerLabel,
  children,
}: AuthCardProps) {
  return (
    <main className="flex min-h-svh flex-1 items-center justify-center bg-muted/30 px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="justify-center gap-1 text-sm text-muted-foreground">
          <span>{footerText}</span>
          <Link className="font-medium text-primary underline-offset-4 hover:underline" href={footerHref}>
            {footerLabel}
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
