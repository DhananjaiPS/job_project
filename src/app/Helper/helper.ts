import { cookies } from 'next/headers'
import React from 'react'
import prismaClient from '../service/prisma';
import { NextResponse } from 'next/server';

export async function getUserFromCookie() {
    const cookie=await cookies();
    const email=cookie.get("token")?.value
    if(!email){
        return null;
    }
    const user=await prismaClient.user.findUnique({
        where:{
            email:email,
        },
        omit:{
            password:true,
        }
    })
    if(!user){
        return null;
    }
    return user;

  
}
