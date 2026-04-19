/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

let cachedDynamicKey: string | null = null;
let lastFetchTime = 0;
let debugMasked = "";

export const getApiKey = async (forceRefresh = false) => {
  const now = Date.now();
  if (!cachedDynamicKey || forceRefresh || (now - lastFetchTime > 30000)) {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        cachedDynamicKey = data.GEMINI_API_KEY?.trim() || "";
        debugMasked = data.MASKED || "NONE";
        lastFetchTime = now;
      }
    } catch (e) {
      // Silent in production
    }
  }

  return cachedDynamicKey || "";
};

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
let currentAiKey: string | null = null;
const getAI = async () => {
  const key = await getApiKey();
  if (!aiInstance || currentAiKey !== key) {
    aiInstance = new GoogleGenAI({ apiKey: key });
    currentAiKey = key;
  }
  return aiInstance;
};

const logToFirestore = async (logData: any) => {
  try {
    const { db } = await import('../lib/firebase');
    const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
    await addDoc(collection(db, 'debug_logs'), {
      ...logData,
      timestamp: serverTimestamp(),
      v: 'v14'
    });
  } catch (e) {
    // Silent fail
  }
};

export const getDebugKeyInfo = async (force = false) => {
  const key = await getApiKey(force);
  return {
    length: key.length,
    masked: debugMasked,
    version: 'v14'
  };
};

export const generateGameContent = async (domain: string, gameType: string, customInput: string, schema: any, language: string = 'he') => {
  const logId = crypto.randomUUID();
  const apiKey = await getApiKey();
  
  if (!apiKey) {
    const err = "GEMINI_API_KEY is not defined. Please check your settings.";
    await logToFirestore({ logId, type: 'error', gameType, domain, customInput, error: err });
    throw new Error(err);
  }

  const ai = await getAI();
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert educational content creator for LearnPlay.
    Your task is to generate high-quality learning content for a ${gameType} game in the domain of ${domain}.
    
    CRITICAL: The content MUST be generated in the language: ${language === 'he' ? 'Hebrew' : 'English'}.
    
    If the domain is "Language", ignore the provided schema (if simple) and ALWAYS generate a full "Lingo Pack" following the LanguageDatasetContent structure which includes:
    1. A Story (LIVE_STORY)
    2. Vocabulary Pairings (GLOSSARY) - including icons/emojis in prompts if applicable
    3. Sentence Builders (SENTENCE_BUILDER)
    4. Quizzes (TERMS and BOOLEAN)
    
    Ensure story paragraphs use vocabulary defined in the glossary.
    Ensure sentence builders focus on grammar like past simple sync if context allows.

    Return ONLY valid JSON that follows the provided schema.
  `;

  const prompt = `
    User Request: "${customInput}"
    Game Engine: ${gameType}
    Knowledge Domain: ${domain}
    
    Please generate data that fits this JSON structure:
    ${JSON.stringify(schema)}
    
    Generate at least 8 items.
  `;

  try {
    const modelName = "gemini-3-flash-preview";
    
    await logToFirestore({ 
      logId, 
      type: 'request', 
      gameType, 
      domain, 
      customInput, 
      prompt,
      systemInstruction,
      model: modelName 
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) {
      await logToFirestore({ logId, type: 'response_error', error: 'Empty response' });
      throw new Error("No response text from AI");
    }
    
    try {
      const parsed = JSON.parse(text);
      await logToFirestore({ logId, type: 'success', responseText: text, itemCount: Array.isArray(parsed) ? parsed.length : 1 });
      return parsed;
    } catch (parseError) {
      await logToFirestore({ logId, type: 'parse_error', responseText: text, error: String(parseError) });
      throw new Error("AI returned malformed JSON");
    }
  } catch (error: any) {
    await logToFirestore({ logId, type: 'critical_error', error: String(error) });
    throw new Error(`AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const refineIdeaChat = async (history: { role: 'user' | 'model', parts: { text: string }[] }[], domain: string) => {
  const systemInstruction = `You are a pedagogical advisor for LearnPlay. 
  The current domain is ${domain}. 
  Help the user define exactly what data they want to generate for their game. 
  Suggest domains, difficulty levels, and topics that work well for learning.
  Keep it brief and conversational.`;

  try {
    const ai = await getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: history,
      config: {
        systemInstruction,
      }
    });

    return response.text || "";
  } catch (error) {
    return "מצטער, חלה שגיאה בתקשורת עם ה-AI. בוא ננסה שוב.";
  }
};
