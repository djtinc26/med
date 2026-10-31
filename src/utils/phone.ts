import { UzbekOperator } from '../types';

export function detectOperator(rawPhone: string): {
  operator: UzbekOperator;
  name: string;
  color: string;
  brandBg: string;
  logoSvg: string;
} {
  const digits = rawPhone.replace(/\D/g, '');
  let prefix = '';

  // Handle +998... or 998... or direct two digits
  if (digits.startsWith('998') && digits.length >= 5) {
    prefix = digits.slice(3, 5);
  } else if (!digits.startsWith('998') && digits.length >= 2) {
    prefix = digits.slice(0, 2);
  }

  if (['90', '91'].includes(prefix)) {
    return {
      operator: 'beeline',
      name: 'Beeline',
      color: '#FFCC00',
      brandBg: '#000000',
      logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%23000"/><circle cx="20" cy="12" r="8" fill="%23FFCC00"/><path d="M14 12h12M15 8h10M15 16h10" stroke="%23000" stroke-width="1.8" stroke-linecap="round"/></svg>',
    };
  }
  if (['93', '94', '50'].includes(prefix)) {
    return {
      operator: 'ucell',
      name: 'Ucell',
      color: '#662D91',
      brandBg: '#662D91',
      logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%23662D91"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="9" fill="%2300D2B4">UCELL</text></svg>',
    };
  }
  if (['97', '88', '99'].includes(prefix)) {
    return {
      operator: 'mobiuz',
      name: 'Mobiuz',
      color: '#E30613',
      brandBg: '#E30613',
      logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%23E30613"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="8" fill="%23FFFFFF">MOBIUZ</text></svg>',
    };
  }
  if (['95', '98'].includes(prefix)) {
    return {
      operator: 'uztelecom',
      name: 'Uztelecom',
      color: '#005BAA',
      brandBg: '#005BAA',
      logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%23005BAA"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="7" fill="%23FFFFFF">UZTELECOM</text></svg>',
    };
  }
  if (prefix === '33') {
    return {
      operator: 'humans',
      name: 'Humans',
      color: '#00C389',
      brandBg: '#1B1C1E',
      logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%231B1C1E"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="8" fill="%2300C389">HUMANS</text></svg>',
    };
  }

  return {
    operator: 'unknown',
    name: 'Operator',
    color: '#9CA3AF',
    brandBg: '#1F2937',
    logoSvg: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 24"><rect width="40" height="24" rx="4" fill="%231F2937" stroke="%23374151"/><text x="50%" y="62%" dominant-baseline="middle" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="9" fill="%239CA3AF">+998</text></svg>',
  };
}

export function formatUzPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  let rest = digits;
  if (rest.startsWith('998')) {
    rest = rest.slice(3);
  }
  rest = rest.slice(0, 9); // max 9 digits after 998

  let formatted = '+998';
  if (rest.length > 0) {
    formatted += ' (' + rest.slice(0, 2);
  }
  if (rest.length >= 2) {
    formatted += ') ';
  }
  if (rest.length > 2) {
    formatted += rest.slice(2, 5);
  }
  if (rest.length >= 5) {
    formatted += '-';
  }
  if (rest.length > 5) {
    formatted += rest.slice(5, 7);
  }
  if (rest.length >= 7) {
    formatted += '-';
  }
  if (rest.length > 7) {
    formatted += rest.slice(7, 9);
  }

  return formatted;
}

export function isValidUzPhone(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length !== 12 || !digits.startsWith('998')) {
    return false;
  }
  const code = digits.slice(3, 5);
  const validCodes = ['90', '91', '93', '94', '50', '97', '88', '99', '95', '98', '33'];
  return validCodes.includes(code);
}
