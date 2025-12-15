import React from "react";
import { TiArrowRight } from "react-icons/ti";

const tutors = [
  {
    name: "Saad Rayhan",
    email: "saadrayhan@gmail.com",
    platform: "Facebook",
    subjects: ["Science", "Math"],
  },
  {
    name: "Liam O'Neilly",
    email: "liamoneilly@queens.edu",
    platform: "LinkedIn",
    subjects: ["Math"],
  },
  {
    name: "Asha Patel",
    email: "emily.jones@nyc.com",
    platform: "LinkedIn",
    subjects: ["English", "Math"],
  },
  {
    name: "Maya Chen",
    email: "michael.brown@petco.com",
    platform: "LinkedIn",
    subjects: ["Math"],
  },
  {
    name: "Liam Peters",
    email: "saadivryan1313@gmail.com",
    platform: "Facebook",
    subjects: ["Science"],
  },
  {
    name: "Sofia Martinez",
    email: "sofia.martinez@gmail.com",
    platform: "Facebook",
    subjects: ["English"],
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh@gmail.com",
    platform: "Instagram",
    subjects: ["Math"],
  },
  {
    name: "Jordan Smith",
    email: "jordan@gmail.com",
    platform: "Instagram",
    subjects: ["Math"],
  },
];

const TutorTable = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-xl font-semibold text-gray-800">
          Tutor List
        </h2>

        <button className="text-sm border border-gray-300 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100">
          Filter by Subject
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr className="text-left text-gray-600">
              <th className="p-3 w-[40%]">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Platform name</th>
              <th className="p-3">Subject</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {tutors.map((tutor, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 bg-white hover:bg-gray-50"
              >
                {/* Name */}
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold">
                      {tutor.name.charAt(0)}
                    </div>
                    <span className="text-gray-800">
                      {tutor.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="p-3 text-gray-600">
                  {tutor.email}
                </td>

                {/* Platform */}
                <td className="p-3 text-gray-600">
                  {tutor.platform}
                </td>

                {/* Subject */}
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    {tutor.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-medium
                          ${
                            sub === "Science"
                              ? "bg-green-100 text-green-600"
                              : sub === "English"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Action */}
                <td className="p-3 text-right">
                  <button className="text-red-500 font-medium flex items-center justify-end gap-1 hover:underline">
                    Remove <TiArrowRight className="text-lg" />
                  </button>
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

export default TutorTable;
