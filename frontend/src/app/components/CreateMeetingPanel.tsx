"use client";

import { useState } from "react";
import {
  Plus,
  Link2,
  Calendar,
  Zap,
  ArrowRight,
  X,
  UserPlus,
  Loader2,
} from "lucide-react";
import type { Meeting } from "@/types/meeting";
import type { CreateMeetingPayload } from "@/lib/meetings";

interface CreateMeetingPanelProps {
  userName: string;
  onCreateMeeting: (payload: CreateMeetingPayload) => Promise<void>;
  onJoinMeeting: (code: string) => Promise<void>;
}

type Mode = "idle" | "create" | "join";
type CreateMode = "now" | "later";

export default function CreateMeetingPanel({
  userName,
  onCreateMeeting,
  onJoinMeeting,
}: CreateMeetingPanelProps) {
  const [mode, setMode] = useState<Mode>("idle");
  const [createMode, setCreateMode] = useState<CreateMode>("now");
  const [title, setTitle] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setTitle("");
    setScheduledDate("");
    setScheduledTime("");
    setJoinCode("");
    setError("");
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Meeting title is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload: CreateMeetingPayload = {
        title: title.trim(),
        hostName: userName,
      };

      if (createMode === "later" && scheduledDate) {
        const dateTime = scheduledTime
          ? `${scheduledDate}T${scheduledTime}`
          : `${scheduledDate}T09:00`;
        payload.scheduledFor = new Date(dateTime).toISOString();
      }

      await onCreateMeeting(payload);
      resetForm();
      setMode("idle");
    } catch {
      setError("Failed to create meeting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setError("Please enter a meeting code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onJoinMeeting(joinCode.trim().toUpperCase());
      resetForm();
      setMode("idle");
    } catch {
      setError("Meeting not found. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Idle state — show action cards
  if (mode === "idle") {
    return (
      <div className="space-y-4">
        {/* Create button */}
        <button
          type="button"
          onClick={() => {
            setMode("create");
            resetForm();
          }}
          className="group w-full rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-110">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Create Meeting
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Start now or schedule for later
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-300 group-hover:text-blue-500 group-hover:translate-x-1" />
          </div>
        </button>

        {/* Join button */}
        <button
          type="button"
          onClick={() => {
            setMode("join");
            resetForm();
          }}
          className="group w-full rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-left transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 hover:border-emerald-200 hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 transition-transform duration-300 group-hover:scale-110">
              <UserPlus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">
                Join Meeting
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Enter a meeting code to join
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-1" />
          </div>
        </button>
      </div>
    );
  }

  // Join state
  if (mode === "join") {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
              <Link2 className="h-4 w-4 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">
              Join a Meeting
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode("idle");
              resetForm();
            }}
            className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Meeting Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-center text-lg tracking-[0.3em] placeholder:text-gray-300 placeholder:tracking-normal placeholder:text-sm placeholder:font-sans focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !joinCode.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Join Meeting
              </>
            )}
          </button>
        </form>
      </div>
    );
  }

  // Create state
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
            <Plus className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900">
            Create Meeting
          </h3>
        </div>
        <button
          type="button"
          onClick={() => {
            setMode("idle");
            resetForm();
          }}
          className="rounded-lg p-1.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Now / Later toggle */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
        <button
          type="button"
          onClick={() => setCreateMode("now")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all duration-200 ${
            createMode === "now"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Zap className="h-3.5 w-3.5" />
          Right Now
        </button>
        <button
          type="button"
          onClick={() => setCreateMode("later")}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition-all duration-200 ${
            createMode === "later"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Later
        </button>
      </div>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Meeting Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sprint Planning"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-300 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            autoFocus
          />
        </div>

        {createMode === "later" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {createMode === "now" ? (
                <Zap className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
              {createMode === "now" ? "Start Meeting" : "Schedule Meeting"}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
