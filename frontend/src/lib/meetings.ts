import { API_BASE, getToken, AuthError } from "./auth";
import type { Meeting } from "@/types/meeting";

const API_URL = `${API_BASE}/api/meetings`;

async function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) throw new AuthError("No token", 401);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new AuthError(data.message || "Request failed", res.status);
  }

  return data;
}

export async function getMeetings(): Promise<Meeting[]> {
  return authFetch(API_URL);
}

export async function getMeeting(id: string): Promise<Meeting> {
  return authFetch(`${API_URL}/${id}`);
}

export interface CreateMeetingPayload {
  title: string;
  hostName: string;
  scheduledFor?: string;
  participants?: { name: string; email: string }[];
  notes?: string;
}

export async function createMeeting(
  payload: CreateMeetingPayload
): Promise<Meeting> {
  return authFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteMeeting(id: string): Promise<void> {
  await authFetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function joinMeeting(meetingCode: string): Promise<Meeting> {
  return authFetch(`${API_URL}/join`, {
    method: "POST",
    body: JSON.stringify({ meetingCode }),
  });
}
