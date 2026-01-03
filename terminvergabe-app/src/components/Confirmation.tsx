'use client';

import Link from 'next/link';
import { Appointment } from '@/types';
import { formatDate } from '@/config/schedule';

interface ConfirmationProps {
  appointment: Appointment;
}

export default function Confirmation({ appointment }: ConfirmationProps) {
  return (
    <div className="card p-8 text-center animate-scale-in">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-success-500/30">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-primary-900 mb-2">Booking Confirmed!</h2>
      <p className="text-slate-600 mb-8">Your appointment has been successfully booked.</p>

      {/* Confirmation Code */}
      <div className="bg-primary-50 border-2 border-primary-200 rounded-xl p-6 mb-8">
        <p className="text-sm text-primary-600 mb-2">Your Confirmation Code</p>
        <p className="text-2xl font-mono font-bold text-primary-900 tracking-wider">
          {appointment.id}
        </p>
        <p className="text-xs text-primary-500 mt-2">Please save this code for your records</p>
      </div>

      {/* Appointment Details */}
      <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
        <h3 className="font-semibold text-primary-900 mb-4">Appointment Details</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Date</p>
              <p className="font-medium text-slate-900">{formatDate(appointment.date)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Time</p>
              <p className="font-medium text-slate-900">{appointment.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4 mb-8 text-left">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="text-sm text-warning-600">
            <p className="font-medium mb-1">Remember your Secret ID!</p>
            <p>You&apos;ll need it to view or cancel your appointments later.</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/my-appointments" className="btn btn-secondary flex-1">
          View My Appointments
        </Link>
        <Link href="/" className="btn btn-primary flex-1">
          Return Home
        </Link>
      </div>
    </div>
  );
}
