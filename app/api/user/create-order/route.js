import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export const POST = async (req) => {
  try {
const user_token = 'bd53cb790ccc318001ab4dd05f68e767';
    const { customer_mobile, amount, order_id, redirect_url, remark1, remark2, route } = await req.json();

    if (!customer_mobile || !amount || !order_id || !redirect_url || !remark1 || !remark2 || !route) {
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
      url: 'https://betacollegenotes.tech/api/create-order',
      headers: { 
        
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