import ffmpeg from "fluent-ffmpeg";

export function trimVideo(
  input: string,
  output: string,
  start: number,
  duration: number
) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(input)
      .setStartTime(start)
      .setDuration(duration)
      .output(output)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });
}


