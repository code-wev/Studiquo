'use client';

import React, { useState } from "react";
import { MdDashboard, MdMenu, MdClose } from "react-icons/md";
import { FaChalkboardTeacher, FaUsers, FaCreditCard, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/dashboardlogo.png";

const navItems = [
  { label: "Dashboard", icon: MdDashboard, href: "/dashboard" },
  { label: "Tutor", icon: FaChalkboardTeacher, href: "/dashboard/tutor" },
  { label: "Students", icon: FaUsers, href: "/dashboard/students" },
  { label: "Payment", icon: FaCreditCard, href: "/dashboard/payment" },
  { label: "Profile", icon: FaUserCircle, href: "/dashboard/profile" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Top Bar - শুধু তিন লাইন আইকন */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-30">
        <Image src={logo} alt="logo" className="w-28" />
        <MdMenu
          size={26}
          className="cursor-pointer"
          onClick={() => setMobileOpen(true)}
        />
      </div>

      {/* Overlay (Mobile) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-screen
          bg-[#f5f5f5] border-r border-gray-200
          transition-all duration-300
          ${collapsed ? "w-[90px]" : "w-[295px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          {!collapsed && <Image src={logo} alt="logo" className="w-32" />}
          <div className="flex gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block text-gray-600"
            >
              ☰
            </button>
            <MdClose
              size={22}
              className="md:hidden cursor-pointer"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="px-4 space-y-4 mt-6">
          {navItems.map((item, index) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <a
                key={index}
                href={item.href}
                className={`
                  group flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition
                  ${isActive
                    ? "bg-[#CCB7F8CC] border border-[#00000099] text-[#3A0E95]"
                    : "border border-[#00000099] text-[#00000099] hover:bg-[#CCB7F8CC] hover:text-[#3A0E95]"
                  }
                `}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={20} />

                {!collapsed && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}

                {/* Tooltip (collapsed mode) */}
                {collapsed && (
                  <span className="absolute left-full ml-3 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom Info */}
        {!collapsed && (
          <div className="absolute bottom-4 w-full px-6 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>295 Fill</span>
              <span>1113 Fill</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;