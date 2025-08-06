"use client";
import AddJobButton from "@/app/components/AddJobButton";
import Link from "next/link";
import { useEffect, useState } from "react";

// Assuming these are your Prisma types
import type { company, opening } from "../../../../generated/prisma";

// Create a combined type with nested company inside opening
type OpeningWithCompany = opening & { company?: company };

export default function Page() {
  const [jobsFromDb, setJobsFromDb] = useState<OpeningWithCompany[]>([]);

  useEffect(() => {
    const url = "http://localhost:3000/api/addJobs";
    async function fetchData() {
      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          console.log("All job data:", data?.data);
          setJobsFromDb(data.data);
          // alert(data.message); // Optional
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert("Error fetching jobs: " + err);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <AddJobButton />
      <div>
        {jobsFromDb.map((item, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{item.title}</h3>
            <p>Type: {item.job_type}</p>
            <p>Location: {item.location}</p>
            <p>{item.description}</p>
            {item.company ? (
              <Link href={`/company/${item.company.id}`}>
                <div style={{ fontWeight: "bold" }}>Company: {item.company.name}</div>
              </Link>
            ) : (
              <div>No company data</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
