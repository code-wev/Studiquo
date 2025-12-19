"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useChildrenSearchQuery } from "@/feature/parent/ParentApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BiCheckCircle,
  BiChevronRight,
  BiInfoCircle,
  BiLink,
  BiLoaderAlt,
  BiPlusCircle,
  BiSearch,
  BiTrash,
  BiUserCircle,
} from "react-icons/bi";

// Mock data for connected students
const initialConnectedStudents = [
  {
    id: "693e905a0f1dc63069f38f90",
    firstName: "Yvonne",
    lastName: "Cochran",
    email: "juki@mailinator.com",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "10th Grade",
    subjects: ["Math", "Science"],
    connectionDate: "2024-01-15",
    status: "active",
  },
  {
    id: "693f7de7b56a565911362cf2",
    firstName: "Rowan",
    lastName: "Larson",
    email: "seha@mailinator.com",
    avatar: "https://i.pravatar.cc/150?img=5",
    grade: "11th Grade",
    subjects: ["English", "History"],
    connectionDate: "2024-02-20",
    status: "active",
  },
];

const ParentProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connectedStudents, setConnectedStudents] = useState(
    initialConnectedStudents
  );
  const [foundStudents, setFoundStudents] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isConnecting, setIsConnecting] = useState({});

  // Use the search query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    refetch,
  } = useChildrenSearchQuery(
    searchTerm,
    { skip: !searchTerm || searchTerm.length < 2 } // Don't search if less than 2 characters
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      setShowSearchResults(true);
      // Trigger search via refetch
      refetch();
    } else {
      setShowSearchResults(false);
      setFoundStudents([]);
    }
  };

  // Update found students when search data changes
  useEffect(() => {
    if (searchData?.data?.results) {
      // Filter out already connected students
      const connectedIds = new Set(connectedStudents.map((s) => s.id));
      const filteredResults = searchData.data.results.filter(
        (student) => !connectedIds.has(student._id)
      );

      // Format results with avatars and additional info
      const formattedResults = filteredResults.map((student, index) => ({
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        studentId: student.studentId,
        avatar: student.avatar,
      }));

      setFoundStudents(formattedResults);
    }
  }, [searchData, connectedStudents]);

  const handleConnectStudent = (student) => {
    setIsConnecting((prev) => ({ ...prev, [student.id]: true }));

    // Simulate API call delay
    setTimeout(() => {
      const newStudent = {
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        avatar: student.avatar,
        subjects: getRandomSubjects(),
        connectionDate: new Date().toISOString().split("T")[0],
        status: "pending",
      };

      setConnectedStudents([newStudent, ...connectedStudents]);

      // Remove from found students
      setFoundStudents(foundStudents.filter((s) => s.id !== student.id));

      setIsConnecting((prev) => ({ ...prev, [student.id]: false }));

      alert(
        `Connection request sent to ${student.firstName} ${student.lastName}`
      );
    }, 1000);
  };

  const getRandomSubjects = () => {
    const subjects = [
      "Math",
      "Science",
      "English",
      "History",
      "Physics",
      "Computer Science",
      "Biology",
      "Chemistry",
    ];
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 subjects
    const shuffled = [...subjects].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleRemoveConnection = (studentId) => {
    if (confirm("Are you sure you want to remove this connection?")) {
      setConnectedStudents(
        connectedStudents.filter((student) => student.id !== studentId)
      );
    }
  };

  const handleAcceptConnection = (studentId) => {
    setConnectedStudents(
      connectedStudents.map((student) =>
        student.id === studentId ? { ...student, status: "active" } : student
      )
    );
  };

  const handleViewProfile = (studentId) => {
    // Navigate to student profile page
    alert(`Viewing profile of student ID: ${studentId}`);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <TitleSection bg={"#FFFFFF"} title={"Parent Dashboard"} />

        <div className='grid grid-cols-1 gap-8 mt-6'>
          {/* Left Column: Connect Student & Stats */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Connect Student Section */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Connect with Student
                </h2>
                <BiLink className='text-2xl text-purple-600' />
              </div>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Search by Name, Email, or Student ID
                  </label>
                  <div className='relative'>
                    <BiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                    <input
                      type='text'
                      value={searchTerm}
                      onChange={handleSearchChange}
                      placeholder='Type at least 2 characters to search...'
                      className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                    />
                    {isSearchLoading && (
                      <BiLoaderAlt className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin' />
                    )}
                  </div>
                  {searchTerm.length === 1 && (
                    <p className='text-xs text-gray-500 mt-2 ml-1'>
                      Type at least 2 characters to search
                    </p>
                  )}
                </div>

                {/* Search Results */}
                {showSearchResults && (
                  <div className='mt-4'>
                    <div className='flex items-center justify-between mb-3'>
                      <h3 className='font-semibold text-gray-700'>
                        Search Results{" "}
                        {foundStudents.length > 0 &&
                          `(${foundStudents.length})`}
                      </h3>
                      {foundStudents.length > 0 && (
                        <span className='text-sm text-gray-500'>
                          Found {foundStudents.length} student(s)
                        </span>
                      )}
                    </div>

                    {isSearchLoading ? (
                      <div className='flex items-center justify-center py-8'>
                        <BiLoaderAlt className='animate-spin text-purple-600 text-2xl' />
                        <span className='ml-2 text-gray-600'>
                          Searching students...
                        </span>
                      </div>
                    ) : foundStudents.length > 0 ? (
                      <div className='space-y-3 max-h-80 overflow-y-auto pr-2'>
                        {foundStudents.map((student) => (
                          <div
                            key={student.id}
                            className='p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 bg-white'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                <Image
                                  width={48}
                                  height={48}
                                  src={student.avatar}
                                  alt={`${student.firstName} ${student.lastName}`}
                                  className='w-12 h-12 rounded-full object-cover border-2 border-white shadow'
                                />
                                <div>
                                  <h4 className='font-semibold text-gray-800'>
                                    {student.firstName} {student.lastName}
                                  </h4>
                                  <p className='text-sm text-gray-600'>
                                    {student.email}
                                  </p>
                                  <div className='flex items-center gap-2 mt-1'>
                                    <span className='px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full'>
                                      {student.grade}
                                    </span>
                                    {student.studentId && (
                                      <span className='px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full'>
                                        ID: {student.studentId}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleConnectStudent(student)}
                                disabled={isConnecting[student.id]}
                                className='px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50'>
                                {isConnecting[student.id] ? (
                                  <>
                                    <BiLoaderAlt className='animate-spin' />
                                    Connecting...
                                  </>
                                ) : (
                                  <>
                                    <BiPlusCircle size={18} />
                                    Connect
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchTerm.length >= 2 ? (
                      <div className='text-center py-8 border border-dashed border-gray-300 rounded-xl'>
                        <BiUserCircle className='text-4xl text-gray-400 mx-auto mb-2' />
                        <p className='text-gray-600'>No students found</p>
                        <p className='text-sm text-gray-500 mt-1'>
                          Try searching with a different name or email
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {/* No Search Results Info */}
                {!showSearchResults && !isSearchLoading && (
                  <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100'>
                    <div className='flex items-center gap-3'>
                      <BiInfoCircle className='text-blue-500 text-xl' />
                      <div>
                        <p className='text-sm text-gray-700 font-medium'>
                          How to connect with students
                        </p>
                        <p className='text-xs text-gray-600 mt-1'>
                          Search by student name, email, or ID to find and
                          connect with them
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Students List */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Connected Students ({connectedStudents.length})
                </h2>
                <div className='flex items-center gap-3'>
                  <span className='px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium'>
                    {
                      connectedStudents.filter((s) => s.status === "active")
                        .length
                    }{" "}
                    Active
                  </span>
                  <span className='px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium'>
                    {
                      connectedStudents.filter((s) => s.status === "pending")
                        .length
                    }{" "}
                    Pending
                  </span>
                </div>
              </div>

              {connectedStudents.length > 0 ? (
                <div className='space-y-4'>
                  {connectedStudents.map((student) => (
                    <div
                      key={student.id}
                      className='p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300 bg-white'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <div className='relative'>
                            <Image
                              width={60}
                              height={60}
                              src={student.avatar}
                              alt={`${student.firstName} ${student.lastName}`}
                              className='w-14 h-14 rounded-full object-cover'
                            />
                            {student.status === "active" && (
                              <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white' />
                            )}
                          </div>
                          <div>
                            <div className='flex items-center gap-2'>
                              <h3 className='font-bold text-gray-800'>
                                {student.firstName} {student.lastName}
                              </h3>
                              {student.status === "pending" && (
                                <span className='px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full'>
                                  Pending
                                </span>
                              )}
                            </div>
                            <p className='text-sm text-gray-600'>
                              {student.email}
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                              <span className='text-xs text-gray-500'>
                                {student.grade}
                              </span>
                              <span className='text-xs text-gray-400'>•</span>
                              <span className='text-xs text-gray-500'>
                                Connected: {student.connectionDate}
                              </span>
                            </div>
                            <div className='flex gap-1 mt-2'>
                              {student.subjects.map((subject, index) => (
                                <span
                                  key={index}
                                  className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'>
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className='flex items-center gap-2'>
                          {student.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleAcceptConnection(student.id)
                                }
                                className='p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors'
                                title='Accept Connection'>
                                <BiCheckCircle size={24} />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveConnection(student.id)
                                }
                                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                title='Remove Connection'>
                                <BiTrash size={20} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleViewProfile(student.id)}
                                className='px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2'>
                                View Profile
                                <BiChevronRight />
                              </button>
                              <button
                                onClick={() =>
                                  handleRemoveConnection(student.id)
                                }
                                className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                                title='Remove Connection'>
                                <BiTrash size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-12'>
                  <BiUserCircle className='text-5xl text-gray-400 mx-auto mb-4' />
                  <p className='text-gray-600 text-lg mb-2'>
                    No connected students yet
                  </p>
                  <p className='text-gray-500 text-sm'>
                    Use the search above to find and connect with students
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfilePage;
