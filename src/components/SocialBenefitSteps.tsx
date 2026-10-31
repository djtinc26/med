import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { Stethoscope, UserCheck, QrCode, Building, ExternalLink, CheckCircle } from 'lucide-react';

interface SocialBenefitStepsProps {
  currentLanguage: Language;
}

export const SocialBenefitSteps: React.FC<SocialBenefitStepsProps> = ({
  currentLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'seniors' | 'disability' | 'lowIncome'>('seniors');
  const t = translations[currentLanguage];

  const stepsData = {
    seniors: [
      {
        num: 1,
        icon: Stethoscope,
        title: t.step1Title,
        desc: t.step1Desc,
        tag: 'Поликлиника СВП / ЦСП',
        action: 'Бесплатный скрининг',
      },
      {
        num: 2,
        icon: UserCheck,
        title: t.step2Title,
        desc: t.step2Desc,
        tag: 'Кардиолог / Невролог',
        action: 'Постановка диагноза',
      },
      {
        num: 3,
        icon: QrCode,
        title: t.step3Title,
        desc: t.step3Desc,
        tag: 'Единая информсистема',
        action: 'Матричный QR-код',
      },
      {
        num: 4,
        icon: Building,
        title: t.step4Title,
        desc: t.step4Desc,
        tag: 'Портал my.gov.uz',
        action: '30 дней на выбор',
      },
    ],
    disability: [
      {
        num: 1,
        icon: Stethoscope,
        title: '1. Обращение к врачу',
        desc: 'Посещение семейного врача по месту жительства и регистрация в реестре учета лиц с инвалидностью.',
        tag: 'Районная поликлиника',
        action: 'Электронная карта',
      },
      {
        num: 2,
        icon: UserCheck,
        title: '2. Комплексная комиссия',
        desc: 'Прохождение профильного инструментального обследования без очередей по льготному коридору.',
        tag: 'Врачебная комиссия',
        action: 'Медицинский протокол',
      },
      {
        num: 3,
        icon: QrCode,
        title: '3. Генерация QR-направления',
        desc: 'Автоматическое формирование электронного направления с уникальным кодом в единой базе Минздрава.',
        tag: 'Штрих-код Минздрава',
        action: 'Государственная квота',
      },
      {
        num: 4,
        icon: Building,
        title: '4. Выбор клиники «Новые люди»',
        desc: 'В личном кабинете my.gov.uz в разделе «Здравоохранение» выбор клиники для прохождения реабилитации.',
        tag: '100% субсидия',
        action: 'Госпитализация 0 сум',
      },
    ],
    lowIncome: [
      {
        num: 1,
        icon: Stethoscope,
        title: '1. Семейный педиатр',
        desc: 'Консультация участкового педиатра и внесение ребенка в электронную систему льготного обеспечения «Ижтимоий химоя».',
        tag: 'Детская поликлиника',
        action: 'Первичный осмотр',
      },
      {
        num: 2,
        icon: UserCheck,
        title: '2. Профильный детский врач',
        desc: 'Осмотр детским хирургом, кардиологом, аллергологом или офтальмологом для определения показаний.',
        tag: 'Узкие специалисты',
        action: 'Заключение МОК',
      },
      {
        num: 3,
        icon: QrCode,
        title: '3. Решение комиссии МОК',
        desc: 'Оформление решения медико-отборочной комиссии на выдачу электронного направления с QR-кодом.',
        tag: 'Электронный талон',
        action: '100% покрытие расходов',
      },
      {
        num: 4,
        icon: Building,
        title: '4. Зачисление в «Новые люди»',
        desc: 'Выбор нашей клиники на портале my.gov.uz в течение 30 календарных дней. Госпитализация и процедуры 0 сум.',
        tag: 'Клиника «Новые люди»',
        action: 'Срок действия 60 дней',
      },
    ],
  };

  const currentSteps = stepsData[activeTab];

  return (
    <section id="benefits" className="py-20 px-4 max-w-7xl mx-auto border-b border-white/10 dark:border-white/10 light:border-black/10">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-xs font-mono font-bold tracking-widest text-[#00A389] uppercase mb-1">
            [ регламент my.gov.uz & минздрава руз ]
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 font-sans">
            ПОШАГОВЫЙ РЕГЛАМЕНТ БЕСПЛАТНОГО ПРИЕМА
          </h2>
        </div>

        <p className="max-w-xl text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600 leading-relaxed">
          Официальный прозрачный регламент Минздрава Республики Узбекистан и партии «Новые люди» для 100% бесплатного лечения пенсионеров и льготников без очередей и переплат.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setActiveTab('seniors')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
            activeTab === 'seniors'
              ? 'bg-[#00A389] text-white shadow-md'
              : 'bg-[#161D2B] dark:bg-[#161D2B] light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-black border border-white/10 dark:border-white/10 light:border-black/10'
          }`}
        >
          {t.tabSeniors}
        </button>

        <button
          onClick={() => setActiveTab('disability')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
            activeTab === 'disability'
              ? 'bg-[#00A389] text-white shadow-md'
              : 'bg-[#161D2B] dark:bg-[#161D2B] light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-black border border-white/10 dark:border-white/10 light:border-black/10'
          }`}
        >
          {t.tabDisability}
        </button>

        <button
          onClick={() => setActiveTab('lowIncome')}
          className={`px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
            activeTab === 'lowIncome'
              ? 'bg-[#00A389] text-white shadow-md'
              : 'bg-[#161D2B] dark:bg-[#161D2B] light:bg-gray-200 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:text-white dark:hover:text-white light:hover:text-black border border-white/10 dark:border-white/10 light:border-black/10'
          }`}
        >
          {t.tabLowIncome}
        </button>
      </div>

      {/* 4 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentSteps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-lg bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 shadow-lg flex flex-col justify-between group hover:border-[#00A389] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded bg-[#00A389]/15 text-[#00A389] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-mono font-black text-gray-700 dark:text-gray-700 light:text-gray-300 group-hover:text-[#00A389] transition-colors">
                    0{step.num}
                  </span>
                </div>

                <h3 className="font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 text-sm sm:text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-300 dark:text-gray-300 light:text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between text-[11px]">
                <span className="text-gray-400 dark:text-gray-400 light:text-gray-500 font-mono">
                  {step.tag}
                </span>
                <span className="font-bold text-[#00A389] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{step.action}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Official State Program Portal Callout */}
      <div className="mt-8 p-6 rounded-lg bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/10 dark:border-white/10 light:border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[#00A389]/20 text-[#00A389] flex items-center justify-center shrink-0">
            <ExternalLink className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 text-sm">
              Единый портал интерактивных государственных услуг my.gov.uz
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-400 light:text-gray-600 mt-0.5">
              Проверка статуса электронного QR-направления и выбор клиники «Новые люди» в разделе «Здравоохранение»
            </p>
          </div>
        </div>

        <a
          href="https://my.gov.uz"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded bg-[#00A389] hover:bg-[#008772] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 shadow"
        >
          <span>my.gov.uz</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};
