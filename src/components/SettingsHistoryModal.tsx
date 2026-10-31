import React, { useState } from 'react';
import { ApplicationRecord, Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { saveUserProfile } from '../utils/storage';
import { X, User, FileText, CheckCircle2, ChevronRight, Award, QrCode } from 'lucide-react';

interface SettingsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  applications: ApplicationRecord[];
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenTicket: (app: ApplicationRecord) => void;
}

export const SettingsHistoryModal: React.FC<SettingsHistoryModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  applications,
  currentLanguage,
  onLanguageChange,
  onOpenTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [age, setAge] = useState<number>(userProfile?.age ?? 35);
  const [isDisability, setIsDisability] = useState<boolean>(userProfile?.isDisability ?? false);
  const [isParent, setIsParent] = useState<boolean>(userProfile?.isParent ?? false);

  if (!isOpen) return null;
  const t = translations[currentLanguage];

  const handleSaveProfile = () => {
    let category: 'child' | 'adult' | 'senior' = 'adult';
    if (age <= 17) category = 'child';
    else if (age >= 65) category = 'senior';

    const updated: UserProfile = {
      age,
      language: currentLanguage,
      isParent: category === 'child' ? isParent : false,
      isDisability: category === 'adult' ? isDisability : false,
      category,
      completedOnboarding: true,
    };
    saveUserProfile(updated);
    onUpdateProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#00D2B4] text-[#0B0F19]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Настройки профиля</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#00D2B4] text-[#0B0F19]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{t.myApplications}</span>
              {applications.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {applications.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="py-6 space-y-6 overflow-y-auto">
            {/* Language Switch */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">
                Язык интерфейса:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { code: 'ru', label: 'Русский (RU)' },
                    { code: 'uz', label: "O'zbekcha (UZ)" },
                    { code: 'en', label: 'English (EN)' },
                  ] as { code: Language; label: string }[]
                ).map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange(l.code)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                      currentLanguage === l.code
                        ? 'bg-[#00D2B4] text-[#0B0F19] border-[#00D2B4]'
                        : 'bg-black/40 text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Slider */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-300">
                  Возраст пациента для расчета льгот:
                </span>
                <span className="text-xl font-mono font-bold text-[#00D2B4]">
                  {age} лет
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00D2B4]"
              />
              <div className="mt-2 text-[11px] text-gray-400">
                {age >= 65 ? (
                  <span className="text-[#10B981] font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Активирована 100% бесплатная госпрограмма (QR)</span>
                  </span>
                ) : age <= 17 ? (
                  <span className="text-sky-400 font-bold">
                    Категория: Дети и подростки (требуется согласие родителя)
                  </span>
                ) : (
                  <span>Стандартный клинический тариф</span>
                )}
              </div>
            </div>

            {/* Subsidies toggles */}
            {age > 17 && age < 65 && (
              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDisability}
                  onChange={(e) => setIsDisability(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00D2B4] bg-gray-800 border-gray-600 focus:ring-0"
                />
                <span>Пациент является лицом с инвалидностью (100% субсидия госпрограммы)</span>
              </label>
            )}

            {age <= 17 && (
              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-white/10 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={isParent}
                  onChange={(e) => setIsParent(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00D2B4] bg-gray-800 border-gray-600 focus:ring-0"
                />
                <span>Я являюсь родителем или законным представителем</span>
              </label>
            )}

            <button
              onClick={handleSaveProfile}
              className="w-full py-3 rounded-2xl bg-[#00D2B4] hover:bg-[#00B399] text-[#0B0F19] font-extrabold text-sm transition-all cursor-pointer shadow-lg shadow-[#00D2B4]/20"
            >
              Сохранить параметры
            </button>
          </div>
        )}

        {/* Tab 2: Application History */}
        {activeTab === 'history' && (
          <div className="py-6 overflow-y-auto space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <FileText className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <p>У вас пока нет зарегистрированных заявок.</p>
                <p className="text-xs text-gray-600 mt-1">
                  Заполните форму записи, чтобы получить цифровой талон.
                </p>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onOpenTicket(app)}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-[#00D2B4]/50 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-[#00D2B4]">
                        #{app.id}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {app.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{app.status}</span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 font-mono">
                      {app.phone} · {app.date} {app.time}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {app.serviceName} · {app.categoryText}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 group-hover:text-[#00D2B4] transition-colors">
                    <QrCode className="w-5 h-5" />
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
