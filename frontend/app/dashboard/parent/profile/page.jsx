"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useAddMyChildMutation,
  useChildrenSearchQuery,
  useGetMyChildrenQuery,
} from "@/feature/parent/ParentApi";
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
  BiCheckCircle,
  BiXCircle,
  BiEnvelope,
  BiIdCard,
  BiCalendar,
} from "react-icons/bi";

const ParentProfilePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundStudents, setFoundStudents] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [addMyChild, { isLoading: isAddingChild }] = useAddMyChildMutation();
  const { data: childrenData, refetch: refetchChildren } =
    useGetMyChildrenQuery();

  console.log(childrenData, "children data");

  const handleConnect = async (id) => {
    try {
      console.log(id);
      const result = await addMyChild(id);
      toast.success(result?.data?.message || "Connection request sent!");
      console.log(result, "connection result");

      // Refetch children list after successful connection
      refetchChildren();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

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
      console.log(searchData?.data?.results, "search results");
      setFoundStudents(searchData.data.results);
    }
  }, [searchData]);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto">
        <TitleSection bg="#FFFFFF" title="Parent Dashboard" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column - Stats and Search */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {childrenData?.data?.counts?.total || 0}
                    </h3>
                    <p className="text-blue-100">Total Children</p>
                  </div>
                  <BiUserCircle className="text-3xl opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {childrenData?.data?.counts?.connected || 0}
                    </h3>
                    <p className="text-emerald-100">Connected</p>
                  </div>
                  <BiCheckCircle className="text-3xl opacity-80" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {childrenData?.data?.counts?.pending || 0}
                    </h3>
                    <p className="text-amber-100">Pending</p>
                  </div>
                  <BiInfoCircle className="text-3xl opacity-80" />
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Connect with Student
                </h2>
                <BiLink className="text-2xl text-purple-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Name, Email, or Student ID
                </label>

                <div className="relative">
                  <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Type at least 2 characters to search..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {isSearchLoading && (
                    <BiLoaderAlt className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                  )}
                </div>
              </div>

              {/* Search Results */}
              {showSearchResults && (
                <div className="mt-6">
                  {isSearchLoading ? (
                    <div className="flex justify-center py-8">
                      <BiLoaderAlt className="animate-spin text-2xl text-purple-600" />
                    </div>
                  ) : foundStudents.length > 0 ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                      {foundStudents.map((student) => (
                        <div
                          key={student._id}
                          className="p-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Image
                                  src={student.avatar || "/default-avatar.png"}
                                  alt={student.firstName}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <BiCheckCircle className="w-4 h-4 text-white" />
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">
                                  {student.firstName} {student.lastName}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <BiEnvelope className="w-3 h-3 text-gray-400" />
                                  <p className="text-sm text-gray-600">
                                    {student.email}
                                  </p>
                                </div>
                                {student.studentId && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <BiIdCard className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs text-gray-500">
                                      {student.studentId}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => handleConnect(student?._id)}
                              disabled={isAddingChild}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg flex items-center gap-2 hover:from-purple-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingChild ? (
                                <BiLoaderAlt className="animate-spin" />
                              ) : (
                                <BiPlusCircle />
                              )}
                              {isAddingChild ? "Connecting..." : "Connect"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                      <BiUserCircle className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">No students found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try searching with different terms
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!showSearchResults && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <div className="flex gap-3">
                    <BiInfoCircle className="text-blue-500 text-xl flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        How to connect with students?
                      </p>
                      <p className="text-xs text-gray-600">
                        Search by student name, email, or ID. Once found, click
                        "Connect" to send a connection request. The student will
                        need to accept your request from their profile.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - My Children Table */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  My Children
                </h2>
                <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                  {childrenData?.data?.counts?.connected || 0}
                </div>
              </div>

              {!childrenData?.data?.children ||
              childrenData?.data?.children?.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <BiUserCircle className="text-4xl text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">
                    No children connected
                  </p>
                  <p className="text-sm text-gray-500">
                    Search and connect with students to see them here
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {childrenData?.data?.children?.map((child) => (
                    <div
                      key={child._id}
                      className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Image
                          src={child.avatar || "/default-avatar.png"}
                          alt={child.firstName}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="sm:flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-800 truncate">
                                {child.firstName} {child.lastName}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                <BiEnvelope className="w-3 h-3 text-gray-400" />
                                <p className="text-xs text-gray-500 truncate">
                                  {child.email}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 inline-flex items-center text-xs leading-5 mt-2 font-semibold rounded-full
                                ${
                                  child?.status === "PENDING"
                                    ? "bg-yellow-500 text-white"
                                    : "bg-green-100 text-green-800"
                                }`}
                            >
                              <BiCheckCircle className="w-3 h-3 mr-1" />
                              {child?.status}
                            </span>
                          </div>

                          {child.studentId && (
                            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <BiIdCard className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Student ID:
                                  </span>
                                </div>
                                <code className="text-xs bg-white px-2 py-1 rounded border">
                                  {child.studentId}
                                </code>
                              </div>
                            </div>
                          )}

                          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <BiCalendar className="w-3 h-3" />
                              <span>
                                Connected:{" "}
                                {formatDate(child.createdAt || new Date())}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Summary Footer */}
              {childrenData?.data?.children &&
                childrenData.data.children.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-600">Connected</p>
                        <p className="text-lg font-bold text-green-600">
                          {childrenData.data.counts?.connected || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-bold text-blue-600">
                          {childrenData.data.counts?.total || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Connected Children Table - Large View */}
        {childrenData?.data?.children &&
          childrenData.data.children.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Connected Children Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete list of your connected children
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    Total: {childrenData.data.children.length}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-l-xl">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Connection Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-r-xl">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {childrenData.data.children.map((child, index) => (
                      <tr
                        key={child._id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="relative">
                              <Image
                                src={child.avatar || "/default-avatar.png"}
                                alt={child.firstName}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                              />
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                <BiCheckCircle className="w-2 h-2 text-white" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {child.firstName} {child.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiEnvelope className="w-4 h-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {child.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiIdCard className="w-4 h-4 text-gray-400 mr-2" />
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-800">
                              {child.studentId || "N/A"}
                            </code>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BiCalendar className="w-4 h-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">
                              {formatDate(child.createdAt || new Date())}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full
                              ${
                                child?.status === "PENDING"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-green-100 text-green-800"
                              }`}
                          >
                            <BiCheckCircle className="w-3 h-3 mr-1" />
                            {child?.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ParentProfilePage;
