
'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { opening } from "../../../../generated/prisma";
// import { useRouter } from "next/navigation";
// import { job } from "@/app/Data/job";

export default function Page() {
    const [jobs, setJobs] = useState<opening[] | null>([]);

    useEffect(() => {
        const existing = localStorage.getItem("job");
        const parse: opening[] = existing ? JSON.parse(existing) as opening[] : [];
        setJobs(parse);
    }, []);

    function handleLocal(obj: opening) {
        const existing = localStorage.getItem("job");
        const parse: opening[] = existing ? (JSON.parse(existing) as opening[]) : [];
        const filtered = parse.filter((item) => item.job_id !== obj.job_id);
        localStorage.setItem("job", JSON.stringify(filtered));
        setJobs(filtered);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-700 py-10 px-4">
            <div className="flex flex-wrap justify-center gap-6">
                {/* {jobs && jobs?.length > 0 ? (
                    jobs?.map((item, index) => (
                        <div
                            key={index}
                            className="bg-white/30 backdrop-blur-lg shadow-xl rounded-2xl p-5 w-[390px] h-[170px] flex flex-col justify-between text-white"
                        >
                            <div>
                                <h2 className="text-lg font-bold truncate">{item.title}</h2>
                                <p className="text-sm text-white/80 mt-1">{item.company_id}</p>
                            </div>

                            <div className="flex justify-between mt-4">
                                <Link href={`/jobs/${item.job_id}`}>
                                    <button className="bg-blue-600 hover:bg-blue-700 transition px-3 py-2 rounded-md text-sm">
                                        More Details
                                    </button>
                                </Link>
                                <a
                                    href={item.link}
                                    target="_blank"
                                    className="bg-black hover:bg-gray-800 transition px-3 py-2 rounded-md text-sm"
                                >
                                    Apply Now
                                </a>
                                <button
                                    onClick={() => handleLocal(item)}
                                    className="bg-red-500 hover:bg-red-600 transition px-3 py-2 rounded-md text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))
                ) : ( */}
                    <div className="text-white flex flex-col items-center gap-4 mt-20">
                        <p className="text-lg">There are no saved jobs.</p>
                        <Link href="/">
                            <button className="bg-black hover:bg-gray-800 px-4 py-2 rounded text-white">
                                Go back to Home Page
                            </button>
                        </Link>
                    </div>
                {/* )} */}
            </div>
        </div>
    );
}
