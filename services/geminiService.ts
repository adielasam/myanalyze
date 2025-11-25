import { GoogleGenAI } from "@google/genai";
import { 
  GEMINI_MODEL, 
  RESPONSE_SCHEMA, 
  SYSTEM_INSTRUCTION, 
  CHANNEL_ANALYSIS_SCHEMA, 
  CHANNEL_SYSTEM_INSTRUCTION,
  NNES_FOLKTALES_EXAMPLES
} from "../constants";
import { OptimizationResult, ChannelAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (
  title: string,
  imageBase64: string | null
): Promise<OptimizationResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const parts: any[] = [];

  if (imageBase64) {
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    parts.push({
      inlineData: {
        mimeType: "image/png",
        data: base64Data
      }
    });
  }

  parts.push({
    text: `Analyze this YouTube video concept. 
    Title: "${title || '(No title provided)'}". 
    ${imageBase64 ? "Thumbnail: (Attached Image)." : "Thumbnail: (No thumbnail provided)."}
    
    Provide actionable SEO and CTR advice specifically for an African Folktales or Storytelling channel.`
  });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as OptimizationResult;
    } else {
      throw new Error("No data returned from Gemini.");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const analyzeChannel = async (channelName: string): Promise<ChannelAnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [{ 
          text: `Analyze the channel "${channelName}". 
          
          Use these proven viral templates as a benchmark for your "What to Create Next" suggestions:
          ${NNES_FOLKTALES_EXAMPLES}
          
          Identify their winning formula, most rewatched segments, and suggest 3 high-viral-potential ideas.` 
        }]
      },
      config: {
        systemInstruction: CHANNEL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: CHANNEL_ANALYSIS_SCHEMA
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ChannelAnalysisResult;
    } else {
      throw new Error("No data returned from Gemini.");
    }
  } catch (error) {
    console.error("Channel Analysis Error:", error);
    throw error;
  }
};