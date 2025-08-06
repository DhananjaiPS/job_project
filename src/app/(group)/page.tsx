"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Drawer from "../components/Drawer"; // if used
import { job } from "@/app/Data/job";
import { UserContext } from "./layout";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [arr, setArr] = useState<any[]>([]);
  const {user}=useContext(UserContext)
  console.log("userpage",user);
  function handleSearch() {
    if (input.trim()) {
      router.push(`/jobs?search=${input}`);
    }
  }

  useEffect(() => {
    const url = `https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "84006c21c2msh9045f6f5a4baac8p1682adjsnb130edeb53e6", // Replace with your key
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    };

    async function fetchAll() {
      try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log("API Result:", result); // Debug
        setArr(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        console.error("API error:", err);
        setArr([]);
      }
    }

    fetchAll();
  }, []);

  function handleLocal(obj) {
    const existing = localStorage.getItem("job");
    const parse = existing ? JSON.parse(existing) : [];
    const findObj = parse.some((item) => item.job_id === obj.job_id);
    if (findObj) {
      alert("This job is already saved.");
    } else {
      const updated = [...parse, obj];
      localStorage.setItem("job", JSON.stringify(updated));
      alert("Saved successfully!");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[70vh] sm:h-[80vh]">
        <img
          src="/hero1.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center px-4 sm:px-6 text-center">
          <h1 className="text-white font-bold mb-4 text-2xl sm:text-4xl md:text-5xl">
            Find Your Dream Job with RapidJobs
          </h1>
          <p className="text-white text-sm sm:text-base md:text-lg max-w-2xl mb-6">
            Discover thousands of opportunities tailored to your skills and interests.
          </p>

          <div className="flex w-full max-w-xl gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search job title..."
              className="flex-1 p-3 rounded-md bg-white text-black text-sm sm:text-base focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-3 rounded-md text-sm sm:text-base hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Latest Jobs Section */}
      <section className="py-10 px-4 sm:px-6 bg-gradient-to-b from-white to-blue-100">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
            Latest Job Opportunities
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Explore top openings curated just for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {[...job, ...arr].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                  {item.job_title}
                </h3>
                <p className="text-sm text-gray-600">{item.employer_name}</p>
                <img
                  src={
                    item.employer_logo ||
                    "https://cdn.iconscout.com/icon/free/png-512/free-amazon-1869030-1583154.png?f=webp&w=512"
                  }
                  alt="employer_logo"
                  className="object-cover w-[10vh] h-[8vh] mt-2"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-between mt-auto">
                <Link href={`/jobs/${item.job_id}`}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm">
                    More Details
                  </button>
                </Link>
                <a
                  href={item.job_apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                >
                  Apply Now
                </a>
                <button
                  onClick={() => handleLocal(item)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
