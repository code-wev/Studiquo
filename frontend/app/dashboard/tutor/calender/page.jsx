"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useMyProfileQuery } from "@/feature/shared/AuthApi";
import { useGetTutorAvailabilityQuery } from "@/feature/shared/AvailabilityApi";
import { useEffect, useMemo, useState } from "react";
import { BiCheck, BiChevronDown, BiPlus, BiTrash } from "react-icons/bi";
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
  const [hoveredDate, setHoveredDate] = useState(null);

  // Single selection states
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [classType, setClassType] = useState("Single");

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const { data: profile } = useMyProfileQuery();
  const user = profile?.data?.user;

  // Fetch availability
  const {
    data: availabilities,
    isLoading,
    error,
  } = useGetTutorAvailabilityQuery(user?._id, {
    skip: !user?._id,
  });

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

  // Helper function to normalize dates (handle timezone issues)
  const normalizeDate = (dateString) => {
    if (dateString.includes("T")) {
      return new Date(dateString);
    } else {
      return new Date(`${dateString}T00:00:00Z`);
    }
  };

  // Helper function to get date string in YYYY-MM-DD format (UTC)
  const getDateStringUTC = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Create a Map of dates that have available slots with their details
  const availableDatesMap = useMemo(() => {
    if (!availabilities?.data?.availabilities) return new Map();

    const map = new Map();
    availabilities.data.availabilities.forEach((availability) => {
      if (availability.date && availability.slots?.length > 0) {
        const date = normalizeDate(availability.date);
        const dateStr = getDateStringUTC(date);
        map.set(dateStr, {
          date: date,
          slots: availability.slots,
        });
      }
    });
    return map;
  }, [availabilities]);

  // Function to check if a specific date has available slots
  const isDateAvailable = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);
    return availableDatesMap.has(dateStr);
  };

  // Function to get available slots for a specific date
  const getSlotsForDate = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);
    const availability = availableDatesMap.get(dateStr);
    return availability?.slots || [];
  };

  // Function to format date for display
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  // Function to handle adding availability to a date
  const handleAddAvailability = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);

    console.log(`Add availability for: ${dateStr}`);
    // Here you would call your API to add availability for this date
    // For now, we'll just show an alert
    alert(`Add availability for ${date.toDateString()}`);

    // You can also automatically select this date
    setSelectedDate(date);
  };

  // Function to handle removing availability from a date
  const handleRemoveAvailability = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);

    console.log(`Remove availability for: ${dateStr}`);
    // Here you would call your API to remove availability for this date
    // For now, we'll just show an alert
    alert(`Remove availability for ${date.toDateString()}`);

    // You can also automatically select this date
    setSelectedDate(date);
  };

  // Effect to automatically select the first available date from API
  useEffect(() => {
    if (availableDatesMap.size > 0 && !selectedDate) {
      const firstAvailableDate = Array.from(availableDatesMap.values())[0].date;
      setCurrentMonth(
        new Date(
          firstAvailableDate.getUTCFullYear(),
          firstAvailableDate.getUTCMonth()
        )
      );
      setSelectedDate(firstAvailableDate);
    } else if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [availableDatesMap, selectedDate]);

  // Single subject selection
  const selectSubject = (subjectId) => {
    setSelectedSubject(subjectId === selectedSubject ? null : subjectId);
    setShowSubjectDropdown(false);
  };

  // Single slot selection
  const selectSlot = (slotId) => {
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };

  // Calendar logic
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const handleDateClick = (day) => {
    const localDate = new Date(year, month, day);
    const utcDate = new Date(Date.UTC(year, month, day));
    setSelectedDate(utcDate);
  };

  // Generate calendar days with highlight
  const calendarDays = [];

  // Previous month days
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthDays - i;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;
    const isAvailable = isDateAvailable(prevMonthYear, prevMonthIndex, prevDay);
    const isHovered = hoveredDate === `prev-${i}`;

    calendarDays.push(
      <div
        key={`prev-${i}`}
        className={`relative py-3 rounded-xl cursor-pointer ${
          isAvailable
            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
            : "text-gray-300 hover:text-gray-400"
        }`}
        onClick={() => {
          setCurrentMonth(new Date(prevMonthYear, prevMonthIndex));
          const utcDate = new Date(
            Date.UTC(prevMonthYear, prevMonthIndex, prevDay)
          );
          setSelectedDate(utcDate);
        }}
        onMouseEnter={() => setHoveredDate(`prev-${i}`)}
        onMouseLeave={() => setHoveredDate(null)}
        title={isAvailable ? "Remove availability" : "Add availability"}>
        {prevDay}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isAvailable ? (
              <div
                className='bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvailability(
                    prevMonthYear,
                    prevMonthIndex,
                    prevDay
                  );
                }}>
                <BiTrash size={12} />
              </div>
            ) : (
              <div
                className='bg-green-500 text-white p-1 rounded-full hover:bg-green-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddAvailability(prevMonthYear, prevMonthIndex, prevDay);
                }}>
                <BiPlus size={12} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const isAvailable = isDateAvailable(year, month, day);
    const isSelected =
      selectedDate &&
      selectedDate.getUTCFullYear() === year &&
      selectedDate.getUTCMonth() === month &&
      selectedDate.getUTCDate() === day;
    const isHovered = hoveredDate === `current-${day}`;

    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => setHoveredDate(`current-${day}`)}
        onMouseLeave={() => setHoveredDate(null)}
        className={`relative py-3 rounded-xl cursor-pointer transition-all ${
          isSelected
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : isAvailable
            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
            : "hover:bg-gray-100"
        }`}
        title={isAvailable ? "Remove availability" : "Add availability"}>
        {day}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isAvailable ? (
              <div
                className='bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvailability(year, month, day);
                }}>
                <BiTrash size={12} />
              </div>
            ) : (
              <div
                className='bg-green-500 text-white p-1 rounded-full hover:bg-green-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddAvailability(year, month, day);
                }}>
                <BiPlus size={12} />
              </div>
            )}
          </div>
        )}
        {isAvailable && !isSelected && !isHovered && (
          <div className='w-1 h-1 bg-purple-500 rounded-full mx-auto mt-1'></div>
        )}
      </div>
    );
  }

  // Next month days
  const totalCells = calendarDays.length;
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthIndex = month === 11 ? 0 : month + 1;
    const isAvailable = isDateAvailable(nextMonthYear, nextMonthIndex, i);
    const isHovered = hoveredDate === `next-${i}`;

    calendarDays.push(
      <div
        key={`next-${i}`}
        className={`relative py-3 rounded-xl cursor-pointer ${
          isAvailable
            ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
            : "text-gray-300 hover:text-gray-400"
        }`}
        onClick={() => {
          setCurrentMonth(new Date(nextMonthYear, nextMonthIndex));
          const utcDate = new Date(Date.UTC(nextMonthYear, nextMonthIndex, i));
          setSelectedDate(utcDate);
        }}
        onMouseEnter={() => setHoveredDate(`next-${i}`)}
        onMouseLeave={() => setHoveredDate(null)}
        title={isAvailable ? "Remove availability" : "Add availability"}>
        {i}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isAvailable ? (
              <div
                className='bg-red-500 text-white p-1 rounded-full hover:bg-red-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAvailability(nextMonthYear, nextMonthIndex, i);
                }}>
                <BiTrash size={12} />
              </div>
            ) : (
              <div
                className='bg-green-500 text-white p-1 rounded-full hover:bg-green-600'
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddAvailability(nextMonthYear, nextMonthIndex, i);
                }}>
                <BiPlus size={12} />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const dateInputValue = selectedDate
    ? `${selectedDate.getUTCDate()} ${selectedDate.toLocaleString("default", {
        month: "long",
        timeZone: "UTC",
      })}, ${selectedDate.getUTCFullYear()}`
    : "Select a date";

  const selectedSubjectName =
    subjects.find((s) => s.id === selectedSubject)?.name || "select subject";

  const selectedSlotTime =
    [...slots, ...additionalSlots].find((s) => s.id === selectedSlot)?.time ||
    "select";

  const [zoomLink, setZoomLink] = useState("");

  return (
    <div className='w-full min-h-screen bg-gray-50 py-10 px-4'>
      <TitleSection bg={"#F5FFF9"} title={"Calendar"} />

      <div className='w-full max-w-400 mx-auto bg-[#F7F7F7] shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div className='mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <p className='text-sm text-gray-500 mt-1 flex items-center gap-2'>
              <span className='inline-block w-1 h-1 bg-purple-500 rounded-full'></span>
              Dates with availability
              <span className='ml-4 flex items-center gap-1'>
                <BiPlus className='text-green-500' size={14} />
                Add availability
              </span>
              <span className='ml-4 flex items-center gap-1'>
                <BiTrash className='text-red-500' size={14} />
                Remove availability
              </span>
            </p>
          </div>

          <div className='border border-gray-200 rounded-2xl p-6 mb-6'>
            <div className='flex justify-between items-center mb-6'>
              <button
                onClick={prevMonth}
                className='text-gray-400 hover:text-gray-600 text-xl'>
                &lt;
              </button>
              <p className='font-semibold text-gray-900 text-lg'>
                {currentMonth.toLocaleString("default", { month: "long" })}{" "}
                {year}
              </p>
              <button
                onClick={nextMonth}
                className='text-gray-400 hover:text-gray-600 text-xl'>
                &gt;
              </button>
            </div>

            <div className='grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-4'>
              <p>Su</p>
              <p>Mo</p>
              <p>Tu</p>
              <p>We</p>
              <p>Th</p>
              <p>Fr</p>
              <p>Sa</p>
            </div>

            <div className='grid grid-cols-7 gap-2 text-center text-sm'>
              {calendarDays}
            </div>

            {/* Selected Date Details */}
            {selectedDate && (
              <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm font-medium text-gray-900 mb-2'>
                  Available Slots for {formatDateForDisplay(selectedDate)}:
                </p>
                <div className='space-y-2'>
                  {getSlotsForDate(
                    selectedDate.getUTCFullYear(),
                    selectedDate.getUTCMonth(),
                    selectedDate.getUTCDate()
                  ).length > 0 ? (
                    getSlotsForDate(
                      selectedDate.getUTCFullYear(),
                      selectedDate.getUTCMonth(),
                      selectedDate.getUTCDate()
                    ).map((slot) => (
                      <div
                        key={slot.id}
                        className='px-3 py-2 bg-white border border-gray-200 rounded-lg'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-medium text-gray-700'>
                            {slot.startTimeLabel} - {slot.endTimeLabel}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              slot.type === "ONE_TO_ONE"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                            {slot.type === "ONE_TO_ONE" ? "Single" : "Group"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='flex items-center justify-between'>
                      <p className='text-sm text-gray-500'>
                        No available slots for this date
                      </p>
                      <button
                        onClick={() =>
                          handleAddAvailability(
                            selectedDate.getUTCFullYear(),
                            selectedDate.getUTCMonth(),
                            selectedDate.getUTCDate()
                          )
                        }
                        className='text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600'>
                        <BiPlus className='inline mr-1' size={14} />
                        Add Slots
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* All Available Dates */}
            <div className='mt-6 space-y-4'>
              <div className='flex justify-between items-center'>
                <p className='text-sm font-medium text-gray-900'>
                  All Available Dates
                </p>
                <button
                  onClick={() => {
                    const today = new Date();
                    handleAddAvailability(
                      today.getUTCFullYear(),
                      today.getUTCMonth(),
                      today.getUTCDate()
                    );
                  }}
                  className='text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600'>
                  <BiPlus className='inline mr-1' size={12} />
                  Add Today
                </button>
              </div>
              {isLoading ? (
                <p className='text-sm text-gray-500'>Loading availability...</p>
              ) : availableDatesMap.size > 0 ? (
                Array.from(availableDatesMap.values()).map(
                  (availability, index) => (
                    <div
                      key={index}
                      className='space-y-2 bg-white p-3 rounded-lg'>
                      <div className='flex justify-between items-center'>
                        <p className='text-sm font-medium text-gray-700'>
                          {formatDateForDisplay(availability.date)}
                        </p>
                        <button
                          onClick={() =>
                            handleRemoveAvailability(
                              availability.date.getUTCFullYear(),
                              availability.date.getUTCMonth(),
                              availability.date.getUTCDate()
                            )
                          }
                          className='text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600'>
                          <BiTrash size={12} />
                        </button>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {availability.slots.map((slot) => (
                          <span
                            key={slot.id}
                            className={`px-3 py-1 text-xs rounded-full ${
                              slot.type === "ONE_TO_ONE"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                            {slot.startTimeLabel} - {slot.endTimeLabel} (
                            {slot.type === "ONE_TO_ONE" ? "Single" : "Group"})
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className='text-center p-4 bg-gray-50 rounded-lg'>
                  <p className='text-sm text-gray-500 mb-2'>
                    No availability set yet
                  </p>
                  <button
                    onClick={() => {
                      const today = new Date();
                      handleAddAvailability(
                        today.getUTCFullYear(),
                        today.getUTCMonth(),
                        today.getUTCDate()
                      );
                    }}
                    className='text-sm bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600'>
                    <BiPlus className='inline mr-1' size={16} />
                    Add Your First Availability
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------------- RIGHT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div>
            <div className='flex flex-col items-start gap-y-6 mb-6'>
              <div className='text-xl font-semibold text-gray-900'>
                Manage Slots
              </div>

              {/* Class Type Toggle */}
              <div className='w-full'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Class Type
                </label>
                <div className='flex w-full border border-gray-300 rounded-lg overflow-hidden'>
                  <button
                    onClick={() => setClassType("Group")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                      classType === "Group"
                        ? "bg-purple-400 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}>
                    Group
                  </button>
                  <button
                    onClick={() => setClassType("Single")}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-300 ${
                      classType === "Single"
                        ? "bg-purple-400 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}>
                    Single
                  </button>
                </div>
              </div>
            </div>

            <div className='mx-auto p-6 bg-white rounded-2xl shadow-sm'>
              {/* Date Field */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Date
                </label>
                <input
                  type='text'
                  value={dateInputValue}
                  readOnly
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 cursor-default'
                />
              </div>

              {/* Subject Dropdown - Single Selection */}
              <div className='mb-6 relative'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Subject
                </label>
                <button
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-gray-700 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500'>
                  <span>{selectedSubjectName}</span>
                  <BiChevronDown size={20} className='text-gray-400' />
                </button>

                {showSubjectDropdown && (
                  <div className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4'>
                    <div className='text-sm font-medium text-gray-500 mb-3'>
                      Subjects
                    </div>
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => selectSubject(subject.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-50 ${
                          selectedSubject === subject.id ? "bg-purple-100" : ""
                        }`}>
                        <span
                          className={`text-sm font-medium ${subject.color}`}>
                          {subject.name}
                        </span>
                        {selectedSubject === subject.id && (
                          <BiCheck size={18} className='text-purple-600' />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Slots Dropdown - Single Selection */}
              <div className='mb-6 relative'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Slots
                </label>
                <button
                  onClick={() => setShowSlotsDropdown(!showSlotsDropdown)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg text-left text-gray-700 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-purple-500'>
                  <span>{selectedSlotTime}</span>
                  <CgChevronDown size={20} className='text-gray-400' />
                </button>

                {showSlotsDropdown && (
                  <div className='absolute top-full left-0 right-0 mt-2 bg-gray-100 rounded-lg shadow-lg z-10 p-4'>
                    <div className='text-sm font-medium text-gray-500 mb-3'>
                      Slot
                    </div>
                    <div className='bg-white rounded-lg p-3 mb-4'>
                      {slots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => selectSlot(slot.id)}
                          className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between mb-2 last:mb-0 ${
                            selectedSlot === slot.id
                              ? "bg-purple-100"
                              : "hover:bg-gray-50"
                          }`}>
                          <span className='text-sm text-gray-700'>
                            {slot.time}
                          </span>
                          {selectedSlot === slot.id && (
                            <BiCheck size={18} className='text-purple-600' />
                          )}
                        </button>
                      ))}
                      <button className='text-sm text-gray-400 px-3 py-2'>
                        + Add slot
                      </button>
                    </div>

                    <div className='text-sm font-medium text-gray-500 mb-3'>
                      Add slot
                    </div>
                    <div className='bg-white rounded-lg p-3 mb-4'>
                      {additionalSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => selectSlot(slot.id)}
                          className={`w-full text-left px-3 py-3 rounded-lg flex items-center justify-between mb-2 last:mb-0 ${
                            selectedSlot === slot.id
                              ? "bg-purple-100"
                              : "hover:bg-gray-50"
                          }`}>
                          <span className='text-sm text-gray-700'>
                            {slot.time}
                          </span>
                          {selectedSlot === slot.id && (
                            <BiCheck size={18} className='text-purple-600' />
                          )}
                        </button>
                      ))}
                      <button className='text-sm text-gray-400 px-3 py-2'>
                        + Add slot
                      </button>
                    </div>

                    <button className='w-full bg-purple-400 text-white py-2 rounded-lg hover:bg-purple-500 transition-colors'>
                      Create Slot
                    </button>
                  </div>
                )}
              </div>

              {/* Zoom Link Field */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Zoom link
                </label>
                <input
                  type='text'
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder='Zoom Link'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-600'
                />
              </div>

              {/* Action Buttons */}
              <div className='flex items-center justify-between gap-4'>
                <button
                  onClick={() => {
                    if (selectedDate) {
                      handleAddAvailability(
                        selectedDate.getUTCFullYear(),
                        selectedDate.getUTCMonth(),
                        selectedDate.getUTCDate()
                      );
                    }
                  }}
                  className='px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                  <BiPlus className='inline mr-1' size={16} />
                  Add Availability
                </button>
                <button className='px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors'>
                  Create Class
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
