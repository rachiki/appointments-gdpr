'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Appointment, BlockedSlot, TimeSlot } from '@/types';
import { DEFAULT_OPENING_HOURS, SLOTS_PER_TIME, generateTimeSlots } from '@/config/schedule';

const STORAGE_KEYS = {
  APPOINTMENTS: 'terminvergabe_appointments',
  BLOCKED_SLOTS: 'terminvergabe_blocked_slots',
};

interface AppContextType {
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  slotsPerTime: number;
  isLoaded: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  cancelAppointment: (id: string) => void;
  blockSlot: (date: string, time: string, reason?: string) => void;
  unblockSlot: (id: string) => void;
  getAvailableSlots: (date: string) => TimeSlot[];
  getAppointmentsForDate: (date: string) => Appointment[];
  isDateOpen: (date: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Generate a unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate a booking confirmation code
function generateConfirmationCode(): string {
  return `TV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
}

// Safe localStorage helpers
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or disabled
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const slotsPerTime = SLOTS_PER_TIME;

  // Load from localStorage on mount
  useEffect(() => {
    const storedAppointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const storedBlockedSlots = loadFromStorage<BlockedSlot[]>(STORAGE_KEYS.BLOCKED_SLOTS, []);
    
    setAppointments(storedAppointments);
    setBlockedSlots(storedBlockedSlots);
    setIsLoaded(true);
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
    }
  }, [appointments, isLoaded]);

  // Save blocked slots to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.BLOCKED_SLOTS, blockedSlots);
    }
  }, [blockedSlots, isLoaded]);

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateConfirmationCode(),
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    return newAppointment;
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  }, []);

  const blockSlot = useCallback((date: string, time: string, reason?: string) => {
    const newBlockedSlot: BlockedSlot = {
      id: generateId(),
      date,
      time,
      reason,
    };
    setBlockedSlots(prev => [...prev, newBlockedSlot]);
  }, []);

  const unblockSlot = useCallback((id: string) => {
    setBlockedSlots(prev => prev.filter(slot => slot.id !== id));
  }, []);

  const isDateOpen = useCallback((dateString: string): boolean => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const openingHours = DEFAULT_OPENING_HOURS.find(oh => oh.dayOfWeek === dayOfWeek);
    return openingHours?.isOpen ?? false;
  }, []);

  const getAvailableSlots = useCallback((dateString: string): TimeSlot[] => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const openingHours = DEFAULT_OPENING_HOURS.find(oh => oh.dayOfWeek === dayOfWeek);

    if (!openingHours || !openingHours.isOpen) {
      return [];
    }

    const timeStrings = generateTimeSlots(openingHours);
    const dateAppointments = appointments.filter(apt => apt.date === dateString);
    const dateBlockedSlots = blockedSlots.filter(slot => slot.date === dateString);

    return timeStrings.map(time => {
      const bookedCount = dateAppointments.filter(apt => apt.time === time).length;
      const isBlocked = dateBlockedSlots.some(slot => slot.time === time);

      return {
        time,
        available: isBlocked ? 0 : Math.max(0, slotsPerTime - bookedCount),
        booked: bookedCount,
        blocked: isBlocked,
      };
    });
  }, [appointments, blockedSlots, slotsPerTime]);

  const getAppointmentsForDate = useCallback((date: string): Appointment[] => {
    return appointments.filter(apt => apt.date === date).sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments]);

  return (
    <AppContext.Provider
      value={{
        appointments,
        blockedSlots,
        slotsPerTime,
        isLoaded,
        addAppointment,
        cancelAppointment,
        blockSlot,
        unblockSlot,
        getAvailableSlots,
        getAppointmentsForDate,
        isDateOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
