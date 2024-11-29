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

      ### Details:  
      1. **Difficulty**: Tailor the questions based on the semester level (easy for early semesters, moderate to challenging for later semesters).  
      2. **Relevance**: Ensure all questions align with the interest (${interest}) and semester curriculum.  
      3. **Diversity**: Include a mix of conceptual, practical, and application-based questions.  
      4. **Output Format**: Return questions in JSON format with fields:  
         - \`question\`: The question text.  
         - \`options\`: An array of four choices (strings).  
         - \`correct_answer\`: The correct answer (string).  

      ### Example Topics by Interest:  
      - **Web Development**: HTML, CSS, JavaScript, frameworks (React, Angular), APIs.  
      - **Data Analytics**: Python, R, statistics, visualization tools (Tableau, Power BI), databases (SQL).  
      - **AI and ML**: Algorithms, Python libraries (TensorFlow, scikit-learn), neural networks.  
      - **Cybersecurity**: Cryptography, network protocols, ethical hacking, firewalls.  
      - **Software Engineering**: SDLC, Agile, UML diagrams, programming concepts.  

      Generate unique questions each time with no repetitions.
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


 