import { getServerSession } from 'next-auth';
import prisma from '@/libs/prisma';

export default async function handler(req, res) {
  const session = await getServerSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const { name, phoneNumber } = req.body;

    try {
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: { name, phoneNumber },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}