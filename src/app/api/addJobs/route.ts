import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "../../Helper/helper";
import prismaClient from "@/app/service/prisma";




export async function POST(req: NextRequest) {
    console.log("hii i am server api add  job")
    const body = await req.json()
    const user = await getUserFromCookie();
    if (!user) {
        return NextResponse.json({
            success: false,
            message: "User is unauthorized "
        })
    }

    const Obj = {
        title: body.title,
        description: body.description,
        salary: body.salary,
        job_type: body.job_type,
        employment_type: body.employment_type,
        location:body.location,
        company_id: body.company_id
    }

    const res=await prismaClient.opening.create({
        data:Obj,
        
    })
    if(res){
        return NextResponse.json({
            success:true,
            message:"Job added Successfully",
            data:res
        })
    }
    else{
        return NextResponse.json({
            success:false,
            message:"Oops Somthing went wrong"
        })
    }





}



export async function GET(req:NextRequest){
    const res=await prismaClient.opening.findMany({
        include:{
            company:true
        }
    })
    if(res){
        return NextResponse.json({
            success:true,
            message:"Opening data fetch successfully",
            data:res
        })
    }
    else{
        return NextResponse.json({
            success:false,
            message:"Oops Something went wrong"
        })
    }
}