import { uploadAvatar } from '@/libs/cloudinary';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response('No file provided', { status: 400 });
    }

    // Upload to Cloudinary
    const avatarUrl = await uploadAvatar(file, session.user.id);

    // Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: avatarUrl }
    });

    return new Response(JSON.stringify({ avatarUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new Response('Error uploading avatar', { status: 500 });
  }
} 