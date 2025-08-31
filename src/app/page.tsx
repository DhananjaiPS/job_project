
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Drawer from "../components/Drawer";
// import { job as localJobs } from "@/app/Data/job";
import { UserContext } from "@/app/(group)/layout";
import { motion } from "framer-motion";
import { Rocket, Users, Star } from "lucide-react";
import { Heading, Text, Flex, Card, Button } from "@radix-ui/themes";
import { FcProcess } from "react-icons/fc";
import Carousel from "@/app/components/Carousel";
import Navbar from "@/app/components/Navbar";

import Footer from "@/app/components/Footer";

// Custom hook for fetching jobs
function useFetchJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const url = `https://jsearch.p.rapidapi.com/search?query=developer%20jobs%20in%20chicago&page=1&num_pages=1&country=us&date_posted=all`;
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
  //       "x-rapidapi-host": "jsearch.p.rapidapi.com",
  //     },
  //   };

  //   async function fetchJobs() {
  //     try {
  //       const res = await fetch(url, options);
  //       const data = await res.json();
  //       setJobs(Array.isArray(data.data) ? data.data : []);
  //     } catch (err) {
  //       console.error("API Fetch Error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchJobs();
  // }, []);

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
      <Navbar/>
      <Carousel />
      <main className="px-4 md:px-24 py-8 overflow-hidden">
        {/* <div><img src="job8.png" alt="job" /></div> */}
        <section className="text-center space-y-6">

          <h1 className="text-3xl sm:text-6xl font-extrabold ">Find Jobs That Matter</h1>
          <div className="flex flex-col gap-2 ">



            <Text size="5" className="sm:py-4 text-gray-600">
              Connecting professionals with top companies for the best opportunities
            </Text>
            <Flex justify="center" gap="4">
              <Link href="/jobs?search=engineer">
                <Button size="3" color="blue">Explore Jobs</Button>
              </Link>
              <Link href="/addJobs">
                <Button size="3" variant="surface">Post a Job</Button>
              </Link>
            </Flex>
          </div>

        </section>

        {/* Features Section */}
        <section className="mt-4 w-[100%]">
          <Heading size="6" className="pb-3 text-center">Why Choose Job.ai?</Heading>
          <Flex wrap="wrap" gap="6" justify="center">
            {[
              { icon: Rocket, color: "text-blue-500", title: "Quick Applications", desc: "Apply to jobs in seconds with your JobNest profile." },
              { icon: FcProcess, color: "", title: "All in One Solution", desc: "We ensure you dont take the stress instead we do." },
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

      </main>
      <Footer />


    </div>
  );
}
