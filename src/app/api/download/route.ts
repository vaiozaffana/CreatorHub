import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSignedDownloadUrl } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Order ID is required" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      payment: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "completed") {
    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 403 }
    );
  }

  // Block demo orders from downloading files
  if (order.isDemo) {
    return NextResponse.json(
      { error: "Demo orders do not include file downloads. Please make a real purchase." },
      { status: 403 }
    );
  }

  // Generate a short-lived signed URL (5 minutes)
  try {
    const signedUrl = await getSignedDownloadUrl(order.product.fileUrl);

    if (!signedUrl) {
      console.error(
        `Failed to generate signed URL for product ${order.product.id} with fileUrl: ${order.product.fileUrl}`
      );
      return NextResponse.json(
        { error: "Failed to generate download link" },
        { status: 500 }
      );
    }

    // Fetch the file from storage
    const fileResponse = await fetch(signedUrl);
    
    if (!fileResponse.ok) {
      console.error(
        `Failed to fetch file from storage: ${fileResponse.statusText}`
      );
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 500 }
      );
    }

    // Get the file buffer
    const fileBuffer = await fileResponse.arrayBuffer();
    
    // Determine the filename
    const fileName = order.product.fileName || "download";

    // Return the file with proper headers to force download
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating download link:", error);
    return NextResponse.json(
      { error: "Failed to generate download link" },
      { status: 500 }
    );
  }
}
