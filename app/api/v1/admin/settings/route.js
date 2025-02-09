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

    // Basic input validation
    if (planPrice !== undefined && typeof planPrice !== 'number') {
      return NextResponse.json({ error: 'Invalid planPrice value' }, { status: 400 })
    }
    if (ads !== undefined && !Array.isArray(ads)) {
      return NextResponse.json({ error: 'ads must be an array' }, { status: 400 })
    }
    if (banners !== undefined && !Array.isArray(banners)) {
      return NextResponse.json({ error: 'banners must be an array' }, { status: 400 })
    }

    let settings = await prisma.siteSetting.findFirst()
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          planPrice: planPrice ?? 0,
          ads: ads ?? [],
          banners: banners ?? [],
        },
      })
    } else {
      settings = await prisma.siteSetting.update({
        where: { id: settings.id },
        data: {
          planPrice: planPrice !== undefined ? planPrice : settings.planPrice,
          ads: ads !== undefined ? ads : settings.ads,
          banners: banners !== undefined ? banners : settings.banners,
        },
      })
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating site settings:", error)
    return NextResponse.json({ error: 'Error updating site settings' }, { status: 500 })
  }
}
