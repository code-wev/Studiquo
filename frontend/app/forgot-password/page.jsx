"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

import { forgotPasswordAction } from "@/action/auth.action";
import forgotParent from "@/public/-Parent/forgotParent.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await forgotPasswordAction(email);
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <p className='text-gray-500 text-sm mt-2'>
            Enter your email to receive password reset instructions.
          </p>

          <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
            <input
              name='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full border border-gray-300 rounded-lg px-4 py-2.5'
            />

            <div className='flex gap-3'>
              <Link
                href='/login'
                className='flex-1 border border-gray-300 py-3 rounded-lg text-center'>
                Back
              </Link>

              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-purple-300 hover:bg-purple-400 text-white py-3 rounded-lg'>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
