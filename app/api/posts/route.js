const posts = await prisma.post.findMany({
  select: {
    id: true,
    title: true,
    description: true,
    course_name: true,
    semester_code: true,
    subject_name: true,
    category: true,
    premium: true,
    file_name: true,
    downloads: true,
    likes: true,
    shares: true,
    createdAt: true,
  },
}); 