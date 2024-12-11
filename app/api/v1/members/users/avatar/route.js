import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/libs/prisma';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function for Cloudinary upload
async function uploadToCloudinary(file, userId) {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `notes-mates/avatars/${userId}`,
                public_id: `avatar_${Date.now()}`,
                transformation: [
                    { width: 400, height: 400, crop: 'fill' },
                    { quality: 'auto' }
                ],
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file, session.user.id);

        // Update user in database
        await prisma.user.update({
            where: { id: session.user.id },
            data: { avatar: result.secure_url }
        });

        return NextResponse.json({ 
            avatarUrl: result.secure_url,
            message: 'Avatar updated successfully'
        });

    } catch (error) {
        console.error('Avatar upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload avatar' },
            { status: 500 }
        );
    }
} 