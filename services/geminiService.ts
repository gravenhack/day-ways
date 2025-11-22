import { GoogleGenAI, Type } from "@google/genai";
import { DayScenario, Task, EnergyType, TaskStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to generate mock IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateMorningScenarios = async (
  userEnergy: number,
  backlogTasks: string[]
): Promise<DayScenario[]> => {
  
  const model = "gemini-2.5-flash";
  
  const prompt = `
    You are the "Morning Architect", an advanced productivity AI.
    The user has an energy level of ${userEnergy}/100.
    Their backlog contains these loose tasks: ${backlogTasks.join(", ")}.
    
    Create 3 distinct day scenarios (schedules) for today.
    1. "High Performance": Aggressive scheduling, assumes high energy consumption.
    2. "Balanced Flow": Mixes deep work with breaks, optimized for circadian health.
    3. "Restorative Focus": Lighter load, prioritizing well-being while getting essentials done.
    
    Return a JSON object containing an array of 3 scenarios.
    Each task must have a predicted duration (minutes) and energy cost (1-10).
    Assign an appropriate EnergyType (Mental, Physical, Emotional) and Context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  predictedEnergyEnd: { type: Type.NUMBER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        energyCost: { type: Type.NUMBER },
                        energyType: { type: Type.STRING, enum: ["Mental", "Physical", "Emotional"] },
                        context: { type: Type.STRING },
                        startTime: { type: Type.STRING, description: "Local time HH:MM format" }
                      },
                      required: ["title", "durationMinutes", "energyCost", "energyType", "context"]
                    }
                  }
                },
                required: ["name", "description", "focus", "tasks"]
              }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    
    if (!json.scenarios) return [];

    // Map response to internal types with proper IDs
    return json.scenarios.map((s: any) => ({
      id: generateId(),
      name: s.name,
      description: s.description,
      focus: s.focus,
      predictedEnergyEnd: s.predictedEnergyEnd || 50,
      tasks: s.tasks.map((t: any) => ({
        id: generateId(),
        title: t.title,
        description: t.description || "",
        durationMinutes: t.durationMinutes,
        energyCost: t.energyCost,
        energyType: t.energyType as EnergyType,
        status: TaskStatus.PENDING,
        context: t.context,
        startTime: t.startTime // We will process this into a real date in the component
      }))
    }));

  } catch (error) {
    console.error("Gemini generation failed", error);
    // Fallback for demo if API fails or key missing
    return [
      {
        id: "fallback-1",
        name: "Offline Balanced Mode",
        description: "A generated fallback plan (API Error).",
        focus: "Balanced",
        predictedEnergyEnd: 60,
        tasks: backlogTasks.map((t, i) => ({
          id: generateId(),
          title: t,
          durationMinutes: 30,
          energyCost: 4,
          energyType: EnergyType.MENTAL,
          status: TaskStatus.PENDING,
          context: "General",
          startTime: `09:${i * 3}0`
        }))
      }
    ];
  }
};

export const suggestTaskCompletion = async (
    task: Task,
    actualDuration: number
): Promise<string> => {
    // Mock AI reflection for the "Rewind" or post-task
    return "Great job maintaining flow. You finished 5 minutes early. Suggest taking a micro-break.";
}
