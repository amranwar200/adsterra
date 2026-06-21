"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { signIn } from "@/actions/auth"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validations/auth"

type SignInFormProps = {
  nextPath?: string
}

export function SignInForm({ nextPath }: SignInFormProps) {
  const router = useRouter()
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = form
  const hasErrors = isSubmitted && Object.keys(errors).length > 0

  async function onSubmit(values: SignInFormValues) {
    const formData = new FormData()
    formData.set("email", values.email)
    formData.set("password", values.password)

    if (nextPath) {
      formData.set("next", nextPath)
    }

    try {
      const result = await signIn(formData)

      if (!result.success) {
        for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
          const message = messages?.[0]

          if (message) {
            form.setError(field as keyof SignInFormValues, {
              type: "server",
              message,
            })
          }
        }

        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.replace(result.redirectTo ?? "/dashboard")
      router.refresh()
    } catch {
      toast.error("Unable to sign in. Please try again.")
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in with your account email."
      footerText="Need an account?"
      footerHref="/signup"
      footerLabel="Sign up"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.email) || undefined}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "signin-email-error" : undefined}
              {...register("email")}
            />
            <FieldError id="signin-email-error" role="alert">
              {errors.email?.message}
            </FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.password) || undefined}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "signin-password-error" : undefined}
              {...register("password")}
            />
            <FieldError id="signin-password-error" role="alert">
              {errors.password?.message}
            </FieldError>
          </Field>
        </FieldGroup>

        {hasErrors ? (
          <p className="text-sm text-destructive" role="alert">
            Please fix the highlighted fields.
          </p>
        ) : null}

        <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
              Signing in
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </AuthCard>
  )
}
