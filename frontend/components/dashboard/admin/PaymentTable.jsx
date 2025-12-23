const payments = [
  {
    date: "November 10, 2025",
    transactionId: "**** **** **** 1234",
    tutor: "Saed Rehman",
    subject: "Science",
    bookings: 12,
    platformFee: "20%",
    totalFee: "$100",
  },
  {
    date: "December 12, 2025",
    transactionId: "**** **** **** 1200",
    tutor: "Tariq Mazuki",
    subject: "Math",
    bookings: 9,
    platformFee: "25%",
    totalFee: "$100",
  },
  {
    date: "November 30, 2025",
    transactionId: "**** **** **** 9935",
    tutor: "Sadia Serni",
    subject: "English",
    bookings: 9,
    platformFee: "20%",
    totalFee: "$100",
  },
  {
    date: "February 3, 2026",
    transactionId: "**** **** **** 7452",
    tutor: "John Doe",
    subject: "Math",
    bookings: 10,
    platformFee: "25%",
    totalFee: "$100",
  },
  {
    date: "January 10, 2026",
    transactionId: "**** **** **** 7891",
    tutor: "Sara L.",
    subject: "English",
    bookings: 10,
    platformFee: "20%",
    totalFee: "$100",
  },
];

const PaymentTable = () => {
  return (
    <div className='p-6 mx-auto border-[#dde2eb] w-full rounded-2xl'>
      <table className='w-full border rounded-2xl'>
        <thead>
          <tr className='bg-[#F5F7FA]'>
            <th className='px-4 py-2 text-left text-sm font-semibold w-[40%]'>
              Date
            </th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>
              Transaction ID
            </th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>Tutor</th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>
              Subject
            </th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>
              No. of Bookings
            </th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>
              Platform Fee
            </th>
            <th className='px-4 py-2 text-left text-sm font-semibold'>
              Total Fee
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={index} className={`rounded border-b border-[#CECECE]`}>
              <td className='px-4 py-2 text-sm'>{payment.date}</td>
              <td className='px-4 py-2 text-sm'>{payment.transactionId}</td>
              <td className='px-4 py-2 text-sm'>{payment.tutor}</td>
              <td className='px-4 py-2 text-sm'>{payment.subject}</td>
              <td className='px-4 py-2 text-sm'>{payment.bookings}</td>
              <td className='px-4 py-2 text-sm'>{payment.platformFee}</td>
              <td className='px-4 py-2 text-sm'>{payment.totalFee}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="mt-4 flex justify-center space-x-2">
                <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700">Previous</button>
                <span className="px-4 py-2 text-sm font-medium">1</span>
                <span className="px-4 py-2 text-sm font-medium">2</span>
                <span className="px-4 py-2 text-sm font-medium">3</span>
                <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700">Next</button>
            </div> */}
    </div>
  );
};

export default PaymentTable;
