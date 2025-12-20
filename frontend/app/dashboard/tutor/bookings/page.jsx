"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { useState } from "react";
import { BiChevronRight, BiX } from "react-icons/bi";

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

const students = [
  {
    id: "454895",
    studentName: "Saaaf Rayhan",
    parentsName: "Saaaf Rayhan",
    examBoard: "AQA",
  },
  {
    id: "345678",
    studentName: "Tamim Makbul",
    parentsName: "Tamim Makbul",
    examBoard: "Pearson Edexcel",
  },
  {
    id: "096878",
    studentName: "Sadia Semi",
    parentsName: "Sadia Semi",
    examBoard: "OCR",
  },
  {
    id: "478678",
    studentName: "John Doe",
    parentsName: "John Doe",
    examBoard: "WJEC (Eduqas)",
  },
  {
    id: "879797",
    studentName: "Sarah L",
    parentsName: "Sarah L",
    examBoard: "CCEA",
  },
];

export default function Bookings() {
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

  const handleJoinChat = (studentId, studentName) => {
    // Implement your join chat logic here
    console.log(`Joining chat with ${studentName} (ID: ${studentId})`);
    alert(`Joining chat with ${studentName}`);
  };

  return (
    <div className='w-full min-h-screen bg-gray-50  py-10 px-4'>
      <TitleSection bg={"#FFFFFF"} title={"Bookings"} />

      <div className='w-full max-w-400 bg-[#F7F7F7] shadow-sm  grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Toggle Buttons */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <div className='flex gap-2'>
              <button className='px-6 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200'>
                Group
              </button>
              <button className='px-6 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-100'>
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
            <div className='flex flex-col gap-y-9 justify-between mb-6'>
              <div className='text-xl font-semibold text-gray-900'>
                {formatSelectedDate()}
              </div>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                {/* Table Header */}
                <div className='grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200'>
                  <div className='text-sm font-medium text-gray-600'>
                    Subject
                  </div>
                  <div className='text-sm font-medium text-gray-600'>
                    Students
                  </div>
                  <div className='text-sm font-medium text-gray-600'>
                    Time Slot
                  </div>
                  <div className='text-sm font-medium text-gray-600'>
                    Action
                  </div>
                </div>

                {/* Table Body */}
                {classes.map((classItem, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-4 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'>
                    {/* Subject */}
                    <div className='text-sm font-semibold text-green-600'>
                      {classItem.subject}
                    </div>

                    {/* Students with Avatars */}
                    <div className='flex items-center gap-3'>
                      <div className='flex -space-x-2'>
                        {classItem.studentAvatars.map((avatar, idx) => (
                          <Image
                            key={idx}
                            src={avatar}
                            alt={`Student ${idx + 1}`}
                            width={280}
                            height={90}
                            className='w-8 h-8 rounded-full border-2 border-white object-cover'
                          />
                        ))}
                      </div>
                      <span className='text-sm text-gray-700'>
                        {classItem.students} students
                      </span>
                    </div>

                    {/* Time Slot */}
                    <div className='text-sm text-gray-700'>
                      {classItem.timeSlot}
                    </div>

                    {/* Action Buttons */}
                    <div className='flex items-center gap-3'>
                      <button className='flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors'>
                        Join Class
                        <BiChevronRight size={16} />
                      </button>
                      <button className='flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors'>
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

      <div className='p-6 bg-white rounded-lg shadow-md'>
        <p className='text-xl font-semibold text-gray-900'>Students List</p>

        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Student ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Student Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Parents Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Exam Board
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {students.map((student, index) => (
                <tr
                  key={student.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm font-medium text-gray-900'>
                      ID: {student.id}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {student.studentName}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {student.parentsName}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm text-gray-900'>
                      {student.examBoard}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <button
                      onClick={() =>
                        handleJoinChat(student.id, student.studentName)
                      }
                      className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-green-800  transition-colors hover:bg-green-50 cursor-pointer'>
                      Join Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between mt-6 px-4 py-3 bg-gray-50 sm:px-6'>
          <div className='flex-1 flex justify-between sm:hidden'>
            <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'>
              Previous
            </button>
            <button className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'>
              Next
            </button>
          </div>
          <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
            <div>
              <p className='text-sm text-gray-700'>
                Showing <span className='font-medium'>1</span> to{" "}
                <span className='font-medium'>5</span> of{" "}
                <span className='font-medium'>5</span> students
              </p>
            </div>
            <div>
              <nav
                className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                aria-label='Pagination'>
                <button className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer'>
                  <span className='sr-only'>Previous</span>
                  Previous
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  1
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  2
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  3
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  4
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  5
                </button>
                <button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer'>
                  6
                </button>
                <span className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
                  ...
                </span>
                <button className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer'>
                  Next
                  <span className='sr-only'>Next</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
