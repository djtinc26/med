import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { TELEGRAM_BOT_URL, TELEGRAM_BOT_USERNAME } from '../utils/telegram';
import { ArrowRight, Send, ShieldCheck, MessageCircle } from 'lucide-react';

interface HeroSectionProps {
  currentLanguage: Language;
  onBookClick: () => void;
  onBenefitsClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLanguage,
  onBookClick,
  onBenefitsClick,
}) => {
  const t = translations[currentLanguage];

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-white/10 dark:border-white/10 light:border-slate-200">
      {/* Background Photography (Custom image requested by user) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://i.ibb.co/n8kGYsw4/Gemini-Generated-Image-xunzu4xunzu4xunz.jpg"
          alt="Клиника Новые люди Ташкент"
          className="w-full h-full object-cover object-center filter brightness-50 dark:brightness-40 light:brightness-90 scale-100 transition-transform duration-1000"
        />
        {/* Apple-style smooth gradient scrim ensuring high contrast & background visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/55 to-[#0B0F19]/30 dark:from-[#0B0F19] dark:via-[#0B0F19]/55 dark:to-[#0B0F19]/30 light:from-[#F8FAFC]/95 light:via-[#F8FAFC]/65 light:to-[#F8FAFC]/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full flex flex-col justify-between min-h-[82vh]">
        {/* Top-Left Hero Headline Area (Proportioned to not block the scene, matching user photo) */}
        <div className="max-w-2xl pt-2 sm:pt-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 dark:bg-black/60 light:bg-white/90 border border-white/20 dark:border-white/20 light:border-slate-300 text-[11px] font-bold uppercase tracking-wider text-[#00A389] backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00A389] animate-pulse" />
              <span>Республика Узбекистан · my.gov.uz</span>
            </div>

            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-[11px] font-bold text-sky-400 dark:text-sky-300 light:text-sky-700 light:bg-sky-100/80 backdrop-blur-md transition-all shadow-sm"
              title="Открыть Telegram-бота @NewPeople_agent"
            >
              <Send className="w-3 h-3" />
              <span>Бот @{TELEGRAM_BOT_USERNAME}</span>
            </a>
          </div>

          {/* Balanced Headline (apple-style typography, perfectly matched to photo) */}
          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black uppercase tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.1] max-w-xl">
            КЛИНИКА, КОТОРАЯ<br />СОЗДАЁТ БУДУЩЕЕ
          </h1>
        </div>

        {/* Center space remains open so the stage and delegate scene are visible */}
        <div className="flex-1 min-h-[80px]" />

        {/* Bottom Hero Layout: Left Manifest Text & Action Buttons, Right Notification Badge */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-8 pb-4">
          {/* Left Manifest & Action Buttons (Side by Side like on Screenshot 1) */}
          <div className="max-w-2xl space-y-3.5">
            <p className="text-sm sm:text-base text-gray-200 dark:text-gray-200 light:text-slate-800 leading-relaxed font-medium">
              Мы перестали ждать перемен в медицине и решили сами стать ими. Так впервые создана клиника передовых стандартов — «Новые люди».
            </p>
            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 light:text-slate-600 leading-relaxed">
              «Новые люди» обеспечивают прозрачную государственную заботу: 100% бесплатное лечение для пенсионеров (65+) и льготных категорий по направлению <span className="text-[#00A389] font-bold">my.gov.uz</span>. Без очередей и скрытых оплат.
            </p>

            {/* Two Action Buttons: Solid Teal + Dark Outline (Exact match to screenshot 1) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onBookClick}
                className="px-7 py-3.5 bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 text-center cursor-pointer shadow-lg shadow-[#00A389]/30 active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 group"
              >
                <span>ЗАПИСАТЬСЯ НА ПРИЁМ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 bg-black/70 hover:bg-black/90 dark:bg-black/70 dark:hover:bg-black/90 light:bg-white light:hover:bg-slate-100 text-white dark:text-white light:text-slate-900 border border-white/40 dark:border-white/40 light:border-slate-300 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 text-center cursor-pointer rounded-xl flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#00A389]" />
                <span>НАПИСАТЬ НАМ</span>
              </a>
            </div>
          </div>

          {/* Floating Action Badge (Matching screenshot 1 bottom-right card) */}
          <div className="w-full sm:w-80 p-5 rounded-2xl bg-[#161D2B]/90 dark:bg-[#161D2B]/90 light:bg-white/95 border border-white/20 dark:border-white/20 light:border-slate-200 shadow-2xl backdrop-blur-md shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00A389]">
                <ShieldCheck className="w-4 h-4" />
                <span>#НовыеЛюдиУзбекистан</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            </div>
            <p className="text-xs text-white dark:text-white light:text-slate-900 font-bold leading-snug">
              Присоединяйтесь к госпрограмме клиники уже сегодня!
            </p>
            <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-400 light:text-slate-500">
              100% субсидия на диагностику и стационар для льготных групп
            </p>
            <button
              onClick={onBookClick}
              className="mt-3.5 w-full py-2.5 bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
            >
              ПРИСОЕДИНИТЬСЯ
            </button>
          </div>
        </div>

        {/* Quantitative Proof Strip */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 dark:bg-black/40 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-gray-400 light:text-slate-500 block mb-0.5">Госпрограмма</span>
            <span className="text-lg sm:text-xl font-mono font-black text-[#00A389]">100% БЕСПЛАТНО</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-400 light:text-slate-500 block mt-0.5">Для пенсионеров 65+ по QR</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 dark:bg-black/40 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-gray-400 light:text-slate-500 block mb-0.5">Реакция врача</span>
            <span className="text-lg sm:text-xl font-mono font-black text-white dark:text-white light:text-slate-900">ЗА 5 МИНУТ</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-400 light:text-slate-500 block mt-0.5">Звонок дежурного координатора</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 dark:bg-black/40 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-gray-400 light:text-slate-500 block mb-0.5">Реестр пациентов</span>
            <span className="text-lg sm:text-xl font-mono font-black text-[#00A389]">12 400+</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-400 light:text-slate-500 block mt-0.5">Принято за 2024–2026</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-xl bg-black/40 dark:bg-black/40 light:bg-white/90 border border-white/10 dark:border-white/10 light:border-slate-200 backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase text-gray-400 dark:text-gray-400 light:text-slate-500 block mb-0.5">Стаж специалистов</span>
            <span className="text-lg sm:text-xl font-mono font-black text-white dark:text-white light:text-slate-900">12 — 28 ЛЕТ</span>
            <span className="text-[11px] text-gray-400 dark:text-gray-400 light:text-slate-500 block mt-0.5">Высшая квалификационная категория</span>
          </div>
        </div>
      </div>
    </section>
  );
};
