import Image from "next/image";

export default function TopicsSection() {
  return (
    <section className="py-20 w-full bg-white">
      <div className="max-w-7xl mx-auto text-center px-6">

        {/* TITLE */}
        <h2 className="text-[32px] font-bold text-[#2C3A55] tracking-wide">
          OUR TOPICS
        </h2>
        
        <p className="text-gray-500 mt-3">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* CARDS */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">

          {/* CARD 1 */}
          <div className="bg-[#FFFAEC] rounded-xl p-10 text-center shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/topic1.png"
                width={62}
                height={60}
                alt="book"
              />
            </div>

            <h3 className="text-xl font-semibold text-black">
              English language
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam,
            </p>
          </div>

          {/* CARD 2 */}
          <div className="bg-[#FEB9AF] rounded-xl p-10 text-center shadow-md hover:shadow-lg transition">
            <div className="flex justify-center mb-4">
              <Image
                     src="/home/topic2.png"
                width={62}
                height={60}
                alt="math"
              />
            </div>

            <h3 className="text-xl font-semibold text-black">
              Mathmatics
            </h3>

            <p className="mt-3 leading-relaxed opacity-90 text-black">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam,
            </p>
          </div>

          {/* CARD 3 */}
          <div className="bg-[#FFFAEE] rounded-xl p-10 text-center shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-4">
              <Image
                src="/home/topic3.png"
                width={62}
                height={60}
                alt="science"
              />
            </div>

            <h3 className="text-xl font-semibold text-black">
              Science
            </h3>

            <p className="text-gray-600 mt-3 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam,
            </p>
          </div>

        </div>

        {/* DOTS */}
        <div className="flex justify-center mt-10 space-x-4">
          <span className="w-4 h-4 bg-[#FFEEC5] rounded-full"></span>
          <span className="w-4 h-4 bg-[#FBC7C2] rounded-full"></span>
          <span className="w-4 h-4 bg-[#B4F4C4] rounded-full"></span>
        </div>

      </div>
    </section>
  );
}
