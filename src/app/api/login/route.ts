import prismaClient from "@/service/prisma";
import { NextResponse } from "next/server";


export async function POST(req:NextResponse){
    const body = await req.json(); // ✅ Correct way to get body
    const email = body.email;
    const password = body.password;
    
    const res=await prismaClient.user.findFirst({
        where:{
            email:email,
            password:password,

        }
    })
    const obj={
        email,
        password
    }
    if(res){
        const returnRes=NextResponse.json({
            success:true,
            data:res
        })
        returnRes.cookies.set("token",email);
        return returnRes
    }
    else{
        return NextResponse.json({
            success:false,
            data:[]
        })
    }
    
}