"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Users,
  Calendar,
} from "lucide-react";

const slides = [
  {
    title: "Start meetings instantly",
    desc: "Create and join high-quality meetings with just one click from anywhere.",
    Icon: Video,
    ringBg: "bg-blue-100",
    dotBg: "bg-blue-500",
  },
  {
    title: "Collaborate with teams",
    desc: "Work together in real time with seamless communication and screen sharing.",
    Icon: Users,
    ringBg: "bg-green-100",
    dotBg: "bg-green-500",
  },
  {
    title: "Schedule events easily",
    desc: "Plan your meetings ahead and sync directly with your calendar.",
    Icon: Calendar,
    ringBg: "bg-purple-100",
    dotBg: "bg-purple-500",
  },
];

export default function FeatureSlider() {
  const [slide, setSlide] = useState(0);

  const next = () => {
    setSlide((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const cur = slides[slide];

  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <div className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-md">
        
        {/* Icon */}
        <div
          className={`mb-5 flex h-20 w-20 items-center justify-center rounded-full ${cur.ringBg}`}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-md">
            <cur.Icon className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {cur.title}
        </h3>

        {/* Description */}
        <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">
          {cur.desc}
        </p>

        {/* Dots */}
        <div className="mb-4 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slide
                  ? `h-2 w-5 ${cur.dotBg}`
                  : "h-2 w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={next}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}