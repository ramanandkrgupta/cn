import { NextResponse } from 'next/server'
import prisma from '@/libs/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import { generateThumbnail } from '@/libs/generateThumbnail'

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany()

    // Exclude file_url from each post
    const filteredPosts = allPosts.map(({ file_url, ...rest }) => rest)

    return new Response(JSON.stringify(filteredPosts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error processing the request:', error)
    return new Response('An error occurred', {
      status: 500,
    })
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { files, fileDetails } = body

    console.log('Received data:', { files, fileDetails })

    // Create posts for each file
    const posts = await Promise.all(
      files.map(async (file, index) => {
        const details = fileDetails[index]
        if (!details) {
          throw new Error(`No details found for file ${file.name}`)
        }

        // First find or create the subject
        let subject = await prisma.subject.findFirst({
          where: {
            subject_code: details.subject_code || details.subject?.subject_code,
            course_name: details.course_name || details.course,
            semester_code: details.semester_code || details.semester,
          },
        })

        if (!subject) {
          subject = await prisma.subject.create({
            data: {
              subject_code:
                details.subject_code || details.subject?.subject_code || '',
              subject_name:
                details.subject_name || details.subject?.subject_name || '',
              course_name: details.course_name || details.course || '',
              semester_code: details.semester_code || details.semester || '',
            },
          })
        }

        // Create the post
        return await prisma.post.create({
          data: {
            title: details.title || file.name,
            description: details.description || '',
            category: details.category || '',
            course_name: details.course_name || details.course || '',
            semester_code: details.semester_code || details.semester || '',
            subject_code:
              details.subject_code || details.subject?.subject_code || '',
            subject_name:
              details.subject_name || details.subject?.subject_name || '',
            file_url: file.url,
            file_name: file.name,
            file_size: file.size,
            thumbnail_url:
              file.thumbnailUrl ||
              'https://res.cloudinary.com/dk6p24i8q/image/upload/e_improve:outdoor/thumbnails/preview',
            status: 'pending',
            version: 1,
            isLatestVersion: true,
            qualityScore: 0.0,
            premium: false,
            user: {
              connect: {
                email: session.user.email,
              },
            },
            subject: {
              connect: {
                id: subject.id,
              },
            },
          },
        })
      })
    )

    return NextResponse.json({ success: true, posts })
  } catch (error) {
    console.error('Error saving file details:', error)
    return NextResponse.json(
      { error: 'Failed to save file details: ' + error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(req) {
  const { id } = await req.json()
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: id },
    })
    return new Response(JSON.stringify(deletedPost), {
      status: 200,
    })
  } catch (error) {
    console.error('Error processing the request:', error)
    return new Response('An error occurred', {
      status: 500,
    })
  }
}

export async function PUT(req) {
  const {
    id,
    title,
    description,
    category,
    course_name,
    semester_code,
    subject_code,
    subject_name,
    file_url,
    file_name,
  } = await req.json()

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        description,
        category,
        course_name,
        semester_code,
        subject_code,
        subject_name,
        file_url,
        file_name,
      },
    })

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error processing the request:', error)
    return new Response('An error occurred', {
      status: 500,
    })
  }
}
