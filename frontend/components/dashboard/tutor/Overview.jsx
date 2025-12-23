"use client"

import React from "react";
import { LuUserPen, LuUsers } from "react-icons/lu";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useGetTutorOverviewQuery } from "@/feature/shared/TutorApi";

const Overview = () => {
  const [earningsMonth, setEarningsMonth] = useState("Select month");
  const [subjectMonth, setSubjectMonth] = useState("Select month");

  const {data:overview} = useGetTutorOverviewQuery();
  console.log(overview?.data, 'overview is here');

  const earningsData = [
    { name: "English", value: 5500 },
    { name: "Math", value: 7500 },
  ];

  const subjectData = [
    { name: "Total Students", value: 854, color: "#90EE90" },
    { name: "Total Students", value: 1295, color: "#FFB6C6" },
  ];

  const total = subjectData.reduce((acc, curr) => acc + curr.value, 0);
  const percentages = subjectData.map((item) => (item.value / total) * 100);

  return (
    <div className="bg-[#F7F7F7] p-12 rounded-lg">
      <h2 className="text-3xl mb-6">Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Total Classes</span>
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
          <div className="text-3xl font-semibold text-gray-800 mt-12">
            1,200
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-white rounded-lg flex flex-col py-4 px-4">
          <div className="flex items-center justify-between text-xl text-[#444444] font-medium">
            <span>Total Board</span>
            <LuUsers />
          </div>
          <div className="text-3xl font-semibold text-gray-800 mt-12">
            1,200
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 my-5 gap-x-2">
        {/* Earnings Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Earnings Overview</h2>
          <select
            className="border border-gray-300 rounded px-4 py-2 text-sm"
            value={earningsMonth}
            onChange={(e) => setEarningsMonth(e.target.value)}
          >
            <option>Select month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={earningsData} barSize={80}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14 }}
              ticks={[0, 2500, 5000, 7500, 10000]}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {earningsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === 0 ? "#90EE90" : "#FFB6C6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subject Overview */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Subject Overview</h2>
          <select
            className="border border-gray-300 rounded px-4 py-2 text-sm"
            value={subjectMonth}
            onChange={(e) => setSubjectMonth(e.target.value)}
          >
            <option>Select month</option>
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
          </select>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <svg width="280" height="280" viewBox="0 0 280 280">
              <circle
                cx="140"
                cy="140"
                r="100"
                fill="none"
                stroke="#FFB6C6"
                strokeWidth="40"
                strokeDasharray={`${percentages[1] * 6.28} 628`}
                transform="rotate(-90 140 140)"
              />
              <circle
                cx="140"
                cy="140"
                r="100"
                fill="none"
                stroke="#90EE90"
                strokeWidth="40"
                strokeDasharray={`${percentages[0] * 6.28} 628`}
                strokeDashoffset={`-${percentages[1] * 6.28}`}
                transform="rotate(-90 140 140)"
              />
            </svg>

            {/* Labels */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
              <div className="text-sm text-gray-400">Total Students</div>
              <div className="text-lg font-semibold text-green-400">854</div>
            </div>

            <div className="absolute bottom-8 right-0 text-center">
              <div className="text-sm text-gray-400">Total Students</div>
              <div className="text-lg font-semibold text-pink-300">1,295</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Overview;
