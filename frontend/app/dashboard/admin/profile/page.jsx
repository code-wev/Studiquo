"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
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
  const [changePassword, { isLoading: passwordLoading }] = useChangePasswordMutation();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subjects: [],
    bio: "",
    groupHourlyRate: "",
    oneOnOneHourlyRate: "",
    avatar: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
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
        groupHourlyRate:
          profileInfo?.groupHourlyRate || profileInfo?.hourlyRate || "",
        oneOnOneHourlyRate:
          profileInfo?.oneOnOneHourlyRate || profileInfo?.hourlyRate || "",
        avatar: userData.avatar || "",
      });
    }
  }, [myPofile]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value.toUpperCase() // Convert to uppercase immediately
    );
    handleInputChange("subjects", selectedOptions);
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

    // Upload to backend via PUT /users/me as multipart/form-data
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const result = await updateProfile(formData);

      if (result.error) {
        toast.error("Failed to save avatar");
      } else {
        toast.success("Avatar updated successfully");
        refetch(); // Refresh profile data
      }
    } catch (error) {
      console.error("Avatar update error:", error);
      toast.error("Failed to save avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const formData = new FormData();
      // send empty string to indicate removal
      formData.append("avatar", "");
      const result = await updateProfile(formData);

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
        hourlyRate: profileData.hourlyRate, // Keep for backward compatibility
        groupHourlyRate: profileData.groupHourlyRate,
        oneOnOneHourlyRate: profileData.oneOnOneHourlyRate,
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

  const handlePasswordHandler = async () => {
    console.log("Old Password:", passwordData.oldPassword);
    console.log("New Password:", passwordData.newPassword);
    
    try {
      const payload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      const result = await changePassword(payload);

      if (result.error) {
        toast.error(result?.error?.data?.message);
        return;
      }
      
      toast.success("Password changed successfully");
      console.log(result, "Password change successfully");

      // Reset the form
      setPasswordData({
        oldPassword: "",
        newPassword: ""
      });
    } catch (error) {
      toast.error('Something went wrong! Please try again later!');
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
        groupHourlyRate:
          profileInfo?.groupHourlyRate || profileInfo?.hourlyRate || "",
        oneOnOneHourlyRate:
          profileInfo?.oneOnOneHourlyRate || profileInfo?.hourlyRate || "",
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
       

       
 

        {/* Change Password Section */}
        <div className="mt-8 p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Password
              </label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => handlePasswordChange("oldPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your old password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your new password"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePasswordHandler}
              disabled={passwordLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;