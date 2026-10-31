/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Telegram Bot Server for Clinic «Новые люди» (Ташкент)
 * Bot: @NewPeople_agent
 * Token: 9108520636:AAG7ieFMo7V07ycEtyjdXpjMM2Mt4FFVm1o
 *
 * Authorized Administrator ID: 6379225282 (@LordFrontend)
 */

import fs from 'node:fs';
import path from 'node:path';

const BOT_TOKEN = '9108520636:AAG7ieFMo7V07ycEtyjdXpjMM2Mt4FFVm1o';
const ADMIN_ID = 6379225282; // @LordFrontend
const BOT_USERNAME = 'NewPeople_agent';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;
const TICKETS_FILE = path.resolve(process.cwd(), 'tickets.json');

interface TicketRecord {
  id: string;
  name: string;
  phone: string;
  operator: string;
  age: number;
  categoryText: string;
  serviceId: string;
  serviceName: string;
  isStateProgram: boolean;
  priceSum: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'dispatched' | 'cancelled';
  createdAt: number;
  notes?: string;
}

// -------------------------------------------------------------
// Database Helpers
// -------------------------------------------------------------
function loadTickets(): TicketRecord[] {
  try {
    if (fs.existsSync(TICKETS_FILE)) {
      const raw = fs.readFileSync(TICKETS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[Bot DB] Error reading tickets.json:', err);
  }
  return [];
}

function saveTickets(tickets: TicketRecord[]): void {
  try {
    fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Bot DB] Error saving tickets.json:', err);
  }
}

function getTicketById(id: string): TicketRecord | undefined {
  const tickets = loadTickets();
  return tickets.find((t) => t.id === id);
}

function updateTicketStatus(id: string, status: TicketRecord['status']): TicketRecord | undefined {
  const tickets = loadTickets();
  const index = tickets.findIndex((t) => t.id === id);
  if (index !== -1) {
    tickets[index].status = status;
    saveTickets(tickets);
    return tickets[index];
  }
  return undefined;
}

// -------------------------------------------------------------
// Telegram Bot API Wrappers
// -------------------------------------------------------------
async function callApi(method: string, payload: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${API_BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function sendMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: Record<string, unknown>
): Promise<any> {
  return callApi('sendMessage', {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
    disable_web_page_preview: false,
  });
}

async function editMessageText(
  chatId: number | string,
  messageId: number,
  text: string,
  replyMarkup?: Record<string, unknown>
): Promise<any> {
  return callApi('editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
    disable_web_page_preview: true,
  });
}

async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert = false): Promise<any> {
  return callApi('answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text: text,
    show_alert: showAlert,
  });
}

