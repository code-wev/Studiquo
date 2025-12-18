"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useMyProfileQuery } from "@/feature/shared/AuthApi";
import {
  useAddAvailabilityDateMutation,
  useAddTimeSlotMutation,
  useDeleteTimeSlotMutation,
  useDeleteTutorAvailabilityMutation,
  useGetTutorAvailabilityQuery,
} from "@/feature/shared/AvailabilityApi";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
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
  const [deleteConfirmDate, setDeleteConfirmDate] = useState(null);

  // Single selection states
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [classType, setClassType] = useState("Single");

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Track current availability ID for the selected date
  const [currentAvailabilityId, setCurrentAvailabilityId] = useState(null);

  const { data: profile } = useMyProfileQuery();
  const user = profile?.data?.user;

  // Fetch availability
  const {
    data: availabilities,
    isLoading,
    refetch: refetchAvailabilities,
  } = useGetTutorAvailabilityQuery(user?._id, {
    skip: !user?._id,
  });

  // Mutations
  const [addAvailabilityDate, { isLoading: isAddingDate }] =
    useAddAvailabilityDateMutation();

  const [addTimeSlot, { isLoading: isAddingSlot }] = useAddTimeSlotMutation();

  const [deleteTutorAvailability, { isLoading: isDeleting }] =
    useDeleteTutorAvailabilityMutation();

  const [deleteTimeSlot, { isLoading: isDeletingSlot }] =
    useDeleteTimeSlotMutation();

  const subjects = [
    { id: 1, name: "English", value: "ENGLISH", color: "text-yellow-600" },
    { id: 2, name: "Science", value: "SCIENCE", color: "text-green-600" },
    { id: 3, name: "Math", value: "MATH", color: "text-pink-500" },
  ];

  const slots = [
    { id: 1, time: "12:00 PM", hours: 12, minutes: 0, duration: 2 },
    { id: 2, time: "02:00 PM", hours: 14, minutes: 0, duration: 2 },
    { id: 3, time: "04:00 PM", hours: 16, minutes: 0, duration: 2 },
    { id: 4, time: "06:00 PM", hours: 18, minutes: 0, duration: 2 },
  ];

  const additionalSlots = [
    { id: 5, time: "08:00 AM", hours: 8, minutes: 0, duration: 1 },
    { id: 6, time: "09:00 AM", hours: 9, minutes: 0, duration: 1 },
    { id: 7, time: "10:00 AM", hours: 10, minutes: 0, duration: 1 },
    { id: 8, time: "11:00 AM", hours: 11, minutes: 0, duration: 1 },
  ];

  // Helper: get YYYY-MM-DD string in UTC
  const getDateStringUTC = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper: create ISO datetime string for a specific time on a date
  const createDateTimeISO = (date, hours, minutes) => {
    const newDate = new Date(date);
    newDate.setUTCHours(hours, minutes, 0, 0);
    return newDate.toISOString();
  };

  // Create maps for different availability states
  const availabilityMaps = useMemo(() => {
    const hasSlotsMap = new Map(); // Dates that have slots
    const noSlotsMap = new Map(); // Dates that exist in availability but have no slots

    if (availabilities?.data?.availabilities) {
      availabilities.data.availabilities.forEach((availability) => {
        if (availability.date) {
          const date = new Date(availability.date + "T00:00:00Z");
          const dateStr = getDateStringUTC(date);

          if (availability.slots?.length > 0) {
            // Has slots
            hasSlotsMap.set(dateStr, {
              date,
              slots: availability.slots,
              availabilityId: availability.availabilityId,
              hasSlots: true,
            });
          } else {
            // No slots (just date exists in availability)
            noSlotsMap.set(dateStr, {
              date,
              slots: [],
              availabilityId: availability.availabilityId,
              hasSlots: false,
            });
          }
        }
      });
    }

    return { hasSlotsMap, noSlotsMap };
  }, [availabilities]);

  // Check different availability states
  const isDateAvailableWithSlots = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);
    return availabilityMaps.hasSlotsMap.has(dateStr);
  };

  const isDateAvailableWithoutSlots = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);
    return availabilityMaps.noSlotsMap.has(dateStr);
  };

  const isDateInAvailability = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);
    return (
      availabilityMaps.hasSlotsMap.has(dateStr) ||
      availabilityMaps.noSlotsMap.has(dateStr)
    );
  };

  // Get availability info for a date
  const getAvailabilityForDate = (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);

    return (
      availabilityMaps.hasSlotsMap.get(dateStr) ||
      availabilityMaps.noSlotsMap.get(dateStr) ||
      null
    );
  };

  // Get slots for a date
  const getSlotsForDate = (year, month, day) => {
    const availability = getAvailabilityForDate(year, month, day);
    return availability?.slots || [];
  };

  // Format date display
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  };

  // Add availability date
  const handleAddAvailability = async (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);

    try {
      const result = await addAvailabilityDate({ date: dateStr }).unwrap();

      if (result.success) {
        await refetchAvailabilities();
        setSelectedDate(date);

        // Assuming response contains the new availabilityId
        if (result.data?.availability?._id) {
          setCurrentAvailabilityId(result.data.availability._id);
        }

        toast.success(`Availability added for ${date.toDateString()}`);
      } else {
        toast.error(
          `Failed to add availability: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error adding availability:", error);
      toast.error(`${error?.data?.message || error.message}`);
    }
  };

  // Delete specific time slot
  const handleDeleteTimeSlot = async (slotId, slotLabel) => {
    try {
      const result = await deleteTimeSlot({ slotId }).unwrap();

      if (result.success) {
        await refetchAvailabilities();
        toast.success(`Time slot ${slotLabel} deleted successfully`);
      } else {
        toast.error(
          `Failed to delete time slot: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting time slot:", error);
      toast.error(`${error?.data?.message || error.message}`);
    }
  };

  // Remove availability
  const handleRemoveAvailability = async (year, month, day) => {
    const date = new Date(Date.UTC(year, month, day));
    const dateStr = getDateStringUTC(date);

    // Get availability info for this date
    const availability = getAvailabilityForDate(year, month, day);

    if (!availability?.availabilityId) {
      toast.error("No availability found for this date");
      return;
    }

    // Show confirmation dialog
    if (deleteConfirmDate !== dateStr) {
      setDeleteConfirmDate(dateStr);
      toast(`Click trash icon again to confirm deletion`, {
        icon: "⚠️",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await deleteTutorAvailability(
        availability.availabilityId
      ).unwrap();

      if (result.success) {
        await refetchAvailabilities();
        setDeleteConfirmDate(null);

        // If we're deleting the currently selected date, clear the selection
        if (selectedDate && getDateStringUTC(selectedDate) === dateStr) {
          setSelectedDate(null);
          setCurrentAvailabilityId(null);
        }

        toast.success(`Availability removed for ${date.toDateString()}`);
      } else {
        toast.error(
          `Failed to remove availability: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error removing availability:", error);
      toast.error(`${error?.data?.message || error.message}`);
    }
  };

  // Auto-select first available date or today
  useEffect(() => {
    const allDatesMap = new Map([
      ...availabilityMaps.hasSlotsMap,
      ...availabilityMaps.noSlotsMap,
    ]);
    if (allDatesMap.size > 0 && !selectedDate) {
      const first = Array.from(allDatesMap.values())[0].date;
      setCurrentMonth(new Date(first.getUTCFullYear(), first.getUTCMonth()));
      setSelectedDate(first);
    } else if (!selectedDate) {
      setSelectedDate(new Date());
    }
  }, [availabilityMaps, selectedDate]);

  // Update currentAvailabilityId when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = getDateStringUTC(selectedDate);
      const hasSlots = availabilityMaps.hasSlotsMap.get(dateStr);
      const noSlots = availabilityMaps.noSlotsMap.get(dateStr);
      const avail = hasSlots || noSlots;
      setCurrentAvailabilityId(avail?.availabilityId || null);
    }
  }, [selectedDate, availabilityMaps]);

  // Reset delete confirmation when hovering away
  useEffect(() => {
    if (!hoveredDate && deleteConfirmDate) {
      setDeleteConfirmDate(null);
    }
  }, [hoveredDate, deleteConfirmDate]);

  // Subject & Slot selection
  const selectSubject = (subjectId) => {
    setSelectedSubject(subjectId === selectedSubject ? null : subjectId);
    setShowSubjectDropdown(false);
  };

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

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

  const handleDateClick = (day) => {
    const utcDate = new Date(Date.UTC(year, month, day));
    setSelectedDate(utcDate);
  };

  // Generate calendar days
  const calendarDays = [];

  // Previous month
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDay = prevMonthDays - i;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthIndex = month === 0 ? 11 : month - 1;

    const hasSlots = isDateAvailableWithSlots(
      prevMonthYear,
      prevMonthIndex,
      prevDay
    );
    const noSlots = isDateAvailableWithoutSlots(
      prevMonthYear,
      prevMonthIndex,
      prevDay
    );
    const isInAvailability = hasSlots || noSlots;
    const isHovered = hoveredDate === `prev-${i}`;
    const dateStr = getDateStringUTC(
      new Date(Date.UTC(prevMonthYear, prevMonthIndex, prevDay))
    );
    const showDeleteConfirm = deleteConfirmDate === dateStr;

    let bgClass = "text-gray-300 hover:text-gray-400";
    if (hasSlots) {
      bgClass = "bg-purple-100 text-purple-700 hover:bg-purple-200";
    } else if (noSlots) {
      bgClass = "bg-blue-50 text-blue-400 hover:bg-blue-100";
    }

    calendarDays.push(
      <div
        key={`prev-${i}`}
        className={`relative py-3 rounded-xl cursor-pointer ${bgClass}`}
        onClick={() => {
          setCurrentMonth(new Date(prevMonthYear, prevMonthIndex));
          setSelectedDate(
            new Date(Date.UTC(prevMonthYear, prevMonthIndex, prevDay))
          );
        }}
        onMouseEnter={() => setHoveredDate(`prev-${i}`)}
        onMouseLeave={() => {
          setHoveredDate(null);
          if (deleteConfirmDate === dateStr) {
            setDeleteConfirmDate(null);
          }
        }}
        title={
          hasSlots
            ? "Remove availability"
            : noSlots
            ? "Add slots (availability exists)"
            : "Add availability"
        }>
        {prevDay}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isInAvailability ? (
              <div
                className={`p-1 rounded-full hover:bg-red-600 ${
                  showDeleteConfirm ? "bg-red-600 animate-pulse" : "bg-red-500"
                } text-white`}
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

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const hasSlots = isDateAvailableWithSlots(year, month, day);
    const noSlots = isDateAvailableWithoutSlots(year, month, day);
    const isInAvailability = hasSlots || noSlots;
    const isSelected =
      selectedDate &&
      selectedDate.getUTCFullYear() === year &&
      selectedDate.getUTCMonth() === month &&
      selectedDate.getUTCDate() === day;
    const isHovered = hoveredDate === `current-${day}`;
    const dateStr = getDateStringUTC(new Date(Date.UTC(year, month, day)));
    const showDeleteConfirm = deleteConfirmDate === dateStr;

    let bgClass = "hover:bg-gray-100";
    if (isSelected) {
      bgClass = "bg-purple-500 text-white hover:bg-purple-600";
    } else if (hasSlots) {
      bgClass = "bg-purple-100 text-purple-700 hover:bg-purple-200";
    } else if (noSlots) {
      bgClass = "bg-blue-50 text-blue-400 hover:bg-blue-100";
    }

    calendarDays.push(
      <div
        key={day}
        onClick={() => handleDateClick(day)}
        onMouseEnter={() => setHoveredDate(`current-${day}`)}
        onMouseLeave={() => {
          setHoveredDate(null);
          if (deleteConfirmDate === dateStr) {
            setDeleteConfirmDate(null);
          }
        }}
        className={`relative py-3 rounded-xl cursor-pointer transition-all ${bgClass}`}
        title={
          hasSlots
            ? "Remove availability"
            : noSlots
            ? "Add slots (availability exists)"
            : "Add availability"
        }>
        {day}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isInAvailability ? (
              <div
                className={`p-1 rounded-full hover:bg-red-600 ${
                  showDeleteConfirm ? "bg-red-600 animate-pulse" : "bg-red-500"
                } text-white`}
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
        {hasSlots && !isSelected && !isHovered && (
          <div className='w-1 h-1 bg-purple-500 rounded-full mx-auto mt-1'></div>
        )}
        {noSlots && !isSelected && !isHovered && (
          <div className='w-1 h-1 bg-blue-300 rounded-full mx-auto mt-1'></div>
        )}
      </div>
    );
  }

  // Next month
  const totalCells = calendarDays.length;
  const remainingCells = 42 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthIndex = month === 11 ? 0 : month + 1;

    const hasSlots = isDateAvailableWithSlots(nextMonthYear, nextMonthIndex, i);
    const noSlots = isDateAvailableWithoutSlots(
      nextMonthYear,
      nextMonthIndex,
      i
    );
    const isInAvailability = hasSlots || noSlots;
    const isHovered = hoveredDate === `next-${i}`;
    const dateStr = getDateStringUTC(
      new Date(Date.UTC(nextMonthYear, nextMonthIndex, i))
    );
    const showDeleteConfirm = deleteConfirmDate === dateStr;

    let bgClass = "text-gray-300 hover:text-gray-400";
    if (hasSlots) {
      bgClass = "bg-purple-100 text-purple-700 hover:bg-purple-200";
    } else if (noSlots) {
      bgClass = "bg-blue-50 text-blue-400 hover:bg-blue-100";
    }

    calendarDays.push(
      <div
        key={`next-${i}`}
        className={`relative py-3 rounded-xl cursor-pointer ${bgClass}`}
        onClick={() => {
          setCurrentMonth(new Date(nextMonthYear, nextMonthIndex));
          setSelectedDate(new Date(Date.UTC(nextMonthYear, nextMonthIndex, i)));
        }}
        onMouseEnter={() => setHoveredDate(`next-${i}`)}
        onMouseLeave={() => {
          setHoveredDate(null);
          if (deleteConfirmDate === dateStr) {
            setDeleteConfirmDate(null);
          }
        }}
        title={
          hasSlots
            ? "Remove availability"
            : noSlots
            ? "Add slots (availability exists)"
            : "Add availability"
        }>
        {i}
        {isHovered && (
          <div className='absolute -top-1 -right-1 z-10'>
            {isInAvailability ? (
              <div
                className={`p-1 rounded-full hover:bg-red-600 ${
                  showDeleteConfirm ? "bg-red-600 animate-pulse" : "bg-red-500"
                } text-white`}
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

  const selectedSubjectValue =
    subjects.find((s) => s.id === selectedSubject)?.value || null;

  const selectedSlotTime =
    [...slots, ...additionalSlots].find((s) => s.id === selectedSlot)?.time ||
    "select";

  const [zoomLink, setZoomLink] = useState("");

  // Create Slot handler - Updated to match API requirements
  const handleCreateSlot = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }
    if (!currentAvailabilityId) {
      toast.error("Please add availability for this date first");
      return;
    }
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (!selectedSubjectValue) {
      toast.error("Please select a subject");
      return;
    }
    if (!zoomLink) {
      toast.error("Please enter a Zoom link");
      return;
    }

    // Get selected slot details
    const slotObj = [...slots, ...additionalSlots].find(
      (s) => s.id === selectedSlot
    );

    // Create ISO datetime strings for the selected date and time
    const startTimeISO = createDateTimeISO(
      selectedDate,
      slotObj.hours,
      slotObj.minutes
    );

    // Calculate end time based on duration (in hours)
    const endTime = new Date(selectedDate);
    endTime.setUTCHours(
      slotObj.hours + slotObj.duration,
      slotObj.minutes,
      0,
      0
    );
    const endTimeISO = endTime.toISOString();

    // Create payload matching CreateTimeSlotDto
    const payload = {
      startTime: startTimeISO,
      endTime: endTimeISO,
      type: classType === "Single" ? "ONE_TO_ONE" : "GROUP",
      subject: selectedSubjectValue,
      meetLink: zoomLink,
    };

    console.log("Creating slot with payload:", payload);

    try {
      const result = await addTimeSlot({
        availabilityId: currentAvailabilityId,
        slotData: payload,
      }).unwrap();

      console.log("Slot creation result:", result);

      if (result) {
        await refetchAvailabilities();
        setShowSlotsDropdown(false);
        setSelectedSlot(null);
        setZoomLink(""); // Clear zoom link after successful creation
        toast.success("Time slot created successfully!");
      }
    } catch (err) {
      console.error("Failed to create slot:", err);
      if (err.data?.message) {
        if (Array.isArray(err.data.message)) {
          toast.error(err.data.message.join(", "));
        } else {
          toast.error(err.data.message);
        }
      } else {
        toast.error("Failed to create slot");
      }
    }
  };

  // Delete availability for selected date
  const handleDeleteSelectedAvailability = async () => {
    if (!selectedDate || !currentAvailabilityId) {
      toast.error("No availability to delete");
      return;
    }

    try {
      const result = await deleteTutorAvailability(
        currentAvailabilityId
      ).unwrap();

      if (result.success) {
        await refetchAvailabilities();
        setSelectedDate(null);
        setCurrentAvailabilityId(null);
        toast.success(
          `Availability removed for ${selectedDate.toDateString()}`
        );
      } else {
        toast.error(
          `Failed to remove availability: ${result.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error removing availability:", error);
      toast.error(`${error?.data?.message || error.message}`);
    }
  };

  return (
    <div className='w-full min-h-screen bg-gray-50 py-10 px-4'>
      <TitleSection bg={"#F5FFF9"} title={"Calendar"} />

      <div className='w-full max-w-400 mx-auto bg-[#F7F7F7] shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          <div className='mb-6'>
            <p className='text-xl font-semibold text-gray-900'>Calendar</p>
            <p className='text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-2'>
              <span className='inline-flex items-center'>
                <span className='inline-block w-1 h-1 bg-purple-500 rounded-full mr-1'></span>
                Dates with slots
              </span>
              <span className='inline-flex items-center'>
                <span className='inline-block w-1 h-1 bg-blue-300 rounded-full mr-1'></span>
                Dates without slots
              </span>
              <span className='inline-flex items-center'>
                <BiPlus className='text-green-500 mr-1' size={14} />
                Add availability
              </span>
              <span className='inline-flex items-center'>
                <BiTrash className='text-red-500 mr-1' size={14} />
                Remove availability
              </span>
              {(isAddingDate ||
                isAddingSlot ||
                isDeleting ||
                isDeletingSlot) && (
                <span className='text-blue-500'>Processing...</span>
              )}
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
                <div className='flex justify-between items-center mb-2'>
                  <p className='text-sm font-medium text-gray-900'>
                    Availability for {formatDateForDisplay(selectedDate)}:
                  </p>
                  {currentAvailabilityId && (
                    <button
                      onClick={handleDeleteSelectedAvailability}
                      disabled={isDeleting}
                      className={`text-xs px-2 py-1 rounded-lg ${
                        isDeleting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white flex items-center`}>
                      <BiTrash className='mr-1' size={12} />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  )}
                </div>
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
                        className='px-3 py-2 bg-white border border-gray-200 rounded-lg flex justify-between items-center'>
                        <div>
                          <span className='text-sm font-medium text-gray-700'>
                            {slot.startTimeLabel} - {slot.endTimeLabel}
                          </span>
                          <span
                            className={`ml-2 text-xs px-2 py-1 rounded-full ${
                              slot.type === "ONE_TO_ONE"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}>
                            {slot.type === "ONE_TO_ONE" ? "Single" : "Group"}
                          </span>
                          {slot.subject && (
                            <span className='ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700'>
                              {slot.subject}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleDeleteTimeSlot(
                              slot.id,
                              `${slot.startTimeLabel} - ${slot.endTimeLabel}`
                            )
                          }
                          disabled={isDeletingSlot}
                          className='text-xs bg-red-500 text-white p-1 rounded-full hover:bg-red-600 ml-2'>
                          <BiTrash size={10} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p className='text-sm text-gray-500 mb-3'>
                        {currentAvailabilityId
                          ? "This date is marked as available but has no time slots yet."
                          : "This date is not marked as available."}
                      </p>
                      {currentAvailabilityId ? (
                        <button
                          onClick={() => setShowSlotsDropdown(true)}
                          className='text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600'>
                          <BiPlus className='inline mr-1' size={14} />
                          Add Time Slots
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleAddAvailability(
                              selectedDate.getUTCFullYear(),
                              selectedDate.getUTCMonth(),
                              selectedDate.getUTCDate()
                            )
                          }
                          disabled={isAddingDate}
                          className={`text-sm px-3 py-1 rounded-lg ${
                            isAddingDate
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white`}>
                          {isAddingDate ? (
                            "Adding..."
                          ) : (
                            <>
                              <BiPlus className='inline mr-1' size={14} />
                              Mark as Available
                            </>
                          )}
                        </button>
                      )}
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
              </div>
              {isLoading ? (
                <p className='text-sm text-gray-500'>Loading availability...</p>
              ) : (
                <>
                  {/* Dates with slots */}
                  {availabilityMaps.hasSlotsMap.size > 0 && (
                    <div className='space-y-3'>
                      <p className='text-xs font-medium text-gray-600'>
                        With Slots:
                      </p>
                      {Array.from(availabilityMaps.hasSlotsMap.values()).map(
                        (availability, index) => (
                          <div
                            key={`with-slots-${index}`}
                            className='space-y-2 bg-white p-3 rounded-lg border-l-4 border-l-purple-500'>
                            <div className='flex justify-between items-center'>
                              <p className='text-sm font-medium text-gray-700'>
                                {formatDateForDisplay(availability.date)}
                              </p>
                              <button
                                onClick={async () => {
                                  try {
                                    await deleteTutorAvailability(
                                      availability.availabilityId
                                    ).unwrap();
                                    await refetchAvailabilities();
                                    toast.success(`Availability removed`);
                                  } catch (error) {
                                    toast.error(
                                      "Failed to delete availability"
                                    );
                                  }
                                }}
                                disabled={isDeleting}
                                className='text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600'>
                                <BiTrash size={12} />
                              </button>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              {availability.slots.map((slot) => (
                                <div
                                  key={slot.id}
                                  className='flex items-center gap-1'>
                                  <span
                                    className={`px-3 py-1 text-xs rounded-full ${
                                      slot.type === "ONE_TO_ONE"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                    }`}>
                                    {slot.startTimeLabel} - {slot.endTimeLabel}{" "}
                                    (
                                    {slot.type === "ONE_TO_ONE"
                                      ? "Single"
                                      : "Group"}
                                    ) - {slot.subject || "No Subject"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleDeleteTimeSlot(
                                        slot.id,
                                        `${slot.startTimeLabel} - ${slot.endTimeLabel}`
                                      )
                                    }
                                    disabled={isDeletingSlot}
                                    className='text-xs bg-red-500 text-white p-1 rounded-full hover:bg-red-600'>
                                    <BiTrash size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Dates without slots */}
                  {availabilityMaps.noSlotsMap.size > 0 && (
                    <div className='space-y-3'>
                      <p className='text-xs font-medium text-gray-600'>
                        Without Slots:
                      </p>
                      {Array.from(availabilityMaps.noSlotsMap.values()).map(
                        (availability, index) => (
                          <div
                            key={`no-slots-${index}`}
                            className='space-y-2 bg-white p-3 rounded-lg border-l-4 border-l-blue-300'>
                            <div className='flex justify-between items-center'>
                              <p className='text-sm font-medium text-gray-700'>
                                {formatDateForDisplay(availability.date)}
                              </p>
                              <div className='flex gap-1'>
                                <button
                                  onClick={() => {
                                    setSelectedDate(availability.date);
                                    setCurrentMonth(
                                      new Date(
                                        availability.date.getUTCFullYear(),
                                        availability.date.getUTCMonth()
                                      )
                                    );
                                    setShowSlotsDropdown(true);
                                  }}
                                  className='text-xs bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600'>
                                  <BiPlus size={12} />
                                </button>
                                <button
                                  onClick={async () => {
                                    try {
                                      await deleteTutorAvailability(
                                        availability.availabilityId
                                      ).unwrap();
                                      await refetchAvailabilities();
                                      toast.success(`Availability removed`);
                                    } catch (error) {
                                      console.log(error);
                                      toast.error(
                                        error?.data?.message ||
                                          "Failed to delete availability"
                                      );
                                    }
                                  }}
                                  disabled={isDeleting}
                                  className='text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600'>
                                  <BiTrash size={12} />
                                </button>
                              </div>
                            </div>
                            <p className='text-xs text-gray-500'>
                              No time slots added yet
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* No availability at all */}
                  {availabilityMaps.hasSlotsMap.size === 0 &&
                    availabilityMaps.noSlotsMap.size === 0 && (
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
                          disabled={isAddingDate}
                          className={`text-sm px-4 py-2 rounded-lg ${
                            isAddingDate
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white`}>
                          {isAddingDate ? (
                            "Adding..."
                          ) : (
                            <>
                              <BiPlus className='inline mr-1' size={16} />
                              Add Your First Availability
                            </>
                          )}
                        </button>
                      </div>
                    )}
                </>
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

              {/* Subject Dropdown */}
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

              {/* Slots Dropdown */}
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
                      <p className='text-xs text-gray-500 mb-2'>Morning</p>
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
                            {slot.time} ({slot.duration} hour
                            {slot.duration > 1 ? "s" : ""})
                          </span>
                          {selectedSlot === slot.id && (
                            <BiCheck size={18} className='text-purple-600' />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className='text-sm font-medium text-gray-500 mb-3'>
                      Afternoon/Evening
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
                            {slot.time} ({slot.duration} hours)
                          </span>
                          {selectedSlot === slot.id && (
                            <BiCheck size={18} className='text-purple-600' />
                          )}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleCreateSlot}
                      disabled={
                        isAddingSlot ||
                        !currentAvailabilityId ||
                        !selectedSlot ||
                        !selectedSubjectValue ||
                        !zoomLink
                      }
                      className={`w-full py-2 rounded-lg transition-colors ${
                        isAddingSlot ||
                        !currentAvailabilityId ||
                        !selectedSlot ||
                        !selectedSubjectValue ||
                        !zoomLink
                          ? "bg-gray-300 cursor-not-allowed text-gray-600"
                          : "bg-purple-400 hover:bg-purple-500 text-white"
                      }`}>
                      {isAddingSlot ? "Creating..." : "Create Slot"}
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
                  placeholder='https://zoom.us/j/123456789'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-600'
                />
                <p className='text-xs text-gray-500 mt-1'>
                  Enter a valid Zoom meeting URL
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex items-center justify-end gap-4'>
                <button
                  onClick={handleCreateSlot}
                  disabled={
                    isAddingSlot ||
                    !currentAvailabilityId ||
                    !selectedSlot ||
                    !selectedSubjectValue ||
                    !zoomLink
                  }
                  className='px-6 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors'>
                  {isAddingSlot ? "Creating..." : "Create Slot"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
