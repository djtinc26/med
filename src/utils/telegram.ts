/**
 * Telegram Bot & Notification Dispatch for Clinic «Новые люди»
 * Bot: @NewPeople_agent (https://t.me/NewPeople_agent)
 * Token: 9108520636:AAG7ieFMo7V07ycEtyjdXpjMM2Mt4FFVm1o
 *
 * Authorized Administrator Telegram ID: 6379225282 (@LordFrontend)
 * All patient bookings, alerts and status management are strictly routed to this user ID.
 */

import { ApplicationRecord } from '../types';

export const TELEGRAM_BOT_TOKEN = '9108520636:AAG7ieFMo7V07ycEtyjdXpjMM2Mt4FFVm1o';
export const TELEGRAM_BOT_USERNAME = 'NewPeople_agent';
export const TELEGRAM_BOT_URL = 'https://t.me/NewPeople_agent';

// Verified admin user Telegram ID requested by client
export const ADMIN_TELEGRAM_ID = '6379225282';
export const ADMIN_USERNAME = '@LordFrontend';

export interface TelegramDeliveryResult {
  success: boolean;
  messageId?: number;
  chatId?: string;
  error?: string;
  timestamp: number;
}

/**
 * Format patient booking payload according to strict technical specification
 */
export function formatTelegramBookingMessage(record: ApplicationRecord): string {
  return `🏛 <b>КЛИНИКА «НОВЫЕ ЛЮДИ» | НОВАЯ ЗАЯВКА ПАЦИЕНТА</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎫 <b>Электронный талон: #${record.id}</b>

👤 <b>ФИО Пациента:</b> <b>${record.name}</b>
📞 <b>Телефон:</b> <code>${record.phone}</code> [Оператор: <b>${record.operator.toUpperCase()}</b>]
🎂 <b>Возраст:</b> <b>${record.age} лет</b> (${record.categoryText})
🏥 <b>Отделение:</b> <b>${record.serviceName || 'Общий консилиум'}</b>
🌐 <b>Язык сайта:</b> ${record.language.toUpperCase()}
🛡 <b>Госпрограмма (QR):</b> ${record.isStateProgram ? '✅ <b>100% БЕСПЛАТНО (0 сум)</b>' : 'Частный прием'}
📅 <b>Время записи:</b> <code>${record.date} — ${record.time}</code>
🔐 <b>QR Hash:</b> <code>${record.qrData}</code>

<blockquote>⚡️ <b>Уведомление администратора:</b>
Заявка поступила в систему. Управление и смена статуса доступны только для администратора ID: <code>${ADMIN_TELEGRAM_ID}</code> (${ADMIN_USERNAME}) через команды бота.</blockquote>
━━━━━━━━━━━━━━━━━━━━━━━━━━
<i>Официальный бот: @${TELEGRAM_BOT_USERNAME}</i>`;
}

/**
 * Send real telegram notification directly to Authorized Administrator (ID: 6379225282)
 */
export async function sendTelegramNotification(
  record: ApplicationRecord,
  targetChatId: string = ADMIN_TELEGRAM_ID
): Promise<TelegramDeliveryResult> {
  const text = formatTelegramBookingMessage(record);
  const chatId = targetChatId || ADMIN_TELEGRAM_ID;

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📞 Позвонить пациенту',
                url: `tel:${record.phone.replace(/[^\d+]/g, '')}`,
              },
              {
                text: '✅ Подтвердить прием',
                url: `${TELEGRAM_BOT_URL}?start=confirm_${record.id}`,
              },
            ],
            [
              {
                text: '🚑 Выезд скорой 103',
                url: `${TELEGRAM_BOT_URL}?start=ambulance_${record.id}`,
              },
            ],
          ],
        },
      }),
    });

    const data = await response.json();
    if (data.ok) {
      console.log(`[Telegram Success] Message delivered to ID ${chatId}, Message ID: ${data.result?.message_id}`);
      return {
        success: true,
        messageId: data.result?.message_id,
        chatId: chatId,
        timestamp: Date.now(),
      };
    } else {
      console.warn('[Telegram API Response]:', data.description);
      return {
        success: false,
        error: data.description || 'Telegram API Error',
        timestamp: Date.now(),
      };
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Network error';
    console.warn('[Telegram Delivery Error]:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      timestamp: Date.now(),
    };
  }
}

/**
 * Deep links for patients
 */
export function getBotTicketDeepLink(ticketId: string): string {
  return `${TELEGRAM_BOT_URL}?start=ticket_${ticketId}`;
}

export function getBotEmergencyDeepLink(): string {
  return `${TELEGRAM_BOT_URL}?start=emergency_ambulance_103`;
}

export function getBotQrVerifyDeepLink(qrHash?: string): string {
  return `${TELEGRAM_BOT_URL}?start=verify_qr_${qrHash ? qrHash.slice(0, 10) : 'gov'}`;
}

export function getBotConsultantDeepLink(query?: string): string {
  const queryParam = query ? `_q_${encodeURIComponent(query.slice(0, 20))}` : '';
  return `${TELEGRAM_BOT_URL}?start=consult${queryParam}`;
}
