import { ApplicationRecord, UserProfile } from '../types';

const SALT = 'NL_CLINIC_2026_SECURE';

function encodeData<T>(data: T): string {
  try {
    const raw = JSON.stringify({ payload: data, salt: SALT, ts: Date.now() });
    return btoa(encodeURIComponent(raw));
  } catch {
    return '';
  }
}

function decodeData<T>(encoded: string | null): T | null {
  if (!encoded) return null;
  try {
    const raw = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(raw);
    if (parsed.salt === SALT && parsed.payload !== undefined) {
      return parsed.payload as T;
    }
    return null;
  } catch {
    return null;
  }
}

export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem('nl_user_profile');
  return decodeData<UserProfile>(data);
}

export function saveUserProfile(profile: UserProfile): void {
  const encoded = encodeData(profile);
  localStorage.setItem('nl_user_profile', encoded);
  // Also store settings
  localStorage.setItem(
    'nl_settings',
    JSON.stringify({
      language: profile.language,
      age: profile.age,
      isParent: profile.isParent,
    })
  );
}

export function getApplicationsHistory(): ApplicationRecord[] {
  const data = localStorage.getItem('nl_applications_history');
  return decodeData<ApplicationRecord[]>(data) || [];
}

export function saveApplication(record: ApplicationRecord): void {
  const current = getApplicationsHistory();
  const updated = [record, ...current];
  localStorage.setItem('nl_applications_history', encodeData(updated));
}

export function checkRateLimit(): { allowed: boolean; remainingSec: number } {
  const lastTimeStr = localStorage.getItem('nl_last_submit_time');
  if (!lastTimeStr) return { allowed: true, remainingSec: 0 };
  const lastTime = parseInt(lastTimeStr, 10);
  const now = Date.now();
  const diffSec = Math.floor((now - lastTime) / 1000);
  if (diffSec < 30) {
    return { allowed: false, remainingSec: 30 - diffSec };
  }
  return { allowed: true, remainingSec: 0 };
}

export function recordSubmitTimestamp(): void {
  localStorage.setItem('nl_last_submit_time', Date.now().toString());
}

export function getOfflineQueue(): ApplicationRecord[] {
  try {
    const data = localStorage.getItem('nl_offline_queue');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToOfflineQueue(record: ApplicationRecord): void {
  const queue = getOfflineQueue();
  queue.push(record);
  localStorage.setItem('nl_offline_queue', JSON.stringify(queue));
}

export function clearOfflineQueue(): void {
  localStorage.removeItem('nl_offline_queue');
}
