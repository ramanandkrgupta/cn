import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { 
        id: params.id,
        isPublic: true // Only fetch public collections
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        },
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
        }
      }
    });

    if (!collection) {
      return NextResponse.json(
        { message: "Collection not found or is private" },
        { status: 404 }
      );
    }

    // Transform the response to match the expected format
    const transformedCollection = {
      ...collection,
      posts: collection.posts.map(p => p.post)
    };

    return NextResponse.json(transformedCollection);
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { message: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}