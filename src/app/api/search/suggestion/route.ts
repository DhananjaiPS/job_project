import prismaClient from "@/app/service/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest){

    const sp=req.nextUrl.searchParams
    const q=sp.get("q") || "";
    const sugg=await prismaClient.job.findMany({
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
        take:10,
    })
    if(sugg){
        return NextResponse.json({
            success:true,
            data:sugg
        })
    }
    else{
        return NextResponse.json({
            success:true,
            data:[],
        })
    }
}