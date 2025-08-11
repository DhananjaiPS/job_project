import { getUserFromCookie } from "@/app/Helper/helper";
import prismaClient from "@/app/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest,{params}:{params:{id:string}}){
    const user=await getUserFromCookie();  //current user details using the cookie token "email" to fetch all
    const job_id=params.id

    if(!user){
        return NextResponse.json({
            success:false,
            message:"User is not authenticated"
        })
    }
    //2 test case : token mein h pr db mein nhi h
    // and many more ....
    const appToSave={
        user_id:user?.id,
        job_id:job_id,

    }
    try{
        const application=await prismaClient.application.create({
            data:appToSave

        })
        return NextResponse.json({
            success:true,
            data:application,
            message :"apply successfully"
        })

    }
    catch(error){
        console.log(error.message)
    }

}




export async function DELETE(req:NextRequest,{params}:{params:{id:string}}) {
    const {id}=await params
    const user=await getUserFromCookie()
    const job_id=id
    if(user && job_id){
        try{
            const application=await prismaClient.application.deleteMany({
                where:{
                    user_id:user.id,
                    job_id
                }
            })
            if(application){
                return NextResponse.json({
                    success:true,
                    message:"Application withdraw successfully !!!"
                })
            }
        }
        catch(err){
            return NextResponse.json({
                success:false,
                message:"Fatal Error has occured"
            })
        }
    }


    
}