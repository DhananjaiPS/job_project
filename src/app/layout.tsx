
"use client"
import { Theme } from "@radix-ui/themes";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { createContext, useContext, useState } from "react";
type MainContextType = {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
};
export const MainContext = createContext<MainContextType>({
  email: "",
  setEmail: () => { },
  password: "",
  setPassword: () => { },

});


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{

  children: React.ReactNode;

}>) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  return (

    <html lang="en">

      <body>

        <Theme>

          <MainContext.Provider value={{ email, setEmail, password, setPassword }}>
            {children}
          </MainContext.Provider>

        </Theme>

      </body>
    </html>
  );
}


