import { notFound } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import VideoPlayer from "@/components/VideoPlayer";

export default async function VideoPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  if (!id) notFound();

  const prisma = getPrisma();

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video) notFound();

  // Increment views
  await prisma.video.update({
    where: { id },
    data: { views: { increment: 1 } },
  });

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-xl font-semibold">Shared Video</h1>

      <VideoPlayer
        src={`/uploads/${video.filename}`}
        videoId={id}
      />

      <p className="text-sm text-gray-600">
        Views: {video.views + 1}
      </p>
    </main>
  );
}
