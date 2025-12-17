'use client';

import React from 'react';
import { MdDashboard } from "react-icons/md";
import Image from 'next/image';
import { useMyProfileQuery } from '@/feature/shared/AuthApi';

const Topbar = () => {
    const { data: profile } = useMyProfileQuery();
    const user = profile?.data?.user;
    console.log(user, "User data");

      const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return user?.firstName?.charAt(0)?.toUpperCase() || "U";
  };
  return (
    <div className="w-full sticky h-14 min-w-full  bg-white  flex  justify-between px-6">
      
      {/* Left side */}
      <div className="flex items-center gap-2 text-gray-600">
        <MdDashboard size={18} />
        <span className="text-sm font-medium">Dashboard</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700 font-medium">
        {user?.firstName + ' ' + user?.lastName} 
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
       <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold'>
                  {getUserInitials()}
                </div>
        </div>
      </div>

    </div>
  );
};

export default Topbar;
