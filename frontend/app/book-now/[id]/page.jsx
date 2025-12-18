"use client";
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

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [randomAvailability, setRandomAvailability] = useState({});

  // Time slots state
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([
    "12:00pm – 02:00pm",
  ]);

  // Initialize with today's date
  useEffect(() => {
    setSelectedDate(new Date());
    generateCalendarDays(currentDate);
  }, [currentDate]);

  // Generate random availability for the days in the current month (for demo)
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - firstDay.getDay());
    const endDay = new Date(lastDay);
    endDay.setDate(endDay.getDate() + (6 - lastDay.getDay()));

    const availability = {};
    const currentDay = new Date(startDay);

    while (currentDay <= endDay) {
      const key = currentDay.toDateString();
      // Only generate once per month view
      availability[key] = Math.random() > 0.3;
      currentDay.setDate(currentDay.getDate() + 1);
    }
    setRandomAvailability(availability);
  }, [currentDate]);

  // Generate calendar days for the current month
  const generateCalendarDays = (date) => {
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

      // Use pre-generated random availability for demo
      const hasAvailableSlots = randomAvailability[day.toDateString()] ?? false;

      days.push({
        date: day,
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
    }
  };

  // Handle time slot selection
  const handleTimeSlotToggle = (timeSlot) => {
    setSelectedTimeSlots((prev) => {
      if (prev.includes(timeSlot)) {
        return prev.filter((slot) => slot !== timeSlot);
      } else {
        return [...prev, timeSlot];
      }
    });
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

  // Available time slots (could be fetched from API)
  const availableTimeSlots = [
    "08:00am – 10:00am",
    "10:00am – 12:00pm",
    "12:00pm – 02:00pm",
    "02:00pm – 04:00pm",
    "04:00pm – 06:00pm",
    "06:00pm – 08:00pm",
  ];

  // Get day name abbreviation
  const getDayAbbreviation = (index) => {
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    return days[index];
  };

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
                      py-3 rounded-xl cursor-pointer transition-all duration-200
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

            {/* Time Slot Checkboxes */}
            <div className='mt-6 space-y-2'>
              <p className='text-sm font-medium text-gray-700 mb-3'>
                Available Time Slots:
              </p>
              {availableTimeSlots.map((timeSlot, index) => (
                <label
                  key={index}
                  className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={selectedTimeSlots.includes(timeSlot)}
                    onChange={() => handleTimeSlotToggle(timeSlot)}
                    className='w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                  />
                  <span className='text-sm text-gray-700'>{timeSlot}</span>
                </label>
              ))}
            </div>

            {/* Selected Date Info */}
            {selectedDate && (
              <div className='mt-6 p-4 bg-purple-50 rounded-lg'>
                <p className='text-sm font-medium text-purple-700 mb-1'>
                  Selected Date:
                </p>
                <p className='text-sm text-gray-900'>
                  {formatDate(selectedDate)}
                </p>
                {selectedTimeSlots.length > 0 && (
                  <>
                    <p className='text-sm font-medium text-purple-700 mt-3 mb-1'>
                      Selected Time Slots:
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {selectedTimeSlots.map((slot, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-white border border-purple-200 rounded-full text-xs text-purple-700'>
                          {slot}
                        </span>
                      ))}
                    </div>
                  </>
                )}
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
                src={prfImage}
                alt='Jerome Bell'
                className='w-12 h-12 rounded-full object-cover'
              />
              <div className='flex-1'>
                <p className='font-semibold text-gray-900 text-sm'>
                  Jerome Bell
                </p>
                <p className='text-xs text-gray-500'>Mathematics Expert</p>
                <div className='flex items-center gap-1 mt-1'>
                  <span className='text-yellow-400 text-xs'>★★★★★</span>
                  <span className='text-xs text-gray-500'>44 (58)</span>
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
                  {selectedTimeSlots.length > 0
                    ? selectedTimeSlots[0].split(" – ")[0]
                    : "Select time"}
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
                  {selectedTimeSlots.length > 0
                    ? selectedTimeSlots.map((slot) => {
                        const [start, end] = slot.split(" – ");
                        const startTime = start
                          .replace("am", "")
                          .replace("pm", "");
                        const endTime = end.replace("am", "").replace("pm", "");
                        const duration =
                          parseInt(endTime) - parseInt(startTime);
                        return `${duration} hours`;
                      })[0]
                    : "0 hours"}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className='py-4 space-y-2'>
              <div className='flex justify-between text-sm text-gray-700'>
                <p>Price</p>
                <p>$110.00</p>
              </div>
              <div className='flex justify-between text-sm text-gray-700'>
                <p>Platform fee(20%)</p>
                <p>$6.00</p>
              </div>

              <div className='flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-100'>
                <p className='text-gray-900'>Total</p>
                <p className='text-orange-500'>$121.00</p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              className={`w-full py-3 rounded-xl font-semibold mt-2 transition-colors ${
                selectedDate && selectedTimeSlots.length > 0
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!selectedDate || selectedTimeSlots.length === 0}>
              {selectedDate && selectedTimeSlots.length > 0
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
