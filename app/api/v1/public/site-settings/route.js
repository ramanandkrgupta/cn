// /app/api/v1/public/site-settings/route.js
import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma' // Make sure this points to your Prisma client

export async function GET(req) {
  try {
    // Fetch the site settings record; if not found, return default values.
    const settings =
      (await prisma.siteSetting.findFirst()) || {
        planPrice: 0,
        ads: [],
        banners: [],
      }

    // Cache this response on the edge for 60 seconds, then revalidate.
    return NextResponse.json(settings, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return NextResponse.json(
      { error: 'Error fetching site settings' },
      { status: 500 }
    )
  }
}
