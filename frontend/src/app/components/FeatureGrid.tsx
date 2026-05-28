"use client";

import {
  Video,
  Shield,
  Users,
  Calendar,
  Monitor,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    Icon: Video,
    label: "HD Video Meetings",
    desc: "Experience crystal clear video and audio quality in every meeting.",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    Icon: Shield,
    label: "Secure & Private",
    desc: "Your meetings are protected with advanced security features.",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    Icon: Users,
    label: "Team Collaboration",
    desc: "Collaborate with teammates seamlessly in real-time.",
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
  {
    Icon: Calendar,
    label: "Smart Scheduling",
    desc: "Plan and organize meetings easily with calendar integration.",
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    Icon: Monitor,
    label: "Screen Sharing",
    desc: "Present your ideas clearly with fast and smooth screen sharing.",
    bg: "bg-pink-100",
    color: "text-pink-600",
  },
  {
    Icon: MessageSquare,
    label: "Live Chat",
    desc: "Communicate instantly during meetings with integrated messaging.",
    bg: "bg-indigo-100",
    color: "text-indigo-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      
      {/* Heading */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Features
        </p>

        <h2 className="mb-3 text-2xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Everything you need to meet
        </h2>

        <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500">
          Powerful, user-friendly tools built for every type of meeting —
          whether you are a student, an employee, or a team lead.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(
          ({ Icon, label, desc, bg, color }) => (
            <div
              key={label}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
            >
              
              {/* Icon */}
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <h3 className="mb-1 text-sm font-semibold text-gray-900">
                  {label}
                </h3>

                <p className="text-xs leading-relaxed text-gray-500">
                  {desc}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}