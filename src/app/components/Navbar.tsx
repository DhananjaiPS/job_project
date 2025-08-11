"use client";

import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Drawer from './Drawer';
import LoginButton from "@/app/components/LoginButton"
import { UserContext } from '../(group)/layout';
import { ImBriefcase } from "react-icons/im";
export default function Navbar() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const context = useContext(UserContext);

  if (!context) {
    alert("context is undefined ")
    return null;

  }
  const { user } = context;

  const { email } = user
  console.log("Navbar", user)
  function handleSearch() {
    if (input.trim() !== "") {
      router.push(`/jobs?search=${input}&jt=&et=&ms=`);
    }
  }

  return (
    <nav className="w-full bg-gradient-to-r from-blue-300 to-blue-500 text-white shadow-lg py-3 px-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-2">
        <span > <ImBriefcase size={32} /></span>
        <span className='hidden  sm:flex text-3xl font-bold pl-3'> Job.io</span>


        {/* <Image
          src="/Rapid_Logo_Primary.png"
          alt="Rapid Logo"
          width={120}
          height={30}
          className="rounded object-contain flex"
        /> */}
        {/* <span className="font-bold text-xl">RapidJobs</span> */}
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center">
       
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2 bg-white rounded px-2 py-1 sm:w-[70vh] relative">
        <input
          type="text"
          placeholder="Enter job title..."
          className="bg-white focus:outline-none text-black placeholder:text-gray-600 px-2 py-1 w-[150px] sm:w-[200px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition sm:absolute right-5"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className='flex gap-4'>
        <Link href="/saved">
          <button className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded hidden  hover:bg-gray-100 md:flex transition">
            Saved Jobs
          </button>
        </Link>

        <LoginButton />
        <Drawer />
      </div>
    </nav>
  );
}
