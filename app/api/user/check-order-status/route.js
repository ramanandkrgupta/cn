import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { status, order_id, customer_mobile, amount, remark1, remark2 } = await req.json();

    console.log('Request data:', { status, order_id, customer_mobile, amount, remark1, remark2 });

    if (!status || !order_id || !customer_mobile) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (status === 'SUCCESS') {
      console.log('Updating user with phoneNumber:', customer_mobile);

      const updateResult = await prisma.user.update({
        where: { phoneNumber: customer_mobile },
        data: { userRole: 'PRO' }
      });

      console.log('Update result:', updateResult);

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    } else {
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

  } catch (error) {
    console.error('Error processing webhook:', error);

    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    return NextResponse.json({ error: 'An error occurred while processing the webhook.' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  } finally {
    await prisma.$disconnect();
  }
};