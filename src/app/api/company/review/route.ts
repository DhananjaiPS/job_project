// /api/review/route.ts (or route.js)

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/service/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { content, company_id, user_id } = body;

  try {
    const newReview = await prisma.review.create({
      data: {
        content,
        company_id,
        user_id,
      },
      include:{
        user:true
      }
      ,
    });

    return NextResponse.json({ success: true, data: newReview });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Error saving review" }, { status: 500 });
  }
}
