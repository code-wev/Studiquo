"use client";

import Image from "next/image";
import { FiArrowRight, FiArrowLeft, FiStar } from "react-icons/fi";
import { useRef } from "react";

const tutors = [
  { name: "Eleanor Pena", role: "Mathematics Expert", img: "/home/tutor1.jpg" },
  { name: "Mason Brooks", role: "Mathematics Expert", img: "/home/tutor2.jpg" },
  { name: "Aiden Green", role: "Mathematics Expert", img: "/home/tutor3.jpg" },
  { name: "Sophia Long", role: "Mathematics Expert", img: "/home/tutor4.jpg" },
  { name: "Eleanor Pena", role: "Mathematics Expert", img: "/home/tutor2.jpg" },
  { name: "Eleanor Pena", role: "Mathematics Expert", img: "/home/tutor2.jpg" },
];

export default function TutorsSection() {
  const sliderRef = useRef(null);

  const slideLeft = () => {
    sliderRef.current.scrollLeft -= 300;
  };

  const slideRight = () => {
    sliderRef.current.scrollLeft += 300;
  };

  return (
    <section className="py-20 bg-[#F2F8F3] w-full relative">
      <div className="mx-auto px-6 md:px-40">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[32px] font-bold text-gray-900">
              Meet Our Tutors
            </h2>
            <p className="text-gray-500 mt-2 text-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <button className="bg-[#CCB7F8] text-[#3A0E95] px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-white transition">
            View All <FiArrowRight />
          </button>
        </div>

        {/* SLIDER */}
        <div className="relative mt-10">
          {/* Left Button */}
          <button
            onClick={slideLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:bg-gray-100 z-10"
          >
            <FiArrowLeft className="text-gray-700" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-scroll scroll-smooth no-scrollbar"
          >
            {tutors.map((tutor, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-[#D8D8D8] hover:-translate-y-1 transition-all duration-300 w-72 shrink-0"
              >
                {/* Image */}
                <div className="w-full h-44 relative">
                  <Image
                    src={tutor.img}
                    alt={tutor.name}
                    fill
                    className="rounded-t-xl object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1 text-[#FF8A00] text-sm">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar
                        key={s}
                        className="fill-[#FF8A00] text-[#FF8A00]"
                      />
                    ))}
                    <p className="text-gray-600 ml-1 text-sm">4.8 (06)</p>
                  </div>

                  <h3 className="mt-3 font-bold text-gray-900">{tutor.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">{tutor.role}</p>

                  <button className="bg-[#CCB7F8] text-[#3A0E95] px-6 py-2 font-medium rounded-lg flex items-center gap-2 hover:bg-white hover:border hover:border-[#D8D8D8] transition">
                    Book Tutor <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={slideRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white shadow rounded-full hover:bg-gray-100 z-10"
          >
            <FiArrowRight className="text-gray-700" />
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
