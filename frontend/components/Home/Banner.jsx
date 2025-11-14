"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="w-full p-10 md:p-[122px] overflow-hidden min-h-screen flex lg:justify-between items-center md:items-start lg:items-center flex-col lg:flex-row bg-opacity-25 bg-gradient-to-bl to-[#041b3a] from-[#0B1120]">
      {/* Left Section */}
      <div className="w-full lg:w-[45%] flex justify-start items-start flex-col gap-6 md:gap-3">
        <h1 className="text-2xl lg:text-5xl md:text-5xl text-white text-left font-bold">
          Best <span className="text-blue-500">Online Learning Platform</span>{" "}
          for <br /> Skill & Career Growth
        </h1>

        <p className="text-white text-lg">
          Expert-led courses for flexible, online learning.
        </p>

        <div className="text-xl md:text-[20px] rounded text-white duration-300 mt-4">
          <Link
            href="/dashboard/studentDashboard"
            className="bg-[#38BDF8] hover:bg-blue-700 text-white px-6 py-3 rounded-3xl font-semibold transition duration-300 ease-in-out"
          >
            Discover More
          </Link>
        </div>
      </div>
      {/* Right Section */}
      <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
        {/* Animated Shapes */}
        <div
          className="absolute top-[-300px] md:top-[-200px] z-[-1] right-[-300px] md:right-[-200px] w-[500px] h-[500px]"
          style={{
            transform: "rotate(45deg)",
          }}
        >
          <div className="relative">
            <div className="absolute rounded-[40px] w-[400px] h-[400px] bg-[rgba(0,0,0,0.4)] opacity-40 shadow transition-all duration-500"></div>
            <div className="absolute rounded-[30px] w-[300px] h-[300px] bg-[rgba(0,0,0,0.2)] opacity-40 shadow transition-all duration-500"></div>
            <div className="absolute rounded-[20px] w-[200px] h-[200px] bg-white opacity-55 shadow transition-all duration-500"></div>
          </div>
        </div>

        {/* Banner Image */}
        <div className="relative w-full h-[400px]">
          <Image
            src="https://tutorsheba3.netlify.app/assets/banner1-BOT-BWkG.svg"
            alt="Learning Banner"
            fill
            priority
            className="object-contain bannerAnimation"
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
