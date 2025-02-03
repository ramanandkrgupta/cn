import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
    return Response.json(blogs);
  } catch (error) {
    return Response.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
