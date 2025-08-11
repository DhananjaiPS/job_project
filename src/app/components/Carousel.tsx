"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const images = [
  "/career1.jpg", // Use job-related banner images
  "/career2.jpg",
  "/career3.jpg",
];

const slideData = [
  { text: "Find Your Dream Job", link: "/jobs", btnText: "Browse Jobs" },
  { text: "Hire the Best Talent", link: "/employers", btnText: "Start Hiring" },
  { text: "Post a Job Today", link: "/post-job", btnText: "Post a Job" },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    autorotate();
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, []);

  const autorotate = () => {
    if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    autoIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const goRight = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goLeft = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full max-w-5xl h-[500px] mx-auto overflow-hidden rounded-lg shadow-lg">
      {images.map((img, index) => {
        const { text, link, btnText } = slideData[index];
        return (
          <div
            key={index}
            className={clsx(
              "absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-center px-6",
              index === activeIndex
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            )}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-black/50 p-6 rounded-lg">
              <h2 className="text-4xl font-bold text-white mb-4">{text}</h2>
              <a href={link}>
                <button className="rounded-xl text-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-6 py-3 transition">
                  {btnText}
                </button>
              </a>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={goLeft}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        ◀
      </button>
      <button
        onClick={goRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
      >
        ▶
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "w-3 h-3 rounded-full cursor-pointer transition",
              i === activeIndex ? "bg-yellow-500 scale-110" : "bg-gray-300"
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
