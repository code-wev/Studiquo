"use client";

import { forgotPasswordAction, loginAction } from "@/action/auth.action";
import forgotParent from "@/public/-Parent/forgotParent.png";
import illustrationParent from "@/public/-Parent/illustrationParent.png";
import forgotStudent from "@/public/-Student/forgotStudent.png";
import illustrationStudent from "@/public/-Student/illustrationStudent.png";
import forgotTutor from "@/public/-Tutor/forgotTutor.png";
import illustrationTutor from "@/public/-Tutor/illustrationTutor.png";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

  const getCurrentImage = () => {
    return isForgotPassword
      ? forgotImages[activeRole] || forgotImages.Tutor
      : roleImages[activeRole] || roleImages.Tutor;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      await loginAction({
        email: form.email,
        password: form.password,
      });

      toast.success("Login successful!");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await forgotPasswordAction(form.email);
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error("Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setIsForgotPassword(false);
    setImageKey((prev) => prev + 1);
  };

  return (
    <div className='w-full bg-white min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6'>
        {/* Left Image */}
        <div className='relative w-full flex items-center justify-center overflow-hidden'>
          <div key={imageKey} className='relative w-full h-125 md:h-150'>
            <Image
              src={getCurrentImage()}
              alt={`${activeRole} Illustration`}
              fill
              className='object-contain'
              priority
            />
          </div>
        </div>

        {/* Right Form */}
        <div className='flex flex-col justify-center max-w-md'>
          {isForgotPassword ? (
            <>
              <h2 className='text-2xl font-semibold text-gray-900'>
                Reset Your Password
              </h2>
              <p className='text-gray-500 text-sm mt-2'>
                Enter your email to receive password reset instructions.
              </p>

              <form onSubmit={handleForgotSubmit} className='mt-6 space-y-4'>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5'
                  placeholder='Email'
                  required
                />

                <div className='flex gap-3'>
                  <button
                    type='button'
                    onClick={() => setIsForgotPassword(false)}
                    className='flex-1 border border-gray-300 py-3 rounded-lg'>
                    Back
                  </button>
                  <button
                    type='submit'
                    className='flex-1 bg-purple-300 hover:bg-purple-400 text-white py-3 rounded-lg'
                    disabled={isLoading}>
                    Send Reset Link
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className='text-2xl font-semibold text-gray-900'>
                Good to see you back!
              </h2>

              {/* Role Tabs */}
              <div className='flex gap-2 mt-6 bg-gray-100 rounded-lg p-1'>
                {["Tutor", "Student", "Parent"].map((role) => (
                  <button
                    key={role}
                    type='button'
                    onClick={() => handleRoleChange(role)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                      activeRole === role
                        ? "bg-white shadow-sm"
                        : "text-gray-600"
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
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5'
                  placeholder='Email'
                  required
                />

                <input
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5'
                  placeholder='Password'
                  required
                />

                <div className='text-right'>
                  <button
                    type='button'
                    onClick={() => setIsForgotPassword(true)}
                    className='text-xs text-gray-500 hover:underline'>
                    Forget password?
                  </button>
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full bg-purple-300 hover:bg-purple-400 text-white py-3 rounded-lg'>
                  {isLoading ? "Loading..." : "Log in"}
                </button>

                <p className='mt-5 text-sm text-center text-gray-600'>
                  Don’t have an account?{" "}
                  <Link href='/register'>
                    <span className='text-blue-600 hover:underline'>
                      Sign up
                    </span>
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
