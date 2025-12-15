// "use client";

// import Image from "next/image";
// import { FaQuoteLeft } from "react-icons/fa";

// const testimonials = [
//   {
//     name: "Ayesha Akhtar",
//     role: "Class 10 Student",
//     text: "Before Uniqe Pathshala, I struggled to keep track of different subjects and truly understand the concepts. Now, everything feels connected. The visual tools and structured guidance have completely changed the way I learn. It's not just about passing exams anymore — I actually enjoy studying.",
//   },
//   {
//     name: "Ravi Kumar",
//     role: "Class 12 Student",
//     text: "Before joining Uniqe Pathshala, I often felt lost with the vast syllabus and overwhelming pressure. The personalized mentorship helped me to focus on my weaknesses and turned my anxiety into confidence. I can now tackle difficult subjects with a strategic approach and have seen a significant improvement in my grades.",
//   },
//   {
//     name: "Nisha Patel",
//     role: "Class 9 Student",
//     text: "Initially, I was unsure about my ability to keep up with my peers. Uniqe Pathshala's interactive sessions and collaborative projects made learning fun and effective. I've developed a deeper understanding of critical concepts and have become more engaged in my studies than ever before.",
//   },
// ];

// export default function LearnerStories() {
//   return (
//     <section className="w-full bg-white py-10 md:py-14">
//       <div className="mx-auto max-w-7xl px-4 md:px-6">
//         {/* Top text */}
//         <div className="mb-8 md:mb-10">
//           <h2 className="text-[18px] md:text-[32px] font-semibold tracking-tight text-gray-900">
//             Story told by our learners
//           </h2>
//           <p className="mt-1 text-[12px] md:text-lg text-gray-500">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//           </p>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
//           {testimonials.map((item) => (
//             <article
//               key={item.name}
//               className="relative flex h-full flex-col rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)] md:px-5 md:py-5"
//             >
//               {/* subtle quote icon */}
//               <FaQuoteLeft  className="absolute right-4 top-4 text-[20px] text-gray-200" />

//               <div className="relative z-[1]">
//                 <h3 className="text-[13px] font-semibold text-gray-900">
//                   {item.name}
//                 </h3>
//                 <p className="mt-0.5 text-[11px] text-gray-500">{item.role}</p>
//                 <p className="mt-3 text-[11px] leading-relaxed text-gray-600">
//                   {item.text}
//                 </p>
//               </div>
//             </article>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Ayesha Akhtar",
    role: "Class 10 Student",
    text: "Before Uniqe Pathshala, I struggled to keep track of different subjects and truly understand the concepts. Now, everything feels connected. The visual tools and structured guidance have completely changed the way I learn. It's not just about passing exams anymore — I actually enjoy studying.",
  },
  {
    name: "Ravi Kumar",
    role: "Class 12 Student",
    text: "Before joining Uniqe Pathshala, I often felt lost with the vast syllabus and overwhelming pressure. The personalized mentorship helped me to focus on my weaknesses and turned my anxiety into confidence. I can now tackle difficult subjects with a strategic approach and have seen a significant improvement in my grades.",
  },
  {
    name: "Nisha Patel",
    role: "Class 9 Student",
    text: "Initially, I was unsure about my ability to keep up with my peers. Uniqe Pathshala's interactive sessions and collaborative projects made learning fun and effective. I've developed a deeper understanding of critical concepts and have become more engaged in my studies than ever before.",
  },
];

export default function LearnerStories() {
  return (
    <section className="w-full bg-white py-10 md:py-14">
      <div className="mx-auto px-6 md:px-40">
        {/* Top text */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Story told by our learners
          </h2>
          <p className="mt-2 text-sm md:text-base text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm relative"
            >
              {/* subtle quote icon */}
              <FaQuoteLeft className="absolute right-4 top-4 text-[20px] text-gray-200" />
              <div className="px-6 py-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.role}</p>
              </div>

              <div className="mt-2 rounded-md bg-gray-50 p-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
