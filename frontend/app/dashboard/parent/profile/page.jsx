"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import { useAddMyChildMutation, useChildrenSearchQuery } from "@/feature/parent/ParentApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BiInfoCircle,
  BiLink,
  BiLoaderAlt,
  BiPlusCircle,
  BiSearch,
  BiUserCircle,
} from "react-icons/bi";

const ParentProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundStudents, setFoundStudents] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [ addMyChild, {isLoadin}] =  useAddMyChildMutation();



  const handleConnect = async(id)=>{
    try {

      console.log(id);
      const result = await addMyChild(id);
      toast.success(result?.data?.message)
      console.log(result, "gase re gase");


      
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!')
    }
  }


  const {
    data: searchData,
    isLoading: isSearchLoading,
    refetch,
  } = useChildrenSearchQuery(searchTerm, {
    skip: !searchTerm || searchTerm.length < 2,
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setFoundStudents([]);
    }
  };

  // Call refetch when searchTerm becomes long enough. Guard against calling
  // refetch when the query is skipped or not initialized yet.
  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2 && typeof refetch === "function") {
      try {
        refetch();
      } catch (err) {
        console.warn("refetch not available yet", err);
      }
    }
  }, [searchTerm, refetch]);

  useEffect(() => {
    if (searchData?.data?.results) {

      console.log(searchData?.data?.results, "ay re aayyyy");
      setFoundStudents(searchData.data.results);
    }
  }, [searchData]);

  return (
    <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
      <div className='max-w-7xl mx-auto'>
        <TitleSection bg='#FFFFFF' title='Parent Dashboard' />

        <div className='grid grid-cols-1 gap-8 mt-6'>
          <div className='space-y-8'>
            {/* Search Section */}
            <div className='bg-white rounded-2xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-800'>
                  Connect with Student
                </h2>
                <BiLink className='text-2xl text-purple-600' />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Search by Name, Email, or Student ID
                </label>

                <div className='relative'>
                  <BiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder='Type at least 2 characters to search...'
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
                  />
                  {isSearchLoading && (
                    <BiLoaderAlt className='absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400' />
                  )}
                </div>
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <div className='mt-6'>
                  {isSearchLoading ? (
                    <div className='flex justify-center py-8'>
                      <BiLoaderAlt className='animate-spin text-2xl text-purple-600' />
                    </div>
                  ) : foundStudents.length > 0 ? (
                    <div className='space-y-3 max-h-80 overflow-y-auto'>
                      {foundStudents.map((student) => (
                        <div
                          key={student._id}
                          className='p-4 border border-gray-200 rounded-xl bg-white'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <Image
                                src={student.avatar || "/default-avatar.png"}
                                alt={student.firstName}
                                width={48}
                                height={48}
                                className='w-12 h-12 rounded-full object-cover'
                              />
                              <div>
                                <h4 className='font-semibold text-gray-800'>
                                  {student.firstName} {student.lastName}
                                </h4>
                                <p className='text-sm text-gray-600'>
                                  {student.email}
                                </p>

                                {student.studentId && (
                                  <p className='text-xs text-gray-500 mt-1'>
                                    ID: {student.studentId}
                                  </p>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() =>  handleConnect(student?._id)}
                              className='px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2'>
                              <BiPlusCircle />
                              Connect
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='text-center py-8 border border-dashed rounded-xl'>
                      <BiUserCircle className='text-4xl text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-600'>No students found</p>
                    </div>
                  )}
                </div>
              )}

              {!showSearchResults && (
                <div className='mt-6 p-4 bg-blue-50 rounded-xl border'>
                  <div className='flex gap-3'>
                    <BiInfoCircle className='text-blue-500 text-xl' />
                    <p className='text-sm text-gray-700'>
                      Search by student name, email, or ID to connect.
                    </p>
                  </div>
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
