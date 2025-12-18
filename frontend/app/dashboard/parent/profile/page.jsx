"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  BiSearch, 
  BiPlusCircle, 
  BiCheckCircle, 
  BiXCircle,
  BiUserCircle,
  BiChevronRight,
  BiLink,
  BiTrash
} from "react-icons/bi";
import TitleSection from "@/components/dashboard/shared/TitleSection";

// Mock data for connected students
const initialConnectedStudents = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@student.com",
    grade: "10th Grade",
    avatar: "https://i.pravatar.cc/150?img=1",
    subjects: ["Math", "Science"],
    connectionDate: "2024-01-15",
    status: "active"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@student.com",
    grade: "11th Grade",
    avatar: "https://i.pravatar.cc/150?img=5",
    subjects: ["English", "History"],
    connectionDate: "2024-02-20",
    status: "active"
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.c@student.com",
    grade: "9th Grade",
    avatar: "https://i.pravatar.cc/150?img=8",
    subjects: ["Math", "Physics"],
    connectionDate: "2024-03-05",
    status: "pending"
  }
];

const ParentProfilePage = () => {
  const [searchId, setSearchId] = useState("");
  const [connectedStudents, setConnectedStudents] = useState(initialConnectedStudents);
  const [foundStudent, setFoundStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConnectForm, setShowConnectForm] = useState(false);

  // Mock function to find student by ID
  const handleSearchStudent = () => {
    if (!searchId.trim()) {
      alert("Please enter a student ID");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock student data
      const mockStudent = {
        id: searchId,
        name: "Alex Johnson",
        email: "alex.j@student.com",
        grade: "12th Grade",
        avatar: "https://i.pravatar.cc/150?img=12",
        subjects: ["Computer Science", "Math"],
        school: "City High School"
      };
      
      setFoundStudent(mockStudent);
      setIsLoading(false);
      setShowConnectForm(true);
    }, 1000);
  };

  const handleConnectStudent = () => {
    if (!foundStudent) return;

    const newStudent = {
      ...foundStudent,
      connectionDate: new Date().toISOString().split('T')[0],
      status: "pending"
    };

    setConnectedStudents([newStudent, ...connectedStudents]);
    setFoundStudent(null);
    setSearchId("");
    setShowConnectForm(false);
    
    alert(`Connection request sent to ${foundStudent.name}`);
  };

  const handleRemoveConnection = (studentId) => {
    if (confirm("Are you sure you want to remove this connection?")) {
      setConnectedStudents(connectedStudents.filter(student => student.id !== studentId));
    }
  };

  const handleAcceptConnection = (studentId) => {
    setConnectedStudents(connectedStudents.map(student => 
      student.id === studentId ? { ...student, status: "active" } : student
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <TitleSection bg={"#FFFFFF"} title={"Parent Dashboard"} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Left Column: Connect Student & Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Connect Student Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Connect with Student</h2>
                <BiLink className="text-2xl text-purple-600" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Student ID
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="e.g., STU-2024-001"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleSearchStudent}
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Searching..."
                      ) : (
                        <>
                          <BiSearch size={20} />
                          Search
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Found Student Preview */}
                {foundStudent && showConnectForm && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          width={60}
                          height={60}
                          src={foundStudent.avatar}
                          alt={foundStudent.name}
                          className="w-15 h-15 rounded-full border-4 border-white shadow"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{foundStudent.name}</h3>
                          <p className="text-sm text-gray-600">{foundStudent.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {foundStudent.grade}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              {foundStudent.school}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleConnectStudent}
                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2"
                      >
                        <BiPlusCircle size={20} />
                        Connect
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connected Students List */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Connected Students ({connectedStudents.length})
                </h2>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  {connectedStudents.filter(s => s.status === 'active').length} Active
                </span>
              </div>

              <div className="space-y-4">
                {connectedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Image
                            width={60}
                            height={60}
                            src={student.avatar}
                            alt={student.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                          {student.status === 'active' && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-800">{student.name}</h3>
                            {student.status === 'pending' && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{student.grade}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              Connected: {student.connectionDate}
                            </span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {student.subjects.map((subject, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {student.status === 'pending' ? (
                          <button
                            onClick={() => handleAcceptConnection(student.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accept Connection"
                          >
                            <BiCheckCircle size={24} />
                          </button>
                        ) : (
                          <button
                            onClick={() => {/* View student profile */}}
                            className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2"
                          >
                            View Profile
                            <BiChevronRight />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveConnection(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove Connection"
                        >
                          <BiTrash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Quick Actions */}
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Connection Overview</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div>
                    <p className="text-sm opacity-90">Total Connected</p>
                    <p className="text-3xl font-bold">{connectedStudents.length}</p>
                  </div>
                  <BiUserCircle className="text-3xl opacity-80" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div>
                    <p className="text-sm opacity-90">Active Students</p>
                    <p className="text-3xl font-bold">
                      {connectedStudents.filter(s => s.status === 'active').length}
                    </p>
                  </div>
                  <BiCheckCircle className="text-3xl opacity-80" />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div>
                    <p className="text-sm opacity-90">Pending Requests</p>
                    <p className="text-3xl font-bold">
                      {connectedStudents.filter(s => s.status === 'pending').length}
                    </p>
                  </div>
                  <BiPlusCircle className="text-3xl opacity-80" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => setShowConnectForm(true)}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:from-purple-100 hover:to-indigo-100 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BiPlusCircle className="text-purple-600" size={24} />
                    </div>
                    <span className="font-medium text-gray-800">Add New Student</span>
                  </div>
                  <BiChevronRight className="text-gray-400 group-hover:text-purple-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BiUserCircle className="text-blue-600" size={24} />
                    </div>
                    <span className="font-medium text-gray-800">View All Students</span>
                  </div>
                  <BiChevronRight className="text-gray-400 group-hover:text-blue-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BiLink className="text-green-600" size={24} />
                    </div>
                    <span className="font-medium text-gray-800">Connection History</span>
                  </div>
                  <BiChevronRight className="text-gray-400 group-hover:text-green-600" />
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Need Help?</h3>
              <p className="text-sm opacity-90 mb-4">
                Having trouble connecting with a student? Check our guide or contact support.
              </p>
              <button className="w-full py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors font-medium">
                Get Help
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {connectedStudents.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center mt-8">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BiUserCircle className="text-5xl text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No Students Connected Yet
              </h3>
              <p className="text-gray-600 mb-8">
                Start by connecting with your first student using their unique ID. 
                Once connected, you'll be able to track their progress and access their profile.
              </p>
              <button
                onClick={() => setShowConnectForm(true)}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center gap-2"
              >
                <BiPlusCircle size={20} />
                Connect Your First Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProfilePage;