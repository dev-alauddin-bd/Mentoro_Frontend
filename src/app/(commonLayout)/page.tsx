import { Metadata } from "next";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { HeroAnimated } from "@/components/hero";
import { StatsSection } from "@/components/StatsSection";
import { Testimonials } from "@/components/Testimonials";
import { ContactSection } from "@/components/ContactSection";
import { InstructorCTA } from "@/components/InstructorCta";
import { TrustBar } from "@/components/TrustBar";
import { UpcomingLiveCourses } from "@/components/UpcomingLiveCourses";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "CourseMaster | Transform Your Future with Expert-Led Online Courses",
  description: "Join CourseMaster to learn React, Next.js, AI, and more. Master new skills with high-quality video courses and live sessions from industry experts.",
  openGraph: {
    title: "CourseMaster | Transform Your Future with Expert-Led Online Courses",
    description: "Master new skills with high-quality video courses and live sessions from industry experts.",
    type: "website",
  }
};

export default function Home() {

  return (
    <main className="bg-background overflow-x-hidden">

      <HeroAnimated />
      <TrustBar />
      {/* <StatsSection /> */}
      <FeaturedCourses />
      <UpcomingLiveCourses />
      <InstructorCTA />
      <ContactSection />
      <FAQ />
      <Testimonials />
    </main>
  );
}