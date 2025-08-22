"use client";
import { MdBookmarkAdd } from "react-icons/md";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Button, DropdownMenu } from "@radix-ui/themes";
import { FaFileAlt, FaListUl } from "react-icons/fa";
import DeleleApplyBtn from "@/app/components/buttons/apply-delete-btn";
import ViewJobApplicant from "@/app/components/view-job-applicant";
import { UserContext } from "../../layout";
import EditJobFormModal from "@/app/components/buttons/EditJobform";
type Job = {
  id: string;
  title: string;
  category: string;
  location?: string;
  job_type: string;
  description?: string;
  responsibilities?: string;
  qualifications?: string;
  salary?: number;
  company_id: string;
  apply_link?: string;
  employment_type?: string;   // added
  job_id?: string | null;     // added
  logo?: string | null;       // added
  UserHasApplied?: boolean;
};

export default function Page() {
  const { id } = useParams<{id:string}>();
  const [job, setJob] = useState<Job | null>(null);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const { user } = useContext(UserContext);
  const company_id = user?.company_id;
  const [companyOwner, setCompanyOwner] = useState("");
  const [ispending, startTransition] = useTransition();
  const [editingJob, setEditingJob] = useState<Job |  null >(null);

  useEffect(() => {
    startTransition(() => {
      async function fetchJob() {
        try {
          const res = await fetch(`/api/job/${id}`);
          const data = await res.json();
          setJob(data.data);
          setUserHasApplied(data?.data?.UserHasApplied);
          setCompanyOwner(data.data.company_id);
        } catch (error) {
          console.error("Error fetching job:", error);
        }
      }
      fetchJob();
    });
  }, [id]);

  async function handelDelete() {
    const url = `/api/job/${id}`;
    const res = await fetch(url, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      alert(data.message);
      window.location.replace("/");
    } else {
      alert(data.message);
    }
  }

  if (!job || ispending) {
    return (
      <p className="w-full h-[90vh] flex justify-center items-center">
        loading...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-6 flex flex-col sm:flex-row overflow-hidden">
      {/* Side image (only desktop) */}
      <img
        src="/pic4.png"
        alt=""
        className="hidden sm:block w-[40%] h-[50vh] object-cover"
      />

      <div className="w-full  sm:w-[60%]  mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-lg sm:text-3xl font-bold text-gray-800 capitalize truncate">
                {job.title}
              </h1>
              <button
                onClick={() => alert("Under Development")}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <MdBookmarkAdd size={25} />
              </button>
            </div>
            <p className="text-gray-600 mt-1 text-sm">{job.category}</p>
            <p className="text-gray-500 mt-1 text-xs sm:text-sm capitalize">
              Location:{" "}
              <span className="font-medium">{job.location || "N/A"}</span> | Type:{" "}
              <span className="font-medium capitalize">{job.job_type}</span>
            </p>
          </div>

          {/* Admin Options */}
          {company_id === job.company_id && (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button className="flex text-sm items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full sm:w-auto justify-center">
                  Options
                  <DropdownMenu.TriggerIcon />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item onClick={() => setEditingJob(job)}>
                  Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item color="red" onClick={handelDelete}>
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
        </div>

        {editingJob && (
          <EditJobFormModal
            job={editingJob}
            onSave={(newJob) => {
              setJob(newJob);
              setEditingJob(null);
            }}
            onCancel={() => setEditingJob(null)}
          />
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {job.apply_link && (
            <a
              href={job.apply_link}
              target="_blank"
              className="bg-blue-500 px-5 py-2 w-full sm:w-auto rounded justify-center hover:bg-gray-800 transition text-white text-sm items-center flex"
            >
              External Apply Now
            </a>
          )}
          <div className="w-full sm:w-auto">
            <DeleleApplyBtn UserHasApplied={userHasApplied} job={job as any} />
          </div>
          <div className="w-full sm:w-auto">
            <ViewJobApplicant job={job} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300 pb-2 overflow-x-auto">
          <button
            className={`pb-2 font-medium ${
              activeTab === "description"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 text-sm"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          {job.responsibilities && (
            <button
              className={`pb-2 font-medium ${
                activeTab === "responsibilities"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("responsibilities")}
            >
              Responsibilities
            </button>
          )}
          {job.qualifications && (
            <button
              className={`pb-2 font-medium ${
                activeTab === "qualifications"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("qualifications")}
            >
              Qualifications
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "description" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-blue-500 text-xl" />
                <h2 className="sm:text-2xl font-semibold text-gray-800">
                  Job Description
                </h2>
              </div>
              <p className="text-gray-700 whitespace-pre-line">
                {job.description}
              </p>
            </motion.div>
          )}

          {activeTab === "responsibilities" && job.responsibilities && (
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="list-disc list-inside space-y-2 text-gray-700"
            >
              <h2 className="sm:text-2xl font-semibold text-gray-800 flex items-center gap-2 ">
                <FaListUl /> Responsibilities
              </h2>
              {job.responsibilities
                .split(/[\n•]/)
                .filter((r) => r.trim())
                .map((r, idx) => (
                  <li key={idx}>{r.trim()}</li>
                ))}
            </motion.ul>
          )}

          {activeTab === "qualifications" && job.qualifications && (
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="list-disc list-inside space-y-2 text-gray-700"
            >
              <h2 className="sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <FaListUl /> Qualifications
              </h2>
              {job.qualifications
                .split(/[\n•]/)
                .filter((q) => q.trim())
                .map((q, idx) => (
                  <li key={idx}>{q.trim()}</li>
                ))}
            </motion.ul>
          )}
        </div>

        {/* Salary */}
        {job.salary && (
          <p className="text-gray-800 text-lg font-medium">
            Estimated Salary:{" "}
            <span className="text-blue-600">
              ${job.salary.toLocaleString()}
            </span>
          </p>
        )}

        {/* Footer Apply */}
        <div className="mt-6 text-center">
          {job.apply_link ? (
            <a
              href={job.apply_link}
              target="_blank"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
            >
              Apply Now
            </a>
          ) : (
            "No External Apply Link"
          )}
        </div>
      </div>
    </div>
  );
}
