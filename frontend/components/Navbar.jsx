"use client";

import { getAuthUser } from "@/action/auth.action";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { FiArrowRight, FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import logo from "../public/dashboardlogo.png";
import { useMyProfileQuery } from "@/feature/shared/AuthApi";
import { logOut } from "@/utils/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: profile } = useMyProfileQuery();
  const user = profile?.data?.user;


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle logout click
  const handleLogout = () => {
    console.log("logout clicked.");
    logOut()
    setIsUserDropdownOpen(false);
    // Here you can add your actual logout logic
  };

  // Handle dashboard click
  const handleDashboard = () => {
    // Determine dashboard URL based on user role
    let dashboardUrl = "/";
    if (user?.role === "Admin") {
      dashboardUrl = "/dashboard/admin";
    } else if (user?.role === "Tutor") {
      dashboardUrl = "/dashboard/tutor/";
    } else if (user?.role === "Student") {
      dashboardUrl = "/dashboard/student/upcoming-class";
    } else if (user?.role === "Parent"){
           dashboardUrl = "/dashboard/parent/payment-history";
    }
    window.location.href = dashboardUrl;
    setIsUserDropdownOpen(false);
  };

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

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.firstName?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <nav className='w-full bg-white border-b border-gray-100'>
      <div className='px-4 sm:px-6 lg:px-32 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link href='/' onClick={handleLinkClick}>
          <div className='flex items-center space-x-2'>
            <Image
              src={logo}
              alt='Studiquo Logo'
              width={280}
              height={90}
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className='hidden md:flex items-center space-x-8 text-[#919191]'>
          <Link
            href='/find-tutor'
            className={`${
              isActive("/find-tutor") ? "text-black" : "text-gray-500"
            } hover:text-black transition-colors`}>
            Find a Tutor
          </Link>
          <Link
            href='/about'
            className={`${
              isActive("/about") ? "text-black" : "text-gray-500"
            } hover:text-black transition-colors`}>
            About Us
          </Link>
          <Link
            href='/how-its-works'
            className={`${
              isActive("/how-it-works") ? "text-black" : "text-gray-500"
            } hover:text-black transition-colors`}>
            How it works
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className='hidden md:flex items-center space-x-4'>
          {user ? (
            <div className='relative' ref={dropdownRef}>
              {/* User Avatar with Dropdown */}
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200'
              >
                {/* Avatar */}
    {    user?.avatar ?     <Image src={user?.avatar} alt="profile" width={30} height={30} className="rounded-full "/> :        <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold'>
                  {getUserInitials()}
                </div>}
                
                {/* User Name and Arrow */}
                <div className='flex flex-col items-start'>
                  <span className='text-sm font-medium text-gray-700'>
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className='text-xs text-gray-500 capitalize'>
                    {user?.role || "User"}
                  </span>
                </div>
                
                {/* Dropdown Arrow */}
                <FaChevronDown 
                  className={`ml-2 text-gray-500 transition-transform duration-200 ${
                    isUserDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50'>
                  {/* Dashboard Button */}
                  <button
                    onClick={handleDashboard}
                    className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-gray-700'
                  >
                    <FiUser className='mr-3 text-gray-500' />
                    <span>Dashboard</span>
                  </button>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className='w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-red-600'
                  >
                    <FiLogOut className='mr-3' />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href='/login'>
                <button
                  className={`${
                    isActive("/login") ? "text-black" : "text-gray-500"
                  } hover:text-black font-medium cursor-pointer transition-colors`}>
                  Login
                </button>
              </Link>

              <Link href='/register'>
                <button
                  className={`${
                    isActive("/register")
                      ? "bg-[#3A0E95] text-white"
                      : "bg-[#CCB7F8] text-[#3A0E95]"
                  } flex cursor-pointer items-center gap-1 px-6 py-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all duration-300 font-bold`}>
                  Register
                  <FiArrowRight />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-gray-700 hover:text-black text-2xl'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label='Toggle menu'>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-100 px-4 py-6'>
          <div className='flex flex-col space-y-6'>
            {/* Mobile Nav Links */}
            <Link
              href='/find-tutor'
              onClick={handleLinkClick}
              className={`text-lg ${
                isActive("/find-tutor")
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } hover:text-black py-2 transition-colors`}>
              Find a Tutor
            </Link>
            <Link
              href='/about'
              onClick={handleLinkClick}
              className={`text-lg ${
                isActive("/about")
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } hover:text-black py-2 transition-colors`}>
              About Us
            </Link>
            <Link
              href='/how-its-works'
              onClick={handleLinkClick}
              className={`text-lg ${
                isActive("/how-it-works")
                  ? "text-black font-semibold"
                  : "text-gray-600"
              } hover:text-black py-2 transition-colors`}>
              How it works
            </Link>

            {/* Divider */}
            <div className='border-t border-gray-200 my-2'></div>

            {/* Mobile Auth Buttons */}
            <div className='flex flex-col space-y-4'>
              {user ? (
                <div className='space-y-4'>
                  {/* User Info */}
                  <div className='flex items-center space-x-3 p-3 bg-gray-50 rounded-lg'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold'>
    {    user?.avatar ?     <Image src={user?.avatar} alt="profile" width={64} height={64} className="rounded-full "/> :        <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold'>
                  {getUserInitials()}
                </div>}
                    </div>
                    <div>
                      <p className='font-medium text-gray-700'>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className='text-sm text-gray-500 capitalize'>
                        {user?.role || "User"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Mobile Dashboard Button */}
                  <button
                    onClick={() => {
                      handleDashboard();
                      handleLinkClick();
                    }}
                    className='w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all duration-300 font-medium'
                  >
                    <FiUser />
                    <span>Dashboard</span>
                  </button>
                  
                  {/* Mobile Logout Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                    className='w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-300 font-medium'
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link href='/login' onClick={handleLinkClick}>
                    <button
                      className={`w-full text-center text-lg ${
                        isActive("/login")
                          ? "text-black font-semibold"
                          : "text-gray-600"
                      } hover:text-black py-3 transition-colors`}>
                      Login
                    </button>
                  </Link>

                  <Link href='/register' onClick={handleLinkClick}>
                    <button
                      className={`w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg ${
                        isActive("/register")
                          ? "bg-[#3A0E95] text-white"
                          : "bg-[#CCB7F8] text-[#3A0E95]"
                      } hover:bg-purple-700 transition-all duration-300 font-bold text-lg`}>
                      Register
                      <FiArrowRight />
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}