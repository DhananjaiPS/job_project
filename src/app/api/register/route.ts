import prismaClient from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest){
    try{
        const body=await req.json();
    
    const existingUser=await prismaClient.user.findUnique({
        where:{
            email:body?.email
        }
    })
    if(existingUser){
        return NextResponse.json({
            success:false,
            message:"User already existed"
        })
    }
    const newUser=await prismaClient.user.create({
        data:{
            email:body?.email,
            password:body?.password,
        }
    })
    if(!newUser){
        return NextResponse.json({
            success:false,
            message:"Cant create new user right now contact ur admin"
        })
    }
    return NextResponse.json({
            success:true,
            message:"User created successfully"
        })
    }
    catch(err){
        return NextResponse.json({
            success:false,
            message:err,
        })
    }

    }
