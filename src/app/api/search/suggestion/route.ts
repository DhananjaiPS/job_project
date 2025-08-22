import prismaClient from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){

    const sp=req.nextUrl.searchParams
    const q=sp.get("q") || "";
    const suggestionsFromJob=await prismaClient.job.findMany({
        where:{
            title:{
                contains:q,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            title:true,
            job_id:true,
          
        },
        take:5,
    })
    const suggestionsFromOpenings=await prismaClient.opening.findMany({
        where:{
            title:{
                contains:q,
                mode:"insensitive"
            }
        },
        select:{
            id:true,
            title:true,
            job_id:true,
          
        },
        take:5,
    })
    if(suggestionsFromJob || suggestionsFromOpenings){
        return NextResponse.json({
            success:true,
            data:[...suggestionsFromOpenings,...suggestionsFromJob]  // combined results from both model job and schema
        })
    }
    else{
        return NextResponse.json({
            success:true,
            data:[],
        })
    }
}