"use client";
import { div, input } from "framer-motion/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {  UserContext } from "../layout";
import { MainContext } from "@/app/layout";
import { BsFilterLeft } from "react-icons/bs";
export default function JobSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {user}=useContext(UserContext);
  const {email}=useContext(MainContext)
  console.log("Main context email :",email)
  console.log(user)
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  //suggestion via  api
  // const [suggestion,setSuggestion]=useState([
  //   {id:123,title:"I am your Suggestion"}
  // ]);

  // const input= searchParams.get("search") || "";
  // useEffect(()=>{

  //   async function getSuggestion() {
  //     const res=await fetch("http://localhost:3000/api/search/suggestion?q="+input)
  //     console.log(res);
  //     const data=await res.json();
  //     if(data.success){

  //       setSuggestion(data.data);
  //       console.log("Suggestions :",data.data);
  //     }
  //     else{
  //       console.log("suggestions not found");
  //     }
      
  //   }
  //   getSuggestion();
  // },[input])

  // Filters
  const [search, setSearch] = useState("developer");
  const [jobType, setJobType] = useState("fulltime");
  const [minSalary, setMinSalary] = useState(1000);
  const [employmentType, setEmploymentType] = useState("any");
  const [toggleFilters,setToggleFilters]=useState(false)

  // Sync filters with URL
  useEffect(() => {
    const q = searchParams.get("search") || "developer";
    const jt = searchParams.get("jt") || "fulltime";
    const et = searchParams.get("et") || "any";
    const ms = searchParams.get("ms") || "1000";

    setSearch(q);
    setJobType(jt);
    setEmploymentType(et);
    setMinSalary(Number(ms));
  }, [searchParams]);




//suggestion via  api

  // const input= searchParams.get("search") || "";


  const [suggestion,setSuggestion]=useState([]);
  useEffect(()=>{

    async function getSuggestion() {
      const res=await fetch("http://localhost:3000/api/search/suggestion?q="+search)
      console.log(res);
      const data=await res.json();
      if(data.success){

        setSuggestion(data.data);
        console.log("Suggestions :",data.data);
      }
      else{
        console.log("suggestions not found");
      }
      
    }

    //normal
    // getSuggestion();


    // debouncing 
    console.log(search)
    let x
    if(search){
      x=setTimeout(()=>{
        getSuggestion();
      },3000)

    }

    else{
      setSuggestion([]);
    }


    return ()=>{
      console.log("x",x)
      if(x){
        clearTimeout(x);
      }
    }
  },[search])





  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `/api/job?search=${search}&jt=${jobType}&et=${employmentType}&ms=${minSalary}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setJobs(data.data);
          console.log(data);
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

    fetchJobs();
  }, [search, jobType, employmentType, minSalary]);

  // Update URL on filter change
  async function handleApplyFilters() {
    router.push(
      `/jobs?search=${search}&jt=${jobType}&et=${employmentType}&ms=${minSalary}`
    );
   
  }
  useEffect(() => {
  const q = searchParams.get("search") || "dev";
  const jt = searchParams.get("jt") || "on site";
  const et = searchParams.get("et") || "full";
  const ms = searchParams.get("ms") || "1000";

  setSearch(q);
  setJobType(jt);
  setEmploymentType(et);
  setMinSalary(Number(ms));
}, [searchParams]);
console.log(toggleFilters)

  return (
    <div className="min-h-screen bg-gray-50 p-4 w-full">
      {/* //Suggestion */}
      <BsFilterLeft size={32} onClick={()=>setToggleFilters(prev=>!prev)}/>
      {suggestion && <div>
        
        {suggestion.map((item,index)=>{
          return (
            <div>{item.title}</div>
          )
        })}
        </div>}
      <div className="max-w-full mx-auto flex gap-3 ">
        {/* Filter Section */}
        {toggleFilters && 
         <div className="mb-8 p-4 absolute bg-white rounded shadow w-fit">
          <h2 className="text-lg font-semibold text-indigo-700 mb-4">Filters</h2>

          {/* Search Input */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Search</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Job Type Radio */}
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

          {/* Minimum Salary */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Minimum Salary ($)</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
            />
          </div>

          {/* Employment Type */}
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
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
          >
            Apply Filters
          </button>
        </div>
        }
       

        {/* Job Results */}
        {loading && <p className="text-center">Loading jobs...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && jobs.length === 0 && <p className="text-center">No jobs found</p>}
        {!loading && jobs.length > 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  w-full">
          {jobs.map((job, i) => (
            <div key={i} className="bg-white shadow rounded p-4 flex flex-col">
              <div className="flex">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.category}</p>
                </div>
                <img src={job.logo || "https://w7.pngwing.com/pngs/511/605/png-transparent-in-logo-linkedin-diduco-ab-icon-linkedin-blue-angle-text-thumbnail.png"} alt="logo" className="w-[18vh] h-[5vh] object-contain object-right" />
              </div>


              <div className="mt-2 text-sm">
                <p>Location: {job.location}</p>
                <p>Type: {job.job_type}</p>
                <p>Employment: {job.employment_type}</p>

              </div>
              <p className="text-gray-700 mt-2 line-clamp-3">
                {job.
                  description
                  ?.slice(0, 100)}...
              </p>
              <div className="mt-auto space-y-2 pt-4">
                <a
                  href={`/jobs/${job.id}`}
                  className="block bg-indigo-600 text-white text-center py-2 rounded hover:bg-indigo-700"
                >
                  View Details
                </a>
                <a
                  href={job.
                    apply_link
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border text-center py-2 rounded border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                 external Apply link
                </a>
              </div>
            </div>
          ))}
        </div>}
        
      </div>
    </div>
  );
}
