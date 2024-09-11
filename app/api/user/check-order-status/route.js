import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';

const prisma = new PrismaClient();

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(req, NextAuthOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: responseHeaders });
    }

    const { status, order_id, customer_mobile, amount, remark1, remark2 } = await req.json();

    console.log('Request data:', { status, order_id, customer_mobile, amount, remark1, remark2 });

    if (!status || !order_id || !customer_mobile) {
      console.log('Missing required parameters.');
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400, headers: responseHeaders });
    }

    if (status === 'SUCCESS') {
      console.log('Updating user with phoneNumber:', customer_mobile);

      const user = await prisma.user.findFirst({
        where: { phoneNumber: customer_mobile },
      });

      if (!user) {
        console.log('User not found.');
        return NextResponse.json({ error: 'User not found.' }, { status: 404, headers: responseHeaders });
      }

      const updateResult = await prisma.user.update({
        where: { id: user.id }, // Use the unique id for the update operation
        data: { userRole: 'PRO' }
      });
      console.log('Update result:', updateResult);

      // Update session role if needed
      session.user.userRole = 'PRO';

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200, headers: responseHeaders });
    } else {
      console.log('Transaction not successful.');
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400, headers: responseHeaders });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    return NextResponse.json({ 
      error: 'An unexpected error occurred.', 
      details: {
        name: error.name,
        message: error.message,
        stack: error.stack
      } 
    }, { status: 500, headers: responseHeaders });
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