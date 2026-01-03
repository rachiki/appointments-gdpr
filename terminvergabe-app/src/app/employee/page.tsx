'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate, getNextDays, DEFAULT_OPENING_HOURS, generateTimeSlots, getDayName } from '@/config/schedule';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function EmployeePage() {
  const { 
    appointments, 
    blockedSlots, 
    cancelAppointment, 
    blockSlot, 
    unblockSlot,
    getAvailableSlots,
    isDateOpen,
    isLoaded,
    isEmployeeLoggedIn,
    employeeLogin,
    employeeLogout,
    slotConfig,
    updateSlotConfig,
  } = useApp();
  const { t, language } = useLanguage();

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const dates = getNextDays(28);
    return dates[0];
  });
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [blockTime, setBlockTime] = useState('');
  const [blockReason, setBlockReason] = useState('');
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  // Update selectedDate when isDateOpen changes
  useMemo(() => {
    if (isLoaded) {
      const dates = getNextDays(28);
      const firstOpenDate = dates.find(d => isDateOpen(d));
      if (firstOpenDate && !isDateOpen(selectedDate)) {
        setSelectedDate(firstOpenDate);
      }
    }
  }, [isLoaded, isDateOpen, selectedDate]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (employeeLogin(password)) {
      setLoginError('');
      setPassword('');
    } else {
      setLoginError(t('invalidPassword'));
    }
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

  // Login Screen
  if (!isEmployeeLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
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
                <h1 className="text-xl font-semibold">{t('employeeDashboard')}</h1>
                <p className="text-primary-200 text-sm">{t('loginRequired')}</p>
              </div>
            </Link>
            <LanguageSwitcher variant="minimal" />
          </div>
        </header>

        {/* Login Form */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="card p-8 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-900">{t('employeeLogin')}</h2>
                <p className="text-slate-600 mt-2">{t('enterPasswordToAccess')}</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="label">{t('password')}</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enterEmployeePassword')}
                    className={`input ${loginError ? 'border-danger-500' : ''}`}
                    autoComplete="current-password"
                  />
                  {loginError && (
                    <p className="text-danger-500 text-sm mt-1.5">{loginError}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('login')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
                  {t('backToHome')}
                </Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary-900 text-primary-200 py-6 px-6">
          <div className="max-w-7xl mx-auto text-center text-sm">
            <p>{t('footerCopyright').replace('All rights reserved.', t('employeePortal')).replace('Alle Rechte vorbehalten.', t('employeePortal'))}</p>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard
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
              <h1 className="text-xl font-semibold">{t('employeeDashboard')}</h1>
              <p className="text-primary-200 text-sm">{t('manageAppointments')}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="minimal" />
            <button onClick={() => setShowConfigModal(true)} className="btn btn-ghost text-white hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('settings')}
            </button>
            <button onClick={employeeLogout} className="btn btn-ghost text-white hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('logout')}
            </button>
          </div>
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
              <p className="text-xs text-slate-500">{t('selectedDay')}</p>
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
              <p className="text-xs text-slate-500">{t('totalBookings')}</p>
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
              <p className="text-xs text-slate-500">{t('blockedSlots')}</p>
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
                <h3 className="font-semibold text-primary-900 mb-4">{t('selectDate')}</h3>
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
                              {new Date(date).toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
                  <h2 className="text-2xl font-bold text-primary-900">{formatDate(selectedDate, language)}</h2>
                  <p className="text-slate-500">{dayAppointments.length} {t('appointmentsCount')}, {dayBlockedSlots.length} {t('blockedSlotsCount')}</p>
                </div>
                <button
                  onClick={() => setShowBlockModal(true)}
                  className="btn btn-secondary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {t('blockTimeSlot')}
                </button>
              </div>

              {/* Appointments List */}
              <div className="card">
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-primary-900">{t('appointments')}</h3>
                </div>
                {dayAppointments.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>{t('noAppointmentsForDate')}</p>
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
                            <p className="font-medium text-primary-900">{t('secretIdDisplay')}: <span className="font-mono text-primary-600">{apt.secretId}</span></p>
                            <p className="text-xs text-slate-400 font-mono mt-1">{apt.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {confirmCancel === apt.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="btn btn-danger text-sm py-1.5"
                              >
                                {t('confirm')}
                              </button>
                              <button
                                onClick={() => setConfirmCancel(null)}
                                className="btn btn-ghost text-sm py-1.5"
                              >
                                {t('keep')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmCancel(apt.id)}
                              className="text-danger-500 hover:text-danger-700 p-2 rounded-lg hover:bg-danger-50 transition-colors"
                              title={t('cancelAppointment')}
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
                    <h3 className="font-semibold text-primary-900">{t('blockedSlots')}</h3>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {dayBlockedSlots.map(slot => (
                      <div key={slot.id} className="p-4 flex items-center justify-between bg-danger-50">
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-center">
                            <span className="text-lg font-bold text-danger-600">{slot.time}</span>
                          </div>
                          <div>
                            <p className="font-medium text-danger-700">{t('blocked')}</p>
                            {slot.reason && <p className="text-sm text-danger-500">{slot.reason}</p>}
                          </div>
                        </div>
                        <button
                          onClick={() => unblockSlot(slot.id)}
                          className="text-danger-600 hover:text-danger-800 p-2 rounded-lg hover:bg-danger-100 transition-colors"
                          title={t('unblockSlot')}
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
                  <h3 className="font-semibold text-primary-900">{t('slotAvailability')}</h3>
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
                          {slot.blocked ? t('blocked') : `${slot.available} ${t('left')}`}
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
            <h3 className="text-xl font-bold text-primary-900 mb-4">{t('blockTimeSlot')}</h3>
            <p className="text-slate-600 mb-6">{t('blockSlotFor')} {formatDate(selectedDate, language)}</p>
            
            <div className="space-y-4">
              <div>
                <label className="label">{t('timeSlot')}</label>
                <select
                  value={blockTime}
                  onChange={(e) => setBlockTime(e.target.value)}
                  className="input"
                >
                  <option value="">{t('selectATimeSlot')}</option>
                  {getAllTimeSlots()
                    .filter(time => !dayBlockedSlots.some(s => s.time === time))
                    .map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="label">{t('reasonOptional')}</label>
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder={t('reasonPlaceholder')}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                className="btn btn-secondary flex-1"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleBlockSlot}
                disabled={!blockTime}
                className="btn btn-danger flex-1"
              >
                {t('blockSlot')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="card p-6 w-full max-w-lg animate-scale-in max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-primary-900 mb-4">{t('slotConfiguration')}</h3>
            <p className="text-slate-600 mb-6">{t('slotConfigDescription')}</p>
            
            <div className="space-y-4">
              {slotConfig.filter(c => DEFAULT_OPENING_HOURS.find(oh => oh.dayOfWeek === c.dayOfWeek)?.isOpen).map(config => (
                <div key={config.dayOfWeek} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="font-medium text-primary-900">{getDayName(config.dayOfWeek, language)}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateSlotConfig(config.dayOfWeek, Math.max(1, config.slotsPerTime - 1))}
                      className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-12 text-center font-bold text-lg text-primary-900">{config.slotsPerTime}</span>
                    <button
                      onClick={() => updateSlotConfig(config.dayOfWeek, config.slotsPerTime + 1)}
                      className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfigModal(false)}
                className="btn btn-primary flex-1"
              >
                {t('done')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-200 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm">
          <p>{t('footerCopyright').replace('All rights reserved.', t('employeePortal')).replace('Alle Rechte vorbehalten.', t('employeePortal'))}</p>
        </div>
      </footer>
    </div>
  );
}
