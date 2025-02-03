import { prisma } from "@/libs/prisma";

export async function GET(req, { params }) {
  const { slug } = params;
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!blog) {
      return Response.json({ error: "Blog not found" }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json({ error: "Error fetching blog" }, { status: 500 });
  }
}
