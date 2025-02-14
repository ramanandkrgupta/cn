import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    const subscriptions = await prisma.subscriptionDetail.findMany({
      include: {
        user: true, // Include user details
      },
    })
    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
