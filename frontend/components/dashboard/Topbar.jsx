'use client';

import React from 'react';
import { MdDashboard } from "react-icons/md";
import Image from 'next/image';

const Topbar = () => {
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
          Esther Howard
        </span>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
          <Image
            src="https://i.pravatar.cc"
            alt="user"
            width={32}
            height={32}
          />
        </div>
      </div>

    </div>
  );
};

export default Topbar;
