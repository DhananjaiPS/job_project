"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Drawer from "../components/Drawer";
import { job as localJobs } from "@/app/Data/job";
import { UserContext } from "./layout";
import { motion } from "framer-motion";
import { Rocket, Users, Star } from "lucide-react";
import { Heading, Text, Flex, Card, Button } from "@radix-ui/themes";
import Carousel from "@/app/components/Carousel";

// Custom hook for fetching jobs
function useFetchJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all`;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
        "x-rapidapi-host": "jsearch.p.rapidapi.com",
      },
    };

    async function fetchJobs() {
      try {
        const res = await fetch(url, options);
        const data = await res.json();
        setJobs(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  return { jobs, loading };
}

export default function Home() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [input, setInput] = useState("");
  const { jobs: apiJobs, loading } = useFetchJobs();

  function handleSearch() {
    if (input.trim()) router.push(`/jobs?search=${input}`);
  }

  function handleSaveJob(jobItem: any) {
    const savedJobs = JSON.parse(localStorage.getItem("job") || "[]");
    const alreadySaved = savedJobs.some((j: any) => j.job_id === jobItem.job_id);

    if (alreadySaved) {
      alert("This job is already saved.");
    } else {
      localStorage.setItem("job", JSON.stringify([...savedJobs, jobItem]));
      alert("Job saved successfully!");
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <Carousel/>
       <main className="px-4 md:px-24 py-8 overflow-hidden">
        <div><img src="job8.png" alt="job" /></div>
        <section className="text-center space-y-6">
          
          <h1  className="text-3xl sm:text-6xl font-extrabold ">Find Jobs That Matter</h1>
          <div className="flex flex-col gap-2 ">

          

          <Text size="5" className="sm:py-4 text-gray-600">
            Connecting professionals with top companies for the best opportunities
          </Text>
          <Flex justify="center" gap="4">
            <Link href="/jobs">
              <Button size="3" color="blue">Explore Jobs</Button>
            </Link>
            <Link href="#">
              <Button size="3" variant="surface">Post a Job</Button>
            </Link>
          </Flex>
          </div>

        </section>

        {/* Features Section */}
        <section className="mt-4 w-[100%]">
          <Heading size="6" className="pb-3 text-center">Why Choose Jobzz?</Heading>
          <Flex wrap="wrap" gap="6" justify="center">
            {[
              { icon: Rocket, color: "text-blue-500", title: "Quick Applications", desc: "Apply to jobs in seconds with your JobNest profile." },
              { icon: Users, color: "text-green-500", title: "Verified Companies", desc: "All employers are verified to ensure real opportunities." },
              { icon: Star, color: "text-yellow-500", title: "Top Talent Network", desc: "Join a platform trusted by over 50,000 professionals." }
            ].map((feature, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1 }}>
                <Card size="3" className="w-95">
                  <Flex direction="column" gap="3">
                    <feature.icon className={feature.color} size={32} />
                    <Heading size="4">{feature.title}</Heading>
                    <Text>{feature.desc}</Text>
                  </Flex>
                </Card>
              </motion.div>
            ))}
          </Flex>
        </section>

        {/* Search Section */}
        {/* <div className="relative w-full h-[70vh] sm:h-[80vh] mt-10">
          <img src="/hero1.jpg" alt="Hero Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-center">
            <h1 className="text-white font-bold text-2xl sm:text-4xl md:text-5xl mb-4">
              Find Your Dream Job with RapidJobs
            </h1>
            <p className="text-white text-sm sm:text-base md:text-lg max-w-2xl mb-6">
              Discover thousands of opportunities tailored to your skills and interests.
            </p>
            <div className="flex w-full max-w-xl gap-2">
              <input
                type="text"
                placeholder="Search job title..."
                className="flex-1 p-3 rounded-md bg-white text-black"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div> */}

        {/* Latest Jobs */}
        {/* <section className="py-10 bg-gradient-to-b from-white to-blue-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold">Latest Job Opportunities</h2>
            <p className="text-gray-600 mt-2">Explore top openings curated just for you</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading jobs...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[...localJobs, ...apiJobs].map((item) => (
                <div
                  key={item.job_id}
                  className="bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold line-clamp-1">
                      {item.job_title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.employer_name}</p>
                    <img
                      src={item.employer_logo || "/default-logo.png"}
                      alt={`${item.employer_name} logo`}
                      className="w-[10vh] h-[8vh] mt-2 object-cover"
                    />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/jobs/${item.job_id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
                        More Details
                      </button>
                    </Link>
                    <a
                      href={item.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md"
                    >
                      Apply Now
                    </a>
                    <button
                      onClick={() => handleSaveJob(item)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section> */}
      </main>
      <div>
        <img src="/job1.png" alt="Job Hero" />
      </div>

      {/* Intro Section */}
     
    </div>
  );
}
