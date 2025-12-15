"use client";

import image from "@/public/hiw/Logo.png";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaArrowRight, FaStar } from "react-icons/fa";

const tutorsData = [
  {
    id: 1,
    name: "Jenny Wilson",
    subject: "Mathematics, English Expert",
    description:
      "Hello, I'm Abdullah. I'm a friendly and patient GCSE Maths tutor who loves helping students feel more confident with maths. I explain topics in a clear, simple way and make sure my students really understand before moving on. One of my students went from a grade 3 to a grade 6 in just two months, an...",
    price: 24,
    rating: 5,
    image: image,
  },
  {
    id: 2,
    name: "Wade Warren",
    subject: "Mathematics, English Expert",
    description:
      "Hello, I'm Abdullah. I'm a friendly and patient GCSE Maths tutor who loves helping students feel more confident with maths. I explain topics in a clear, simple way and make sure my students really understand before moving on. One of my students went from a grade 3 to a grade 6 in just two months, an...",
    price: 24,
    rating: 5,
    image: image,
  },
  {
    id: 3,
    name: "Jenny Wilson",
    subject: "Mathematics, English Expert",
    description:
      "Hello, I'm Abdullah. I'm a friendly and patient GCSE Maths tutor who loves helping students feel more confident with maths. I explain topics in a clear, simple way and make sure my students really understand before moving on. One of my students went from a grade 3 to a grade 6 in just two months, an...",
    price: 24,
    rating: 5,
    image: image,
  },
  {
    id: 4,
    name: "Wade Warren",
    subject: "Mathematics, English Expert",
    description:
      "Hello, I'm Abdullah. I'm a friendly and patient GCSE Maths tutor who loves helping students feel more confident with maths. I explain topics in a clear, simple way and make sure my students really understand before moving on. One of my students went from a grade 3 to a grade 6 in just two months, an...",
    price: 24,
    rating: 5,
    image: image,
  },
];

const FIndTutorPage = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const filteredTutors = tutorsData
    .filter(
      (tutor) =>
        tutor.name.toLowerCase().includes(search.toLowerCase()) &&
        tutor.price >= priceRange[0] &&
        tutor.price <= priceRange[1] &&
        tutor.rating >= ratingFilter
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  const ratingsOptions = [
    { value: 5, label: "5 stars" },
    { value: 4, label: "4 stars & up" },
    { value: 3, label: "3 stars & up" },
    { value: 0, label: "All Ratings" },
  ];

  return (
    <section className='bg-[#EDE7FB3D]'>
      <div className='max-w-7xl mx-auto p-6 '>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-semibold'>Meet Our Tutors</h1>
          <p className='text-gray-500'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {/* Filters */}

        <div className='md:flex  justify-between gap-12'>
          <section>
            <div className='w-full md:w-64 bg-white p-4 rounded-md'>
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold '>Filters</h3>
                <button
                  onClick={() => {
                    setSearch("");
                    setSort("");
                    setPriceRange([0, 100]);
                    setRatingFilter(0);
                  }}
                  className='text-purple-600 font-bold hover:underline text-sm '>
                  Clear Everything
                </button>
              </div>
              <div className='mb-4 mt-16'>
                <label className='font-bold text-lg '>Price Range</label>
                <div className='flex justify-between mt-2 text-sm'>
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input
                  type='range'
                  min={0}
                  max={100}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className='w-full bg-[#CCB7F8] mt-2'
                />
              </div>

              <div className='p-4 w-full max-w-sm'>
                <h3 className='font-medium mb-2'>Ratings</h3>

                <div className='flex flex-col gap-2 mb-4'>
                  {ratingsOptions.map((option) => (
                    <label
                      key={option.value}
                      className='flex items-center gap-2 cursor-pointer group'>
                      {/* Radio button on left side */}
                      <div className='relative flex items-center justify-center'>
                        <input
                          type='radio'
                          name='rating'
                          value={option.value}
                          checked={ratingFilter === option.value}
                          onChange={() => setRatingFilter(option.value)}
                          className='hidden'
                        />

                        {/* Custom radio button */}
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
            ${
              ratingFilter === option.value
                ? "border-[#3A0E95] bg-[#3A0E95]"
                : "border-gray-400 bg-white group-hover:border-[#3A0E95]"
            }`}></div>
                      </div>

                      {/* Stars and label */}
                      <div className='flex items-center ml-2'>
                        {option.value !== 0 && (
                          <>
                            <div className='flex items-center'>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                  key={star}
                                  className={`${
                                    star <= option.value
                                      ? "text-[#F78D25]"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}

                        {option.value === 0 && (
                          <span className='text-gray-700'>{option.label}</span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  onClick={() => applyFilter(ratingFilter)}
                  className='w-full bg-[#CCB7F8] font-semibold text-[#3A0E95] py-2 px-4 rounded transition hover:bg-[#BBA5E9]'>
                  Apply Filters
                </button>
              </div>
            </div>
          </section>

          <section>
            <section className=''>
              <div className='flex flex-col md:flex-row gap-6 mb-6'>
                {/* Search & Sort */}
                <div className='flex-1 bg-white p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center'>
                  <div className='flex flex-1 border border-[#D8DCE1] rounded p-2 items-center'>
                    <AiOutlineSearch className='text-gray-400 mr-2' />
                    <input
                      type='text'
                      placeholder='Search by name...'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className='flex-1 outline-none'
                    />
                  </div>
                  {/* <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-[#D8DCE1] rounded p-2"
                >
                  <option value="">Sort by</option>
                  <option value="price-asc">A Lavel</option>
                  <option value="price-desc">GCSE</option>
                </select> */}
                  <select className='border border-[#D8DCE1] rounded p-2'>
                    <option>Sort by Subject</option>
                    <option>Mathematics</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Tutor Cards */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              {filteredTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className='bg-white rounded-lg p-4 flex flex-col'>
                  <div className='flex items-center gap-3 mb-2'>
                    <div>
                      <h4 className='font-semibold'>{tutor.name}</h4>
                      <p className='text-gray-500 text-sm'>{tutor.subject}</p>
                    </div>

                    <Image
                      src={tutor.image}
                      alt={tutor.name}
                      width={300}
                      height={300}
                      className='w-12 h-12 rounded-full object-cover'
                    />
                  </div>
                  <p className='text-[#666666] leading-loose  mb-2 mt-4 line-clamp-4'>
                    {tutor.description}
                  </p>
                  <p className='font-semibold text-[20px] mb-2 pt-6 pb-4'>
                    ${tutor.price}
                  </p>
                  <Link href={"/find-tutor/845"}>
                    <button className='mt-auto max-w-35 cursor-pointer flex items-center gap-4  bg-[#CCB7F8]  py-2 whitespace-nowrap px-6 rounded text-[#3A0E95]'>
                      <span>Book Now</span>
                      <span>
                        <FaArrowRight className='text-lg' />
                      </span>
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default FIndTutorPage;
