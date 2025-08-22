// app/api/job/apply/[id]/route.ts
import { getUserFromCookie } from "@/Helper/helper";
import prismaClient from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookie();
  const {id}= await params;
  const job_id = id;

  if (!user) {
    return NextResponse.json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const appToSave = {
    user_id: user.id,
    job_id,
  };

  try {
    const application = await prismaClient.application.create({
      data: appToSave,
    });

    return NextResponse.json({
      success: true,
      data: application,
      message: "Applied successfully",
    });
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({
      success: false,
      message: "Failed to apply for this job",
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUserFromCookie();
  const {id}=await params;
  const job_id =id;

  if (!user || !job_id) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }

  try {
    const result = await prismaClient.application.deleteMany({
      where: {
        user_id: user.id,
        job_id,
      },
    });

    if (result.count > 0) {
      return NextResponse.json({
        success: true,
        message: "Application withdrawn successfully!",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "No application found to delete",
      });
    }
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json({
      success: false,
      message: "Fatal error occurred",
    });
  }
}
