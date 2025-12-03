import React from "react";
import Image from "next/image";
import bg1 from "@/public/hiw/hiwBg.png";
import bg2 from "@/public/hiw/hiw2Bg.png";
import step from "@/public/hiw/step11.png";
import step2 from "@/public/hiw/step2.png";
import step3 from "@/public/hiw/step3.png";
import step4 from "@/public/hiw/step4.png";

export default function Hiw() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-20 px-4 bg-[#FFFFFF] overflow-hidden">
      {/* Background Shapes */}
      <div className="relative">
        <Image
          src={bg1}
          alt="img"
          width={652}
          height={645}
          className="absolute"
        />
      </div>

      {/* Main Title */}
      <div className="relative">
        <h2 className="text-center text-3xl md:text-4xl font-semibold text-black">
          How <span className="font-light">Studiquo </span>
          <span className="text-black font-bold">works?</span>
        </h2>
        <p className="text-center mt-4 text-gray-600 max-w-xl text-sm md:text-base">
          We built this platform to connect students with expert <br /> tutors
          who inspire confidence, curiosity, and <br /> academic success.
        </p>

        {/* Subheading */}
        <h3 className="mt-16 text-center text-xl font-medium">
          How Studiquo works?
        </h3>
      </div>

      {/* Timeline Container */}
      <div className="flex flex-col items-center mx-au mt-12 gap-8 w-full max-w-4xl mx-auto">
        {/* Step 1 */}
        <div className="flex items-start w-full gap-8">
          {/* Image on left */}
          <div className="w-1/3 flex justify-end">
            <Image
              src={step}
              width={220}
              height={200}
              alt="profile"
              className="rounded-md"
            />
          </div>

          {/* Timeline line and number */}
          <div className="flex flex-col items-center">
            <div className="w-[35px] h-[35px] text-[#838383] flex items-center justify-center bg-primary outline-2 outline outline-[#838383] rounded-full text-[1rem] font-bold">
              1
            </div>
            <div className="w-[0.5px] h-full min-h-[200px] bg-[#000000] mt-2.5"></div>
          </div>

          {/* Content on right */}
          <div className="w-1/2 pl-4">
            <h4 className="font-semibold text-lg mb-2">Create your Profile</h4>
            <p className="text-gray-600 leading-relaxed">
              Upload your photo and fill your general info. Once your profile is
              set, Studiquo will start sending your profile.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start w-full gap-8">
          {/* Content on left */}
          <div className="w-1/3 pr-4 text-right">
            <h4 className="font-semibold text-lg mb-2">
              Action steps as a tutor
            </h4>
            <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
              <li>• Create Profile & Set Availability</li>
              <li>• Get Discovered & Receive Bookings</li>
              <li>• Conduct Lessons & Communicate via Zoom</li>
              <li>• Track Earnings & Reviews</li>
            </ul>
          </div>

          {/* Timeline line and number */}
          <div className="flex flex-col items-center">
            <div className="w-[35px] h-[35px] text-[#838383] flex items-center justify-center bg-primary outline-2 outline outline-[#838383] rounded-full text-[1rem] font-bold">
              2
            </div>
            <div className="w-[0.5px] h-full min-h-[200px] bg-[#000000] mt-2.5"></div>
          </div>

          {/* Image on right */}
          <div className="w-1/2 flex justify-start">
            <Image
              src={step2}
              width={220}
              height={200}
              alt="profile"
              className="rounded-md"
            />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start w-full gap-8">
          {/* Image on left */}
          <div className="w-1/3 flex justify-end">
            <Image
              src={step3}
              width={220}
              height={200}
              alt="profile"
              className="rounded-md"
            />
          </div>

          {/* Timeline line and number */}
          <div className="flex flex-col items-center">
            <div className="w-[35px] h-[35px] text-[#838383] flex items-center justify-center bg-primary outline-2 outline outline-[#838383] rounded-full text-[1rem] font-bold">
              3
            </div>
            <div className="w-[0.5px] h-full min-h-[200px] bg-[#000000] mt-2.5"></div>
          </div>

          {/* Content on right */}
          <div className="w-1/2 pl-4">
            <h4 className="font-semibold text-lg mb-2">Find & Book Tutors</h4>
            <ul className="text-gray-600 text-sm leading-relaxed space-y-2">
              <li>• Browse Verified Tutor Profiles</li>
              <li>• Compare Reviews & Ratings</li>
              <li>• Book Available Time Slots</li>
              <li>• Secure Payment Processing</li>
            </ul>
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex items-start w-full gap-8">
          {/* Content on left */}
          <div className="w-1/3 pr-4 text-right">
            <h4 className="font-semibold text-lg mb-2">Overview</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Students from all grades, book lessons, and enjoy high-quality
              tutoring from our expert providers. Studiquo enables seamless
              learning through browsing, booking, easy communication, and
              engaging learning. From real-time messaging and scheduling to
              automatic earnings integration for tutors.
            </p>
          </div>

          {/* Timeline line and number */}
          <div className="flex flex-col items-center">
            <div className="w-[35px] h-[35px] text-[#838383] flex items-center justify-center bg-primary outline-2 outline outline-[#838383] rounded-full text-[1rem] font-bold">
              4
            </div>
            {/* Last step doesn't need the line extending down */}
            <div className="w-[0.5px] h-0 bg-[#000000] mt-2.5"></div>
          </div>

          {/* Image on right */}
          <div className="w-1/3 flex justify-start">
            <Image
              src={step4}
              width={220}
              height={200}
              alt="profile"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
