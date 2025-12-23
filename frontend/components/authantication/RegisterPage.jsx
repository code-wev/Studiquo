"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { registerAction } from "@/action/auth.action";
import parentImage from "@/public/-Signup/parentImage.png";
import studentImage from "@/public/-Signup/studentImage.png";
import tutorImage from "@/public/-Signup/tutorImage.png";
import { useSaveUserMutation } from "@/feature/shared/AuthApi";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [saveUser, {isLoading:registerLoading}] = useSaveUserMutation();

  const [formData, setFormData] = useState({
    role: "Tutor",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    hearAbout: "",
    otherHearAbout: "",
    dbs: "",
    studentId: "",
    terms: false,
  });

  const hearAboutOptions = [
    "Instagram",
    "Facebook",
    "LinkedIn",
    "Friend/Family",
    "Search Engine",
    "Advertisement",
    "Other",
  ];

  const roleImages = {
    Tutor: tutorImage,
    Student: studentImage,
    Parent: parentImage,
  };

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!formData.terms) {
      toast.error("Please accept the Terms and Conditions");
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      dbsLink: formData.role === "Tutor" ? formData.dbs : undefined,
      referralSource:
        formData.hearAbout === "Other"
          ? formData.otherHearAbout
          : formData.hearAbout,
    };

    try {
      setIsLoading(true);

    const result =   await saveUser(payload);
    if(result.error){
      console.log(result?.error?.data?.message[0], "tomi amar personal error");
      toast.error(result?.error?.data?.message[0]);
      return;
    }
    console.log(result, "kire vai result");

      toast.success("Registration successful!");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full bg-white min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6 my-20'>
        {/* Left Image */}
        <div className='relative w-full flex items-center justify-center'>
          <Image
            src={roleImages[formData.role] || tutorImage}
            alt={`${formData.role} Registration Illustration`}
            height={1600}
            width={800}
            className='object-contain transition-opacity duration-500'
            priority
          />
        </div>

        {/* Right Form */}
        <div className='flex flex-col justify-center max-w-md'>
          <h2 className='text-2xl font-semibold text-gray-900'>
            {formData.role === "Tutor"
              ? "Join the Teaching Journey"
              : formData.role === "Student"
              ? "Start Your Learning Journey"
              : "Connect with Your Child's Education"}
          </h2>

          <p className='text-gray-500 text-sm mt-2'>
            {formData.role === "Tutor"
              ? "Create an account to manage classes, bookings, and get personalized analytics."
              : formData.role === "Student"
              ? "Create an account to find tutors, book sessions, and track your progress."
              : "Create an account to monitor your child's progress and manage their tutoring."}
          </p>

          {/* Role Tabs */}
          <div className='flex gap-2 mt-6 bg-gray-100 rounded-lg p-1'>
            {["Tutor", "Student", "Parent"].map((type) => (
              <button
                key={type}
                type='button'
                onClick={() =>
                  setFormData({
                    ...formData,
                    role: type,
                    dbs: "",
                    hearAbout: "",
                    otherHearAbout: "",
                    studentId: "",
                  })
                }
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  formData.role === type
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}>
                {type}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            {/* Name */}
            <div>
              <label className='text-gray-900 text-sm font-medium block mb-2'>
                First name
              </label>
              <input
                type='text'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                placeholder='First name'
                required
              />
            </div>

            <div>
              <label className='text-gray-900 text-sm font-medium block mb-2'>
                Last name
              </label>
              <input
                type='text'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                placeholder='Last name'
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className='text-gray-900 text-sm font-medium block mb-2'>
                Email Address
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                placeholder='Email address'
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className='text-gray-900 text-sm font-medium block mb-2'>
                Password
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                required
              />
            </div>

            <div>
              <label className='text-gray-900 text-sm font-medium block mb-2'>
                Re-type password
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
                className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                required
              />
            </div>

            {/* DBS STRING INPUT */}
            {formData.role === "Tutor" && (
              <div>
                <label className='text-gray-900 text-sm font-medium block mb-2'>
                  DBS Certificate Link
                </label>
                <input
                  type='text'
                  name='dbs'
                  value={formData.dbs}
                  onChange={handleChange}
                  className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                  placeholder='Enter DBS link or reference'
                  required
                />
              </div>
            )}

            {/* Hear about */}
            {(formData.role === "Tutor" || formData.role === "Student") && (
              <>
                <div>
                  <label className='text-gray-900 text-sm font-medium block mb-2'>
                    How did you hear about us?
                  </label>
                  <select
                    name='hearAbout'
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 bg-white'
                    required>
                    <option value=''>Select an option</option>
                    {hearAboutOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.hearAbout === "Other" && (
                  <div>
                    <label className='text-gray-900 text-sm font-medium block mb-2'>
                      Please specify
                    </label>
                    <input
                      type='text'
                      name='otherHearAbout'
                      value={formData.otherHearAbout}
                      onChange={handleChange}
                      className='w-full border border-gray-300 text-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-400'
                      required
                    />
                  </div>
                )}
              </>
            )}

            {/* Terms */}
            <label className='flex items-start gap-3 text-sm mt-2 cursor-pointer'>
              <input
                type='checkbox'
                name='terms'
                checked={formData.terms}
                onChange={handleChange}
                className='h-4 w-4 mt-0.5 rounded border-gray-300'
                required
              />
              <span>
                I agree to the{" "}
                <span className='text-blue-600 hover:underline'>
                  Terms and Conditions
                </span>
              </span>
            </label>

            {/* Submit */}
            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-300 hover:bg-purple-400 text-white font-medium py-3 rounded-lg mt-4 transition-colors disabled:opacity-50'>
              {isLoading ? "Processing..." : "Sign up"}
            </button>

            <p className='mt-5 text-sm text-center text-gray-600'>
              Already have an account?{" "}
              <Link href='/login'>
                <span className='text-blue-600 cursor-pointer hover:underline font-medium'>
                  Login
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
