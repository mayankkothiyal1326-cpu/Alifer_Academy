import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeView } from './components/home/HomeView';
import { MyLearningView } from './components/learning/MyLearningView';
import { UpcomingClasses } from './components/live/UpcomingClasses';
import { TestZone } from './components/practice/TestZone';
import { ProfileView } from './components/profile/ProfileView';

import { VideoPlayerModal } from './components/learning/VideoPlayerModal';
import { PdfViewerModal } from './components/common/PdfViewerModal';
import { NotificationModal } from './components/common/NotificationModal';
import { AliferAiModal } from './components/ai/AliferAiModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CategoryAllModal } from './components/category/CategoryAllModal';
import { FestivalAnnouncementModal } from './components/common/FestivalAnnouncementModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';

const MainAppContent: React.FC = () => {
  const { 
    activeTab, 
    isAuthOpen, 
    setIsAuthOpen, 
    isOnboardingOpen, 
    setIsOnboardingOpen,
    isAdminOpen,
    setIsAdminOpen,
    activeCheckoutCourse,
    closeCheckout
  } = useApp();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-100 font-sans flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Application Header */}
      <Header />

      {/* Main Responsive Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'learning' && <MyLearningView />}
        {activeTab === 'live' && <UpcomingClasses />}
        {activeTab === 'practice' && <TestZone />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Primary 5-Tab Bottom Navigation Bar */}
      <BottomNav />

      {/* Global Modals & Feature Overlays */}
      <VideoPlayerModal />
      <PdfViewerModal />
      <NotificationModal />
      <AliferAiModal />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
      <CategoryAllModal />
      <FestivalAnnouncementModal />
      {activeCheckoutCourse && (
        <CheckoutModal course={activeCheckoutCourse} onClose={closeCheckout} />
      )}
      {isAdminOpen && <AdminPortal onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
