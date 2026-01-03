'use client';

import { useState } from 'react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import BookingForm from '@/components/BookingForm';
import Confirmation from '@/components/Confirmation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { Appointment } from '@/types';

type Step = 'date' | 'time' | 'form' | 'confirmation';

export default function BookPage() {
  const { t } = useLanguage();
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('form');
  };

  const handleBookingSuccess = (appointment: Appointment) => {
    setConfirmedAppointment(appointment);
    setStep('confirmation');
  };

  const handleBack = () => {
    if (step === 'time') {
      setStep('date');
    } else if (step === 'form') {
      setStep('time');
    }
  };

  const handleStartOver = () => {
    setStep('date');
    setSelectedDate(null);
    setSelectedTime(null);
    setConfirmedAppointment(null);
  };

  const steps = [
    { id: 'date', label: t('date'), number: 1 },
    { id: 'time', label: t('time'), number: 2 },
    { id: 'form', label: t('details'), number: 3 },
    { id: 'confirmation', label: t('done'), number: 4 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{t('bookAppointment')}</h1>
              <p className="text-primary-200 text-sm">{t('terminvergabe')}</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="minimal" />
            {step !== 'confirmation' && (
              <button
                onClick={handleStartOver}
                className="text-sm text-primary-200 hover:text-white transition-colors"
              >
                {t('startOver')}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      {step !== 'confirmation' && (
        <div className="bg-white border-b border-slate-200 py-4 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              {steps.slice(0, -1).map((s, index) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                        ${index < currentStepIndex
                          ? 'bg-success-500 text-white'
                          : index === currentStepIndex
                            ? 'bg-accent-500 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }
                      `}
                    >
                      {index < currentStepIndex ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        s.number
                      )}
                    </div>
                    <span className={`text-sm font-medium hidden sm:block ${index <= currentStepIndex ? 'text-primary-900' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  {index < steps.length - 2 && (
                    <div className={`flex-1 h-0.5 mx-4 ${index < currentStepIndex ? 'bg-success-500' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          {step === 'date' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary-900 mb-2">{t('selectADate')}</h2>
                <p className="text-slate-600">{t('selectADateDescription')}</p>
              </div>
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
              />
            </div>
          )}

          {step === 'time' && selectedDate && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 mb-4"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('changeDate')}
                </button>
                <h2 className="text-2xl font-bold text-primary-900 mb-2">{t('selectATime')}</h2>
                <p className="text-slate-600">{t('selectATimeDescription')}</p>
              </div>
              <TimeSlotPicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelectTime={handleTimeSelect}
              />
            </div>
          )}

          {step === 'form' && selectedDate && selectedTime && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-primary-900 mb-2">{t('enterYourDetails')}</h2>
                <p className="text-slate-600">{t('enterYourDetailsDescription')}</p>
              </div>
              <BookingForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSuccess={handleBookingSuccess}
                onBack={handleBack}
              />
            </div>
          )}

          {step === 'confirmation' && confirmedAppointment && (
            <div className="animate-fade-in">
              <Confirmation appointment={confirmedAppointment} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary-900 text-primary-200 py-6 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm">
          <p>{t('footerCopyright')}</p>
        </div>
      </footer>
    </div>
  );
}
