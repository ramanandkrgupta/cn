const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: 'password123',
      phoneNumber: '123-456-7890',
      userRole: 'USER',
    },
  });
  console.log('Created user:', user);

  // Create a new subject
  const subject = await prisma.subject.create({
    data: {
      userId: user.id,
      course_name: 'Course Name',
      semester_code: '2024SP',
      subject_code: 'CS101',
      subject_name: 'Computer Science',
    },
  });
  console.log('Created subject:', subject);

  // Create a new post
  const post = await prisma.post.create({
    data: {
      userId: user.id,
      course_name: 'Course Name',
      semester_code: '2024SP',
      subject_code: 'CS101',
      subject_name: 'Computer Science',
      title: 'Post Title',
      description: 'Post description...',
    },
  });
  console.log('Created post:', post);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
