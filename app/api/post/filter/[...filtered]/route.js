import prisma from "@/libs/prisma";

export async function GET(req, { params }) {
  const [courseName, semester, category, subId] = params.filtered;
  try {
    const posts = await prisma.post.findMany({
      where: {
        course_name: courseName,
        semester_code: semester,
        category,
        subject_code: subId,
      },
    });

    // Exclude file_url from each post
    const filteredPosts = posts.map(({ file_url, ...rest }) => rest);

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
