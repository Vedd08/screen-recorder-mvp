"use client";

import { useEffect, useRef } from "react";

export default function VideoPlayer({
  src,
  videoId,
}: {
  src: string;
  videoId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = async () => {
      const percent = 100;
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, percent }),
      });
    };

    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [videoId]);

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      className="w-full max-w-3xl border rounded"
    />
  );
}
