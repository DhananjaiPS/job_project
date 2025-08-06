import prismaClient from "@/app/service/prisma";
import { i } from "framer-motion/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const id = context.params.id
    // /api/job/123
    console.log(id);
    const res = await prismaClient.job.findFirst({
        where: {
            id: id || "d6AgbqspkOLVO-vKAAAAAA",
        }
    })
    if (res) {
        return NextResponse.json({
            success: true,
            data: res,
        })
    }
    return NextResponse.json({
        success: false,
        data: [],
    })


}