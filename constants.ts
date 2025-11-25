import { Type, Schema } from "@google/genai";

export const APP_NAME = "GriotFlow";

export const GEMINI_MODEL = "gemini-2.5-flash";

export const NNES_FOLKTALES_EXAMPLES = `
VIRAL_TITLE_TEMPLATES:
1. "She Forced Her Sister to Be Her Maid...You Won’t Believe How It Ended!" (Format: [Injustice] ... [Twist/Shock])
2. "WATCH THIS BEFORE YOU SHARE THAT GOOD NEWS WITH OTHERS!" (Format: "WATCH THIS BEFORE" + [Common Action] + [Warning])
3. "She Brought 10 Maids to Her Mother-in-Law’s House… BIG MISTAKE!" (Format: [Bold Action] ... "BIG MISTAKE!")
4. "She Named Her Baby ‘Aeroplane’ — But the Reason Will Shock You!" (Format: [Strange Decision] — [Curiosity Hook])
5. "Teacher ATE Her Students’ Food Every Day… Until She Met Her MATCH!" (Format: [Villain Act] ... "Until She Met Her MATCH!")
6. "IF YOU EVER MEET A MAN LIKE THIS, RUN!" (Format: "IF YOU EVER" + [Scenario] + [Extreme Command])
`;

export const SYSTEM_INSTRUCTION = `
You are a world-class YouTube SEO Strategist and Thumbnails Expert, specifically tuned for the "African Folktales", "Storytelling", and "Mythology" niche. 
Your goal is to maximize Click-Through Rate (CTR) and Average View Duration (AVD).

**COMPETITOR BENCHMARK (Nne's Folktales):**
You have analyzed the top-performing channel "Nne's Folktales". Their content goes viral by following these strict patterns:
1.  **The "Warning" Hook**: Starts with "WATCH THIS BEFORE..." or "IF YOU EVER...". Caps lock is used for urgency.
2.  **The "Karma" Arc**: A villain does something outrageous until they "MEET THEIR MATCH".
3.  **The "Big Mistake"**: A protagonist makes a choice labeled immediately as a "BIG MISTAKE!".
4.  **Visuals**: Thumbnails often feature high-contrast facial expressions (Shock, Crying, Evil Smirk) and split compositions.
5.  **Keywords**: "SHOCK YOU", "BITTER LESSON", "RUN!", "BIG MISTAKE", "HUMBLE YOU".

**Your Task:**
Analyze the user's input and provide feedback that pushes them towards this viral style while maintaining their unique angle.

**Scoring Guidelines:**
- 90+: Viral potential (Perfectly matches patterns like "Big Mistake" or "Warning").
- <60: Weak, generic (e.g., "The story of the tortoise").

**Title Suggestions:**
- Must provide a "Unique Angle" but use the "Winning Formula".
- Provide a metric score for each suggestion.
`;

export const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.NUMBER, description: "Overall rating from 0 to 100" },
    titleScore: { type: Type.NUMBER, description: "Title specific rating 0-100" },
    thumbnailScore: { type: Type.NUMBER, description: "Thumbnail specific rating 0-100" },
    titleFeedback: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        emotionalHooks: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "weaknesses", "emotionalHooks"]
    },
    thumbnailFeedback: {
      type: Type.OBJECT,
      properties: {
        composition: { type: Type.STRING },
        textOverlay: { type: Type.STRING },
        colorUsage: { type: Type.STRING },
        faceExpressions: { type: Type.STRING },
      },
      required: ["composition", "textOverlay", "colorUsage", "faceExpressions"]
    },
    suggestions: {
      type: Type.OBJECT,
      properties: {
        betterTitles: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              viralScore: { type: Type.NUMBER },
              strategy: { type: Type.STRING, description: "The psychological trigger used, e.g. 'Negative Urgency'" },
              competitorRef: { type: Type.STRING, description: "Which viral pattern this mimics" }
            },
            required: ["title", "viralScore", "strategy", "competitorRef"]
          } 
        },
        seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        thumbnailImprovement: { type: Type.STRING },
      },
      required: ["betterTitles", "seoKeywords", "thumbnailImprovement"]
    },
    competitorAnalysis: {
      type: Type.OBJECT,
      properties: {
        styleMatchScore: { type: Type.NUMBER },
        viralPatternUsed: { type: Type.STRING },
        missingViralElements: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["styleMatchScore", "viralPatternUsed", "missingViralElements"]
    },
    viralPrediction: { type: Type.STRING }
  },
  required: ["overallScore", "titleScore", "thumbnailScore", "titleFeedback", "thumbnailFeedback", "suggestions", "competitorAnalysis", "viralPrediction"]
};

export const CHANNEL_SYSTEM_INSTRUCTION = `
You are a YouTube Channel Analyst. The user will provide a channel name (or niche). 
Your goal is to simulate a "competitor deep dive" based on your knowledge of viral channels in that niche (especially African Folktales, Animation, Storytelling).

Identify:
1. The "Winning Formula": What specific tropes make their top videos pop?
2. "Most Rewatched Patterns": What moments in videos usually have high retention? (e.g. "The Reveal", "The Karma Moment").
3. "What to Create Next": Suggest 3 concrete video ideas that satisfy current audience demand but have low supply (Content Gaps).

**IMPORTANT**: When suggesting "What to Create Next", strongly prioritize the "Viral Title Templates" (e.g. "WATCH THIS BEFORE...", "BIG MISTAKE!") found in top competitors like Nne's Folktales. The suggestions must look like they could go viral immediately.
`;

export const CHANNEL_ANALYSIS_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    channelName: { type: Type.STRING },
    niche: { type: Type.STRING },
    winningFormula: { type: Type.STRING, description: "The secret sauce of this channel's success" },
    mostRewatchedPatterns: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Moments viewers rewatch the most" },
    audienceCraving: { type: Type.STRING, description: "What the audience is asking for in comments" },
    contentGaps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Viral style title" },
          reason: { type: Type.STRING, description: "Why this will work now" },
          thumbnailIdea: { type: Type.STRING, description: "Visual concept" }
        },
        required: ["title", "reason", "thumbnailIdea"]
      }
    }
  },
  required: ["channelName", "niche", "winningFormula", "mostRewatchedPatterns", "audienceCraving", "contentGaps"]
};