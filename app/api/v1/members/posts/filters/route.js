// app/api/v1/members/posts/filters/route.js
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

// Ideally, reuse the same Prisma instance throughout your app.
const prisma = new PrismaClient()

export async function GET(request) {
  try {
    // Run the queries concurrently for better performance.
    const [coursesData, semestersData, categoriesData] = await Promise.all([
      prisma.post.findMany({
        select: { course_name: true },
        distinct: ['course_name'],
      }),
      prisma.post.findMany({
        select: { semester_code: true },
        distinct: ['semester_code'],
      }),
      prisma.post.findMany({
        select: { category: true },
        distinct: ['category'],
      }),
    ])

    // Extract and filter out null/empty values.
    const courses = coursesData
      .map((c) => c.course_name)
      .filter((val) => Boolean(val) && val.trim() !== '')
    const semesters = semestersData
      .map((s) => s.semester_code)
      .filter((val) => Boolean(val) && val.trim() !== '')
    const categories = categoriesData
      .map((c) => c.category)
      .filter((val) => Boolean(val) && val.trim() !== '')

    return NextResponse.json({ courses, semesters, categories })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { error: 'Error fetching filter options' },
      { status: 500 }
    )
  }
}
