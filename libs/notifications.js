import prisma from "@/libs/prisma";

export async function createNotification(userId, type, message) {
  try {
    await prisma.notification.create({
      data: {
        userId,
        type,
        message,
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
} 