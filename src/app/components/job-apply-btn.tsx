//as a props hum wo job laye ge jis pr hum apply kre ge or kis job pr aplly kr rhe h use rakh ske
import { useState } from "react";
import { opening } from "../../../generated/prisma";
import DeleteApplyBtn from "./apply-delete-btn";
export default function JobApplyBtn({job,UserHasApplied}:{job:opening}) {
    console.log(job)
    const [hasApplied, setHasApplied] = useState(UserHasApplied);
    async function handelSubmit(){
        
        try{ 
            const res=await fetch("/api/job/apply/"+job?.id)

            const data= await res.json();
            if(data?.success){
                alert(data?.message);  //success
                setHasApplied(!hasApplied);
            }
            else{
                alert(data?.message)  //fail
            }
        }
        catch(err){
            alert(err);
        }
        

    }
    
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
   {!hasApplied &&  <button onClick={handelSubmit}  className="bg-orange-500 px-5 py-2  w-[13vh]  mb-4 rounded hover:bg-gray-800 transition text-white text-sm">apply now</button>}
   {hasApplied && (
        <button
          className="bg-red-500 px-5 py-2 w-[20vh] mb-4 rounded hover:bg-gray-800 transition text-white text-sm"
          onClick={handleDelete}
        >
          Delete application
        </button>
      )}

   
    </div>
  )
}
