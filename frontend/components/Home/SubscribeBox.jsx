"use client";

import Image from "next/image";

export default function SubscribeBox() {
  return (
    <section className="w-full px-4 mb-20">
      <div className="mx-auto max-w-5xl rounded-xl bg-[#F4E8FF] px-6 py-8 md:flex md:items-center md:justify-between md:px-10">
        
        {/* Left Image */}
        <div className="flex justify-center md:block">
          <Image
            src="/home/subscribebox.png"
            alt="Kids studying"
            width={350}
            height={273}
            className="h-auto w-[260px] md:w-full object-contain"
          />
        </div>

        {/* Right Content */}
        <div className="mt-6 text-center md:mt-0 md:text-left md:w-[55%]">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Subscribe to our Studiquo
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          {/* Input + Button */}
          <div className="mt-4 flex justify-center md:justify-start">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[60%] md:w-[55%] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none"
            />
            <button className="ml-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
