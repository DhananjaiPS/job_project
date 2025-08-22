//@ts-nocheck

import React, { useTransition } from 'react'

export default function DeleteJobBtn({id}){
  const [isPending,startTransition  ]=useTransition()

    async function handelDeleteJob(id: string) {
    const obj = {
      id
    }
    const url = `/api/company/latestJob`
    startTransition(async () => {
      try {

        const res = await fetch(url, {
          method: "DELETE",
          body: JSON.stringify(obj)
        })
        const data = await res.json();
        if (data.success) {
          alert(data.message);
          console.log(data.data)
          setCompanyJobs(prev => prev.filter(j => j.id !== data.data.id));

        }
        else {
          alert(data.message)
        }
      }
      catch (err) {
        alert(err);
      }
    })}
    return (
        <div>
            <button
                onClick={() => handelDeleteJob(job.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
                disabled={isPending}
            >
                {isPending ? "Deleting..." : "Delete"}
            </button>
        </div>
    )
}
