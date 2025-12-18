"use client";

import { useGetTutorAvailabilityQuery } from "@/feature/shared/AvailabilityApi";
import prfImage from "@/public/hiw/prf.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CgSandClock } from "react-icons/cg";
import { CiCalendar } from "react-icons/ci";
import { MdAccessTime } from "react-icons/md";

export default function Page() {
  const params = useParams();
  const id = params?.id;
  console.log("Tutor Id --->", id);

  // Booking type state - "all", "single", or "group"
  const [bookingType, setBookingType] = useState("all");

  // Fetch tutor availability data
  const {
    data: availabilityData,
    isLoading,
    isError,
  } = useGetTutorAvailabilityQuery(id);

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});

  // Time slots state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Initialize with today's date
  useEffect(() => {
    if (availabilityData?.data?.availabilities) {
      processAvailabilityData();
      setSelectedDate(new Date());
      generateCalendarDays(currentDate);
    }
  }, [availabilityData, currentDate, bookingType]);

  // Process availability data from API
  const processAvailabilityData = () => {
    if (!availabilityData?.data?.availabilities) return;

    const map = {};

    availabilityData.data.availabilities.forEach((availability) => {
      const dateKey = availability.date; // "2025-12-20"

      // Filter available slots (isBooked: false)
      let availableSlots = availability.slots.filter((slot) => !slot.isBooked);

      // Filter by booking type if not "all"
      if (bookingType === "single") {
        availableSlots = availableSlots.filter(
          (slot) => slot.type === "ONE_TO_ONE"
        );
      } else if (bookingType === "group") {
        availableSlots = availableSlots.filter((slot) => slot.type === "GROUP");
      }
      // If bookingType is "all", show all available slots

      if (availableSlots.length > 0) {
        map[dateKey] = {
          hasSlots: true,
          slots: availableSlots,
        };
      }
    });

    setAvailabilityMap(map);
  };

  // Generate calendar days for the current month
  const generateCalendarDays = (date) => {
    if (!availabilityData?.data?.availabilities) return;

    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // First day of the calendar (might include previous month)
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay()); // Start from Sunday

    // Last day of the calendar (might include next month)
    const endDay = new Date(lastDay);
    endDay.setDate(endDay.getDate() + (6 - lastDay.getDay())); // End on Saturday

    const days = [];
    const currentDay = new Date(startDay);

    while (currentDay <= endDay) {
      const day = new Date(currentDay);
      const isCurrentMonth = day.getMonth() === month;
      const isToday = isSameDay(day, new Date());
      const isSelected = selectedDate && isSameDay(day, selectedDate);

      // Format date as YYYY-MM-DD to match API response
      const dateKey = formatDateKey(day);
      const hasAvailableSlots = availabilityMap[dateKey]?.hasSlots || false;

      days.push({
        date: day,
        dateKey: dateKey,
        dayNumber: day.getDate(),
        isCurrentMonth,
        isToday,
        isSelected,
        hasAvailableSlots,
        isWeekend: day.getDay() === 0 || day.getDay() === 6,
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }

    setCalendarDays(days);
  };

  // Format date as YYYY-MM-DD for API matching
  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (day.isCurrentMonth && day.hasAvailableSlots) {
      setSelectedDate(day.date);
      // Clear selected time slot when changing date
      setSelectedTimeSlot(null);
    }
  };

  // Handle booking type change
  const handleBookingTypeChange = (type) => {
    setBookingType(type);
    setSelectedTimeSlot(null);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Select a date";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // Format month and year for display
  const formatMonthYear = (date) => {
    const options = { month: "long", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Get day name abbreviation
  const getDayAbbreviation = (index) => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return days[index];
  };

  // Calculate duration from time slot
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "0 hours";

    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      const durationMs = end - start;
      const durationHours = durationMs / (1000 * 60 * 60);

      return `${durationHours} hour${durationHours !== 1 ? "s" : ""}`;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "0 hours";
    }
  };

  // Format time for display
  const formatTimeDisplay = (slot) => {
    if (!slot) return "";
    return `${slot.startTimeLabel} - ${slot.endTimeLabel}`;
  };

  // Get available slots for selected date
  const getAvailableSlotsForSelectedDate = () => {
    if (!selectedDate) return [];

    const dateKey = formatDateKey(selectedDate);
    return availabilityMap[dateKey]?.slots || [];
  };

  // Handle confirm booking
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot) return;

    console.log("Booking details:", {
      tutorId: id,
      date: selectedDate,
      slot: selectedTimeSlot,
      bookingType: bookingType,
    });

    // Here you would typically:
    // 1. Make API call to book the slot
    // 2. Redirect to payment page
    // 3. Show confirmation
    alert(
      `Booking confirmed!\nDate: ${formatDate(
        selectedDate
      )}\nTime: ${formatTimeDisplay(selectedTimeSlot)}\nType: ${
        selectedTimeSlot.type === "ONE_TO_ONE" ? "One-to-One" : "Group"
      }`
    );
  };

  // Get booking type display text
  const getBookingTypeDisplay = () => {
    switch (bookingType) {
      case "all":
        return "All Available Slots";
      case "single":
        return "One-to-One Slots";
      case "group":
        return "Group Slots";
      default:
        return "Slots";
    }
  };

  if (isLoading) {
    return (
      <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Loading tutor availability...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center text-red-600'>
          <p className='text-lg font-semibold'>Error loading availability</p>
          <p className='text-sm mt-2'>Please try again later</p>
        </div>
      </div>
    );
  }

  const tutorInfo = availabilityData?.data?.tutor;
  const selectedDateSlots = getAvailableSlotsForSelectedDate();

  return (
    <div className='w-full min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4'>
      {/* Progress Steps */}
      <div className='flex items-center gap-3 mb-10'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold'>
            📅
          </div>
          <p className='text-gray-800 font-medium text-sm'>
            Select Date & Time
          </p>
        </div>
        <div className='w-32 h-[2px] bg-purple-300' />
        <div className='flex items-center gap-2 opacity-40'>
          <div className='w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-white font-semibold'>
            💳
          </div>
          <p className='text-gray-400 font-medium text-sm'>
            Booking Details & Payment
          </p>
        </div>
      </div>

      <div className='w-full max-w-[1200px] bg-white shadow-sm rounded-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Toggle Buttons */}
          <div className='flex items-center justify-between mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <div className='flex gap-2'>
              <button
                onClick={() => handleBookingTypeChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  bookingType === "all"
                    ? "text-purple-700 bg-purple-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}>
                All
              </button>
              <button
                onClick={() => handleBookingTypeChange("single")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  bookingType === "single"
                    ? "text-purple-700 bg-purple-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}>
                Single
              </button>
              <button
                onClick={() => handleBookingTypeChange("group")}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  bookingType === "group"
                    ? "text-purple-700 bg-purple-100"
                    : "text-gray-600 bg-gray-100 hover:bg-gray-200"
                }`}>
                Group
              </button>
            </div>
          </div>

          {/* Calendar Box */}
          <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
            {/* Month Header */}
            <div className='flex justify-between items-center mb-6'>
              <button
                onClick={goToPreviousMonth}
                className='text-gray-400 hover:text-gray-600 text-xl'>
                &lt;
              </button>
              <p className='font-semibold text-gray-900 text-lg'>
                {formatMonthYear(currentDate)}
              </p>
              <button
                onClick={goToNextMonth}
                className='text-gray-400 hover:text-gray-600 text-xl'>
                &gt;
              </button>
            </div>

            {/* Week Days */}
            <div className='grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-4'>
              {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                <p key={dayIndex}>{getDayAbbreviation(dayIndex)}</p>
              ))}
            </div>

            {/* Calendar Days */}
            <div className='grid grid-cols-7 gap-2 text-center text-sm'>
              {calendarDays.map((day, index) => {
                const isSelected =
                  selectedDate && isSameDay(day.date, selectedDate);
                const isToday = isSameDay(day.date, new Date());

                return (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(day)}
                    className={`
                      py-3 rounded-xl cursor-pointer transition-all duration-200 relative
                      ${!day.isCurrentMonth ? "text-orange-300 opacity-50" : ""}
                      ${
                        day.isCurrentMonth && !day.hasAvailableSlots
                          ? "text-gray-400 cursor-not-allowed opacity-50"
                          : ""
                      }
                      ${
                        isSelected
                          ? "bg-purple-600 text-white font-semibold"
                          : ""
                      }
                      ${
                        !isSelected &&
                        day.isCurrentMonth &&
                        day.hasAvailableSlots &&
                        day.isWeekend
                          ? "bg-purple-100 text-purple-700"
                          : ""
                      }
                      ${
                        !isSelected &&
                        day.isCurrentMonth &&
                        day.hasAvailableSlots &&
                        !day.isWeekend
                          ? "hover:bg-gray-100"
                          : ""
                      }
                      ${
                        isToday && !isSelected ? "border border-purple-400" : ""
                      }
                    `}>
                    {day.dayNumber}
                    {/* Dot indicator for days with available slots */}
                    {day.isCurrentMonth && day.hasAvailableSlots && (
                      <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full'></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Slot Selection */}
            {selectedDate && selectedDateSlots.length > 0 && (
              <div className='mt-6'>
                <p className='text-sm font-medium text-gray-700 mb-3'>
                  {getBookingTypeDisplay()} for {formatDate(selectedDate)}:
                </p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  {selectedDateSlots.map((slot) => (
                    <div
                      key={slot.id}
                      onClick={() => handleTimeSlotSelect(slot)}
                      className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedTimeSlot?.id === slot.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-400 hover:bg-gray-50"
                      }`}>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-medium text-gray-900'>
                            {slot.startTimeLabel} - {slot.endTimeLabel}
                          </p>
                          <p className='text-sm text-gray-600 mt-1'>
                            {slot.subject} •{" "}
                            {slot.type === "ONE_TO_ONE"
                              ? "One-to-One"
                              : "Group"}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            slot.type === "ONE_TO_ONE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                          {slot.type === "ONE_TO_ONE" ? "1:1" : "Group"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No slots available message */}
            {selectedDate && selectedDateSlots.length === 0 && (
              <div className='mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
                <p className='text-sm text-yellow-700'>
                  No available {getBookingTypeDisplay().toLowerCase()} for this
                  date.
                  {bookingType !== "all" &&
                    " Try selecting 'All' booking type or choose a different date."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className='lg:col-span-1'>
          {/* Tutor Profile */}
          <div className='border border-gray-200 rounded-2xl p-6 shadow-sm'>
            <p className='text-lg font-semibold mb-4 text-gray-900'>
              Tutor Profile
            </p>

            <div className='flex items-center gap-3 mb-6'>
              <Image
                src={tutorInfo?.avatar || prfImage}
                alt={tutorInfo?.id?.[0]?.firstName || "Tutor"}
                width={48}
                height={48}
                className='w-12 h-12 rounded-full object-cover'
              />
              <div className='flex-1'>
                <p className='font-semibold text-gray-900 text-sm'>
                  {tutorInfo?.id?.[0]?.firstName} {tutorInfo?.id?.[0]?.lastName}
                </p>
                <p className='text-xs text-gray-500'>Mathematics Expert</p>
                <div className='flex items-center gap-1 mt-1'>
                  <span className='text-yellow-400 text-xs'>★★★★★</span>
                  <span className='text-xs text-gray-500'>
                    {tutorInfo?.averageRating || 0} (
                    {tutorInfo?.totalRatings || 0})
                  </span>
                </div>
              </div>
              <button className='px-3 py-2 rounded-lg text-xs font-medium bg-purple-200 text-purple-700 hover:bg-purple-300'>
                View profile
              </button>
            </div>

            {/* Date */}
            <div className='flex items-center gap-2 py-3 border-b border-gray-100'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <span className='text-purple-500'>
                    <CiCalendar className='text-xl' />
                  </span>
                  <p className='text-xs text-gray-500 ml-2'>Date</p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  {selectedDate ? formatDate(selectedDate) : "Select a date"}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className='flex items-center gap-2 py-3 border-b border-gray-100'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <span className='text-purple-500'>
                    <MdAccessTime className='text-xl' />
                  </span>
                  <p className='text-xs text-gray-500 ml-2'>Time</p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  {selectedTimeSlot
                    ? `${selectedTimeSlot.startTimeLabel} - ${selectedTimeSlot.endTimeLabel}`
                    : "Select time slot"}
                </p>
              </div>
            </div>

            {/* Duration */}
            <div className='flex items-center gap-2 py-3 border-b border-gray-100'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <span className='text-purple-500'>
                    <CgSandClock className='text-xl' />
                  </span>
                  <p className='text-xs text-gray-500 ml-2'>Duration</p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  {selectedTimeSlot
                    ? calculateDuration(
                        selectedTimeSlot.startTime,
                        selectedTimeSlot.endTime
                      )
                    : "0 hours"}
                </p>
              </div>
            </div>

            {/* Class Type */}
            <div className='flex items-center gap-2 py-3 border-b border-gray-100'>
              <div className='flex-1'>
                <div className='flex items-center'>
                  <span className='text-purple-500'>👥</span>
                  <p className='text-xs text-gray-500 ml-2'>Class Type</p>
                </div>
                <p className='text-sm font-medium text-gray-900'>
                  {selectedTimeSlot?.type === "ONE_TO_ONE"
                    ? "One-to-One Session"
                    : selectedTimeSlot?.type === "GROUP"
                    ? "Group Session"
                    : "Select slot"}
                </p>
              </div>
            </div>

            {/* Subject */}
            {selectedTimeSlot?.subject && (
              <div className='flex items-center gap-2 py-3 border-b border-gray-100'>
                <div className='flex-1'>
                  <div className='flex items-center'>
                    <span className='text-purple-500'>📚</span>
                    <p className='text-xs text-gray-500 ml-2'>Subject</p>
                  </div>
                  <p className='text-sm font-medium text-gray-900'>
                    {selectedTimeSlot.subject}
                  </p>
                </div>
              </div>
            )}

            {/* Pricing - You might want to adjust this based on your pricing logic */}
            <div className='py-4 space-y-2'>
              <div className='flex justify-between text-sm text-gray-700'>
                <p>Price</p>
                <p>
                  {selectedTimeSlot?.type === "ONE_TO_ONE"
                    ? "$120.00"
                    : selectedTimeSlot?.type === "GROUP"
                    ? "$80.00"
                    : "$0.00"}
                </p>
              </div>
              <div className='flex justify-between text-sm text-gray-700'>
                <p>Platform fee(20%)</p>
                <p>
                  {selectedTimeSlot?.type === "ONE_TO_ONE"
                    ? "$24.00"
                    : selectedTimeSlot?.type === "GROUP"
                    ? "$16.00"
                    : "$0.00"}
                </p>
              </div>

              <div className='flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-100'>
                <p className='text-gray-900'>Total</p>
                <p className='text-orange-500'>
                  {selectedTimeSlot?.type === "ONE_TO_ONE"
                    ? "$144.00"
                    : selectedTimeSlot?.type === "GROUP"
                    ? "$96.00"
                    : "$0.00"}
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              className={`w-full py-3 rounded-xl font-semibold mt-2 transition-colors ${
                selectedDate && selectedTimeSlot
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedDate || !selectedTimeSlot}>
              {selectedDate && selectedTimeSlot
                ? "Confirm Slot"
                : "Select Date & Time First"}
            </button>

            <div className='flex items-center justify-center gap-2 text-xs text-gray-500 mt-4'>
              <span className='text-green-500'>✓</span>
              <span>100% secure and encrypted payment.</span>
            </div>

            <div className='text-center text-xs text-gray-500 mt-3 mb-3'>
              Accepted payment methods
            </div>

            <div className='flex justify-center gap-3'>
              <div className='w-10 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold'>
                VISA
              </div>
              <div className='w-10 h-7 bg-red-600 rounded-full flex items-center justify-center'></div>
              <div className='w-10 h-7 bg-purple-600 rounded flex items-center justify-center'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
