import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { status, order_id, customer_mobile, amount, remark1, remark2 } = await req.json();

    if (!status || !order_id || !customer_mobile) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    if (status === 'SUCCESS') {
      // Update user role to PRO in the database using Prisma and customer_mobile
      await prisma.user.update({
        where: { phoneNumber: customer_mobile },
        data: { userRole: 'PRO' }
      });

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);

    // Add more detailed logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    return NextResponse.json({ error: 'An error occurred while processing the webhook.' }, { status: 500 });
  }
};