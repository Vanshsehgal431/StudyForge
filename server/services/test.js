import ai from "./aiService.js";

async function test() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "Say Hello",
  });
  console.log(response.text);
}

test();
