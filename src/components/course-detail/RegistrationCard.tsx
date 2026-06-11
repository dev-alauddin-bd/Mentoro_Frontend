import React, { useState } from "react";
import { ShoppingCart, Play } from "lucide-react";

interface RegistrationCardProps {
  title?: string;
  subtitle?: string;
  previewVideo?: string;
  thumb?: string;
  price: number;
  isFree: boolean;
  isEnrolled: boolean;
  isLoading: boolean;
  onEnroll: () => void;
}

const RegistrationCard: React.FC<RegistrationCardProps> = ({
  previewVideo,
  title,
  subtitle,
  thumb,
  price,

  isFree,
  isEnrolled,
  isLoading,
  onEnroll,
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  return (
    <div
      className="
        glass
        p-7
        rounded-3xl
        flex
        flex-col
        gap-6
        shadow-[0_20px_50px_rgba(0,0,0,0.15)]
        border
        border-primary/10
        backdrop-blur-xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      {/* ================= VIDEO ================= */}
      {previewVideo && (
        <div className="relative w-full overflow-hidden rounded-2xl">
          {!isVideoPlaying ? (
            <div
              onClick={() => setIsVideoPlaying(true)}
              className="group cursor-pointer relative"
            >
              <img
                src={
                  thumb ??
                  "https://via.placeholder.com/800x450?text=Course+Preview"
                }
                alt="Course Preview"
                className="w-full h-64 object-cover rounded-2xl"
              />

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all rounded-2xl" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
              </div>
            </div>
          ) : (
            (() => {
              const ytMatch = previewVideo.match(
                /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^?&]+)/
              );

              const embedUrl = ytMatch
                ? `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`
                : null;

              return embedUrl ? (
                <iframe
                  src={embedUrl}
                  title="Course Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <video
                  src={previewVideo}
                  controls
                  autoPlay
                  className="w-full h-64 rounded-2xl"
                />
              );
            })()
          )}
        </div>
      )}

      {/* ================= TITLE ================= */}
      {title && (
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            {title}
          </h2>

          {subtitle && (
            <p className="text-sm text-muted-foreground mt-2">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ================= PRICE SECTION ================= */}
      <div className="w-full rounded-2xl border border-primary/10 bg-primary/5 p-6">
        {isFree ? (
          <div className="text-center">
            <h3 className="text-5xl font-black text-emerald-500">
              FREE
            </h3>

            <p className="text-muted-foreground mt-2">
              Lifetime Access Included
            </p>
          </div>
        ) : (
          <div className="text-center">
            <>
                <h3 className="text-5xl font-black text-primary">
                  ${price}
                </h3>

                <p className="text-muted-foreground mt-2">
                  One Time Payment
                </p>
              </>
          </div>
        )}

        {/* ================= COUPON ================= */}

      </div>

      {/* ================= ENROLL BUTTON ================= */}
      <button
        onClick={onEnroll}
        disabled={isLoading || isEnrolled}
        className={`
          w-full
          h-14
          rounded-2xl
          font-semibold
          text-base
          flex
          items-center
          justify-center
          gap-2
          transition-all
          ${
            isEnrolled
              ? "bg-emerald-500 text-white cursor-not-allowed"
              : "bg-primary text-white hover:scale-[1.02] hover:shadow-lg"
          }
        `}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Processing...
          </>
        ) : isEnrolled ? (
          "✓ Already Enrolled"
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Enroll Now
          </>
        )}
      </button>
    </div>
  );
};

export default RegistrationCard;