import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payments = await prisma.paymentHistory.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        userRole: true
                    }
                }
            }
        });

        return NextResponse.json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json({
            error: "Error fetching payments",
            details: error.message
        }, { status: 500 });
    }
} 
