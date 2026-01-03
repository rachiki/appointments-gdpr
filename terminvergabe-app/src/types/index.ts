export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason?: string;
}

export interface TimeSlot {
  time: string; // HH:MM
  available: number;
  booked: number;
  blocked: boolean;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  isOpen: boolean;
  slots: TimeSlot[];
}

export interface OpeningHours {
  dayOfWeek: number;
  isOpen: boolean;
  morningStart?: string;
  morningEnd?: string;
  afternoonStart?: string;
  afternoonEnd?: string;
}

 