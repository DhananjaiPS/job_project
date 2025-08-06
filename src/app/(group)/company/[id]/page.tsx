"use client";
import EditCompanyButton from "@/app/components/EditCompanyButton";
import { div } from "framer-motion/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyWithOwnerPage() {
  const params = useParams();
  const id = params.id;

  const [company, setCompany] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [review, setReview] = useState([])
  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`http://localhost:3000/api/company/${id}`);
        const data = await res.json();
        console.log("company details + job list + reviews :", data?.data)
        console.log("company job list :", data.data.company.jobs)
        setJobs(data.data.company.jobs)
        console.log("company job review :", data.data.company.review)
        setReview(data.data.company.review)

        setCompany(data?.data?.company);
        setOwner(data?.data?.owner);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company:", error);
        setLoading(false);
      }
    }
    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company || !owner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Not Found</h2>
          <p className="text-sm text-gray-600">Company or owner data could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-base">
                  {company.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{company.name}</h1>
                <p className="text-sm text-gray-500">Company Profile</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

              <EditCompanyButton company={company} />

              <button className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Company Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">About Company</h2>
              <p className="text-sm sm:text-base text-gray-700">
                {company.description || "Committed to innovation and quality services."}
              </p>
            </div>

            {/* Stats */}


            {/* Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Company Name</p>
                  <p className="text-gray-900 font-medium">{company.name}</p>
                </div>

              </div>
            </div>
          </div>
          <div>
            <p>Company latest jobs :</p>
            {
              jobs.map((item, index) => {
                return (
                  <div key={index}>
                    <div>{item.title}</div>
                    <div>{item.description}</div>
                    <div>{item.job_type}</div>
                    <div>{item.location}</div>

                    <button className="bg-red-500 text-white p-3">Delete</button>
                    <button className="bg-blue-500 text-white p-3">Edit</button>
                  </div>
                )
              })
            }
          </div>
          <div>
            <p>Company latest review :</p>
            <button>add review</button>
            {review.length==0 && 
            <div>
              no reviews yet
            </div>}
            {
              review.length>0 && review.map((item, index) => {
                return (
                  <div key={index}>
                    <div>{item.title}</div>
                    <div>{item.description}</div>
                    <div>{item.job_type}</div>
                    <div>{item.location}</div>

                    <button className="bg-red-500 text-white p-3">Delete</button>
                    <button className="bg-blue-500 text-white p-3">Edit</button>
                  </div>
                )
              })
            }
          </div>
          {/* Owner Sidebar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">
                  {owner.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Company Owner</h3>
              <p className="text-xs text-blue-600 uppercase font-medium mt-1">{owner.role}</p>
            </div>

            <div className="mt-6 text-sm space-y-4">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="text-gray-900 font-medium truncate">{owner.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Owner ID</p>
                <p className="text-gray-900 font-mono text-xs">{owner.id}</p>
              </div>
              <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 text-sm font-medium">
                Contact Owner
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}