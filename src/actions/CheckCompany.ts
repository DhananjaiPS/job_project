"use server"

import prismaClient from "@/app/service/prisma";
import { cookies } from "next/headers"

export default function CheckCompany() {
  const cookie=await cookies()
  const email=cookie.get("token");
  const user=
  const res=await prismaClient.company.findFirst({
    where:{
        ownerId
        
    }
  })
}
