"use client";

import { useGetTutorAvailabilityQuery } from "@/feature/shared/AvailabilityApi";
import { useCreateBookingMutation } from "@/feature/student/BookingApi";
import prfImage from "@/public/hiw/prf.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
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

  // Create booking mutation
  const [createBooking, { isLoading: isCreatingBooking }] =
    useCreateBookingMutation();

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [availableDates, setAvailableDates] = useState([]);

  // Time slots state
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const tutorData = availabilityData?.data?.tutor;

  // Calculate price based on selected time slot type
  const calculatePrice = () => {
    if (!selectedTimeSlot || !tutorData) return 0;

    if (selectedTimeSlot.type === "ONE_TO_ONE") {
      return tutorData.oneOnOneHourlyRate || 0;
    } else if (selectedTimeSlot.type === "GROUP") {
      return tutorData.groupHourlyRate || 0;
    }
    return 0;
  };

  const totalPrice = calculatePrice();

  // Initialize with today's date
  useEffect(() => {
    if (availabilityData?.data?.availabilities) {
      processAvailabilityData();
    }
  }, [availabilityData, bookingType]);

  // Generate calendar when currentDate changes
  useEffect(() => {
    if (availabilityData?.data?.availabilities) {
      generateCalendarDays(currentDate);
    }
  }, [currentDate, availabilityMap]);

  // Auto-select first available date
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      const firstAvailableDate = new Date(availableDates[0]);
      setSelectedDate(firstAvailableDate);
    }
  }, [availableDates, selectedDate]);

  // Process availability data from API
  const processAvailabilityData = () => {
    if (!availabilityData?.data?.availabilities) return;

    const map = {};
    const dates = [];

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
        dates.push(dateKey);
      }
    });

    setAvailabilityMap(map);
    setAvailableDates(dates);

    // Reset selected time slot when availability changes
    setSelectedTimeSlot(null);
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
    setSelectedTimeSlot(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
    setSelectedTimeSlot(null);
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

    // Auto-select first available date for the new booking type
    if (availabilityData?.data?.availabilities) {
      const newAvailabilityMap = {};
      const newAvailableDates = [];

      availabilityData.data.availabilities.forEach((availability) => {
        const dateKey = availability.date;

        let availableSlots = availability.slots.filter(
          (slot) => !slot.isBooked
        );

        if (type === "single") {
          availableSlots = availableSlots.filter(
            (slot) => slot.type === "ONE_TO_ONE"
          );
        } else if (type === "group") {
          availableSlots = availableSlots.filter(
            (slot) => slot.type === "GROUP"
          );
        }

        if (availableSlots.length > 0) {
          newAvailabilityMap[dateKey] = {
            hasSlots: true,
            slots: availableSlots,
          };
          newAvailableDates.push(dateKey);
        }
      });

      setAvailabilityMap(newAvailabilityMap);
      setAvailableDates(newAvailableDates);

      // Select first available date
      if (newAvailableDates.length > 0) {
        const firstAvailableDate = new Date(newAvailableDates[0]);
        setSelectedDate(firstAvailableDate);
      } else {
        setSelectedDate(null);
      }
    }
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

  // Get rate type display
  const getRateTypeDisplay = () => {
    if (!selectedTimeSlot || !tutorData) return "Session Price";

    if (selectedTimeSlot.type === "ONE_TO_ONE") {
      return "One-to-One Session Price";
    } else if (selectedTimeSlot.type === "GROUP") {
      return "Group Session Price";
    }
    return "Session Price";
  };

  // Get rate type badge
  const getRateTypeBadge = () => {
    if (!selectedTimeSlot || !tutorData) return null;

    if (selectedTimeSlot.type === "ONE_TO_ONE") {
      return (
        <span className='ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full'>
          1:1 Rate
        </span>
      );
    } else if (selectedTimeSlot.type === "GROUP") {
      return (
        <span className='ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full'>
          Group Rate
        </span>
      );
    }
    return null;
  };

  // Handle confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !id) return;

    const bookingData = {
      timeSlot: selectedTimeSlot.id, // This should be the time slot ID from the API
      subject: selectedTimeSlot.subject,
      type: selectedTimeSlot.type,
    };

    console.log("Booking request data:", bookingData);

    // Show loading toast
    const loadingToastId = toast.loading("Creating booking...");

    try {
      // Call the create booking API
      const response = await createBooking(bookingData).unwrap();

      console.log("Booking API success response:", response);

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show success toast
      toast.success(
        `Booking created successfully!\nDate: ${formatDate(
          selectedDate
        )}\nTime: ${formatTimeDisplay(selectedTimeSlot)}\nType: ${
          selectedTimeSlot.type === "ONE_TO_ONE" ? "One-to-One" : "Group"
        }\nTotal: $${totalPrice?.toFixed(2) || "0.00"}`,
        {
          duration: 5000,
          position: "top-center",
        }
      );

      // Check if there's a payment URL in the response and redirect
      if (response?.payment?.checkoutUrl) {
        console.log(
          "Redirecting to payment URL:",
          response.payment.checkoutUrl
        );

        // Show payment redirect toast
        toast.success("Redirecting to payment page...", {
          duration: 2000,
          position: "top-center",
        });

        // Wait a moment then redirect
        setTimeout(() => {
          window.location.href = response.payment.checkoutUrl;
        }, 2000);
      } else if (response?.booking) {
        // If no payment URL but booking was created
        toast.success(
          "Booking created! Payment will be processed separately.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
      }
    } catch (error) {
      console.error("Booking API error:", error);

      // Dismiss loading toast
      toast.dismiss(loadingToastId);

      // Show error toast
      toast.error(
        `Failed to create booking: ${
          error?.data?.message || error?.message || "Unknown error"
        }`,
        {
          duration: 5000,
          position: "top-center",
        }
      );
    }
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
      <>
        <Toaster position='top-center' />
        <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
            <p className='mt-4 text-gray-600'>Loading tutor availability...</p>
          </div>
        </div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Toaster position='top-center' />
        <div className='w-full min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='text-center text-red-600'>
            <p className='text-lg font-semibold'>Error loading availability</p>
            <p className='text-sm mt-2'>Please try again later</p>
          </div>
        </div>
      </>
    );
  }

  const tutorInfo = availabilityData?.data?.tutor;
  const selectedDateSlots = getAvailableSlotsForSelectedDate();

  return (
    <>
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
          loading: {
            duration: Infinity,
          },
        }}
      />

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
                        ${
                          !day.isCurrentMonth
                            ? "text-orange-300 opacity-50"
                            : ""
                        }
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
                          isToday && !isSelected
                            ? "border border-purple-400"
                            : ""
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
                            {/* Show price for this slot */}
                            <div className='mt-2'>
                              <span className='text-xs font-medium text-gray-700'>
                                Price: $
                                {slot.type === "ONE_TO_ONE"
                                  ? tutorData?.oneOnOneHourlyRate?.toFixed(2) ||
                                    "0.00"
                                  : tutorData?.groupHourlyRate?.toFixed(2) ||
                                    "0.00"}
                              </span>
                              <span
                                className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                  slot.type === "ONE_TO_ONE"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-green-100 text-green-700"
                                }`}>
                                {slot.type === "ONE_TO_ONE" ? "1:1" : "Group"}
                              </span>
                            </div>
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
                    No available {getBookingTypeDisplay().toLowerCase()} for
                    this date.
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
                  alt={tutorInfo?.name || "Tutor"}
                  width={48}
                  height={48}
                  className='w-12 h-12 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <p className='font-semibold text-gray-900 text-sm'>
                    {tutorInfo?.name}
                  </p>
                  <p className='text-xs text-gray-500'>
                    {tutorInfo?.subjects?.join(", ")}
                  </p>
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
                  <div className='flex items-center'>
                    <p className='text-sm font-medium text-gray-900'>
                      {selectedTimeSlot?.type === "ONE_TO_ONE"
                        ? "One-to-One Session"
                        : selectedTimeSlot?.type === "GROUP"
                        ? "Group Session"
                        : "Select slot"}
                    </p>
                    {getRateTypeBadge()}
                  </div>
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

              {/* Pricing - Dynamic based on session type */}
              <div className='py-4 space-y-2'>
                <div className='flex justify-between items-center text-sm text-gray-700'>
                  <div className='flex items-center'>
                    <p>{getRateTypeDisplay()}</p>
                  </div>
                  <p>${totalPrice?.toFixed(2) || "0.00"}</p>
                </div>

                {/* Show both rates for comparison when no slot selected */}
                {!selectedTimeSlot && tutorData && (
                  <>
                    <div className='flex justify-between text-sm text-gray-500 border-t pt-2'>
                      <div className='flex items-center'>
                        <p>One-to-One Rate</p>
                        <span className='ml-2 px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full'>
                          1:1
                        </span>
                      </div>
                      <p>
                        ${tutorData.oneOnOneHourlyRate?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div className='flex justify-between text-sm text-gray-500'>
                      <div className='flex items-center'>
                        <p>Group Rate</p>
                        <span className='ml-2 px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full'>
                          Group
                        </span>
                      </div>
                      <p>${tutorData.groupHourlyRate?.toFixed(2) || "0.00"}</p>
                    </div>
                  </>
                )}

                <div className='flex justify-between font-semibold text-lg mt-3 pt-3 border-t border-gray-100'>
                  <p className='text-gray-900'>Total</p>
                  <p className='text-orange-500'>
                    ${totalPrice?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={
                  !selectedDate || !selectedTimeSlot || isCreatingBooking
                }
                className={`w-full py-3 rounded-xl font-semibold mt-2 transition-colors ${
                  selectedDate && selectedTimeSlot && !isCreatingBooking
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}>
                {isCreatingBooking ? (
                  <div className='flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                    Processing...
                  </div>
                ) : selectedDate && selectedTimeSlot ? (
                  "Confirm Slot"
                ) : (
                  "Select Date & Time First"
                )}
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
    </>
  );
}
