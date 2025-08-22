"use client";
import { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserContext } from "../../(group)/layout";
import { logout } from "@/actions/logout";
import Link from "next/link";
import { CiLogout } from "react-icons/ci";
import { CgFileAdd } from "react-icons/cg";
import { FaUserLarge } from "react-icons/fa6";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { email, company_id } = user || {};

  async function handleLogout() {
    const res = await logout();
    if (res.success) {
      alert(res.message);
      router.push("/login");
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
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
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded hidden sm:flex hover:bg-gray-100 transition">
            Features
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content
          className="bg-white w-[30vh] shadow-md p-2 mt-4 text-blue-700 z-50 flex flex-col gap-1"
        >
          {/* Not Logged In */}
          {!email && (
            <>
              <DropdownMenu.Item asChild>
                <Link href="/login" className="p-2 hover:bg-blue-100 rounded">
                  Login
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item asChild>
                <Link href="/register" className="p-2 hover:bg-blue-100 rounded">
                  Register
                </Link>
              </DropdownMenu.Item>
            </>
          )}

          {/* Common options */}
          <DropdownMenu.Separator className="my-1 border-t" />
          <DropdownMenu.Item asChild>
            <Link href="/jobs?search=engineer" className="p-2 hover:bg-blue-100 rounded">
              Jobs
            </Link>
          </DropdownMenu.Item>
          <DropdownMenu.Item asChild>
            <Link href="/saved" className="p-2 hover:bg-blue-100 rounded">
              Saved Jobs
            </Link>
          </DropdownMenu.Item>

          {/* Company-related options */}
          {email && (
            <>
              <DropdownMenu.Separator className="my-1 border-t" />

              {!company_id ? (
                <DropdownMenu.Item asChild>
                  <Link href="/company" className="p-2 hover:bg-blue-100 rounded">
                    Add Company
                  </Link>
                </DropdownMenu.Item>
              ) : (
                <>
                  <DropdownMenu.Item asChild>
                    <Link
                      href={`/company/${company_id}`}
                      className="p-2 hover:bg-blue-100 rounded"
                    >
                      Company Details
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/addJobs" className="p-2 hover:bg-blue-100 rounded">
                      <CgFileAdd size={20} className="inline mr-2" />
                      Add Job
                    </Link>
                  </DropdownMenu.Item>
                </>
              )}

              {/* Profile */}
              <DropdownMenu.Separator className="my-1 border-t" />
              <DropdownMenu.Item asChild>
                <Link
                  href="/profile"
                  className="p-2 hover:bg-blue-100 flex items-center gap-2 rounded"
                >
                  <FaUserLarge size={16} /> Profile
                </Link>
              </DropdownMenu.Item>

              {/* Logout */}
              <DropdownMenu.Item
                className="p-2 text-red-600 hover:bg-red-50 flex items-center gap-2 rounded"
                onClick={async () => await handleLogout()}
              >
                <CiLogout size={16} /> Logout
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
