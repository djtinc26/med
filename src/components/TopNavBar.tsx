import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { MapPin, Phone, Mail, Sun, Moon, FileText, Send } from 'lucide-react';

interface TopNavBarProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  applicationsCount: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenSettings,
  theme,
  onToggleTheme,
  applicationsCount,
}) => {
  const t = translations[currentLanguage];

  const navItems = [
    { id: 'hero', label: t.navHero },
    { id: 'benefits', label: t.navBenefits },
    { id: 'doctors', label: 'Врачи и Комитеты' },
    { id: 'actions', label: 'Дела важнее слов' },
    { id: 'services', label: t.navServices },
    { id: 'booking', label: t.navBooking },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F19]/95 dark:bg-[#0B0F19]/95 light:bg-white/95 border-b border-white/10 dark:border-white/10 light:border-black/10 backdrop-blur-md transition-colors duration-200">
      {/* Top Utility Bar (Matching Screenshot 1) */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 border-b border-white/5 dark:border-white/5 light:border-black/5">
        <div className="flex items-center gap-4">
          {/* Region Picker as in screenshot */}
          <div className="flex items-center gap-1.5 text-white dark:text-white light:text-gray-900 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#00A389]" />
            <span>Узбекистан · Ташкент (ул. Паркентская, 142/1)</span>
          </div>
          <span className="hidden md:inline text-gray-600">|</span>
          <span className="hidden md:inline text-[11px] text-[#00A389] font-semibold">
            Лицензия Минздрава РУз №08412-MED
          </span>
        </div>

        {/* Contact info, Socials & Theme Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+998712000103"
            className="hidden sm:flex items-center gap-1.5 hover:text-white dark:hover:text-white light:hover:text-black transition-colors font-mono font-bold"
          >
            <Phone className="w-3.5 h-3.5 text-[#00A389]" />
            <span>+998 (71) 200-01-03</span>
          </a>

          {/* Social Links */}
          <div className="flex items-center gap-2 pl-2 border-l border-white/10 dark:border-white/10 light:border-black/10">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-sky-400 hover:text-sky-300 transition-colors"
              title="Telegram канал"
            >
              <Send className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-pink-400 hover:text-pink-300 transition-colors"
              title="Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded hover:bg-white/10 text-red-500 hover:text-red-400 transition-colors"
              title="YouTube"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Theme Switcher: Clean Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 dark:bg-white/10 light:bg-gray-200 text-gray-200 dark:text-gray-200 light:text-gray-800 hover:text-white transition-colors cursor-pointer text-[11px] font-semibold"
            title="Переключить тему оформления"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Светлая</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">Темная</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo (Matching Screenshot 1 styling: "ПАРТИЯ НОВЫЕ ЛЮДИ | КЛИНИКА") */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 text-left cursor-pointer group shrink-0"
        >
          <img
            src="https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png"
            alt="Партия Новые Люди"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-400 light:text-gray-500">
              Медицинская клиника
            </div>
            <div className="text-base sm:text-lg font-black tracking-tight text-white dark:text-white light:text-gray-900 leading-tight uppercase font-sans">
              НОВЫЕ ЛЮДИ
            </div>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-semibold tracking-wide text-gray-300 dark:text-gray-300 light:text-gray-700">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`hover:text-[#00A389] transition-colors cursor-pointer relative py-1 ${
                activeSection === item.id
                  ? 'text-[#00A389] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#00A389]'
                  : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Section: Language + My Applications */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Languages RU | UZ | EN */}
          <div className="flex items-center bg-black/40 dark:bg-black/40 light:bg-gray-100 p-0.5 rounded-lg border border-white/10 dark:border-white/10 light:border-black/10">
            {(['ru', 'uz', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 text-[11px] font-black uppercase rounded transition-all cursor-pointer ${
                  currentLanguage === lang
                    ? 'bg-[#00A389] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Tickets / My Applications Button */}
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 dark:bg-white/10 light:bg-gray-100 hover:bg-[#00A389] hover:text-white text-white dark:text-white light:text-gray-900 border border-white/10 dark:border-white/10 light:border-black/10 text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#00A389] group-hover:text-white" />
            <span className="hidden sm:inline">{t.myApplications}</span>
            {applicationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#00A389] text-white text-[10px] font-black">
                {applicationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
