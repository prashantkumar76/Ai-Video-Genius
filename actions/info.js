"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("Gemini API Key loaded:", !!process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function getInfo(link_or_video,selectedLanguage = "english") {
    
    
console.log(selectedLanguage)

const promptLanguageNote = selectedLanguage === "english"
    ? ""
    : `Respond in ${selectedLanguage}.`;


    const textPart  ={
    
   text : `You are an AI assistant skilled at breaking down complex videos into easy-to-follow steps.

The user will either upload a video or provide a video link. Your task is to:

1. Analyze the content of the provided video or link.
2. Identify and summarize the main topic.
3. Break it down into clear, easy-to-understand steps.
4. Use beginner-friendly language to explain each step.
5.The AI gives answers using visually attractive emojis/logos (like 🧠, 📘, ➤, 💡, etc.) 
6. Add helpful tips or short explanations wherever necessary.
 7.You are a multilingual AI assistant. You MUST respond in ${promptLanguageNote} language only

 ${promptLanguageNote}

Make sure the output is simple enough for someone with no prior knowledge to follow.
`
}


const videoPart = {
        fileData: {
            mime_type: "video/mp4", // Use a common video MIME type. The API will handle the YouTube URL.
            file_uri: link_or_video      // This MUST be a valid YouTube URL (e.g., https://www.youtube.com/watch?v=...)
        }
    };
try {
    const result = await model.generateContent([textPart, videoPart]);
     const content = result.response.text().trim();
    return content;

    
} catch (error) {
    console.error("Error generating summary:", error.message);
    throw new Error("Failed to generate summary");
}

}

