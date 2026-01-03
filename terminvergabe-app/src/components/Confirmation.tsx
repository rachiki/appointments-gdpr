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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="font-medium text-slate-900">{appointment.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="font-medium text-slate-900">{appointment.email}</p>
            </div>
          </div>
          {appointment.phone && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{appointment.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/book" className="btn btn-secondary flex-1">
          Book Another Appointment
        </Link>
        <Link href="/" className="btn btn-primary flex-1">
          Return Home
        </Link>
      </div>
    </div>
  );
}

