"use client"

import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { useState } from "react";
import { BiCheck, BiChevronDown, BiChevronRight, BiX } from "react-icons/bi";
import { CgChevronDown } from "react-icons/cg";

const classes = [
  {
    subject: "Science",
    students: 48,
    timeSlot: "12:00 PM",
    studentAvatars: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
    ],
  },
  {
    subject: "Mathematics",
    students: 35,
    timeSlot: "02:00 PM",
    studentAvatars: [
      "https://i.pravatar.cc/150?img=5",
      "https://i.pravatar.cc/150?img=6",
    ],
  },
  {
    subject: "English",
    students: 52,
    timeSlot: "10:00 AM",
    studentAvatars: [
      "https://i.pravatar.cc/150?img=9",
      "https://i.pravatar.cc/150?img=10",
    ],
  },
];
export default function Calendar() {
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showSlotsDropdown, setShowSlotsDropdown] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [date, setDate] = useState("7 October, 2024");
  const [zoomLink, setZoomLink] = useState("");

  const subjects = [
    { id: 1, name: "English", color: "text-yellow-600" },
    { id: 2, name: "Science", color: "text-green-600" },
    { id: 3, name: "Math", color: "text-pink-500" },
  ];

  const slots = [
    { id: 1, time: "12:00PM - 02:00 PM" },
    { id: 2, time: "04:00PM - 06:00 PM" },
  ];

  const additionalSlots = [
    { id: 3, time: "12:00PM - 02:00 PM" },
    { id: 4, time: "04:00PM - 06:00 PM" },
  ];

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const toggleSlot = (slotId) => {
    setSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };
  return (
    <div className="w-full min-h-screen bg-gray-50  py-10 px-4">
      <TitleSection bg={"#F5FFF9"} title={"Calender"} />

      <div className="w-full max-w-400 mx-auto bg-[#F7F7F7] shadow-sm  grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
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
            <div className="flex flex-col items-center gap-y-9 justify-between mb-6">
              <div className="text-xl font-semibold text-gray-900">
                Manage Slots
              </div>
              <div className=" mx-auto p-6 bg-white">
                {/* Date Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Subject Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <button
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-gray-400 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <span>select subject</span>
                    <BiChevronDown size={20} className="text-gray-400" />
                  </button>

                  {showSubjectDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                      <div className="text-sm font-medium text-gray-500 mb-3">
                        Subjects
                      </div>
                      {subjects.map((subject) => (
                        <label
                          key={subject.id}
                          className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 rounded px-2"
                        >
                          <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                              selectedSubjects.includes(subject.id)
                                ? "border-gray-800 bg-gray-800"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedSubjects.includes(subject.id) && (
                              <BiCheck size={14} className="text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm font-medium ${subject.color}`}
                          >
                            {subject.name}
                          </span>
                          <input
                            type="checkbox"
                            checked={selectedSubjects.includes(subject.id)}
                            onChange={() => toggleSubject(subject.id)}
                            className="hidden"
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Slots Dropdown */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slots
                  </label>
                  <button
                    onClick={() => setShowSlotsDropdown(!showSlotsDropdown)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-gray-400 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <span>select</span>
                    <CgChevronDown size={20} className="text-gray-400" />
                  </button>

                  {showSlotsDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-100 rounded-lg shadow-lg z-10 p-4">
                      <div className="text-sm font-medium text-gray-500 mb-3">
                        Slot
                      </div>
                      <div className="bg-white rounded-lg p-3 mb-4">
                        {slots.map((slot) => (
                          <label
                            key={slot.id}
                            className={`flex items-center justify-between py-3 px-3 cursor-pointer rounded-lg mb-2 last:mb-0 ${
                              selectedSlots.includes(slot.id)
                                ? "bg-purple-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-sm text-gray-700">
                              {slot.time}
                            </span>
                            {selectedSlots.includes(slot.id) && (
                              <BiCheck size={18} className="text-purple-600" />
                            )}
                            <input
                              type="checkbox"
                              checked={selectedSlots.includes(slot.id)}
                              onChange={() => toggleSlot(slot.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                        <button className="text-sm text-gray-400 px-3 py-2">
                          + Add slot
                        </button>
                      </div>

                      <div className="text-sm font-medium text-gray-500 mb-3">
                        Add slot
                      </div>
                      <div className="bg-white rounded-lg p-3 mb-4">
                        {additionalSlots.map((slot) => (
                          <label
                            key={slot.id}
                            className={`flex items-center justify-between py-3 px-3 cursor-pointer rounded-lg mb-2 last:mb-0 ${
                              selectedSlots.includes(slot.id)
                                ? "bg-purple-100"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="text-sm text-gray-700">
                              {slot.time}
                            </span>
                            {selectedSlots.includes(slot.id) && (
                              <BiCheck size={18} className="text-purple-600" />
                            )}
                            <input
                              type="checkbox"
                              checked={selectedSlots.includes(slot.id)}
                              onChange={() => toggleSlot(slot.id)}
                              className="hidden"
                            />
                          </label>
                        ))}
                        <button className="text-sm text-gray-400 px-3 py-2">
                          + Add slot
                        </button>
                      </div>

                      <button className="w-full bg-purple-400 text-white py-2 rounded-lg hover:bg-purple-500 transition-colors">
                        Create Slot
                      </button>
                    </div>
                  )}
                </div>

                {/* Zoom Link Field */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoom link
                  </label>
                  <input
                    type="text"
                    value={zoomLink}
                    onChange={(e) => setZoomLink(e.target.value)}
                    placeholder="Zoom Link"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Create another slot
                  </button>
                  <button className="px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors">
                    Create Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
