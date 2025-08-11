import { getUserFromCookie } from "@/app/Helper/helper";
import prismaClient from "@/app/service/prisma";
import { i } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const id = context.params.id
    // /api/job/123
    console.log(id);

    const user=await getUserFromCookie();
    // opening is replace  by job 
    const res = await prismaClient.opening.findFirst({
        where: {
            id: id || "d6AgbqspkOLVO-vKAAAAAA",
        },
        // include:{
        //     company:true
        // }

        
        
    })
    let UserHasApplied=false;
    const application=await prismaClient.application.findMany({
        where:{
            job_id:id,
            user_id:user?.id
        }
    })
    if(application.length >0 ) UserHasApplied=true;
    if (res) {
        return NextResponse.json({
            success: true,
            data: {...res,UserHasApplied},
        })
    }
    return NextResponse.json({
        success: false,
        data: [],
    })


}