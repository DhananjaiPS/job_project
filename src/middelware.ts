import { NextRequest,NextResponse } from "next/server"
import { cookies } from "next/headers";
export default function middelware(request:NextRequest) {
    
    const token=request.cookies.get("token");
    if(!token){
        return NextResponse.redirect(new URL("/login", request.url));

    }
    return NextResponse.next();
  
}
