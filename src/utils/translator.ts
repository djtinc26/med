import { Language } from '../types';

/**
 * Triggers Google Translate for the selected language ('ru' | 'uz' | 'en')
 * Sets the `googtrans` cookie and dispatches change to the translate select element if available.
 */
export function setGlobalLanguage(lang: Language): void {
  try {
    const domain = window.location.hostname;
    const cookiePath = `/ru/${lang}`;

    // Set standard Google Translate cookies
    document.cookie = `googtrans=${cookiePath}; path=/;`;
    if (domain && domain !== 'localhost') {
      document.cookie = `googtrans=${cookiePath}; path=/; domain=${domain};`;
      document.cookie = `googtrans=${cookiePath}; path=/; domain=.${domain};`;
    }

    // Try finding the Google Translate combo element
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.warn('Google Translate sync notice:', err);
  }
}
