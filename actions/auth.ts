"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import { getSafeRedirect } from "@/lib/auth/redirect";
import {
  signInSchema,
  signUpSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from "@/lib/validations/auth";

type SignUpField = keyof SignUpFormValues;
type SignInField = keyof SignInFormValues;

export async function signUp(
  formData: FormData
): Promise<ActionResult<SignUpField>> {
  const supabase = await createClient();

  const result = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message || "Unable to create your account.",
    };
  }

  if (!data.session) {
    return {
      success: true,
      message: "Check your email to confirm your account, then sign in.",
      redirectTo: "/signin",
    };
  }

  return {
    success: true,
    message: "Your account has been created.",
    redirectTo: "/dashboard",
  };
}

export async function signIn(
  formData: FormData
): Promise<ActionResult<SignInField>> {
  const supabase = await createClient();

  const result = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return {
      success: false,
      message: "The email or password is incorrect.",
    };
  }

  return {
    success: true,
    message: "You are signed in.",
    redirectTo: getSafeRedirect(formData.get("next")),
  };
}

export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: "Unable to sign out. Please try again.",
    };
  }

  return {
    success: true,
    message: "You are signed out.",
    redirectTo: "/signin",
  };
}
