import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const POST = async (req) => {
  try {
    const { status, order_id, customer_mobile, amount, remark1, remark2 } = await req.json();

    console.log('Request data:', { status, order_id, customer_mobile, amount, remark1, remark2 });

    if (!status || !order_id || !customer_mobile) {
      console.log('Missing required parameters.');
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400, headers: responseHeaders });
    }

    if (status === 'SUCCESS') {
      console.log('Updating user with phoneNumber:', customer_mobile);

      const user = await prisma.user.findUnique({
        where: { phoneNumber: customer_mobile },
      });

      if (!user) {
        console.log('User not found.');
        return NextResponse.json({ error: 'User not found.' }, { status: 404, headers: responseHeaders });
      }

      const updateResult = await prisma.user.update({
        where: { phoneNumber: customer_mobile },
        data: { userRole: 'PRO' }
      });
      console.log('Update result:', updateResult);

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200, headers: responseHeaders });
    } else {
      console.log('Transaction not successful.');
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400, headers: responseHeaders });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);

    // Instead of instanceof, directly use error.name or error.message
    if (error.name === 'PrismaClientKnownRequestError') {
      console.error('Prisma error code:', error.code);
      console.error('Error meta:', error.meta);
      return NextResponse.json({ error: 'Database error occurred.' }, { status: 500, headers: responseHeaders });
    } else {
      console.error('Error message:', error.message);
      return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500, headers: responseHeaders });
    }
  } finally {
    await prisma.$disconnect();
  }
};

export const OPTIONS = async () => {
  return NextResponse.json({}, {
    status: 204,
    headers: responseHeaders
  });
};