import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req) => {
  try {
    const { user_token, order_id, phoneNumber } = await req.json();

    if (!user_token || !order_id || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const data = qs.stringify({
      user_token,
      order_id
    });

    const config = {
      method: 'post',
      url: 'https://instantdum.com/api/check-order-status',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    const response = await axios.request(config);

    if (response.data.status && response.data.result.txnStatus === 'SUCCESS') {
      // Update user role to PRO in the database using Prisma and phoneNumber
      await prisma.user.update({
        where: { phoneNumber: phoneNumber },
        data: { userRole: 'PRO' }
      });

      return NextResponse.json({ message: 'User role updated to PRO.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Transaction not successful.' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json({ error: 'An error occurred while checking the order status.' }, { status: 500 });
  }
};