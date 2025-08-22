"use server";

import prismaClient from "@/service/prisma";
import { cookies } from "next/headers";

export default async function CheckCompany() {
  
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    throw new Error("No token found in cookies");
  }

 
  const email = token.value;

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const res = await prismaClient.company.findFirst({
    where: {
      ownerId: user.id,
    },
  });

  return res;
}
