import React from "react";
import prfImage from "@/public/hiw/prf.png";
import Image from "next/image";

export default function Page() {
  return (
    <div className="w-full min-h-screen bg-[#f7f7fb] flex flex-col items-center py-10">
      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#c9b2ff] flex items-center justify-center text-white font-semibold">
            1
          </div>
          <p className="text-gray-700 font-medium">Select Date & Time</p>
        </div>
        <div className="w-24 h-[2px] bg-[#d2c7ff]" />
        <div className="flex items-center gap-2 opacity-40">
          <div className="w-8 h-8 rounded-full bg-[#c9b2ff] flex items-center justify-center text-white font-semibold">
            2
          </div>
          <p className="text-gray-700 font-medium">Booking Details & Payment</p>
        </div>
      </div>

      <div className="w-[1200px] bg-white shadow-md rounded-xl grid grid-cols-3 gap-6 p-6">
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="col-span-2  pr-6">
          <p className="text-lg font-semibold mb-4">Select Date & Time</p>

          {/* Calendar Box */}
          <div className="border border-gray-200 rounded-xl p-6 mb-6">
            {/* Month Header */}
            <div className="flex justify-between items-center mb-4">
              <button className="text-gray-500">&lt;</button>
              <p className="font-semibold text-gray-700">October 2024</p>
              <button className="text-gray-500">&gt;</button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-4">
              <p>Su</p>
              <p>Mo</p>
              <p>Tu</p>
              <p>We</p>
              <p>Th</p>
              <p>Fr</p>
              <p>Sa</p>
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-3 text-center text-sm">
              {[
                29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1,
                2,
              ].map((day, idx) => (
                <div
                  key={idx}
                  className={`py-2 rounded-lg cursor-pointer 
                  ${
                    idx % 8 === 1
                      ? "bg-purple-200 text-purple-600 font-bold"
                      : "hover:bg-gray-200"
                  }
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Time slots button */}
          <div>
            <p className="text-lg font-semibold mb-3">Available Time Slots</p>
            <button className="px-6 py-3 bg-[#CCB7F8] text-white rounded-xl shadow ">
              Full Day
            </button>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className="col-span-1">
          {/* Tutor Profile */}
          <div className="border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src={prfImage}
                alt="img"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  Jerome Bell
                </p>
                <p className="text-xs text-gray-500">Mathematics Expert</p>
              </div>
              <button className="ml-auto p-3 rounded text-xs bg-[#CCB7F8] text-[#3A0E95]">
                View Profile
              </button>
            </div>

            {/* Date */}
            <div className="flex justify-between py-2 border-b">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-sm font-semibold">Friday, April 12, 2024</p>
            </div>

            {/* Time */}
            <div className="flex justify-between py-2 border-b">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-sm font-semibold">08:00 AM</p>
            </div>

            {/* Duration */}
            <div className="flex justify-between py-2 border-b">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-sm font-semibold">2 hours</p>
            </div>

            {/* Pricing */}
            <div className="py-2">
              <div className="flex justify-between text-sm">
                <p>Price</p>
                <p>$110.00</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Platform fee (20%)</p>
                <p>$11.00</p>
              </div>

              <div className="flex justify-between font-semibold text-lg mt-2">
                <p>Total</p>
                <p>$121.00</p>
              </div>
            </div>

            {/* Confirm Button */}
            <button className="w-full bg-[#CCB7F8] text-white py-3 rounded-xl font-semibold mt-4 hover:bg-purple-700">
              Confirm Slot
            </button>

            <div className="text-center text-xs text-gray-500 mt-4">
              100% secure encrypted payment.
            </div>

            <div className="flex justify-center gap-3 mt-3">
              <img
                src="https://via.placeholder.com/30"
                className="w-8 opacity-60"
              />
              <img
                src="https://via.placeholder.com/30"
                className="w-8 opacity-60"
              />
              <img
                src="https://via.placeholder.com/30"
                className="w-8 opacity-60"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
