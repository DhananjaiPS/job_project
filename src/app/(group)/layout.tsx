"use client"
import React, { createContext, useEffect, useState } from 'react'
import { Theme } from "@radix-ui/themes";

import Navbar from "@/app/components/Navbar"
export const  UserContext=createContext();
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  const [user,setUser]=useState({})
  useEffect(()=>{
    async function getUser() {
      const res=await fetch("http://localhost:3000/api/current_user");
      const data=await res?.json();
      if(data){
        console.log("data:",data);
        console.log("company",data.company)
        console.log("data.email :",data.data.email)
        const TempUser={
          id:data.data?.id,
          email:data.data?.email,
          role:data.data?.role,
          company_id:data?.company?.id 
        }
        setUser(TempUser);
      }
    }
    getUser();      
  },[]);   //it can be used like if user come can see the content but unable to do the like,comment,post without been login 
  return (
     <Theme>
      <UserContext.Provider value={
        {
          user,setUser
        }
      }>
    <div>

        <Navbar/>
        {children}
      
    </div>
      </UserContext.Provider>
       </Theme>
  )
}
