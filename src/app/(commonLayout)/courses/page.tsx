import { Metadata } from "next";
import CoursesContent from "@/components/CoursesContent";

export const metadata: Metadata = {
  title: "All Courses | Mentoro - Explore Our Expert-Led Programs",
  description: "Browse our wide range of professional courses in React, Next.js, Web Development, and AI. Start your learning journey with Mentoro today.",
  keywords: ["online courses", "web development courses", "react training", "nextjs masterclass", "it skills"],
  openGraph: {
    title: "All Courses | Mentoro",
    description: "Explore our wide range of professional courses in React, Next.js, Web Development, and AI. Start your learning journey with Mentoro today.",
    type: "website",
  }
};

export default function CoursesPage() {
  return <CoursesContent />;
}
