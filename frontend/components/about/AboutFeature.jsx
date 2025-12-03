import React from 'react';
import Image from "next/image";

import feature1 from "@/public/about-feature/feature.png";
import feature2 from "@/public/about-feature/feature2.png";
import feature3 from "@/public/about-feature/feature3.png";

const AboutFeature = () => {
  return (
    <div className="w-full space-y-16 mt-26">

      {/* About Us */}
      <div className="relative flex bg-[#F4FEEE] max-w-4xl mx-auto   border-8  border-[#DCD5F2] rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] 
                       p-8">
        
        <div className="flex items-center gap-6">
         
          <div>
            <h2 className="text-xl font-bold text-gray-800">About Us</h2>
            <p className="text-gray-600 w-[530px]  mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
              <Image height={288} width={308} alt='img' src={feature1} className='absolute -right-36'/>
        </div>

    
      </div>

      {/* What makes us different */}
      <div className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                      border-l-4 border-green-300 p-8">

        <div className="flex items-center gap-6">
          <div className="w-32">
            <Image src={feature2} alt="feature2" className="w-full h-auto" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">What makes us different?</h2>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

      {/* Our Services */}
      <div className="relative max-w-4xl mx-auto bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]
                      border-l-4 border-pink-300 p-8">

        <div className="flex items-center gap-6">
          <div className="w-32">
            <Image src={feature3} alt="feature3" className="w-full h-auto" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800">Our Services</h2>
            <p className="text-gray-600 mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt 
              ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutFeature;
