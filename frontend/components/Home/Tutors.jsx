"use client";

import { useGetTutorQuery } from "@/feature/shared/TutorApi";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function TutorsSection() {
  const sliderRef = useRef(null);
  const { data: tutor } = useGetTutorQuery();

  const tutors = tutor?.data?.tutors;

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 300;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 300;
  };

  return (
    <section className='py-20 bg-[#F2F8F3] w-full relative'>
      <div className='mx-auto px-6 md:px-40'>
        {/* HEADER */}
        <div className='flex items-start justify-between'>
          <div>
            <h2 className='text-[32px] font-bold text-gray-900'>
              Meet Our Tutors
            </h2>
            <p className='text-gray-500 mt-2 text-xl'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <Link href={"/find-tutor"}>
            <button className='bg-[#CCB7F8] text-[#3A0E95] px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-white transition'>
              View All <FiArrowRight />
            </button>
          </Link>
        </div>

        {/* SLIDER */}
        <div className='relative mt-10'>
          {/* Left Button */}
          <button
            onClick={slideLeft}
            className='absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:bg-gray-100 z-10'>
            <FiArrowLeft className='text-gray-700' />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className='flex gap-6 overflow-x-scroll scroll-smooth no-scrollbar'>
            {tutors?.length === 0 ? (
              <div className='text-center text-gray-500 w-full py-10'>
                No tutors available.
              </div>
            ) : (
              tutors?.map((tutor, i) => (
                <div
                  key={i}
                  className='bg-white rounded-xl shadow-sm border border-[#D8D8D8] hover:-translate-y-1 transition-all duration-300 w-72 shrink-0'>
                  {/* Image */}
                  <div className='w-full h-44 relative'>
                    <Image
                      src={tutor?.avatar || "/default-avatar.png"}
                      alt={tutor?.firstName}
                      fill
                      className='rounded-t-xl object-cover'
                    />
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    {/* Rating */}
                    <div className='flex items-center gap-2 text-yellow-400'>
                      <div className='flex items-center gap-1 text-yellow-500'>
                        {Array.from({ length: 5 }, (_, i) =>
                          i < Math.round(tutor?.averageRating) ? (
                            <FaStar key={i} />
                          ) : (
                            <FaRegStar key={i} />
                          )
                        )}
                      </div>

                      <span className='text-gray-500 text-sm'>
                        {tutor?.averageRating} review
                      </span>
                    </div>

                    {/* Name and Subject */}
                    <h3 className='mt-3 font-bold text-gray-900'>
                      {tutor?.firstName + " " + tutor?.lastName}
                    </h3>
                    <p className='text-gray-500 text-sm mb-2'>
                      {tutor?.subjects?.map((subject, index) => (
                        <span key={index}>
                          {subject}
                          {index !== tutor?.subjects.length - 1 && ", "}
                        </span>
                      ))}
                    </p>

                    {/* Book Tutor Button */}
                    <button className='bg-[#CCB7F8] text-[#3A0E95] px-6 py-2 font-medium rounded-lg flex items-center gap-2 hover:bg-white hover:border hover:border-[#D8D8D8] transition'>
                      Book Tutor <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Button */}
          <button
            onClick={slideRight}
            className='absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:bg-gray-100 z-10'>
            <FiArrowRight className='text-gray-700' />
          </button>
        </div>
      </div>

      {/* Hide scrollbar style */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
