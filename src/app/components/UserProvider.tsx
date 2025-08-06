"use client";

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("http://localhost:3000/api/current_user");
        const data = await res.json();
        if (data?.data) {
          const tempUser = {
            id: data.data?.id,
            email: data.data?.email,
            role: data.data?.role,
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
