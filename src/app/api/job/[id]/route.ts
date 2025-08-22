import { getUserFromCookie } from "@/Helper/helper";
import prismaClient from "@/service/prisma";
import { i } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id}=await params;
    // /api/job/123
    console.log(id);

    const user = await getUserFromCookie();
    // opening is replace  by job 
    const res = await prismaClient.opening.findFirst({
        where: {
            id: id
        },
        // include:{
        //     company:true
        // }



    })
    const job = await prismaClient.job.findFirst({
        where: {
            id: id
        },
        // include:{
        //     company:true
        // }



    })
    let UserHasApplied = false;
    const application = await prismaClient.application.findMany({
        where: {
            job_id: id,
            user_id: user?.id
        }
    })
    if (application.length > 0) UserHasApplied = true;
    if (res) {
        return NextResponse.json({
            success: true,
            data: { ...res, UserHasApplied },
        })
    }
    if (job) {
        return NextResponse.json({
            success: true,
            data: { ...job, UserHasApplied },
        })
    }
    return NextResponse.json({
        success: false,
        data: [],
    })


}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const user = await getUserFromCookie();
    console.log("User:", user);

    const id = params.id;
    console.log("Deleting ID:", id);
   
      try {
        const deleted = await prismaClient.opening.delete({
          where: { id },
        });

        return NextResponse.json({
          success: true,
          message: "Deleted successfully",
          deleted,
        });
      } catch (error) {
        console.error(error);
        return NextResponse.json(
          { success: false, message: "Error deleting record" },
          { status: 500 }
        );
      }
}
