// app/api/v1/members/posts/filters/route.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get distinct course names (only those with a value)
    const coursesData = await prisma.post.findMany({
      select: { course_name: true },
      distinct: ['course_name'],
    })
    const semestersData = await prisma.post.findMany({
      select: { semester_code: true },
      distinct: ['semester_code'],
    })
    const categoriesData = await prisma.post.findMany({
      select: { category: true },
      distinct: ['category'],
    })

    // Extract and filter out null/empty values
    const courses = coursesData
      .map((c) => c.course_name)
      .filter((val) => Boolean(val) && val.trim() !== '')
    const semesters = semestersData
      .map((s) => s.semester_code)
      .filter((val) => Boolean(val) && val.trim() !== '')
    const categories = categoriesData
      .map((c) => c.category)
      .filter((val) => Boolean(val) && val.trim() !== '')

    return new Response(JSON.stringify({ courses, semesters, categories }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return new Response(
      JSON.stringify({ error: 'Error fetching filter options' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
