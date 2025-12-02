"use client";
import { useState } from "react";
import Image from "next/image";
import illustration from "@/public/login.jpg";
import toast from "react-hot-toast";
import { useUserLoginMutation } from "@/feature/UserApi";
import Link from "next/link";
import {signIn} from 'next-auth/react'

export default function LoginPage() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "" 
  });

  const [login, {isLoading, isError}]  = useUserLoginMutation();


  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Submitted Data:", form);
    try {

        const logged = await login(form).unwrap();
        console.log(logged, "tomi amar personal logged");
        toast.success("Login Success")

         const res = await signIn("credentials", {
        redirect: false,
        email:  logged?.data?.email,
        role:  logged?.data?.role,
        id:  logged ?.data?._id,
      });
console.log(res, "tui ki res re madari kroe den aplease")

        
    } catch (error) {
        console.log(error, "joy bangla marka error")
        toast.error(error?.data?.message)
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  return (
    <div className="w-full bg-[#EBEBEB] min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* Left Image */}
        <div className="relative w-full flex items-center justify-center">
          <Image
            src={illustration}
            alt="Login Illustration"
            height={1600}
            width={800}
            className="object-contain"
          />
        </div>

        {/* Right Form */}
        <div className="px-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">
          Good to see you back!
          </h2>
          <p className="text-gray-500 text-sm mt-1">
Let’s continue your learning journey right where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-[#020617] text-sm">Email*</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-[#CBD5E1] text-[#7B7B7B] rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="text-[#020617] text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-[#CBD5E1] text-[#7B7B7B] rounded-lg px-4 py-2 mt-1 focus:outline-none"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full text-[#3A0E95] py-3 cursor-pointer rounded-lg mt-4"
              style={{ backgroundColor: "#CCB7F8" }}
            >
         {
            isLoading ? "Loading..." : "Log in"
         }
            </button>

            {/* Google Login Button */}
            {/* <button
              type="button"
              className="w-full border border-[#CBD5E1] py-3 rounded-lg hover:bg-gray-50 transition"
            >
              Log in with Google
            </button> */}

            <p className="mt-5 text-sm text-center text-[#020617]">
              Don't have an account?{" "}
              <Link href={'/register'}>
              <span className="text-blue-500 cursor-pointer  hover:underline">
                Sign up
              </span></Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}