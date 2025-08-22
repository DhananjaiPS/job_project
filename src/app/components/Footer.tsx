"use client";

import Link from "next/link";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-700 text-white mt-10 w-full">
  <div className="w-full mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
     
        {/* About Section */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Job.ai</h2>
          <p className="text-gray-200 text-sm">
            Connecting professionals with top companies. Discover, apply, and grow your career effortlessly.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Quick Links</h3>
          <ul className="space-y-1 text-gray-200 text-sm">
            <li>
              <Link href="/jobs" className="hover:text-white transition">Explore Jobs</Link>
            </li>
            <li>
              <Link href="/addJobs" className="hover:text-white transition">Post a Job</Link>
            </li>
            <li>
              <Link href="/saved" className="hover:text-white transition">Saved Jobs</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">About Us</Link>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Follow Us</h3>
          <div className="flex gap-4 mt-2 text-gray-200">
            <Link href="https://linkedin.com" target="_blank" className="hover:text-white transition">
              <FaLinkedin size={24} />
            </Link>
            <Link href="https://twitter.com" target="_blank" className="hover:text-white transition">
              <FaTwitter size={24} />
            </Link>
            <Link href="https://github.com" target="_blank" className="hover:text-white transition">
              <FaGithub size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-blue-800 text-gray-300 text-sm text-center py-4">
        &copy; {new Date().getFullYear()} Job.ai. All rights reserved.
      </div>
    </footer>
  );
}
