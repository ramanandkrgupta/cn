import { NextResponse } from 'next/server';
import axios from 'axios';
import https from 'https';
import qs from 'qs';



export async function POST(req) {
  const { customer_mobile, user_token, amount, order_id, redirect_url, remark1, remark2, route } = req.body;

  if (!customer_mobile || !user_token || !amount || !order_id || !redirect_url || !remark1 || !remark2 || !route) {
    return res.status(400).send('Missing required parameters.');
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
    res.json(response.data);
  } catch (error) {
    console.error(error.message, error.stack);
    res.status(500).send('An error occurred while creating the order');
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


