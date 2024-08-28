import prisma from "@/libs/prisma";

export async function GET(req) {
  try {
    const allSubject = await prisma.subject.findMany();
    return new Response(JSON.stringify(allSubject), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500,
    });
  }
}

export async function POST(req) {
  const { courseName, userSemester, subjectCode, subjectName, userEmail } = await req.json();

  try {
    const user = await prisma.user.findFirst({
      where: { email: userEmail },
    });

    const existingSubject = await prisma.subject.findFirst({
      where: { subject_code: subjectCode },
    });

    if (existingSubject) {
      return new Response("This subject already exists", {
        status: 200,
        statusText: "FAILED",
      });
    }

    const newSubject = await prisma.subject.create({
      data: {
        userId: user.id,
        course_name: courseName,
        semester_code: userSemester,
        subject_code: subjectCode.trim().toUpperCase(),
        subject_name: subjectName.trim(),
      },
    });

    return new Response(JSON.stringify(newSubject), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await prisma.subject.delete({
      where: { id: id },
    });

    return new Response("Request processed successfully", {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const { id, subject_name, course_name, semester_code, subject_code } = await req.json();

  try {
    const updatedSubject = await prisma.subject.update({
      where: { id },
      data: {
        subject_name,
        course_name,
        semester_code,
        subject_code,
      },
    });

    return new Response(JSON.stringify(updatedSubject), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    return new Response("An error occurred", {
      status: 500,
    });
  }
}
