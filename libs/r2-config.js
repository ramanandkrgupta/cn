import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID) {
  throw new Error('CLOUDFLARE_ACCOUNT_ID is not defined');
}

if (!process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY) {
  throw new Error('R2 credentials are not defined');
}

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY,
  },
});