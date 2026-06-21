"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { validateAdsterraToken } from "@/actions/token"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { tokenSchema, type TokenFormValues } from "@/lib/validations/auth"

export function TokenForm() {
  const router = useRouter()
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

  async function onSubmit(values: TokenFormValues) {
    const formData = new FormData()
    formData.set("token", values.token)

    try {
      const result = await validateAdsterraToken(formData)

      if (!result.success) {
        const message = result.fieldErrors?.token?.[0]

        if (message) {
          form.setError("token", { type: "server", message })
        }

        toast.error(result.message)

        if (result.redirectTo) {
          router.replace(result.redirectTo)
          router.refresh()
        }

        return
      }

      form.reset()
      toast.success(result.message)
    } catch {
      toast.error("Unable to validate the token. Please try again.")
    }
  }

  return (
    <AuthCard
      title="Verify token"
      description="Check an Adsterra publisher API token without storing it."
      footerText="Back to"
      footerHref="/dashboard"
      footerLabel="dashboard"
    >
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(errors.token) || undefined}>
            <FieldLabel htmlFor="token">Token</FieldLabel>
            <Input
              id="token"
              type="password"
              autoComplete="off"
              spellCheck={false}
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
