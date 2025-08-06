// @ts-nocheck
"use client";
import { job } from "@/app/Data/job";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { div } from "framer-motion/client";
import JobApplyBtn from "@/app/components/job-apply-btn";
import ViewJobApplicant from "@/app/components/view-job-applicant";

export default function Page() {
  const params = useParams();
  const search = params.id;
  const [job, setJob] = useState(null)
  useEffect(() => {
    const id = search;
    console.log(id);
    // http://localhost:3000/jobs/c0xizc2Eo3UcGInwAAAAAA==
    const url = `http://localhost:3000/api/job/${id}`
    async function fetchData() {
      const res = await fetch(url);
      const data = await res.json();
      console.log("data", data);
      setJob(data.data);
      console.log("job props for the applicant", data.data)

    }
    fetchData();
  }, [])





  return (

    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-indigo-700 py-10 px-4 text-white">
      {job && (
        <div className="max-w-4xl mx-auto bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">{job.title}</h2>
              <p className="text-white/80">{job.category}</p>
              <p className="text-white/70 text-sm">
                Location: {job.location || "N/A"} | Type: {job.job_type}
              </p>
            </div>

          </div>
          <div className="flex w-full z">
            <a
              href={job.apply_link}
              target="_blank"
              className="bg-black px-5 py-2  w-[20vh]  mb-4 rounded hover:bg-gray-800 transition text-white text-sm"
            >
              External Apply Now
            </a>
            <JobApplyBtn job={job} />
            <ViewJobApplicant job={job} />
          </div>


          {/* Description */}
          <div>
            <h3 className="text-xl font-semibold mb-2 mt-5 ">Job Description</h3>
            <p className="text-white/90 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-white/90">
                {job.responsibilities
                  .split(/[\n•]/) // split on newline or bullet
                  .map((r, idx) => r.trim()) // remove extra spaces
                  .filter((r) => r.length > 0) // skip empty lines
                  .map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Qualifications */}
          {job.qualifications && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Qualifications</h3>
              <ul className="list-disc list-inside space-y-1 text-white/90">
                {job.qualifications
                  .split(/[\n•]/)
                  .map((q, idx) => q.trim())
                  .filter((q) => q.length > 0)
                  .map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
              </ul>
            </div>
          )}

          {/* Salary */}
          {job.salary && (
            <p className="text-white text-lg">
              💰 <strong>Estimated Salary:</strong> ${job.salary.toLocaleString()}
            </p>
          )}

          {/* Footer CTA */}
          <div className="pt-4">
            <a
              href={job.apply_link}
              target="_blank"
              className="bg-black px-6 py-3 rounded text-white hover:bg-gray-800 transition text-lg"
            >
              Apply Now
            </a>
          </div>
        </div>
      )}


    </div>
  );
}
