'use client'

import Footer from "@/components/Footer";
import Banner from "@/components/Home/Banner";
import LearnerStories from "@/components/Home/LearnerStories";
import SubscribeBox from "@/components/Home/SubscribeBox";
import Topics from "@/components/Home/Topics";
import TopicsSection from "@/components/Home/TopicsSection";
import Tutors from "@/components/Home/Tutors";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";

export default function page() {
  return (
    <div className="min-h-screen overfh bg-white">
      <Navbar />
      <Banner/>
      <TopicsSection/>
      <Tutors/>
      <LearnerStories/>
      <SubscribeBox/>
      <SiteFooter/>
    </div>
  );
}
