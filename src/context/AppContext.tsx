'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Appointment, BlockedSlot, TimeSlot, SlotConfig } from '@/types';
import { DEFAULT_OPENING_HOURS, DEFAULT_SLOT_CONFIG, generateTimeSlots, EMPLOYEE_PASSWORD } from '@/config/schedule';

const STORAGE_KEYS = {
  APPOINTMENTS: 'terminvergabe_appointments',
  BLOCKED_SLOTS: 'terminvergabe_blocked_slots',
  SLOT_CONFIG: 'terminvergabe_slot_config',
  EMPLOYEE_LOGGED_IN: 'terminvergabe_employee_logged_in',
};

interface AppContextType {
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  slotConfig: SlotConfig[];
  isLoaded: boolean;
  isEmployeeLoggedIn: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  cancelAppointment: (id: string) => void;
  blockSlot: (date: string, time: string, reason?: string) => void;
  unblockSlot: (id: string) => void;
  getAvailableSlots: (date: string) => TimeSlot[];
  getAppointmentsForDate: (date: string) => Appointment[];
  getAppointmentsBySecretId: (secretId: string) => Appointment[];
  isDateOpen: (date: string) => boolean;
  employeeLogin: (password: string) => boolean;
  employeeLogout: () => void;
  updateSlotConfig: (dayOfWeek: number, slotsPerTime: number) => void;
  getSlotsPerTime: (dayOfWeek: number) => number;
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
  const [slotConfig, setSlotConfig] = useState<SlotConfig[]>(DEFAULT_SLOT_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const storedAppointments = loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, []);
    const storedBlockedSlots = loadFromStorage<BlockedSlot[]>(STORAGE_KEYS.BLOCKED_SLOTS, []);
    const storedSlotConfig = loadFromStorage<SlotConfig[]>(STORAGE_KEYS.SLOT_CONFIG, DEFAULT_SLOT_CONFIG);
    const storedEmployeeLoggedIn = loadFromStorage<boolean>(STORAGE_KEYS.EMPLOYEE_LOGGED_IN, false);
    
    setAppointments(storedAppointments);
    setBlockedSlots(storedBlockedSlots);
    setSlotConfig(storedSlotConfig);
    setIsEmployeeLoggedIn(storedEmployeeLoggedIn);
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

  // Save slot config to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.SLOT_CONFIG, slotConfig);
    }
  }, [slotConfig, isLoaded]);

  // Save employee login status
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(STORAGE_KEYS.EMPLOYEE_LOGGED_IN, isEmployeeLoggedIn);
    }
  }, [isEmployeeLoggedIn, isLoaded]);

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

  const getSlotsPerTime = useCallback((dayOfWeek: number): number => {
    const config = slotConfig.find(c => c.dayOfWeek === dayOfWeek);
    return config?.slotsPerTime ?? 10;
  }, [slotConfig]);

  const getAvailableSlots = useCallback((dateString: string): TimeSlot[] => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const openingHours = DEFAULT_OPENING_HOURS.find(oh => oh.dayOfWeek === dayOfWeek);

    if (!openingHours || !openingHours.isOpen) {
      return [];
    }

    const slotsPerTime = getSlotsPerTime(dayOfWeek);
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
  }, [appointments, blockedSlots, getSlotsPerTime]);

  const getAppointmentsForDate = useCallback((date: string): Appointment[] => {
    return appointments.filter(apt => apt.date === date).sort((a, b) => a.time.localeCompare(b.time));
  }, [appointments]);

  const getAppointmentsBySecretId = useCallback((secretId: string): Appointment[] => {
    return appointments.filter(apt => apt.secretId?.toLowerCase() === secretId.toLowerCase())
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  }, [appointments]);

  const employeeLogin = useCallback((password: string): boolean => {
    if (password === EMPLOYEE_PASSWORD) {
      setIsEmployeeLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const employeeLogout = useCallback(() => {
    setIsEmployeeLoggedIn(false);
  }, []);

  const updateSlotConfig = useCallback((dayOfWeek: number, slotsPerTime: number) => {
    setSlotConfig(prev => prev.map(config => 
      config.dayOfWeek === dayOfWeek 
        ? { ...config, slotsPerTime } 
        : config
    ));
  }, []);

  return (
    <AppContext.Provider
      value={{
        appointments,
        blockedSlots,
        slotConfig,
        isLoaded,
        isEmployeeLoggedIn,
        addAppointment,
        cancelAppointment,
        blockSlot,
        unblockSlot,
        getAvailableSlots,
        getAppointmentsForDate,
        getAppointmentsBySecretId,
        isDateOpen,
        employeeLogin,
        employeeLogout,
        updateSlotConfig,
        getSlotsPerTime,
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
