export const runtime = "nodejs";

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { getPrisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const videoId = uuid();
    const filename = `${videoId}.webm`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(filePath, buffer);

    const prisma = getPrisma();

    await prisma.video.create({
  data: {
    id: videoId,
    filename,
  },
});

console.log("UPLOAD SUCCESS:", filename);


    return NextResponse.json({ videoId });
  } catch (error) {
    console.error("UPLOAD API ERROR:");
    console.error(error);

    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
