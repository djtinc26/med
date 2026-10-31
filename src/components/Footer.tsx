import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { MapPin, Phone, Mail, ShieldCheck, ExternalLink, Sparkles, Send } from 'lucide-react';

interface FooterProps {
  currentLanguage: Language;
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLanguage, onReplayIntro }) => {
  const t = translations[currentLanguage];

  return (
    <footer className="border-t border-white/10 dark:border-white/10 light:border-black/10 bg-[#070B12] dark:bg-[#070B12] light:bg-gray-100 text-gray-400 dark:text-gray-400 light:text-gray-600 text-xs py-14 px-4 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png"
              alt="Логотип клиники"
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 text-base block font-sans">
                {t.clinicName}
              </span>
              <span className="text-[11px] text-[#00A389] font-bold">
                Медицинская клиника · Ташкент
              </span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed">
            Частная клиника при поддержке партии «Новые люди». Программа 100% бесплатного лечения пенсионеров и льготных групп по электронным направлениям QR с портала my.gov.uz.
          </p>

          {/* Social Media Links */}
          <div className="pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 light:text-gray-500 block mb-2">
              Мы в социальных сетях:
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 dark:bg-white/10 light:bg-white flex items-center justify-center text-sky-400 hover:bg-[#00A389] hover:text-white transition-all shadow-sm"
                title="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 dark:bg-white/10 light:bg-white flex items-center justify-center text-pink-400 hover:bg-[#00A389] hover:text-white transition-all shadow-sm"
                title="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 dark:bg-white/10 light:bg-white flex items-center justify-center text-red-500 hover:bg-[#00A389] hover:text-white transition-all shadow-sm"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/10 dark:bg-white/10 light:bg-white flex items-center justify-center text-blue-500 hover:bg-[#00A389] hover:text-white transition-all shadow-sm"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contacts & Reception */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-white dark:text-white light:text-gray-900 text-xs mb-3">
            Адрес и круглосуточный прием
          </h4>
          <div className="flex items-start gap-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
            <MapPin className="w-4 h-4 text-[#00A389] shrink-0 mt-0.5" />
            <span>{t.footerAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-gray-700 mt-2">
            <Phone className="w-4 h-4 text-[#00A389] shrink-0" />
            <span className="font-mono font-bold">+998 (71) 200-01-03</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300 dark:text-gray-300 light:text-gray-700 mt-1">
            <Mail className="w-4 h-4 text-[#00A389] shrink-0" />
            <span className="font-mono">tashkent@newpeople.uz</span>
          </div>
          <p className="text-[11px] pt-1">
            Приемное отделение: Пн — Сб (08:00 — 20:00). Реанимация и экстренный прием 24/7.
          </p>
        </div>

        {/* State License & My.gov.uz */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-white dark:text-white light:text-gray-900 text-xs mb-3">
            Государственные гарантии РУз
          </h4>
          <div className="flex items-start gap-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>{t.footerLicense}</span>
          </div>
          <div className="pt-2">
            <a
              href="https://my.gov.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#00A389] hover:underline font-bold text-xs"
            >
              <span>{t.footerGovLink}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick links & Intro replay */}
        <div className="space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-white dark:text-white light:text-gray-900 text-xs mb-3">
            Интерактивные сервисы
          </h4>
          <ul className="space-y-2 text-gray-300 dark:text-gray-300 light:text-gray-700">
            <li>
              <a href="#benefits" className="hover:text-[#00A389] transition-colors">
                Инструкция по QR-направлению
              </a>
            </li>
            <li>
              <a href="#doctors" className="hover:text-[#00A389] transition-colors">
                Врачебные комитеты
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-[#00A389] transition-colors">
                3D витрина отделений
              </a>
            </li>
            <li>
              <a href="#booking" className="hover:text-[#00A389] transition-colors">
                Электронная запись на прием
              </a>
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onReplayIntro}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 dark:bg-white/10 light:bg-white text-white dark:text-white light:text-gray-900 text-[11px] font-bold border border-white/10 dark:border-white/10 light:border-black/10 hover:border-[#00A389] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00A389]" />
              <span>Посмотреть интро с логотипом</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 dark:border-white/5 light:border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <p>{t.footerRights}</p>
        <p>Медицинская клиника «Новые люди» · Ташкент, Узбекистан · 2026</p>
      </div>
    </footer>
  );
};
