"use client";

import AddJobButton from "@/app/components/buttons/AddJobButton";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { company, opening } from "../../../../generated/prisma";
import { GrLinkNext } from "react-icons/gr";
import { FaMapMarkerAlt, FaBriefcase, FaClock } from "react-icons/fa";

type OpeningWithCompany = opening & { company?: company };

export default function Page() {
  const [jobsFromDb, setJobsFromDb] = useState<OpeningWithCompany[]>([]);
  const [scroll, setScroll] = useState(false);
  const addBtnRef = useRef<HTMLDivElement | null>(null);

  function handelAfterTheAddToJobBtnFinishItsWorking(newJob: any) {


    setJobsFromDb((prev) => {

      if (newJob.removeTempId) {
        return prev.filter((job) => job.id !== newJob.removeTempId);
      }


      if (newJob.tempId) {
        return prev.map((job) =>
          job.id === newJob.tempId
            ? {
              ...job,        // keep old optimistic fields (like company, description)
              ...newJob,     // replace with server job
              id: newJob.id, // overwrite tempId with real db id
            }
            : job
        );
      }

      // console.log("Optimistice Job :",newJob)
      return [...prev, newJob];
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/addJobs");
        const data = await res.json();
        if (data.success) {
          setJobsFromDb(data.data);
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Error fetching jobs: " + err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!addBtnRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // if button is visible => scroll is false, if not visible => scroll is true
        setScroll(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(addBtnRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 relative">
      {/* Hero section */}
      <section className="relative w-full bg-blue-600 h-[450px] sm:h-[350px] md:h-[350px] flex items-center justify-center">
        <img
          src="/job9.png"
          alt="Jobs Hero"
          className="absolute inset-0 w-full h-full object-cover object-center sm:object-contain opacity-30"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-white text-3xl sm:text-4xl font-bold drop-shadow">
            Find Your Next Opportunity
          </h1>
          <p className="text-white mt-2 sm:text-lg">
            Senior Design Engineers • Remote • Full-Time • Internships
          </p>
          <div ref={addBtnRef} className="mt-15">
            {/* Top normal button */}
            <AddJobButton scroll={false} onJobAdded={handelAfterTheAddToJobBtnFinishItsWorking} />
          </div>
        </div>
      </section>

      {/* Job listings */}
      <section className="max-w-5xl flex justify-center flex-col mx-auto px-2 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Latest Job Openings
        </h2>

        {jobsFromDb.length === 0 ? (
          <p className="text-gray-600">No jobs posted yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsFromDb.map((item, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white shadow-md rounded-xl p-6 border hover:shadow-lg transition-all duration-300 w-[49vh] h-[30vh]"
              >
                <Link href={`/jobs/${item.id}`}>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm mb-4 leading-relaxed line-clamp-1">
                      {item.description?.slice(0, 100) ?? "No description available"}
                    </p>
                    <div className="text-sm flex gap-4 items-center">
                      <div className="w-[10vh] flex items-center gap-2">
                        <FaMapMarkerAlt className="flex-shrink-0" />
                        <span className="truncate overflow-hidden whitespace-nowrap">
                          {item.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaBriefcase />
                        <span>{item.job_type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaClock />
                        <span>{item.employment_type}</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="mt-4 bg-amber-300">
                  {item.company ? (
                    <Link href={`/company/${item.company.id}`}>
                      <div className="bg-white w-full text-blue-600 p-2 hover:underline font-medium rounded flex items-center justify-between">
                        <p className="capitalize">{item.company.name}</p>
                        <GrLinkNext />
                      </div>
                    </Link>
                  ) : (
                    <span className="text-gray-400 italic text-sm">
                      Company data unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {scroll && (
        <div className="fixed bottom-6 right-6 z-50">
          <AddJobButton
            scroll={true}
            onJobAdded={handelAfterTheAddToJobBtnFinishItsWorking}
          />
        </div>
      )}
    </main>
  );
}
