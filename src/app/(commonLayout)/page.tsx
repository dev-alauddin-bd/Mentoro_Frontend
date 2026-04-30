"use client";


import { FeaturedCourses } from "@/components/FeaturedCourses";
import { HeroAnimated } from "@/components/hero";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";
import { InstructorCTA } from "@/components/InstructorCta";
import { TrustBar } from "@/components/TrustBar";
import { UpcomingLiveCourses } from "@/components/UpcomingLiveCourses";
import { FAQ } from "@/components/FAQ";

export default function Home() {

  return (
    <main className="bg-background overflow-x-hidden">

      <HeroAnimated />
      <TrustBar />
      <StatsSection />
      <FeaturedCourses />
      <UpcomingLiveCourses />
      <InstructorCTA />
      <FAQ />
      <ContactSection />
      <Testimonials />
    </main>
  );
}