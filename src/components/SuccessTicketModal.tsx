import React from 'react';
import { ApplicationRecord, Language } from '../types';
import { translations } from '../i18n/translations';
import { getBotTicketDeepLink, TELEGRAM_BOT_USERNAME } from '../utils/telegram';
import { CheckCircle2, QrCode, Printer, X, ShieldCheck, Send, ExternalLink } from 'lucide-react';

interface SuccessTicketModalProps {
  record: ApplicationRecord | null;
  currentLanguage: Language;
  onClose: () => void;
}

export const SuccessTicketModal: React.FC<SuccessTicketModalProps> = ({
  record,
  currentLanguage,
  onClose,
}) => {
  if (!record) return null;
  const t = translations[currentLanguage];

  const handlePrint = () => {
    window.print();
  };

  const botLink = getBotTicketDeepLink(record.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#111827] dark:bg-[#111827] light:bg-white border border-white/20 dark:border-white/20 light:border-black/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-white dark:text-white light:text-gray-900">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-gray-100 text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black transition-all cursor-pointer"
          aria-label="Close ticket"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header */}
        <div className="text-center pb-5 border-b border-dashed border-white/20 dark:border-white/20 light:border-black/20">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mb-2.5">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00A389]">
            {t.ticketStatus}
          </span>
          <h3 className="text-2xl font-black uppercase tracking-tight mt-1 font-sans">
            {t.successModalTitle}
          </h3>
          <div className="mt-2.5 inline-block px-4 py-1.5 rounded-lg bg-black/50 dark:bg-black/50 light:bg-gray-100 border border-white/10 dark:border-white/10 light:border-black/10">
            <span className="text-xs text-gray-400 mr-2 uppercase font-bold">Талон №</span>
            <span className="text-2xl font-mono font-black text-[#00A389] tracking-widest">
              #{record.id}
            </span>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="py-5 space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-bold uppercase text-[11px]">Пациент:</span>
            <span className="font-black text-white dark:text-white light:text-gray-900 text-right">{record.name}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-bold uppercase text-[11px]">Телефон:</span>
            <span className="font-mono font-bold text-white dark:text-white light:text-gray-900">
              {record.phone}
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-bold uppercase text-[11px]">Отделение:</span>
            <span className="font-bold text-white dark:text-white light:text-gray-900">{record.serviceName}</span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-bold uppercase text-[11px]">Льготный статус:</span>
            <span className="font-black text-[#10B981] flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>{record.isStateProgram ? '100% субсидия (0 сум)' : 'Частный прием'}</span>
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600 font-bold uppercase text-[11px]">Время записи:</span>
            <span className="font-mono text-gray-300 dark:text-gray-300 light:text-gray-700">
              {record.date} · {record.time}
            </span>
          </div>
        </div>

        {/* QR Code Matrix Area */}
        <div className="p-3.5 rounded-xl bg-black/40 dark:bg-black/40 light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center gap-3.5">
          <div className="w-18 h-18 bg-white p-1 rounded-lg shrink-0 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="5" y="5" width="26" height="26" fill="black" />
              <rect x="9" y="9" width="18" height="18" fill="white" />
              <rect x="13" y="13" width="10" height="10" fill="black" />

              <rect x="69" y="5" width="26" height="26" fill="black" />
              <rect x="73" y="9" width="18" height="18" fill="white" />
              <rect x="77" y="13" width="10" height="10" fill="black" />

              <rect x="5" y="69" width="26" height="26" fill="black" />
              <rect x="9" y="73" width="18" height="18" fill="white" />
              <rect x="13" y="77" width="10" height="10" fill="black" />

              <rect x="36" y="8" width="6" height="6" fill="black" />
              <rect x="46" y="16" width="6" height="6" fill="black" />
              <rect x="56" y="8" width="6" height="6" fill="black" />
              <rect x="8" y="36" width="6" height="6" fill="black" />
              <rect x="38" y="38" width="8" height="8" fill="#00A389" />
              <rect x="52" y="38" width="8" height="8" fill="black" />
              <rect x="38" y="52" width="8" height="8" fill="black" />
              <rect x="52" y="52" width="8" height="8" fill="#00A389" />
              <rect x="68" y="38" width="6" height="6" fill="black" />
              <rect x="38" y="72" width="6" height="6" fill="black" />
            </svg>
          </div>

          <div className="text-[11px] text-gray-400 dark:text-gray-400 light:text-gray-600 leading-snug">
            <p className="font-bold text-white dark:text-white light:text-gray-900">
              Электронная верификация через my.gov.uz
            </p>
            <p className="mt-0.5 font-mono text-[10px] text-gray-500 break-all">
              {record.qrData}
            </p>
          </div>
        </div>

        {/* Telegram Bot Action Callout */}
        <div className="mt-4 p-3 rounded-lg bg-sky-950/40 dark:bg-sky-950/40 light:bg-sky-50 border border-sky-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="text-xs text-sky-200 dark:text-sky-200 light:text-sky-800 font-medium">
              Получить талон в Telegram:
            </span>
          </div>

          <a
            href={botLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-600 text-[#0B0F19] text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <span>@{TELEGRAM_BOT_USERNAME}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-lg bg-white/10 dark:bg-white/10 light:bg-gray-100 hover:bg-white/20 border border-white/15 dark:border-white/15 light:border-black/10 text-white dark:text-white light:text-gray-900 font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Печать талона</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase transition-all cursor-pointer"
          >
            {t.closeTicket}
          </button>
        </div>
      </div>
    </div>
  );
};
