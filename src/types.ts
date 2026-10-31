export type Language = 'ru' | 'uz' | 'en';

export type AgeCategory = 'child' | 'adult' | 'senior';

export interface UserProfile {
  age: number;
  language: Language;
  isParent: boolean;
  isDisability: boolean;
  fullName?: string;
  phone?: string;
  category: AgeCategory;
  completedOnboarding: boolean;
}

export type UzbekOperator = 'beeline' | 'ucell' | 'mobiuz' | 'uztelecom' | 'humans' | 'unknown';

export interface ApplicationRecord {
  id: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  operator: UzbekOperator;
  age: number;
  categoryText: string;
  language: Language;
  status: 'Отправлено' | 'В обработке' | 'Подтверждено';
  qrData: string;
  isStateProgram: boolean;
  serviceName?: string;
}

export interface MedicalService {
  id: string;
  title: Record<Language, string>;
  category: string;
  description: Record<Language, string>;
  image: string;
  priceSum: number;
  freeForSeniors: boolean;
  stateProgramAvailable: boolean;
  code: string;
  stats: Record<Language, string>;
}

export interface Doctor {
  id: string;
  name: Record<Language, string>;
  role: Record<Language, string>;
  committee: string;
  barColor: string;
  experienceYears: number;
  category: Record<Language, string>;
  education: Record<Language, string>;
  badge: Record<Language, string>;
  avatar: string;
  receptionDays: Record<Language, string>;
  officeRoom: string;
  licenseNumber: string;
  rating: number;
  patientsCount: number;
  successRate: string;
  biography: Record<Language, string>;
  specializations: Record<Language, string[]>;
  associatedServiceId: string;
}

export interface BenefitStep {
  stepNumber: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  location: Record<Language, string>;
  badge: Record<Language, string>;
}
