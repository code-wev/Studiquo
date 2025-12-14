"use client";

import Image from "next/image";
import { useState } from "react";

export default function TopicsSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const topics = [
    {
      id: 1,
      title: "English",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
      icon: "/home/topic1.png",
      dotColor: "#FFEEC5",
    },
    {
      id: 2,
      title: "Mathmatics",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
      icon: "/home/topic2.png",
      dotColor: "#FEB9AF",
    },
    {
      id: 3,
      title: "Science",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,",
      icon: "/home/topic3.png",
      dotColor: "#B4F4C4",
    },
  ];

  return (
    <section className='py-20 w-full bg-white'>
      <div className='mx-auto px-6 md:px-56'>
        {/* TITLE SECTION */}
        <div className='text-left mb-12'>
          <h2 className='text-[32px] font-bold text-[#2C3A55] tracking-wide'>
            OUR TOPICS
          </h2>

          <p className='text-gray-500 mt-2'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* CARDS */}
        <div className='grid md:grid-cols-3 gap-6'>
          {topics.map((topic) => (
            <div
              key={topic.id}
              className='rounded-xl p-8 text-center transition-all duration-300 hover:shadow-lg bg-[#F8F8F8] border border-[#E6E6E6]'
              onMouseEnter={() => setHoveredCard(topic.id)}
              onMouseLeave={() => setHoveredCard(null)}>
              <div className='flex justify-center mb-6'>
                <div className='w-16 h-16 flex items-center justify-center'>
                  <Image
                    src={topic.icon}
                    width={62}
                    height={60}
                    alt={topic.title}
                    className='object-contain'
                  />
                </div>
              </div>

              <h3 className='text-xl font-semibold text-black mb-4'>
                {topic.title}
              </h3>

              <p className='text-gray-600 text-sm leading-relaxed'>
                {topic.description}
              </p>
            </div>
          ))}
        </div>

        {/* DOTS */}
        <div className='flex justify-center mt-12 space-x-4'>
          {topics.map((topic) => (
            <span
              key={topic.id}
              className={`rounded-full transition-all duration-300 ${
                hoveredCard === topic.id
                  ? "w-5 h-5 opacity-100 scale-110"
                  : "w-4 h-4 opacity-70"
              }`}
              style={{
                backgroundColor: topic.dotColor,
                boxShadow:
                  hoveredCard === topic.id
                    ? `0 0 8px ${topic.dotColor}`
                    : "none",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
