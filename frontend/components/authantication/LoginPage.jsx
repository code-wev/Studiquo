"use client";

import { loginAction } from "@/action/auth.action";
import illustrationParent from "@/public/-Parent/illustrationParent.png";
import illustrationStudent from "@/public/-Student/illustrationStudent.png";
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
  const [imageKey, setImageKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const roleImages = {
    Tutor: illustrationTutor,
    Student: illustrationStudent,
    Parent: illustrationParent,
  };
  const getCurrentImage = () => roleImages[activeRole] || roleImages.Tutor;

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
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
                  activeRole === role ? "bg-white shadow-sm" : "text-gray-600"
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
              <Link
                href='/forgot-password'
                className='text-xs text-gray-500 hover:underline'>
                Forget password?
              </Link>
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-purple-300 hover:bg-purple-400 text-white py-3 rounded-lg'>
              {isLoading ? "Loading..." : "Log in"}
            </button>

            {/* Google Login Button */}
            <button
              type='button'
              className='w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-gray-700 font-medium'>
              <svg className='w-5 h-5' viewBox='0 0 24 24'>
                <path
                  fill='#4285F4'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='#34A853'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='#FBBC05'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='#EA4335'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Log in with google
            </button>

            <p className='mt-5 text-sm text-center text-gray-600'>
              Don’t have an account?{" "}
              <Link href='/register'>
                <span className='text-blue-600 hover:underline'>Sign up</span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
