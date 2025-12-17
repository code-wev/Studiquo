'use client'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { forgotPasswordAction } from "@/action/auth.action";
import forgotParent from "@/public/-Parent/forgotParent.png";
import { useResetPasswordMutation } from '@/feature/shared/AuthApi';

const ResetPasswordpage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [resetPassword, {isLoading:resetPasswordLoading}] = useResetPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      
      // Create object with email, token, and newPassword
      const resetData = {
        email,
        token,
        newPassword
      };

      const result = await resetPassword(resetData);
     if(result.error){
     
        toast.error(result.error?.data?.message);
        return;
     }
      
      // Just console log the object
      console.log("Reset Password Data:", resetData);
      
      toast.success("Reset data logged to console");
      
      // Reset form
      setNewPassword("");
      setConfirmPassword("");
      
    } catch (error) {
      console.error(error);
      toast.error("Failed to process reset request");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className='w-full bg-white min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 px-6 items-center'>
          {/* Left Image */}
          <div className='relative w-full flex items-center justify-center overflow-hidden'>
            <div className='relative w-full h-125 md:h-150'>
              <Image
                src={forgotParent}
                alt='Forgot Password Illustration'
                fill
                className='object-contain'
                priority
              />
            </div>
          </div>

          {/* Right Form */}
          <div className='w-full max-w-md p-6'>
            <h2 className='text-2xl font-semibold text-gray-900'>
              Reset Your Password
            </h2>
            <p className='text-gray-500 text-sm mt-2 mb-6'>
              Enter your new password and confirm it.
            </p>

            <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
              {/* Email (read-only) */}
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-medium mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  value={email || ""}
                  readOnly
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500'
                />
              </div>

              {/* New Password */}
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-medium mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  placeholder='Enter new password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
                <p className='text-xs text-gray-500 mt-1'>Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div className='mb-6'>
                <label className='block text-gray-700 text-sm font-medium mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  placeholder='Confirm new password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                />
              </div>

              <div className='flex gap-3'>
                <Link
                  href='/login'
                  className='flex-1 border border-gray-300 py-3 rounded-lg text-center hover:bg-gray-50 transition-colors'>
                  Back
                </Link>

                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
                  {loading ? "Processing..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};



const PasswordResetpage = () => {
  return (
    <div>
      <Suspense fallback={'loading...'}>
        <ResetPasswordpage/>
      </Suspense>
    </div>
  );
};

export default PasswordResetpage;