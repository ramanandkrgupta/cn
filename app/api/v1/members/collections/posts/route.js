import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/libs/prisma';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collectionId, postId } = await req.json();

    // Verify collection ownership
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true }
    });

    if (!collection || collection.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Add post to collection
    const postInCollection = await prisma.postsInCollections.create({
      data: {
        postId,
        collectionId
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            thumbnail_url: true,
            subject_name: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json(postInCollection.post);
  } catch (error) {
    console.error("Error adding post to collection:", error);
    return NextResponse.json({ error: "Failed to add post to collection" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collectionId, postId } = await req.json();

    // Verify collection ownership
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true }
    });

    if (!collection || collection.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Remove post from collection
    await prisma.postsInCollections.delete({
      where: {
        postId_collectionId: {
          postId,
          collectionId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing post from collection:", error);
    return NextResponse.json({ error: "Failed to remove post from collection" }, { status: 500 });
  }
} 