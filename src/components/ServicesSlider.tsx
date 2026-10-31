import React, { useRef, useState, useEffect } from 'react';
import { Language, MedicalService } from '../types';
import { translations } from '../i18n/translations';
import { ChevronLeft, ChevronRight, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesSliderProps {
  services: MedicalService[];
  currentLanguage: Language;
  onSelectService: (service: MedicalService) => void;
}

export const ServicesSlider: React.FC<ServicesSliderProps> = ({
  services,
  currentLanguage,
  onSelectService,
}) => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const t = translations[currentLanguage];

  const categories = [
    { id: 'all', label: { ru: 'Все отделения', uz: 'Barcha bo‘limlar', en: 'All Departments' } },
    { id: 'cardio', label: { ru: 'Кардиология', uz: 'Kardiologiya', en: 'Cardiology' } },
    { id: 'neuro', label: { ru: 'Неврология', uz: 'Nevrologiya', en: 'Neurology' } },
    { id: 'mri', label: { ru: 'МРТ / КТ', uz: 'MRT / KT', en: 'MRI / CT' } },
    { id: 'surgery', label: { ru: 'Хирургия 24ч', uz: 'Jarrohlik 24s', en: 'Surgery 24h' } },
    { id: 'pediatric', label: { ru: 'Педиатрия', uz: 'Pediatriya', en: 'Pediatrics' } },
    { id: 'rehab', label: { ru: 'Реабилитация', uz: 'Reabilitatsiya', en: 'Rehabilitation' } },
    { id: 'lab', label: { ru: 'Лаборатория', uz: 'Laboratoriya', en: 'Laboratory' } },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.id === activeCategory);

  const checkScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredServices]);

  const scroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const offset = direction === 'left' ? -380 : 380;
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 350);
  };

  return (
    <section
      id="services"
      className="py-20 px-4 max-w-7xl mx-auto border-b border-white/10 dark:border-white/10 light:border-black/10 select-none"
    >
      {/* Header with concrete facts according to 80-words rule */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-[#00A389] uppercase mb-1">
            [ клиническая база экспертного класса ]
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 font-sans">
            ОТДЕЛЕНИЯ И СПЕЦИАЛИЗИРОВАННАЯ ПОМОЩЬ
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <p className="max-w-md text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed hidden lg:block">
            Томографы Siemens Magnetom 1.5 Tesla, лапароскопические комплексы Karl Storz, экспресс-анализы Roche за 60 минут. 0 сум для пенсионеров по госпрограмме.
          </p>

          {/* Smooth Slider Arrow Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'bg-black/40 dark:bg-black/40 light:bg-gray-100 text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] cursor-pointer'
                  : 'bg-black/20 text-gray-600 dark:text-gray-600 light:text-gray-300 border-transparent cursor-not-allowed opacity-40'
              }`}
              title="Предыдущее отделение"
              aria-label="Previous departments"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded border border-white/20 dark:border-white/20 light:border-black/20 flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'bg-black/40 dark:bg-black/40 light:bg-gray-100 text-white dark:text-white light:text-gray-900 hover:bg-[#00A389] hover:text-white hover:border-[#00A389] cursor-pointer'
                  : 'bg-black/20 text-gray-600 dark:text-gray-600 light:text-gray-300 border-transparent cursor-not-allowed opacity-40'
              }`}
              title="Следующее отделение"
              aria-label="Next departments"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00A389] text-white shadow-md'
                  : 'bg-[#161D2B] dark:bg-[#161D2B] light:bg-gray-100 text-gray-400 dark:text-gray-400 light:text-gray-600 hover:text-white dark:hover:text-white light:hover:text-black border border-white/10 dark:border-white/10 light:border-black/10'
              }`}
            >
              {cat.label[currentLanguage]}
            </button>
          );
        })}
      </div>

      {/* Modern Smooth Slider Track */}
      <div
        ref={sliderRef}
        onScroll={checkScroll}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="w-[300px] sm:w-[360px] shrink-0 snap-start rounded-xl overflow-hidden bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 shadow-xl hover:border-[#00A389] transition-all duration-300 flex flex-col justify-between group"
          >
            {/* Image Header with Tag & Subsidized Badge */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={service.image}
                alt={service.title[currentLanguage]}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161D2B] dark:from-[#161D2B] light:from-white/90 via-transparent to-black/40" />

              <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/80 font-mono text-[11px] font-bold text-[#00A389] border border-white/10 backdrop-blur-sm">
                {service.code}
              </span>

              {service.freeForSeniors && (
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#00A389] font-sans text-[10px] font-black text-white uppercase tracking-wider shadow">
                  0 СУМ (65+)
                </span>
              )}

              <span className="absolute bottom-2 left-3 text-[11px] font-semibold text-gray-300 dark:text-gray-300 light:text-gray-700">
                {service.category}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
              <div>
                <h3 className="font-black text-white dark:text-white light:text-gray-900 text-base sm:text-lg uppercase tracking-tight group-hover:text-[#00A389] transition-colors leading-snug">
                  {service.title[currentLanguage]}
                </h3>

                <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-2 leading-relaxed line-clamp-3">
                  {service.description[currentLanguage]}
                </p>
              </div>

              {/* Concrete Key Metrics Pill */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 dark:border-white/10 light:border-black/10 text-xs">
                <span className="font-mono text-[#00A389] font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {service.stats[currentLanguage]}
                </span>

                <div className="text-right">
                  <div className="text-[10px] text-gray-400 uppercase font-mono">Базовый тариф</div>
                  <div className="text-sm font-black text-white dark:text-white light:text-gray-900">
                    {service.priceSum.toLocaleString('ru-RU')} сум
                  </div>
                </div>
              </div>

              {/* Action Button: Direct booking selector */}
              <button
                onClick={() => onSelectService(service)}
                className="w-full py-2.5 px-4 rounded bg-[#00A389]/15 hover:bg-[#00A389] text-[#00A389] hover:text-white border border-[#00A389]/40 hover:border-[#00A389] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:bg-[#00A389] group-hover:text-white shadow-sm"
              >
                <span>ЗАПИСАТЬСЯ В ОТДЕЛЕНИЕ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
