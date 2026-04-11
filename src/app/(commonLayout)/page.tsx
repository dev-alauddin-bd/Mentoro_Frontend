"use client";


import { FeaturedCourses } from "@/components/FeaturedCourses";
import { HeroAnimated } from "@/components/hero";
import { TrustBar } from "@/components/TrustBar";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";

import { InstructorCTA } from "@/components/InstructorCta";

export default function Home() {

  return (
    <main className="bg-background overflow-x-hidden">
     
      <HeroAnimated />
      <TrustBar />
      <FeaturedCourses />

   <InstructorCTA/>

      <ContactSection />
      <Testimonials />
    </main>
  );
}