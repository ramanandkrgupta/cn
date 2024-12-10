import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import prisma from '@/libs/prisma';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collections = await prisma.collection.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        posts: {
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
        },
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform the response to match the expected format
    const transformedCollections = collections.map(collection => ({
      ...collection,
      posts: collection.posts.map(p => p.post),
      _count: {
        posts: collection._count.posts
      }
    }));

    return NextResponse.json(transformedCollections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ 
      error: "Failed to fetch collections",
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== 'PRO') {
      return NextResponse.json(
        { error: "Collections are a PRO feature" },
        { status: 403 }
      );
    }

    const { name, description, isPublic, postIds } = await req.json();

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
        isPublic,
        userId: session.user.id,
        posts: {
          create: postIds?.map(postId => ({
            post: {
              connect: { id: postId }
            }
          })) || []
        }
      },
      include: {
        posts: {
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
        },
        _count: {
          select: { posts: true }
        }
      }
    });

    // Transform the response to match the expected format
    const transformedCollection = {
      ...collection,
      posts: collection.posts.map(p => p.post),
      _count: {
        posts: collection._count.posts
      }
    };

    return NextResponse.json(transformedCollection);
  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ 
      error: "Failed to create collection",
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, name, description, isPublic } = await req.json();

    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    if (collection.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to edit this collection" }, { status: 403 });
    }

    const updatedCollection = await prisma.collection.update({
      where: { id },
      data: { name, description, isPublic },
      include: {
        posts: {
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
        },
        _count: {
          select: { posts: true }
        }
      }
    });

    return NextResponse.json({
      ...updatedCollection,
      posts: updatedCollection.posts.map(p => p.post)
    });
  } catch (error) {
    console.error("Error updating collection:", error);
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    const collection = await prisma.collection.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    if (collection.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this collection" }, { status: 403 });
    }

    // Delete all posts in collection first
    await prisma.postsInCollections.deleteMany({
      where: { collectionId: id }
    });

    // Then delete the collection
    await prisma.collection.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}