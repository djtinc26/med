import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ApplicationRecord, Language, MedicalService, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { detectOperator, formatUzPhone, isValidUzPhone } from '../utils/phone';
import { checkRateLimit, recordSubmitTimestamp, saveApplication, addToOfflineQueue } from '../utils/storage';
import { sanitizeText, generateSessionNonce, createAuditSignature, containsMaliciousPattern } from '../utils/security';
import { sendTelegramNotification } from '../utils/telegram';
import { OrderAmbulanceButton } from './OrderAmbulanceButton';
import { MEDICAL_SERVICES } from '../data/mockData';
import { ShieldCheck, PhoneCall, AlertTriangle, WifiOff, Lock, CheckCircle2 } from 'lucide-react';

interface BookingFormProps {
  currentLanguage: Language;
  userProfile: UserProfile | null;
  selectedService: MedicalService | null;
  onSuccess: (record: ApplicationRecord) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  currentLanguage,
  userProfile,
  selectedService,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '+998 ');
  const [serviceId, setServiceId] = useState<string>(selectedService?.id || 'cardio');
  const [honeypotCity, setHoneypotCity] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const [rateLimitSec, setRateLimitSec] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const t = translations[currentLanguage];

  // Generate session CSRF token on mount
  useEffect(() => {
    setCsrfToken(generateSessionNonce());
  }, []);

  useEffect(() => {
    if (selectedService) {
      setServiceId(selectedService.id);
    }
  }, [selectedService]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const check = checkRateLimit();
    if (!check.allowed) {
      setRateLimitSec(check.remainingSec);
    }
    const interval = setInterval(() => {
      setRateLimitSec((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const opInfo = detectOperator(phone);
  const isPhoneValid = isValidUzPhone(phone);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatUzPhone(e.target.value);
    setPhone(formatted);
    if (errorMsg) setErrorMsg(null);
  };

  const handleValidateAndSubmit = async (): Promise<boolean> => {
    // 1. Anti-bot Honeypot check
    if (honeypotCity.trim() !== '') {
      console.warn('Security alert: Bot detected via honeypot');
      return false;
    }

    // 2. CSRF Token verify
    if (!csrfToken) {
      setErrorMsg('Ошибка безопасности сессии. Перезагрузите страницу.');
      return false;
    }

    // 3. Rate limit check
    const rate = checkRateLimit();
    if (!rate.allowed) {
      setErrorMsg(t.rateLimitWarning.replace('{sec}', rate.remainingSec.toString()));
      return false;
    }

    // 4. Malicious pattern check (XSS, SQLi, NoSQL injection prevention)
    if (containsMaliciousPattern(fullName) || containsMaliciousPattern(phone)) {
      setErrorMsg('Обнаружены недопустимые или опасные символы. Пожалуйста, введите корректные данные.');
      return false;
    }

    // 5. Input Sanitization & Validation
    const cleanName = sanitizeText(fullName);
    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('Пожалуйста, укажите корректное ФИО пациента (минимум 3 символа)');
      return false;
    }

    if (!isPhoneValid) {
      setErrorMsg('Укажите корректный номер оператора Узбекистана (+998 XX XXX-XX-XX)');
      return false;
    }

    setErrorMsg(null);
    return true;
  };

  const handleCompleteOrder = () => {
    const cleanName = sanitizeText(fullName);
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();
    const dateStr = now.toLocaleDateString('ru-RU');
    const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

    const activeService = MEDICAL_SERVICES.find((s) => s.id === serviceId);
    const isState = userProfile?.category === 'senior' || userProfile?.isDisability;

    const signature = createAuditSignature(randomId, phone, Date.now());

    const record: ApplicationRecord = {
      id: randomId,
      date: dateStr,
      time: timeStr,
      name: cleanName,
      phone: phone.trim(),
      operator: opInfo.operator,
      age: userProfile?.age ?? 35,
      categoryText:
        userProfile?.category === 'senior'
          ? 'Пенсионер (65+) · 100% Госпрограмма'
          : userProfile?.category === 'child'
          ? 'Дети / Подростки'
          : 'Коммерческий прием',
      language: currentLanguage,
      status: 'Отправлено',
      qrData: `NL-CLINIC-PASS-${randomId}-${signature.slice(0, 8)}`,
      isStateProgram: !!isState,
      serviceName: activeService ? activeService.title[currentLanguage] : t.serviceOptionAll,
    };

    recordSubmitTimestamp();
    setRateLimitSec(30);

    if (!navigator.onLine) {
      addToOfflineQueue(record);
    } else {
      saveApplication(record);
      sendTelegramNotification(record);
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00A389', '#10B981', '#FFFFFF', '#0B0F19'],
      });
    } catch {
      // ignore
    }

    onSuccess(record);
  };

  return (
    <section id="booking" className="py-20 px-4 max-w-4xl mx-auto">
      <div className="p-6 sm:p-10 rounded-xl bg-[#161D2B] dark:bg-[#161D2B] light:bg-white border border-white/15 dark:border-white/15 light:border-black/10 shadow-2xl">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#00A389]/15 border border-[#00A389]/30 text-[#00A389] text-xs font-black uppercase tracking-wider mb-2">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Официальная регистратура клиники</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white dark:text-white light:text-gray-900 font-sans">
            {t.bookingTitle}
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">
            {t.bookingSub}
          </p>
        </div>

        {/* Offline notice */}
        {isOffline && (
          <div className="mb-6 p-3 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{t.offlineNotice}</span>
          </div>
        )}

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-6 p-3 rounded bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
          {/* Honeypot field */}
          <input
            type="text"
            name="city_check"
            value={honeypotCity}
            onChange={(e) => setHoneypotCity(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-1.5 ml-0.5">
              {t.nameInput}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Например: Каримов Анвар Рустамович"
              maxLength={80}
              className="w-full px-4 py-3.5 rounded bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/15 text-white dark:text-white light:text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#00A389] transition-all text-sm font-medium"
              required
            />
          </div>

          {/* Phone with Auto-Detected Operator */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-1.5 ml-0.5">
              {t.phoneInput}
            </label>
            <div className="relative flex items-center">
              {/* Operator Logo Box: Exactly 40x24px as specified in ТЗ */}
              <div
                className="absolute left-3 w-10 h-6 rounded flex items-center justify-center overflow-hidden shadow-sm shrink-0 select-none z-10"
                style={{ backgroundColor: opInfo.brandBg }}
                title={`Определен оператор связи: ${opInfo.name}`}
              >
                <img
                  src={opInfo.logoSvg}
                  alt={opInfo.name}
                  className="w-full h-full object-contain"
                />
              </div>

              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+998 (90) 123-45-67"
                className={`w-full pl-16 pr-4 py-3.5 rounded bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border text-white dark:text-white light:text-gray-900 font-mono text-sm placeholder-gray-500 focus:outline-none transition-all ${
                  phone.length > 5 && !isPhoneValid
                    ? 'border-red-500'
                    : 'border-white/10 dark:border-white/10 light:border-black/15 focus:border-[#00A389]'
                }`}
                required
              />
            </div>
            <div className="flex items-center justify-between text-[11px] mt-1.5 px-0.5 text-gray-400 dark:text-gray-400 light:text-gray-600">
              <span className="flex items-center gap-1.5">
                <span>{t.detectedOperator}</span>
                <span className="font-bold uppercase" style={{ color: opInfo.color }}>
                  {opInfo.name}
                </span>
              </span>
              <span className="text-gray-500 font-mono font-bold">
                +998: Beeline, Ucell, Mobiuz, Uztelecom, Humans
              </span>
            </div>
          </div>

          {/* Department Select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 dark:text-gray-300 light:text-gray-700 mb-1.5 ml-0.5">
              {t.serviceSelect}
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full px-4 py-3.5 rounded bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/15 text-white dark:text-white light:text-gray-900 focus:outline-none focus:border-[#00A389] transition-all text-sm font-medium cursor-pointer"
            >
              <option value="general" className="bg-[#111827] text-white">
                {t.serviceOptionAll}
              </option>
              {MEDICAL_SERVICES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#111827] text-white">
                  {s.title[currentLanguage]} ({s.freeForSeniors ? '0 сум по госпрограмме' : `${s.priceSum.toLocaleString()} сум`})
                </option>
              ))}
            </select>
          </div>

          {/* Patient Status summary */}
          <div className="p-3.5 rounded bg-[#0B0F19] dark:bg-[#0B0F19] light:bg-gray-50 border border-white/10 dark:border-white/10 light:border-black/10 flex items-center justify-between text-xs font-semibold">
            <span className="text-gray-400 dark:text-gray-400 light:text-gray-600">
              Тарифная группа пациента:
            </span>
            <span className="font-black text-[#00A389] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {userProfile?.category === 'senior'
                  ? 'Пенсионер (65+) · 100% БЕСПЛАТНО'
                  : userProfile?.isDisability
                  ? 'Инвалидность · 100% БЕСПЛАТНО'
                  : 'Стандартный тариф клиники'}
              </span>
            </span>
          </div>

          {/* Security & Data Privacy Notice (Republic of Uzbekistan Law No. ZRU-547) */}
          <div className="p-3 rounded bg-black/30 dark:bg-black/30 light:bg-gray-100 border border-white/5 dark:border-white/5 light:border-black/5 flex items-start gap-2.5 text-[11px] text-gray-400 dark:text-gray-400 light:text-gray-600">
            <Lock className="w-3.5 h-3.5 text-[#00A389] shrink-0 mt-0.5" />
            <p>
              Персональные данные защищены в соответствии с Законом Республики Узбекистан «О персональных данных» № ЗРУ-547. Шифрование базы данных с соленым ключом, передача по протоколу TLS 1.3.
            </p>
          </div>

          {/* Ambulance Button Animation (Скорая медицинская помощь) */}
          <div className="pt-2 flex flex-col items-center">
            <OrderAmbulanceButton
              currentLanguage={currentLanguage}
              disabled={rateLimitSec > 0}
              onTriggerOrder={handleValidateAndSubmit}
              onComplete={handleCompleteOrder}
            />

            {rateLimitSec > 0 && (
              <span className="text-xs text-amber-400 mt-2 font-mono font-bold">
                {t.rateLimitWarning.replace('{sec}', rateLimitSec.toString())}
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
