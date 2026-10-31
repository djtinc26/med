import React, { useRef, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { TELEGRAM_BOT_USERNAME, TELEGRAM_BOT_URL } from '../utils/telegram';
import { FileText, Sun, Moon, Send, Sparkles } from 'lucide-react';
import { setGlobalLanguage } from '../utils/translator';

interface AppleLiquidNavProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenSettings: () => void;
  onReplayIntro: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  applicationsCount: number;
}

export const AppleLiquidNav: React.FC<AppleLiquidNavProps> = ({
  currentLanguage,
  onLanguageChange,
  activeSection,
  onNavigate,
  onOpenSettings,
  onReplayIntro,
  theme,
  onToggleTheme,
  applicationsCount,
}) => {
  const navRef = useRef<HTMLElement | null>(null);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number }>({ left: 0, width: 0 });
  const buttonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const t = translations[currentLanguage];

  const navItems = [
    { id: 'hero', label: 'Главная' },
    { id: 'benefits', label: 'Госпрограмма (QR)' },
    { id: 'doctors', label: 'Врачи' },
    { id: 'actions', label: 'Дела' },
    { id: 'services', label: 'Отделения' },
    { id: 'booking', label: 'Запись 103' },
  ];

  // Update gliding pill position based on active item
  useEffect(() => {
    const btn = buttonsRef.current.get(activeSection);
    if (btn && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setPillStyle({
        left: btnRect.left - navRect.left,
        width: btnRect.width,
      });
    }
  }, [activeSection, currentLanguage]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  return (
    <header className="fixed top-4 z-50 w-full px-3 sm:px-6 flex justify-center pointer-events-none">
      <nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="liquid-nav relative flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full pointer-events-auto transition-all duration-300 max-w-full overflow-x-auto select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/20 light:border-black/10"
        style={{
          background:
            theme === 'dark'
              ? 'rgba(15, 23, 42, 0.75)'
              : 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(40px) saturate(210%)',
          WebkitBackdropFilter: 'blur(40px) saturate(210%)',
        }}
      >
        {/* Apple Dynamic Liquid Glare following cursor */}
        <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0">
          <div
            className="absolute inset-0 transition-opacity duration-300 mix-blend-overlay"
            style={{
              opacity: isHovered ? 0.6 : 0,
              background: `radial-gradient(circle 140px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.5) 0%, transparent 100%)`,
            }}
          />
        </div>

        {/* Brand Lockup */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/5 transition-all cursor-pointer z-10 shrink-0 group"
        >
          <img
            src="https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png"
            alt="Логотип клиники"
            className="w-7 h-7 object-contain group-hover:scale-105 transition-transform"
          />
          <div className="hidden md:flex flex-col text-left leading-none">
            <span className="text-[9px] font-mono font-bold tracking-widest text-[#00A389] uppercase">
              Клиника
            </span>
            <span className="text-xs font-black tracking-tight text-white dark:text-white light:text-gray-900 uppercase">
              НОВЫЕ ЛЮДИ
            </span>
          </div>
        </button>

        <div className="h-5 w-[1px] bg-white/15 dark:bg-white/15 light:bg-black/15 mx-0.5 shrink-0 z-10" />

        {/* Gliding Apple Active Pill (Spring Bouncy Physics) */}
        {pillStyle.width > 0 && (
          <div
            className="absolute top-2 h-[34px] rounded-full pointer-events-none z-[1] transition-all duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)] shadow-sm"
            style={{
              left: `${pillStyle.left}px`,
              width: `${pillStyle.width}px`,
              background:
                theme === 'dark'
                  ? 'rgba(0, 163, 137, 0.35)'
                  : 'rgba(0, 163, 137, 0.2)',
              border: '1px solid rgba(0, 163, 137, 0.5)',
            }}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1 z-10">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) buttonsRef.current.set(item.id, el);
                  else buttonsRef.current.delete(item.id);
                }}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#00A389] dark:text-[#00D2B4] light:text-[#008772]'
                    : 'text-gray-300 dark:text-gray-300 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-black'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="h-5 w-[1px] bg-white/15 dark:bg-white/15 light:bg-black/15 mx-0.5 shrink-0 z-10" />

        {/* Official Telegram Bot Live Deep Link */}
        <a
          href={TELEGRAM_BOT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 hover:text-sky-300 border border-sky-400/30 text-xs font-bold transition-all shrink-0 z-10 cursor-pointer"
          title="Открыть официального Telegram-бота @NewPeople_agent"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">@{TELEGRAM_BOT_USERNAME}</span>
        </a>

        {/* Tickets / My Passes Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 dark:bg-white/10 light:bg-gray-100 hover:bg-[#00A389] hover:text-white text-white dark:text-white light:text-gray-800 border border-white/15 dark:border-white/15 light:border-black/10 text-xs font-bold transition-all shrink-0 z-10 cursor-pointer"
          title="Мои талоны и история"
        >
          <FileText className="w-3.5 h-3.5 text-[#00A389]" />
          <span className="hidden sm:inline">Талоны</span>
          {applicationsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-[#00A389] text-white text-[10px] font-black">
              {applicationsCount}
            </span>
          )}
        </button>

        {/* Language selector */}
        <div className="flex items-center bg-black/40 dark:bg-black/40 light:bg-gray-200/80 p-0.5 rounded-full border border-white/10 dark:border-white/10 light:border-black/10 shrink-0 z-10">
          {(['ru', 'uz', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setGlobalLanguage(lang);
                onLanguageChange(lang);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                currentLanguage === lang
                  ? 'bg-[#00A389] text-white shadow-sm'
                  : 'text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Theme Switcher Sun / Moon */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 dark:bg-white/10 light:bg-gray-200 hover:bg-[#00A389] hover:text-white text-gray-200 dark:text-gray-200 light:text-gray-800 transition-all cursor-pointer shrink-0 z-10"
          title="Сменить тему оформления (Светлая / Темная)"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Replay Burning Intro Button */}
        <button
          onClick={onReplayIntro}
          className="p-1.5 rounded-full hover:bg-white/15 text-amber-400 transition-all shrink-0 z-10 cursor-pointer"
          title="Запустить горящее интро с логотипом"
          aria-label="Replay intro"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </nav>
    </header>
  );
};
