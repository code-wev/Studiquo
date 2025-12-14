"use client";

import { forgotPasswordAction, loginAction } from "@/action/auth.action";
import forgotParent from "@/public/-Parent/forgotParent.png";
import illustrationParent from "@/public/-Parent/illustrationParent.png";
import forgotStudent from "@/public/-Student/forgotStudent.png";
import illustrationStudent from "@/public/-Student/illustrationStudent.png";
import forgotTutor from "@/public/-Tutor/forgotTutor.png";
import illustrationTutor from "@/public/-Tutor/illustrationTutor.png";
import { signIn } from "next-auth/react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [activeRole, setActiveRole] = useState("Tutor");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [imageKey, setImageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const roleImages = {
    Tutor: illustrationTutor,
    Student: illustrationStudent,
    Parent: illustrationParent,
  };

  const forgotImages = {
    Tutor: forgotTutor,
    Student: forgotStudent,
    Parent: forgotParent,
  };

  const getCurrentImage = () =>
    isForgotPassword ? forgotImages[activeRole] : roleImages[activeRole];

  /* ======================
     LOGIN SUBMIT
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // 1️⃣ Login to backend
      const res = await loginAction({
        email: form.email,
        password: form.password,
      });

      // 2️⃣ Sync with NextAuth session
      const authRes = await signIn("credentials", {
        redirect: false,
        email: res.user.email,
        role: res.user.role,
        _id: res.user._id,
      });

      if (authRes?.error) {
        throw new Error(authRes.error);
      }

      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  /* ======================
     FORGOT PASSWORD
  ====================== */
  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await forgotPasswordAction(form.email);
      toast.success("Reset link sent to your email");
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setIsForgotPassword(false);
    setImageKey((p) => p + 1);
  };

  return (
    <div className='w-full bg-white min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6'>
        {/* Image */}
        <div className='relative w-full flex items-center justify-center'>
          <div key={imageKey} className='relative w-full h-125 md:h-150'>
            <Image
              src={getCurrentImage()}
              alt='Login Illustration'
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>

        {/* Form */}
        <div className='flex flex-col justify-center max-w-md'>
          {isForgotPassword ? (
            <>
              <h2 className='text-2xl font-semibold'>Reset Your Password</h2>

              <form onSubmit={handleForgotSubmit} className='mt-6 space-y-4'>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-4 py-2.5'
                  placeholder='Email'
                  required
                />

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => setIsForgotPassword(false)}
                    className='flex-1 border py-3 rounded-lg'>
                    Back
                  </button>
                  <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-1 bg-purple-300 text-white py-3 rounded-lg'>
                    Send Reset Link
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className='text-2xl font-semibold'>Welcome back!</h2>

              <div className='flex gap-2 mt-6 bg-gray-100 rounded-lg p-1'>
                {["Tutor", "Student", "Parent"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`flex-1 py-2 rounded-lg ${
                      activeRole === role ? "bg-white shadow-sm" : ""
                    }`}>
                    {role}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-4 py-2.5'
                  placeholder='Email'
                  required
                />

                <input
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-4 py-2.5'
                  placeholder='Password'
                  required
                />

                <div className='text-right'>
                  <button
                    type='button'
                    onClick={() => setIsForgotPassword(true)}
                    className='text-xs text-gray-500'>
                    Forget password?
                  </button>
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-purple-300 text-white py-3 rounded-lg'>
                  {isLoading ? "Loading..." : "Log in"}
                </button>

                <p className='text-sm text-center'>
                  Don’t have an account?{" "}
                  <Link href='/register' className='text-blue-600'>
                    Sign up
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
