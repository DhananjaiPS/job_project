import { getUserFromCookie } from "@/app/Helper/helper";
import prismaClient from "@/app/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const user=await getUserFromCookie();
    if(!user){
        return NextResponse.json({
            success:false,
            message:"User is Not authorized or Login to get Started"
        })
    }
    try{
        const user_id=user?.id
    const res=await prismaClient.user.findUnique({
        where:{
            id:user_id,
        }
        ,
        include:{
            application:true,
            review:true,
        }
    })
    if(res){
        return NextResponse.json({
            success:true,
            message:"User Data Access successfull",
            data:res,
        })
    }
    else{
        return NextResponse.json({
            success:false,
            message:"User Data Access Denied",
        })

    }
    }
    catch(err:any){
        return NextResponse.json({
            success:false,
            message:JSON.stringify(err),
        })
    }
}