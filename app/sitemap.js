import { getSiteUrl } from '@/libs/seohelper'
import prisma from '@/libs/prisma'
import { courses, semester } from '@/constants'

export default async function sitemap() {
  const baseUrl = getSiteUrl()

  // Static routes
  const staticRoutes = [
    '',
    'about',
    'search',
    'support',
    'privacy',
    'terms',
    'refund',
    'view-doc',
    'view-vid',
    'view-subjects',
    'quiz',
    'upload'
  ].map((route) => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic routes - Posts
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  })

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Course routes from constants
  const courseRoutes = courses.flatMap(course => {
    const mainRoute = {
      url: `${baseUrl}/rgpv/${course.link}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }

    const semesterRoutes = semester.map(sem => ({
      url: `${baseUrl}/rgpv/${course.link}/${sem.link}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }))

    return [mainRoute, ...semesterRoutes]
  })

  return [...staticRoutes, ...postRoutes, ...courseRoutes]
}
