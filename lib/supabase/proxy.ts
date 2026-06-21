import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function redirectWithCookies(url: URL, sessionResponse: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);

  sessionResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const pathname = request.nextUrl.pathname;

  const isPublicPage = pathname === "/";
  const isAuthPage = pathname === "/signin" || pathname === "/signup";
  const isProtectedPage =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/token" ||
    pathname.startsWith("/token/");

  // Public page: do nothing
  if (isPublicPage) {
    return supabaseResponse;
  }

  // If user has session and tries to open an auth page
  // redirect to dashboard
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return redirectWithCookies(url, supabaseResponse);
  }

  // If user has no session and tries to open a protected page
  // redirect to sign in with a safe destination
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.search = "";
    url.searchParams.set("next", pathname === "/token" ? "/token" : "/dashboard");
    return redirectWithCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}
