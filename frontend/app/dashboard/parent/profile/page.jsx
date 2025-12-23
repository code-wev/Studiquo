"use client";

import React, { useState } from 'react';
import { useMyProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '@/feature/shared/AuthApi';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { BiUpload, BiX } from 'react-icons/bi';

const Page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();
  const { data: myProfile, refetch } = useMyProfileQuery();
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  // Initialize profileData when myProfile data is available
  React.useEffect(() => {
    if (myProfile?.data?.user) {
      const userData = myProfile.data.user;
      
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        avatar: userData.avatar || '',
      });
    }
  }, [myProfile]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Upload to backend via PUT /users/me as multipart/form-data
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setUploading(true);
      const result = await updateProfile(formData);

      if (result.error) {
        toast.error('Failed to save avatar');
      } else {
        toast.success('Avatar updated successfully');
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error('Avatar update error:', error);
      toast.error('Failed to save avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const formData = new FormData();
      // send empty string to indicate removal
      formData.append('avatar', '');
      const result = await updateProfile(formData);

      if (result.error) {
        toast.error('Failed to remove avatar');
      } else {
        setProfileData((prev) => ({ ...prev, avatar: '' }));
        toast.success('Avatar removed successfully');
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error('Avatar remove error:', error);
      toast.error('Failed to remove avatar');
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      };

      const result = await updateProfile(updateData);

      if (result.error) {
        toast.error(result.error.data?.message || 'Update failed');
        console.error('Update error:', result.error);
      } else {
        toast.success('Profile Updated Successfully');
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('An error occurred while updating profile');
    }
  };

  const handlePasswordHandler = async () => {
    console.log('Old Password:', passwordData.oldPassword);
    console.log('New Password:', passwordData.newPassword);
    
    try {
      const payload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      console.log(payload, 'ki abosta ');

      const result = await changePassword(payload);

      if (result.error) {

        console.log(result.error, 'error re error');
        toast.error(result?.error?.data?.message);
        return;
      }
      
      toast.success('Password changed successfully');
      console.log(result, 'Password change successfully');

      // Reset the form
      setPasswordData({
        oldPassword: '',
        newPassword: ''
      });
    } catch (error) {

      console.log(error, 'error sab');
      toast.error('Something went wrong! Please try again later!');
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (myProfile?.data?.user) {
      const userData = myProfile.data.user;
      
      setProfileData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        avatar: userData.avatar || '',
      });
    }
    setIsEditing(false);
  };

  // Default avatar if none is set
  const defaultAvatar = 'https://i.pravatar.cc/150?img=45';
  const displayAvatar = profileData.avatar || defaultAvatar;

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className=' mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-semibold text-gray-800'>Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'>
              Edit Profile
            </button>
          ) : (
            <div className='flex gap-3'>
              <button
                onClick={handleCancel}
                className='px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'>
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className='px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-purple-300'>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Profile Information Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Profile Information</h2>
          
          <div className='flex flex-col md:flex-row items-start gap-8'>
            {/* Avatar Section */}
            <div className='relative shrink-0'>
              <div className='relative group'>
                <Image
                  width={96}
                  height={96}
                  src={displayAvatar}
                  alt='Profile'
                  className='w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg'
                />

                {/* Upload Overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <label
                    htmlFor='avatar-upload'
                    className='cursor-pointer p-2 bg-white rounded-full hover:bg-gray-100 transition-colors'>
                    <BiUpload size={24} className='text-gray-700' />
                    <input
                      id='avatar-upload'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Remove Avatar Button */}
                {profileData.avatar && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg'>
                    <BiX size={18} />
                  </button>
                )}
              </div>

              {/* Uploading Indicator */}
              {uploading && (
                <div className='absolute inset-0 bg-white bg-opacity-80 rounded-full flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
                </div>
              )}

              <div className='mt-4 text-center'>
                <label
                  htmlFor='avatar-upload'
                  className='text-sm text-purple-600 hover:text-purple-700 cursor-pointer font-medium'>
                  {uploading ? 'Uploading...' : 'Change photo'}
                </label>
                <p className='text-xs text-gray-500 mt-1'>JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className='flex-1 grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* First Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  First Name
                </label>
                <input
                  type='text'
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
                />
              </div>

              {/* Last Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Last Name
                </label>
                <input
                  type='text'
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
                />
              </div>

              {/* Email (Read-only) */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  readOnly
                  value={profileData.email}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600'
                />
                <p className='mt-1 text-sm text-gray-500'>
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Change Password</h2>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Old Password
              </label>
              <input
                type='password'
                value={passwordData.oldPassword}
                onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                placeholder='Enter your old password'
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                New Password
              </label>
              <input
                type='password'
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
                placeholder='Enter your new password'
              />
            </div>
          </div>
          
          <div className='mt-6 flex justify-end'>
            <button
              onClick={handlePasswordHandler}
              disabled={passwordLoading || (!passwordData.oldPassword || !passwordData.newPassword)}
              className='px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed'
            >
              {passwordLoading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
          
          <div className='mt-4 text-sm text-gray-500'>
            <p className='mb-2'>• Password must be at least 8 characters long</p>
            <p className='mb-2'>• Include both uppercase and lowercase letters</p>
            <p>• Include at least one number or special character</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;