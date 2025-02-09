// app/api/v1/members/search/posts/route.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET handler for fetching posts
export async function GET(req) {
  try {
    // Get URL search params from the request
    const { searchParams } = new URL(req.url)
    const searchTerm = searchParams.get('searchTerm')
    const category = searchParams.get('category')
    const premium = searchParams.get('premium')
    const course_name = searchParams.get('course_name')
    const semester_code = searchParams.get('semester_code')
    const subject_code = searchParams.get('subject_code')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build the filter object
    const filter = {
      isLatestVersion: true, // always fetch only the latest version
    }

    if (searchTerm) {
      filter.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ]
    }

    if (category) {
      filter.category = category
    }

    if (premium !== null && premium !== '') {
      // Expecting a string "true" or "false"
      filter.premium = premium === 'true'
    }

    if (course_name) {
      filter.course_name = { contains: course_name, mode: 'insensitive' }
    }

    if (semester_code) {
      filter.semester_code = { equals: semester_code }
    }

    if (subject_code) {
      filter.subject_code = { equals: subject_code }
    }

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) {
        filter.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        filter.createdAt.lte = new Date(endDate)
      }
    }

    // Determine if no extra filters were applied (only default filter exists)
    const isEmptyFilter = Object.keys(filter).length === 1 // only isLatestVersion

    // Fetch posts from Prisma
    let posts = await prisma.post.findMany({
      where: filter,
      include: {
        user: {
          select: { name: true, avatar: true },
        },
      },
    })

    // If no extra filter, randomize the posts array
    if (isEmptyFilter) {
      posts.sort(() => Math.random() - 0.5)
    } else {
      // Otherwise, sort descending by creation date
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return new Response(JSON.stringify({ error: 'Error fetching posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Optionally, reject other methods explicitly
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed. Use GET instead.' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  )
}
