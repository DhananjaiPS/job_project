"use client";
import EditCompanyButton from "@/app/components/EditCompanyButton";
import { Tabs, Text, Box,Dialog } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  employment_type: string;
  location: string;
  salary: number;
}

interface User {
  email: string;
  id: string;
  role: string;
}

interface Review {
  content: string;
  user: {
    email: string;
  };
}

interface Company {
  id: string;
  name: string;
  description: string;
  jobs: Job[];
  review: Review[];
}

export default function CompanyWithOwnerPage() {
  const params = useParams();
  const id = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const [open, setOpen] = useState(false);
const [reviewText, setReviewText] = useState("");
  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`http://localhost:3000/api/company/${id}`);
        const data = await res.json();

        if (data.success) {
          const { company, owner } = data.data;
          setCompany(company);
          setOwner(owner);
        } else {
          console.error("API Error:", data.message);
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading company details...</div>
      </div>
    );
  }

  if (!company || !owner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-600 font-bold">Company or owner not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {company.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{company.name}</h1>
              <p className="text-sm text-gray-500">Company Profile</p>
            </div>
          </div>
          <div className="flex gap-2">
            <EditCompanyButton company={company} />
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">About Company</h2>
            <p>{company.description || "No description provided."}</p>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-4">Company Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Company Name</p>
                <p className="text-gray-900">{company.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Tabs */}
        <div>
          <Tabs.Root defaultValue="jobs">
            <Tabs.List>
              <Tabs.Trigger value="jobs">Latest Jobs</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="jobs">
                {company.jobs.length === 0 && <div>No jobs available.</div>}
                {company.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="border rounded p-3 mb-3 bg-white"
                  >
                    <div className="font-bold text-blue-600">{job.title}</div>
                    <div className="text-sm text-gray-700">{job.description}</div>
                    <div className="text-xs text-gray-500">
                      {job.job_type} | {job.employment_type}
                    </div>
                    <div className="text-xs text-gray-500">{job.location}</div>
                    <div className="mt-2 flex gap-2">
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-xs">
                        Delete
                      </button>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </Tabs.Content>

              <Tabs.Content value="reviews">
                <button className="mb-3 bg-green-500 text-white px-3 py-1 rounded text-sm">
                  Add Review
                </button>
                <Dialog.Root open={open} onOpenChange={setOpen}>
  <Dialog.Trigger>
    <button className="mb-3 bg-green-500 text-white px-3 py-1 rounded text-sm">
      Add Review
    </button>
  </Dialog.Trigger>

  <Dialog.Content maxWidth="450px">
    <Dialog.Title>Add a Review</Dialog.Title>
    <Dialog.Description>Share your experience about this company.</Dialog.Description>

    <textarea
      className="w-full border rounded-md mt-4 p-2"
      rows={4}
      placeholder="Write your review here..."
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
    />

    <div className="flex justify-end mt-4 gap-3">
      <Dialog.Close>
        <button className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
      </Dialog.Close>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        onClick={async () => {
          const res = await fetch(`http://localhost:3000/api/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              company_id: id,
              content: reviewText,
              user_id: "USER_ID_HERE", // replace with real user id from context
            }),
          });

          const data = await res.json();
          if (data.success) {
            setOpen(false);
            setReviewText("");

            // Optional: Refresh review list
            setCompany((prev) =>
              prev
                ? {
                    ...prev,
                    review: [...prev.review, { content: reviewText, user: { email: "You" } }],
                  }
                : null
            );
          } else {
            alert(data.message || "Failed to add review");
          }
        }}
      >
        Submit
      </button>
    </div>
  </Dialog.Content>
</Dialog.Root>

                {company.review.length === 0 ? (
                  <div>No reviews yet.</div>
                ) : (
                  company.review.map((rev, index) => (
                    <div
                      key={index}
                      className="border rounded p-3 mb-3 bg-white"
                    >
                      <p className="text-gray-800">{rev.content}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        By: {rev.user?.email}
                      </p>
                    </div>
                  ))
                )}
              </Tabs.Content>
            </Box>
          </Tabs.Root>

          {/* Owner Info */}
          <div className="bg-white mt-6 p-4 border rounded-lg">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-2xl">
                {owner.email[0].toUpperCase()}
              </div>
              <h3 className="mt-2 text-lg font-semibold">Owner</h3>
              <p className="text-sm text-blue-600 uppercase">{owner.role}</p>
            </div>
            <div className="mt-4 text-sm space-y-2">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900">{owner.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Owner ID</p>
                <p className="text-gray-900 font-mono">{owner.id}</p>
              </div>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm">
                Contact Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
