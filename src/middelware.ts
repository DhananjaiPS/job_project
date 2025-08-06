import { NextRequest,NextResponse } from "next/server"
import { cookies } from "next/headers";
export default function middelware(request) {
    
    const token=request.cookies.get("auth");
    if(!token){
        return NextResponse.redirect(new URL("/login",request.url()))
    }
    return NextResponse.next();
  
}
