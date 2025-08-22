import { NextRequest, NextResponse } from "next/server";
import prismaClient from "@/service/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const {id}=await params;
  const job_id = id
  console.log("Applicant id", job_id);

  try {
    const res = await prismaClient.application.findMany({
      where: { job_id },
      include: { user: true }
    });

    return NextResponse.json({
      success: true,
      data: res,
      message: "Applicants record fetched successfully"
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Oops, something went wrong"
    });
  }
}
