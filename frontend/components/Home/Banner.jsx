import Image from "next/image";
import { FiArrowRight, FiStar } from "react-icons/fi";
import { IoIosStar } from "react-icons/io";
export default function Banner() {
  return (
    <section className="w-full bg-white ">
      <div className="relative grid lg:grid-cols-2 min-h-[80vh]">
        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-[#CCB7F8] via-[#a495cc] to-[#575476] py-8 px-6 lg:px-32 flex flex-col justify-center text-white">
          <h1 className="text-3xl md:text-4xl text-white lg:text-5xl font-extrabold leading-tight mb-6 text-black">
            Find The Perfect Tutor For Any Subject — Anytime, Anywhere
          </h1>

          <p className="text-[#DADADA] text-lg leading-relaxed max-w-xl">
            Learn from trusted, verified tutors for GCSE & A-Level subjects.
            Book sessions instantly and study with confidence Learn from
            trusted, verified tutors for GCSE & A-Level subjects.
          </p>

          {/* Button */}
          <button className="mt-8 bg-white text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 w-fit shadow hover:bg-gray-100 transition">
            Discover More <FiArrowRight />
          </button>

          {/* Rating */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-3">
              <Image
                src="/home/user.png"
                width={35}
                height={35}
                className="rounded-full border-2 w-9 h-9 bg-cover"
                alt="user1"
              />
              <Image
                src="/home/user.png"
                width={35}
                height={35}
                className="rounded-full border-2 w-9 h-9 bg-cover"
                alt="user1"
              />
              <Image
                src="/home/user.png"
                width={35}
                height={35}
                className="rounded-full border-2 w-9 h-9 bg-cover"
                alt="user1"
              />
            </div>

            <div className="flex items-center gap-1">
              <div>
                <div className="flex items-center gap-2">
                  <IoIosStar className="text-yellow-300" />
                  <span className="text-white font-semibold">145K</span>
                </div>
                <div>
                  <span>Ratings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="bg-[#F4F4F4] flex justify-center items-center p-6 lg:p-10">
          <Image
            src="/home/banner.png"
            alt="Tutor Illustration"
            width={708}
            height={450}
            className="object-contain"
          />
        </div>

        {/* BOTTOM STAT BAR */}
        <div className="absolute bottom-6 w-full flex justify-center">
          <div
            className="flex items-center justify-between bg-white rounded-full shadow-md px-12 py-3 md:py-6 
                      max-w-4xl w-full"
          >
            {/* Item 1 */}
            <div className="text-center flex flex-col items-center">
              <span className="text-lg md:text-2xl font-semibold text-[#455176]">
                150+
              </span>
              <span className="text-xs md:text-base text-gray-600">Students</span>
            </div>

            {/* Item 2 */}
            <div className="text-center flex flex-col items-center">
              <span className="text-lg md:text-2xl font-semibold text-[#0E7490]">50</span>
              <span className="text-xs md:text-base text-gray-600">Online Courses</span>
            </div>

            {/* Item 3 */}
            <div className="text-center flex flex-col items-center">
              <span className="text-lg md:text-2xl font-semibold text-[#15803D]">200</span>
              <span className="text-xs md:text-base text-gray-600">Finished Seasons</span>
            </div>

            {/* Item 4 */}
            <div className="text-center flex flex-col items-center">
              <span className="text-lg md:text-2xl font-semibold text-[#764545]">
                100%
              </span>
              <span className="text-xs text-gray-600">Satisfaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
