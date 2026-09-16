import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgress } from '../ui/ScrollProgress';
import { BackToTop } from '../ui/BackToTop';
import { AnimatedBackground } from '../ui/AnimatedBackground';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/20 selection:text-primary">
      <ScrollProgress />
      <AnimatedBackground />
      <Navbar />
      <main className="flex-1 relative z-10 pt-20">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};
