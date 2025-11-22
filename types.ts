export enum EnergyType {
  MENTAL = 'Mental',
  PHYSICAL = 'Physical',
  EMOTIONAL = 'Emotional'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  energyCost: number; // 1-10
  energyType: EnergyType;
  status: TaskStatus;
  context: string; // e.g., "Deep Work", "Errands", "Home"
  startTime?: string; // ISO string if scheduled
  completedAt?: string;
}

export interface DayScenario {
  id: string;
  name: string;
  description: string;
  focus: string; // "High Output", "Balanced", "Recovery"
  tasks: Task[];
  predictedEnergyEnd: number;
}

export interface UserState {
  energyLevel: number; // 0-100
  currentView: 'HORIZON' | 'PULSE' | 'FLOW' | 'REWIND' | 'FORGE';
  tasks: Task[];
  activeTaskId: string | null;
}
