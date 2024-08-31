import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';

const httpsAgent = new https.Agent({  
  rejectUnauthorized: false,
  minVersion: 'TLSv1.2'
});

export async function POST(req) {
  const body = await req.text();
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await axios.post('https://khilaadixpro.shop/api/create-order', body, { headers, httpsAgent });

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