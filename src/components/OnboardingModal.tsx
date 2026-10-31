import React, { useState } from 'react';
import { AgeCategory, Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { ShieldCheck, Award, Users, Check, X } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (profile: UserProfile) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  currentLanguage,
  onLanguageChange,
  onClose,
}) => {
  const [age, setAge] = useState<number>(67); // Default 67 to showcase 100% senior state subsidy
  const [isParent, setIsParent] = useState(false);
  const [isDisability, setIsDisability] = useState(false);

  const t = translations[currentLanguage];

  if (!isOpen) return null;

  let category: AgeCategory = 'adult';
  if (age <= 17) category = 'child';
  else if (age >= 65) category = 'senior';

  const handleSave = () => {
    const profile: UserProfile = {
      age,
      language: currentLanguage,
      isParent: category === 'child' ? isParent : false,
      isDisability: category === 'adult' ? isDisability : false,
      category,
      completedOnboarding: true,
    };
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/20 dark:border-white/20 light:border-black/15 rounded-xl p-6 sm:p-8 shadow-2xl text-white dark:text-white light:text-gray-900">
        {/* Close Button if user wants to close without saving */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-white/10 dark:border-white/10 light:border-black/10">
          <img
            src="https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png"
            alt="Новые люди"
            className="w-10 h-10 object-contain"
          />
          <div>
            <span className="text-[10px] font-mono font-bold text-[#00A389] uppercase tracking-widest block">
              Государственный медицинский реестр
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-sans">
              ПЕРСОНАЛЬНАЯ КАРТА ПАЦИЕНТА
            </h2>
          </div>
        </div>

        <p className="mt-4 text-xs sm:text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
          Укажите точный возраст для применения автоматической субсидии Минздрава РУз и партии «Новые люди» при оформлении электронного направления через my.gov.uz.
        </p>

        {/* Age Slider (0 - 150) */}
        <div className="mt-6 p-4 rounded-lg bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700">
              Возраст пациента:
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-mono font-black text-[#00A389]">
                {age}
              </span>
              <span className="text-xs text-gray-400 font-bold uppercase">лет</span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="150"
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00A389]"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1.5 font-bold">
            <span>0 лет (Педиатрия)</span>
            <span>18</span>
            <span>65+ (100% Госпрограмма)</span>
            <span>150</span>
          </div>
        </div>

        {/* Dynamic Category Card */}
        <div className="mt-4">
          {category === 'senior' && (
            <div className="p-4 rounded-lg bg-[#00A389]/15 border border-[#00A389] text-white dark:text-white light:text-gray-900 shadow">
              <div className="flex items-center gap-2 mb-1.5">
                <Award className="w-5 h-5 text-[#00A389]" />
                <h4 className="font-black text-sm uppercase text-[#00A389]">
                  Категория: Пенсионеры (65+) — 100% БЕСПЛАТНО (0 СУМ)
                </h4>
              </div>
              <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed font-medium">
                Вам доступно 100% бесплатное лечение по электронному направлению с QR-кодом my.gov.uz при поддержке партии «Новые люди». Диагностика, лекарства и стационар полностью оплачены.
              </p>
            </div>
          )}

          {category === 'child' && (
            <div className="p-4 rounded-lg bg-sky-950/40 border border-sky-500/40 text-white dark:text-white light:text-gray-900">
              <div className="flex items-center gap-2 mb-1.5">
                <Users className="w-5 h-5 text-sky-400" />
                <h4 className="font-black text-sm uppercase text-sky-400">
                  Категория: Дети и подростки (0–17 лет)
                </h4>
              </div>
              <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 mb-2">
                Прием проводится профильными детскими врачами. Требуется подтверждение законного представителя.
              </p>
              <label className="flex items-center gap-2.5 text-xs text-white dark:text-white light:text-gray-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isParent}
                  onChange={(e) => setIsParent(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00A389] focus:ring-0 bg-gray-800 border-gray-600"
                />
                <span className="font-bold">Я подтверждаю, что являюсь родителем или опекуном</span>
              </label>
            </div>
          )}

          {category === 'adult' && (
            <div className="p-4 rounded-lg bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-5 h-5 text-[#00A389]" />
                <h4 className="font-black text-sm uppercase text-white dark:text-white light:text-gray-900">
                  Категория: Коммерческий прием (18–64 года)
                </h4>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mb-2">
                Стандартные прозрачные тарифы. Консилиумы кандидатов и докторов наук.
              </p>
              <label className="flex items-center gap-2.5 text-xs text-white dark:text-white light:text-gray-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isDisability}
                  onChange={(e) => setIsDisability(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00A389] focus:ring-0 bg-gray-800 border-gray-600"
                />
                <span className="font-bold">Пациент имеет группу инвалидности (переход на 100% госпрограмму)</span>
              </label>
            </div>
          )}
        </div>

        {/* Language selector */}
        <div className="mt-5 flex items-center justify-between text-xs">
          <span className="text-gray-400 font-bold uppercase">Язык обслуживания:</span>
          <div className="flex gap-1">
            {(['ru', 'uz', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-3 py-1.5 rounded font-black uppercase text-xs transition-all ${
                  currentLanguage === lang
                    ? 'bg-[#00A389] text-white'
                    : 'bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-100 text-gray-400'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button (Solid Teal Matching Screenshot 1) */}
        <button
          onClick={handleSave}
          className="mt-6 w-full py-4 bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-lg"
        >
          СОХРАНИТЬ И ВОЙТИ В КЛИНИКУ
        </button>
      </div>
    </div>
  );
};
