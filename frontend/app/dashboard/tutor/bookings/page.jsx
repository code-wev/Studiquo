"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useGetTutorBookingsQuery } from "@/feature/student/BookingApi";
import { useEffect, useState } from "react";
import { BiChevronRight, BiMessageRounded, BiX } from "react-icons/bi";

export default function Bookings() {
  const { data: apiData, isLoading, error } = useGetTutorBookingsQuery();
  const [bookingData, setBookingData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [currentStudentsList, setCurrentStudentsList] = useState([]);

  // Process API data when loaded
  useEffect(() => {
    if (apiData?.data) {
      setBookingData(apiData.data);

      // Set selected date to first booking date
      if (apiData.data.bookings.length > 0) {
        const firstBooking = apiData.data.bookings[0];
        setSelectedDate(firstBooking);

        // Set first time slot as default
        if (firstBooking.timeSlots && firstBooking.timeSlots.length > 0) {
          setSelectedSlot(firstBooking.timeSlots[0]);
        }
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
      // Reset selected slot when changing date
      if (bookingForDate.timeSlots && bookingForDate.timeSlots.length > 0) {
        setSelectedSlot(bookingForDate.timeSlots[0]);
      } else {
        setSelectedSlot(null);
      }
    }
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  const handleViewStudents = (slot) => {
    if (slot?.bookings && slot.bookings.length > 0) {
      // Get all students from all bookings in this slot
      const allStudents = slot.bookings.flatMap((booking) => {
        if (booking.studentsList && booking.studentsList.length > 0) {
          return booking.studentsList.map((student) => ({
            ...student,
            bookingSubject: booking.subject,
            bookingType: booking.type,
            bookingStatus: booking.status,
            parentsNames: Array.isArray(student.parents)
              ? student.parents.join(", ")
              : student.parents,
          }));
        }
        return [];
      });
      setCurrentStudentsList(allStudents);
      setShowStudentsModal(true);
    }
  };

  const handleJoinChat = (student) => {
    console.log("Join chat with student:", student);
    // Implement chat functionality here
    alert(`Opening chat with ${student.studentName}`);
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

      <div className='w-full mx-auto bg-[#F7F7F7] shadow-sm grid grid-cols-1 lg:grid-cols-4 gap-8 p-8'>
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className='lg:col-span-2'>
          {/* Calendar Header */}
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

          {/* Time Slots List */}
          {selectedDate &&
            selectedDate.timeSlots &&
            selectedDate.timeSlots.length > 0 && (
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                  <h3 className='text-sm font-medium text-gray-600'>
                    Time Slots for {selectedDate.dateString}
                  </h3>
                </div>
                <div className='max-h-96 overflow-y-auto'>
                  {selectedDate.timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(slot)}
                      className={`
                      px-6 py-4 border-b border-gray-100 last:border-b-0 
                      transition-colors cursor-pointer hover:bg-gray-50
                      ${
                        selectedSlot?.slotId === slot.slotId
                          ? "bg-purple-50"
                          : ""
                      }
                    `}>
                      <div className='flex justify-between items-center'>
                        <div>
                          <p className='text-sm font-semibold text-gray-900'>
                            {slot.subject} - {slot.type}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {slot.totalStudentsInSlot} student(s) in{" "}
                            {slot.slotBookingsCount} booking(s)
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewStudents(slot);
                          }}
                          className='px-3 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors'>
                          View Students
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

              {selectedSlot ? (
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
                  {/* Slot Details Header */}
                  <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
                    <div className='flex justify-between items-center'>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {selectedSlot.subject} - {selectedSlot.type}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {formatTime(selectedSlot.startTime)} -{" "}
                          {formatTime(selectedSlot.endTime)}
                        </p>
                      </div>
                      {selectedSlot.meetLink && (
                        <button
                          onClick={() => handleJoinClass(selectedSlot.meetLink)}
                          className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors'>
                          <BiChevronRight size={18} />
                          Join Class
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className='max-h-96 overflow-y-auto'>
                    {selectedSlot.bookings &&
                    selectedSlot.bookings.length > 0 ? (
                      selectedSlot.bookings.map((booking, index) => (
                        <div
                          key={booking._id || index}
                          className='px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50'>
                          <div className='flex justify-between items-start mb-3'>
                            <div>
                              <p className='text-sm font-semibold text-gray-900'>
                                Booking #{index + 1}
                              </p>
                              <div className='flex items-center gap-2 mt-1'>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    booking.status === "SCHEDULED"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "COMPLETED"
                                      ? "bg-blue-100 text-blue-800"
                                      : booking.status === "PENDING"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}>
                                  {booking.status}
                                </span>
                                <span className='text-xs text-gray-500'>
                                  Created:{" "}
                                  {new Date(
                                    booking.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            {booking.status === "SCHEDULED" && (
                              <button
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
                            )}
                          </div>

                          {/* Students in this booking */}
                          <div className='mt-3'>
                            <p className='text-xs font-medium text-gray-500 mb-2'>
                              Students ({booking.studentsCount || 0})
                            </p>
                            {booking.studentsList &&
                            booking.studentsList.length > 0 ? (
                              <div className='space-y-2'>
                                {booking.studentsList.map(
                                  (student, studentIndex) => (
                                    <div
                                      key={studentIndex}
                                      className='flex items-center justify-between p-2 bg-gray-50 rounded'>
                                      <div>
                                        <p className='text-sm font-medium text-gray-900'>
                                          {student.studentName}
                                        </p>
                                        <p className='text-xs text-gray-500'>
                                          ID: {student.studentId}
                                        </p>
                                        <p className='text-xs text-gray-500 mt-1'>
                                          Parents:{" "}
                                          {Array.isArray(student.parents)
                                            ? student.parents.join(", ")
                                            : student.parents}{" "}
                                          | Exam:{" "}
                                          {student.examBoard || "Not specified"}
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => handleJoinChat(student)}
                                        className='flex items-center gap-1 px-3 py-1 text-xs font-medium text-green-600 bg-green-50 rounded hover:bg-green-100 transition-colors'>
                                        <BiMessageRounded size={14} />
                                        Chat
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className='text-xs text-gray-500 italic'>
                                No students in this booking
                              </p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='px-6 py-8 text-center text-gray-500'>
                        No bookings in this time slot
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500'>
                  {selectedDate
                    ? "Select a time slot to view details"
                    : "Select a date with bookings to view classes"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      {bookingData && bookingData.stats && (
        <div className='mx-auto'>
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
        </div>
      )}

      {/* Students List Modal */}
      {showStudentsModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl w-full max-h-[80vh] overflow-hidden'>
            <div className='px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Students List
                <span className='ml-2 text-sm font-normal text-gray-500'>
                  ({currentStudentsList.length} students)
                </span>
              </h3>
              <button
                onClick={() => setShowStudentsModal(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'>
                <BiX size={24} />
              </button>
            </div>

            <div className='overflow-y-auto max-h-[60vh]'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50 sticky top-0'>
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
                      Status
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {currentStudentsList.map((student, index) => (
                    <tr
                      key={`${student.studentId}-${index}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='text-sm font-medium text-gray-900'>
                          {student.studentId}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <span className='text-sm text-gray-900'>
                            {student.studentName}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='text-sm text-gray-900'>
                          {student.parentsNames ||
                            (Array.isArray(student.parents)
                              ? student.parents.join(", ")
                              : student.parents)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`text-sm px-2 py-1 rounded-full ${
                            !student.examBoard ||
                            student.examBoard === "Not specified"
                              ? "text-gray-600 bg-gray-100"
                              : "text-blue-600 bg-blue-100"
                          }`}>
                          {student.examBoard || "Not specified"}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            student.bookingStatus === "SCHEDULED"
                              ? "bg-green-100 text-green-800"
                              : student.bookingStatus === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {student.bookingStatus}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleJoinChat(student)}
                            className='inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-800 bg-green-100 hover:bg-green-200 transition-colors'>
                            <BiMessageRounded className='mr-1' />
                            Chat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center'>
              <div>
                <p className='text-sm text-gray-700'>
                  Showing{" "}
                  <span className='font-medium'>
                    {currentStudentsList.length}
                  </span>{" "}
                  students
                </p>
              </div>
              <button
                onClick={() => setShowStudentsModal(false)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors'>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
