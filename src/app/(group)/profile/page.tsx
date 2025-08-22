"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../layout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Tabs, Text, Box, Badge, Flex } from "@radix-ui/themes";
import type { review } from "../../../../generated/prisma";

// ----------------- Types -----------------
type Application = {
  job_id: string;
};

type User = {
  id: string;
  email: string;
  role: string;
  company_id?: string | null;
};

type ReviewWithCompany = review & {
  company?: {
    id: string;
    name: string;
  } | null;
};

// ----------------- Component -----------------
export default function Page() {
  const userCtx = useContext(UserContext);

  // ✅ Ensure we destructure only if context is not null
  const user = userCtx?.user as User | null;

  const [applications, setApplications] = useState<Application[]>([]);
  const [reviews, setReviews] = useState<ReviewWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileRes, reviewRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/profile/review"),
        ]);

        const profileData = await profileRes.json();
        const reviewData = await reviewRes.json();

        if (profileData.success)
          setApplications(profileData.data?.application || []);

        if (reviewData.success) setReviews(reviewData.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading user profile...
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-7 justify-center items-center m-5 overflow-hidden">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row rounded-bl-2xl bg-blue-500 w-full pt-3 sm:pb-5">
        <div className="object-left object-cover flex justify-center items-center w-[40vh] h-[40vh] sm:w-[60vh] sm:pl-20 sm:h-[50vh] overflow-hidden">
          <img src="/job7.png" alt="job" />
        </div>

        <div className="w-[55vh] flex flex-col bg-white sm:w-[50%] mx-auto mt-10 p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4 text-blue-600">User Profile</h1>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <span className="loading loading-spinner loading-xl text-blue-500"></span>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700">User ID:</span>
                <p className="text-gray-800">{user.id}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Email:</span>
                <p className="text-gray-800">{user.email}</p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">Role:</span>
                <p className="text-gray-800 capitalize">{user.role}</p>
              </div>

              {user.company_id && (
                <div>
                  <span className="font-semibold text-gray-700">Company ID:</span>
                  <p className="text-gray-800">{user.company_id}</p>
                  <Link
                    href={`/company/${user.company_id}`}
                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-[33vh] sm:w-[45vh] justify-between"
                  >
                    View Company Profile
                    <ArrowRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full flex justify-center gap-7 text-lg pb-10">
        <Tabs.Root defaultValue="account">
          <Tabs.List>
            <Tabs.Trigger value="settings">Introduction</Tabs.Trigger>
            <Tabs.Trigger value="account">My Applications</Tabs.Trigger>
            <Tabs.Trigger value="documents">My Reviews</Tabs.Trigger>
          </Tabs.List>

          <Box pt="3">
            <Tabs.Content value="settings">
              <Text size="2">
                Edit your profile or update contact information.
              </Text>
            </Tabs.Content>

            <Tabs.Content value="account">
              <Flex gap="2" direction="column">
                {applications.map((item, index) => (
                  <Link key={index} href={`/jobs/${item.job_id}`}>
                    <Badge color="blue" className="pl-5">
                      {item.job_id}
                    </Badge>
                  </Link>
                ))}
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="documents">
              <Flex gap="4" direction="column">
                {reviews.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white shadow rounded-lg border border-gray-200 text-sm"
                  >
                    {/* Review Content */}
                    <div className="flex-1">
                      <span className="font-semibold text-gray-700">
                        Review:
                      </span>
                      <p className="text-gray-800">{item.content}</p>
                    </div>

                    {/* Company Info */}
                    {item.company && (
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Company:
                        </span>
                        <Link href={`/company/${item.company.id}`}>
                          <Badge color="blue">{item.company.name}</Badge>
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </Flex>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </div>
    </div>
  );
}
