import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import bcrypt from "bcrypt";

export async function GET(req) {
  try {
    // Check for admin role
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
          ]
        } : {},
        role !== 'all' ? { userRole: role } : {}
      ]
    };

    // Determine sort order
    let orderBy;
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'most-posts':
        orderBy = { posts: { _count: 'desc' } };
        break;
      case 'most-downloads':
        orderBy = { downloads: { _count: 'desc' } };
        break;
      case 'reputation':
        orderBy = { reputationScore: 'desc' };
        break;
      default: // 'newest'
        orderBy = { createdAt: 'desc' };
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          userRole: true,
          createdAt: true,
          _count: {
            select: {
              posts: true,
              downloads: true
            }
          }
        },
        orderBy: orderBy,
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({
      error: "Error fetching users",
      details: error.message
    }, { status: 500 });
  }
}

// Update user role
export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { userRole: role },
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({
      error: "Error updating user",
      details: error.message
    }, { status: 500 });
  }
}

// Delete user
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({
      error: "Error deleting user",
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role } = await req.json();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        userRole: role,
        phoneNumber: "", // Default or handle as needed
        isEmailVerified: false,
        isMobileVerified: false,
      }
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Error adding user", details: error.message }, { status: 500 });
  }
} 