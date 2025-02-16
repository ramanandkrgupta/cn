// /app/api/v1/admin/setting/route.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma' // Adjust the path as needed
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

/**
 * GET: Fetch the current site settings.
 * If not found, create default settings.
 */
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.siteSetting.findFirst()
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          planPrice: 0,
          ads: [],
          banners: [],
        },
      })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return NextResponse.json({ error: 'Error fetching site settings' }, { status: 500 })
  }
}

/**
 * POST: Update the site settings.
 * Accepts a JSON body with any of these fields:
 * - planPrice (number)
 * - ads (array of ad objects)
 * - banners (array of banner objects)
 */
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planPrice, ads, banners } = await req.json()

    // Validate input data
    if (typeof planPrice !== 'number' || planPrice < 0) {
      return NextResponse.json(
        { error: 'Invalid plan price' },
        { status: 400 }
      )
    }

    // Update the plan in the database
    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { planId: 'pro' }, // Ensure this matches the planId in your database
      data: {
        price: planPrice,
        ads: ads || [], // Store ads as JSON
        banners: banners || [], // Store banners as JSON
      },
    })

    return NextResponse.json(updatedPlan)
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { error: 'Failed to update settings: ' + error.message },
      { status: 500 }
    )
  }
}
