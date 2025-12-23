import React from "react";
import Image from "next/image";
import bg1 from "@/public/hiw/hiwBg.png";
import bg2 from "@/public/hiw/hiw2Bg.png";
import step from "@/public/hiw/1.png";
import step2 from "@/public/hiw/2.png";
import step3 from "@/public/hiw/3.png";
import step4 from "@/public/hiw/4.png";
import { FaCheckCircle } from "react-icons/fa";

export default function Hiw() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-12 md:py-20 px-4 md:px-6 bg-[#FFFFFF] overflow-hidden">
      {/* Background Shapes - Hidden on mobile to reduce clutter */}
      <div className="relative">
        <Image
          src={bg2}
          alt="img"
          width={652}
          height={645}
          className="absolute top-0 z-0 hidden md:block"
        />
      </div>

      {/* Main Title */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-black">
          How <span className="font-light">Studiquo </span>
          <span className="text-black font-bold">works?</span>
        </h2>
        <p className="mt-3 md:mt-4 text-gray-600 text-sm md:text-base px-2">
          We built this platform to connect students with expert <br className="hidden md:block" /> tutors
          who inspire confidence, curiosity, and <br className="hidden md:block" /> academic success.
        </p>

        {/* Subheading */}
        <h3 className="mt-10 md:mt-16 text-lg md:text-xl font-medium">
          How Studiquo works?
        </h3>
      </div>

      {/* Timeline Container */}
      <div className="flex flex-col items-center mt-8 md:mt-12 gap-6 md:gap-8 w-full max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row items-start w-full gap-4 md:gap-8">
          {/* Image on left - Hidden on mobile, shown on desktop */}
          <div className="w-full md:w-1/2 hidden md:flex justify-end">
            <Image
              src={step}
              width={350}
              height={350}
              alt="profile"
              className="rounded-md"
            />
          </div>

          {/* Timeline line and number - Mobile centered */}
          <div className="flex md:flex-col items-center justify-center w-full md:w-auto">
            <div className="md:flex md:flex-col md:items-center">
              <div className="w-10 h-10 md:w-8.75 md:h-8.75 text-[#838383] flex items-center justify-center bg-primary border-2 md:outline border-[#838383] md:border-none md:outline-[#838383] rounded-full text-base md:text-[1rem] font-bold">
                1
              </div>
              <div className="hidden md:block w-[0.5px] h-full min-h-50 bg-[#000000] mt-2.5"></div>
            </div>
          </div>

          {/* Content on right - Full width on mobile */}
          <div className="w-full md:w-1/2 pl-0 md:pl-4">
            <h4 className="font-semibold text-lg mb-2">Create an Account</h4>
            <p className="text-gray-600 leading-relaxed text-sm md:max-w-97.5">
              Parents, students and tutors create a secure Studiquo account in
              just a few minutes. <br className="hidden md:block" />
              Parents share their child’s year group, confidence level and
              learning goals. <br className="hidden md:block" />
              Tutors create a profile highlighting their subjects, availability
              and experience. <br className="hidden md:block" />
              This allows us to understand exactly who you are and what you’re
              looking for.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row items-start w-full gap-4 md:gap-8">
          {/* Content on left - Full width on mobile, shown first */}
          <div className="w-full md:w-1/2 pr-0 md:pr-4 text-left order-2 md:order-1">
            <h4 className="font-semibold text-lg mb-2">
              Find the right tutor (or be matched)
            </h4>
            <div className="text-gray-600 text-sm leading-relaxed space-y-2">
              <p>
                Parents can browse available tutors or let us choose the right
                match for them. Tutors are matched based on:
              </p>
              <div className="pl-2">
                <p>• Subject Level</p>
                <p>• Availability</p>
                <p>• Teaching Style & Personality</p>
              </div>
              <p>
                This ensures every student is paired with a tutor who suits
                their learning needs.
              </p>
            </div>
          </div>

          {/* Timeline line and number - Mobile centered */}
          <div className="flex md:flex-col items-center justify-center w-full md:w-auto order-1 md:order-2">
            <div className="md:flex md:flex-col md:items-center">
              <div className="w-10 h-10 md:w-8.75 md:h-8.75 text-[#838383] flex items-center justify-center bg-primary border-2 md:outline border-[#838383] md:border-none md:outline-[#838383] rounded-full text-base md:text-[1rem] font-bold">
                2
              </div>
              <div className="hidden md:block w-[0.5px] h-full min-h-50 bg-[#000000] mt-2.5"></div>
            </div>
          </div>

          {/* Image on right - Hidden on mobile, shown on desktop */}
          <div className="w-full md:w-1/2 hidden md:flex justify-start order-3">
            <Image
              src={step2}
              width={350}
              height={350}
              alt="profile"
              className="rounded-md"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row items-start w-full gap-4 md:gap-8">
          {/* Image on left - Hidden on mobile, shown on desktop */}
          <div className="w-full md:w-1/2 hidden md:flex justify-end">
            <Image
              src={step3}
              width={350}
              height={350}
              alt="profile"
              className="rounded-md"
            />
          </div>

          {/* Timeline line and number - Mobile centered */}
          <div className="flex md:flex-col items-center justify-center w-full md:w-auto">
            <div className="md:flex md:flex-col md:items-center">
              <div className="w-10 h-10 md:w-8.75 md:h-8.75 text-[#838383] flex items-center justify-center bg-primary border-2 md:outline border-[#838383] md:border-none md:outline-[#838383] rounded-full text-base md:text-[1rem] font-bold">
                3
              </div>
              <div className="hidden md:block w-[0.5px] h-full min-h-50 bg-[#000000] mt-2.5"></div>
            </div>
          </div>

          {/* Content on right - Full width on mobile */}
          <div className="w-full md:w-1/2 pl-0 md:pl-4">
            <h4 className="font-semibold text-lg mb-2"> Meet online & start learning</h4>
            
            <div className="text-gray-600 text-sm leading-relaxed space-y-2">
              <p className="text-gray-600">Students meet their tutor online for a free introductory session. They:</p>
              <div className="pl-2">
                <p>• Get to know their tutor</p>
                <p>• Try a few questions</p>
                <p>• Talk through what they find challenging</p>
              </div>
              <p className="text-gray-600 text-sm">Lessons then take place online in one-to-one sessions, with tutors and students communicating through the platform.</p>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex flex-col md:flex-row items-start w-full gap-4 md:gap-8">
          {/* Content on left - Full width on mobile, shown first */}
          <div className="w-full md:w-1/2 pr-0 md:pr-4 text-left order-2 md:order-1">
            <h4 className="font-semibold text-lg mb-2">Overview</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Students from all grades, book lessons, and enjoy high-quality
              tutoring from our expert providers. Studiquo enables seamless
              learning through browsing, booking, easy communication, and
              engaging learning. From real-time messaging and scheduling to
              automatic earnings integration for tutors.
            </p>
          </div>

          {/* Timeline line and number - Mobile centered */}
          <div className="flex md:flex-col items-center justify-center w-full md:w-auto order-1 md:order-2">
            <div className="md:flex md:flex-col md:items-center">
              <div className="w-10 h-10 md:w-8.75 md:h-8.75 text-[#838383] flex items-center justify-center bg-primary border-2 md:outline border-[#838383] md:border-none md:outline-[#838383] rounded-full text-base md:text-[1rem] font-bold">
                4
              </div>
              <div className="hidden md:block w-[0.5px] h-full min-h-50 bg-[#000000] mt-2.5"></div>
            </div>
          </div>

          {/* Image on right - Hidden on mobile, shown on desktop */}
          <div className="w-full md:w-1/2 hidden md:flex justify-start order-3">
            <Image
              src={step4}
              width={350}
              height={350}
              alt="profile"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}