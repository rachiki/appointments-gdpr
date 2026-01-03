'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { formatDate } from '@/config/schedule';
import { Appointment } from '@/types';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function MyAppointmentsPage() {
  const { getAppointmentsBySecretId, cancelAppointment, isLoaded } = useApp();
  const { t, language } = useLanguage();
  const [secretId, setSecretId] = useState('');
  const [searchedSecretId, setSearchedSecretId] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretId.trim()) return;
    
    const results = getAppointmentsBySecretId(secretId.trim());
    setAppointments(results);
    setSearchedSecretId(secretId.trim());
    setHasSearched(true);
  };

  const handleDelete = (id: string) => {
    cancelAppointment(id);
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    setConfirmDelete(null);
  };

  const handleNewSearch = () => {
    setSecretId('');
    setSearchedSecretId('');
    setAppointments([]);
    setHasSearched(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
      </div>
    );
  }

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
              <h1 className="text-xl font-semibold">{t('myAppointments')}</h1>
              <p className="text-primary-200 text-sm">{t('viewAndManage')}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="minimal" />
            <Link href="/" className="btn btn-ghost text-white hover:bg-white/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('home')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-6">
        <div className="max-w-2xl mx-auto">
          {!hasSearched ? (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-900 mb-2">{t('findYourAppointments')}</h2>
                <p className="text-slate-600">{t('enterSecretIdToView')}</p>
              </div>

              <div className="card p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label htmlFor="secretId" className="label">{t('yourSecretId')}</label>
                    <input
                      type="text"
                      id="secretId"
                      value={secretId}
                      onChange={(e) => setSecretId(e.target.value)}
                      placeholder={t('enterYourSecretIdPlaceholder')}
                      className="input"
                      autoComplete="off"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!secretId.trim()}
                    className="btn btn-primary w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('searchAppointments')}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center">
                <Link href="/book" className="text-accent-600 hover:text-accent-700 font-medium">
                  {t('needToBook')} →
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-900">{t('yourAppointmentsTitle')}</h2>
                  <p className="text-slate-600">{t('secretIdLabel')}: <span className="font-mono text-primary-600">{searchedSecretId}</span></p>
                </div>
                <button onClick={handleNewSearch} className="btn btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('newSearch')}
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">{t('noAppointmentsFound')}</h3>
                  <p className="text-slate-600 mb-6">{t('noAppointmentsWithSecretId')}</p>
                  <Link href="/book" className="btn btn-primary">
                    {t('bookAppointmentButton')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(apt => (
                    <div key={apt.id} className="card p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-accent-100 rounded-xl flex items-center justify-center">
                            <svg className="w-7 h-7 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold text-primary-900">{formatDate(apt.date, language)}</p>
                            <p className="text-accent-600 font-medium text-lg">{apt.time}</p>
                            <p className="text-xs font-mono text-slate-400 mt-1">{apt.id}</p>
                          </div>
                        </div>
                        <div>
                          {confirmDelete === apt.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(apt.id)}
                                className="btn btn-danger text-sm py-1.5"
                              >
                                {t('confirm')}
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="btn btn-ghost text-sm py-1.5"
                              >
                                {t('cancel')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(apt.id)}
                              className="text-danger-500 hover:text-danger-700 p-2 rounded-lg hover:bg-danger-50 transition-colors"
                              title={t('deleteAppointment')}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center pt-4">
                    <Link href="/book" className="text-accent-600 hover:text-accent-700 font-medium">
                      {t('bookAnother')} →
                    </Link>
                  </div>
                </div>
              )}
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
