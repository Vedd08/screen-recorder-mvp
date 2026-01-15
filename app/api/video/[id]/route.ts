export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const prisma = getPrisma();

  const video = await prisma.video.findUnique({
    where: { id: params.id },
  });

  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.video.update({
    where: { id: params.id },
    data: { views: { increment: 1 } },
  });

  return NextResponse.json(video);
}
