import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "About Us | Mentoro - Empowering Learners Worldwide",
  description: "Learn more about Mentoro's mission to provide world-class education. Discover our values, our team, and how we're transforming online learning.",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
