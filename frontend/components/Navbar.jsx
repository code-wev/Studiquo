"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import logo from "../public/dashboardlogo.png"

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (pathname.includes("dashboard")) {
    return null;
  }

  // Function to check if a link is active
  const isActive = (path) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-32 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={handleLinkClick}>
          <div className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Studiquo Logo"
              width={280}
              height={90}
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-[#919191] ">
          <Link 
            href="/find-tutor" 
            className={`${isActive("/find-tutor") ? "text-black" : "text-gray-500"} hover:text-black transition-colors`}
          >
            Find a Tutor
          </Link>
          <Link 
            href="/about" 
            className={`${isActive("/about") ? "text-black" : "text-gray-500"} hover:text-black transition-colors`}
          >
            About Us
          </Link>
          <Link
            href="/how-its-works"
            className={`${isActive("/how-it-works") ? "text-black" : "text-gray-500"} hover:text-black transition-colors`}
          >
            How it works
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <button className={`${isActive("/login") ? "text-black" : "text-gray-500"} hover:text-black font-medium cursor-pointer transition-colors`}>
              Login
            </button>
          </Link>

          <Link href="/register">
            <button className={`${isActive("/register") ? "bg-[#3A0E95] text-white" : "bg-[#CCB7F8] text-[#3A0E95]"} flex cursor-pointer items-center gap-1 px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all duration-300 font-bold`}>
              Register
              <FiArrowRight />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 hover:text-black text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-6">
          <div className="flex flex-col space-y-6">
            {/* Mobile Nav Links */}
            <Link 
              href="/find-tutor" 
              onClick={handleLinkClick}
              className={`text-lg ${isActive("/find-tutor") ? "text-black font-semibold" : "text-gray-600"} hover:text-black py-2 transition-colors`}
            >
              Find a Tutor
            </Link>
            <Link 
              href="/about" 
              onClick={handleLinkClick}
              className={`text-lg ${isActive("/about") ? "text-black font-semibold" : "text-gray-600"} hover:text-black py-2 transition-colors`}
            >
              About Us
            </Link>
            <Link
              href="/how-its-works"
              onClick={handleLinkClick}
              className={`text-lg ${isActive("/how-it-works") ? "text-black font-semibold" : "text-gray-600"} hover:text-black py-2 transition-colors`}
            >
              How it works
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col space-y-4">
              <Link href="/login" onClick={handleLinkClick}>
                <button className={`w-full text-center text-lg ${isActive("/login") ? "text-black font-semibold" : "text-gray-600"} hover:text-black py-3 transition-colors`}>
                  Login
                </button>
              </Link>

              <Link href="/register" onClick={handleLinkClick}>
                <button className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg ${isActive("/register") ? "bg-[#3A0E95] text-white" : "bg-[#CCB7F8] text-[#3A0E95]"} hover:bg-purple-700 transition-all duration-300 font-bold text-lg`}>
                  Register
                  <FiArrowRight />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}