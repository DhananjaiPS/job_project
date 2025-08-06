import prismaClient from "@/app/service/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookie =await cookies();
  const email = cookie?.get("token")?.value; 

  if (!email) {
    return NextResponse.json({
      success: false,
      message: "The user is not authenticated",
    });
  }

 

  const user = await prismaClient.user.findFirst({
    where: { email },
  });
 const userId=user?.id
  const company=await prismaClient.company.findUnique({
    where:{
        ownerId:userId
    }
  })

  if (user) {
    const { password, ...userWithoutPassword } = user; // Manually omit password

    return NextResponse.json({
      success: true,
      data: userWithoutPassword,
      company:company
    });
  } 
 
  else {
    return NextResponse.json({
      success: false,
      data: [],
    });
  }
}
