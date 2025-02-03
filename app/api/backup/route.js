import { PrismaClient } from '@prisma/client';
import { Upload } from '@aws-sdk/lib-storage';
import { S3Client } from '@aws-sdk/client-s3';
import archiver from 'archiver';

export default async function handler(req, res) {
  // Security check
  if (req.headers.authorization !== `Bearer ${process.env.BACKUP_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Initialize clients
    const prisma = new PrismaClient();
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    // Create archive stream
    const archive = archiver('tar', { gzip: true });
    const uploadPromise = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `backups/prisma-${Date.now()}.tar.gz`,
        Body: archive,
      },
    }).done();

    // Get all tables from Prisma schema
    const models = Object.keys(prisma);

    // Add table data to archive
    for (const model of models) {
      if (model.startsWith('_') || typeof prisma[model].findMany !== 'function') continue;

      const data = await prisma[model].findMany();
      archive.append(JSON.stringify(data, null, 2), { name: `${model}.json` });
    }

    // Finalize and upload
    archive.finalize();
    await uploadPromise;
    await prisma.$disconnect();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Backup failed:', error);
    return res.status(500).json({ error: 'Backup failed' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
