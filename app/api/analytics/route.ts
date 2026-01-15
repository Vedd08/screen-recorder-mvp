export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { videoId, percent } = await req.json();
  const prisma = getPrisma();

  await prisma.watch.create({
    data: { videoId, percent },
  });

  const stats = await prisma.watch.aggregate({
    where: { videoId },
    _avg: { percent: true },
  });

  await prisma.video.update({
    where: { id: videoId },
    data: { avgWatch: stats._avg.percent ?? 0 },
  });

  return NextResponse.json({ ok: true });
}
