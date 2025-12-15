import React from "react";

const students = [
  {
    name: "Brandon White",
    email: "jasonw@gmail.com",
    platform: "Facebook",
  },
  {
    name: "Kim Gomez",
    email: "kaledo@exampla.com",
    platform: "LinkedIn",
  },
  {
    name: "Anil Hasan",
    email: "emily.jones@nyc.com",
    platform: "LinkedIn",
  },
  {
    name: "Liam Thompson",
    email: "michael.brown@outlook.com",
    platform: "LinkedIn",
  },
  {
    name: "Max Kapoor",
    email: "saadivryan1313@gmail.com",
    platform: "Facebook",
  },
  {
    name: "Jasmine Harlow",
    email: "saadivryan1313@gmail.com",
    platform: "Facebook",
  },
  {
    name: "Saad Rayhan",
    email: "saadrayhan1313@gmail.com",
    platform: "Instagram",
  },
  {
    name: "Ema Martinez",
    email: "saadrayhan1313@gmail.com",
    platform: "Instagram",
  },
];

const StudentListTable = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Students List
      </h2>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr className="text-left text-gray-600">
              <th className="p-3 w-[40%]">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Platform name</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 bg-white hover:bg-gray-50"
              >
                {/* Name */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                      {student.name.charAt(0)}
                    </div>
                    <span className="text-gray-800">
                      {student.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="p-3 text-gray-600">
                  {student.email}
                </td>

                {/* Platform */}
                <td className="p-3 text-gray-600">
                  {student.platform}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-center gap-2 mt-4 text-sm">
        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          Previous
        </button>

        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            className={`px-3 py-1 border rounded
              ${
                num === 1
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {num}
          </button>
        ))}

        <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-100">
          Next
        </button>
      </div> */}
    </div>
  );
};

export default StudentListTable;
