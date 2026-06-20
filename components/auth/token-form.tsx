"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { tokenSchema, type TokenFormValues } from "@/lib/validations/auth"

export function TokenForm() {
  const [feedback, setFeedback] = useState<string | null>(null)
  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    mode: "onTouched",
    defaultValues: {
      token: "",
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = form
  const hasErrors = isSubmitted && Object.keys(errors).length > 0

  async function onSubmit() {
    setFeedback(null)
    await new Promise((resolve) => window.setTimeout(resolve, 500))
    setFeedback("Token format looks valid.")
  }

  return (
    <AuthCard
      title="Verify token"
      description="Enter the code you received."
      footerText="Back to"
      footerHref="/signin"
      footerLabel="sign in"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.token) || undefined}>
            <FieldLabel htmlFor="token">Token</FieldLabel>
            <Input
              id="token"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              aria-invalid={Boolean(errors.token)}
              aria-describedby={errors.token ? "token-error" : undefined}
              {...register("token")}
            />
            <FieldError id="token-error" role="alert">
              {errors.token?.message}
            </FieldError>
          </Field>
        </FieldGroup>

        {hasErrors ? (
          <p className="text-sm text-destructive" role="alert">
            Please enter a valid token.
          </p>
        ) : null}

        {feedback ? (
          <p className="text-sm text-muted-foreground" role="status">
            {feedback}
          </p>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
              Verifying
            </>
          ) : (
            "Verify token"
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
