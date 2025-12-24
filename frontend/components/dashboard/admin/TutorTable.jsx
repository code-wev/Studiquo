import { useActiveUserMutation, useGetTutorQuery, useSuspendUserMutation } from "@/feature/shared/TutorApi";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TiArrowRight } from "react-icons/ti";

const TutorTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(12);
  
  const { data: tutorData, isLoading, isError } = useGetTutorQuery({
    page: currentPage,
    limit: limit
  });

  const [ suspendUser] = useSuspendUserMutation();
  const [ activeUser] =  useActiveUserMutation();

  
  // Handle suspend/active action
  const handleTutorAction = async(tutorId, isApproved) => {
    console.log("Tutor ID:", tutorId);
    console.log("Current status (isApproved):", isApproved);
    
    if (isApproved) {
      // Show confirmation for suspend
      if (window.confirm("Are you sure you want to suspend this tutor?")) {
        console.log(`Suspending tutor with ID: ${tutorId}`);
        const result = await suspendUser(tutorId);

        if(result.error){

          toast.error(result?.error?.data?.message)

          return
                  }
        console.log(result, 'suspned done');
        toast.success("User Suspend Successfully")
      }
    } else {
      // Show confirmation for activate
      if (window.confirm("Are you sure you want to activate this tutor?")) {
        console.log(`Activating tutor with ID: ${tutorId}`);
        const result = await activeUser(tutorId);
        console.log(result);
        if(result.error){

          toast.error(result?.error?.data?.message)

          return
                  }

        toast.success('User active successfully')
        // Here you would typically make an API call to activate the tutor
      }
    }
  };
  
  // Format subjects array for display
  const formatSubjects = (subjects) => {
    return subjects.map(sub => 
      sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase()
    );
  };
  
  // Extract data from response
  const tutors = tutorData?.data?.data || [];
  const paginationInfo = tutorData?.data?.meta || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12
  };
  
  // Calculate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = paginationInfo.totalPages;
    const current = currentPage;
    
    if (totalPages <= 5) {
      // Show all pages if total pages is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
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
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading tutor data. Please try again.
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">

      <Toaster/>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Tutor List
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total {paginationInfo.total} tutors found
          </p>
        </div>

        <button className="text-sm border border-gray-300 px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
          Filter by Subject
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-300">
            <tr className="text-left text-gray-700">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Hourly Rate</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Subject</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {tutors.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No tutors found
                </td>
              </tr>
            ) : (
              tutors.map((tutor, index) => (
                <tr
                  key={tutor._id}
                  className="border-b border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  {/* Name */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {tutor.user?.firstName?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <span className="text-gray-800 font-medium">
                          {tutor.user?.firstName} {tutor.user?.lastName}
                        </span>
                        <p className="text-xs text-gray-500">Tutor ID: {tutor._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-4 text-gray-600">
                    {tutor.user?.email || 'N/A'}
                  </td>

                  {/* Hourly Rate */}
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        ${tutor.oneOnOneHourlyRate}
                      </span>
                      <span className="text-xs text-gray-500">
                        One-on-One
                      </span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 font-medium">
                          {tutor.averageRating || '0.0'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({tutor.ratingCount} reviews)
                      </span>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="p-4">
                    <div className="flex gap-2 flex-wrap max-w-[200px]">
                      {formatSubjects(tutor.subjects || []).map((sub, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium
                            ${
                              sub.toLowerCase() === "science"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : sub.toLowerCase() === "english"
                                ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                : "bg-blue-100 text-blue-700 border border-blue-200"
                            }`}
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      tutor.isApproved 
                        ? "bg-green-100 text-green-700 border border-green-200" 
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}>
                      {tutor.isApproved ? 'Active' : 'Suspended'}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleTutorAction(tutor._id, tutor.isApproved)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                          ${tutor.isApproved 
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
                            : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-200"
                          }`}
                      >
                        {tutor.isApproved ? 'Suspend' : 'Activate'}
                        <TiArrowRight className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationInfo.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, paginationInfo.total)} of {paginationInfo.total} tutors
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                ${currentPage === 1 
                  ? "text-gray-400 border-gray-300 cursor-not-allowed" 
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' ? setCurrentPage(pageNum) : null}
                  className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                    ${pageNum === currentPage
                      ? "bg-blue-500 text-white"
                      : typeof pageNum === 'number'
                      ? "text-gray-700 border border-gray-300 hover:bg-gray-50"
                      : "text-gray-500 cursor-default"
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
              className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                ${currentPage === paginationInfo.totalPages
                  ? "text-gray-400 border-gray-300 cursor-not-allowed"
                  : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
            >
              Next
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Show:</span>
            <select 
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorTable;