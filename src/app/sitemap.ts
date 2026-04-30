import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL of your frontend
  const baseUrl = 'https://course-master-frontend-flax.vercel.app' 

  // Fetch courses from your API to make the sitemap dynamic
  let courseUrls: MetadataRoute.Sitemap = []
  
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/courses?showAll=true`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    const result = await response.json()
    
    if (result?.success && result.data?.courses) {
      courseUrls = result.data.courses.map((course: any) => ({
        url: `${baseUrl}/courses/${course.id}`,
        lastModified: new Date(course.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...courseUrls,
  ]
}
