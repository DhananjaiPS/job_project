"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaUserLarge } from "react-icons/fa6";
import { CiLogout, CiUser } from "react-icons/ci";
import { CgFileAdd } from "react-icons/cg";

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    console.log("User logged out");
    router.push("/login");
  };

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
      <button
        onClick={() => setOpen(!open)}
        className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded hover:bg-gray-100 transition hidden sm:flex"
      >
        Menu
      </button>

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
