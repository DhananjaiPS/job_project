"use client";

import Footer from "@/app/components/Footer";
import AddCompany from "@/app/components/ui/AddCompany";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full">
        <img
          src="/heropic.jpg"
          alt="Hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative h-full flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
            Build Your Company Profile
          </h1>
          <p className="mt-2 text-lg md:text-xl max-w-xl text-gray-200">
            Add your company details to get started. Showcase your jobs,
            connect with talent, and grow your brand.
          </p>
        </div>
      </div>

      {/* Main Form Section */}
      <main className="flex-grow bg-gray-50 py-10 px-4 md:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-10 flex justify-center items-center flex-col">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Add Company Details
          </h2>
          <AddCompany />
        </div>
      </main>

      {/* Footer */}
      <Footer/>

    </div>
  );
}
