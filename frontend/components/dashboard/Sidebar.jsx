"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MdDashboard,
  MdMenu,
  MdClose,
  MdMessage,
  MdSchool,
  MdPerson,
  MdAttachMoney,
} from "react-icons/md";
import {
  FaChalkboardTeacher,
  FaUsers,
  FaCreditCard,
  FaUserCircle,
  FaCalendarAlt,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/public/dashboardlogo.png";

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Extract role from pathname
  const getRoleFromPath = () => {
    if (pathname.includes("/dashboard/admin")) return "admin";
    if (pathname.includes("/dashboard/tutor")) return "tutor";
    if (pathname.includes("/dashboard/student")) return "student";
    if (pathname.includes("/dashboard/parent")) return "parent";
    return "admin"; // default
  };

  const currentRole = getRoleFromPath();

  // Define navigation items for each role
  const navigationByRole = {
    admin: [
      { label: "Dashboard", icon: MdDashboard, href: "/dashboard/admin" },
      {
        label: "Tutor",
        icon: FaChalkboardTeacher,
        href: "/dashboard/admin/tutor",
      },
      { label: "Students", icon: FaUsers, href: "/dashboard/admin/students" },
      {
        label: "Payment",
        icon: FaCreditCard,
        href: "/dashboard/admin/payment",
      },
      {
        label: "Profile",
        icon: FaUserCircle,
        href: "/dashboard/admin/profile",
      },
    ],
    tutor: [
      { label: "Dashboard", icon: MdDashboard, href: "/dashboard/tutor" },
      {
        label: "Bookings",
        icon: FaChalkboardTeacher,
        href: "/dashboard/tutor/bookings",
      },
      {
        label: "Ratings",
        icon: FaCalendarAlt,
        href: "/dashboard/tutor/ratings",
      },
      {
        label: "Earnings",
        icon: BiMessageDetail,
        href: "/dashboard/tutor/earnings",
      },
      {
        label: "Calender",
        icon: FaFileInvoiceDollar,
        href: "/dashboard/tutor/calender",
      },
      {
        label: "Lesson Planning",
        icon: FaFileInvoiceDollar,
        href: "/dashboard/tutor/lesson-planning",
      },
      {
        label: "Chats",
        icon: FaFileInvoiceDollar,
        href: "/dashboard/tutor/chats",
      },
      { label: "Profile", icon: MdPerson, href: "/dashboard/tutor/profile" },
    ],
    student: [
      {
        label: "Upcoming Classes",
        icon: MdSchool,
        href: "/dashboard/student/upcoming-class",
      },
      { label: "Chats", icon: MdSchool, href: "/dashboard/student/chats" },
      {
        label: "Exam Board",
        icon: MdSchool,
        href: "/dashboard/student/exam-board",
      },
      { label: "Profile", icon: MdPerson, href: "/dashboard/student/profile" },
    ],
    parent: [
      {
        label: "Payment History",
        icon: MdAttachMoney,
        href: "/dashboard/parent/payment-history",
      },
      { label: "chat", icon: MdMessage, href: "/dashboard/parent/chat" },
      { label: "Profile", icon: MdPerson, href: "/dashboard/parent/profile" },
    ],
  };

  const navItems = navigationByRole[currentRole] || navigationByRole.admin;

  // Function to check if a link is active
  const isActive = (href) => {
    // For home page of each role
    if (href === `/dashboard/${currentRole}`) {
      return pathname === href || pathname === `${href}/`;
    }
    // For all other pages
    return pathname.startsWith(href);
  };

  // Role display names
  const roleDisplayNames = {
    admin: "Admin",
    tutor: "Tutor",
    student: "Student",
    parent: "Parent",
  };

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
          w-73.75 h-screen bg-[#f5f5f5] border-r border-gray-200
          transition-transform duration-300 ease-in-out
          ${
            open
              ? "translate-x-0 md:translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* Logo & Role Info */}
        <div className="px-6 py-5 border-b">
          <div className="flex items-center justify-between">
            <Image alt="logo" src={logo} priority />
            <MdClose
              size={22}
              className="md:hidden cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>
          {/* Role Badge */}
          <div className="mt-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
              {roleDisplayNames[currentRole]} Dashboard
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-3 mt-8">
          {navItems.map((item, index) => {
            const active = isActive(item.href);

            return (
              <Link
                key={index}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  cursor-pointer transition-all duration-200
                  border border-[#00000099]
                  ${
                    active
                      ? "bg-[#CCB7F8CC] text-[#3A0E95] font-medium"
                      : "text-[#00000099] hover:bg-[#CCB7F8CC] hover:text-[#3A0E95]"
                  }
                `}
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div>
          <Link href={"/"}>
            <button className="absolute bottom-4 left-0 px-4 btn text-red-500">Log Out</button>
          </Link>
        </div>
        {/* Quick Role Switcher - For development only */}
        {/* <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-white border rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-2">Quick Switch:</p>
            <div className="flex flex-wrap gap-1">
              <a 
                href="/dashboard/admin" 
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Admin
              </a>
              <a 
                href="/dashboard/tutor" 
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Tutor
              </a>
              <a 
                href="/dashboard/student" 
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Student
              </a>
              <a 
                href="/dashboard/parent" 
                className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Parent
              </a>
            </div>
          </div>
        </div> */}
      </aside>
    </>
  );
};

export default Sidebar;
