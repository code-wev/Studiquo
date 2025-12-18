"use client";
import Image from "next/image";
import React from "react";
import { FaStar, FaRegStar, FaHeart, FaRegComment } from "react-icons/fa";
import teacherImg from "@/public/hiw/teacher.png";
import profile from "@/public/hiw/proflie.png";
import { useParams, useRouter } from "next/navigation";
import { FiSend } from "react-icons/fi";

const TutorProfilePage = () => {
  const tutor = {
    name: "Jerome Bell",
    specialty: "Mathematics Expert",
    rating: 4.6,
    reviews: 203,
    price: 599,
    bio: `Hello, I'm Abdullah. I'm a friendly and patient GCSE Maths tutor who loves helping students feel more confident with maths. I explain topics in a clear, simple way and make sure my students really understand before moving on. One of my students went from a grade 3 to a grade 6 in just two months, and...`,
    image: teacherImg,
  };

  const reviews = [
    {
      id: 1,
      name: "Dianne Russell",
      userId: 77797,
      message: "Best tutor ever. Very friendly and welcoming.",
      rating: 5,
      date: "2025-06-16",
      avatar: profile,
    },
    {
      id: 2,
      name: "Dianne Russell",
      userId: 77797,
      message: "Best tutor ever. Very friendly and welcoming.",
      rating: 5,
      date: "2025-06-16",
      avatar: profile,
    },
  ];

  const router = useRouter();
  const params = useParams();
  const id = params.id;


  return (
    <section className="bg-[#F5F5F7]">
      <div className="max-w-4xl mx-auto  p-6 space-y-6">
        {/* Tutor Profile */}
        <div className=" rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Tutor Profile</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <Image
              src={tutor.image}
              alt={tutor.name}
              className="w-48  object-cover "
            />
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold">{tutor.name}</h3>
                <p className="text-gray-600">{tutor.specialty}</p>
                <div className="flex items-center gap-2 text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) =>
                    i < Math.floor(tutor.rating) ? (
                      <FaStar key={i} />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                  <span className="text-gray-500 text-sm">
                    {tutor.rating} ({tutor.reviews} review)
                  </span>
                </div>
                <p className="text-orange-500 text-lg font-semibold">
                  ${tutor.price}
                </p>
                <div>
                  <h4 className="font-semibold">Bio</h4>
                  <p className="text-gray-700 text-sm">{tutor.bio}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    router.push(`/book-now/${id}`);
                  }}
                  className="flex-1 cursor-pointer bg-purple-200 hover:bg-purple-300 text-purple-800 py-2 rounded-md font-medium transition"
                >
                  Book Now
                </button>
                <button className="border border-gray-300 rounded-md p-2 text-gray-600 hover:bg-gray-100 transition">
                  <FaHeart />
                </button>
                <button className="border border-gray-300 rounded-md p-2 text-gray-600 hover:bg-gray-100 transition">
                  <FaRegComment />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Reviews */}
        <div className=" rounded-lg p-6 space-y-4">
          <h2 className="font-semibold text-lg">Student Reviews</h2>
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col md:flex-row justify-between p-4 bg-white rounded-md"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    height={400}
                    width={400}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-[#9838E1] text-sm">
                      ID: {review.userId}
                    </p>
                    <p className="text-gray-700 text-sm mt-1">
                      {review.message}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end mt-2 md:mt-0">
                  <div className="flex text-yellow-400">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < review.rating ? (
                        <FaStar key={i} />
                      ) : (
                        <FaRegStar key={i} />
                      )
                    )}
                  </div>
                  <span className="text-purple-500 text-sm mt-1">
                    {review.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Input Section */}
        <div className="relative bg-white rounded-2xl p-2 m-4">
          <p className="m-4 p-3 text-xl font-semibold">Write Reviews</p>
          <div className=" border-2 border-purple-300 shadow-sm p-6 m-4 rounded-2xl">
          
          <textarea
            onChange={(e) => setReview(e.target.value)}
            placeholder="Type your Review....."
            className="w-full h-12 resize-none outline-none text-gray-700 placeholder-gray-400"
          />

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button className="bg-purple-400 hover:bg-purple-500 text-white p-3 rounded-xl transition-colors shadow-md"><FiSend/></button>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default TutorProfilePage;
