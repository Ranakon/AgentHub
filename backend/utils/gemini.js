import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize the Client
// Note: It automatically looks for GEMINI_API_KEY or GOOGLE_API_KEY in process.env
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({
  apiKey:process.env.GEMINI_API_KEY,
});

export const callGemini = async (input) => {
  // API key validation
  if (!apiKey) {
    throw new Error("Gemini API key is not set. Set GEMINI_API_KEY or GOOGLE_API_KEY in .env.");
  }

  // Input validation
  if (!input || typeof input !== "string" || input.trim() === "") {
    throw new Error("Input provided to Gemini must be a non-empty string.");
  }

  try {
    // In the new SDK, you call methods via the 'models' property on the client
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Use the latest 2.0 models for best results
      contents: input,
    });

    // The response object has a direct .text property (it's no longer a method call)
    return response.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to get response from Gemini");
  }
};