import React, { useState } from 'react';
import JobApplyBtn from './job-apply-btn';

export default function DeleteApplyBtn({ UserHasApplied, job }) {
  const [hasApplied, setHasApplied] = useState(UserHasApplied);

  async function handleDelete() {
   
    try{
        const res=await fetch("http://localhost:3000/api/job/apply/"+job.id,{
            method:"DELETE"
        })
        console.log("DElete Res ",res)
    const data=await res.json();
    if(data){
        alert(data.message)

    }
    else{
        alert(data.message)
    }
    }
    catch(err:any){
        alert(err);
    }
     setHasApplied(false);

  }

  return (
    <div>
      {!hasApplied && <JobApplyBtn job={job}  />}
      {hasApplied && (
        <button
          className="bg-red-500 px-5 py-2 w-full  sm:w-[30vh]   rounded justify-center hover:bg-gray-800 transition text-white text-sm   items-center flex"
          onClick={handleDelete}
        >
          Delete application
        </button>
      )}
    </div>
  );
}
