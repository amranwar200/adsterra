export type SafeRedirect = "/" | "/dashboard" | "/signin" | "/token"

export type ActionResult<FieldName extends string = string> =
  | {
      success: true
      message: string
      redirectTo?: SafeRedirect
    }
  | {
      success: false
      message: string
      fieldErrors?: Partial<Record<FieldName, string[]>>
      redirectTo?: SafeRedirect
    }
