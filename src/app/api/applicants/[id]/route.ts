import prismaClient from "@/app/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{id:string}}){
    const job_id=params.id
    console.log("Applicant id",job_id);
    try{
        const res=await prismaClient.application.findMany({
            where:{
                job_id
            },
            include:{
                user:true
            }
        })
        return NextResponse.json({
            success:true,
            data:res,
            message:"applicants record fetch successfully "
        })

    }
    catch(err){
        console.log(err)
        return NextResponse.json({
            success:false,
            message:"oops something went wrong"



        })

    }
}