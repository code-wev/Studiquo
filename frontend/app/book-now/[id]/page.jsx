import React from "react";
import prfImage from "@/public/hiw/prf.png";
import Image from "next/image";
import { CiCalendar } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";
import { CgSandClock } from "react-icons/cg";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Progress Steps */}
      <div className="flex items-center gap-3 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold">
            📅
          </div>
          <p className="text-gray-800 font-medium text-sm">
            Select Date & Time
          </p>
        </div>
        <div className="w-32 h-[2px] bg-purple-300" />
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold">
            💳
          </div>
          <p className="text-gray-400 font-medium text-sm">
            Booking Details & Payment
          </p>
        </div>
      </div>

      <div className="w-full max-w-[1200px] bg-white shadow-sm rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="lg:col-span-2">
          {/* Toggle Buttons */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xl font-semibold text-gray-900">Calendar</p>
            <div className="flex gap-2">
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">
                Group
              </button>
              <button className="px-6 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-100">
                Single
              </button>
            </div>
          </div>

          {/* Calendar Box */}
          <div className="border border-gray-200 rounded-2xl p-6 mb-6">
            {/* Month Header */}
            <div className="flex justify-between items-center mb-6">
              <button className="text-gray-400 hover:text-gray-600 text-xl">
                &lt;
              </button>
              <p className="font-semibold text-gray-900 text-lg">
                October 2024
              </p>
              <button className="text-gray-400 hover:text-gray-600 text-xl">
                &gt;
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-4">
              <p>Su</p>
              <p>Mo</p>
              <p>Tu</p>
              <p>We</p>
              <p>Th</p>
              <p>Fr</p>
              <p>Sa</p>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* Previous month days */}
              <div className="py-3 text-orange-300">30</div>
              <div className="py-3 text-orange-300">31</div>

              {/* October days */}
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                1
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                2
              </div>
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                3
              </div>
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                4
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                5
              </div>

              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                6
              </div>
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                7
              </div>
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                8
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                9
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                10
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                11
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                12
              </div>

              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                13
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                14
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                15
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                16
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                17
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                18
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                19
              </div>

              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                20
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                21
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                22
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                23
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                24
              </div>
              <div className="py-3 rounded-xl bg-purple-100 text-purple-700 font-semibold relative">
                25
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full"></div>
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                26
              </div>

              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                27
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                28
              </div>
              <div className="py-3 rounded-xl bg-purple-200 text-purple-700 font-semibold">
                29
              </div>
              <div className="py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                30
              </div>
              <div className="py-3 text-orange-300">01</div>
              <div className="py-3 text-orange-300">02</div>
              <div className="py-3 text-orange-300">03</div>
            </div>

            {/* Time Slot Checkboxes */}
            <div className="mt-6 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">12:00pm – 02:00pm</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">06:00pm – 06:00pm</span>
              </label>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="lg:col-span-1">
          {/* Tutor Profile */}
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-lg font-semibold mb-4 text-gray-900">
              Tutor Profile
            </p>

            <div className="flex items-center gap-3 mb-6">
              <Image
                src={prfImage}
                alt="Jerome Bell"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">
                  Jerome Bell
                </p>
                <p className="text-xs text-gray-500">Mathematics Expert</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-xs">★★★★★</span>
                  <span className="text-xs text-gray-500">44 (58)</span>
                </div>
              </div>
              <button className="px-3 py-2 rounded-lg text-xs font-medium bg-purple-200 text-purple-700 hover:bg-purple-300">
                View profile
              </button>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-purple-500">
                    <CiCalendar className="text-xl" />
                  </span>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Friday, April 12, 2024
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-purple-500">
                    <MdAccessTime className="text-xl" />
                  </span>
                  <p className="text-xs text-gray-500">Time</p>
                </div>

                <p className="text-sm font-medium text-gray-900">08:00 AM</p>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 py-3 border-b border-gray-100">
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-purple-500">
                    <CgSandClock className="text-xl" />
                  </span>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>

                <p className="text-sm font-medium text-gray-900">2 hours</p>
              </div>
            </div>

            {/* Pricing */}
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <p>Price</p>
                <p>$110.00</p>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <p>Platform fee(20%)</p>
                <p>$6.00</p>
              </div>

              <div className="flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-100">
                <p className="text-gray-900">Total</p>
                <p className="text-orange-500">$121.00</p>
              </div>
            </div>

            {/* Confirm Button */}
            <button className="w-full bg-purple-300 hover:bg-purple-400 text-white py-3 rounded-xl font-semibold mt-2">
              Confirm Slot
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
              <span className="text-green-500">✓</span>
              <span>100% secure and encrypted payment.</span>
            </div>

            <div className="text-center text-xs text-gray-500 mt-3 mb-3">
              Accepted payment methods
            </div>

            <div className="flex justify-center gap-3">
              <div className="w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                VISA
              </div>
              <div className="w-10 h-7 bg-red-600 rounded-full flex items-center justify-center"></div>
              <div className="w-10 h-7 bg-purple-600 rounded flex items-center justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
