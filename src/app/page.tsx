'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary-900 text-white py-4 px-6 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold">{t('appointmentBooking')}</h1>
              <p className="text-primary-200 text-sm">{t('terminvergabe')}</p>
            </div>
          </div>
          <LanguageSwitcher variant="minimal" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 text-accent-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse"></span>
              {t('onlineBookingAvailable')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary-900 mb-4 text-balance">
              {t('bookYourAppointment')}
              <br />
              <span className="text-primary-500">{t('simpleAndFast')}</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('heroDescription')}
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Citizen Card */}
            <Link href="/book" className="group">
              <div className="card p-8 h-full hover:shadow-xl hover:border-accent-300 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-accent-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                  <svg className="w-7 h-7 text-accent-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary-900 mb-3">{t('bookAnAppointment')}</h3>
                <p className="text-slate-600 mb-6">
                  {t('bookAppointmentDescription')}
                </p>
                <div className="flex items-center text-accent-600 font-medium group-hover:gap-3 gap-2 transition-all">
                  {t('startBooking')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* My Appointments Card */}
            <Link href="/my-appointments" className="group">
              <div className="card p-8 h-full hover:shadow-xl hover:border-success-300 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-success-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-success-500 transition-colors">
                  <svg className="w-7 h-7 text-success-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary-900 mb-3">{t('myAppointments')}</h3>
                <p className="text-slate-600 mb-6">
                  {t('myAppointmentsDescription')}
                </p>
                <div className="flex items-center text-success-600 font-medium group-hover:gap-3 gap-2 transition-all">
                  {t('viewAppointments')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Employee Card */}
            <Link href="/employee" className="group">
              <div className="card p-8 h-full hover:shadow-xl hover:border-primary-300 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-800 transition-colors">
                  <svg className="w-7 h-7 text-primary-700 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-primary-900 mb-3">{t('employeeDashboard')}</h3>
                <p className="text-slate-600 mb-6">
                  {t('employeeDashboardDescription')}
                </p>
                <div className="flex items-center text-primary-700 font-medium group-hover:gap-3 gap-2 transition-all">
                  {t('openDashboard')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid grid-cols-3 gap-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="p-4">
              <div className="w-12 h-12 bg-success-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-900 mb-1">{t('openingHours')}</h4>
              <p className="text-sm text-slate-500">{t('openingHoursTime')}</p>
              <p className="text-sm text-slate-500">{t('breakTime')}</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-900 mb-1">{t('instantConfirmation')}</h4>
              <p className="text-sm text-slate-500">{t('instantConfirmationDescription')}</p>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 bg-warning-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold text-primary-900 mb-1">{t('flexibleScheduling')}</h4>
              <p className="text-sm text-slate-500">{t('flexibleSchedulingDescription')}</p>
            </div>
          </div>
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
