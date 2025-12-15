"use client";

import Link from "next/link";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";
import { CiLinkedin, CiFacebook } from "react-icons/ci";
import { usePathname } from "next/navigation";

export default function Footer() {
    const pathname = usePathname();
    if(pathname.includes('dashboard')){
      return null;
    }
  return (
    <div className="relative bg-[#0F1729]">
      <div className="animate-gradient-x text-white">
        <footer className="footer footer-center pt-20  mx-auto">

          <div className="flex flex-col md:flex-row items-start md:justify-between pl-4 mx-auto text-white space-y-5">

            {/* About Us */}
            <div className="text-start space-y-3">
              <h3 className="text-xl font-bold">
                <span className="logoColor">A</span>bout Us
              </h3>

              <p className="text-base md:text-lg text-gray-300">
                We’re GyanFlow — a passionate team transforming <br />
                learning through smart, tech-driven experiences.
              </p>

              <div className="mt-8 text-base md:text-lg text-gray-300">
                <h2>Address</h2>
                <p>Level-4, 34, Awal Centre, Banani, Dhaka</p>
                <p>Support: gyanflow5.com</p>
                <p>(Available : 10:00am to 07:00pm)</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-start space-y-3">
              <h3 className="text-xl font-bold">
                <span className="logoColor">Q</span>uick Links
              </h3>

              <ul className="text-base md:text-lg text-gray-300 md:list-disc md:ml-6 space-y-2">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/career">Career</Link></li>
                <li><Link href="/support">Contact</Link></li>
                <li><Link href="/helpDesk">Help-Desk</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="text-start space-y-3">
              <h3 className="font-bold text-xl">
                <span className="logoColor">F</span>ollow Us
              </h3>

              <div className="flex gap-3 mt-6">
                <a href="https://github.com/abuhayat02" target="_blank">
                  <FaGithub className="text-4xl" />
                </a>

                <a href="https://www.linkedin.com/in/ankonchybd/" target="_blank">
                  <CiLinkedin className="text-4xl" />
                </a>

                <a href="https://www.facebook.com/lilaranii" target="_blank">
                  <CiFacebook className="text-4xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="md:flex justify-between relative mt-10 w-full">
            <div>
              <h2>Pay with</h2>

              <Image
                src="/home/gateway.png"
                alt="SSL Commerze"
                width={200}
                height={60}
                className="object-contain mt-2"
                priority={false}
              />
            </div>

            <p className="text-gray-400 pb-7 md:absolute bottom-0 md:right-0 p-2 text-xs md:text-lg">
              ©2025 STUDIQUO — All Rights Reserved 💞
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
