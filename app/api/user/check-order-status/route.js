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

      try {
        const updateResult = await prisma.user.update({
          where: { phoneNumber: customer_mobile },
          data: { userRole: 'PRO' }
        });
        console.log('Update result:', updateResult);
      } catch (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json({ error: 'Error updating user role.' }, { status: 500, headers: responseHeaders });
      }

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200, headers: responseHeaders });
    } else {
      console.log('Transaction not successful.');
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400, headers: responseHeaders });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);

    if (error instanceof prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      console.error('Prisma error code:', error.code);
      return NextResponse.json({ error: 'Database error occurred.' }, { status: 500, headers: responseHeaders });
    } else if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
      return NextResponse.json({ error: 'Received error response from external service.' }, { status: error.response.status, headers: responseHeaders });
    } else if (error.request) {
      console.error('Error request:', error.request);
      return NextResponse.json({ error: 'No response received from external service.' }, { status: 500, headers: responseHeaders });
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