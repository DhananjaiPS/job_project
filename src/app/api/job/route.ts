import prismaClient from "@/service/prisma";
import { parseAppSegmentConfig } from "next/dist/build/segment-config/app/app-segment-config";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const q = searchParams.get("search")?.trim() || "";
    const jt = searchParams.get("jt")?.trim() || "";
    const et = searchParams.get("et")?.trim() || "";
    const msRaw = searchParams.get("ms");
    const ms = msRaw && !isNaN(parseInt(msRaw)) ? parseInt(msRaw) : 0;

    console.log("Query:", { q, jt, et, ms });




    const jobs = await prismaClient.job.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive"
        },
        job_type: {
          contains: jt,
          mode: "insensitive"
        }
        , employment_type: {
          contains: et,
          mode: "insensitive"
        },
        salary: {
          gte: ms,
        }

      }

    });
    const opening = await prismaClient.opening.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive"
        },
        job_type: {
          contains: jt,
          mode: "insensitive"
        }
        , employment_type: {
          contains: et,
          mode: "insensitive"
        },
        salary: {
          gte: ms,
        }

      }

    });

    return NextResponse.json({
      success: true,
      data: [...opening,...jobs],
      message:"Jobs fetched succcessfully"
      
    });

  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}


// export async function DELETE(req: NextRequest) {
//   try {
//     const

//   }
//   catch (err) {

//     return NextRequest

//   }


// }













export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  try {
    const body = await req.json();
    console.log("Received data:", body);
    const { search, jt, et, ms } = body;
    console.log(search, jt, et, ms);
    const res = await prismaClient.opening.update({
      where: {
        id: id,
      },
      data: body,

    })
    return NextResponse.json({
      success: true,
    });


  }
  catch (error) {
    console.error("Error inserting jobs:", error);
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 });
  }
}
