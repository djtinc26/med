import React, { useState, useEffect } from 'react';
import { Doctor, ApplicationRecord, Language, MedicalService, UserProfile } from './types';
import { DOCTORS, MEDICAL_SERVICES } from './data/mockData';
import { getApplicationsHistory, getUserProfile, saveUserProfile } from './utils/storage';
import { BurningRevealIntro } from './components/BurningRevealIntro';
import { AppleLiquidNav } from './components/AppleLiquidNav';
import { HeroSection } from './components/HeroSection';
import { SocialBenefitSteps } from './components/SocialBenefitSteps';
import { ServicesSlider } from './components/ServicesSlider';
import { DoctorsSection } from './components/DoctorsSection';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { BookingForm } from './components/BookingForm';
import { OnboardingModal } from './components/OnboardingModal';
import { SuccessTicketModal } from './components/SuccessTicketModal';
import { SettingsHistoryModal } from './components/SettingsHistoryModal';
import { AIConsultantWidget } from './components/AIConsultantWidget';
import { SidebarUtilityDrawer } from './components/SidebarUtilityDrawer';
import { Footer } from './components/Footer';
import { setGlobalLanguage } from './utils/translator';

export default function App() {
  const [showBurningIntro, setShowBurningIntro] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('ru');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [recentTicket, setRecentTicket] = useState<ApplicationRecord | null>(null);
  const [activeDoctorModal, setActiveDoctorModal] = useState<Doctor | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Initialize theme from system or default to dark
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    root.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const root = document.documentElement;
    if (nextTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  };

  // Initialize profile & history from localStorage
  useEffect(() => {
    const storedProfile = getUserProfile();
    const storedHistory = getApplicationsHistory();
    setApplications(storedHistory);

    if (storedProfile) {
      setUserProfile(storedProfile);
      setCurrentLanguage(storedProfile.language);
    } else {
      setIsOnboardingOpen(true);
    }
  }, []);

  // Sync direct doctor URLs (#doctor/doc-1)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#doctor/')) {
        const id = hash.replace('#doctor/', '');
        const match = DOCTORS.find((d) => d.id === id);
        if (match) setActiveDoctorModal(match);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleBookingSuccess = (newRecord: ApplicationRecord) => {
    setApplications((prev) => [newRecord, ...prev]);
    setRecentTicket(newRecord);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    saveUserProfile(profile);
    setUserProfile(profile);
    setCurrentLanguage(profile.language);
    setIsOnboardingOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLanguageSwitch = (lang: Language) => {
    setCurrentLanguage(lang);
    setGlobalLanguage(lang);
    if (userProfile) {
      const updated = { ...userProfile, language: lang };
      setUserProfile(updated);
      saveUserProfile(updated);
    }
  };

  return (
    <div
      className={`min-h-screen relative font-sans ${
        theme === 'dark' ? 'bg-[#0B0F19] text-white' : 'bg-[#F8FAFC] text-slate-900'
      } transition-colors duration-200`}
    >
      {/* 1. Burning Reveal WebGL Intro with Clinic Logo */}
      {showBurningIntro && (
        <BurningRevealIntro
          onComplete={() => setShowBurningIntro(false)}
          logoUrl="https://i.ibb.co/ZpJBtrnv/Gemini-Generated-Image-mgkabimgkabimgka-1-removebg-preview.png"
        />
      )}

      {/* 2. Apple Liquid Glass Navigation Bar (Frosted glass, dynamic glare, bouncy active pill) */}
      <AppleLiquidNav
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageSwitch}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReplayIntro={() => setShowBurningIntro(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        applicationsCount={applications.length}
      />

      {/* Purpose-driven Collapsible Clinic Utility Drawer (103 Radar, Free Meds, Floor Map, Triage) */}
      <SidebarUtilityDrawer
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageSwitch}
        theme={theme}
        onToggleTheme={toggleTheme}
        onNavigateToBooking={() => scrollToSection('booking')}
      />

      {/* Main Content Sections */}
      <main className="relative z-10 pt-20">
        {/* Hero Section matching Screenshot 1 */}
        <HeroSection
          currentLanguage={currentLanguage}
          onBookClick={() => scrollToSection('booking')}
          onBenefitsClick={() => scrollToSection('benefits')}
        />

        {/* 4-Step Social Benefit Engine via my.gov.uz */}
        <SocialBenefitSteps currentLanguage={currentLanguage} />

        {/* Doctors and Committees matching Screenshots 2 & 3 */}
        <DoctorsSection
          doctors={DOCTORS}
          currentLanguage={currentLanguage}
          onSelectDoctor={(doctor) => {
            setActiveDoctorModal(doctor);
          }}
        />

        {/* Clinical Services Modern Slider */}
        <ServicesSlider
          services={MEDICAL_SERVICES}
          currentLanguage={currentLanguage}
          onSelectService={(service) => {
            setSelectedService(service);
            scrollToSection('booking');
          }}
        />

        {/* Booking Form with Real-time Operator Detection & Ambulance Truck Button */}
        <BookingForm
          currentLanguage={currentLanguage}
          userProfile={userProfile}
          selectedService={selectedService}
          onSuccess={handleBookingSuccess}
        />
      </main>

      {/* Footer with social media links, contacts, licensing */}
      <Footer
        currentLanguage={currentLanguage}
        onReplayIntro={() => setShowBurningIntro(true)}
      />

      {/* AI Medical Consultant Widget */}
      <AIConsultantWidget currentLanguage={currentLanguage} />

      {/* Presidential Patient Registration Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Success Ticket Pass Modal with Telegram Deep Link */}
      <SuccessTicketModal
        record={recentTicket}
        currentLanguage={currentLanguage}
        onClose={() => setRecentTicket(null)}
      />

      {/* Settings & Application History Modal */}
      <SettingsHistoryModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        applications={applications}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenTicket={(app) => {
          setIsSettingsOpen(false);
          setRecentTicket(app);
        }}
      />

      {/* Individual Doctor Profile Page Modal with URL Deep-link */}
      <DoctorProfileModal
        doctor={activeDoctorModal}
        isOpen={!!activeDoctorModal}
        onClose={() => setActiveDoctorModal(null)}
        currentLanguage={currentLanguage}
        onBookWithDoctor={(doc) => {
          const matchService =
            MEDICAL_SERVICES.find((s) => s.id === doc.associatedServiceId) ||
            MEDICAL_SERVICES[0];
          setSelectedService(matchService);
          scrollToSection('booking');
        }}
      />
    </div>
  );
}
