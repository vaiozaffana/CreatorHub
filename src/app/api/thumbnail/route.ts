import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref") || searchParams.get("url");

  if (!ref) {
    return NextResponse.json(
      { error: "ref parameter is required" },
      { status: 400 }
    );
  }

  try {
    const signedUrl = await getSignedUrl(ref, 60 * 60); // 1 hour

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Failed to generate URL" },
        { status: 500 }
      );
    }

    return NextResponse.redirect(signedUrl);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
