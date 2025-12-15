import Image from 'next/image';
import React from 'react';
import feature from "@/public/about-feature/feature.png"
import feature2 from "@/public/about-feature/feature2.png"
import feature3 from "@/public/about-feature/feature3.png"
import rounded from "@/public/rounded.png"

const AboutFeature = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 space-y-12 mb-10">

      {/* About Us */}
      <div className="relative flex items-center max-w-4xl mx-auto bg-linear-to-br from-green-50 to-purple-50 rounded-2xl border-x-8 md:border-l-8 border-y-8 border-[#BDA2F670] shadow-lg p-8 overflow-visible">
        <div className="flex-1 pr-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">About Us</h2>
          <p className="text-[#555555] leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="hidden md:flex shrink-0 w-64">
          <div className="absolute top-0 left-96 w-full h-48 rounded-lg flex items-center justify-center">
            <Image src={feature} alt="feature" className="absolute" width={350}
              height={180} />
          </div>
        </div>
      </div>

      {/* What makes us different */}
      <div className="relative flex items-center max-w-4xl mx-auto bg-[#FBFBFB] rounded-2xl border-x-8 md:border-r-8 border-y-8 border-[#F0F9F3] shadow-lg p-8 overflow-visible">
        <div className="hidden md:flex shrink-0 w-48 mr-8">
          <div className="absolute top-0 right-96 w-full h-48 rounded-lg flex items-center justify-center">
            <Image src={feature2} alt="feature2" className="absolute" width={350}
              height={180}/>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What makes us different?</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>

      {/* Our Services */}
      <div className="relative flex items-center max-w-4xl mx-auto bg-[#FBFBFB] rounded-2xl border-x-8 md:border-l-8 border-y-8 border-[#FCEDEB] shadow-lg p-8 overflow-visible">
        <div className="flex-1 pr-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Services</h2>
          <p className="text-gray-600 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
            ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="hidden md:flex shrink-0 w-48">
          <div className="absolute top-0 left-96 w-full h-48 rounded-lg flex items-center justify-center">
            <Image src={feature3} alt="feature3" className="absolute z-10" width={350}
              height={150} />
          </div>
          <div className="absolute z-0 top-8 left-80 w-full h-48 rounded-lg flex items-center justify-center ">
            <Image src={rounded} alt="feature3" className="absolute z-0" width={150}
              height={100} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutFeature;