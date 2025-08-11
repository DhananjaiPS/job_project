// @ts-nocheck
"use client";

import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { FaFileAlt, FaListUl } from "react-icons/fa";
import DeleleApplyBtn from "@/app/components/apply-delete-btn";
import ViewJobApplicant from "@/app/components/view-job-applicant";
import { UserContext } from "../../layout";

export default function Page() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { user } = useContext(UserContext)
  const company_id = user.
    company_id
    const [companyOwner,setCompanyOwner]=useState("")
  console.log("user of job details :", user)
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`http://localhost:3000/api/job/${id}`);
        const data = await res.json();
        setJob(data.data);
        setUserHasApplied(data?.data?.UserHasApplied);
        setCompanyOwner(data.data.company_id)
        console.log(data.data.company_id)
      } catch (error) {
        console.error("Error fetching job:", error);
      }
    }
    fetchJob();
  }, [id]);
  function handelEdit(){
    alert("edit clicked")
  }
  function handelDelete(){
    alert("delete clicked")
  }
  if (!job) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 to-indigo-700 py-10 px-4 text-white">
      <div className="max-w-full mx-auto bg-pink/20 backdrop-blur-md rounded-2xl shadow-2xl p-2 pb-10 space-y-6">

        {/* Header + Admin Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">{job.title}</h2>
            <p className="text-white/80">{job.category}</p>
            <p className="text-white/70 text-sm">
              Location: {job.location || "N/A"} | Type: {job.job_type}
            </p>
          </div>
          <div>
            {!!(company_id==companyOwner) &&  <DropdownMenu.Root color="white">
              <DropdownMenu.Trigger >


                <button className="flex justify-center items-center gap-3 bg-white text-blue-500 p-2">
                  Options
                  <DropdownMenu.TriggerIcon />
                </button>

              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item shortcut="⌘ E" asChild>
                  <p onClick={handelEdit}>Edit</p>
                  </DropdownMenu.Item>


                <DropdownMenu.Separator />

                <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item shortcut="⌘ ⌫" color="red" asChild> 
                  <p onClick={handelDelete}>Delete</p>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>}
           

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={job.apply_link}
            target="_blank"
            className="px-5 py-2 w-full  sm:w-[30vh]   rounded justify-center hover:bg-gray-800 transition h-[5vh] text-sm   items-center flex bg-white text-blue-600"
          >
            External Apply Now
          </a>
          <DeleleApplyBtn UserHasApplied={userHasApplied} job={job} />
          <ViewJobApplicant job={job} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-white/30 pb-2 w-[100%] ">
          <button
            className={`pb-1 ${activeTab === "description" ? "border-b-2 border-white font-semibold" : ""}`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          {job.responsibilities && (
            <button
              className={`pb-1 ${activeTab === "responsibilities" ? "border-b-2 border-white font-semibold" : ""}`}
              onClick={() => setActiveTab("responsibilities")}
            >
              Responsibilities
            </button>
          )}
          {job.qualifications && (
            <button
              className={`pb-1 ${activeTab === "qualifications" ? "border-b-2 border-white font-semibold" : ""}`}
              onClick={() => setActiveTab("qualifications")}
            >
              Qualifications
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "description" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center gap-3">
                <FaFileAlt className="text-xl text-cyan-300" />
                <h3 className="text-2xl font-semibold">Job Description</h3>
              </div>
              <p className="text-white/90 leading-relaxed whitespace-pre-line">{job.description}</p>
            </motion.div>
          )}

          {activeTab === "responsibilities" && job.responsibilities && (
            <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-3">
                <FaListUl className="text-xl text-purple-300" />
                <h3 className="text-2xl font-semibold">Responsibilities</h3>
              </div>
              {job.responsibilities
                .split(/[\n•]/)
                .filter(r => r.trim())
                .map((r, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-white/70 flex-shrink-0" />
                    <span>{r.trim()}</span>
                  </motion.li>
                ))}
            </motion.ul>
          )}

          {activeTab === "qualifications" && job.qualifications && (
            <motion.ul initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="flex items-center gap-3">
                <FaListUl className="text-xl text-yellow-300" />
                <h3 className="text-2xl font-semibold">Qualifications</h3>
              </div>
              {job.qualifications
                .split(/[\n•]/)
                .filter(q => q.trim())
                .map((q, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-white/70 flex-shrink-0" />
                    <span>{q.trim()}</span>
                  </motion.li>
                ))}
            </motion.ul>
          )}
        </div>

        {/* Salary */}
        {job.salary && (
          <p className="text-white text-lg">
            <strong>Estimated Salary:</strong> ${job.salary.toLocaleString()}
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
    </div>
  );
}
