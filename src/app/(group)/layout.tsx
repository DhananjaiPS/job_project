"use client"
import React, { createContext, useEffect, useState } from 'react'
import { Theme } from "@radix-ui/themes";
import Navbar from "@/app/components/Navbar"

// ----------- Types ----------
type Company = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
}

type User = {
  id: string; 
  email: string; 
  password: string;
  role:string,
  company: Company;
    company_id?: string; 
}

// Context type
type UserContextType = {
  user: User | null;
  setUser: (value:User | null)=> void,
  company: Company | null;
  setCompany: (value:Company | null)=> void,
}

// Default value
export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},   // dummy function
  company: null,
  setCompany: () => {}, // dummy function
});

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/current_user"); 
      const data = await res.json();
      if (data) {
        console.log("data:", data);

        setCompany(data?.company);

        const TempUser: User = {
          id: data?.data?.id,
          email: data?.data?.email,
          role:data?.data?.role,
          password: "", // add empty if not returned
          company: data?.company
                    // role:data.data?.role, 

        };

        setUser(TempUser);
      }
    }
    getUser();
  }, []);

  return (
    <Theme>
      <UserContext.Provider value={{ user, setUser, company, setCompany }}>
        <div>
          <Navbar />
          {children}
        </div>
      </UserContext.Provider>
    </Theme>
  );
}
