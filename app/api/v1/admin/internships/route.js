import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import QRCode from 'qrcode'
import { getSiteUrl } from '@/libs/seohelper'

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 10
    const skip = (page - 1) * limit

    const [internships, total] = await Promise.all([
      prisma.internship.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.internship.count(),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      internships,
      pagination: {
        total,
        pages: totalPages,
        page,
        limit,
      },
    })
  } catch (error) {
    console.error('Error fetching internships:', error)
    return NextResponse.json(
      {
        error: 'Error fetching internships',
        details: error.message,
      },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, startDate, endDate, stipendAmount, role } = await req.json()

    // Validate required fields
    if (!name || !startDate || !endDate || !stipendAmount || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Create internship
    const internship = await prisma.internship.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stipendAmount: parseFloat(stipendAmount),
        role,
      },
    })

    // Generate QR code URL
    // Priority: 1. NEXT_PUBLIC_APP_URL (explicit production URL)
    //          2. Request origin (works automatically in production)
    //          3. getSiteUrl() fallback (for Vercel or localhost)
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL

    if (!baseUrl) {
      try {
        const requestUrl = new URL(req.url)
        baseUrl = `${requestUrl.protocol}//${requestUrl.host}`
      } catch (e) {
        baseUrl = getSiteUrl()
      }
    }

    const qrCodeUrl = `${baseUrl}/interns/${internship.id}?utm_source=qr_code`

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 512,
    })

    // Update internship with QR code data URL
    const updatedInternship = await prisma.internship.update({
      where: { id: internship.id },
      data: { qrCodeUrl: qrCodeDataUrl },
    })

    return NextResponse.json(
      {
        ...updatedInternship,
        qrCodeUrl: qrCodeDataUrl,
        publicUrl: qrCodeUrl,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating internship:', error)
    return NextResponse.json(
      {
        error: 'Error creating internship',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
