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
import { useSession } from "next-auth/react";

export default function page() {
  const data = useSession();
  console.log(data, "hey young man")
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
