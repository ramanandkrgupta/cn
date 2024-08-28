import prisma from "@/libs/prisma";

export async function GET() {
  try {
    const allPosts = await prisma.post.findMany();
    return new Response(JSON.stringify(allPosts), {
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
    const { fileDetails, uploadRes, userEmail } = await req.json();

    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    const existingFiles = await prisma.post.findMany({
      where: { file_name: { in: uploadRes.map((res) => res.filename) } },
    });

    if (existingFiles.length > 0) {
      const existingFileNames = existingFiles.map((file) => file.file_name);
      return new Response(
        `These files already uploaded: ${existingFileNames.join(", ")}`,
        {
          status: 200,
          statusText: "FAILED",
        }
      );
    }

    const createdPosts = [];

    for (let i = 0; i < fileDetails.length; i++) {
      const newPost = await prisma.post.create({
        data: {
          userId: user.id,
          course_name: fileDetails[i].course,
          semester_code: fileDetails[i].semester,
          subject_code: fileDetails[i].subject.link,
          subject_name: fileDetails[i].subject.name,
          title: fileDetails[i].title.trim(),
          description: fileDetails[i].description.trim(),
          category: fileDetails[i].category.trim(),
          file_url: uploadRes[i].url,
          file_name: uploadRes[i].filename,
        },
      });
      createdPosts.push(newPost);
    }

    return new Response(JSON.stringify(createdPosts), {
      status: 201,
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
