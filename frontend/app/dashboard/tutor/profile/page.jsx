"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/feature/shared/AuthApi";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiUpload, BiX } from "react-icons/bi";

const TutorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { data: myPofile, refetch } = useMyProfileQuery();
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subjects: [],
    bio: "",
    hourlyRate: "",
    avatar: "",
  });

  console.log(myPofile, "tomi amar my profile");

  // Initialize profileData when myPofile data is available
  useEffect(() => {
    if (myPofile?.data?.user) {
      const userData = myPofile.data.user;
      const profileInfo = myPofile.data.profile;

      // Convert existing subjects to uppercase
      const existingSubjects = profileInfo?.subjects || [];
      const uppercaseSubjects = existingSubjects.map((subject) =>
        typeof subject === "string" ? subject.toUpperCase() : subject
      );

      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        subjects: uppercaseSubjects, // Store as uppercase
        bio: userData.bio || "",
        hourlyRate: profileInfo?.hourlyRate || "",
        avatar: userData.avatar || "",
      });
    }
  }, [myPofile]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value.toUpperCase() // Convert to uppercase immediately
    );
    handleInputChange("subjects", selectedOptions);
  };

  // Image upload to imgbb
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", "f119187269ac7e77ca4097bbbcb47457"); // Your imgbb API key

    try {
      setUploading(true);
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        return data.data.url; // Return the image URL
      } else {
        throw new Error(data.error?.message || "Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const imageUrl = await uploadImageToImgBB(file);

    if (imageUrl) {
      // Update local state
      setProfileData((prev) => ({ ...prev, avatar: imageUrl }));

      // Update in backend
      try {
        const result = await updateProfile({ avatar: imageUrl });

        if (result.error) {
          toast.error("Failed to save avatar");
        } else {
          toast.success("Avatar updated successfully");
          refetch(); // Refresh profile data
        }
      } catch (error) {
        console.error("Avatar update error:", error);
        toast.error("Failed to save avatar");
      }
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const result = await updateProfile({ avatar: "" });

      if (result.error) {
        toast.error("Failed to remove avatar");
      } else {
        setProfileData((prev) => ({ ...prev, avatar: "" }));
        toast.success("Avatar removed successfully");
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error("Avatar remove error:", error);
      toast.error("Failed to remove avatar");
    }
  };

  const handleSave = async () => {
    setIsEditing(false);

    try {
      // Prepare data for API call
      // Convert subjects to uppercase array (extra safety check)
      const uppercaseSubjects = Array.isArray(profileData.subjects)
        ? profileData.subjects.map((subject) =>
            typeof subject === "string" ? subject.toUpperCase() : subject
          )
        : [];

      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        bio: profileData.bio,
        subjects: uppercaseSubjects, // Send uppercase subjects array
        hourlyRate: profileData.hourlyRate,
      };

      console.log(updateData, "update data with subjects in uppercase");

      const result = await updateProfile(updateData);

      if (result.error) {
        toast.error(result.error.data?.message || "Update failed");
        console.error("Update error:", result.error);
      } else {
        toast.success("Profile Updated Successfully");
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while updating profile");
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (myPofile?.data?.user) {
      const userData = myPofile.data.user;
      const profileInfo = myPofile.data.profile;

      // Convert existing subjects to uppercase
      const existingSubjects = profileInfo?.subjects || [];
      const uppercaseSubjects = existingSubjects.map((subject) =>
        typeof subject === "string" ? subject.toUpperCase() : subject
      );

      setProfileData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        subjects: uppercaseSubjects,
        bio: userData.bio || "",
        hourlyRate: profileInfo?.hourlyRate || "",
        avatar: userData.avatar || "",
      });
    }
    setIsEditing(false);
  };

  // Available subjects options (already in uppercase)
  const subjectOptions = [
    { value: "MATH", label: "Mathematics" },
    { value: "ENGLISH", label: "English" },
    { value: "SCIENCE", label: "Science" },
    // Add more subjects as needed
  ];

  // Default avatar if none is set
  const defaultAvatar = "https://i.pravatar.cc/150?img=45";
  const displayAvatar = profileData.avatar || defaultAvatar;

  // Get display labels for selected subjects
  const getSubjectLabel = (subjectValue) => {
    const subject = subjectOptions.find((s) => s.value === subjectValue);
    return subject?.label || subjectValue;
  };

  return (
    <div className='bg-white p-12'>
      <TitleSection bg={"#FFFFFF"} title={"Profile"} />
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
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className='mb-8'>
          <div className='flex items-start gap-6 mb-6'>
            {/* Avatar Section */}
            <div className='relative shrink-0'>
              <div className='relative group'>
                <Image
                  width={80}
                  height={80}
                  src={displayAvatar}
                  alt='Profile'
                  className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg'
                />

                {/* Upload Overlay */}
                <div className='absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                  <label
                    htmlFor='avatar-upload'
                    className='cursor-pointer p-2 bg-white rounded-full hover:bg-gray-100 transition-colors'>
                    <BiUpload size={20} className='text-gray-700' />
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
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500'></div>
                </div>
              )}

              <div className='mt-3 text-center'>
                <label
                  htmlFor='avatar-upload'
                  className='text-sm text-purple-600 hover:text-purple-700 cursor-pointer font-medium'>
                  {uploading ? "Uploading..." : "Change photo"}
                </label>
                <p className='text-xs text-gray-500 mt-1'>JPG, PNG up to 5MB</p>
              </div>
            </div>

            {/* Profile Title */}
            <div className='flex-1'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Basic Information
              </h2>
              <p className='text-gray-600 mt-2'>
                Update your personal information and profile photo
              </p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-6 mb-6'>
            {/* First Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                First Name
              </label>
              <input
                type='text'
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                readOnly
                value={profileData.email}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600'
              />
            </div>

            {/* Hourly Rate */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Hourly Rate ($)
              </label>
              <input
                type='number'
                value={profileData.hourlyRate}
                onChange={(e) =>
                  handleInputChange("hourlyRate", e.target.value)
                }
                disabled={!isEditing}
                min='0'
                step='0.01'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600'
              />
            </div>
          </div>

          {/* Subjects (Multi-select) */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Subjects
            </label>
            <div className='relative'>
              <select
                multiple
                value={profileData.subjects}
                onChange={handleSubjectChange}
                disabled={!isEditing}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 min-h-[100px]'
                size={5}>
                {subjectOptions.map((subject) => (
                  <option
                    key={subject.value}
                    value={subject.value}
                    className='px-2 py-1 hover:bg-purple-50'>
                    {subject.label}
                  </option>
                ))}
              </select>
              {!isEditing && profileData.subjects.length === 0 && (
                <span className='absolute left-4 top-2 text-gray-500'>
                  No subjects selected
                </span>
              )}
            </div>
            <p className='mt-2 text-sm text-gray-500'>
              {isEditing
                ? "Hold Ctrl (Windows) or Cmd (Mac) to select multiple subjects"
                : ""}
              {!isEditing && profileData.subjects.length > 0 && (
                <span className='font-medium ml-2'>
                  Selected: {profileData.subjects.length} subject(s)
                </span>
              )}
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={4}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none'
              placeholder='Tell students about your teaching experience, qualifications, and approach...'
            />
          </div>
        </div>

        {/* Preview of selected subjects */}
        {profileData.subjects.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-gray-700 mb-2'>
              Selected Subjects:
            </h3>
            <div className='flex flex-wrap gap-2'>
              {profileData.subjects.map((subjectValue) => (
                <span
                  key={subjectValue}
                  className='px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium'>
                  {getSubjectLabel(subjectValue)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorProfilePage;
