//as a props hum wo job laye ge jis pr hum apply kre ge or kis job pr aplly kr rhe h use rakh ske
import { opening } from "../../../generated/prisma";
export default function JobApplyBtn({job}:{job:opening}) {
    console.log(job)
    async function handelSubmit(){
        
        try{ 
            const res=await fetch("/api/job/apply/"+job?.id)

            const data= await res.json();
            if(data?.success){
                alert(data?.message);  //success
            }
            else{
                alert(data?.message)  //fail
            }
        }
        catch(err){
            alert(err);
        }

    }
  return (
    <div>
    <button onClick={handelSubmit}  className="bg-orange-500 px-5 py-2  w-[13vh]  mb-4 rounded hover:bg-gray-800 transition text-white text-sm">apply now</button>
      
    </div>
  )
}
