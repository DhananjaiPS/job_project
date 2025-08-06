
"use server"

import { cookies } from "next/headers";

export async function logout() {
    const cookie=await cookies();
    const token=cookie.delete("token");
    return {
        success:true,
        message:"Logout Successfull"
    }

 
}
