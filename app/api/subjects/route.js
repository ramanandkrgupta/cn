import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const course = searchParams.get('course');
    const semester = searchParams.get('semester');

    if (!course || !semester) {
      return NextResponse.json(
        { error: "Course and semester are required" },
        { status: 400 }
      );
    }

    console.log('Fetching subjects for:', { course, semester }); // Debug log

    const subjects = await prisma.subject.findMany({
      where: {
        course_name: course,
        semester_code: semester
      },
      select: {
        id: true,
        subject_name: true,
        subject_code: true
      }
    });

    console.log('Found subjects:', subjects); // Debug log

    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Error fetching subjects" },
      { status: 500 }
    );
  }
} 