import { NextResponse } from 'next/server';
import axios from 'axios';
import qs from 'qs';

export const POST = async (req) => {
  try {
const user_token = '271efbf1b89e030bfbc30fb05ebd6af9'
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
      url: 'https://pay.collegenotes.tech/api/create-order',
      headers: { 
        'Host': 'pay.collegenotes.tech', 
        'Origin': 'https://pay.collegenotes.tech', 
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    const response = await axios.request(config);
    return NextResponse.json(response.data, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 402 });

    return NextResponse.json({ error: 'An error occurred while creating the order.' }, { status: 500 });
  }
};