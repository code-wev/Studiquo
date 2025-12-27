"use client";

import {
  useGetSubjectsQuery,
  useGetTutorQuery,
} from "@/feature/shared/TutorApi";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaArrowRight, FaStar } from "react-icons/fa";

const FindTutorPage = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12;

  // Use debounced search to avoid too many API calls
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetSearch = useCallback(
    debounce((value) => setDebouncedSearch(value), 500),
    []
  );

  // Update debounced search when search changes
  useEffect(() => {
    debouncedSetSearch(search);
    return () => debouncedSetSearch.cancel();
  }, [search, debouncedSetSearch]);

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: limit,
    search: debouncedSearch,
    minHourlyRate: priceRange[0],
    maxHourlyRate: priceRange[1],
    subject: subject || undefined,
  };

  const { data: tutorData, isLoading, isError } = useGetTutorQuery(queryParams);
  const { data: subjectsData } = useGetSubjectsQuery();

  const tutors = tutorData?.data?.tutors || [];
  const meta = tutorData?.data?.meta;
  const subjects = subjectsData?.data || [];

  console.log(tutors);

  // Calculate total pages
  const totalPages = meta?.totalPages || 1;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle price range change
  const handlePriceRangeChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle subject change
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setSubject("");
    setPriceRange([0, 1000]);
    setCurrentPage(1);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className='bg-[#EDE7FB3D] min-h-screen'>
        <div className='max-w-7xl mx-auto p-6'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-semibold'>Meet Our Tutors</h1>
            <p className='text-gray-500'>Loading tutors...</p>
          </div>
          <div className='flex justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section className='bg-[#EDE7FB3D] min-h-screen'>
        <div className='max-w-7xl mx-auto p-6'>
          <div className='text-center mb-6'>
            <h1 className='text-2xl font-semibold'>Meet Our Tutors</h1>
            <p className='text-gray-500 text-red-600'>
              Error loading tutors. Please try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='bg-[#EDE7FB3D] min-h-screen'>
      <div className='max-w-7xl mx-auto p-6'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-semibold'>Meet Our Tutors</h1>
          <p className='text-gray-500'>
            Find the perfect tutor for your learning journey
          </p>
        </div>

        {/* Filters & Content */}
        <div className='md:flex justify-between gap-12'>
          {/* Left Sidebar - Filters */}
          <section className='md:w-1/4'>
            <div className='w-full bg-white p-4 rounded-md sticky top-6'>
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold text-lg'>Filters</h3>
                <button
                  onClick={resetFilters}
                  className='text-purple-600 font-bold hover:underline text-sm'>
                  Clear Everything
                </button>
              </div>

              {/* Price Range Filter */}
              <div className='mb-6 mt-8'>
                <label className='font-bold text-lg block mb-2'>
                  Price Range
                </label>
                <div className='flex justify-between mt-2 text-sm mb-1'>
                  <span>£{priceRange[0]}</span>
                  <span>£{priceRange[1]}</span>
                </div>
                <input
                  type='range'
                  min={0}
                  max={1000}
                  value={priceRange[1]}
                  onChange={handlePriceRangeChange}
                  className='w-full h-2 bg-[#CCB7F8] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#3A0E95]'
                />
                <div className='text-xs text-gray-500 text-center mt-1'>
                  Up to £{priceRange[1]}/hour
                </div>
              </div>

              {/* Subject Filter */}
              <div className='mb-6'>
                <label className='font-bold text-lg block mb-2'>Subject</label>
                <select
                  value={subject}
                  onChange={handleSubjectChange}
                  className='w-full border border-[#D8DCE1] rounded p-2 bg-white'>
                  <option value=''>All Subjects</option>
                  {subjects.map((subjectItem) => (
                    <option key={subjectItem._id} value={subjectItem.name}>
                      {subjectItem.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className='mt-8 p-3 bg-purple-50 rounded-lg'>
                <p className='text-sm text-gray-600'>
                  Showing {tutors.length} of {meta?.total || 0} tutors
                </p>
                <button
                  onClick={() => setCurrentPage(1)}
                  className='w-full mt-3 bg-[#CCB7F8] font-semibold text-[#3A0E95] py-2 px-4 rounded transition hover:bg-[#BBA5E9]'>
                  Apply Filters
                </button>
              </div>
            </div>
          </section>

          {/* Right Content */}
          <section className='md:w-3/4'>
            {/* Search & Sort Bar */}
            <div className='flex flex-col md:flex-row gap-6 mb-6'>
              <div className='flex-1 bg-white p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center'>
                <div className='flex flex-1 border border-[#D8DCE1] rounded p-2 items-center'>
                  <AiOutlineSearch className='text-gray-400 mr-2' />
                  <input
                    type='text'
                    placeholder='Search by name...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 outline-none'
                  />
                </div>
                <select
                  value={subject}
                  onChange={handleSubjectChange}
                  className='border border-[#D8DCE1] rounded p-2 w-full md:w-auto'>
                  <option value=''>All Subjects</option>
                  {subjects.map((subjectItemy) => (
                    <option key={subjectItem._id} value={subjectItem.name}>
                      {subjectItem.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tutor Cards */}
            {tutors.length === 0 ? (
              <div className='bg-white rounded-lg p-8 text-center'>
                <h3 className='text-xl font-semibold mb-2'>No tutors found</h3>
                <p className='text-gray-500'>
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={resetFilters}
                  className='mt-4 text-purple-600 font-semibold hover:underline'>
                  Reset all filters
                </button>
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
                  {tutors.map((tutor) => (
                    <div
                      key={tutor._id}
                      className='bg-white rounded-lg p-4 flex flex-col h-full hover:shadow-lg transition-shadow duration-300'>
                      <div className='flex justify-between gap-3 mb-2'>
                        <div className='flex-1'>
                          <h4 className='font-semibold text-lg'>
                            {tutor?.firstName} {tutor?.lastName}
                          </h4>
                          <p className='text-gray-500 text-sm mb-2'>
                            {tutor.subjects?.map((s, index) => (
                              <span key={index}>
                                {s}
                                {index !== tutor.subjects.length - 1 && ", "}
                              </span>
                            ))}
                          </p>
                        </div>

                        <Image
                          src={tutor?.avatar || "/default-avatar.png"}
                          alt={tutor?.firstName}
                          width={300}
                          height={300}
                          className='w-12 h-12 rounded-full object-cover border-2 border-purple-100'
                        />
                      </div>

                      <p className='text-[#666666] leading-loose mb-4 mt-2 line-clamp-4 flex-grow'>
                        {tutor?.user?.bio || "No bio available"}
                      </p>

                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center gap-1'>
                          <FaStar className='text-[#F78D25]' />
                          <span className='font-medium'>
                            {tutor.averageRating
                              ? tutor.averageRating.toFixed(1)
                              : "New"}
                          </span>
                          <span className='text-gray-500 text-sm'>
                            ({tutor.ratingCount || 0} ratings)
                          </span>
                        </div>
                        <p className='font-semibold text-xl text-purple-700'>
                          £{tutor?.groupHourlyRate} - £
                          {tutor?.oneOnOneHourlyRate}
                          /hour
                        </p>
                      </div>

                      <Link
                        href={`/find-tutor/${tutor?.user?._id}`}
                        className='mt-auto'>
                        <button className='w-full cursor-pointer flex items-center justify-center gap-2 bg-[#CCB7F8] hover:bg-[#BBA5E9] py-3 px-6 rounded text-[#3A0E95] font-semibold transition-colors duration-300'>
                          <span>Book Now</span>
                          <FaArrowRight className='text-lg' />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='flex justify-center items-center gap-2 mt-8'>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "text-purple-600 border-purple-300 hover:bg-purple-50"
                      }`}>
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-lg ${
                            currentPage === pageNum
                              ? "bg-[#3A0E95] text-white"
                              : "border border-purple-300 text-purple-600 hover:bg-purple-50"
                          }`}>
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg border ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-300 cursor-not-allowed"
                          : "text-purple-600 border-purple-300 hover:bg-purple-50"
                      }`}>
                      Next
                    </button>

                    <span className='text-gray-600 text-sm ml-4'>
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </section>
  );
};

export default FindTutorPage;
