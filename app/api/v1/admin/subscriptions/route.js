import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    const subscriptions = await prisma.subscriptionDetail.findMany({
      include: {
        user: true, // Include related user details
      },
      orderBy: {
        createdAt: 'desc', // Sort by creation date descending
      },
    })

    // Check if subscriptions were found
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found' }, { status: 404 })
    }

    return NextResponse.json(subscriptions, { status: 200 })
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
