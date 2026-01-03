export interface Appointment {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  secretId: string; // User's secret identifier for managing appointments
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason?: string;
  count: number; // How many slots to block (default: all available)
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

export interface SlotConfig {
  dayOfWeek: number;
  slotsPerTime: number;
}
