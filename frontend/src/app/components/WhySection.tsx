"use client";

import { Check } from "lucide-react";

const whyUs = [
  "Unlimited meetings with no hidden charges",
  "Fast and reliable HD video conferencing",
  "Secure meetings with privacy protection",
  "Works on mobile, tablet, and desktop",
  "Easy scheduling and calendar integration",
  "Built for teams, students, and businesses",
];

export default function WhyUsSection() {
  return (
    <section className="border-y border-gray-200 bg-white px-5 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
            Why MeetNow?
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            More than just video calls
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((item) => (
            <div
              key={item}
              className="flex h-full items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Check className="h-3.5 w-3.5 shrink-0 text-blue-600" strokeWidth={2.5} />
              </div>
              <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-gray-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
