"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useGetMyChildrenBookingsQuery } from "@/feature/student/BookingApi";
import Image from "next/image";

const payments = [
  {
    id: 1,
    name: "Saad Rayhan",
    avatar: "https://i.pravatar.cc/150?img=1",
    date: "November 20, 2025",
    timeSlot: "12:00 - 2:00",
    subject: "Science",
    subjectColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    name: "Tamim Makbul",
    avatar: "https://i.pravatar.cc/150?img=2",
    date: "December 15, 2025",
    timeSlot: "12:00 - 2:00",
    subject: "Math",
    subjectColor: "bg-red-100 text-red-700",
  },
  {
    id: 3,
    name: "Sadia Semi",
    avatar: "https://i.pravatar.cc/150?img=3",
    date: "November 20, 2025",
    timeSlot: "12:00 - 2:00",
    subject: "English",
    subjectColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 4,
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?img=4",
    date: "February 8, 2026",
    timeSlot: "12:00 - 2:00",
    subject: "Math",
    subjectColor: "bg-red-100 text-red-700",
  },
  {
    id: 5,
    name: "Sarah L",
    avatar: "https://i.pravatar.cc/150?img=5",
    date: "January 10, 2026",
    timeSlot: "12:00 - 2:00",
    subject: "English",
    subjectColor: "bg-yellow-100 text-yellow-700",
  },
];

export default function PaymentHistory() {
  const { data: paymentsData, isLoading } = useGetMyChildrenBookingsQuery();

  console.log(paymentsData);

  return (
    <div className='bg-white min-h-screen'>
      <TitleSection
        className='bg-[#F7FFF5]'
        bg={"#F7FFF5"}
        title={"Payments"}
      />

      <div className='mx-auto p-8'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-3xl font-semibold text-gray-800'>Payments</h1>
        </div>

        {/* Table */}
        <div className='border border-gray-300 rounded-lg overflow-hidden'>
          <table className='min-w-full table-fixed'>
            <thead className='bg-gray-50 border-b border-gray-300'>
              <tr>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[40%]'>
                  Tutor
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Date
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Time Slot
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Subject
                </th>
                <th className='text-left p-4 text-sm font-medium text-gray-600 w-[15%]'>
                  Bookings new
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`border-b border-gray-200 text-sm ${
                    index === payments.length - 1 ? "border-b-0" : ""
                  }`}>
                  <td className='p-4'>
                    <div className='flex items-center gap-3'>
                      <Image
                        width={32}
                        height={32}
                        src={payment.avatar}
                        alt={payment.name}
                        className='w-8 h-8 rounded-full object-cover'
                      />
                      <span className='text-gray-800'>{payment.name}</span>
                    </div>
                  </td>
                  <td className='p-4 text-gray-800'>{payment.date}</td>
                  <td className='p-4 text-gray-800'>{payment.timeSlot}</td>
                  <td className='p-4'>
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-medium ${payment.subjectColor}`}>
                      {payment.subject}
                    </span>
                  </td>
                  <td className='p-4'>
                    <button className='text-blue-600 hover:text-blue-700 font-medium text-sm'>
                      Pay Bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className='flex justify-between mt-4'>
          <button className='bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300'>
            Previous
          </button>
          <button className='bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
