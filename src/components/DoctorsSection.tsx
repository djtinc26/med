import React, { useState } from 'react';
import { Doctor, Language } from '../types';
import { translations } from '../i18n/translations';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Award, ShieldCheck, Check } from 'lucide-react';

interface DoctorsSectionProps {
  doctors: Doctor[];
  currentLanguage: Language;
  onSelectDoctor: (doctor: Doctor) => void;
}

interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  committee: string;
  barColor: string;
  avatar: string;
  experience: number;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  doctors,
  currentLanguage,
  onSelectDoctor,
}) => {
  const [activeActionTab, setActiveActionTab] = useState<string>('care');
  const [committeeIndex, setCommitteeIndex] = useState(0);
  const [verticalIndex, setVerticalIndex] = useState(0);

  const committeeMembers: CommitteeMember[] = [
    {
      id: 'doc-1',
      name: 'АЛИШЕР ЮЛДАШЕВ',
      role: 'Главный врач, кардиохирург высшей категории',
      committee: 'Комитет хирургии сердца',
      barColor: '#0F172A', // Dark Slate
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KS78V4AJ8XAFZ5E7NME3T0KS.png',
      experience: 24,
    },
    {
      id: 'doc-2',
      name: 'ДИЛОРОМ КАРИМОВА',
      role: 'Заведующая отделением неврологии, к.м.н.',
      committee: 'Комитет клинической неврологии',
      barColor: '#00A389', // Signature Teal
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KS79X2NN13AJXK4D5W671S0K.png',
      experience: 19,
    },
    {
      id: 'doc-3',
      name: 'ШУХРАТ РАХИМОВ',
      role: 'Ведущий эндохирург Karl Storz',
      committee: 'Комитет малоинвазивной хирургии',
      barColor: '#334155', // Slate
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KJF8NFAN9DH6J74J4BEVH0AY.png',
      experience: 16,
    },
    {
      id: 'doc-4',
      name: 'ФАРХОД МИРЗАЕВ',
      role: 'Руководитель центра лучевой диагностики',
      committee: 'Комитет томографии Siemens',
      barColor: '#581C87', // Plum / Dark purple
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KNP1Q290H2QPGN9PDTW6K69A.png',
      experience: 18,
    },
    {
      id: 'doc-5',
      name: 'НАРГИЗА АБДУЛЛАЕВА',
      role: 'Педиатр-неонатолог высшей категории',
      committee: 'Комитет детского здоровья',
      barColor: '#1E293B', // Navy
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KKTV3JK99S4XAZ0ASBY6G5PZ.png',
      experience: 14,
    },
    {
      id: 'doc-6',
      name: 'ОЛЬГА СТЕПЧЕНКО',
      role: 'Руководитель восстановительной медицины',
      committee: 'Комитет нейрореабилитации BTL',
      barColor: '#064E3B', // Dark emerald
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KJXKN7M3N78BVSN57SFCK1PT.png',
      experience: 15,
    },
    {
      id: 'doc-7',
      name: 'АЗИЗ МУХАМЕДОВ',
      role: 'Заведующий экспресс-лабораторией Roche',
      committee: 'Комитет клинических анализов',
      barColor: '#831843', // Deep Wine
      avatar: 'https://newpeople.ru/image-bucket-np-prod/committees/01KKP32PVWXYQ1N4B0ZVSSFVAF.png',
      experience: 17,
    },
  ];

  const handleNextCommittee = () => {
    setCommitteeIndex((prev) => (prev + 1) % committeeMembers.length);
  };

  const handlePrevCommittee = () => {
    setCommitteeIndex((prev) => (prev - 1 + committeeMembers.length) % committeeMembers.length);
  };

  const handleNextVertical = () => {
    setVerticalIndex((prev) => (prev + 1) % committeeMembers.length);
  };

  const handlePrevVertical = () => {
    setVerticalIndex((prev) => (prev - 1 + committeeMembers.length) % committeeMembers.length);
  };

  // Reorder for vertical display (3 items shown)
  const verticalSlice = [
    committeeMembers[verticalIndex % committeeMembers.length],
    committeeMembers[(verticalIndex + 1) % committeeMembers.length],
    committeeMembers[(verticalIndex + 2) % committeeMembers.length],
  ];

  return (
    <div id="doctors" className="py-20 border-b border-white/10 dark:border-white/10 light:border-black/10">
      {/* ============================================================== */}
      {/* 1. БЛОК: [ врачебный консилиум ] ВРАЧИ ЗДОРОВОГО ЧЕЛОВЕКА       */}
      {/* (ТОЧНО КАК НА СКРИНШОТЕ 2)                                      */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 mb-24 relative">
        {/* Subtle Watermark Word behind section */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-8xl sm:text-9xl font-black uppercase text-white/[0.02] dark:text-white/[0.02] light:text-black/[0.03] select-none pointer-events-none tracking-widest hidden md:block">
          НОВЫЕ ЛЮДИ
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (Matching Screenshot 2) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-mono font-bold tracking-widest text-[#00A389] uppercase">
              [ врачебный совет клиники ]
            </div>

            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 font-sans">
              ВРАЧИ ЗДОРОВОГО ЧЕЛОВЕКА
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed font-normal max-w-xl">
              <p>
                Мы объединили смелых, компетентных и открытых врачей, чтобы принести в медицину Узбекистана новый взгляд, прозрачные решения и прогрессивные клинические протоколы. Наши доктора — первые, кто заговорил с пациентами на их языке.
              </p>
              <p>
                Мы работаем в Ташкенте и координируем направления со всеми регионами республики в рамках единой государственной медицинской системы.
              </p>
              <p>
                Если помощь нужна прямо сейчас, наши специалисты добиваются справедливости: гарантируют 100% бесплатное лечение для пенсионеров и льготников, защищают пациентов от навязанных платных процедур и обеспечивают заботу экспертного уровня.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#booking"
                className="inline-block px-8 py-3.5 bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow"
              >
                ЗАПИСАТЬСЯ НА КОНСИЛИУМ
              </a>
            </div>
          </div>

          {/* Right Column: Vertical stacked doctor cards with Up/Down buttons (Matching Screenshot 2) */}
          <div className="lg:col-span-5 relative flex items-center gap-4">
            <div className="flex-1 space-y-3">
              {verticalSlice.map((doc, idx) => (
                <div
                  key={doc.id + idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 shadow-md hover:border-[#00A389] transition-all cursor-pointer"
                  onClick={() => {
                    const match = doctors.find((d) => d.id === doc.id);
                    if (match) onSelectDoctor(match);
                  }}
                >
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded bg-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-black text-white dark:text-white light:text-gray-900 uppercase tracking-tight truncate">
                      {doc.name}
                    </h4>
                    <p className="text-xs text-[#00A389] font-semibold mt-0.5 truncate">
                      {doc.committee}
                    </p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-400 light:text-gray-500 mt-1 line-clamp-1">
                      {doc.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Up / Down Navigation Controls (Matching Screenshot 2) */}
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={handlePrevVertical}
                className="w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 bg-black/40 dark:bg-black/40 light:bg-gray-100 flex items-center justify-center text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] transition-all cursor-pointer"
                title="Предыдущий специалист"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextVertical}
                className="w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 bg-black/40 dark:bg-black/40 light:bg-gray-100 flex items-center justify-center text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] transition-all cursor-pointer"
                title="Следующий специалист"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. БЛОК: [ комитеты ] ДЕЛАЕМ ТО, В ЧЁМ РАЗБИРАЕМСЯ              */}
      {/* (ТОЧНО КАК НА СКРИНШОТЕ 3: ПОРТРЕТ С ВОЛНИСТЫМ ФОНОМ И ШЛЯПОЙ) */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-mono font-bold tracking-widest text-[#00A389] uppercase mb-1">
              [ экспертные комитеты клиники ]
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 font-sans">
              ДЕЛАЕМ ТО, В ЧЁМ РАЗБИРАЕМСЯ
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="max-w-xl text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed hidden lg:block">
              Кардиология, хирургия, педиатрия или высокоточная диагностика — каждым направлением в клинике руководит свой комитет. Мы собираем сильнейших экспертов, организуем консилиумы и вместе находим решение сложных задач без потери времени.
            </p>

            {/* Carousel navigation arrows < > (Matching Screenshot 3) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handlePrevCommittee}
                className="w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 bg-black/40 dark:bg-black/40 light:bg-gray-100 flex items-center justify-center text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] transition-all cursor-pointer"
                title="Назад"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextCommittee}
                className="w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 bg-black/40 dark:bg-black/40 light:bg-gray-100 flex items-center justify-center text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] transition-all cursor-pointer"
                title="Вперед"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Row of Committee Cards (Matching Screenshot 3 design with wave wireframe background) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
          {committeeMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => {
                const match = doctors.find((d) => d.id === member.id);
                if (match) onSelectDoctor(match);
              }}
              className="relative rounded-lg overflow-hidden bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 shadow-lg group hover:-translate-y-1 hover:border-[#00A389] transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Image Container with Geometric Line-Art Waves Watermark (as in Screenshot 3!) */}
              <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-900/40">
                {/* SVG Geometric Waves Background (Signature Party Graphic from Screenshot 3) */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-30 stroke-[#00A389] pointer-events-none"
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
                  src={member.avatar}
                  alt={member.name}
                  className="relative z-10 w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Floating "Открыть профиль" badge on hover */}
                <div className="absolute top-2.5 right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-sm border border-white/20 text-[#00D2B4] px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
                  Профиль →
                </div>
              </div>

              {/* Distinctive Colored Bottom Nameplate (Matching Screenshot 3!) */}
              <div
                className="p-3 text-center text-white relative z-20 transition-all duration-300 group-hover:brightness-110"
                style={{ backgroundColor: member.barColor }}
              >
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight leading-tight">
                  {member.name}
                </h4>
                <p className="text-[10px] text-gray-300/90 mt-1 line-clamp-1 leading-snug">
                  {member.committee}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. БЛОК: ДЕЛА ВАЖНЕЕ СЛОВ (ТОЧНО КАК НА СКРИНШОТЕ 3)            */}
      {/* ============================================================== */}
      <section id="actions" className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 mb-6 font-sans">
          ДЕЛА ВАЖНЕЕ СЛОВ
        </h2>

        {/* Category Tabs (Matching Screenshot 3: Active Solid Teal, Inactive Clean Gray) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 select-none">
          {[
            { id: 'care', label: 'Помощь и забота о людях (Госпрограмма 65+)' },
            { id: 'cardio', label: 'Кардиология и сосуды' },
            { id: 'neuro', label: 'Неврология и головной мозг' },
            { id: 'pediatric', label: 'Детское здоровье и педиатрия' },
            { id: 'surgery', label: 'Малоинвазивная хирургия 24ч' },
            { id: 'diagnostics', label: 'Высокоточная диагностика Siemens' },
          ].map((tab) => {
            const isActive = activeActionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveActionTab(tab.id)}
                className={`px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider whitespace-nowrap rounded transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00A389] text-white shadow-md'
                    : 'bg-[#1E2638] dark:bg-[#1E2638] light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Action Content based on selected tab */}
        <div className="p-6 sm:p-8 rounded-lg bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 shadow-xl">
          {activeActionTab === 'care' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="text-xs font-mono font-bold text-[#00A389] uppercase tracking-wider">
                  Инициатива партии «Новые люди» & Минздрава РУз
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                  100% БЕСПЛАТНОЕ ЛЕЧЕНИЕ ДЛЯ ПЕНСИОНЕРОВ (65+) И ЛЬГОТНИКОВ
                </h3>
                <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  Полная диагностика, медикаментозное обеспечение, пребывание в палате и профильная реабилитация проводятся с нулевой оплатой со стороны пациента по электронному направлению с матричным QR-кодом портала my.gov.uz.
                </p>
                <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-gray-200 dark:text-gray-200 light:text-gray-800">
                  <div className="flex items-center gap-1.5 text-[#00A389]">
                    <Check className="w-4 h-4" />
                    <span>0 сум за диагностику</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00A389]">
                    <Check className="w-4 h-4" />
                    <span>0 сум за лекарства</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#00A389]">
                    <Check className="w-4 h-4" />
                    <span>0 сум за стационар</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10 text-center">
                <div className="text-3xl sm:text-4xl font-mono font-black text-[#00A389]">
                  12 400+
                </div>
                <div className="text-xs font-bold text-gray-400 mt-1 uppercase">
                  Пациентов уже получили помощь в 2024–2026
                </div>
                <a
                  href="#benefits"
                  className="mt-4 block w-full py-2.5 bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase rounded transition-colors text-center"
                >
                  Смотреть регламент QR
                </a>
              </div>
            </div>
          )}

          {activeActionTab === 'cardio' && (
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                КАРДИОЛОГИЧЕСКИЙ ЭКСПЕРТНЫЙ ЦЕНТР
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                Высокоточная диагностика ишемической болезни сердца, нарушений ритма, суточный мониторинг ЭКГ по Холтеру, ЭхоКГ на аппарате Philips Affiniti 70. Консилиумы под руководством д.м.н. А.Б. Юлдашева.
              </p>
              <div className="text-xs font-mono text-[#00A389]">
                Регламент протокола: JCI & Минздрав РУз · 3 840 процедур/год
              </div>
            </div>
          )}

          {activeActionTab === 'neuro' && (
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                НЕВРОЛОГИЯ И ВОССТАНОВЛЕНИЕ ПОСЛЕ ИНСУЛЬТА
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                Компьютерная электроэнцефалография высокого разрешения, сосудистая терапия, авторские кинезиологические программы восстановления двигательных и речевых функций под руководством к.м.н. Д.М. Каримовой.
              </p>
            </div>
          )}

          {activeActionTab === 'pediatric' && (
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                ОХРАНА ЗДОРОВЬЯ ДЕТЕЙ И ПОДРОСТКОВ
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                Прием детей от 0 до 17 лет в специализированном комфортном блоке. Льготная программа для детей из малоимущих семей по линии Единой системы социальной защиты «Ижтимоий химоя».
              </p>
            </div>
          )}

          {activeActionTab === 'surgery' && (
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                МАЛОИНВАЗИВНЫЙ ХИРУРГИЧЕСКИЙ БЛОК KARL STORZ
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                Операции через микропроколы, минимальный болевой синдром, нахождение в комфортабельном стационаре до 24 часов и ультрабыстрое возвращение к активной жизни. 98.7% пациентов выписываются на 2-е сутки.
              </p>
            </div>
          )}

          {activeActionTab === 'diagnostics' && (
            <div className="space-y-3">
              <h3 className="text-xl font-black text-white dark:text-white light:text-gray-900 uppercase">
                ЛУЧЕВАЯ ДИАГНОСТИКА ЭКСПЕРТНОГО КЛАССА SIEMENS MAGNETOM
              </h3>
              <p className="text-sm text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                Томограф Siemens Magnetom 1.5 Tesla с толщиной среза 0.5 мм и цифровой 3D-реконструкцией. Заключение коллегии радиологов выдается в течение 60 минут в цифровом формате и передается в my.gov.uz.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
