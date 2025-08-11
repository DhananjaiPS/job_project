//
"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { FaUserLarge } from "react-icons/fa6";
import { CiLogout, CiUser } from "react-icons/ci";
import { CgFileAdd } from "react-icons/cg";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserProvider } from "./UserProvider";
import { UserContext } from "../(group)/layout";
import { div } from "framer-motion/client";
import { logout } from "@/actions/logout";
import Link from "next/link";


export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const context = useContext(UserContext);
  const { user } = context;
  console.log("user", user)
  const { email } = user;


  async function handelLogout() {
    const res = await logout();
    if (res.success) {
      alert(res.message);
      router.push("/login");


    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Toggle Button */}
      <div className="hidden sm:flex bg-white text-blue-500">

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded hidden sm:flex hover:bg-gray-100 transition ">
              Features
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white w-[30vh] shadow-md p-2 mt-4 text-blue-700">
            {!user?.email &&
              <div>
                <DropdownMenu.Item asChild>
                  <Link href="/login" className="p-2 hover:bg-blue-100">
                    Login
                  </Link>
                </DropdownMenu.Item>
                <DropdownMenu.Item className="p-2 hover:bg-blue-100" asChild>
                  <Link href="/register" className="p-2 hover:bg-blue-100">
                    Register
                  </Link>
                </DropdownMenu.Item>
              </div>
            }
            

            <DropdownMenu.Separator className="my-1 border-t" />
            <DropdownMenu.Item className="p-2 hover:bg-blue-100">Active Jobs</DropdownMenu.Item>

            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="p-2 hover:bg-blue-100">More</DropdownMenu.SubTrigger>
              <DropdownMenu.SubContent className="bg-white border rounded-md shadow-md p-2">
                <DropdownMenu.Item className="p-2 hover:bg-blue-100">Job page</DropdownMenu.Item>
                <DropdownMenu.Item className="p-2 hover:bg-blue-100">add company</DropdownMenu.Item>
                <DropdownMenu.Separator className="my-1 border-t" />
                <DropdownMenu.Item className="p-2 hover:bg-blue-100">Advanced options…</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>

            <DropdownMenu.Separator className="my-1 border-t" />
            
            <DropdownMenu.Item className="p-2 hover:bg-blue-100">Add Job</DropdownMenu.Item>
            <DropdownMenu.Item className="my-1 border-t">
              <span className="p-2 hover:bg-blue-100">Profile</span>
            </DropdownMenu.Item>
            {
              user?.email && <DropdownMenu.Item  asChild>
                  <Link href="/profile" className="p-2 hover:bg-blue-100">
                    {user?.email}
                  </Link>
                </DropdownMenu.Item>
            }
            <DropdownMenu.Separator  />
            {
              user?.email && <DropdownMenu.Item className="p-2 text-red-600 hover:bg-red-50"
                onClick={async () => {
                  await handelLogout();

                }}
              >Logout</DropdownMenu.Item>
            }

          </DropdownMenu.Content>
        </DropdownMenu.Root>

      </div>


      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/company");
              }}
              className="w-full flex text-left px-4 py-2 text-md items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              Add Company
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/jobs/add");
              }}
              className="w-full flex text-left px-4 py-2 text-md items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <CgFileAdd size={20} />
              Add Job
            </button>
            <button
              onClick={() => {
                setOpen(false);
                router.push("/profile");
              }}
              className="w-full flex text-left px-4 py-2 text-md items-center gap-3 text-gray-700 hover:bg-gray-100"
            >
              <FaUserLarge />
              My Profile
            </button>
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="w-full flex text-left px-4 py-2 text-md items-center gap-3 text-red-600 hover:bg-red-50"
            >
              <CiLogout size={20} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
