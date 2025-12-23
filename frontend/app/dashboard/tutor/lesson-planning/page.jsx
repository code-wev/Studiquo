"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { useState } from "react";

const classes = [
  {
    studentAvatars: [
      "https://i.pravatar.cc/150?img=1",
      "https://i.pravatar.cc/150?img=2",
    ],
  },
];

export default function LessonPlanning() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({
    "12:00pm – 02:00pm": true,
    "06:00pm – 06:00pm": false,
  });

  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDayClick = (day) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newSelectedDate);
  };

  const handleTimeSlotToggle = (timeSlot) => {
    setSelectedTimeSlots((prev) => ({
      ...prev,
      [timeSlot]: !prev[timeSlot],
    }));
  };

  // Format date for display
  const formatSelectedDate = () => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return selectedDate.toLocaleDateString("en-US", options);
  };

  // Get month and year for display
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = monthNames[currentMonth];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate days array
  const days = [];

  // Previous month days
  const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      isSelected: false,
    });
  }

  // Current month days
  const today = new Date();
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday =
      today.getDate() === i &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;
    const isSelected =
      selectedDate.getDate() === i &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;

    // Determine if this day should have special styling (matching the hardcoded days)
    const hasClass =
      i === 1 || i === 3 || i === 4 || i === 7 || i === 8 || i === 29;
    const isTodayWithDot = i === 25; // The 25th has a special dot in original design

    days.push({
      day: i,
      isCurrentMonth: true,
      isToday,
      isSelected,
      hasClass,
      isTodayWithDot,
    });
  }

  // Next month days
  const totalCells = 42; // 6 rows * 7 days
  const nextMonthDays = totalCells - days.length;
  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      isSelected: false,
    });
  }

  return (
    <div className='w-full min-h-screen bg-gray-50  py-10 px-4'>
      <TitleSection bg={"#FFFFFF"} title={"Lesson Planning"} />

      <div className='w-full max-w-400 bg-[#F7F7F7] shadow-sm  grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Toggle Buttons */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <div className='flex gap-2'>
              <button className='px-6 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer'>
                Group
              </button>
              <button className='px-6 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-100 cursor-pointer'>
                Single
              </button>
            </div>
          </div>

          {/* Calendar Box */}
          <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
            {/* Month Header */}
            <div className='flex justify-between items-center mb-6'>
              <button
                onClick={goToPreviousMonth}
                className='text-gray-400 hover:text-gray-600 text-xl cursor-pointer'>
                &lt;
              </button>
              <p className='font-semibold text-gray-900 text-lg'>
                {monthName} {currentYear}
              </p>
              <button
                onClick={goToNextMonth}
                className='text-gray-400 hover:text-gray-600 text-xl cursor-pointer'>
                &gt;
              </button>
            </div>

            {/* Week Days */}
            <div className='grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-4'>
              <p>Su</p>
              <p>Mo</p>
              <p>Tu</p>
              <p>We</p>
              <p>Th</p>
              <p>Fr</p>
              <p>Sa</p>
            </div>

            {/* Calendar Days */}
            <div className='grid grid-cols-7 gap-2 text-center text-sm'>
              {days.map((dayData, index) => {
                const {
                  day,
                  isCurrentMonth,
                  isToday,
                  isSelected,
                  hasClass,
                  isTodayWithDot,
                } = dayData;

                if (!isCurrentMonth) {
                  return (
                    <div key={index} className='py-3 text-orange-300'>
                      {day}
                    </div>
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day)}
                    className={`
                      py-3 rounded-xl transition-all duration-200 cursor-pointer relative
                      ${
                        isSelected
                          ? "bg-purple-600 text-white font-semibold"
                          : ""
                      }
                      ${
                        !isSelected && hasClass
                          ? "bg-purple-200 text-purple-700 font-semibold"
                          : ""
                      }
                      ${!isSelected && !hasClass ? "hover:bg-gray-100" : ""}
                    `}>
                    {day}
                    {isTodayWithDot && !isSelected && (
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full'></div>
                    )}
                    {isToday && !isSelected && !isTodayWithDot && (
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full'></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Time Slot Checkboxes */}
            <div className='mt-6 space-y-2'>
              {Object.entries(selectedTimeSlots).map(
                ([timeSlot, isChecked]) => (
                  <label
                    key={timeSlot}
                    className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={() => handleTimeSlotToggle(timeSlot)}
                      className='w-4 h-4 rounded border-gray-300'
                    />
                    <span className='text-sm text-gray-700'>{timeSlot}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div>
            {/* Toggle Buttons */}
            <div className='flex flex-col  gap-y-9 justify-between mb-6'>
              <div className='text-xl font-semibold text-gray-900'>
                {formatSelectedDate()}
              </div>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-6'>
                <div className='flex justify-between items-center'>
                  {/* Left side */}
                  <div className='flex flex-col space-y-4'>
                    {/* Subject Badge */}
                    <div className='bg-green-50 text-green-700 px-3 py-1 rounded-xl text-sm font-medium w-fit'>
                      Science
                    </div>
                    {/* Student Avatars */}
                    <div className='flex -space-x-2 items-center'>
                      {classes.map((classItem, index) => (
                        <div key={index} className='flex -space-x-2'>
                          {classItem.studentAvatars.map((avatar, idx) => (
                            <Image
                              key={idx}
                              src={avatar}
                              alt={`Student ${idx + 1}`}
                              width={32}
                              height={32}
                              className='w-8 h-8 rounded-full border-2 border-white object-cover'
                            />
                          ))}
                        </div>
                      ))}
                      <p className='px-8'>48 Students</p>
                    </div>
                  </div>

                  {/* Right side  */}
                  <div className='flex items-center space-x-3 '>
                    <div className='text-lg font-semibold text-gray-800'>
                      View Lecture
                    </div>
                    {/* Upload Button */}
                    <div>
                      <button className='gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer'>
                        <span className='text-lg font-medium'>Upload</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
