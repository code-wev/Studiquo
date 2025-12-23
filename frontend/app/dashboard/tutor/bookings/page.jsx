"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useGetTutorBookingsQuery } from "@/feature/student/BookingApi";
import { useEffect, useState } from "react";
import { BiChevronRight, BiX } from "react-icons/bi";

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
  const { data: apiData, isLoading, error } = useGetTutorBookingsQuery();
  const [bookingData, setBookingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // Process API data when loaded
  useEffect(() => {
    if (apiData?.data) {
      setBookingData(apiData.data);

      // Set selected date to first booking date or today
      if (apiData.data.bookings.length > 0) {
        const firstBooking = apiData.data.bookings[0];
        setSelectedDate(firstBooking);
      }
    }
  }, [apiData]);

  // Get current month and year for display
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Calendar functions - only for current month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = (day, hasBooking = false) => {
    if (!hasBooking || !bookingData) return;

    const clickedDate = new Date(currentYear, currentMonth, day);
    const dateString = clickedDate.toISOString().split("T")[0];

    // Find booking for this date
    const bookingForDate = bookingData.bookings.find(
      (booking) => booking.dateString === dateString
    );

    if (bookingForDate) {
      setSelectedDate(bookingForDate);
    }
  };

  // Format date for display
  const formatSelectedDate = () => {
    if (!selectedDate) return "Select a date";

    const date = new Date(selectedDate.date);
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
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

  const monthName = monthNames[currentMonth];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate days array with booking information - only current month
  const days = [];

  // Previous month days (empty cells to fill the first week)
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      day: "",
      isCurrentMonth: false,
      isSelected: false,
      hasBooking: false,
      isEmpty: true,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i;

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(i).padStart(2, "0")}`;

    // Check if this date has bookings
    const hasBooking =
      bookingData?.bookings?.some(
        (booking) => booking.dateString === dateString
      ) || false;

    const isSelected = selectedDate?.dateString === dateString;

    days.push({
      day: i,
      isCurrentMonth: true,
      isToday,
      isSelected,
      hasBooking,
      isEmpty: false,
    });
  }

  // Handle class actions
  const handleJoinClass = (meetLink) => {
    if (meetLink) {
      window.open(meetLink, "_blank");
    } else {
      alert("Meet link not available");
    }
  };

  const handleCancelClass = (bookingId, subject) => {
    if (confirm(`Are you sure you want to cancel ${subject} class?`)) {
      // Implement cancel logic here
      console.log(`Canceling booking ${bookingId}`);
      alert(`${subject} class cancelled`);
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='w-full min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center'>
        <div className='text-center text-red-600'>
          <p>Error loading bookings. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-50 py-10 px-4'>
      <TitleSection bg={"#FFFFFF"} title={"Bookings"} />

      <div className='w-full max-w-400 bg-[#F7F7F7] shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Toggle Buttons */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
          </div>

          {/* Calendar Box */}
          <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
            {/* Month Header - Only shows current month, no navigation buttons */}
            <div className='flex justify-center items-center mb-6'>
              <p className='font-semibold text-gray-900 text-lg'>
                {monthName} {currentYear}
              </p>
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

            {/* Calendar Days - Only current month */}
            <div className='grid grid-cols-7 gap-2 text-center text-sm'>
              {days.map((dayData, index) => {
                const {
                  day,
                  isCurrentMonth,
                  isToday,
                  isSelected,
                  hasBooking,
                  isEmpty,
                } = dayData;

                if (isEmpty) {
                  return <div key={index} className='py-3'></div>;
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleDayClick(day, hasBooking)}
                    className={`
                      py-3 rounded-xl transition-all duration-200 relative
                      ${
                        isSelected
                          ? "bg-purple-600 text-white font-semibold"
                          : ""
                      }
                      ${
                        !isSelected && hasBooking
                          ? "bg-purple-200 text-purple-700 font-semibold"
                          : ""
                      }
                      ${!isSelected && !hasBooking ? "hover:bg-gray-100" : ""}
                      ${!hasBooking ? "cursor-default" : "cursor-pointer"}
                      ${isToday ? "ring-2 ring-purple-400" : ""}
                    `}>
                    {day}
                    {hasBooking && !isSelected && (
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full'></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div>
            {/* Selected Date Header */}
            <div className='flex flex-col gap-y-9 justify-between mb-6'>
              <div className='text-xl font-semibold text-gray-900'>
                {formatSelectedDate()}
                {selectedDate && (
                  <span className='ml-2 text-sm text-gray-500'>
                    ({selectedDate.totalBookings} bookings,{" "}
                    {selectedDate.totalStudents} students)
                  </span>
                )}
              </div>

              {selectedDate ? (
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
                  {selectedDate.timeSlots &&
                  selectedDate.timeSlots.length > 0 ? (
                    selectedDate.timeSlots.map((timeSlot, index) => (
                      <div
                        key={index}
                        className='grid grid-cols-4 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'>
                        {/* Subject */}
                        <div className='text-sm font-semibold text-green-600'>
                          {timeSlot.subject}
                          <div className='text-xs text-gray-500'>
                            {timeSlot.type}
                          </div>
                        </div>

                        {/* Students */}
                        <div className='text-sm text-gray-700'>
                          {timeSlot.totalStudentsInSlot} student
                          {timeSlot.totalStudentsInSlot !== 1 ? "s" : ""}
                          <div className='text-xs text-gray-500'>
                            {timeSlot.slotBookingsCount} booking
                            {timeSlot.slotBookingsCount !== 1 ? "s" : ""}
                          </div>
                        </div>

                        {/* Time Slot */}
                        <div className='text-sm text-gray-700'>
                          {formatTime(timeSlot.startTime)} -{" "}
                          {formatTime(timeSlot.endTime)}
                        </div>

                        {/* Action Buttons */}
                        <div className='flex items-center gap-3'>
                          {timeSlot.meetLink && (
                            <button
                              onClick={() => handleJoinClass(timeSlot.meetLink)}
                              className='flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors'>
                              Join Class
                              <BiChevronRight size={16} />
                            </button>
                          )}
                          {timeSlot.bookings &&
                            timeSlot.bookings.map(
                              (booking) =>
                                booking.status === "SCHEDULED" && (
                                  <button
                                    key={booking._id}
                                    onClick={() =>
                                      handleCancelClass(
                                        booking._id,
                                        booking.subject
                                      )
                                    }
                                    className='flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors'>
                                    Cancel
                                    <BiX size={16} />
                                  </button>
                                )
                            )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='px-6 py-8 text-center text-gray-500'>
                      No classes scheduled for this date
                    </div>
                  )}
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500'>
                  Select a date with bookings to view classes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {bookingData && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8'>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-sm font-medium text-gray-500'>
              Total Bookings
            </h3>
            <p className='text-2xl font-bold text-purple-600'>
              {bookingData.stats.totalBookings}
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-sm font-medium text-gray-500'>
              Total Students
            </h3>
            <p className='text-2xl font-bold text-green-600'>
              {bookingData.stats.totalStudents}
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-sm font-medium text-gray-500'>
              Today's Bookings
            </h3>
            <p className='text-2xl font-bold text-blue-600'>
              {bookingData.stats.todayBookings}
            </p>
          </div>
          <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-sm font-medium text-gray-500'>Completed</h3>
            <p className='text-2xl font-bold text-yellow-600'>
              {bookingData.stats.completedBookings}
            </p>
          </div>
        </div>
      )}

      {/* TODO: Students List Table of specific slot  */}
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
