import ScreenRecorder from "@/components/ScreenRecorder";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold mb-4">
        Screen Recorder MVP
      </h1>
      <ScreenRecorder />
    </main>
  );
}
