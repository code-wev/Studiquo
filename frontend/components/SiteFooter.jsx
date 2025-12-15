"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaXTwitter, FaFacebookF, FaWhatsapp } from "react-icons/fa6";

export default function SiteFooter() {

    const pathname = usePathname();
    if(pathname.includes('dashboard')){
      return null;
    }
  return (
    <footer className="w-full bg-[#444141] text-white">
      <div className="mx-auto px-4 md:px-16 pt-10 pb-6 border-b border-[#585252]">
        <div className="flex flex-col md:flex-row gap-y-5 justify-between md:items-start">
          {/* Left: logo + text */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <p className="text-2xl font-semibold">
                Studiquo - Your perfect home for tutors!
              </p>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-gray-200">
              We’re dedicated to bridging the gap between skilled professionals
              and employers seeking excellence. Our platform streamlines
              recruitment and empowers applicants to showcase their talent.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 pt-1">
              <button className="flex h-6 w-6 items-center justify-center rounded bg-white/95 text-[12px] text-[#3D3736] shadow-sm">
                <FaXTwitter />
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded bg-white/95 text-[12px] text-[#3D3736] shadow-sm">
                <FaFacebookF />
              </button>
              <button className="flex h-6 w-6 items-center justify-center rounded bg-white/95 text-[12px] text-[#3D3736] shadow-sm">
                <FaWhatsapp />
              </button>
            </div>
          </div>

          {/* Middle: Pages */}
          <div className="space-y-3 ">
            <h4 className="text-lg font-semibold">Pages</h4>
            <div className="flex flex-col space-y-2 text-[12px] text-gray-200">
              <Link href={"/"} className="cursor-pointer hover:text-white text-sm">Home</Link>
              <Link href={"/about"} className="cursor-pointer hover:text-white text-sm">About</Link>
              <Link href={"/how-its-works"} className="cursor-pointer hover:text-white text-sm">Find a tutor</Link>
              <Link href={"/contact"} className="cursor-pointer hover:text-white text-sm">Contact</Link>
            </div>
          </div>

          {/* Right: Contact */}
          <div className="space-y-3 md:text-right">
            <h4 className="text-lg font-semibold">Contact Information</h4>
            <div className="space-y-1 text-sm text-gray-200">
              <p>
                Email:{" "}
                <a
                  href="mailto:john.doe@gmail.com"
                  className="hover:text-white"
                >
                  john.doe@gmail.com
                </a>
              </p>
              <p>888 333 6654</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex px-4 md:px-16 flex-col gap-2 pb-4 pt-3 text-[11px] text-gray-300 md:flex-row md:items-center md:justify-between">
        <p>All rights reserved by: Studiquo</p>
        <button className="self-start md:self-auto hover:text-white">
          Privacy Policy
        </button>
      </div>
    </footer>
  );
}