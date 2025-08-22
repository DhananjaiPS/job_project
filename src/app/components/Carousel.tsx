"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const images = [
  "/hero2.png",
  "/pic2.png",
  "/pic4.png",
];

const slideData = [
  { text: "Find Your Dream Job", link: "/jobs?search=eng&jt=&et=&ms=", btnText: "Browse Jobs" },
  { text: "Hire the Best Talent", link: " /jobs?search=engi&jt=&et=&ms=", btnText: "Start Hiring" },
  { text: "Post a Job Today", link: "/addJobs", btnText: "Post a Job" },
];

export default function Carousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    };
  }, []);

  const startAutoRotate = () => {
    if (autoIntervalRef.current) clearInterval(autoIntervalRef.current);
    autoIntervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
  };

  const goRight = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const goLeft = () =>
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[75vh] sm:h-[500px] mx-auto overflow-hidden bg-white">
      {images.map((img, index) => {
        const { text, link, btnText } = slideData[index];
        return (
          <div
            key={index}
            className={clsx(
              "absolute inset-0 transition-all duration-1000 ease-in-out w-[100%] " ,
              index === activeIndex
                ? "opacity-100 translate-x-0 z-10"
                : "opacity-0 translate-x-full z-0"
            )}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundRepeat:"no-repeat",
              backgroundPosition: "center ",
              width:"100%",
              height:"80vh",
            }}
          >
            {/* Gradient overlay for right side */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg,rgba(255, 255, 255, 0) 0%, rgba(0, 140, 255, 0.79) 84%)",
              }}
            />

            {/* Text content aligned right & slightly lower */}
            <div className="relative z-10 flex flex-col justify-end items-end h-full px-10 md:px-20 pb-16 text-white text-right max-w-lg ml-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                {text}
              </h2>
              <a href={link}>
                <button className="rounded-lg sm:text-lg font-semibold bg-blue-700 text-white hover:bg-blue-500 p-2 sm:px-6 sm:py-3 shadow-lg transition">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-20"
      >
        
      </button>
      <button
        onClick={goRight}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 z-20"
      >
        
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, i) => (
          <div
            key={i}
            onClick={() => setActiveIndex(i)}
            className={clsx(
              "w-3 h-3 rounded-full cursor-pointer transition",
              i === activeIndex ? "bg-blue-400 scale-110" : "bg-white/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}
