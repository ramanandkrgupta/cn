import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';
import db from '@/lib/db'; // Assuming you have a database module to interact with your user database

export const POST = async (req) => {
  try {
    const { user_token, order_id } = await req.json();

    if (!user_token || !order_id) {
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
      // Update user role to PRO in the database
      await db.user.update({
        where: { orderId: order_id },
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