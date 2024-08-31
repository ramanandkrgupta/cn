import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req) {
  const body = await req.text();
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'khilaadixpro.shop'
  };

  try {
    const response = await axios.post('https://khilaadixpro.shop/api/create-order', body, { headers });

    return new NextResponse(JSON.stringify(response.data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error processing the request:', error);

    return new NextResponse(JSON.stringify({ error: 'An error occurred' }), {
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