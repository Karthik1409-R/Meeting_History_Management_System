"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
import MeetingHistory from "@/app/components/MeetingHistory";
import CreateMeetingPanel from "@/app/components/CreateMeetingPanel";
import {
  AuthError,
  type AuthUser,
  clearAuth,
  fetchCurrentUser,
  getStoredUser,
  getToken,
} from "@/lib/auth";
import {
  getMeetings,
  createMeeting,
  deleteMeeting,
  joinMeeting,
  type CreateMeetingPayload,
} from "@/lib/meetings";
import type { Meeting } from "@/types/meeting";
import {
  History,
  Video,
  RefreshCw,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        router.replace("/login");
        return;
      }

      const cachedUser = getStoredUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err) {
        if (err instanceof AuthError && err.status === 401) {
          clearAuth();
          router.replace("/login");
          return;
        }

        if (!cachedUser) {
          clearAuth();
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const loadMeetings = useCallback(async () => {
    try {
      const data = await getMeetings();
      setMeetings(data);
    } catch {
      // silently fail for meetings
    } finally {
      setMeetingsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadMeetings();
    }
  }, [user, loadMeetings]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMeetings();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleCreateMeeting = async (payload: CreateMeetingPayload) => {
    const newMeeting = await createMeeting(payload);
    setMeetings((prev) => [newMeeting, ...prev]);
  };

  const handleJoinMeeting = async (code: string) => {
    const meeting = await joinMeeting(code);
    // If this meeting is not already in our list, add it
    setMeetings((prev) => {
      const exists = prev.find((m) => m._id === meeting._id);
      if (exists) {
        return prev.map((m) => (m._id === meeting._id ? meeting : m));
      }
      return [meeting, ...prev];
    });
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id);
      setMeetings((prev) => prev.filter((m) => m._id !== id));
    } catch {
      // silently fail
    }
  };

  // Stats
  const totalMeetings = meetings.length;
  const totalParticipants = meetings.reduce(
    (acc, m) => acc + m.participants.length,
    0
  );
  const scheduledMeetings = meetings.filter(
    (m) => m.scheduledFor && !m.startedAt
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          <p className="text-sm text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />

      <main className="mx-auto max-w-7xl px-5 py-8 md:px-10">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your meetings and track your history
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMeetings}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Total Meetings
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalParticipants}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Participants
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {scheduledMeetings}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  Upcoming
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout: History (left) + Create/Join (right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* History — takes 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* Section header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                    <History className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Meeting History
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      {totalMeetings}{" "}
                      {totalMeetings === 1 ? "meeting" : "meetings"} recorded
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {meetingsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                      <p className="text-xs text-gray-400">
                        Loading meetings...
                      </p>
                    </div>
                  </div>
                ) : (
                  <MeetingHistory
                    meetings={meetings}
                    onDelete={handleDeleteMeeting}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Create / Join — takes 2 cols */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-6">
              {/* Section header card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
                    <Video className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">
                      Quick Actions
                    </h2>
                    <p className="text-[11px] text-gray-400">
                      Create or join a meeting
                    </p>
                  </div>
                </div>

                <CreateMeetingPanel
                  userName={user.name}
                  onCreateMeeting={handleCreateMeeting}
                  onJoinMeeting={handleJoinMeeting}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
