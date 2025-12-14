'use client';

import React, { useState } from "react";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { FaChalkboardTeacher, FaUsers, FaCreditCard, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from '@/public/dashboardlogo.png';

const navItems = [
  { label: "Dashboard", icon: MdDashboard, href: "/dashboard" },
  { label: "Tutor", icon: FaChalkboardTeacher, href: "/dashboard/tutor" },
  { label: "Students", icon: FaUsers, href: "/dashboard/students" },
  { label: "Payment", icon: FaCreditCard, href: "/dashboard/payment" },
  { label: "Profile", icon: FaUserCircle, href: "/dashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center px-4 py-3 border-b bg-white fixed top-0 left-0 right-0 z-40">
        <MdMenu
          size={26}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-[295px] h-screen bg-[#f5f5f5] border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${
            open
              ? "translate-x-0 md:translate-x-0"
              : "-translate-x-full md:translate-x-0 md:translate-x-0"
          }
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <Image alt="logo" src={logo} priority />
          <MdClose
            size={22}
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-3 mt-8">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);

            return (
              <a
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  cursor-pointer transition-all
                  border border-[#00000099]
                  ${
                    isActive
                      ? "bg-[#CCB7F8CC] text-[#3A0E95]"
                      : "text-[#00000099] hover:bg-[#CCB7F8CC] hover:text-[#3A0E95]"
                  }
                `}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
