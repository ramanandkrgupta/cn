import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

// Middleware to parse the request body
export const runtime = 'nodejs';

export const POST = async (req) => {
  const { customer_mobile, user_token, amount, order_id, redirect_url, remark1, remark2, route } = await req.json();

  if (!customer_mobile || !user_token || !amount || !order_id || !redirect_url || !remark1 || !remark2 || !route) {
    return new NextResponse('Missing required parameters.', { status: 400 });
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
      'host': 'instantdum.com', 
      'Origin': 'https://instantdum.com', 
      'Access-Control-Allow-Origin': '*/*', 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error(error.message, error.stack);
    return new NextResponse('An error occurred while creating the order', { status: 500 });
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