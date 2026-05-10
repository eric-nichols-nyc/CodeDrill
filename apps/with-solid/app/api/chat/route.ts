import { GoogleGenerativeAI } from "@google/generative-ai";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    // Check for API key (supports both GEMINI_API_KEY and GOOGLE_GENERATIVE_AI_API_KEY)
    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY is not configured",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a helpful assistant specializing in SOLID principles and React/TypeScript development.
You are helping a user understand SOLID principles through interactive examples.

${
  context
    ? `Current Context:
${context}

`
    : ""
}Please provide clear, concise, and helpful answers about SOLID principles and the code examples shown.
Focus on explaining concepts in a way that helps developers understand and apply these principles.`;

    const prompt = `${systemPrompt}\n\nUser question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
