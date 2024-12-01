// import prisma from "@/libs/prisma";

// export async function GET() {
//   try {
//     const result = await prisma.subject.updateMany({
//       where: { course_name: "btech" },
//       data: { course_name: "cse" },
//     });

//     return new Response(
//       JSON.stringify({
//         message: "Courses updated successfully",
//         updatedCount: result.count,
//       }),
//       {
//         status: 200,
//         headers: { "Content-Type": "application/json" },
//       }
//     );
//   } catch (error) {
//     console.error("Error processing the request:", error);
//     return new Response("An error occurred while updating courses", {
//       status: 500,
//     });
//   }
// }
