import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateSessionToken(email, newRole) {
  // Find the session for the user
  const session = await prisma.session.findFirst({
    where: { user: { email } },
    include: {
      user: true, // Include the user related to the session
    },
  });

  if (session) {
    // Update the user role in the session
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        userRole: newRole,
      },
    });
    console.log('Session user role updated.');
  } else {
    console.log('Session not found for the user.');
  }
}