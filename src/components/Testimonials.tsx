"use client";

import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";
import { Section } from "./ui/section";

export function Testimonials() {
  const { t } = useTranslation();
  const { data: reviewData, isLoading } = useGetReviewsQuery({ limit: 4 });

  const staticReviews = [
    {
      id: "s1",
      content: "This platform transformed my career. The courses are top-notch and the community is amazing!",
      rating: 5,
      user: { name: "Sarah Johnson", role: "Software Engineer", avatar: "https://i.pravatar.cc/150?img=32" }
    },
    {
      id: "s2",
      content: "The live sessions are incredible. Getting real-time feedback from experts is a game-changer.",
      rating: 5,
      user: { name: "Michael Chen", role: "Full Stack Developer", avatar: "https://i.pravatar.cc/150?img=12" }
    },
    {
      id: "s3",
      content: "I've tried many platforms, but Mentoro is by far the most professional and well-structured.",
      rating: 5,
      user: { name: "Elena Rodriguez", role: "Product Designer", avatar: "https://i.pravatar.cc/150?img=45" }
    },
    {
      id: "s4",
      content: "The instructors are truly world-class. They don't just teach code, they teach best practices.",
      rating: 5,
      user: { name: "David Kim", role: "Backend Architect", avatar: "https://i.pravatar.cc/150?img=11" }
    }
  ];

  // Logic: The backend returns { reviews, total, ... } inside the data wrapper.
  const apiReviews = reviewData?.data?.reviews || [];
  const finalReviews = apiReviews.length > 0 ? apiReviews : staticReviews;

  return (
    <Section>
      {/* Header Section */}
      <div className="space-y-4 text-center mx-auto max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-xs font-black uppercase text-primary tracking-widest">
          <Star className="w-3 h-3 fill-primary" />
          {t("extra.voices_success") || "Wall of Love"}
        </div>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
          {t("extra.testimonial_title_start")} <span className="text-primary italic font-serif">{t("extra.testimonial_title_end")}</span>
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl font-medium mx-auto">
          {t("extra.testimonial_subtitle") || "Join the global community of instructors making an impact and building their brand."}
        </p>
      </div>

      {/* Reviews Grid - Only show if reviews exist */}
      {finalReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-4 px-4">
          {finalReviews.map((review: any, idx: number) => (
            <div key={idx} className="flex justify-center w-full">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground italic">Be the first to leave a review after enrolling in a course!</p>
        </div>
      )}
    </Section>
  );
}

function ReviewCard({ review }: { review: any }) {
  const { t } = useTranslation();
  const reviewer = review.user || {};
  return (
    <div className="flex flex-col w-full h-full bg-card/40 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] border border-primary/10 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.1)] group">

      {/* Top Section: Rating & Quote Icon */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 flex-wrap">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
          ))}
        </div>
        <div className="w-10 h-10 shrink-0 bg-primary/5 rounded-xl flex items-center justify-center border border-primary/10 group-hover:bg-primary/10 transition-colors">
          <Quote className="w-4 h-4 text-primary/20 group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Testimonial Content */}
      <p className="text-sm md:text-base font-bold leading-relaxed text-foreground/90 whitespace-normal mb-6 tracking-tight italic flex-grow">
        &quot;{review.content}&quot;
      </p>

      {/* Reviewer Details */}
      <div className="flex items-center gap-3 border-t border-primary/10 pt-6 mt-auto">
        <div className="relative shrink-0">
          <img
            src={reviewer.avatar || `https://i.pravatar.cc/150?u=${reviewer.name}`}
            alt={reviewer.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-background shadow-lg group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center shadow-sm">
            <Star className="w-2 h-2 fill-primary-foreground text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-0.5 overflow-hidden">
          <h4 className="font-black text-sm text-foreground tracking-tight truncate">{reviewer.name || t("testimonials.anonymous")}</h4>
          <p className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] leading-none truncate">{reviewer.role || t("testimonials.verified")}</p>
        </div>
      </div>
    </div>
  );
}