import React, { useState, useEffect } from 'react';
import { Doctor, Language, MedicalService } from '../types';
import { translations } from '../i18n/translations';
import { TELEGRAM_BOT_URL } from '../utils/telegram';
import {
  X,
  Share2,
  Calendar,
  Award,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  Star,
  Users,
  Check,
  Building2,
  FileText,
} from 'lucide-react';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: Language;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  isOpen,
  onClose,
  currentLanguage,
  onBookWithDoctor,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'specializations' | 'bio' | 'schedule'>('specializations');

  const t = translations[currentLanguage];

  // Sync with browser URL hash for direct links (#doctor/doc-1)
  useEffect(() => {
    if (isOpen && doctor) {
      window.location.hash = `doctor/${doctor.id}`;
    } else if (!isOpen && window.location.hash.startsWith('#doctor/')) {
      history.replaceState(null, '', ' ');
    }
  }, [isOpen, doctor]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !doctor) return null;

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}#doctor/${doctor.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#111827] dark:bg-[#111827] light:bg-white rounded-2xl border border-white/15 dark:border-white/15 light:border-black/15 shadow-2xl overflow-hidden my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar with Breadcrumb and Action Buttons */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 dark:border-white/10 light:border-black/10 bg-black/30 dark:bg-black/30 light:bg-gray-50/80">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 light:text-gray-500 font-mono">
            <span>Врачи клиники</span>
            <span>/</span>
            <span className="text-[#00A389] font-bold uppercase truncate max-w-[180px] sm:max-w-none">
              {doctor.committee}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 dark:border-white/15 light:border-black/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700 transition-all cursor-pointer"
              title="Скопировать ссылку на врача"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Скопировано</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Поделиться</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black transition-all cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Doctor Hero Card */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Column: Portrait with Official Party Watermark Waves */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-xl overflow-hidden bg-slate-900 border border-white/15 shadow-xl group">
                {/* SVG Geometric Waves Background (Signature Party Graphic) */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-35 stroke-[#00A389] pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <path d="M0,20 Q25,40 50,20 T100,20" strokeWidth="0.8" />
                  <path d="M0,35 Q25,55 50,35 T100,35" strokeWidth="0.8" />
                  <path d="M0,50 Q25,70 50,50 T100,50" strokeWidth="0.8" />
                  <path d="M0,65 Q25,85 50,65 T100,65" strokeWidth="0.8" />
                  <path d="M0,80 Q25,100 50,80 T100,80" strokeWidth="0.8" />
                </svg>

                <img
                  src={doctor.avatar}
                  alt={doctor.name[currentLanguage]}
                  className="relative z-10 w-full h-full object-cover object-top filter contrast-105"
                />

                {/* Bottom Signature Nameplate */}
                <div
                  className="absolute bottom-0 inset-x-0 p-2 text-center text-white z-20"
                  style={{ backgroundColor: doctor.barColor }}
                >
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase">
                    {doctor.committee}
                  </span>
                </div>
              </div>

              {/* Verified badges under photo */}
              <div className="mt-4 flex flex-col gap-1.5 w-full max-w-xs text-left">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-[#00A389] shrink-0" />
                  <span className="truncate">{doctor.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-[11px] text-gray-300">
                  <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="truncate">{doctor.officeRoom}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bio, Credentials & Metric Grid */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <div className="inline-block px-3 py-1 rounded bg-[#00A389]/20 text-[#00A389] border border-[#00A389]/30 text-xs font-mono font-bold uppercase mb-2">
                  [ ВРАЧЕБНЫЙ СОВЕТ КЛИНИКИ ]
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 leading-tight">
                  {doctor.name[currentLanguage]}
                </h1>
                <p className="text-sm font-semibold text-[#00D2B4] mt-1">
                  {doctor.role[currentLanguage]}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-1">
                  {doctor.category[currentLanguage]}
                </p>
              </div>

              {/* 4 Metric Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg bg-black/40 dark:bg-black/40 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doctor.rating}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Рейтинг доверия</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 dark:bg-black/40 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="text-xs font-bold text-white dark:text-white light:text-gray-900 font-mono">
                    {doctor.experienceYears} лет
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Клинический стаж</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 dark:bg-black/40 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="text-xs font-bold text-white dark:text-white light:text-gray-900 font-mono">
                    {doctor.patientsCount}+
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Пациентов</div>
                </div>

                <div className="p-3 rounded-lg bg-black/40 dark:bg-black/40 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10">
                  <div className="text-xs font-bold text-emerald-400 font-mono">
                    {doctor.successRate}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Успешность</div>
                </div>
              </div>

              {/* Education Banner */}
              <div className="p-3.5 rounded-lg bg-[#161D2B] dark:bg-[#161D2B] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10 flex items-start gap-3">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white dark:text-white light:text-gray-900">Образование и стажировки: </span>
                  <span className="text-gray-300 dark:text-gray-300 light:text-gray-600">
                    {doctor.education[currentLanguage]}
                  </span>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-2 border-b border-white/10 dark:border-white/10 light:border-black/10 pb-2">
                <button
                  onClick={() => setActiveTab('specializations')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeTab === 'specializations'
                      ? 'bg-[#00A389] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Специализация и услуги
                </button>
                <button
                  onClick={() => setActiveTab('bio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeTab === 'bio'
                      ? 'bg-[#00A389] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  О докторе
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                    activeTab === 'schedule'
                      ? 'bg-[#00A389] text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  График приема
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[140px]">
                {activeTab === 'specializations' && (
                  <ul className="space-y-2 text-xs">
                    {doctor.specializations[currentLanguage].map((spec, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-300 dark:text-gray-300 light:text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#00A389] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'bio' && (
                  <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed">
                    {doctor.biography[currentLanguage]}
                  </p>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/10">
                      <Clock className="w-4 h-4 text-[#00A389]" />
                      <div>
                        <div className="font-bold text-white">Приемные дни и часы:</div>
                        <div className="text-gray-300">{doctor.receptionDays[currentLanguage]}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/10">
                      <MapPin className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="font-bold text-white">Место приема:</div>
                        <div className="text-gray-300">{doctor.officeRoom}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Booking Action Dock */}
        <div className="px-6 py-4 bg-black/40 dark:bg-black/40 light:bg-gray-100 border-t border-white/10 dark:border-white/10 light:border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Госпрограмма 65+ активна: 0 сум по QR my.gov.uz</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`${TELEGRAM_BOT_URL}?start=doctor_${doctor.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-lg border border-sky-400/40 text-sky-400 hover:bg-sky-400/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Бот @NewPeople_agent</span>
            </a>

            <button
              onClick={() => {
                onBookWithDoctor(doctor);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-[#00A389] hover:bg-[#008772] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <span>ЗАПИСАТЬСЯ К ЭТОМУ ВРАЧУ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
