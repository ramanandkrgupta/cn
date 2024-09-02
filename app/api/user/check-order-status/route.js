import { NextResponse } from 'next/server';
import prisma from "@/libs/prisma";

export const POST = async (req) => {
  try {
    // Set CORS headers
    const responseHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const { status, order_id, customer_mobile, amount, remark1, remark2 } = await req.json();

    console.log('Request data:', { status, order_id, customer_mobile, amount, remark1, remark2 });

    if (!status || !order_id || !customer_mobile) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400, headers: responseHeaders });
    }

    if (status === 'SUCCESS') {
      // Log the customer_mobile to see what value is being passed
      console.log('Updating user with phoneNumber:', customer_mobile);

      // Update user role to PRO in the database using Prisma and customer_mobile
      const updateResult = await prisma.user.update({
        where: { phoneNumber: customer_mobile },
        data: { userRole: 'PRO' }
      });

      // Log the result of the update operation
      console.log('Update result:', updateResult);

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200, headers: responseHeaders });
    } else {
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400, headers: responseHeaders });
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

    return NextResponse.json({ error: 'An error occurred while processing the webhook.' }, { status: 500, headers: responseHeaders });
  }
};