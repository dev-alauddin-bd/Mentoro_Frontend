import { Metadata } from 'next'


export async function generateMetadata(): Promise<Metadata> {

  return {
    title: 'Course Details | Mentoro',
    description: 'Master new skills with our expert-led courses.'
  }
}

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
