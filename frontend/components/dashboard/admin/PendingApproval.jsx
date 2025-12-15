import React from 'react';
import { TiArrowRight } from "react-icons/ti";

const pendingRequests = [
  {
    name: "Saad Rayhan",
    email: "saadrayhan@gmail.com",
    subject: "Science",
    btnColor: "bg-blue-500 hover:bg-blue-600",
  },
  {
    name: "Liam O'Neilly",
    email: "liamoneilly@queens.edu",
    subject: "English",
    btnColor: "bg-green-500 hover:bg-green-600",
  },
  {
    name: "Asha Patel",
    email: "emily.jones@nyc.com",
    subject: "Math",
    btnColor: "bg-red-500 hover:bg-red-600",
  },
  {
    name: "Maya Chen",
    email: "michael.brown@petco.com",
    subject: "Math",
    btnColor: "bg-orange-500 hover:bg-orange-600",
  },
  {
    name: "Liam Peters",
    email: "saadivryan1313@gmail.com",
    subject: "Biology",
    btnColor: "bg-blue-500 hover:bg-blue-600",
  },
];

const PendingApproval = () => {
  return (
    <div className="container p-4 mx-auto sm:p-4 dark:text-gray-800">
      <h2 className="mb-4 text-2xl leading-tight">Pending Approval</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-full  border border-[#CECECE]  text-sm table-auto">
          <thead className="bg-gray-100  border-b border-[#CECECE]">
            <tr className="text-left">
              <th className="p-3 text-gray-600">Name</th>
              <th className="p-3 text-gray-600">Email</th>
              <th className="p-3 text-gray-600">Subject</th>
              <th className="p-3 text-gray-600 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingRequests.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#CECECE] border-opacity-20 bg-white"
              >
                <td className="p-3">
                  <p className="text-gray-800">{item.name}</p>
                </td>

                <td className="p-3">
                  <p>{item.email}</p>
                </td>

                <td className="p-3 text-gray-500">{item.subject}</td>

                <td className="p-3 text-right">
                  <button
                    className={`text-[#28A745] cursor-pointer font-semibold`}
                  >
      <div className='flex items-center justify-between gap-2'>

             <span> Approve Request</span>

           <span> <TiArrowRight className='text-2xl'/></span>
      </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
          Previous
        </button>
        <button className="bg-gray-200 text-gray-600 px-3 py-1 rounded-md hover:bg-gray-300">
          Next
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
