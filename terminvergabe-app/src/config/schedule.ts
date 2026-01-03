import { OpeningHours } from '@/types';

// Default slot duration in minutes
export const SLOT_DURATION = 30;

// Number of available spots per time slot
export const SLOTS_PER_TIME = 10;

// Default opening hours (can be modified later)
export const DEFAULT_OPENING_HOURS: OpeningHours[] = [
  { dayOfWeek: 0, isOpen: false }, // Sunday
  { dayOfWeek: 1, isOpen: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '16:00' }, // Monday
  { dayOfWeek: 2, isOpen: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '16:00' }, // Tuesday
  { dayOfWeek: 3, isOpen: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '16:00' }, // Wednesday
  { dayOfWeek: 4, isOpen: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '16:00' }, // Thursday
  { dayOfWeek: 5, isOpen: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '13:00', afternoonEnd: '14:00' }, // Friday (shorter)
  { dayOfWeek: 6, isOpen: false }, // Saturday
];

// Generate time slots for a given day
export function generateTimeSlots(openingHours: OpeningHours): string[] {
  if (!openingHours.isOpen) return [];

  const slots: string[] = [];

  const addSlots = (start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      slots.push(`${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`);
      currentMin += SLOT_DURATION;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin = currentMin % 60;
      }
    }
  };

  if (openingHours.morningStart && openingHours.morningEnd) {
    addSlots(openingHours.morningStart, openingHours.morningEnd);
  }
  if (openingHours.afternoonStart && openingHours.afternoonEnd) {
    addSlots(openingHours.afternoonStart, openingHours.afternoonEnd);
  }

  return slots;
}

// Get day name
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeek];
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get dates for the next N days
export function getNextDays(count: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 1; i <= count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

