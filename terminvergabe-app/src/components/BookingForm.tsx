'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/config/schedule';
import { Appointment } from '@/types';

interface BookingFormProps {
  selectedDate: string;
  selectedTime: string;
  onSuccess: (appointment: Appointment) => void;
  onBack: () => void;
}

export default function BookingForm({ selectedDate, selectedTime, onSuccess, onBack }: BookingFormProps) {
  const { addAppointment } = useApp();
  const { t, language } = useLanguage();
  const [secretId, setSecretId] = useState('');
  const [errors, setErrors] = useState<{ secretId?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { secretId?: string } = {};

    if (!secretId.trim()) {
      newErrors.secretId = t('secretIdRequired');
    } else if (secretId.trim().length < 3) {
      newErrors.secretId = t('secretIdMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const appointment = addAppointment({
      date: selectedDate,
      time: selectedTime,
      secretId: secretId.trim(),
    });

    setIsSubmitting(false);
    onSuccess(appointment);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-primary-900">{t('enterYourSecretId')}</h3>
      </div>

      {/* Selected Date/Time Summary */}
      <div className="bg-accent-50 border border-accent-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-primary-900">{formatDate(selectedDate, language)}</p>
            <p className="text-accent-600 font-medium">{selectedTime}</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-6">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-primary-700">
            <p className="font-medium mb-1">{t('whatIsSecretId')}</p>
            <p>{t('secretIdExplanation')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Secret ID */}
        <div>
          <label htmlFor="secretId" className="label">
            {t('yourSecretId')} <span className="text-danger-500">*</span>
          </label>
          <input
            type="text"
            id="secretId"
            value={secretId}
            onChange={(e) => setSecretId(e.target.value)}
            placeholder={t('enterMemorableCode')}
            className={`input ${errors.secretId ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : ''}`}
            autoComplete="off"
          />
          {errors.secretId && (
            <p className="text-danger-500 text-sm mt-1.5">{errors.secretId}</p>
          )}
          <p className="text-slate-500 text-xs mt-1.5">
            {t('useSecretIdLater')}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary w-full py-3"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {t('booking')}
            </>
          ) : (
            <>
              {t('confirmBooking')}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
