"use client";

import Link from "next/link";
import { Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-blue-50 via-white to-white p-12 text-center shadow-lg">
        {/* Heading */}
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Ready to meet better?
        </h2>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-gray-500">
          Join thousands of teams who switched to MeetNow.
          It is free to start — no credit card required.
        </p>

        {/* Features */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 text-sm sm:flex-row">
          {[
            "Free forever plan",
            "No download needed",
            "Works on all devices",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 text-gray-700">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={2.5} />
              </div>

              <span>{t}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Get started for free
          </Link>

          <Link
            href="/login"
            className="rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
          >
            Log in to your account
          </Link>
        </div>
      </div>
    </section>
  );
}
