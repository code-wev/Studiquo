"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BiChevronDown, BiCreditCard } from "react-icons/bi";
import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useMyProfileQuery,
  useUpdateProfileMutation,
} from "@/feature/shared/AuthApi";
import toast from "react-hot-toast";

const TutorProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading, loading }] = useUpdateProfileMutation();
  const { data: myPofile } = useMyProfileQuery();

  const [profileData, setProfileData] = useState({
    firstName: myPofile?.data?.user?.firstName,
    lastName: myPofile?.data?.user?.lastName,
    // email: myPofile?.data?.user?.email,
    subject: myPofile?.data?.user?.subject,
    bio: myPofile?.data?.user?.bio,
    // paymentName: "Aubrey Aubrey",
    // cardNumber: "",
    // expiresMonth: "March",
    // expiresYear: "2027",
    // cvc: "CVC",
  });

  console.log(myPofile, "khela hobe");

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsEditing(false);
    console.log(profileData, "toi profile data");
    // Add your save logic here
    try {
      const result = await updateProfile(profileData);
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
    // Reset to original data if needed
  };

  return (
    <div className=" bg-white p-12">
      <TitleSection bg={"#FFFFFF"} title={"Profile"} />
      <div className="mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Image
              width={80}
              height={80}
              src="https://i.pravatar.cc/150?img=45"
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                defaultValue={myPofile?.data?.user?.firstName}
                value={profileData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                defaultValue={myPofile?.data?.user?.lastName}
                value={profileData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                readOnly
                defaultValue={myPofile?.data?.user?.email}
                value={profileData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <select
                  value={profileData.subject}
                  defaultValue={myPofile?.data?.profile?.subjects[0]}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="MATH">Math</option>
                  <option value="ENGLISH">English</option>
                  <option value="SCIENCE">Science</option>
                  {/* <option value="History">History</option> */}
                </select>
                <BiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              defaultValue={myPofile?.data?.user?.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div>
          {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Payment Information
          </h2> */}

          {/* Stripe Button */}
          {/* <div className="flex items-center justify-center gap-2 py-6 mb-6 border border-gray-200 rounded-lg bg-gray-50">
            <BiCreditCard size={20} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Stripe</span>
          </div> */}

          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profileData.paymentName}
              onChange={(e) => handleInputChange("paymentName", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div> */}

          {/* <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card number
            </label>
            <input
              type="text"
              value={profileData.cardNumber}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              disabled={!isEditing}
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div> */}

          {/* <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires
              </label>
              <div className="relative">
                <select
                  value={profileData.expiresMonth}
                  onChange={(e) =>
                    handleInputChange("expiresMonth", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
                <BiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <div className="relative">
                <select
                  value={profileData.expiresYear}
                  onChange={(e) =>
                    handleInputChange("expiresYear", e.target.value)
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option>2024</option>
                  <option>2025</option>
                  <option>2026</option>
                  <option>2027</option>
                  <option>2028</option>
                  <option>2029</option>
                  <option>2030</option>
                </select>
                <BiChevronDown
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={20}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={profileData.cvc}
                onChange={(e) => handleInputChange("cvc", e.target.value)}
                disabled={!isEditing}
                maxLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default TutorProfilePage;
