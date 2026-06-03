"use client";

import { useState } from "react";
import type { Meeting } from "@/types/meeting";
import {
  Clock,
  Users,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

interface MeetingHistoryProps {
  meetings: Meeting[];
  onDelete: (id: string) => void;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDuration(start?: string, end?: string) {
  if (!start || !end) return null;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remaining = mins % 60;
  return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
}

function MeetingCard({
  meeting,
  onDelete,
}: {
  meeting: Meeting;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isScheduled = !!meeting.scheduledFor && !meeting.startedAt;
  const isLive = !!meeting.startedAt && !meeting.endedAt;
  const isCompleted = !!meeting.startedAt && !!meeting.endedAt;
  const duration = getDuration(meeting.startedAt, meeting.endedAt);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(meeting.meetingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    onDelete(meeting._id);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200">
      {/* Status accent bar */}
      <div
        className={`absolute left-0 top-0 h-full w-1 transition-all duration-300 ${
          isLive
            ? "bg-green-500"
            : isScheduled
            ? "bg-amber-400"
            : "bg-gradient-to-b from-blue-500 to-indigo-500"
        }`}
      />

      <div className="pl-5 pr-4 py-4">
        {/* Top row: title + status badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold text-gray-900 truncate">
              {meeting.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
              <User className="h-3 w-3" />
              <span>{meeting.hostName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isLive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700 ring-1 ring-green-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
            {isScheduled && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <Calendar className="h-3 w-3" />
                Scheduled
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-500 ring-1 ring-gray-200">
                <Check className="h-3 w-3" />
                Ended
              </span>
            )}
          </div>
        </div>

        {/* Info row */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>
              {isScheduled
                ? formatDate(meeting.scheduledFor)
                : formatDate(meeting.startedAt || meeting.createdAt)}
            </span>
          </div>

          {(meeting.startedAt || meeting.scheduledFor) && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span>
                {isScheduled
                  ? formatTime(meeting.scheduledFor)
                  : `${formatTime(meeting.startedAt)}${
                      meeting.endedAt ? ` → ${formatTime(meeting.endedAt)}` : ""
                    }`}
              </span>
            </div>
          )}

          {duration && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-medium text-blue-600">{duration}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-gray-400" />
            <span>
              {meeting.participants.length}{" "}
              {meeting.participants.length === 1
                ? "participant"
                : "participants"}
            </span>
          </div>
        </div>

        {/* Meeting code + actions */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-mono font-medium text-gray-600 ring-1 ring-gray-200 transition-all hover:bg-gray-100 hover:ring-gray-300"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {meeting.meetingCode}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
              title="Delete meeting"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            {meeting.participants.length > 0 && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expanded participants list */}
        {expanded && meeting.participants.length > 0 && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Participants
            </p>
            <div className="space-y-1.5">
              {meeting.participants.map((p, i) => (
                <div
                  key={p._id || i}
                  className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-[10px] font-bold text-white">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {p.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MeetingHistory({
  meetings,
  onDelete,
}: MeetingHistoryProps) {
  if (meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-50">
          <Calendar className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-gray-700">
          No meetings yet
        </h3>
        <p className="mt-1 text-xs text-gray-400 text-center max-w-[240px]">
          Create your first meeting and it will appear here in your history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting._id} meeting={meeting} onDelete={onDelete} />
      ))}
    </div>
  );
}
