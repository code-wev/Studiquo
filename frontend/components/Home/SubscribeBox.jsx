"use client";

import Image from "next/image";

export default function SubscribeBox() {
  return (
    <section className="w-full px-4 mb-20">
      <div className="mx-auto max-w-6xl md:h-68 rounded-xl bg-[#C7B2E2] px-6 py-8 md:flex md:items-center md:justify-between md:px-10">
        
        {/* Left Image */}
        <div className="flex justify-center md:block">
          <Image
            src="/home/Subscribebox.png"
            alt="Kids studying"
            width={350}
            height={273}
            className="h-auto max-w-65 md:w-full object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="mt-6 text-center md:mt-0 md:text-left md:w-[55%]">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            Subscribe to our Studiquo
          </h2>
          <p className="mt-1 max-w-100  text-sm text-[#444141]">
            Get updates on new tutors, study resources, and helpful learning tips - straight to your inbox.
          </p>

          {/* Input + Button */}
          <div className="mt-4 flex justify-center md:justify-start ">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[60%] md:w-[55%] rounded-md border bg-white text-black border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
            <button className="ml-2 rounded-md bg-[#CECECE] px-4 py-2 text-sm font-semibold hover:bg-gray-800 hover:text-white">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
