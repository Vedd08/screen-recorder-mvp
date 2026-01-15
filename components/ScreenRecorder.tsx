"use client";

import { useRef, useState } from "react";

export default function ScreenRecorder() {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const videoUrlRef = useRef<string | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoId, setVideoId] = useState<string | null>(null);

    async function startRecording() {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true,
            });

            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            micStream.getAudioTracks().forEach((track) =>
                screenStream.addTrack(track)
            );

            const mediaRecorder = new MediaRecorder(screenStream, {
                mimeType: "video/webm",
            });

            recordedChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(recordedChunksRef.current, {
                    type: "video/webm",
                });

                const file = new File([blob], "recording.webm", {
                    type: "video/webm",
                });

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Upload failed:", text);
                    return;
                }


                const data = await res.json();
                setVideoId(data.videoId);

                // Cleanup old blob URL if exists
                if (videoUrlRef.current) {
                    URL.revokeObjectURL(videoUrlRef.current);
                }

                const url = URL.createObjectURL(blob);
                videoUrlRef.current = url;
                setVideoUrl(url);

                screenStream.getTracks().forEach((track) => track.stop());
                micStream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
        } catch (error) {
            console.error("Recording failed:", error);
        }
    }

    function stopRecording() {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Stop Recording
                    </button>
                )}
            </div>

            {videoUrl && (
                <video
                    src={videoUrl}
                    controls
                    className="w-full max-w-2xl border rounded"
                />
            )}

            {videoId && (
  <div className="text-sm">
    <p className="font-medium">Share link:</p>
    <a
      href={`/video/${videoId}`}
      target="_blank"
      className="text-blue-600 underline"
    >
      {`${window.location.origin}/video/${videoId}`}
    </a>
  </div>
)}


            {videoId && (
                <button
                    onClick={async () => {
                        await fetch("/api/trim", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                videoId,
                                start: 0,
                                end: 5,
                            }),
                        });
                        alert("Trimmed first 5 seconds");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Trim First 5 Seconds
                </button>

                
            )}

        </div>
    );
}
