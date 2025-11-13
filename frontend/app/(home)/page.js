'use client'

import Banner from "@/components/Home/Banner";
import Navbar from "@/components/Navbar";

export default function page() {
  return (
    <div className="min-h-screen overfh bg-white">
      <Navbar />
      <Banner/>
    </div>
  );
}
