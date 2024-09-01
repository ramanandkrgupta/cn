import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { user_token, order_id, payment_status } = await req.json();

    if (payment_status === 'SUCCESS') {
      // Update user role to PRO in the database using Prisma and order_id
      await prisma.user.update({
        where: { phoneNumber: user_token }, // Assuming user_token is phoneNumber here
        data: { userRole: 'PRO' }
      });

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Payment not successful.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'An error occurred while updating the user role.' }, { status: 500 });
  }
};