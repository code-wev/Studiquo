import TitleSection from "@/components/dashboard/shared/TitleSection";
import Image from "next/image";
import { FaRegStar, FaStar } from "react-icons/fa";

import profile from "@/public/hiw/proflie.png";

export default function Ratings() {
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
    {
      id: 3,
      name: "Dianne Russell",
      userId: 77797,
      message: "Best tutor ever. Very friendly and welcoming.",
      rating: 5,
      date: "2025-06-16",
      avatar: profile,
    },
    {
      id: 4,
      name: "Dianne Russell",
      userId: 77797,
      message: "Best tutor ever. Very friendly and welcoming.",
      rating: 5,
      date: "2025-06-16",
      avatar: profile,
    },
  ];

  return (
    <div className="bg-[#F7F7F7] rounded-2xl">
      <TitleSection bg={"#FFF8F7"} title={"Bookings"} />
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
                  <p className="text-[#9838E1] text-sm">ID: {review.userId}</p>
                  <p className="text-gray-700 text-sm mt-1">{review.message}</p>
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
    </div>
  );
}
