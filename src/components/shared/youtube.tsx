import { useState } from "react";
import { PlayCircle } from "lucide-react";

function getYouTubeId(url?: string) {
  if (!url) return null;

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1]?.split("?")[0];
  }

  if (url.includes("watch?v=")) {
    return url.split("v=")[1]?.split("&")[0];
  }

  return null;
}

export default function YouTubePreviewCard({ url, thumbnail }: { url?: string; thumbnail?: string }) {
  const [open, setOpen] = useState(false);

  const videoId = getYouTubeId(url);

  if (!videoId) return null;

 
  return (
    <>
      {/* CARD */}
      <div
        onClick={() => setOpen(true)}
        className="relative cursor-pointer rounded-xl overflow-hidden border shadow-sm group"
      >
        <img
          src={thumbnail}
          alt="preview"
          className="w-full h-52 object-cover group-hover:scale-105 transition"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <PlayCircle className="w-14 h-14 text-white" />
        </div>

        <div className="absolute bottom-2 left-2 text-white text-xs font-bold">
          Preview Video
        </div>
      </div>

      {/* MODAL PLAYER */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-3xl aspect-video">

            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-white text-xl"
            >
              ✕
            </button>

            <iframe
              className="w-full h-full rounded-xl"
              src={`https://www.youtube.com/embed/${videoId}`}
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}