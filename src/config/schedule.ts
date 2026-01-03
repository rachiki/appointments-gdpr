import { OpeningHours, SlotConfig } from '@/types';
import { Language } from '@/i18n/translations';

// Default slot duration in minutes
export const SLOT_DURATION = 30;

// Default number of available spots per time slot
export const DEFAULT_SLOTS_PER_TIME = 10;

// Employee password (in production, use environment variables)
export const EMPLOYEE_PASSWORD = 'admin123pc';

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

// Default slots per day
export const DEFAULT_SLOT_CONFIG: SlotConfig[] = [
  { dayOfWeek: 0, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 1, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 2, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 3, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 4, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 5, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
  { dayOfWeek: 6, slotsPerTime: DEFAULT_SLOTS_PER_TIME },
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
export function getDayName(dayOfWeek: number, language: Language = 'de'): string {
  const days = {
    en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    de: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  };
  return days[language][dayOfWeek];
}

// Parse date string to local Date (avoids timezone issues)
export function parseLocalDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Format date for display
export function formatDate(dateString: string, language: Language = 'de'): string {
  const date = parseLocalDate(dateString);
  const locale = language === 'de' ? 'de-DE' : 'en-US';
  return date.toLocaleDateString(locale, {
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
