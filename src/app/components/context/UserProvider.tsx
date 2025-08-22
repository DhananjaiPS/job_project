"use client";
import { createContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  setUser: (value: User | null)=> void
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/current_user"); 
        const data = await res.json();

        if (data?.data) {
          const tempUser: User = {
            id: data.data.id,
            email: data.data.email,
            role: data.data.role,
          };
          setUser(tempUser);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }

    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
