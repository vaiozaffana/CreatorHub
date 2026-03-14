import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

// Handles PKCE code exchange from emailRedirectTo callback
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = request.nextUrl.clone();

  if (!code) {
    redirectTo.pathname = "/auth/login";
    redirectTo.searchParams.set("error", "Link verifikasi tidak valid.");
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    redirectTo.pathname = "/auth/login";
    redirectTo.searchParams.set(
      "error",
      "Verifikasi gagal. Silakan coba daftar ulang."
    );
    return NextResponse.redirect(redirectTo);
  }

  // Sync user to database
  try {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: {
        email: data.user.email!,
        name:
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Creator",
      },
      create: {
        id: data.user.id,
        email: data.user.email!,
        name:
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          "Creator",
      },
    });
  } catch (dbError) {
    console.error("Error syncing user to database:", dbError);
  }

  redirectTo.pathname = "/dashboard";
  redirectTo.searchParams.delete("code");
  return NextResponse.redirect(redirectTo);
}
