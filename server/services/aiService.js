import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL = "gemini-3.1-flash-lite";

export async function generateRoadmap(subjectName, chapterName) {
  const prompt = `
You are an expert university professor.

Generate a study roadmap.

Subject:
${subjectName}

Chapter:
${chapterName}

Requirements:

1. Generate all important topics in learning order.
2. Recommend 3-5 trusted learning resources.
3. Return ONLY valid JSON.
4. Do not include markdown.
5. Do not explain anything.

Format:

{
  "topics":[
    {
      "title":"..."
    }
  ],
  "resources":[
    {
      "title":"...",
      "url":"..."
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });

  let text = response.text;

  // Remove markdown code fences if Gemini adds them
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
}
