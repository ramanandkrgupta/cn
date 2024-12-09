import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/send-code/route";

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

    const formData = await req.formData();
    const fileDetailsStr = formData.get('fileDetails');
    const userEmail = formData.get('userEmail');
    const uploadResStr = formData.get('uploadRes');

    if (!fileDetailsStr || !userEmail || !uploadResStr) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileDetails = JSON.parse(fileDetailsStr);
    const uploadRes = JSON.parse(uploadResStr);

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        reputationScore: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Determine initial status based on user reputation
    const initialStatus = user.reputationScore > 100 ? "approved" : "pending";

    // Create posts
    const posts = await Promise.all(
      fileDetails.map(async (detail, index) => {
        // First find the subject
        const subject = await prisma.subject.findFirst({
          where: {
            AND: [
              { subject_code: detail.subject_code },
              { course_name: detail.course_name },
              { semester_code: detail.semester_code }
            ]
          }
        });

        if (!subject) {
          throw new Error(`Subject not found for subject code: ${detail.subject_code}`);
        }

        const post = await prisma.post.create({
          data: {
            title: detail.title,
            description: detail.description,
            category: detail.category,
            course_name: detail.course_name,
            semester_code: detail.semester_code,
            subject_name: detail.subject_name,
            subject_code: detail.subject_code,
            file_url: uploadRes[index].url,
            file_name: detail.file_name,
            fileHash: uploadRes[index].hash,
            status: initialStatus,
            qualityScore: 0,
            version: 1,
            isLatestVersion: true,
            user: {
              connect: {
                id: user.id
              }
            },
            subject: {
              connect: {
                id: subject.id
              }
            }
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

        return post;
      })
    );

    return NextResponse.json({
      success: true,
      posts
    });

  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        error: "Error creating post",
        details: error.message
      },
      { status: 500 }
    );
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
