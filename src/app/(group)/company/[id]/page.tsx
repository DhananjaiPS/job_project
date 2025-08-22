"use client";
import EditCompanyButton from "@/app/components/buttons/EditCompanyButton";
import { Tabs, Text, Box, Dialog } from "@radix-ui/themes";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState, useTransition } from "react";
import { UserContext } from "../../layout";
import EditJobForm from "@/app/components/buttons/EditJobform";
import Link from "next/link";
import { FaSpinner } from 'react-icons/fa';

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
  company_id?: string; // ✅ added, since you check user.company_id
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
  const [editingJob, setEditingJob] = useState<Job | null>(null); // ✅ typed correctly
  const { user } = useContext(UserContext) as { user: User }; // ✅ strong typing
  const params = useParams();
  const id = params.id as string;
  const [isPending, startTransition] = useTransition();

  const [company, setCompany] = useState<Company | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [companyJobs, setCompanyJobs] = useState<Job[]>([]); // ✅ type Job[]

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/company/${id}`);
        const data = await res.json();

        if (data.success) {
          const { company, owner } = data.data;
          setCompany(company);
          setCompanyJobs(company?.jobs ?? []);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-center text-gray-600 font-medium">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company || !owner) {
    return <div>Company or owner not found</div>;
  }

  async function handelReview() {
    const object = {
      company_id: id,
      content: reviewText,
      user_id: user?.id,
    };

    const res = await fetch(`/api/company/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(object),
    });

    const data = await res.json();
    if (data.success) {
      setOpen(false);
      setReviewText("");
      setCompany((prev) =>
        prev
          ? {
              ...prev,
              review: [
                ...prev.review,
                {
                  content: reviewText,
                  user: { email: data?.user?.email ?? "Anonymous" }, // ✅ fallback for TS
                },
              ],
            }
          : null
      );
    } else {
      alert(data.message || "Failed to add review");
    }
  }

  async function handelDeleteJob(id: string) {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/company/latestJob`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await res.json();
        if (data.success) {
          alert(data.message);
          setCompanyJobs((prev) => prev.filter((j) => j.id !== data.data.id));
        } else {
          alert(data.message);
        }
      } catch (err) {
        alert(String(err));
      }
    });
  }




  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 gap-3 flex  flex-col sm:flex-row justify-between items-center ">
          <div className="flex items-center justify-center sm:justify-normal sm:flex-row gap-4 w-full">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {company.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{company.name}</h1>
              <p className="text-sm text-gray-500">Company Profile</p>
            </div>
          </div>
          {id == user.company_id &&
            <div className="flex gap-2">


              <EditCompanyButton company={company} />

            </div>}

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:grid-cols-3 gap-6">
        {/* Company Info */}
        <div className="lg:col-span-2 space-y-4  ">
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
        <div className="">
          <Tabs.Root defaultValue="jobs">
            <Tabs.List>
              <Tabs.Trigger value="jobs">Latest Jobs</Tabs.Trigger>
              <Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
            </Tabs.List>

            <Box pt="3">
              <Tabs.Content value="jobs">
                {companyJobs.length === 0 && <div>No jobs available.</div>}
                {companyJobs.map( job  => (
                
                <div key={job.id} className="border p-4 rounded-md">
                  <Link href={`/jobs/${job.id}`}>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p>{job.description}</p>
                  </Link>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setEditingJob(job)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handelDeleteJob(job.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                      disabled={isPending}
                    >
                      Delete
                    </button>
                  </div>
                </div> 
                ))}

                {editingJob && (
                  <EditJobForm
                    job={editingJob}
                    onSave={(newjob) => {
                      setCompanyJobs(prev =>
                        prev.map(j => j?.id === newjob?.id ? newjob : j)
                      );
                      setEditingJob(null);
                    }}
                    onCancel={() => setEditingJob(null)}
                  />
                )}

              </Tabs.Content>

              <Tabs.Content value="reviews">

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
                        onClick={handelReview}
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