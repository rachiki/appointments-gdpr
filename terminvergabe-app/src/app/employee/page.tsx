'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatDate, getNextDays, DEFAULT_OPENING_HOURS, generateTimeSlots } from '@/config/schedule';

export default function EmployeePage() {
  const { 
    appointments, 
    blockedSlots, 
    cancelAppointment, 
    blockSlot, 
    unblockSlot,
    getAvailableSlots,
    isDateOpen 
  } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const dates = getNextDays(28);
    return dates.find(d => isDateOpen(d)) || dates[0];
  });
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockTime, setBlockTime] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const dates = useMemo(() => getNextDays(28).filter(d => isDateOpen(d)), [isDateOpen]);
  const dayAppointments = useMemo(() => 
    appointments.filter(apt => apt.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, selectedDate]
  );
  const dayBlockedSlots = useMemo(() => 
    blockedSlots.filter(slot => slot.date === selectedDate),
    [blockedSlots, selectedDate]
  );
  const availableSlots = useMemo(() => getAvailableSlots(selectedDate), [getAvailableSlots, selectedDate]);

  const getAllTimeSlots = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const openingHours = DEFAULT_OPENING_HOURS.find(oh => oh.dayOfWeek === dayOfWeek);
    if (!openingHours) return [];
    return generateTimeSlots(openingHours);
  };

  const handleBlockSlot = () => {
    if (!blockTime) return;
    blockSlot(selectedDate, blockTime, blockReason || undefined);
    setShowBlockModal(false);
    setBlockTime('');
    setBlockReason('');
  };

  const handleCancelAppointment = (id: string) => {
    cancelAppointment(id);
    setConfirmCancel(null);
  };

  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(apt => apt.date === selectedDate).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-primary-800 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Employee Dashboard</h1>
              <p className="text-primary-200 text-sm">Manage Appointments</p>
            </div>
          </Link>
          <Link href="/" className="btn btn-ghost text-white hover:bg-white/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Today&apos;s Appointments</p>
              <p className="text-xl font-bold text-primary-900">{todayAppointments}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Bookings</p>
              <p className="text-xl font-bold text-primary-900">{totalAppointments}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Blocked Slots</p>
              <p className="text-xl font-bold text-primary-900">{blockedSlots.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Date Selector */}
            <div className="lg:col-span-1">
              <div className="card p-4 sticky top-6">
                <h3 className="font-semibold text-primary-900 mb-4">Select Date</h3>
                <div className="max-h-96 overflow-y-auto space-y-1">
                  {dates.map(date => {
                    const dateAppointments = appointments.filter(apt => apt.date === date).length;
                    const isSelected = selectedDate === date;
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-accent-500 text-white'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${isSelected ? 'text-white' : 'text-primary-900'}`}>
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                          {dateAppointments > 0 && (
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-accent-100 text-accent-700'
                            }`}>
                              {dateAppointments}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Day View */}
            <div className="lg:col-span-2 space-y-6">
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary-900">{formatDate(selectedDate)}</h2>
                  <p className="text-slate-500">{dayAppointments.length} appointments, {dayBlockedSlots.length} blocked slots</p>
                </div>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="btn btn-secondary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Block Time Slot
                </button>
              </div>

              {/* Appointments List */}
              <div className="card">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-primary-900">Appointments</h3>
                </div>
                {dayAppointments.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No appointments for this date</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {dayAppointments.map(apt => (
                      <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-center">
                            <span className="text-lg font-bold text-accent-600">{apt.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-primary-900">{apt.name}</p>
                            <p className="text-sm text-slate-500">{apt.email}</p>
                            {apt.phone && <p className="text-sm text-slate-400">{apt.phone}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                            {apt.id}
                          </span>
                          {confirmCancel === apt.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="btn btn-danger text-sm py-1.5"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmCancel(null)}
                                className="btn btn-ghost text-sm py-1.5"
                              >
                                Keep
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(apt.id)}
                              className="text-danger-500 hover:text-danger-700 p-2 rounded-lg hover:bg-danger-50 transition-colors"
                              title="Cancel appointment"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blocked Slots */}
              {dayBlockedSlots.length > 0 && (
                <div className="card">
                  <div className="p-4 border-b border-slate-100">
                    <h3 className="font-semibold text-primary-900">Blocked Slots</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {dayBlockedSlots.map(slot => (
                      <div key={slot.id} className="p-4 flex items-center justify-between bg-danger-50">
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-center">
                            <span className="text-lg font-bold text-danger-600">{slot.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-danger-700">Blocked</p>
                            {slot.reason && <p className="text-sm text-danger-500">{slot.reason}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => unblockSlot(slot.id)}
                          className="text-danger-600 hover:text-danger-800 p-2 rounded-lg hover:bg-danger-100 transition-colors"
                          title="Unblock slot"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Slot Availability Overview */}
              <div className="card">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-primary-900">Slot Availability</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableSlots.map(slot => (
                      <div
                        key={slot.time}
                        className={`p-2 rounded-lg text-center text-sm ${
                          slot.blocked
                            ? 'bg-danger-100 text-danger-700'
                            : slot.available === 0
                              ? 'bg-slate-100 text-slate-400'
                              : slot.available <= 3
                                ? 'bg-warning-100 text-warning-700'
                                : 'bg-success-100 text-success-700'
                        }`}
                      >
                        <div className="font-medium">{slot.time}</div>
                        <div className="text-xs">
                          {slot.blocked ? 'Blocked' : `${slot.available} left`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Block Slot Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card p-6 w-full max-w-md animate-scale-in">
            <h3 className="text-xl font-bold text-primary-900 mb-4">Block Time Slot</h3>
            <p className="text-slate-600 mb-6">Select a time slot to block for {formatDate(selectedDate)}</p>
            
            <div className="space-y-4">
              <div>
                <label className="label">Time Slot</label>
                <select
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="input"
                >
                  <option value="">Select a time...</option>
                  {getAllTimeSlots()
                    .filter(time => !dayBlockedSlots.some(s => s.time === time))
                    .map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="label">Reason (optional)</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Meeting, Lunch, etc."
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockSlot}
                disabled={!blockTime}
                className="btn btn-danger flex-1"
              >
                Block Slot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-200 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>© 2024 Appointment Booking System. Employee Portal.</p>
        </div>
      </footer>
    </div>
  );
}

