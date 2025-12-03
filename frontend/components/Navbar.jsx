"use client";

import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";


export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-100">
      <div className="px-6 lg:px-32 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Studiquo Logo" width={120} height={40} />
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <Link href="/find-tutor" className="text-black hover:text-black">
            Find a Tutor
          </Link>
          <Link href="/about" className="text-gray-500 hover:text-black">
            About Us
          </Link>
          <Link href="/how-its-works" className="text-gray-500 hover:text-black">
            How it works
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-black font-medium">
            Login
          </button>

        <Link href={'/register'}>
        
          <button className="bg-[#CCB7F8] flex cursor-pointer items-center gap-1 text-[#3A0E95] px-6 py-3 rounded-lg hover:bg-purple-700 transition font-bold">
            Register
            <FiArrowRight />
          </button></Link>
        </div>
      </div>
    </nav>
  );
} 
