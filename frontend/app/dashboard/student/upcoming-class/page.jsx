"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useGetMyUpcomingBookingsQuery } from "@/feature/student/BookingApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiBookOpen, BiVideo, BiX } from "react-icons/bi";

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

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function UpcomingClass() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Fetch bookings from API
  const {
    data: bookingsData,
    isLoading,
    isError,
  } = useGetMyUpcomingBookingsQuery();

  // Extract data from API response
  const bookings = bookingsData?.data?.bookings || [];
  const stats = bookingsData?.data?.stats || {
    totalClasses: 0,
    todayClasses: 0,
    completedClasses: 0,
  };

  // Group bookings by date for easy access
  const [bookingsByDate, setBookingsByDate] = useState({});

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      const grouped = {};
      bookings.forEach((day) => {
        const dateStr = new Date(day.date).toDateString();
        grouped[dateStr] = day.list || [];
      });
      setBookingsByDate(grouped);
    }
  }, [bookings]);

  // Generate calendar days for current month only
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDayClick = (day) => {
    const newSelectedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newSelectedDate);
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

  // Format time for display
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Check if a date is today
  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a class is happening now or in the future today
  const isClassHappeningNowOrLater = (classTime) => {
    if (!classTime?.startTime) return false;

    const now = new Date();
    const classStartTime = new Date(classTime.startTime);
    const classEndTime = classTime.endTime ? new Date(classTime.endTime) : null;

    // Check if class is today
    const isClassToday =
      classStartTime.getDate() === now.getDate() &&
      classStartTime.getMonth() === now.getMonth() &&
      classStartTime.getFullYear() === now.getFullYear();

    if (!isClassToday) return false;

    // Check if current time is after class start time and before end time
    if (classEndTime) {
      return now >= classStartTime && now <= classEndTime;
    }

    // If no end time, just check if we're after start time
    return now >= classStartTime;
  };

  // Get month and year for display
  const monthName = monthNames[currentMonth];
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Generate days array - only current month
  const days = [];

  // Empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({
      day: "",
      isCurrentMonth: false,
      isSelected: false,
      isEmpty: true,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const isTodayDate =
      today.getDate() === i &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear;

    const isSelected =
      selectedDate.getDate() === i &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;

    // Check if this day has any bookings
    const dateToCheck = new Date(currentYear, currentMonth, i);
    const dateKey = dateToCheck.toDateString();
    const hasBooking =
      bookingsByDate[dateKey] && bookingsByDate[dateKey].length > 0;

    days.push({
      day: i,
      isCurrentMonth: true,
      isToday: isTodayDate,
      isSelected,
      hasBooking,
      isEmpty: false,
    });
  }

  // Get classes for selected date
  const getClassesForSelectedDate = () => {
    const dateKey = selectedDate.toDateString();
    return bookingsByDate[dateKey] || [];
  };

  const displayedClasses = getClassesForSelectedDate();

  // Handle class actions
  const handleViewLectures = (booking) => {
    console.log("View lectures for:", booking);
    // Implement view lectures functionality
    alert("View lectures functionality to be implemented");
  };

  const handleJoinClass = (booking) => {
    if (booking.timeSlot?.meetLink) {
      window.open(booking.timeSlot.meetLink, "_blank");
    } else {
      alert("No meeting link available for this class");
    }
  };

  const handleCancelClass = (booking) => {
    if (confirm("Are you sure you want to cancel this class?")) {
      console.log("Cancel class:", booking);
      // Implement cancel functionality
      alert("Cancel functionality to be implemented");
    }
  };

  // Get appropriate action button based on status and date
  const getActionButtons = (classItem) => {
    const timeSlot = classItem.timeSlot || {};
    const status = classItem.status || "UNKNOWN";
    const isClassDateToday = isToday(new Date(timeSlot.startTime));
    const isClassHappeningNow = isClassHappeningNowOrLater(timeSlot);

    const buttons = [];

    // For SCHEDULED classes
    if (status === "SCHEDULED") {
      if (isClassDateToday && isClassHappeningNow && timeSlot.meetLink) {
        buttons.push(
          <button
            key='join'
            onClick={() => handleJoinClass(classItem)}
            className='flex items-center gap-1 text-sm font-medium bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors'>
            <BiVideo size={16} />
            Join Now
          </button>
        );
      } else if (
        isClassDateToday &&
        !isClassHappeningNow &&
        timeSlot.meetLink
      ) {
        buttons.push(
          <button
            key='join-later'
            onClick={() => handleJoinClass(classItem)}
            className='flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors'>
            <BiVideo size={16} />
            Join Later
          </button>
        );
      }

      // Cancel button for scheduled classes
      buttons.push(
        <button
          key='cancel'
          onClick={() => handleCancelClass(classItem)}
          className='flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors'>
          <BiX size={16} />
          Cancel
        </button>
      );
    }

    // For COMPLETED classes
    else if (status === "COMPLETED") {
      buttons.push(
        <button
          key='view-lectures'
          onClick={() => handleViewLectures(classItem)}
          className='flex items-center gap-1 text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors'>
          <BiBookOpen size={16} />
          View Lectures
        </button>
      );
    }

    // For CANCELLED classes
    else if (status === "CANCELLED") {
      buttons.push(
        <span key='cancelled' className='text-sm text-gray-500 italic'>
          Class Cancelled
        </span>
      );
    }

    // For other statuses
    else {
      buttons.push(
        <span key='no-action' className='text-sm text-gray-500'>
          No action available
        </span>
      );
    }

    return buttons;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-gray-50'>
        <TitleSection
          className='bg-[#FFF6F5]'
          bg={"#FFF6F5"}
          title={"Your Upcoming Classes"}
        />
        <div className='w-full max-w-7xl mx-auto p-8'>
          <div className='text-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading your classes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='w-full min-h-screen bg-gray-50'>
        <TitleSection
          className='bg-[#FFF6F5]'
          bg={"#FFF6F5"}
          title={"Your Upcoming Classes"}
        />
        <div className='w-full max-w-7xl mx-auto p-8'>
          <div className='text-center py-20'>
            <div className='text-red-500 text-4xl mb-4'>⚠️</div>
            <p className='text-gray-600'>
              Failed to load classes. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <TitleSection
        className='bg-[#FFF6F5]'
        bg={"#FFF6F5"}
        title={"Your Upcoming Classes"}
      />

      <div className='w-full mx-auto bg-[#F7F7F7] shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Calendar Header */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <div className='text-sm text-gray-600'>
              Showing {stats.totalClasses || 0} classes
            </div>
          </div>

          {/* Calendar Box */}
          <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
            {/* Month Header - Only current month, no navigation */}
            <div className='flex justify-center items-center mb-6'>
              <p className='font-semibold text-gray-900 text-lg'>
                {monthName} {currentYear}
              </p>
            </div>

            {/* Week Days */}
            <div className='grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-4'>
              {dayNames.map((day) => (
                <p key={day}>{day}</p>
              ))}
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
                    onClick={() => handleDayClick(day)}
                    className={`
                      relative py-3 rounded-xl transition-all duration-200 cursor-pointer
                      ${
                        isSelected
                          ? "bg-purple-600 text-white font-semibold"
                          : ""
                      }
                      ${
                        !isSelected && hasBooking
                          ? "bg-purple-100 text-purple-700 font-semibold"
                          : ""
                      }
                      ${!isSelected && !hasBooking ? "hover:bg-gray-100" : ""}
                      ${isToday ? "ring-2 ring-purple-400" : ""}
                    `}>
                    {day}
                    {hasBooking && !isSelected && (
                      <div className='absolute -top-1 right-1 w-2 h-2 bg-purple-500 rounded-full'></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className='mt-6 flex flex-wrap gap-4 text-xs'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-purple-100 rounded'></div>
                <span className='text-gray-600'>Has classes</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-purple-600 rounded'></div>
                <span className='text-gray-600'>Selected day</span>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className='bg-white border border-gray-200 rounded-2xl p-6'>
            <h3 className='font-semibold text-gray-900 mb-4'>Summary</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className='bg-purple-50 p-4 rounded-xl'>
                <p className='text-sm text-gray-600'>Total Classes</p>
                <p className='text-2xl font-bold text-purple-600'>
                  {stats.totalClasses || 0}
                </p>
              </div>
              <div className='bg-green-50 p-4 rounded-xl'>
                <p className='text-sm text-gray-600'>Today's Classes</p>
                <p className='text-2xl font-bold text-green-600'>
                  {stats.todayClasses || 0}
                </p>
              </div>
              <div className='bg-blue-50 p-4 rounded-xl'>
                <p className='text-sm text-gray-600'>Completed</p>
                <p className='text-2xl font-bold text-blue-600'>
                  {stats.completedClasses || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div>
            {/* Header */}
            <div className='flex flex-col gap-y-6 mb-6'>
              <div className='flex items-center justify-between'>
                <div className='text-xl font-semibold text-gray-900'>
                  {formatSelectedDate()}
                </div>
                {isToday(selectedDate) && (
                  <span className='px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full'>
                    Today
                  </span>
                )}
              </div>

              {/* Classes Table */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                {/* Table Header */}
                <div className='grid grid-cols-5 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200'>
                  <div className='text-sm font-medium text-gray-600'>
                    Subject
                  </div>
                  <div className='text-sm font-medium text-gray-600'>Tutor</div>
                  <div className='text-sm font-medium text-gray-600'>Time</div>
                  <div className='text-sm font-medium text-gray-600'>
                    Status
                  </div>
                  <div className='text-sm font-medium text-gray-600'>
                    Action
                  </div>
                </div>

                {/* Table Body */}
                {displayedClasses.length > 0 ? (
                  displayedClasses.map((classItem, index) => {
                    const timeSlot = classItem.timeSlot || {};
                    const tutor = classItem.tutor || {};
                    const startTime = timeSlot.startTime
                      ? formatTime(timeSlot.startTime)
                      : "";
                    const endTime = timeSlot.endTime
                      ? formatTime(timeSlot.endTime)
                      : "";

                    const isClassDateToday = isToday(
                      new Date(timeSlot.startTime)
                    );
                    const isClassHappeningNow =
                      isClassHappeningNowOrLater(timeSlot);

                    return (
                      <div
                        key={classItem._id || index}
                        className='grid grid-cols-5 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'>
                        {/* Subject */}
                        <div className='text-sm font-semibold text-green-600'>
                          {classItem.subject || "N/A"}
                        </div>

                        {/* Tutor */}
                        <div className='flex items-center'>
                          <Image
                            src={
                              tutor.avatar || "https://i.pravatar.cc/150?img=1"
                            }
                            alt={`${tutor.firstName || "Tutor"} ${
                              tutor.lastName || ""
                            }`}
                            width={32}
                            height={32}
                            className='w-8 h-8 rounded-full border-2 border-white object-cover'
                          />
                          <p className='ml-2 text-sm'>
                            {tutor.firstName || "Unknown"}{" "}
                            {tutor.lastName || ""}
                          </p>
                        </div>

                        {/* Time Slot */}
                        <div className='text-sm'>
                          <div
                            className={`font-medium ${
                              isClassDateToday && isClassHappeningNow
                                ? "text-green-600 animate-pulse"
                                : "text-gray-700"
                            }`}>
                            {startTime} - {endTime}
                          </div>
                          {isClassDateToday && isClassHappeningNow && (
                            <div className='text-xs text-green-500 font-medium mt-1'>
                              • Live Now
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className='text-sm'>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              classItem.status === "SCHEDULED"
                                ? isClassDateToday && isClassHappeningNow
                                  ? "bg-green-100 text-green-800 animate-pulse"
                                  : "bg-green-100 text-green-800"
                                : classItem.status === "COMPLETED"
                                ? "bg-blue-100 text-blue-800"
                                : classItem.status === "CANCELLED"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}>
                            {classItem.status || "UNKNOWN"}
                          </span>
                        </div>

                        {/* Dynamic Action Buttons */}
                        <div className='flex items-center gap-2'>
                          {getActionButtons(classItem)}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='px-6 py-8 text-center text-gray-500'>
                    No classes scheduled for this date
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Classes Summary */}
            <div className='bg-white border border-gray-200 rounded-xl p-6'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Upcoming This Month
              </h3>
              {bookings.length > 0 ? (
                <div className='space-y-3'>
                  {bookings.slice(0, 3).map((day, index) => {
                    const dayDate = new Date(day.date);
                    const isDayToday = isToday(dayDate);

                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isDayToday
                            ? "bg-green-50 border border-green-100"
                            : "bg-gray-50"
                        }`}>
                        <div>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium text-gray-900'>
                              {dayDate.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            {isDayToday && (
                              <span className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full'>
                                Today
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-gray-600'>
                            {day.totalBookings || 0} class
                            {day.totalBookings !== 1 ? "es" : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedDate(new Date(day.date))}
                          className='text-sm text-purple-600 hover:text-purple-700'>
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-gray-500 text-sm'>
                  No upcoming classes this month
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
