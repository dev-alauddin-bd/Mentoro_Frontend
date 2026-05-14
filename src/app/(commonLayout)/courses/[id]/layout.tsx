import { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = (await params).id
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/courses/${id}`)
    const result = await response.json()
    
    if (result?.success && result.data) {
      const course = result.data
      return {
        title: `${course.title} | Mentoro`,
        description: course.description?.slice(0, 160) || "Learn this course on Mentoro",
        openGraph: {
          title: course.title,
          description: course.description?.slice(0, 160),
          images: [course.thumbnail],
        },
      }
    }
  } catch (error) {
    console.error('Metadata generation error:', error)
  }

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
