import React from 'react';
import leftImage from '@/public/aboutpage.png'
import Image from 'next/image';
import rounded from '@/public/rounded.png'
import rounded2 from '@/public/rounded2.png'
import rounded3 from '@/public/rounded5.png'

const AboutBanner = () => {
    return (
      <div className='bg-[#EEE7FD] relative '>
          <div className=' min-h-screen z-50 overflow-hidden md:px-16 max-w-[1820px] mx-auto flex flex-col-reverse lg:flex-row items-center '>
        <secton className="lg:flex-1">
             <div className='relative z-50'>
                   <Image src={leftImage}  alt='image' className='z-50' />
                       <Image src={rounded} alt='image' className='absolute -z-50 -right-24 hidden lg:block top-64'/>
                
             </div>
           
                  <Image src={rounded2} alt='image' className='absolute left-0   top-[500px]'/>
        </secton>
        <secton className="lg:flex-1 relative text-center lg:text-left pt-28  pb-16 lg:pt-0 lg:pb-0  z-50">
            <div>
                <h4 className='text-[#444141] md:leading-24 font-bold  text-5xl md:text-7xl relative'>About us and <br /> our services</h4>
         
            </div>
            <p className='md:text-2xl font-bold mt-4'>We built this platform to connect students with expert tutors who inspire confidence, curiosity, and academic success.</p>
          
          

        </secton>
                 <Image alt='image' src={ rounded3} className='absolute top-28 right-0  hidden lg:block'/>
        </div>
      </div>
    );
};

export default AboutBanner;