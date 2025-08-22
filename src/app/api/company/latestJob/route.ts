import { getUserFromCookie } from "@/Helper/helper";
import prismaClient from "@/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const { id } = body;
    const user = await getUserFromCookie();
    console.log(user)
    const owner = await prismaClient.opening.findUnique({
        where: {
            id,

        }
        , include: {
            company: true
        }
    })
    console.log(owner);
    if (user.id !== owner?.company.ownerId) {
        return NextResponse.json({
            success: false,
            message: "Only Owner have the permission to delete there own job..."
        })
    }
    const delApplications = await prismaClient.application.deleteMany({
        where: {
            job_id: id
        }
    })
    const deleteJob = await prismaClient.opening.delete({
        where: {
            id
        },

    })
    try {
        if (deleteJob) {
            return NextResponse.json({
                success: true,
                message: "Job Deleted Successfully",
                data: deleteJob
            })
        }
        else {
            return NextResponse.json({
                success: false,
                message: "Job Deleted Unsuccessfully",
                data: []
            })
        }
    }
    catch (err) {
        return NextResponse.json({
            success: false,
            message: err,

        })
    }

}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Job ID is required" },
        { status: 400 }
      );
    }

    const user = await getUserFromCookie();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // find the job + its company
    const owner = await prismaClient.opening.findUnique({
      where: { id: String(id) },
      include: { company: true },
    });

    if (!owner) {
      return NextResponse.json(
        { success: false, message: "Job not found" },
        { status: 404 }
      );
    }

    if (user.id !== owner.company?.ownerId) {
      return NextResponse.json({
        success: false,
        message: "Only owner can edit this job",
      });
    }

    const edit = await prismaClient.opening.update({
      where: { id: String(id) },
      data: {
        title: body.title ?? owner.title,
        description: body.description ?? owner.description,
        salary: body.salary ? Number(body.salary) : owner.salary,
        job_type: body.job_type ?? owner.job_type,
        employment_type: body.employment_type ?? owner.employment_type,
        location: body.location ?? owner.location,
        category: body.category ?? owner.category,
        job_id: body.job_id ?? owner.job_id,
        apply_link: body.apply_link ?? owner.apply_link,
        responsibilities: body.responsibilities ?? owner.responsibilities,
        qualifications: body.qualifications ?? owner.qualifications,
        logo: body.logo ?? owner.logo,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Job updated successfully",
      data: edit,
    });
  } catch (error: any) {
    console.error("PATCH /api/company/latestJob error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
