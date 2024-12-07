import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phoneNumber, password } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = `https://ui-avatars.com/api/?name=${name}&background=random`;

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatar,
        phoneNumber,
        password: hashedPassword,
        userRole: "FREE",
        isEmailVerified: false
      }
    });

    return NextResponse.json(
      { message: "User registered successfully", user: { id: user.id, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error creating user", details: error.message },
      { status: 500 }
    );
  }
}