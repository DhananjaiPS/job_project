import { Dialog, Button } from "@radix-ui/themes";
import { useContext, useEffect, useState } from "react";
export default function ViewJobApplicant({ job }) {

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
                    <Button onClick={handelApplicants} className="bg-pink-500 px-5 py-2  w-[13vh]  mb-4 rounded hover:bg-gray-800 transition text-white text-sm">View applicant</Button>
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
