"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/feature/shared/AuthApi";
import { useGetParentRequestQuery, useMyParentsQuery } from "@/feature/student/StudentApi";
import Image from "next/image";
import { useState } from "react";

export default function ExamBoard() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [updateProfile, { isLoading, loading }] = useUpdateProfileMutation();
  const { data: myPofile } = useMyProfileQuery();
  const { data } = useGetParentRequestQuery();
  const { data: myParents } = useMyParentsQuery();
  
  console.log(myParents, `kmn aso abbara`);
  console.log(data, 'chole asca abbagolo');
  console.log(myPofile?.data?.user?.avatar, "my profile is here");

    const handleAcceptRequest = (requestId) => {
    console.log("Accepting request with ID:", requestId);
    // এখানে আপনার API call যোগ করুন
  };

  const handleRejectRequest = (requestId) => {
    console.log("Rejecting request with ID:", requestId);
    // এখানে আপনার API call যোগ করুন
  };
  
  const [selectedAvatar, setSelectedAvatar] = useState(
    myPofile?.data?.user?.avatar
  );
  
  const [formData, setFormData] = useState({
    firstName: myPofile?.data?.user?.firstName || "",
    lastName: myPofile?.data?.user?.lastName || "",
    email: myPofile?.data?.user?.email || "",
    bio: myPofile?.data?.user?.bio || "",
  });




  const avatarOptions = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
    "https://i.pravatar.cc/150?img=6",
    "https://i.pravatar.cc/150?img=7",
    "https://i.pravatar.cc/150?img=8",
  ];

  const handleAvatarSelect = async (avatar) => {
    setSelectedAvatar(avatar);
    const result = await updateProfile({
      avatar,
    });
    console.log(result, "avatar udpated");
    setShowAvatarSelector(false);
    console.log("Avatar saved:", avatar);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsEditing(false);
      const result = await updateProfile(formData);
      if (result.error) {
        console.log(result, "tomi amar result");
      }
      // toast.success("Profile Update Succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: myPofile?.data?.user?.firstName || "",
      lastName: myPofile?.data?.user?.lastName || "",
      email: myPofile?.data?.user?.email || "",
      bio: myPofile?.data?.user?.bio || "",
    });
  };



  return (
    <div className=''>
      <TitleSection className='bg-[#F7FFF5]' bg={"#F7FFF5"} title={"Profile"} />

      <div className='mx-auto p-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-semibold text-gray-800'>Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Basic Information Section */}
        <div className='mb-8'>
          <div className='flex items-start gap-6'>
            {/* Left Side - Avatar */}
            <div className='relative shrink-0'>
              <div className='relative'>
                <Image
                  width={64}
                  height={64}
                  src={
                    myPofile?.data?.user?.avatar ||
                    selectedAvatar ||
                    "https://i.pravatar.cc/150?img=9"
                  }
                  alt='Profile'
                  className='w-16 h-16 rounded-full object-cover'
                />
                <button
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className='absolute -top-2 -left-2 w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm'>
                  <span className='text-gray-600 text-xl leading-none'>+</span>
                </button>
              </div>

              {/* Avatar Selector Dropdown */}
              {showAvatarSelector && (
                <div className='absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10 w-64'>
                  <p className='text-sm font-medium text-gray-700 mb-2'>
                    Choose Avatar
                  </p>
                  <div className='grid grid-cols-4 gap-2'>
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarSelect(avatar)}
                        className='w-14 h-14 rounded-full overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all'>
                        <Image
                          width={56}
                          height={56}
                          src={avatar}
                          alt={`Avatar ${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Form */}
            <div className='flex-1'>
              <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
                Basic Information
              </h2>

              {/* Form Fields */}
              <div className='grid grid-cols-2 gap-6 mb-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    First Name
                  </label>
                  <input
                    type='text'
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
                  />
                </div>

                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={formData.email}
                    readOnly
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={true}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 cursor-not-allowed'
                  />
                </div>
                
                <div className='col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      handleInputChange("bio", e.target.value)
                    }
                    disabled={!isEditing}
                    rows="3"
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none'
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Buttons - Only show when editing */}
        {isEditing && (
          <div className='flex justify-end gap-3 mb-8'>
            <button
              onClick={handleCancel}
              className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'>
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Pending Parents Requests Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Parent Requests</h2>
            <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
              {data?.data?.requests?.length || 0} Pending
            </span>
          </div>
          
          {/* Pending Parents Table */}
          {(!data?.data?.requests || data?.data?.requests?.length === 0) ? (
            <div className="mt-4 p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 3.75a4.5 4.5 0 01-4.5 4.5m0-4.5a4.5 4.5 0 014.5 4.5" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Pending Requests</h3>
              <p className="text-gray-500">You don't have any pending parent requests at the moment.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Parent Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Request Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.requests?.map((request, index) => (
                    <tr 
                      key={request._id} 
                      className={`border-b border-[#CECECE] hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-purple-600 font-semibold text-sm">
                              {request.firstName?.[0]}{request.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{request.firstName} {request.lastName}</p>
                            <p className="text-xs text-gray-500">Parent</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">{request.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAcceptRequest(request._id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center shadow-sm hover:shadow"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request._id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200 flex items-center shadow-sm hover:shadow"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* My Parents Section */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">My Parents</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {myParents?.data?.parents?.length || 0} Connected
            </span>
          </div>
          
          {/* My Parents Table */}
          {(!myParents?.data?.parents || myParents?.data?.parents?.length === 0) ? (
            <div className="mt-4 p-8 bg-white border border-gray-200 rounded-xl shadow-sm text-center">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Parents Connected</h3>
              <p className="text-gray-500 mb-4">You haven't connected with any parents yet.</p>
              <p className="text-sm text-gray-400">Accept parent requests to connect with them here.</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F5F7FA]">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Parent Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email Address</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone Number</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Connection Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myParents?.data?.parents?.map((parent, index) => (
                    <tr 
                      key={parent._id} 
                      className={`border-b border-[#CECECE] hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 font-semibold text-sm">
                              {parent.firstName?.[0]}{parent.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{parent.firstName} {parent.lastName}</p>
                            <p className="text-xs text-gray-500">Guardian</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-600">{parent.email || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {parent.phone || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {parent.createdAt ? new Date(parent.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Connected
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}