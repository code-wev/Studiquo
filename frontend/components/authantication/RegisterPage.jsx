"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineCheck } from "react-icons/ai";
import illustration from "@/public/register.jpg";
import { useCreateUserMutation } from "@/feature/UserApi";
import toast from "react-hot-toast";

export default function RegisterPage() {



  const [createUser, {isLoading, iserror, error}] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    year: "Tutor",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email:"",
    terms: false,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

const handleSubmit = async(e) =>{
    e.preventDefault();

    const registrationData = {
      ...formData,
      role:formData.year.toLowerCase()
    };

  try {
      const saved = await createUser(registrationData).unwrap();
    console.log(saved, "saved---")
    toast.success("Registration Successfull")
    
  } catch (error) {
    console.log(error, "tomi amar personal error")
    toast.error(error?.data?.message || "Something went wrong!")
  }
    

    console.log("Form Data:", {
      ...formData,
      role: formData.year.toLowerCase() 
    });
    
 
    console.log("Role:", formData.year === "Tutor" ? "teacher" : "student");
  };

  return (
    <div className="w-full bg-[#EBEBEB] min-h-screen  flex items-center justify-center ">
      <div className=" bg-white  rounded-xl grid grid-cols-1 md:grid-cols-2  overflow-hidden">

        {/* Left Image */}
        <div className="relative w-full  flex items-center justify-center">
          <Image
            src={illustration}
            alt="Register Illustration"
           
            height={1600}
            width={800}
            className="object-contain   "
          />
        </div>

        {/* Right Form */}
        <div className="px-10  flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Join the Teaching Journey
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create an account to manage classes, bookings, and get personalized analytics.
          </p>

          {/* Toggle */}
          <div className="flex mt-5 bg-gray-100 rounded-lg p-1 w-[180px]">
            {["Tutor", "Student"].map((type) => (
              <button
                key={type}
                onClick={() => setFormData({ ...formData, year: type })}
                className={`w-1/2 py-2 rounded-md text-sm font-medium transition ${
                  formData.year === type
                    ? "bg-white shadow text-black"
                    : "text-gray-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="mt-6  space-y-4">



              <div>
              <label className="text-[#020617] text-sm">Email*</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-[#CBD5E1] text-[#7B7B7B] rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Email"
                required
              />
            </div>




            <div>
              <label className="text-[#020617] text-sm">First name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-[#CBD5E1] text-[#7B7B7B] rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="text-[#020617] text-sm">Last name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full  border border-[#CBD5E1] text-[#7B7B7B rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Last name"
              />
            </div>

            <div>
              <label className="text-[#020617] text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border  border-[#CBD5E1] text-[#7B7B7B] rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Password"
              />
            </div>

            <div>
              <label className="text-[#020617] text-sm">Re-type password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-[#CBD5E1] text-[#7B7B7B rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Re-type password"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-center gap-3 text-sm mt-2 cursor-pointer">
              <input
                type="checkbox"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-[#18181B]">Terms and Conditions</span>
            </label>

            {/* Button */}
            <button
              type="submit"
              className="w-full text-[#3A0E95] py-3 rounded-lg mt-4"
              style={{ backgroundColor: "#CCB7F8" }}
            >
         {
          !isLoading ? "Sign up" : "loading..."
         }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}