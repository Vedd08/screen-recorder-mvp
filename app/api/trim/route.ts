export const runtime = "nodejs";

import { NextResponse } from "next/server";
import path from "path";
import { trimVideo } from "@/lib/ffmpeg";

export async function POST(req: Request) {
  const { videoId, start, end } = await req.json();

  const input = path.join(
    process.cwd(),
    "public/uploads",
    `${videoId}.webm`
  );

  const output = path.join(
    process.cwd(),
    "public/uploads",
    `${videoId}-trimmed.webm`
  );

  await trimVideo(input, output, start, end - start);

  return NextResponse.json({
    filename: `${videoId}-trimmed.webm`,
  });
}