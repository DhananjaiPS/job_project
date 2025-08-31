// app/not-found.tsx
"use client";

export default function NotFoundPage() {
  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col justify-center items-center relative"
      style={{ backgroundImage: "url('/notFound.gif')" }}
    >
      <div className="absolute inset-0  bg-opacity-50" />

      <div className="relative z-10 flex flex-col justify-center items-center text-center mt-10">
        <h1 className="text-6xl font-extrabold text-blue-500 drop-shadow-lg">404</h1>
        <p className="mt-2 text-lg text-blue-500 drop-shadow-md">
          Oops! This page could not be found.
        </p>
        <a
          href="/"
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}
