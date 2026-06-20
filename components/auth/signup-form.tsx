"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validations/auth"

export function SignUpForm() {
  const [feedback, setFeedback] = useState<string | null>(null)
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = form
  const hasErrors = isSubmitted && Object.keys(errors).length > 0

  async function onSubmit(values: SignUpFormValues) {
    setFeedback(`${values.fullName.trim()} is ready to sign up.`)
  }

  return (
    <AuthCard
      title="Create an account"
      description="Use your details to get started."
      footerText="Already have an account?"
      footerHref="/signin"
      footerLabel="Sign in"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.fullName) || undefined}>
            <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
            <Input
              id="fullName"
              autoComplete="name"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "signup-full-name-error" : undefined}
              {...register("fullName")}
            />
            <FieldError id="signup-full-name-error" role="alert">
              {errors.fullName?.message}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.email) || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "signup-email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="signup-email-error" role="alert">
              {errors.email?.message}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.password) || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "signup-password-error" : undefined}
              {...register("password")}
            />
            <FieldError id="signup-password-error" role="alert">
              {errors.password?.message}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.confirmPassword) || undefined}>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={
                errors.confirmPassword ? "signup-confirm-password-error" : undefined
              }
              {...register("confirmPassword")}
            />
            <FieldError id="signup-confirm-password-error" role="alert">
              {errors.confirmPassword?.message}
            </FieldError>
          </Field>
        </FieldGroup>

        {hasErrors ? (
          <p className="text-sm text-destructive" role="alert">
            Please fix the highlighted fields.
          </p>
        ) : null}

        {feedback ? (
          <p className="text-sm text-muted-foreground" role="status">
            {feedback}
          </p>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthCard>
  )
}
