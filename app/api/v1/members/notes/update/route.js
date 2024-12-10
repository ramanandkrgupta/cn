import prisma from "@/libs/prisma";

export async function PUT(req) {
    const { id, title, description, category, course_name, semester_code, subject_code, subject_name, file_url, file_name } = await req.json();

    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title,
                description,
                category,
                course_name,
                semester_code,
                subject_code,
                subject_name,
                file_url,
                file_name,
            },
        });

        return new Response(JSON.stringify(updatedPost), {
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
