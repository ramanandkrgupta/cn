import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET(req, { params }) {
  try {
    // Handle params as Promise in Next.js 15
    const resolvedParams = await params
    const { id } = resolvedParams

    if (!id) {
      return NextResponse.json(
        { error: 'Internship ID is required' },
        { status: 400 }
      )
    }

    const internship = await prisma.internship.findUnique({
      where: { id },
    })

    if (!internship) {
      return NextResponse.json(
        { error: 'Internship not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(internship)
  } catch (error) {
    console.error('Error fetching internship:', error)
    return NextResponse.json(
      {
        error: 'Error fetching internship',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
