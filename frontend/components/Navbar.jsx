"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 left-0 w-full h-max z-50">
      <nav className="flex backdrop-blur text-black font-bold flex-row justify-between items-center md:px-[48px] lg:px-[110px] py-2 shadow-2xl">
        {/* Logo + Menu Icon */}
        <div className="flex flex-row justify-between w-full xl:w-fit items-center">
          <Link href="/" className="py-4 px-4 text-2xl">
            <span className="text-[#44141] cursor-pointer capitalize">
              STUDI
            </span>
            <span className="text-yellow-500">QUO</span>
          </Link>

          {/* Mobile Menu Icon */}
          <div
            className="py-4 w-fit h-fit xl:hidden cursor-pointer px-8"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FaBars />
          </div>

          {/* Desktop Menu */}
          <ul className="xl:flex flex-row hidden gap-2">
            <li>
              {/* <Link href="/" className="py-3 px-6 rounded hover:bg-[#ffffff44]">
                Home
              </Link> */}
            </li>
            <li>
              <Link
                href="/about"
                className="py-3 px-6 rounded hover:bg-[#ffffff44]"
              >
                About Us
              </Link>
            </li>
            {/* <li>
              <Link
                href="/support"
                className="py-3 px-6 rounded hover:bg-[#ffffff44]"
              >
                Contact
              </Link>
            </li> */}
            <li>
              <Link
                href="/how"
                className="py-3 px-6 rounded hover:bg-[#ffffff44]"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="/find"
                className="py-3 px-6 rounded hover:bg-[#ffffff44]"
              >
                Find A Tutor
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="xl:flex flex-row hidden gap-4 items-center">
          {/* Search Bar */}
          {/* <div className="justify-center items-center flex">
            <input
              type="text"
              placeholder="Search course..."
              className="border border-gray-500 p-2 rounded-lg text-base bg-transparent focus:ring-gray-800 focus:border-gray-500 outline-none"
            />
          </div> */}

          {/* Auth Buttons */}
          <div className="flex flex-row">
            <Link
              href="/login"
              className="text-md font-bold py-4 px-8 hover:bg-[#ffffff44]"
            >
              Login
            </Link>
            <div className="w-fit h-fit relative group">
              <p className="text-md font-bold py-4 px-8 hover:bg-[#ffffff44] cursor-pointer">
                Sign-Up
              </p>
              <div className="absolute hidden group-hover:flex flex-col bg-[#040150] w-48 mt-1 z-50">
                <Link
                  href="/register/student"
                  className="text-md font-bold py-3 px-6 hover:bg-[#ffffff44]"
                >
                  Student Sign-up
                </Link>
                <Link
                  href="/register/instructor"
                  className="text-md font-bold py-3 px-6 hover:bg-[#ffffff44]"
                >
                  Instructor Sign-up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed z-50 top-0 right-0 h-full w-64 bg-[#2f2753] shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out xl:hidden`}
      >
        <div className="flex justify-end p-4">
          <FaTimes
            className="text-white text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        <ul className="flex flex-col items-start text-start px-6 text-white">
          <li className="py-4 w-full">
            {/* <Link href="/" onClick={() => setIsOpen(false)}>
              Home
            </Link> */}
          </li>
          <li className="py-4 w-full">
            <Link href="/about" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
          </li>
          <li className="py-4 w-full">
            <Link href="/support" onClick={() => setIsOpen(false)}>
              Support
            </Link>
          </li>
          <li className="py-4 w-full">
            <Link href="/how" onClick={() => setIsOpen(false)}>
              How It Works
            </Link>
          </li>
          <div className="flex flex-col gap-y-4 w-full mt-4">
            <Link
              href="/register/student"
              className="text-md font-bold py-4 px-8 hover:bg-[#ffffff44]"
              onClick={() => setIsOpen(false)}
            >
              Student Sign-up
            </Link>
            <Link
              href="/register/instructor"
              className="text-md font-bold py-4 px-8 hover:bg-[#ffffff44]"
              onClick={() => setIsOpen(false)}
            >
              Instructor Sign-up
            </Link>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
