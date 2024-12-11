require('dotenv').config();

console.log('Environment Check:', {
  ADMIN_API_KEY: {
    present: !!process.env.ADMIN_API_KEY,
    length: process.env.ADMIN_API_KEY?.length,
    value: process.env.ADMIN_API_KEY?.substring(0, 10) + '...'
  },
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL
}); 