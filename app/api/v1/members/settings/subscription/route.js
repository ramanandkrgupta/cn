// app/api/v1/members/settings/subscription/route.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    const proPlan = await prisma.subscriptionPlan.findUnique({
      where: {
        planId: 'pro',
      },
      select: {
        id: true,
        planId: true,
        name: true,
        price: true,
        offer: true,
      },
    })

    if (!proPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Transform the data to match the client expectations
    const transformedPlan = {
      ...proPlan,
      discountedPrice: proPlan.price, // or swap if needed
      originalPrice: proPlan.offer,
      discountPercentage: proPlan.offer
        ? ((proPlan.offer - proPlan.price) / proPlan.offer) * 100
        : 0,
    }

    return NextResponse.json(transformedPlan)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pro plan settings' },
      { status: 500 }
    )
  }
}
