import React from 'react';
import HeroSection from '@/components/home/herosection';
import QuickServices from '@/components/home/quickservice';
import FeaturedDoctors from '@/components/home/featureddoctors';
import AnnouncementsBanner from '@/components/home/announcmentsbanner';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <QuickServices />
      <FeaturedDoctors />
      <AnnouncementsBanner />
    </div>
  );
}