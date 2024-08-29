import { getSession } from 'next-auth/react';
import prisma from '@/libs/prisma';

export default async function handler(req, res) {
  // Check if the method is GET, if not, return 405
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      email: true,
      name: true,
      phoneNumber: true,
      userRole: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json(user);
}