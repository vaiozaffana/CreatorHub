import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

// Handles email confirmation links from Supabase email templates.
// Default Supabase template links to: {{ .SiteURL }}/auth/confirm?token_hash=xxx&type=email
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const redirectTo = request.nextUrl.clone();

  if (!token_hash || !type) {
    redirectTo.pathname = "/auth/login";
    redirectTo.searchParams.set("error", "Link verifikasi tidak valid.");
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: type as "signup" | "email",
  });

  if (error || !data.user) {
    redirectTo.pathname = "/auth/login";
    redirectTo.searchParams.set(
      "error",
      "Verifikasi gagal atau link sudah kadaluarsa. Silakan daftar ulang."
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
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  return NextResponse.redirect(redirectTo);
}
