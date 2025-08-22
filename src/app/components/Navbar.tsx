"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useRef } from "react";
import { LuSave } from "react-icons/lu";
import Link from "next/link";
import Drawer from "./Drawer";
import LoginButton from "@/app/components/buttons/LoginButton";
import { UserContext } from "../(group)/layout";
import { ImBriefcase } from "react-icons/im";

export default function Navbar() {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState<string[]>([]);
  const router = useRouter();
  const context = useContext(UserContext);
  const wrapperRef = useRef<HTMLDivElement>(null);

  if (!context) {
    alert("context is undefined ");
    return null;
  }
  const { user } = context;

  // Debounced suggestion fetching
  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function getSuggestion() {
      try {
        const res = await fetch(
          ` /api/search/suggestion?q=${input.toLowerCase()}`
        );
        const data = await res.json();

        if (data.success) {
          setSuggestion(data.data || []);
        } else {
          setSuggestion([]);
        }
      } catch (err) {
        console.error("Error fetching suggestions", err);
      }
    }

    if (input.trim()) {
      timer = setTimeout(() => {
        getSuggestion();
      }, 500);
    } else {
      setSuggestion([]);
    }

    return () => clearTimeout(timer);
  }, [input]);

  function normalizeText(str: string) {
    return str
      .replace(/[–—]/g, "-")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");
  }

  function handleSearch() {
    let searchTerm = input;
    searchTerm = normalizeText(searchTerm.trim());
    if (searchTerm !== "") {
      const encoded = encodeURIComponent(searchTerm.trim());
      router.push(`/jobs?search=${encoded}&jt=&et=&ms=`, { scroll: false });
      setSuggestion([]);
    }
  }

  // Hide suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setSuggestion([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg py-3 px-4 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-2">
        <ImBriefcase size={32} />
        <span className="hidden sm:flex text-3xl font-bold pl-3">Job.ai</span>
      </Link>

      {/* Search Input */}
      <div
        ref={wrapperRef}
        className="relative flex items-center gap-2 bg-white rounded px-2 py-1 sm:w-[70vh]"
      >
        <input
          type="text"
          placeholder="Enter job title..."
          className="bg-white focus:outline-none text-black placeholder:text-gray-600 px-2 py-1 w-[150px] sm:w-[180px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        {/* Suggestion Dropdown */}
        {suggestion.length > 0 && (
          <ul className="absolute top-full mt-1 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50 scrollbar-hide">
            {suggestion.map((item: any, index) => {
              const jobid = item.id ? encodeURIComponent(item.id) : encodeURIComponent(item.id);

              return (
                <li key={index}>
                 <Link href={`/jobs/${jobid}`}>

                    <div className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition"onClick={() => setSuggestion([])}>
                      {item.title}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <button
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition sm:absolute right-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Right Side */}
      <div className="flex gap-4">
        <Link href="/saved">
          <button className="bg-white text-blue-600 font-medium px-4 py-1.5 rounded hidden hover:bg-gray-100 md:flex transition mx-1">
           <LuSave size={25}/>
          </button>
        </Link>

        <LoginButton />
        <Drawer />
      </div>
    </nav>
  );
}
