import { GoogleGenAI, Type } from "@google/genai";
import { DayScenario, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const solveMathPrompt = async (prompt: string): Promise<string> => {
  try {
    const model = "gemini-2.5-flash";
    
    const systemInstruction = `
      You are MagicCalc, an intelligent math assistant.
      
      Rules:
      1. If the user asks for a calculation (e.g., "sq root of 144", "500 yen in usd"), provide the result directly and concisely.
      2. If the result is a number, just output the number or the number with unit (e.g., "12" or "$3.30").
      3. If the query implies a complex explanation, keep it brief (max 2 sentences) followed by the result.
      4. Do not use markdown formatting like bold or italics if it's just a simple number.
      5. Handle unit conversions, currency conversions (assume recent rates), and complex arithmetic.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Error: No response";
  } catch (error) {
    console.error("AI Error:", error);
    return "Sorry, I couldn't calculate that right now.";
  }
};

export const generateMorningScenarios = async (energy: number, backlog: string[]): Promise<DayScenario[]> => {
  try {
    const model = "gemini-2.5-flash";

    const prompt = `
      User Energy Level: ${energy}%
      Backlog: ${backlog.join(', ')}

      Generate 3 distinct daily schedule scenarios (e.g., "High Performance", "Balanced Flow", "Recovery Mode").
      Optimize the schedule based on the energy level.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              focus: { type: Type.STRING },
              description: { type: Type.STRING },
              predictedEnergyEnd: { type: Type.NUMBER },
              tasks: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    durationMinutes: { type: Type.NUMBER },
                    energyType: { 
                        type: Type.STRING, 
                        enum: ["MENTAL", "PHYSICAL", "EMOTIONAL"] 
                    },
                    context: { type: Type.STRING },
                    startTime: { type: Type.STRING }
                  },
                  required: ['title', 'durationMinutes', 'energyType', 'context', 'startTime']
                }
              }
            },
            required: ['id', 'name', 'focus', 'description', 'predictedEnergyEnd', 'tasks']
          }
        }
      }
    });

    const scenarios = JSON.parse(response.text || "[]");

    // Hydrate with local application state defaults (like TaskStatus)
    return scenarios.map((s: any) => ({
        ...s,
        tasks: s.tasks.map((t: any, idx: number) => ({
            ...t,
            id: `${s.id}-task-${idx}`,
            status: TaskStatus.PENDING
        }))
    }));

  } catch (error) {
    console.error("Gemini Schedule Error:", error);
    return [];
  }
};