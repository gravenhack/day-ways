export type Operator = '/' | '*' | '-' | '+' | '=' | null;

export interface CalculatorState {
  displayValue: string;
  previousValue: string | null;
  operator: Operator;
  waitingForOperand: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export type ViewMode = 'STANDARD' | 'MAGIC';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum EnergyType {
  MENTAL = 'MENTAL',
  PHYSICAL = 'PHYSICAL',
  EMOTIONAL = 'EMOTIONAL'
}

export interface Task {
  id: string;
  title: string;
  durationMinutes: number;
  context: string;
  energyType: EnergyType;
  status: TaskStatus;
  startTime?: string;
}

export interface DayScenario {
  id: string;
  name: string;
  focus: string;
  description: string;
  predictedEnergyEnd: number;
  tasks: Task[];
}

export interface UserState {
  energyLevel: number;
}