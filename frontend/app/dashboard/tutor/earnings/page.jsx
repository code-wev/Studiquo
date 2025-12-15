import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { BiChevronRight, BiX } from "react-icons/bi";

const earnings = [
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  {
    date: "November 20, 2025",
    slot: 48,
    transactionId: "12:00 PM",
    bookingsnum: 236,
    platformfee: 20,
    deductionfee: 78,
  },
  
];

export default function Earnings() {
  return (
    <div className="bg-[#F7F7F7] m-4">
        <TitleSection bg={"#FFF8F7"} title={"Earnings"} />
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-600 w-[40%]">Date</div>
          <div className="text-sm font-medium text-gray-600">Slot</div>
          <div className="text-sm font-medium text-gray-600">Transaction ID</div>
          <div className="text-sm font-medium text-gray-600">No of Bookings</div>
          <div className="text-sm font-medium text-gray-600">Platform Fee</div>
          <div className="text-sm font-medium text-gray-600">Fees After Deduction</div>
        </div>

        {/* Table Body */}
        {earnings.map((classItem, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            {/* Subject */}
            <div className="text-sm font-semibold">
              {classItem.date}
            </div>

            {/* Time Slot */}
            <div className="text-sm text-gray-700">{classItem.slot}</div>
            {/* Transaction ID */}
            <div className="text-sm text-gray-700">{classItem.transactionId}</div>
            {/* No of Bookings */}
            <div className="text-sm text-gray-700">{classItem.bookingsnum}</div>
            {/* Platform Fee */}
            <div className="text-sm text-gray-700">{classItem.platformfee}</div>
            {/* Fees After Deduction */}
            <div className="text-sm text-gray-700">{classItem.deductionfee}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
