"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/feature/shared/AuthApi";
import Image from "next/image";
import { useState } from "react";

export default function ExamBoard() {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [updateProfile, { isLoading, loading }] = useUpdateProfileMutation();
  const { data: myPofile } = useMyProfileQuery();
  console.log(myPofile?.data?.user?.avatar, "my profile is here");
  const [selectedAvatar, setSelectedAvatar] = useState(
    myPofile?.data?.user?.avatar
  );
  const [formData, setFormData] = useState({
    firstName: myPofile?.data?.user?.firstName,
    lastName: myPofile?.data?.user?.lastName,
    // email: myPofile?.data?.user?.email,
    bio: myPofile?.data?.user?.bio,
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

      toast.success("Profile Update Succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
                    defaultValue={myPofile?.data?.user?.firstName}
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
                    defaultValue={myPofile?.data?.user?.lastName}
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
                    defaultValue={myPofile?.data?.user?.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
                  />
                </div>
              </div>

              {/* Parents Info */}
            </div>
          </div>
        </div>

        {/* Buttons - Only show when editing */}
        {isEditing && (
          <div className='flex justify-end gap-3'>
            <button
              onClick={handleCancel}
              className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
