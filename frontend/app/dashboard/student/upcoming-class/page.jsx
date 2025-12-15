import React from "react";
import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { BiChevronRight, BiX } from "react-icons/bi";

const classes = [
  {
    subject: "Science",
    students: 48,
    timeSlot: "12:00 PM",
    tutorAvatar: "https://i.pravatar.cc/150?img=1",
    tutorName: "Sweden Habib",
  },
  {
    subject: "Mathematics",
    students: 35,
    timeSlot: "02:00 PM",
    tutorAvatar: "https://i.pravatar.cc/150?img=2",
    tutorName: "Sweden Habib",
  },
  {
    subject: "English",
    students: 52,
    timeSlot: "10:00 AM",
    tutorAvatar: "https://i.pravatar.cc/150?img=3",
    tutorName: "Sweden Habib",
  },
];

export default function UpcomingClass() {
  return (
    <div className="w-full min-h-screen bg-gray-50  ">
      <TitleSection className="bg-[#FFF6F5]" bg={"#FFF6F5"} title={"Your Upcoming Classes"} />

      <div className="w-full max-w-400 bg-[#F7F7F7] shadow-sm  grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
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
        <div className="lg:col-span-2">
          <div>
            {/* Toggle Buttons */}
            <div className="flex flex-col gap-y-9 justify-between mb-6">
              <div className="text-xl font-semibold text-gray-900">
                Friday October,25
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <div className="text-sm font-medium text-gray-600">
                    Subject
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Tutor
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Time Slot
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Action
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    Action
                  </div>
                </div>

                {/* Table Body */}
                {classes.map((classItem, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {/* Subject */}
                    <div className="text-sm font-semibold text-green-600">
                      {classItem.subject}
                    </div>

                    {/* Students with Avatars */}
                    <div className="flex text-sm items-center ">
                        <Image
                          src={classItem.tutorAvatar}
                          alt={`Tutor`}
                          width={280}
                          height={90}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                        <p>{classItem.tutorName}</p>
                    </div>

                    {/* Time Slot */}
                    <div className="text-sm text-gray-700">
                      {classItem.timeSlot}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                        View Lectures
                        <BiChevronRight size={16} />
                      </button>
                      <button className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors">
                        Join Class
                        <BiChevronRight size={16} />
                      </button>
                      <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                        Cancel Class
                        <BiX size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
