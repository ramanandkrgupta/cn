import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

export const GET = async (req) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const history = await prisma.paymentHistory.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(history, { status: 200 });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 });
    }
};
