'use client'

import { useAllStudentQuery } from "@/feature/admin/adminApi";
import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiUser, FiMail } from "react-icons/fi";

const StudentListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentsData, setStudentsData] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  const { data, isLoading, isError, refetch } = useAllStudentQuery({
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage
  });

  // Update data when API response changes
  useEffect(() => {
    if (data?.success && data?.data?.results) {
      setStudentsData(data.data.results);
      // Extract pagination info from response
      const meta = data.data.meta || {
        page: currentPage,
        totalPages: Math.ceil(data.data.results.length / itemsPerPage),
        total: data.data.results.length,
        limit: itemsPerPage
      };
      setPaginationInfo(meta);
    }
  }, [data, currentPage, itemsPerPage]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setCurrentPage(1);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Format platform name based on email domain or other criteria
  const getPlatformName = (email) => {
    if (email.includes('gmail.com')) return 'Gmail';
    if (email.includes('yahoo.com')) return 'Yahoo';
    if (email.includes('outlook.com') || email.includes('hotmail.com')) return 'Outlook';
    if (email.includes('mailinator.com')) return 'Mailinator';
    return 'Other';
  };

  // Calculate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = paginationInfo.totalPages;
    const current = currentPage;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (current <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (current >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          Error loading student data. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-gray-800">
            Students List
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total {paginationInfo.total} students • Page {currentPage} of {paginationInfo.totalPages}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full"
            />
          </div>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Show:</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Students</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">
                {paginationInfo.total}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <FiUser className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-purple-600 font-medium">Current Page</p>
              <p className="text-2xl font-bold text-purple-800 mt-2">
                {currentPage} / {paginationInfo.totalPages}
              </p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-purple-600 font-bold">📄</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-green-600 font-medium">Results Shown</p>
              <p className="text-2xl font-bold text-green-800 mt-2">
                {studentsData.length}
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <FiMail className="text-green-600" size={20} />
            </div>
          </div>
        </div>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr className="text-left text-gray-700">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Student ID</th>
              <th className="p-4 font-medium">Platform</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {studentsData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">👨‍🎓</div>
                    <p className="text-lg font-medium">No students found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm ? "Try changing your search criteria" : "No student records available"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              studentsData.map((student, index) => (
                <tr
                  key={student._id || index}
                  className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {student.avatar ? (
                        <img 
                          src={student.avatar} 
                          alt={student.firstName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {student.firstName?.charAt(0) || 'S'}
                        </div>
                      )}
                      <div>
                        <span className="text-gray-800 font-medium">
                          {student.firstName} {student.lastName}
                        </span>
                        {/* <p className="text-xs text-gray-500">
                          ID: {student._id?.slice(-6) || 'N/A'}
                        </p> */}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMail className="text-gray-400" size={16} />
                      <span className="truncate max-w-[200px]">
                        {student.email}
                      </span>
                    </div>
                  </td>

                  {/* Student ID */}
                  <td className="p-4">
                    <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                      {student.studentId || 'Not Assigned'}
                    </span>
                  </td>

                  {/* Platform */}
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      getPlatformName(student.email) === 'Gmail'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : getPlatformName(student.email) === 'Yahoo'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : getPlatformName(student.email) === 'Outlook'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                      {getPlatformName(student.email)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                      Active
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationInfo.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, paginationInfo.total)} of {paginationInfo.total} students
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiChevronLeft size={20} />
            </button>
            
            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' ? setCurrentPage(pageNum) : null}
                  className={`min-w-[40px] h-10 flex items-center justify-center rounded-md text-sm font-medium border transition-colors ${
                    pageNum === currentPage
                      ? "bg-purple-500 text-white border-purple-500"
                      : typeof pageNum === 'number'
                      ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                      : "text-gray-500 border-transparent cursor-default"
                  }`}
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationInfo.totalPages))}
              disabled={currentPage === paginationInfo.totalPages}
              className={`p-2 rounded-md border ${
                currentPage === paginationInfo.totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListTable;