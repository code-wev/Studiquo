'use client';

import React, { useState, useEffect } from "react";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { FaChalkboardTeacher, FaUsers, FaCreditCard, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from '@/public/dashboardlogo.png';

const navItems = [
  { label: "Dashboard", icon: MdDashboard },
  { label: "Tutor", icon: FaChalkboardTeacher },
  { label: "Students", icon: FaUsers },
  { label: "Payment", icon: FaCreditCard },
  { label: "Profile", icon: FaUserCircle },
];

const Sidebar = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change
  useEffect(() => {
    setOpen(false);
  }, [pathName]);

  return (
    <>
      {/* Mobile Menu Button - Fixed outside sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setOpen(true)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          <MdMenu size={24} />
        </button>
      </div>

      {/* Overlay - Only show on mobile when sidebar is open */}
      {open && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`

          min-h-screen
          ${isMobile ? 'fixed' : 'relative'} 
          top-0 left-0 z-50
          w-[295px] h-full
          bg-[#f5f5f5] border-r border-gray-200
          flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isMobile ? 'shadow-xl' : ''}
        `}
      >
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5">
            <Image alt="logo" src={logo} width={150} height={40} />
            
            {/* Close button (mobile only) */}
            <button
              onClick={() => setOpen(false)}
              className="md:hidden p-1 hover:bg-gray-200 rounded"
            >
              <MdClose size={22} />
            </button>
          </div>

          {/* Nav */}
          <nav className="px-4 space-y-2 mt-8">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 rounded-lg
                  cursor-pointer transition
                  border border-[#00000099] text-[#00000099]
                  hover:bg-[#CCB7F8CC] hover:text-[#3A0E95]"
                onClick={() => {
                  if (isMobile) setOpen(false);
                }}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Info */}
        <div className="px-6 py-4 text-xs text-gray-500 border-t">
          <div className="flex justify-between">
            <span>Shei Shei</span>
            <span>OPI</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;