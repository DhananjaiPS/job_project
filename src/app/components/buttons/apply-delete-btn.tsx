"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

interface Job {
  id: string;
  title: string;   
  description: string;
  job_type: string;
  employment_type: string;
  location: string;
  salary: number;
  company_id: string;
  category: string | null;
  job_id: string | null;
  apply_link: string | null;
  responsibilities: string | null;
  qualifications: string | null;
  logo: string | null;
}

// Props type
type JobActionBtnProps = {
  UserHasApplied: boolean;
  job: Job;
};

export default function JobActionBtn({ UserHasApplied, job }: JobActionBtnProps) {
  const [hasApplied, setHasApplied] = useState<boolean>(UserHasApplied);
  const [loading, setLoading] = useState<boolean>(false);

  // Apply handler
  async function handleApply() {
    setLoading(true);
    try {
      const res = await fetch(`/api/job/apply/${job.id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to apply");

      const data: { message?: string } = await res.json();
      if (data?.message) {
        toast.success(data.message);
        setHasApplied(true);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Delete handler
  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/job/apply/${job.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete application");

      const data: { message?: string } = await res.json();
      if (data?.message) {
        toast.success(data.message);
        setHasApplied(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {!hasApplied ? (
        <button
          disabled={loading}
          onClick={handleApply}
          className={`bg-orange-500 px-5 py-2 w-full sm:w-[30vh] mb-4 rounded flex justify-center items-center
            hover:bg-orange-700 transition text-white text-sm
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Applying..." : "Apply"}
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={handleDelete}
          className={`bg-red-500 px-5 py-2 w-full sm:w-[30vh] mb-4 rounded flex justify-center items-center
            hover:bg-gray-800 transition text-white text-sm
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Deleting..." : "Delete application"}
        </button>
      )}
    </div>
  );
}