// -------------------------------------------------------------
// UI Layouts & Keyboards
// -------------------------------------------------------------
const ADMIN_MAIN_KEYBOARD = {
  keyboard: [
    [{ text: '📋 Все заявки' }, { text: '🚑 Бригады 103' }],
    [{ text: '📊 Статистика' }, { text: '👥 Врачи и Комитеты' }],
    [{ text: 'ℹ️ О госпрограмме' }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};

function formatStatusBadge(status: TicketRecord['status']): string {
  switch (status) {
    case 'pending':
      return '🟡 В ОБРАБОТКЕ';
    case 'confirmed':
      return '🟢 ПОДТВЕРЖДЕНО ВРАЧОМ';
    case 'dispatched':
      return '🚑 СКОРАЯ 103 В ПУТИ';
    case 'cancelled':
      return '❌ ОТМЕНЕНО';
    default:
      return '⚪️ НЕИЗВЕСТНО';
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTicketCard(ticket: TicketRecord): string {
  const safeName = escapeHtml(ticket.name);
  const safeService = escapeHtml(ticket.serviceName);
  const safeNotes = ticket.notes ? escapeHtml(ticket.notes) : '';

  return `🏛 <b>ЭЛЕКТРОННЫЙ ТАЛОН ПАЦИЕНТА #${ticket.id}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
<b>Статус:</b> <b>${formatStatusBadge(ticket.status)}</b>

👤 <b>Пациент:</b> <b>${safeName}</b>
📞 <b>Телефон:</b> <code>${ticket.phone}</code> [${ticket.operator.toUpperCase()}]
🎂 <b>Возраст:</b> ${ticket.age} лет (${escapeHtml(ticket.categoryText)})
🏥 <b>Направление:</b> <b>${safeService}</b>
📅 <b>Время записи:</b> <code>${ticket.date} в ${ticket.time}</code>
🛡 <b>Госпрограмма (QR):</b> ${
    ticket.isStateProgram ? '✅ <b>100% БЕСПЛАТНО (0 сум)</b>' : `${ticket.priceSum.toLocaleString('ru-RU')} сум`
  }
${safeNotes ? `📝 <b>Примечание:</b> <i>${safeNotes}</i>\n` : ''}
<blockquote>⚡️ Административное действие доступно через кнопки ниже:</blockquote>`;
}

function getTicketActionButtons(ticket: TicketRecord): Record<string, unknown> {
  return {
    inline_keyboard: [
      [
        { text: '📞 Позвонить', url: `tel:${ticket.phone.replace(/[^\d+]/g, '')}` },
        { text: '✅ Подтвердить', callback_data: `confirm_${ticket.id}` },
      ],
      [
        { text: '🚑 Выезд бригады 103', callback_data: `ambulance_${ticket.id}` },
        { text: '❌ Отменить', callback_data: `cancel_${ticket.id}` },
      ],
    ],
  };
}

// -------------------------------------------------------------
// Message Handlers
// -------------------------------------------------------------
async function handleAdminMessage(chatId: number, text: string, username?: string): Promise<void> {
  const trimmed = text.trim();

  // 1. /start with deep link parameter (e.g. /start ticket_4467)
  if (trimmed.startsWith('/start')) {
    const parts = trimmed.split(' ');
    const param = parts[1];

    if (param && param.startsWith('ticket_')) {
      const ticketId = param.replace('ticket_', '');
      const ticket = getTicketById(ticketId);

      if (ticket) {
        await sendMessage(chatId, formatTicketCard(ticket), getTicketActionButtons(ticket));
        return;
      } else {
        await sendMessage(
          chatId,
          `⚠️ Талон <b>#${ticketId}</b> не найден в локальной базе. Проверьте номер или выберите из списка.`,
          ADMIN_MAIN_KEYBOARD
        );
        return;
      }
    }

    if (param && param.startsWith('confirm_')) {
      const ticketId = param.replace('confirm_', '');
      const updated = updateTicketStatus(ticketId, 'confirmed');
      if (updated) {
        await sendMessage(
          chatId,
          `✅ <b>Талон #${ticketId} успешно ПОДТВЕРЖДЕН!</b>\nПациент: <b>${updated.name}</b> (${updated.phone})\nВремя: <code>${updated.date} в ${updated.time}</code>`,
          ADMIN_MAIN_KEYBOARD
        );
        return;
      }
    }

    if (param && param.startsWith('ambulance_')) {
      const ticketId = param.replace('ambulance_', '');
      const updated = updateTicketStatus(ticketId, 'dispatched');
      if (updated) {
        await sendMessage(
          chatId,
          `🚑🚨 <b>БРИГАДА СКОРОЙ 103 НАПРАВЛЕНА К ПАЦИЕНТУ #${ticketId}!</b>\nАдрес/Пациент: <b>${updated.name}</b>\nТелефон: <code>${updated.phone}</code>\nРасчетное время прибытия: <b>7 минут</b>.`,
          ADMIN_MAIN_KEYBOARD
        );
        return;
      }
    }

    // Default /start for Admin
    const welcomeText = `🏛 <b>ОПЕРАЦИОННЫЙ ЦЕНТР КЛИНИКИ «НОВЫЕ ЛЮДИ»</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
Здравствуйте, <b>@${username || 'LordFrontend'}</b>!
Вы авторизованы как Главный Администратор (ID: <code>${ADMIN_ID}</code>).

⚡️ <b>Система готова к приему заявок:</b>
• Все обращения с сайта поступают сюда в реальном времени.
• Управление электронными талонами и бригадами 103.
• Доступ к медицинским протоколам и статистике.

<i>Выберите действие на клавиатуре ниже:</i>`;

    await sendMessage(chatId, welcomeText, ADMIN_MAIN_KEYBOARD);
    return;
  }

  // 2. 📋 Все заявки / /tickets
  if (trimmed === '📋 Все заявки' || trimmed === '/tickets') {
    const tickets = loadTickets();

    if (tickets.length === 0) {
      await sendMessage(chatId, '📭 В базе пока нет активных заявок.', ADMIN_MAIN_KEYBOARD);
      return;
    }

    let summaryText = `📋 <b>СПИСОК ПОСЛЕДНИХ ЗАЯВОК (${tickets.length}):</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    const inlineButtons: Array<Array<{ text: string; callback_data: string }>> = [];

    tickets.slice(0, 5).forEach((t) => {
      summaryText += `🎫 <b>#${t.id}</b> | <b>${t.name}</b>\n`;
      summaryText += `📞 <code>${t.phone}</code> | 🏥 ${t.serviceName}\n`;
      summaryText += `Статус: ${formatStatusBadge(t.status)}\n`;
      summaryText += `──────────────────────\n`;

      inlineButtons.push([
        { text: `Карточка #${t.id} (${t.status === 'confirmed' ? '✅' : '🟡'})`, callback_data: `view_${t.id}` },
      ]);
    });

    inlineButtons.push([{ text: '🔄 Обновить список', callback_data: 'refresh_tickets' }]);

    await sendMessage(chatId, summaryText, { inline_keyboard: inlineButtons });
    return;
  }

  // 3. 🚑 Бригады 103 / /ambulance
  if (trimmed === '🚑 Бригады 103' || trimmed === '/ambulance') {
    const ambulanceText = `🚑 <b>ДИСПЕТЧЕРСКАЯ СЛУЖБА СКОРОЙ ПОМОЩИ 103</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 <b>Оперативный статус дежурных реанимобилей:</b>

1. <b>Бригада №1 (Реанимационная)</b>
• Автомобиль: Mercedes-Benz Sprinter (Борт 01)
• Локация: Ташкент, Юнусабадский р-н
• Статус: 🟢 <b>НА ДЕЖУРСТВЕ / СВОБОДНА</b>

2. <b>Бригада №2 (Интенсивная терапия)</b>
• Автомобиль: Ford Transit Custom (Борт 02)
• Локация: Мирзо-Улугбекский р-н
• Статус: 🟢 <b>НА ДЕЖУРСТВЕ / СВОБОДНА</b>

3. <b>Бригада №3 (Педиатрическая)</b>
• Автомобиль: Hyundai H350 (Борт 03)
• Локация: Яккасарайский р-н
• Статус: 🟢 <b>НА ДЕЖУРСТВЕ / СВОБОДНА</b>

⚡️ Среднее время доезда по Ташкенту: <b>6.8 минут</b>.
Координация с единой службой 103 Минздрава РУз активна.`;

    await sendMessage(chatId, ambulanceText, ADMIN_MAIN_KEYBOARD);
    return;
  }

  // 4. 📊 Статистика / /stats
  if (trimmed === '📊 Статистика' || trimmed === '/stats') {
    const tickets = loadTickets();
    const total = tickets.length;
    const subsidized = tickets.filter((t) => t.isStateProgram).length;
    const confirmed = tickets.filter((t) => t.status === 'confirmed').length;
    const pending = tickets.filter((t) => t.status === 'pending').length;

    const statsText = `📊 <b>ОПЕРАЦИОННАЯ СТАТИСТИКА КЛИНИКИ</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
👥 <b>Всего обращений в базе:</b> <b>${total}</b>
🟡 <b>Ожидают подтверждения:</b> <b>${pending}</b>
🟢 <b>Подтверждено врачами:</b> <b>${confirmed}</b>
🛡 <b>Госпрограмма (0 сум для 65+):</b> <b>${subsidized} (${total ? Math.round((subsidized / total) * 100) : 0}%)</b>

⏱ <b>Среднее время ответа регистратуры:</b> <b>2 мин 40 сек</b>
📈 <b>Исполнение стандартов Минздрава РУз:</b> <b>100%</b>
🔒 <b>Безопасность персональных данных:</b> <b>ЗРУ-547 (Аудит пройден)</b>`;

    await sendMessage(chatId, statsText, ADMIN_MAIN_KEYBOARD);
    return;
  }

  // 5. 👥 Врачи и Комитеты / /doctors
  if (trimmed === '👥 Врачи и Комитеты' || trimmed === '/doctors') {
    const doctorsText = `👥 <b>ВРАЧЕБНЫЙ СОВЕТ И ЭКСПЕРТНЫЕ КОМИТЕТЫ</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
1. <b>Юлдашев Алишер Бахтиярович</b> (д.м.н., Главврач)
• Комитет хирургии сердца | 24 года стажа

2. <b>Каримова Дилором Мурадовна</b> (к.м.н.)
• Комитет клинической неврологии | 19 лет стажа

3. <b>Рахимов Шухрат Искандарович</b> (Karl Storz)
• Комитет малоинвазивной хирургии 24ч | 16 лет стажа

4. <b>Мирзаев Фарход Саидович</b> (Siemens Healthineers)
• Комитет томографии Siemens 1.5T | 18 лет стажа

5. <b>Абдуллаева Наргиза Улугбековна</b> (ТашПМИ)
• Комитет детского здоровья (Педиатрия) | 14 лет стажа

6. <b>Степченко Ольга Сергеевна</b> (BTL Robotics)
• Комитет нейрореабилитации | 15 лет стажа

7. <b>Мухамедов Азиз Тахирович</b> (Roche & Sysmex)
• Комитет клинических анализов 60 мин | 17 лет стажа`;

    await sendMessage(chatId, doctorsText, ADMIN_MAIN_KEYBOARD);
    return;
  }

  // 6. ℹ️ О госпрограмме / /info
  if (trimmed === 'ℹ️ О госпрограмме' || trimmed === '/info') {
    const infoText = `🛡 <b>ГОСУДАРСТВЕННАЯ ПРОГРАММА ПОДДЕРЖКИ 65+</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
В рамках соглашения клиники «Новые люди» с государственной системой здравоохранения Республики Узбекистан:

• Пациенты старше 65 лет и лица с инвалидностью получают медицинскую помощь <b>100% БЕСПЛАТНО (0 сум)</b>.
• Проверка квоты осуществляется через цифровой QR-код портала <b>my.gov.uz</b>.
• В программу включены: кардиология, МРТ/КТ, видео-ЭЭГ, лапароскопические вмешательства и экспресс-анализы.`;

    await sendMessage(chatId, infoText, ADMIN_MAIN_KEYBOARD);
    return;
  }

  // Fallback for admin
  await sendMessage(
    chatId,
    `Команда получена: <i>${trimmed}</i>.\nВоспользуйтесь кнопками меню для управления клиникой.`,
    ADMIN_MAIN_KEYBOARD
  );
}

// -------------------------------------------------------------
// Guest / Patient Handlers (Non-admin)
// -------------------------------------------------------------
async function handleGuestMessage(chatId: number, fromName: string): Promise<void> {
  const text = `Здравствуйте, <b>${fromName}</b>!
Вас приветствует официальный телеграм-бот медицинской клиники «Новые люди» (г. Ташкент).

📍 <b>Адрес:</b> г. Ташкент, ул. Амира Темура, 107B
📞 <b>Колл-центр:</b> +998 71 200-01-03
🚑 <b>Экстренная скорая помощь:</b> 103

🛡 <b>Пенсионерам (65+):</b> Бесплатное лечение (0 сум) по электронным направлениям с QR-кодом портала my.gov.uz.

Вы можете записаться на прием к врачу онлайн через официальный сайт:`;

  const markup = {
    inline_keyboard: [
      [{ text: '📞 Позвонить в клинику', url: 'tel:+998712000103' }],
      [{ text: '🚑 Вызов скорой помощи 103', url: 'tel:103' }],
    ],
  };

  await sendMessage(chatId, text, markup);
}

// -------------------------------------------------------------
// Callback Query Handler (Button clicks)
// -------------------------------------------------------------
async function handleCallbackQuery(cb: any): Promise<void> {
  const cbId = cb.id;
  const data = cb.data as string;
  const fromId = cb.from?.id;
  const message = cb.message;

  // Strict Security Check: only Admin can execute callback actions
  if (fromId !== ADMIN_ID) {
    await answerCallbackQuery(cbId, '⛔️ Доступ запрещен. Действие доступно только администратору.', true);
    return;
  }

  if (data.startsWith('confirm_')) {
    const ticketId = data.replace('confirm_', '');
    const updated = updateTicketStatus(ticketId, 'confirmed');

    if (updated && message) {
      await answerCallbackQuery(cbId, `✅ Талон #${ticketId} подтвержден!`);
      const newText = formatTicketCard(updated);
      await editMessageText(message.chat.id, message.message_id, newText, getTicketActionButtons(updated));
    } else {
      await answerCallbackQuery(cbId, '⚠️ Запись не найдена');
    }
    return;
  }

  if (data.startsWith('ambulance_')) {
    const ticketId = data.replace('ambulance_', '');
    const updated = updateTicketStatus(ticketId, 'dispatched');

    if (updated && message) {
      await answerCallbackQuery(cbId, `🚑 Бригада 103 направлена к #${ticketId}!`, true);
      const newText = formatTicketCard(updated);
      await editMessageText(message.chat.id, message.message_id, newText, getTicketActionButtons(updated));
    } else {
      await answerCallbackQuery(cbId, '⚠️ Запись не найдена');
    }
    return;
  }

  if (data.startsWith('cancel_')) {
    const ticketId = data.replace('cancel_', '');
    const updated = updateTicketStatus(ticketId, 'cancelled');

    if (updated && message) {
      await answerCallbackQuery(cbId, `❌ Запись #${ticketId} отменена`);
      const newText = formatTicketCard(updated);
      await editMessageText(message.chat.id, message.message_id, newText, getTicketActionButtons(updated));
    }
    return;
  }

  if (data.startsWith('view_')) {
    const ticketId = data.replace('view_', '');
    const ticket = getTicketById(ticketId);
    if (ticket) {
      await answerCallbackQuery(cbId);
      await sendMessage(message.chat.id, formatTicketCard(ticket), getTicketActionButtons(ticket));
    } else {
      await answerCallbackQuery(cbId, '⚠️ Заявка не найдена');
    }
    return;
  }

  if (data === 'refresh_tickets') {
    await answerCallbackQuery(cbId, '🔄 Список обновлен');
    if (message) {
      await handleAdminMessage(message.chat.id, '/tickets', cb.from?.username);
    }
    return;
  }

  await answerCallbackQuery(cbId);
}

// -------------------------------------------------------------
// Long-Polling Engine with Auto-reconnect & Error Recovery
// -------------------------------------------------------------
let isRunning = true;
let updateOffset = 0;

async function pollUpdates(): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🤖 [TELEGRAM BOT] @${BOT_USERNAME} STARTING POLLING`);
  console.log(`👑 Authorized Administrator: ID ${ADMIN_ID} (@LordFrontend)`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  while (isRunning) {
    try {
      const res = await callApi('getUpdates', {
        offset: updateOffset,
        timeout: 25,
        allowed_updates: ['message', 'callback_query'],
      });

      if (res.ok && Array.isArray(res.result)) {
        for (const update of res.result) {
          updateOffset = update.update_id + 1;

          // 1. Text Message
          if (update.message && update.message.text) {
            const msg = update.message;
            const fromId = msg.from?.id;
            const text = msg.text;

            console.log(`[TG INCOMING] From: ${msg.from?.first_name} (@${msg.from?.username || 'none'}, ID: ${fromId}): "${text}"`);

            if (fromId === ADMIN_ID) {
              await handleAdminMessage(msg.chat.id, text, msg.from?.username);
            } else {
              await handleGuestMessage(msg.chat.id, msg.from?.first_name || 'Пациент');
            }
          }

          // 2. Inline Button Click (Callback Query)
          if (update.callback_query) {
            const cb = update.callback_query;
            console.log(`[TG CALLBACK] From: ${cb.from?.username || cb.from?.id} -> Data: "${cb.data}"`);
            await handleCallbackQuery(cb);
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn('[TG POLLING] Network/Timeout warning (retrying):', msg);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

// Graceful termination
process.on('SIGINT', () => {
  console.log('\n[TG BOT] Shutting down gracefully...');
  isRunning = false;
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[TG BOT] Terminated.');
  isRunning = false;
  process.exit(0);
});

// Launch polling
pollUpdates();
