'use client';

import { useApp } from '@/context/AppContext';
import { formatDate } from '@/config/schedule';
import { TimeSlot } from '@/types';

interface TimeSlotPickerProps {
  selectedDate: string;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
}

export default function TimeSlotPicker({ selectedDate, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  const { getAvailableSlots, slotsPerTime } = useApp();
  const slots = getAvailableSlots(selectedDate);

  // Split into morning and afternoon
  const morningSlots = slots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });
  const afternoonSlots = slots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12;
  });

  const getSlotStatus = (slot: TimeSlot): 'available' | 'limited' | 'full' | 'blocked' => {
    if (slot.blocked) return 'blocked';
    if (slot.available === 0) return 'full';
    if (slot.available <= slotsPerTime * 0.3) return 'limited';
    return 'available';
  };

  const renderSlot = (slot: TimeSlot) => {
    const status = getSlotStatus(slot);
    const isSelected = selectedTime === slot.time;
    const isClickable = status === 'available' || status === 'limited';

    return (
      <button
        key={slot.time}
        onClick={() => isClickable && onSelectTime(slot.time)}
        disabled={!isClickable}
        className={`
          relative p-4 rounded-xl font-medium transition-all duration-200
          ${isSelected
            ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/30 scale-[1.02]'
            : status === 'available'
              ? 'slot-available hover:scale-[1.02]'
              : status === 'limited'
                ? 'slot-limited hover:scale-[1.02]'
                : status === 'blocked'
                  ? 'slot-blocked'
                  : 'slot-full'
          }
        `}
      >
        <div className="text-lg">{slot.time}</div>
        <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : ''}`}>
          {status === 'blocked' ? (
            'Blocked'
          ) : status === 'full' ? (
            'Fully booked'
          ) : (
            `${slot.available} spots left`
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-primary-900">Select Time</h3>
        <span className="text-sm text-slate-500">{formatDate(selectedDate)}</span>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No time slots available for this date</p>
        </div>
      ) : (
        <>
          {morningSlots.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Morning</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {morningSlots.map(renderSlot)}
              </div>
            </div>
          )}

          {afternoonSlots.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="text-sm font-medium text-slate-600">Afternoon</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {afternoonSlots.map(renderSlot)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-success-500 bg-success-500/20"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-warning-500 bg-warning-500/20"></div>
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-200"></div>
          <span>Full</span>
        </div>
      </div>
    </div>
  );
}

