"use client";

import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";
import { useGetReviewsQuery } from "@/redux/features/review/reviewApi";

export function Testimonials() {
  const { t } = useTranslation();
  const { data: reviewData, isLoading } = useGetReviewsQuery(undefined);
  
  // Logic: Use fetched data only. Seed DB for real data instead of static arrays.
  const finalReviews = reviewData?.data || [];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
   
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-[10px] font-black uppercase text-primary tracking-[0.2em]">
            <Star className="w-3 h-3 fill-primary" />
            {t("extra.voices_success") || "Wall of Love"}
          </div>
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-foreground leading-[0.95]">
            {t("extra.testimonial_title") || "Trusted by thousands of educators."}
          </h2>
          <p className="text-muted-foreground text-lg font-medium max-w-xl mx-auto italic">
            &quot;{t("extra.testimonial_subtitle") || "Join the global community of instructors making an impact and building their brand."}&quot;
          </p>
        </div>

        {/* Marquee Rows - Only show if reviews exist */}
        {finalReviews.length > 0 ? (
          <div className="flex flex-col gap-10">
            {/* Row 1: Leftward Scroll */}
            <div className="relative flex overflow-x-hidden group">
              <div className="flex animate-marquee py-4 gap-8 group-hover:[animation-play-state:paused]">
                {[...finalReviews, ...finalReviews].map((review: any, idx: number) => (
                  <ReviewCard key={`row1-${idx}`} review={review} />
                ))}
              </div>
              {/* Edge Gradients for smooth fade */}
              <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Row 2: Rightward Scroll */}
            <div className="relative flex overflow-x-hidden group">
              <div className="flex animate-marquee-reverse py-4 gap-8 group-hover:[animation-play-state:paused]">
                {[...[...finalReviews].reverse(), ...[...finalReviews].reverse()].map((review: any, idx: number) => (
                  <ReviewCard key={`row2-${idx}`} review={review} />
                ))}
              </div>
              {/* Edge Gradients */}
              <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>
        ) : (
           <div className="text-center py-20">
             <p className="text-muted-foreground italic">Be the first to leave a review after enrolling in a course!</p>
           </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: any }) {
  const reviewer = review.user || {};
  return (
    <div className="inline-flex flex-col w-[350px] sm:w-[450px] bg-card/40 backdrop-blur-xl p-10 rounded-[3rem] border border-border/60 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),0.1)] group">
      
      {/* Top Section: Rating & Quote Icon */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
          ))}
        </div>
        <Quote className="w-8 h-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
      </div>

      {/* Testimonial Content */}
      <p className="text-lg font-bold leading-relaxed text-foreground/90 whitespace-normal mb-10 tracking-tight italic">
        &quot;{review.content}&quot;
      </p>

      {/* Reviewer Details */}
      <div className="flex items-center gap-4 border-t border-border/50 pt-8">
        <div className="relative">
          <img 
            src={reviewer.avatar || `https://i.pravatar.cc/150?u=${reviewer.name}`} 
            alt={reviewer.name} 
            className="w-14 h-14 rounded-2xl object-cover border-2 border-background shadow-lg group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
             <Star className="w-2.5 h-2.5 fill-primary-foreground text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-0.5">
          <h4 className="font-black text-base text-foreground tracking-tight">{reviewer.name || "Anonymous Student"}</h4>
          <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none">{reviewer.role || "Verified Student"}</p>
        </div>
      </div>
    </div>
  );
}