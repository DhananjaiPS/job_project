//@ts-nocheck

import { Dialog, Button } from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";
import { job } from "../../../generated/prisma";
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
  UserHasApplied?: boolean;
};
export default function ViewJobApplicant({ job }:{job:Job}) {

    const [applicants, setApplicants] = useState([])


    async function handelApplicants() {
        const res = await fetch("/api/applicants/" + job.id)
            console.log("job id",job.id)
            const data = await res.json();
            console.log("Applicant data oncllick :",data);
            if (data.success) {
                setApplicants(data?.data);
            }
            else {
                alert(data.message)
            }        
    }   
    useEffect(() => {
        async function getApplicants() {
            const res = await fetch("/api/applicants/" + job.id)
            console.log("job id",job.id)
            const data = await res.json();
            console.log("Applicant data :",data);
            if (data.success) {
                setApplicants(data?.data);
                
            }
            else {
                alert(data.message)
            }

        }
        getApplicants();
    },[]);
    return (
        <div>
            <Dialog.Root>
                <Dialog.Trigger>
                    <button onClick={handelApplicants} className="bg-blue-800 px-5 py-2 w-full  sm:w-[30vh]  mb-4 rounded justify-center hover:bg-gray-800 transition text-white text-sm   items-center flex">View applicant</button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Job application</Dialog.Title>
                    <Dialog.Description size="2" mb="4">
                        View the people hwo have apply for this job
                    </Dialog.Description>
                    <div>
                        {applicants.map((applicant => {
                            return (
                                <div>{applicant?.user?.email}</div>
                            )
                        }))}
                    </div>
                </Dialog.Content>
            </Dialog.Root>

        </div>
    )
}
