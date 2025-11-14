"use client";
import React from "react";
import Image from "next/image";
import englishImg from "@/public/home/pic2.jpg";
import mathImg from "@/public/home/pic1.jpg";
import scienceImg from "@/public/home/pic3.jpg";

const Topics = () => {
  const topics = [
    {
      title: "English",
      description: "Enhance grammar, vocabulary, and communication skills efficiently.",
      image: englishImg,
      bgColor: "from-[#FEB9AF] to-[#FEF0C8]",
    },
    {
      title: "Math",
      description: "Master mathematical concepts with interactive lessons and exercises.",
      image: mathImg,
      bgColor: "from-[#E3D9EF] to-[#D7E9DC]",
    },
    {
      title: "Science",
      description: "Explore physics, chemistry, and biology through engaging experiments.",
      image: scienceImg,
      bgColor: "from-[#FEF0C8] to-[#E3D9EF]",
    },
  ];

  return (
    <section className="py-20 bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Title */}
        <h2 className="text-5xl font-extrabold text-[#111111] mb-4">
          Our Topics
        </h2>
        {/* Section Description */}
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Explore our carefully curated topics designed to enhance your learning journey. 
          Each topic is crafted to provide engaging lessons and practical knowledge.
        </p>

        {/* Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topics.map((topic, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${topic.bgColor} rounded-3xl p-6 shadow-xl hover:scale-105 transition-transform duration-300 relative`}
            >
              <div className="w-full h-44 relative mb-6 rounded-2xl overflow-hidden shadow-inner">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-black">{topic.title}</h3>
              <p className="text-black/80">{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topics;
