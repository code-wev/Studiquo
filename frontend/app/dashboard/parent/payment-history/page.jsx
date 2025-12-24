"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useGetMyChildrenBookingsQuery,
  useMakePaymentMutation,
} from "@/feature/student/BookingApi";

import { useState } from "react";

const getSubjectColor = (subject) => {
  switch (subject?.toUpperCase()) {
    case "SCIENCE":
      return "bg-green-100 text-green-700";
    case "MATH":
    case "MATHEMATICS":
      return "bg-red-100 text-red-700";
    case "ENGLISH":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};

const getSubjectName = (subject) => {
  switch (subject?.toUpperCase()) {
    case "SCIENCE":
      return "Science";
    case "MATH":
    case "MATHEMATICS":
      return "Math";
    case "ENGLISH":
      return "English";
    default:
      return subject || "Unknown";
  }
};

const getStatusBadge = (status) => {
  switch (status?.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "SCHEDULED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "COMPLETED":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function PaymentHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: paymentsData, isLoading } = useGetMyChildrenBookingsQuery({
    page: currentPage,
    limit: 10,
  });

  const [createPayment, { isLoading: isPaymentLoading }] =
    useMakePaymentMutation();

  console.log("Bookings Data:", paymentsData);

  const bookings = paymentsData?.data?.bookings || [];
  const total = paymentsData?.data?.total || 0;
  const page = paymentsData?.data?.page || 1;
  const limit = paymentsData?.data?.limit || 10;
  const totalPages = Math.ceil(total / limit);

  const handlePayBill = async (bookingId, studentId) => {
    try {
      const paymentData = {
        bookingId,
        studentId: studentId,
      };

      const result = await createPayment(paymentData).unwrap();

      console.log("Payment API Response:", result);

      if (result?.success) {
        console.log("Payment link created successfully:", result.data?.checkoutUrl);

        window.location.href = result.data?.checkoutUrl
        alert(`Payment initiated! Check console for details.`);

        // If there's a payment URL, you could redirect to it
        if (result.data?.paymentUrl) {
          console.log("Redirecting to payment URL:", result.data.paymentUrl);
          // window.location.href = result.data.paymentUrl;
        }
      } else {
        console.error("Payment failed:", result?.message);
        alert(`Payment failed: ${result?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      console.error("Error details:", {
        data: error?.data,
        status: error?.status,
        message: error?.message,
      });
      alert(
        `Payment error: ${
          error?.data?.message || error?.message || "Something went wrong"
        }`
      );
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return (
      <div className='bg-white min-h-screen'>
        <TitleSection
          className='bg-[#F7FFF5]'
          bg={"#F7FFF5"}
          title={"Payments"}
        />
        <div className='mx-auto p-8'>
          <div className='mb-6'>
            <h1 className='text-3xl font-semibold text-gray-800'>Payments</h1>
          </div>
          <div className='animate-pulse'>
            <div className='h-12 bg-gray-200 rounded mb-4'></div>
            <div className='space-y-4'>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className='h-16 bg-gray-100 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen'>
      <TitleSection
        className='bg-[#F7FFF5]'
        bg={"#F7FFF5"}
        title={"Payments"}
      />

      <div className='mx-auto p-8'>
        {/* Header */}
        <div className='mb-6 flex justify-between items-center'>
          <h1 className='text-3xl font-semibold text-gray-800'>Payments</h1>
          <div className='text-sm text-gray-600'>
            Showing {bookings.length} of {total} bookings
          </div>
        </div>

        {/* Table */}
        <div className='border border-gray-300 rounded-lg overflow-hidden'>
          <table className='min-w-full table-fixed'>
            <thead className='bg-gray-50 border-b border-gray-300'>
              <tr>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[25%]'>
                  Booking ID
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[10%]'>
                  Status
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Subject
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Type
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Price
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[20%]'>
                  Time Slot
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking, index) => {
                  return (
                    <tr
                      key={booking.bookingId}
                      className={`border-b border-gray-200 text-sm ${
                        index === bookings.length - 1 ? "border-b-0" : ""
                      }`}>
                      <td className='p-4'>
                        <div className='flex flex-col gap-1'>
                          <span className='text-gray-800 font-mono text-xs'>
                            {booking.bookingId || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusBadge(
                            booking.status
                          )}`}>
                          {booking.status || "Unknown"}
                        </span>
                      </td>
                      <td className='p-4'>
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-medium ${getSubjectColor(
                            booking.subject
                          )}`}>
                          {getSubjectName(booking.subject)}
                        </span>
                      </td>
                      <td className='p-4 text-gray-800'>
                        <span
                          className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                            booking.type === "ONE_TO_ONE"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}>
                          {booking.type === "ONE_TO_ONE" ? "1:1" : "Group"}
                        </span>
                      </td>
                      <td className='p-4'>
                        <div className='flex flex-col gap-1'>
                          <span className='text-gray-800 font-mono text-xs'>
                            £{booking.price?.toFixed(2) || "N/A"}
                          </span>
                        </div>
                      </td>

                      <td className='p-4'>
                        {booking.slot ? (
                          <div className='space-y-1'>
                            <div className='text-gray-800'>
                              {booking.slot.startTime} - {booking.slot.endTime}
                            </div>
                            <div className='text-xs text-blue-600 truncate max-w-[200px]'>
                              {booking.slot.meetLink ||
                                "Meet link available after payment"}
                            </div>
                          </div>
                        ) : (
                          <span className='text-gray-500'>No time slot</span>
                        )}
                      </td>
                      <td className='p-4'>
                        {booking.status?.toUpperCase() === "PENDING" ? (
                          <button
                            onClick={() =>
                              handlePayBill(
                                booking.bookingId,
                                booking.studentId
                              )
                            }
                            disabled={isPaymentLoading}
                            className={`text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-1 rounded hover:bg-blue-50 transition-colors ${
                              isPaymentLoading
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}>
                            {isPaymentLoading ? "Processing..." : "Pay Bill"}
                          </button>
                        ) : booking.status?.toUpperCase() === "SCHEDULED" ? (
                          <button
                            onClick={() => {
                              console.log(
                                "Scheduled booking details:",
                                booking
                              );
                              alert(
                                `Booking ${booking.bookingId} is already scheduled and paid.`
                              );
                            }}
                            className='text-green-600 hover:text-green-700 font-medium text-sm px-3 py-1 rounded hover:bg-green-50 transition-colors cursor-pointer'>
                          Paid
                          </button>
                        ) : (
                          <span className='text-gray-500 text-sm'>
                            {booking.status?.charAt(0).toUpperCase() +
                              booking.status?.slice(1).toLowerCase()}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className='p-8 text-center text-gray-500'>
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-between items-center mt-6'>
            <div className='text-sm text-gray-600'>
              Page {page} of {totalPages}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                }`}>
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300 cursor-pointer"
                }`}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
