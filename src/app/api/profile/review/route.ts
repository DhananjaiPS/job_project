import { getUserFromCookie } from "@/Helper/helper";
import prismaClient from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const user=await getUserFromCookie();
    console.log(user)
    const id=user?.id
    if(!id){
        return NextResponse.json({
            success:false,
            message:"User is not authenticated"
        })
    }
    const res=await prismaClient.review.findMany({
        where:{
            user_id:id,
        },
        include:{
            company:true,
        }
    });
    console.log(res);
    try{
        if(res){

        return NextResponse.json({
            success:true,
            message:"Fetch Successfully",
            data:res,
        })
    }
    else{
        return NextResponse.json({
            success:false,
            message:"Oops Something went wrong"
        })
    }
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:err,
        })
    }
}