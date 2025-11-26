export type DeadlineType = 'hearing' | 'filing' | 'limitation' | 'meeting';

export interface Deadline {
  id: string;
  caseTitle: string; // عنوان القضية
  caseNumber: string; // رقم القضية
  targetDate: number; // Timestamp in millis
  type: DeadlineType; // New: Type of deadline
  assignedTo?: string; // New: Responsible person
  alertOffsets?: number[]; // New: Array of minutes before deadline to alert
  notes?: string;
  createdAt: number;
}

export interface DeadlineFormData {
  caseTitle: string;
  caseNumber: string;
  targetDate: string; // ISO string from input
  targetTime: string; // HH:mm string from input
  type: DeadlineType;
  assignedTo: string;
  alertOffsets: number[];
}

// Standardized Date units for Arabic display
export interface TimeComponents {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
}