// app/api/v1/members/settings/subscription/route.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'

export async function GET() {
  try {
    // Find the subscription plan for "pro"
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { planId: 'pro' },
    })

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Here, "price" is the discounted price and "offer" is the original price.
    const discountedPrice = plan.price
    const originalPrice = plan.offer
    const discountPercentage =
      originalPrice > 0
        ? Number(
            (((originalPrice - discountedPrice) / originalPrice) * 100).toFixed(
              2
            )
          )
        : 0

    // Return the detailed plan data
    return NextResponse.json({
      discountedPrice,
      originalPrice,
      discountPercentage,
    })
  } catch (error) {
    console.error('Error in GET subscription route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
