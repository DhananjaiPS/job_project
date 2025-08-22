"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../layout";
import { BsFilterLeft } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";

export default function JobSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useContext(UserContext);
  const email = user?.email;
  type Job = {
    id: string;
    title: string;
    description: string;
    job_type: string;
    employment_type: string;
    location: string;
    salary: number;
    company_id: string;
    category?: string | null;
    logo?: string | null;
    apply_link?: string | null;
  };

  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("");
  const [minSalary, setMinSalary] = useState(0);
  const [employmentType, setEmploymentType] = useState("");
  const [toggleFilters, setToggleFilters] = useState(false);

  const [suggestion, setSuggestion] = useState([]);

  // ------------------- Suggestions -------------------
  useEffect(() => {
    async function getSuggestion() {
      const res = await fetch("/api/search/suggestion?q=" + search);
      const data = await res.json();
      if (data.success) {
        setSuggestion(data.data);
      } else {
        setSuggestion([]);

      }
    }

    let timeout : ReturnType<typeof setTimeout>;
    if (search) {
      timeout = setTimeout(() => {
        getSuggestion();
      }, 3000);
    } else {
      setSuggestion([]);
    }

    return () => clearTimeout(timeout);
  }, [search]);

  // ------------------- Fetch jobs -------------------
  const fetchJobs = async () => {
    if (!search && !jobType && !employmentType && !minSalary) {
      setJobs([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const url = `/api/job?search=${search}&jt=${jobType}&et=${employmentType}&ms=${minSalary}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
      } else {
        setJobs([]);
      }
    } catch (err) {
      setError("Failed to fetch jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on filter changes
  useEffect(() => {
    fetchJobs();
  }, [search, jobType, employmentType, minSalary]);

  // Set filters from URL
  useEffect(() => {
    const q = searchParams.get("search");
    const jt = searchParams.get("jt");
    const et = searchParams.get("et");
    const ms = searchParams.get("ms");

    if (q !== null) setSearch(q);
    if (jt !== null) setJobType(jt);
    if (et !== null) setEmploymentType(et);
    if (ms !== null) setMinSalary(Number(ms));
  }, [searchParams]);

  // Apply filters button
  function handleApplyFilters() {
    router.push(
      `/jobs?search=${search}&jt=${jobType}&et=${employmentType}&ms=${minSalary}`
    );
    fetchJobs(); // Now this works
    setToggleFilters(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      <button
        className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
        onClick={() => setToggleFilters(true)}
      >
        <BsFilterLeft size={24} />
        Filters
      </button>

      <div className="max-w-full mx-auto flex gap-3">
        <AnimatePresence>
          {toggleFilters && (
            <>
              {/* Overlay */}
              <motion.div
                className="fixed inset-0 bg-black bg-opacity-40 z-40"
                onClick={() => setToggleFilters(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* Sliding Panel */}
              <motion.div
                className="fixed top-0 left-0 h-full w-80 bg-white shadow-lg p-6 z-50"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-indigo-700">
                    Filters
                  </h2>
                  <button
                    onClick={() => setToggleFilters(false)}
                    className="text-gray-600 hover:text-red-500"
                  >
                    <IoMdClose size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Search</label>
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Job Type</label>
                  <div className="space-x-4">
                    {["on site", "remote"].map((type) => (
                      <label key={type}>
                        <input
                          type="radio"
                          name="jobType"
                          value={type}
                          checked={jobType === type}
                          onChange={(e) => setJobType(e.target.value)}
                        />
                        <span className="ml-1 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Minimum Salary</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded"
                    value={minSalary}
                    onChange={(e) => setMinSalary(Number(e.target.value))}
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-1 font-medium">Employment Type</label>
                  <select
                    className="w-full border p-2 rounded"
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                  >
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>

                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Job Results */}
        {!loading && jobs.length === 0 && (
          <div className="text-center text-3xl w-full h-screen flex gap-4 items-center flex-col">
            <img
              src="/job10.png"
              alt="job not found"
              className="w-[70vh] h-[50vh] object-contain"
            />
            <Link href={"/"}>
              <button className="flex items-center gap-2 bg-indigo-600 text-white text-xl px-3 py-2 rounded hover:bg-indigo-700">
                Go back to Home Page
              </button>
            </Link>
          </div>
        )}

        {loading && (
          <div className="text-center text-3xl w-full h-screen flex gap-4 items-center flex-col">
            <img
              src="/job11.png"
              alt="loading"
              className="w-[70vh] h-[50vh] object-contain"
            />
            <p className="font-extrabold">Loading...</p>
          </div>
        )}

        {error && (
          <p className="text-center text-red-600 w-full bg-amber-400 h-screen">
            {error}
          </p>
        )}

        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {jobs.map((job, i) => (
              <div key={i} className="shadow rounded p-4 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{job?.title}</h3>
                    <p className="text-sm text-gray-600">{job?.category}</p>
                  </div>
                  <div>
                    <Link href={`/company/${job?.company_id}`}>
                      <img
                        src={
                          job.logo ||
                          "https://w7.pngwing.com/pngs/511/605/png-transparent-in-logo-linkedin-diduco-ab-icon-linkedin-blue-angle-text-thumbnail.png"
                        }
                        alt="logo"
                        className="w-[8vh] h-[5vh] object-contain object-right"
                      />
                    </Link>
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <p>Location: {job?.location}</p>
                  <p>Type: {job?.job_type}</p>
                  <p>Employment: {job?.employment_type}</p>
                </div>

                <p className="text-gray-700 mt-2 line-clamp-3">
                  {job?.description?.slice(0, 100)}...
                </p>

                <div className="mt-auto space-y-2 pt-4">
                  <a
                    href={`/jobs/${job?.id}`}
                    className="block bg-indigo-600 text-white text-center py-2 rounded hover:bg-indigo-700"
                  >
                    View Details
                  </a>
                  <a
                    href={job?.apply_link as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border text-center py-2 rounded border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    External Apply Link
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
