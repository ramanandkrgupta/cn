// Import necessary packages
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const interest = searchParams.get('interest');
  const semester = searchParams.get('semester');

  // Create the prompt
  const prompt = `
    Create a quiz with 5 multiple-choice questions for a student interested in ${interest}, currently in semester ${semester}.
    Each question should be challenging yet relevant. Return the questions in JSON format with fields: question, options (an array), and correct_answer.
  `;

  try {
    const result = await model.generateContent(prompt);

    // Strip any unwanted characters and markdown formatting from the response
    const rawResponse = result.response.text();
    const cleanResponse = rawResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse the cleaned response to JSON
    const questions = JSON.parse(cleanResponse);

    return new Response(JSON.stringify({ questions }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({ error: "Failed to generate quiz", details: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}