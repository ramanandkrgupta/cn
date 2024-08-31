import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export const POST = async (req) => {
  try {
    const { customer_mobile, user_token, amount, order_id, redirect_url, remark1, remark2, route } = await req.json();

    if (!customer_mobile || !user_token || !amount || !order_id || !redirect_url || !remark1 || !remark2 || !route) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const data = qs.stringify({
      customer_mobile,
      user_token,
      amount,
      order_id,
      redirect_url,
      remark1,
      remark2,
      route
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://instantdum.com/api/create-order',
      headers: { 
        'Host': 'instantdum.com', 
        'Origin': 'https://instantdum.com', 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    console.error('Error:', error.message, error.response?.data || error.stack);
    return NextResponse.json({ error: 'An error occurred while creating the order.' }, { status: 500 });
  }
};

export const OPTIONS = async () => {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};