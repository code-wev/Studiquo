'use client'

import Banner from "@/components/Home/Banner";
import LearnerStories from "@/components/Home/LearnerStories";
import SubscribeBox from "@/components/Home/SubscribeBox";
import TopicsSection from "@/components/Home/TopicsSection";
import Tutors from "@/components/Home/Tutors";

export default function page() {
  return (
    <div className="min-h-screen overfh bg-white">

      <Banner/>
      <TopicsSection/>
      <Tutors/>
      <LearnerStories/>
      <SubscribeBox/>

    </div>
  );
}
