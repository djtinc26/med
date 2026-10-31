import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { TELEGRAM_BOT_USERNAME, getBotConsultantDeepLink } from '../utils/telegram';
import { Bot, X, Send, Sparkles, User, ExternalLink, Mic, CheckCircle2 } from 'lucide-react';

interface AIConsultantWidgetProps {
  currentLanguage: Language;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIConsultantWidget: React.FC<AIConsultantWidgetProps> = ({
  currentLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const t = translations[currentLanguage];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: t.aiWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [
          {
            id: 'welcome',
            sender: 'ai',
            text: t.aiWelcome,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ];
      }
      return prev;
    });
  }, [currentLanguage, t.aiWelcome]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const userText = (customText || input).trim();
    if (!userText || isTyping) return;
    setInput('');

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    const systemPrompt = `Ты — официальный виртуальный медицинский консультант клиники "Новые люди" в Ташкенте (Узбекистан), открытой при поддержке партии "Новые люди".
Бот в Telegram: @${TELEGRAM_BOT_USERNAME}.
Твоя задача: вежливо, компетентно и кратко (до 80 слов) консультировать пациентов на языке: ${currentLanguage.toUpperCase()} (RU/UZ/EN).
Главные факты:
- 100% бесплатное лечение для пенсионеров (65+) и льготников по направлению my.gov.uz (0 сум).
- Отделения: Кардиология, Неврология, МРТ 1.5Т Siemens, Хирургия Karl Storz, Педиатрия, Реабилитация BTL.
- Адрес клиники: г. Ташкент, ул. Амира Темура, 107B. Круглосуточная горячая линия: +998 71 200-01-03.
- Не ставь окончательных диагнозов, всегда рекомендуй очную консультацию врачей клиники «Новые люди».`;

    let reply = '';

    // Step 1: Try Pollinations AI via POST with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/plain, application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userText },
          ],
          model: 'mistral',
          seed: 42,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        reply = await response.text();
      }
    } catch {
      // Step 2: Fallback to Pollinations compact GET
      try {
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 6000);
        const encodedPrompt = encodeURIComponent(
          `Клинический вопрос: ${userText.slice(0, 140)}. Ответь кратко на ${currentLanguage.toUpperCase()}:`
        );
        const getRes = await fetch(`https://text.pollinations.ai/${encodedPrompt}?model=mistral`, {
          signal: controller2.signal,
        });
        clearTimeout(timeoutId2);
        if (getRes.ok) {
          reply = await getRes.text();
        }
      } catch {
        // Handled below by getFallbackReply
      }
    }

    if (!reply || reply.length < 5) {
      reply = getFallbackReply(userText, currentLanguage);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: reply.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsTyping(false);
  };

  const simulateVoiceInput = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      handleSend('Как записать пенсионера 68 лет на бесплатное УЗИ сердца по госпрограмме?');
    }, 1200);
  };

  const getFallbackReply = (query: string, lang: Language): string => {
    const q = query.toLowerCase();
    if (lang === 'uz') {
      if (q.includes('bepul') || q.includes('pensioner') || q.includes('qr') || q.includes('yo\'llanma')) {
        return "65 yoshdan oshgan fuqarolar va imtiyozli qatlam uchun «Yangi Odamlar» klinikasida barcha xizmatlar my.gov.uz QR-yo'llanmasi bo'yicha 100% bepul (0 so'm). Oila shifokoridan yo'llanma olib, portalda bizning klinikani tanlang. Telegram-botimiz @NewPeople_agent orqali navbatni kuzatishingiz mumkin.";
      }
      return "«Yangi Odamlar» klinikasida oliy toifali kardiolog, nevropatolog, xirurg va pediatrlar qabul o'tkazadi. Saytimizdagi forma orqali ariza qoldiring, navbatchi shifokor 5 daqiqada bog'lanadi.";
    }
    if (lang === 'en') {
      if (q.includes('free') || q.includes('senior') || q.includes('qr')) {
        return "For seniors (65+) and eligible categories, clinical care at 'New People' Clinic is 100% free with a digital QR referral from my.gov.uz. Receive referral from district GP and choose 'New People' Clinic on the portal. Track your queue via @NewPeople_agent.";
      }
      return "New People Clinic provides specialized cardiology, neurology, MRI/CT diagnostics, and pediatric surgery in Tashkent. Coordinator doctor contacts you within 5 minutes of submitting the pass request.";
    }
    if (q.includes('бесплатн') || q.includes('пенсион') || q.includes('qr') || q.includes('направлен') || q.includes('льгот')) {
      return "Для пенсионеров (65+) и льготных категорий граждан Республики Узбекистан лечение в клинике «Новые люди» является на 100% бесплатным (0 сум) по электронному QR-направлению через портал my.gov.uz. Направление оформляется у семейного врача в СВП/ЦСП и действует 60 дней. Вы также можете привязать талон в нашем Telegram-боте @NewPeople_agent.";
    }
    if (q.includes('мрт') || q.includes('кт') || q.includes('томограф')) {
      return "В клинике установлен сверхточный томограф Siemens Magnetom 1.5 Tesla со срезами 0.5 мм. Для льготников исследование бесплатно по направлению my.gov.uz. Подготовка: снять металлические предметы, на исследование органов брюшной полости приходить натощак (4-6 часов).";
    }
    return "В клинике «Новые люди» действуют отделения кардиологии, неврологии, МРТ/КТ, хирургии и педиатрии. Оставьте заявку в форме на сайте или в боте @NewPeople_agent, и дежурный врач свяжется с вами в течение 5 минут для согласования времени приема.";
  };

  const botDeepLink = getBotConsultantDeepLink(input);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-auto">
      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-[410px] h-[560px] bg-white dark:bg-[#111827] text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn backdrop-blur-2xl">
          {/* Header */}
          <div className="p-4 bg-slate-100 dark:bg-gradient-to-r dark:from-gray-950 dark:via-[#111827] dark:to-[#161D2B] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00A389]/15 border border-[#00A389]/30 flex items-center justify-center text-[#00A389]">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t.aiChatHeader}</h4>
                  <span className="px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-700 dark:text-teal-400 font-mono text-[9px] font-black uppercase">
                    Pollinations AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#00A389]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Минздрав РУз & @{TELEGRAM_BOT_USERNAME}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Telegram Premium Bot Banner */}
          <a
            href={botDeepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-sky-50 dark:bg-gradient-to-r dark:from-sky-950/80 dark:to-black/80 border-b border-sky-200 dark:border-sky-500/20 text-xs flex items-center justify-between text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Продолжить в Telegram <strong>@{TELEGRAM_BOT_USERNAME}</strong></span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed bg-slate-50/50 dark:bg-transparent">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-[#00A389]/15 text-[#00A389] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-[#00A389] text-white font-medium rounded-tr-xs'
                      : 'bg-white dark:bg-black/50 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-200 rounded-tl-xs shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-white/70' : 'text-slate-400 dark:text-gray-500'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#008772] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400 pl-9">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A389] animate-bounce [animation-delay:0.4s]" />
                <span>{t.aiTyping}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick clinical query pills */}
          <div className="px-3 py-1.5 bg-slate-100 dark:bg-black/40 border-t border-slate-200 dark:border-white/5 flex gap-1.5 overflow-x-auto text-[10px] select-none">
            <button
              onClick={() => handleSend('Как получить 100% бесплатное направление через my.gov.uz?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-all border border-slate-300 dark:border-white/10 shadow-xs cursor-pointer"
            >
              100% льгота my.gov.uz?
            </button>
            <button
              onClick={() => handleSend('Как подготовиться к МРТ обследованию?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-all border border-slate-300 dark:border-white/10 shadow-xs cursor-pointer"
            >
              Подготовка к МРТ?
            </button>
            <button
              onClick={() => handleSend('Какие документы нужны при госпитализации?')}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap transition-all border border-slate-300 dark:border-white/10 shadow-xs cursor-pointer"
            >
              Документы для стационара?
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-white dark:bg-black/70 border-t border-slate-200 dark:border-white/10 flex items-center gap-2">
            <button
              onClick={simulateVoiceInput}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isRecording
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white border-slate-300 dark:border-white/10'
              }`}
              title="Голосовой ввод вопроса"
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isRecording ? 'Запись голосового вопроса...' : t.aiInputPlaceholder}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-gray-800/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-xs focus:outline-none focus:border-[#00A389]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl bg-[#00A389] hover:bg-[#008772] disabled:opacity-40 text-white transition-all cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 dark:bg-gradient-to-r dark:from-[#111827] dark:to-[#1F2937] text-white border border-[#00A389]/40 shadow-[0_8px_30px_rgba(0,163,137,0.35)] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-[#00A389] text-white flex items-center justify-center font-bold">
          <Bot className="w-4 h-4" />
        </div>
        <span className="font-bold text-xs tracking-wide">
          {t.aiButton}
        </span>
      </button>
    </div>
  );
};
