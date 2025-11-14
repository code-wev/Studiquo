'use client'

import Footer from "@/components/Footer";
import Banner from "@/components/Home/Banner";
import Topics from "@/components/Home/Topics";
import Navbar from "@/components/Navbar";

export default function page() {
  return (
    <div className="min-h-screen overfh bg-white">
      <Navbar />
      <Banner/>
      <Topics/>
      <Footer/>
    </div>
  );
}
