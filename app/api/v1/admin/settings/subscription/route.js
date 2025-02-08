// app/api/v1/admin/settings/subscription/route.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { discountedPrice, originalPrice } = await req.json()

    // Validate input: both should be numbers and discountedPrice must be less than originalPrice
    if (
      typeof discountedPrice !== 'number' ||
      typeof originalPrice !== 'number' ||
      discountedPrice >= originalPrice
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid input. Ensure that both values are numbers and discountedPrice is less than originalPrice.',
        },
        { status: 400 }
      )
    }

    // Upsert the pro plan settings (using "price" for discountedPrice and "offer" for originalPrice)
    const updatedPlan = await prisma.subscriptionPlan.upsert({
      where: { planId: 'pro' },
      update: { price: discountedPrice, offer: originalPrice },
      create: {
        planId: 'pro',
        name: 'Pro',
        price: discountedPrice,
        offer: originalPrice,
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating subscription settings:', error)
    return NextResponse.json(
      { error: 'Error updating subscription settings' },
      { status: 500 }
    )
  }
}
