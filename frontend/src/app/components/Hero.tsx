"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  Link as LinkIcon,
  Calendar,
  Keyboard,
} from "lucide-react";

interface HeroSectionProps {
  user?: boolean;
}

export default function HeroSection({
  user = false,
}: HeroSectionProps) {
  const [code, setCode] = useState("");
  const [visible] = useState(true);

  return (
    <section
      className={`relative z-30 flex flex-col items-center px-5 pt-16 pb-10 text-center transition-all duration-700 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-5 opacity-0"
      }`}
    >
      {/* Badge */}
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-medium text-blue-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        Free for everyone — No credit card needed
      </div>

      {/* Heading */}
      <h1 className="mb-5 max-w-2xl text-[30px] font-bold leading-[1.15] tracking-tight text-gray-900 md:text-[44px]">
        Video calls and meetings
        <br />
        <span className="text-blue-600">for everyone</span>
      </h1>

      {/* Description */}
      <p className="mb-10 max-w-xl text-sm leading-relaxed text-gray-500 md:text-base">
        Connect, collaborate, and get work done — from anywhere,
        on any device. No downloads. No limits. Just meetings that
        work.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        
        {/* New Meeting Dropdown */}
        <div className="group relative">
          <button
            type="button"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:bg-blue-800"
          >
            <Video className="h-4 w-4" />
            New meeting
          </button>

          {/* Dropdown */}
          <div className="pointer-events-none invisible absolute left-0 top-full z-40 w-72 translate-y-1 pt-2 opacity-0 transition-all duration-150 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              
              {/* Create Meeting */}
              <Link
                href={user ? "/meet" : "/signup"}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 transition-colors hover:bg-gray-100"
              >
                <LinkIcon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  Create a meeting for later
                </span>
              </Link>

              {/* Instant Meeting */}
              <Link
                href={user ? "/meet" : "/signup"}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 transition-colors hover:bg-gray-100"
              >
                <Video className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">
                  Start an instant meeting
                </span>
              </Link>

              {/* Google Calendar */}
              {user ? (
                <a
                  href="https://calendar.google.com/calendar/u/0/r/eventedit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 transition-colors hover:bg-gray-100"
                >
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">
                    Schedule in Google Calendar
                  </span>
                </a>
              ) : (
                <Link
                  href="/signup"
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-gray-800 transition-colors hover:bg-gray-100"
                >
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">
                    Schedule in Google Calendar
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex w-56 items-center gap-2 rounded-full border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm transition-colors duration-200 focus-within:border-blue-500">
          <Keyboard className="h-4 w-4 text-gray-500" />

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter a code or link"
            className="w-full bg-transparent text-xs text-gray-800 placeholder-gray-400 outline-none md:text-sm"
          />
        </div>

        {/* Join Button */}
        <button
          disabled={!code.trim()}
          className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
            code.trim()
              ? "cursor-pointer bg-gray-100 text-blue-600 hover:bg-blue-50"
              : "cursor-not-allowed bg-gray-50 text-gray-300"
          }`}
        >
          Join
        </button>
      </div>
    </section>
  );
}