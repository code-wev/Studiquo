import React from 'react';
import { LuUserPen, LuUsers } from "react-icons/lu";
import { FaUsers } from "react-icons/fa";
import { MdPayments, MdPendingActions } from "react-icons/md";
import { FaDollarSign } from "react-icons/fa6";

const Overview = () => {
  return (
    <div className="bg-[#F7F7F7] p-12 rounded-lg">
      <h2 className="text-3xl mb-6">Overview</h2>

      <div className="grid md:grid-cols-2  lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Total Tutors</span>
            <LuUserPen />
          </div>
          <div className="text-3xl font-semibold text-gray-800 mt-12">134</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Total Students</span>
           <LuUsers />
          </div>
          <div className="text-3xl font-semibold text-gray-800 mt-12">1,200</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Pending Approval</span>
            <MdPendingActions />
          </div>
          <div className="text-3xl font-semibold text-gray-800 mt-12">16</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Total Revenue</span>
         <MdPayments />
          </div>
          <div className="text-3xl font-semibold text-gray-800 mt-12">$22,410</div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
