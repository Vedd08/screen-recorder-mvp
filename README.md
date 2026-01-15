# Screen Recorder MVP

A minimal yet complete screen-recording MVP built with Next.js.  
This project demonstrates browser media handling, backend APIs, server-side video processing, persistence, and product-level decision making.

The goal was to build a **real vertical slice**, not a demo.

---

## Features

### Screen Recording
- Record browser screen + microphone using the MediaRecorder API
- Start / stop controls
- Output saved as `.webm`

### Upload & Storage
- Upload recorded video to backend
- Videos stored on local filesystem (mocked object storage)
- Metadata persisted using SQLite + Prisma

### Video Trimming
- Trim video by start and end time
- Server-side FFmpeg processing
- Export trimmed `.webm` video

### Sharing
- Unique public share link per video
- Public page with embedded video player

### Analytics
- Track total view count
- Track watch completion percentage
- Analytics data persisted in database

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript
- **Backend:** Next.js Route Handlers (Node runtime)
- **Database:** SQLite + Prisma
- **Video Processing:** Server-side FFmpeg
- **Storage:** Local filesystem (mocked S3)
- **Styling:** Minimal CSS / Tailwind (optional)

---

## Architecture Decisions

### Why server-side FFmpeg?
Server-side FFmpeg avoids large WASM bundles, reduces client CPU usage, and mirrors how production systems handle video processing. It also simplifies trimming logic for an MVP.

### Why local filesystem storage?
Local storage is used as a mocked object store to keep the MVP simple while maintaining a realistic upload and retrieval flow. It can be swapped for S3 or R2 easily.

### Why no authentication?
Authentication was intentionally excluded to keep the focus on the core recording, upload, processing, and sharing workflow.

### Prisma usage
Prisma is lazily instantiated to avoid issues with Next.js App Router and Turbopack, following recommended patterns for production stability.

---

## Project Structure

    app/
    ├─ api/
    │ ├─ upload/route.ts
    │ ├─ trim/route.ts
    │ ├─ analytics/route.ts
    │
    ├─ video/[id]/page.tsx
    │
    components/
    ├─ ScreenRecorder.tsx
    ├─ VideoPlayer.tsx
    │
    lib/
    ├─ prisma.ts
    ├─ ffmpeg.ts
    │
    prisma/
    └─ schema.prisma
    │
    public/
    └─ uploads/
    │
    types/
    └─ fluent-ffmpeg.d.ts


Setup Instructions:
- Install dependencies with `npm install`
- Ensure FFmpeg is installed and available in PATH
- Run database migrations using `npx prisma migrate dev`
- Start the app with `npm run dev`
- Open http://localhost:3000

Architecture Decisions:
- Used Next.js App Router with server-side route handlers for APIs
- MediaRecorder API is used for in-browser screen + microphone recording
- Videos are uploaded to a Node.js backend and stored on the local filesystem (mocked object storage)
- Prisma + SQLite used for persistence and analytics
- Server-side FFmpeg is used for video trimming to avoid heavy WASM bundles and client CPU load
- Public video pages read directly from the database for reliability and simplicity

Production Improvements:
- Replace local filesystem storage with S3 / R2
- Move FFmpeg processing to background jobs or a queue
- Add authentication and access control
- Improve trimming UI with timeline sliders
- Add more detailed watch-time analytics

## What I Would Improve for Production
- Move video storage from the local filesystem to cloud object storage (S3 or R2)
- Run FFmpeg processing in background jobs instead of request/response
- Add authentication and access control for private videos
- Improve trimming UX with a timeline-based editor
- Add more detailed analytics (watch time, drop-off points)
- Add rate limiting and input validation on APIs
- Improve error handling and monitoring
