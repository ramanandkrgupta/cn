import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany();
    
    // Exclude file_url from each post
    const filteredPosts = allPosts.map(({ file_url, ...rest }) => rest);

    return new Response(JSON.stringify(filteredPosts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response("An error occurred", {
      status: 500,
    });
  }
}


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileDetails, uploadRes, userEmail } = await req.json();

    // Get user's reputation
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { reputationScore: true, id: true }
    });

    // Determine initial status based on user reputation
    const initialStatus = user.reputationScore > 100 ? "approved" : "pending";

    // Create posts with moderation status
    const posts = await Promise.all(
      fileDetails.map(async (detail, index) => {
        const post = await prisma.post.create({
          data: {
            title: detail.title,
            description: detail.description,
            category: detail.category,
            course_name: detail.course,
            semester_code: detail.semester,
            subject_name: detail.subject.name,
            subject_code: detail.subject.link,
            file_url: uploadRes[index].url,
            file_name: uploadRes[index].filename,
            fileHash: uploadRes[index].hash,
            status: initialStatus,
            userId: user.id
          }
        });

        // Create moderation entry if needed
        if (initialStatus === "pending") {
          await prisma.contentModeration.create({
            data: {
              postId: post.id,
              status: "pending"
            }
          });
        }

        // Update user stats
        await prisma.user.update({
          where: { id: user.id },
          data: {
            uploadCount: { increment: 1 }
          }
        });

        return post;
      })
    );

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: id },
    });
    return new Response(JSON.stringify(deletedPost), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response("An error occurred", {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const { id, title, description, category, course_name, semester_code, subject_code, subject_name, file_url, file_name } = await req.json();

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
    });

    return new Response(JSON.stringify(updatedPost), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response("An error occurred", {
      status: 500,
    });
  }
}
