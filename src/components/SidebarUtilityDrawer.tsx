import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { setGlobalLanguage } from '../utils/translator';
import {
  Activity,
  Ambulance,
  Pill,
  MapPin,
  Clock,
  Search,
  X,
  ChevronRight,
  PhoneCall,
  Sun,
  Moon,
  CheckCircle2,
  Building,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface SidebarUtilityDrawerProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigateToBooking: () => void;
}

export const SidebarUtilityDrawer: React.FC<SidebarUtilityDrawerProps> = ({
  currentLanguage,
  onLanguageChange,
  theme,
  onToggleTheme,
  onNavigateToBooking,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'radar' | 'meds' | 'floors' | 'triage' | 'check'>('radar');

  // Interactive Meds Search State
  const [medQuery, setMedQuery] = useState('');
  // Interactive Ticket Validator State
  const [ticketQuery, setTicketQuery] = useState('');
  const [ticketResult, setTicketResult] = useState<{ status: 'valid' | 'invalid' | null; message?: string }>({ status: null });
  // Floor Navigator State
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  const t = translations[currentLanguage];

  const emergencyUnits = [
    { id: '103-04', district: 'Мирзо-Улугбекский р-н', status: 'В пути к стационару', eta: '4 мин', ready: true, doctor: 'Д-р Каримов' },
    { id: '103-12', district: 'Юнусабадский р-н', status: 'На дежурстве / свободна', eta: '6 мин', ready: true, doctor: 'Д-р Рахимова' },
    { id: '103-07', district: 'Чиланзарский р-н', status: 'На дежурстве / свободна', eta: '9 мин', ready: true, doctor: 'Д-р Мирзаев' },
    { id: '103-19', district: 'Яккасарайский р-н', status: 'На вызове (стабилизация)', eta: '14 мин', ready: false, doctor: 'Д-р Юсупов' },
  ];

  const stateMedicines = [
    { name: 'Метформин 500/850 мг', category: 'Сахарный диабет 2 типа', stock: 'В наличии (420 уп.)', quota: '0 сум по QR' },
    { name: 'Эналаприл 10 мг', category: 'Артериальная гипертензия', stock: 'В наличии (310 уп.)', quota: '0 сум по QR' },
    { name: 'Аторвастатин 20 мг', category: 'Гиперхолестеринемия', stock: 'В наличии (185 уп.)', quota: '0 сум по QR' },
    { name: 'Бисопролол 5 мг', category: 'Ишемическая болезнь сердца', stock: 'В наличии (240 уп.)', quota: '0 сум по QR' },
    { name: 'Омепразол 20 мг', category: 'Гастропротекция', stock: 'В наличии (190 уп.)', quota: '0 сум по QR' },
    { name: 'Сальбутамол аэрозоль 100 мкг', category: 'Бронхиальная астма', stock: 'В наличии (95 уп.)', quota: '0 сум по QR' },
    { name: 'Амлодипин 5 мг', category: 'Сердечно-сосудистые заболевания', stock: 'В наличии (210 уп.)', quota: '0 сум по QR' },
  ];

  const filteredMeds = stateMedicines.filter((m) =>
    m.name.toLowerCase().includes(medQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(medQuery.toLowerCase())
  );

  const floorPlans: Record<number, { title: string; rooms: string[]; equip: string }> = {
    1: {
      title: '1 ЭТАЖ — ПРИЁМНЫЙ ПОКОЙ И ЛУЧЕВАЯ ДИАГНОСТИКА',
      rooms: [
        'Каб. 101–103: Регистратура и электронная очередь QR',
        'Каб. 104: Томограф МРТ 1.5 Tesla Siemens Magnetom',
        'Каб. 106: Компьютерная томография (КТ) 64 среза',
        'Каб. 108: Клиническая экспресс-лаборатория Roche',
        'Каб. 110: Аптечный пункт льготных медикаментов (0 сум)',
      ],
      equip: 'Siemens Magnetom 1.5T, Roche Cobas c311, Sysmex XN-550',
    },
    2: {
      title: '2 ЭТАЖ — ДИАГНОСТИЧЕСКИЙ КАРДИО-НЕВРОЛОГИЧЕСКИЙ ЦЕНТР',
      rooms: [
        'Каб. 201–203: Кабинеты ведущих кардиологов',
        'Каб. 204: Эхокардиография УЗИ Philips Affiniti 70',
        'Каб. 205: Суточный мониторинг ЭКГ (Холтер) и СМАД',
        'Каб. 207: Компьютерная электроэнцефалография (ЭЭГ)',
        'Каб. 209: Заведующая неврологией к.м.н. Д. Каримова',
      ],
      equip: 'Philips Affiniti 70, Schiller Cardiovit AT-102, Нейрософт Колибри',
    },
    3: {
      title: '3 ЭТАЖ — ХИРУРГИЧЕСКИЙ БЛОК И ПИТ',
      rooms: [
        'Оперблок 1–2: 4K Лапароскопические стойки Karl Storz',
        'Оперблок 3: Сосудистая и ангиографическая операционная',
        'Палаты 301–308: Дневной хирургический стационар 24ч',
        'ПИТ: Палата интенсивной терапии и реанимации (6 коек)',
      ],
      equip: 'Karl Storz IMAGE1 S 4K, аппараты ИВЛ Dräger Fabius Plus',
    },
    4: {
      title: '4 ЭТАЖ — ПЕДИАТРИЯ И РЕАБИЛИТАЦИОННЫЙ ЦЕНТР',
      rooms: [
        'Каб. 401–404: Детское поликлиническое отделение',
        'Каб. 405: Прививочный кабинет вакцин Минздрава РУз',
        'Зал 407: Кинезиотерапия и робот-ассистированная ЛФК',
        'Каб. 409: Магнитная и лазерная физиотерапия BTL',
      ],
      equip: 'BTL Super Inductive System, BTL-4000 Smart, Beco Kinetics',
    },
  };

  const handleValidateTicket = () => {
    const q = ticketQuery.trim().toUpperCase();
    if (!q) {
      setTicketResult({ status: null });
      return;
    }
    if (q.includes('NP') || q.length >= 6) {
      setTicketResult({
        status: 'valid',
        message: `Талон #${q} верифицирован в Единой системе Минздрава РУз. Статус: ПОДТВЕРЖДЕН (0 сум по my.gov.uz). Направление действительно 60 дней.`,
      });
    } else {
      setTicketResult({
        status: 'invalid',
        message: 'Номер не найден в едином реестре клиники. Проверьте формат талона (например, NP-2026-XXXX).',
      });
    }
  };

  const handleLangSelect = (lang: Language) => {
    setGlobalLanguage(lang);
    onLanguageChange(lang);
  };

  return (
    <>
      {/* Floating Edge Dock Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-slate-900/90 dark:bg-slate-900/95 light:bg-white text-white dark:text-white light:text-slate-800 border-y border-r border-[#00A389]/40 rounded-r-2xl py-3 px-2 sm:px-2.5 shadow-[0_10px_30px_rgba(0,163,137,0.3)] hover:pr-3.5 transition-all duration-200 cursor-pointer flex flex-col items-center gap-2 group backdrop-blur-md"
        title="Открыть медицинские сервисы и статус реанимобилей 103"
      >
        <div className="w-8 h-8 rounded-xl bg-[#00A389]/20 flex items-center justify-center text-[#00A389] group-hover:scale-110 transition-transform">
          <Activity className="w-4 h-4" />
        </div>
        <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-mono font-bold tracking-widest text-[#00A389] uppercase">
          СЕРВИСЫ 103
        </span>
        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-fadeIn"
        />
      )}

      {/* Slide-out Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-full sm:w-[480px] bg-slate-950 dark:bg-[#0B0F19] light:bg-[#F8FAFC] text-white dark:text-white light:text-slate-900 border-r border-white/10 dark:border-white/10 light:border-slate-300 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900 dark:bg-[#111827] light:bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00A389]/20 border border-[#00A389]/40 flex items-center justify-center text-[#00A389]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight text-white dark:text-white light:text-slate-900">
                СЕРВИСЫ КЛИНИКИ «НОВЫЕ ЛЮДИ»
              </h3>
              <p className="text-[11px] font-mono text-[#00A389]">
                Оперативный штаб · Ташкент 103
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-slate-100 text-gray-400 light:text-slate-500 hover:text-white light:hover:text-slate-900 transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Utility Tabs (Distinct purposeful features) */}
        <div className="grid grid-cols-5 p-2 bg-slate-900/50 dark:bg-[#0E1524] light:bg-slate-100 border-b border-white/10 dark:border-white/10 light:border-slate-200 text-center text-[10px] font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('radar')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'radar'
                ? 'bg-[#00A389] text-white shadow-sm'
                : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5" />
            <span>Радар 103</span>
          </button>

          <button
            onClick={() => setActiveTab('meds')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'meds'
                ? 'bg-[#00A389] text-white shadow-sm'
                : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Лекарства</span>
          </button>

          <button
            onClick={() => setActiveTab('floors')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'floors'
                ? 'bg-[#00A389] text-white shadow-sm'
                : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Этажи</span>
          </button>

          <button
            onClick={() => setActiveTab('triage')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'triage'
                ? 'bg-[#00A389] text-white shadow-sm'
                : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Очередь</span>
          </button>

          <button
            onClick={() => setActiveTab('check')}
            className={`py-2 px-1 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-1 ${
              activeTab === 'check'
                ? 'bg-[#00A389] text-white shadow-sm'
                : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Талон</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* TAB 1: RADAR 103 */}
          {activeTab === 'radar' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-3.5 rounded-xl bg-red-950/30 dark:bg-red-950/40 light:bg-red-50 border border-red-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-red-400 light:text-red-700 text-xs uppercase">
                    Экстренная служба скорой помощи 103
                  </h4>
                  <p className="text-[11px] text-gray-300 light:text-slate-700 mt-0.5">
                    Прямой канал связи с дежурным диспетчером приёмного отделения клиники «Новые люди» (г. Ташкент).
                  </p>
                  <a
                    href="tel:+998712000103"
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Позвонить 103: +998 71 200-01-03</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono text-gray-400 light:text-slate-500 uppercase font-bold block">
                  Текущий статус бригад реанимобилей:
                </span>
                {emergencyUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-3 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-[#00A389] text-xs">
                          {unit.id}
                        </span>
                        <span className="font-bold text-white dark:text-white light:text-slate-900 text-xs">
                          {unit.district}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 light:text-slate-500 mt-0.5">
                        {unit.status} · {unit.doctor}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded font-mono font-black text-[11px] bg-emerald-500/20 text-emerald-400 light:text-emerald-700 border border-emerald-500/30">
                        {unit.eta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FREE MEDS 0 SUM */}
          {activeTab === 'meds' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-xs uppercase mb-1">
                  Справочник льготных лекарств (0 сум)
                </h4>
                <p className="text-[11px] text-gray-400 light:text-slate-600 leading-relaxed">
                  Жизненно важные препараты, отпускаемые в аптеке клиники «Новые люди» бесплатно по электронному рецепту QR my.gov.uz.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={medQuery}
                  onChange={(e) => setMedQuery(e.target.value)}
                  placeholder="Поиск по названию или заболеванию..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-gray-500 text-xs focus:outline-none focus:border-[#00A389]"
                />
              </div>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {filteredMeds.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-1 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white dark:text-white light:text-slate-900 text-xs">
                        {med.name}
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-[#00A389]/20 text-[#00A389]">
                        {med.quota}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400 light:text-slate-500">
                      {med.category}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 light:text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{med.stock}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FLOOR NAVIGATOR */}
          {activeTab === 'floors' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-xs uppercase mb-1">
                  Навигатор по корпусу клиники
                </h4>
                <p className="text-[11px] text-gray-400 light:text-slate-600">
                  Ташкент, ул. Амира Темура, 107B. Быстрый поиск кабинетов и отделений.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFloor(f)}
                    className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs uppercase transition-all cursor-pointer ${
                      selectedFloor === f
                        ? 'bg-[#00A389] text-white shadow-md'
                        : 'bg-slate-900 dark:bg-[#161D2B] light:bg-slate-200 text-gray-300 light:text-slate-700 hover:text-white'
                    }`}
                  >
                    {f} Этаж
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 space-y-3 shadow-xs">
                <h5 className="font-black text-xs text-[#00A389] uppercase tracking-wide">
                  {floorPlans[selectedFloor].title}
                </h5>

                <div className="space-y-1.5">
                  {floorPlans[selectedFloor].rooms.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px] text-gray-300 light:text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] mt-1 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 dark:border-white/10 light:border-slate-200">
                  <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase block mb-0.5">
                    Установленное оборудование:
                  </span>
                  <span className="text-[11px] font-medium text-white dark:text-white light:text-slate-900">
                    {floorPlans[selectedFloor].equip}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRIAGE QUEUE BOARD */}
          {activeTab === 'triage' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-xs uppercase mb-1">
                  Табло электронной очереди онлайн
                </h4>
                <p className="text-[11px] text-gray-400 light:text-slate-600">
                  Живое обновление очереди к дежурным врачам и на диагностику.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200 text-center space-y-2 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-gray-400 light:text-slate-500">
                  Текущий вызываемый талон
                </span>
                <div className="text-3xl font-mono font-black text-[#00A389] tracking-wider animate-pulse">
                  NP-2026-0841
                </div>
                <div className="text-xs text-gray-300 light:text-slate-700">
                  Кабинет 204 · Кардиология · Д-р Нечаев
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200">
                  <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase block">Среднее время</span>
                  <span className="text-lg font-mono font-black text-white dark:text-white light:text-slate-900">4.2 МИН</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-200">
                  <span className="text-[10px] font-mono text-gray-400 light:text-slate-500 uppercase block">В очереди</span>
                  <span className="text-lg font-mono font-black text-[#00A389]">3 ЧЕЛ</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 dark:bg-emerald-950/30 light:bg-emerald-50 border border-emerald-500/30 text-emerald-400 light:text-emerald-700 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>МРТ и КТ кабинеты: свободный слот через 18 минут</span>
              </div>
            </div>
          )}

          {/* TAB 5: TICKET VALIDATOR */}
          {activeTab === 'check' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h4 className="font-bold text-white dark:text-white light:text-slate-900 text-xs uppercase mb-1">
                  Быстрый валидатор талона / направления
                </h4>
                <p className="text-[11px] text-gray-400 light:text-slate-600">
                  Введите номер вашего талона или ПИНФЛ для мгновенной проверки подлинности.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={ticketQuery}
                  onChange={(e) => setTicketQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleValidateTicket()}
                  placeholder="Например: NP-2026-9142 или ПИНФЛ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-slate-300 text-white dark:text-white light:text-slate-900 placeholder-gray-500 text-xs focus:outline-none focus:border-[#00A389]"
                />

                <button
                  onClick={handleValidateTicket}
                  className="w-full py-2.5 bg-[#00A389] hover:bg-[#008772] text-white font-bold text-xs uppercase rounded-xl transition-all cursor-pointer shadow-md"
                >
                  ПРОВЕРИТЬ В РЕЕСТРЕ
                </button>
              </div>

              {ticketResult.status === 'valid' && (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 dark:bg-emerald-950/40 light:bg-emerald-50 border border-emerald-500/40 text-emerald-300 light:text-emerald-800 text-[11px] space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 light:text-emerald-700">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Верифицировано в my.gov.uz</span>
                  </div>
                  <p>{ticketResult.message}</p>
                </div>
              )}

              {ticketResult.status === 'invalid' && (
                <div className="p-3.5 rounded-xl bg-red-950/40 dark:bg-red-950/40 light:bg-red-50 border border-red-500/40 text-red-300 light:text-red-800 text-[11px] space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-1.5 font-bold text-red-400 light:text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span>Талон не найден</span>
                  </div>
                  <p>{ticketResult.message}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Bar with Theme & Language sync */}
        <div className="p-4 border-t border-white/10 dark:border-white/10 light:border-slate-200 bg-slate-900 dark:bg-[#111827] light:bg-white flex items-center justify-between">
          {/* Quick language toggle */}
          <div className="flex items-center gap-1">
            {(['ru', 'uz', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => handleLangSelect(l)}
                className={`px-2 py-1 rounded-md text-[10px] font-black uppercase transition-all cursor-pointer ${
                  currentLanguage === l
                    ? 'bg-[#00A389] text-white shadow-xs'
                    : 'text-gray-400 light:text-slate-600 hover:text-white light:hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Quick Theme Switch */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 dark:bg-white/5 light:bg-slate-100 hover:bg-[#00A389] hover:text-white text-gray-300 dark:text-gray-300 light:text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Светлая тема</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span>Тёмная тема</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
