import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import qs from 'qs';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  minVersion: 'TLSv1.2'
});

export async function POST(req) {
  const body = await req.json();
  const data = qs.stringify({
    customer_mobile: body.customer_mobile,
    user_token: body.user_token,
    amount: body.amount,
    order_id: body.order_id,
    redirect_url: body.redirect_url,
    remark1: body.remark1,
    remark2: body.remark2,
    route: body.route
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
    httpsAgent: httpsAgent,
    data: data
  };

  try {
    const response = await axios.request(config);

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error processing the request:', {
      message: error.message,
      stack: error.stack,
      config: error.config,
      response: error.response ? error.response.data : null,
    });

    return new NextResponse(JSON.stringify({ error: 'An error occurred', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}